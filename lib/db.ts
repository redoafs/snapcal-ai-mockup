/**
 * Database layer for SnapCal AI mockup.
 * Uses better-sqlite3. The database file is created and seeded on first access.
 */
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'snapcal.db');

let instance = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS user_profiles (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  age           INTEGER,
  gender        TEXT,
  height_cm     REAL,
  weight_kg     REAL,
  activity_level TEXT,
  goal          TEXT,
  diet_pref     TEXT,
  medical_note  TEXT,
  metabolic_score REAL,
  insulin_sensitivity TEXT,
  created_at    TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consents (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  policy_version TEXT NOT NULL,
  granted_at    TEXT DEFAULT CURRENT_TIMESTAMP,
  revoked_at    TEXT
);

CREATE TABLE IF NOT EXISTS food_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '',
  calories      REAL NOT NULL,
  protein       REAL NOT NULL DEFAULT 0,
  carbs         REAL NOT NULL DEFAULT 0,
  fat           REAL NOT NULL DEFAULT 0,
  fiber         REAL NOT NULL DEFAULT 0,
  gi            INTEGER,
  unit_label    TEXT,
  default_grams REAL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS meals (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  logged_at     TEXT NOT NULL,
  meal_type     TEXT NOT NULL,
  detection_source TEXT NOT NULL DEFAULT 'on_device',
  confidence    REAL,
  photo_label   TEXT,
  note          TEXT
);

CREATE TABLE IF NOT EXISTS meal_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  meal_id       INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id       INTEGER NOT NULL REFERENCES food_items(id),
  portion_grams REAL NOT NULL,
  confidence    REAL,
  user_corrected INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS portion_recommendations (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  session_type  TEXT NOT NULL,
  target_grams  REAL NOT NULL,
  calorie_target REAL NOT NULL,
  rationale     TEXT NOT NULL,
  sort_order    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS body_metrics (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  measured_on   TEXT NOT NULL,
  weight_kg     REAL NOT NULL,
  waist_cm      REAL
);

CREATE TABLE IF NOT EXISTS activities (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  logged_at     TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  duration_min  INTEGER NOT NULL,
  intensity     TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  plan          TEXT NOT NULL,
  status        TEXT NOT NULL,
  price_idr     INTEGER NOT NULL,
  renews_at     TEXT
);

CREATE TABLE IF NOT EXISTS app_screens (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT NOT NULL UNIQUE,
  flow_id       TEXT NOT NULL,
  flow_name     TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  fr_refs       TEXT NOT NULL,
  screen_order  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS plan_tiers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  code          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  price_idr     INTEGER NOT NULL,
  tagline       TEXT NOT NULL,
  features      TEXT NOT NULL,
  is_featured   INTEGER DEFAULT 0
);
`;

function seed(db) {
  const already = db.prepare('SELECT COUNT(*) AS c FROM food_items').get();
  if (already.c > 0) return;

  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO user_profiles
       (name,email,age,gender,height_cm,weight_kg,activity_level,goal,diet_pref,medical_note,metabolic_score,insulin_sensitivity)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(
      'Redo Alfiansyah',
      'redo@snapcal.ai',
      31,
      'male',
      172,
      74.5,
      'moderate',
      'Menjaga massa otot dan meningkatkan energi',
      'Toleranomnivora',
      'Insulin resistance ringan, hasil pemeriksaan 2026',
      68,
      'moderate'
    );
    const userId = db.prepare('SELECT id FROM user_profiles').get().id;

    db.prepare(
      'INSERT INTO consents (user_id,policy_version) VALUES (?,?)'
    ).run(userId, 'v1.0-2026-10');

    db.prepare(
      `INSERT INTO body_metrics (user_id,measured_on,weight_kg,waist_cm)
       VALUES (?,?,?,?)`
    ).run(userId, '2026-10-01', 74.5, 84.0);
    db.prepare(
      `INSERT INTO body_metrics (user_id,measured_on,weight_kg,waist_cm)
       VALUES (?,?,?,?)`
    ).run(userId, '2026-09-24', 75.1, 85.0);
    db.prepare(
      `INSERT INTO body_metrics (user_id,measured_on,weight_kg,waist_cm)
       VALUES (?,?,?,?)`
    ).run(userId, '2026-09-17', 75.4, 85.5);

    const foods = [
      ['Nasi putih', 'Karbohidrat', '🍚', 130, 2.6, 28, 0.3, 0.4, 73, 'g', 150],
      ['Ayam bakar', 'Protein', '🍗', 165, 31, 0, 3.6, 0, 0, 'g', 120],
      ['Brokoli', 'Sayur', '🥦', 34, 2.8, 7, 0.4, 2.6, 15, 'g', 100],
      ['Telur rebus', 'Protein', '🥚', 155, 13, 1.1, 11, 0, 0, 'butir', 50],
      ['Sambal ijo', 'Bumbu', '🌶️', 60, 1.5, 8, 2.5, 2.0, 20, 'tbsp', 15],
      ['Tempe goreng', 'Protein', '🍢', 195, 12, 14, 11, 3.5, 30, 'g', 80],
      ['Sayur lodeh', 'Sayur', '🥘', 58, 1.6, 8.5, 1.9, 2.4, 25, 'g', 150],
      ['Es teh manis', 'Minuman', '🧋', 42, 0, 10.5, 0, 0, 78, 'gelas', 250],
      ['Oatmeal', 'Karbohidrat', '🥣', 389, 16.9, 66, 6.9, 10.6, 55, 'g', 60],
      ['Alpukat', 'Buah', '🥑', 160, 2, 8.5, 15, 6.7, 15, 'g', 80],
      ['Ikan salmon', 'Protein', '🐟', 208, 20, 0, 13, 0, 0, 'g', 130],
      ['Roti tawar', 'Karbohidrat', '🍞', 265, 9, 49, 3.2, 2.7, 70, 'g', 40],
      ['Susu oat', 'Minuman', '🥛', 45, 1.2, 6.5, 1.5, 0.8, 52, 'gelas', 250],
      ['Kerupuk', 'Camilan', '🥨', 480, 6, 62, 22, 3, 78, 'g', 20],
    ];
    const insFood = db.prepare(
      `INSERT INTO food_items
       (name,category,emoji,calories,protein,carbs,fat,fiber,gi,unit_label,default_grams)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`
    );
    for (const f of foods) insFood.run(...f);

    const foodId = {};
    for (const r of db.prepare('SELECT id,name FROM food_items').all())
      foodId[r.name] = r.id;

    const meals = [
      ['2026-10-01T07:10:00', 'Sarapan', 'on_device', 0.94, 'Oatmeal dengan blueberry', null],
      ['2026-10-01T12:35:00', 'Makan siang', 'on_device', 0.88, 'Nasi ayam dan lodeh', null],
      ['2026-10-01T15:40:00', 'Snack', 'manual', null, null, 'Input manual karena tidak ada foto'],
      ['2026-10-01T19:05:00', 'Makan malam', 'llm_vision', 0.62, 'Tempe goreng dan sambal', 'Fallback LLM karena ambang confidence rendah'],
    ];
    const insMeal = db.prepare(
      `INSERT INTO meals
       (user_id,logged_at,meal_type,detection_source,confidence,photo_label,note)
       VALUES (?,?,?,?,?,?,?)`
    );
    for (const m of meals)
      insMeal.run(userId, ...m);

    const items = [
      [1, 'Oatmeal', 60, 0.96, 0],
      [1, 'Alpukat', 40, 0.88, 0],
      [2, 'Nasi putih', 120, 0.91, 1],
      [2, 'Ayam bakar', 130, 0.89, 0],
      [2, 'Sayur lodeh', 150, 0.74, 0],
      [3, 'Kerupuk', 25, null, 1],
      [4, 'Tempe goreng', 90, 0.71, 1],
      [4, 'Sambal ijo', 15, 0.66, 0],
      [4, 'Es teh manis', 250, 0.58, 0],
    ];
    const insItem = db.prepare(
      `INSERT INTO meal_items (meal_id,food_id,portion_grams,confidence,user_corrected)
       VALUES (?,?,?,?,?)`
    );
    for (const it of items) insItem.run(it[0], foodId[it[1]], it[2], it[3], it[4]);

    const recs = [
      ['Sarapan', 280, 420, 'Porsi ini sekitar 30 persen dari kebutuhan harian agar metabolisme pagi tetap stabil.', 1],
      ['Snack', 150, 180, 'Porsi kecil untuk menjaga kadar gula darah tetap naik perlahan.', 2],
      ['Makan siang', 400, 620, 'Karbohidrat dialokasikan lebih besar karena aktivitas harian Anda sedang tinggi.', 3],
      ['Makan malam', 320, 480, 'Porsi malam dikurangi 20 persen untuk mendukung kualitas tidur dan metabolisme.', 4],
    ];
    const insRec = db.prepare(
      `INSERT INTO portion_recommendations
       (user_id,session_type,target_grams,calorie_target,rationale,sort_order)
       VALUES (?,?,?,?,?,?)`
    );
    for (const r of recs) insRec.run(userId, ...r);

    const acts = [
      ['2026-10-01T06:45:00', 'Jalan kaki', 35, 'moderate'],
      ['2026-10-01T17:30:00', 'Angkat beban', 45, 'high'],
    ];
    const insAct = db.prepare(
      'INSERT INTO activities (user_id,logged_at,activity_type,duration_min,intensity) VALUES (?,?,?,?,?)'
    );
    for (const a of acts) insAct.run(userId, ...a);

    db.prepare(
      `INSERT INTO subscriptions (user_id,plan,status,price_idr,renews_at)
       VALUES (?,?,?,?,?)`
    ).run(userId, 'free', 'active', 0, null);

    db.prepare(
      `INSERT INTO plan_tiers (code,name,price_idr,tagline,features,is_featured)
       VALUES (?,?,?,?,?,?)`
    ).run(
      'free',
      'Free',
      0,
      'Cukup untuk mencoba alur harian',
      [
        'Scan 5 foto per hari',
        'Rekomendasi porsi harian',
        'Logging makanan dan berat',
        'Database nutrisi offline dasar',
      ].join('|'),
      0
    );
    db.prepare(
      `INSERT INTO plan_tiers (code,name,price_idr,tagline,features,is_featured)
       VALUES (?,?,?,?,?,?)`
    ).run(
      'premium',
      'Premium',
      149000,
      'Untuk komitmen jangka panjang dan pengguna profesional',
      [
        'Scan tanpa batas',
        'Estimasi glycemic response',
        'Coaching dan insight mingguan',
        'Ekspor laporan untuk profesional',
        'Program terstruktur dan badge',
      ].join('|'),
      1
    );

    const screens = [
      ['welcome', 'UF-01', 'Registrasi dan onboarding', 'Selamat datang', 'Titik masuk pengguna, posisi produk dan janji nilai utama.', 'FR-001, FR-004'],
      ['signup', 'UF-01', 'Registrasi dan onboarding', 'Buat akun', 'Formulir email dan kata sandi dengan validasi langsung.', 'FR-001'],
      ['verify', 'UF-01', 'Registrasi dan onboarding', 'Verifikasi email', 'Status verifikasi dan aksi kirim ulang tautan.', 'FR-002'],
      ['onboarding-profile', 'UF-01', 'Registrasi dan onboarding', 'Profil dasar', 'Empat langkah onboarding, langkah 1 usia dan jenis kelamin.', 'FR-003'],
      ['onboarding-body', 'UF-01', 'Registrasi dan onboarding', 'Data tubuh', 'Tinggi, berat, dan tingkat aktivitas sebagai dasar perhitungan.', 'FR-003'],
      ['onboarding-goal', 'UF-01', 'Registrasi dan onboarding', 'Tujuan dan preferensi', 'Pilihan tujuan, preferensi makanan, dan catatan kondisi medis.', 'FR-005'],
      ['consent', 'UF-01', 'Registrasi dan onboarding', 'Izin data', 'Consent eksplisit sebelum data dikirim ke server.', 'FR-004, NFR-013'],
      ['first-result', 'UF-01', 'Registrasi dan onboarding', 'Hasil pertama', 'Ringkasan profil metabolisme awal agar nilai terasa langsung.', 'FR-003, FR-021'],
      ['home', 'UF-04', 'Logging harian', 'Dashboard harian', 'Ringkasan calories, makro, sugar load, dan progres porsi.', 'FR-033'],
      ['scan', 'UF-02', 'Deteksi makanan dari foto', 'Pindai makanan', 'Layar kamera dengan panduan pembingkaian dan validasi kualitas.', 'FR-008, FR-009'],
      ['scan-review', 'UF-02', 'Deteksi makanan dari foto', 'Review hasil deteksi', 'Daftar item dengan confidence, koreksi porsi, dan alasan.', 'FR-016, FR-017'],
      ['portion', 'UF-03', 'Rekomendasi porsi harian', 'Rekomendasi porsi', 'Target porsi per sesi dengan alasan dan visual piring.', 'FR-021, FR-022, FR-024'],
      ['log', 'UF-04', 'Logging harian', 'Tambah catatan', 'Formulir logging cepat untuk makanan, aktivitas, dan berat.', 'FR-030, FR-032'],
      ['trends', 'UF-04', 'Logging harian', 'Tren', 'Grafik mingguan dan bulanan beserta insight otomatis.', 'FR-034, FR-035'],
      ['report', 'UF-07', 'Ekspor laporan', 'Laporan', 'Pratinjau laporan dan aksi ekspor untuk profesional.', 'FR-037'],
      ['coaching', 'UF-05', 'Coaching dan retensi', 'Coaching', 'Check-in harian, streak, dan rekomendasi dinamis.', 'FR-039, FR-040'],
      ['subscribe', 'UF-06', 'Berlangganan premium', 'Pilih paket', 'Perbandingan paket gratis dan premium dengan fitur masing-masing.', 'FR-043'],
      ['privacy', 'UF-08', 'Penghapusan akun dan data', 'Privasi dan data', 'Kontrol data pengguna, ekspor, dan hapus akun.', 'FR-047, FR-048'],
      ['settings', 'UF-08', 'Penghapusan akun dan data', 'Pengaturan', 'Profil, notifikasi, dan preferensi aplikasi.', 'FR-007, FR-036'],
    ];
    const insScr = db.prepare(
      `INSERT INTO app_screens (slug,flow_id,flow_name,title,description,fr_refs,screen_order)
       VALUES (?,?,?,?,?,?,?)`
    );
    screens.forEach((s, i) => insScr.run(s[0], s[1], s[2], s[3], s[4], s[5], i + 1));
  });

  tx();
}

export function getDb() {
  if (instance) return instance;
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  seed(db);
  instance = db;
  return db;
}

export function getUser() {
  const db = getDb();
  return db.prepare('SELECT * FROM user_profiles ORDER BY id LIMIT 1').get();
}

export function getFoods() {
  return getDb().prepare('SELECT * FROM food_items ORDER BY name').all();
}

export function getRecommendations() {
  const db = getDb();
  const u = db.prepare('SELECT id FROM user_profiles ORDER BY id LIMIT 1').get();
  return db
    .prepare(
      'SELECT * FROM portion_recommendations WHERE user_id=? ORDER BY sort_order'
    )
    .all(u.id);
}

export function getTodayMeals() {
  const db = getDb();
  const u = db.prepare('SELECT id FROM user_profiles ORDER BY id LIMIT 1').get();
  const meals = db
    .prepare(
      `SELECT * FROM meals WHERE user_id=? ORDER BY logged_at DESC`
    )
    .all(u.id);
  const itemStmt = db.prepare(
    `SELECT mi.*, f.name, f.emoji, f.calories, f.protein, f.carbs, f.fat, f.fiber,
            f.unit_label
     FROM meal_items mi JOIN food_items f ON f.id = mi.food_id
     WHERE mi.meal_id=?`
  );
  return meals.map((m) => {
    const items = itemStmt.all(m.id).map((it) => ({
      ...it,
      kcal: Math.round((it.calories * it.portion_grams) / 100),
    }));
    const totals = items.reduce(
      (a, i) => ({
        kcal: a.kcal + i.kcal,
        protein: a.protein + (i.protein * i.portion_grams) / 100,
        carbs: a.carbs + (i.carbs * i.portion_grams) / 100,
        fat: a.fat + (i.fat * i.portion_grams) / 100,
        fiber: a.fiber + (i.fiber * i.portion_grams) / 100,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
    return { ...m, items, totals };
  });
}

export function getActivities() {
  const db = getDb();
  const u = db.prepare('SELECT id FROM user_profiles ORDER BY id LIMIT 1').get();
  return db
    .prepare('SELECT * FROM activities WHERE user_id=? ORDER BY logged_at DESC')
    .all(u.id);
}

export function getBodyMetrics() {
  const db = getDb();
  const u = db.prepare('SELECT id FROM user_profiles ORDER BY id LIMIT 1').get();
  return db
    .prepare('SELECT * FROM body_metrics WHERE user_id=? ORDER BY measured_on DESC')
    .all(u.id);
}

export function getPlans() {
  return getDb()
    .prepare('SELECT * FROM plan_tiers ORDER BY price_idr')
    .all()
    .map((p) => ({ ...p, featureList: p.features.split('|') }));
}

export function getScreens() {
  return getDb().prepare('SELECT * FROM app_screens ORDER BY screen_order').all();
}

export function getConsent() {
  const db = getDb();
  return db.prepare('SELECT * FROM consents ORDER BY id DESC LIMIT 1').get();
}

export function getSubscription() {
  const db = getDb();
  const u = db.prepare('SELECT id FROM user_profiles ORDER BY id LIMIT 1').get();
  return db
    .prepare('SELECT * FROM subscriptions WHERE user_id=? ORDER BY id DESC LIMIT 1')
    .get(u.id);
}