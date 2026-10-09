# Panduan Token Lynk.id → Google Sheet → Supabase

Sistem ini memberi pembeli **50 token scan** secara otomatis setiap ada
pembayaran di Lynk.id.

## Alur

```
Pembeli bayar di Lynk.id
        │  (webhook)
        ▼
Google Apps Script (Web App)  ──►  tulis baris ke Google Sheet (log)
        │
        └──►  insert ke Supabase: public.purchases
                     │ (trigger otomatis)
                     ▼
              public.token_ledger  (+50 token untuk email pembeli)
                     │
                     ▼
        Aplikasi membaca saldo dari view public.token_balances
```

- Satu token = satu scan AI.
- Pembelian Rp49.000 = **50 token** (bisa diatur lewat `DEFAULT_TOKENS`).
- Token di-key ke **email pembeli**, sehingga tetap berlaku saat pembeli
  mendaftar akun nanti (trigger `link_tokens_on_signup` menautkan email → akun).

## 1. Supabase (sudah selesai)

Tabel & view yang dibuat (lihat `supabase/migrations/20261009000200_add_tokens_and_purchases.sql`):

| Objek | Fungsi |
| --- | --- |
| `purchases` | Catatan pembelian (email, produk, jumlah, `tokens_granted`, `provider_ref`) |
| `token_ledger` | Mutasi token (`+50` beli, `-1` scan, dll.) |
| `token_balances` (view) | Saldo per email = jumlah `delta` |
| trigger `purchases_grant_tokens` | Otomatis menambah token saat pembelian `paid` |

Uji cepat (lewat SQL editor / MCP):

```sql
insert into public.purchases (email, product, amount_idr, tokens_granted, provider_ref)
values ('pembeli@contoh.com', 'SnapCal AI', 49000, 50, 'TRX-123');
select * from public.token_balances where email = 'pembeli@contoh.com';
-- saldo: 50
```

## 2. Google Apps Script

1. Buka Google Sheet transaksi → menu **Extensions → Apps Script**.
2. Hapus isi `Code.gs`, tempel seluruh isi `integrations/lynk-webhook.gs`.
3. Simpan, lalu buka **Project Settings → Script properties** dan tambahkan:

   | Property | Nilai |
   | --- | --- |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role key dari Supabase → Settings → API (**rahasia**) |
   | `SUPABASE_URL` | `https://tahnkykyvfshcglwbzui.supabase.co` |
   | `SHEET_NAME` | `Sheet1` (sesuaikan) |
   | `SHEET_ID` | (opsional) ID spreadsheet bila tidak terikat |
   | `DEFAULT_TOKENS` | `50` |

4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Salin **Web app URL** (mis. `https://script.google.com/macros/s/AKfy.../exec`).

> Keamanan: `SUPABASE_SERVICE_ROLE_KEY` hanya disimpan di Script Properties
> (tidak terlihat pembeli). Untuk produksi yang lebih rapi, ganti pemanggilan
> langsung REST dengan Supabase Edge Function + secret bersama.

## 3. Menghubungkan webhook Lynk.id

1. Masuk dashboard Lynk.id → pengaturan **Webhook / Integrations**.
2. Tambahkan endpoint URL = **Web app URL** di atas.
3. Pilih event pembayaran sukses (mis. `transaction.success` / `payment.paid`).
4. Simpan. Lynk.id akan memanggil URL tersebut tiap ada pembayaran.

Bila paket Lynk.id Anda belum menyediakan webhook, gunakan email notifikasi
pembelian sebagai pemicu manual (masukkan pembeli ke tab purchases /
`purchases` Supabase) — hasil token tetap sama.

## 4. Uji webhook

Ganti `<URL_WEB_APP>` dan jalankan:

```bash
curl -L -X POST "<URL_WEB_APP>" \
  -H "Content-Type: application/json" \
  -d '{"email":"pembeli@contoh.com","name":"Budi","product":"SnapCal AI","amount":49000,"id":"TRX-123"}'
```

Respons yang diharapkan:

```json
{"ok":true,"email":"pembeli@contoh.com","tokens":50,"sheet":"ditulis","supabase":"tercatat (+50 token)"}
```

Lalu cek: baris bertambah di Sheet, dan `token_balances` bertambah 50.

## 5. Di sisi aplikasi

- Saldo token dibaca dari `token_balances` (atau jumlah `token_ledger`) untuk
  email pengguna.
- Setiap scan AI menulis satu baris `token_ledger` dengan `delta = -1`,
  `reason = 'scan'`.
- Bila saldo 0, arahkan pengguna ke tautan Lynk.id untuk membeli lagi.

## Catatan

- `provider_ref` bersifat unik di `purchases`, dan skrip melewati ref yang sudah
  ada — sehingga webhook yang terkirim ulang tidak menggandakan token.
- Angka 50 token adalah nilai contoh; sesuaikan dengan biaya AI dan target margin.
