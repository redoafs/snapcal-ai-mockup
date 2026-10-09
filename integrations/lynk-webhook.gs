/**
 * SnapCal AI — penerima webhook Lynk.id.
 *
 * Alur:
 *   1) Lynk.id memanggil Web App ini setiap ada pembayaran.
 *   2) Skrip menambah satu baris ke Google Sheet (log transaksi).
 *   3) Skrip mencatat pembelian ke tabel public.purchases di Supabase.
 *   4) Trigger Supabase otomatis memberi +50 token ke email pembeli.
 *
 * Cara pasang & isi Script Properties: lihat
 * docs/PANDUAN_TOKEN_LYNKID.md.
 *
 * Script Properties yang dipakai:
 *   SUPABASE_URL                (default: https://tahnkykyvfshcglwbzui.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY   (rahasia — dari Supabase > Settings > API)
 *   SHEET_NAME                  (default: Sheet1)
 *   SHEET_ID                    (opsional; kosong = spreadsheet yang terikat)
 *   DEFAULT_TOKENS              (default: 50)
 */

var DEFAULT_SUPABASE_URL = 'https://tahnkykyvfshcglwbzui.supabase.co';
var HEADERS = ['Tanggal', 'Nama', 'Email', 'No. HP', 'Produk', 'Jumlah (Rp)', 'Token', 'Referensi', 'Status'];
var REF_COL = 8; // kolom "Referensi" (1-based)

function doGet() {
  return jsonOut({ ok: true, service: 'snapcal-lynk-webhook' });
}

function doPost(e) {
  try {
    var raw = parsePayload(e);
    var row = normalize(raw);

    if (!row.email) {
      return jsonOut({ ok: false, error: 'email tidak ditemukan pada payload' });
    }

    var duplicate = isDuplicate(row.ref);
    var sheetResult = duplicate ? 'dilewati (ref sudah ada)' : appendToSheet(row);
    var supaResult = sendToSupabase(row);

    return jsonOut({
      ok: true,
      email: row.email,
      tokens: row.tokens,
      sheet: sheetResult,
      supabase: supaResult,
    });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

/* ------------------------------------------------------------------ payload */

function parsePayload(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    var body = e.postData.contents;
    try {
      return JSON.parse(body);
    } catch (ignore) {
      // fallback: form-encoded
    }
    var params = {};
    body.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    });
    return params;
  }
  return e.parameter || {};
}

function pick(obj, keys) {
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') return obj[k];
  }
  return '';
}

function normalize(o) {
  var data = (o && o.data) ? o.data : o; // sebagian webhook membungkus di { data: {...} }
  var tokens = parseInt(pick(data, ['tokens', 'token', 'tokens_granted']), 10);
  if (isNaN(tokens) || tokens <= 0) {
    tokens = parseInt(prop('DEFAULT_TOKENS', '50'), 10);
  }
  var amount = String(pick(data, ['amount', 'total', 'total_price', 'price', 'amount_idr']))
    .replace(/[^0-9]/g, '');
  return {
    date: pick(data, ['paid_at', 'created_at', 'date', 'timestamp']) || new Date().toISOString(),
    name: pick(data, ['name', 'buyer_name', 'customer_name', 'buyerName']),
    email: String(pick(data, ['email', 'buyer_email', 'customer_email', 'buyerEmail'])).trim(),
    phone: String(pick(data, ['phone', 'buyer_phone', 'phone_number', 'whatsapp', 'buyer_phone_number'])).trim(),
    product: pick(data, ['product', 'product_name', 'productName', 'item', 'item_name']),
    amount: amount ? parseInt(amount, 10) : 0,
    tokens: tokens,
    ref: String(pick(data, ['id', 'transaction_id', 'trx_id', 'reference', 'invoice', 'order_id', 'ref'])).trim(),
    status: pick(data, ['status', 'payment_status']) || 'paid',
  };
}

/* -------------------------------------------------------------------- sheet */

function getSheet() {
  var id = prop('SHEET_ID', '');
  var ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Spreadsheet tidak ditemukan (isi Script Property SHEET_ID).');
  var name = prop('SHEET_NAME', 'Sheet1');
  var sheet = ss.getSheetByName(name) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isDuplicate(ref) {
  if (!ref) return false;
  var sheet = getSheet();
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var values = sheet.getRange(2, REF_COL, last - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === ref) return true;
  }
  return false;
}

function appendToSheet(row) {
  getSheet().appendRow([
    row.date,
    row.name,
    row.email,
    row.phone,
    row.product,
    row.amount,
    row.tokens,
    row.ref,
    row.status,
  ]);
  return 'ditulis';
}

/* ----------------------------------------------------------------- supabase */

function sendToSupabase(row) {
  var key = prop('SUPABASE_SERVICE_ROLE_KEY', '');
  if (!key) return 'dilewati (SUPABASE_SERVICE_ROLE_KEY belum diisi)';

  var url = prop('SUPABASE_URL', DEFAULT_SUPABASE_URL) + '/rest/v1/purchases';
  var payload = {
    email: row.email,
    name: row.name || null,
    phone: row.phone || null,
    product: row.product || 'SnapCal AI',
    amount_idr: row.amount || 0,
    tokens_granted: row.tokens,
    provider: 'lynk',
    provider_ref: row.ref || null,
    status: row.status === 'paid' ? 'paid' : 'pending',
  };

  var resp = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
      // Hindari error/duplikat bila webhook dikirim ulang.
      Prefer: 'return=minimal,resolution=ignore-duplicates',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = resp.getResponseCode();
  if (code >= 200 && code < 300) return 'tercatat (+' + row.tokens + ' token)';
  return 'gagal (HTTP ' + code + '): ' + resp.getContentText();
}

/* -------------------------------------------------------------------- util */

function prop(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return (v === null || v === '') ? fallback : v;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
