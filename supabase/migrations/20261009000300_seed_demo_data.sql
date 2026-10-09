-- Memindahkan data contoh (SQLite lokal) ke Supabase.
-- Termasuk katalog (food_items, app_screens, plan_tiers) dan data pengguna demo.
--
-- Akun demo dipakai aplikasi mockup untuk masuk (RLS tetap aktif):
--   email    : redo@snapcal.ai
--   password : snapcal-demo-2026
-- Ganti lewat env SUPABASE_DEMO_EMAIL / SUPABASE_DEMO_PASSWORD bila perlu.

-- 1. Akun demo di auth.users (password di-hash bcrypt via pgcrypto).
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated', 'authenticated', 'redo@snapcal.ai',
  extensions.crypt('snapcal-demo-2026', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Redo Alfiansyah"}'::jsonb,
  '', '', '', ''
) on conflict (id) do nothing;

-- 2. Identitas email agar login password bekerja.
insert into auth.identities (
  provider_id, user_id, identity_data, provider,
  last_sign_in_at, created_at, updated_at
) values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"redo@snapcal.ai","email_verified":true}'::jsonb,
  'email', now(), now(), now()
) on conflict (provider_id, provider) do nothing;

-- 3. Profil pengguna demo (trigger handle_new_user sudah membuat baris dasar).
insert into public.user_profiles (
  user_id, name, email, age, gender, height_cm, weight_kg, activity_level,
  goal, diet_pref, medical_note, metabolic_score, insulin_sensitivity
) values (
  '00000000-0000-4000-8000-000000000001', 'Redo Alfiansyah', 'redo@snapcal.ai',
  31, 'male', 172, 74.5, 'moderate',
  'Menjaga massa otot dan meningkatkan energi', 'Toleranomnivora',
  'Insulin resistance ringan, hasil pemeriksaan 2026', 68, 'moderate'
) on conflict (user_id) do update set
  name = excluded.name, age = excluded.age, gender = excluded.gender,
  height_cm = excluded.height_cm, weight_kg = excluded.weight_kg,
  activity_level = excluded.activity_level, goal = excluded.goal,
  diet_pref = excluded.diet_pref, medical_note = excluded.medical_note,
  metabolic_score = excluded.metabolic_score,
  insulin_sensitivity = excluded.insulin_sensitivity;

-- 4. Bersihkan data turunan demo & katalog agar migrasi idempotent.
delete from public.meal_items
  where meal_id in (select id from public.meals
                    where user_id = '00000000-0000-4000-8000-000000000001');
delete from public.meals                 where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.consents              where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.portion_recommendations where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.body_metrics          where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.activities            where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.subscriptions         where user_id = '00000000-0000-4000-8000-000000000001';
delete from public.token_ledger          where lower(email) = 'redo@snapcal.ai';
delete from public.meal_items;
delete from public.food_items;

-- 5. Katalog makanan.
insert into public.food_items
  (name, category, emoji, calories, protein, carbs, fat, fiber, gi, unit_label, default_grams)
values
  ('Nasi putih',   'Karbohidrat', '🍚', 130, 2.6,  28,   0.3,  0.4,  73, 'g',     150),
  ('Ayam bakar',   'Protein',     '🍗', 165, 31,   0,    3.6,  0,    0,  'g',     120),
  ('Brokoli',      'Sayur',       '🥦', 34,  2.8,  7,    0.4,  2.6,  15, 'g',     100),
  ('Telur rebus',  'Protein',     '🥚', 155, 13,   1.1,  11,   0,    0,  'butir', 50),
  ('Sambal ijo',   'Bumbu',       '🌶️', 60,  1.5,  8,    2.5,  2.0,  20, 'tbsp',  15),
  ('Tempe goreng', 'Protein',     '🍢', 195, 12,   14,   11,   3.5,  30, 'g',     80),
  ('Sayur lodeh',  'Sayur',       '🥘', 58,  1.6,  8.5,  1.9,  2.4,  25, 'g',     150),
  ('Es teh manis', 'Minuman',     '🧋', 42,  0,    10.5, 0,    0,    78, 'gelas', 250),
  ('Oatmeal',      'Karbohidrat', '🥣', 389, 16.9, 66,   6.9,  10.6, 55, 'g',     60),
  ('Alpukat',      'Buah',        '🥑', 160, 2,    8.5,  15,   6.7,  15, 'g',     80),
  ('Ikan salmon',  'Protein',     '🐟', 208, 20,   0,    13,   0,    0,  'g',     130),
  ('Roti tawar',   'Karbohidrat', '🍞', 265, 9,    49,   3.2,  2.7,  70, 'g',     40),
  ('Susu oat',     'Minuman',     '🥛', 45,  1.2,  6.5,  1.5,  0.8,  52, 'gelas', 250),
  ('Kerupuk',      'Camilan',     '🥨', 480, 6,    62,   22,   3,    78, 'g',     20);

-- 6. Makanan hari ini (log).
insert into public.meals
  (user_id, logged_at, meal_type, detection_source, confidence, photo_label, note)
values
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T07:10:00+07', 'Sarapan',      'on_device', 0.94, 'Oatmeal dengan blueberry', null),
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T12:35:00+07', 'Makan siang',  'on_device', 0.88, 'Nasi ayam dan lodeh', null),
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T15:40:00+07', 'Snack',        'manual',    null, null, 'Input manual karena tidak ada foto'),
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T19:05:00+07', 'Makan malam',  'llm_vision', 0.62, 'Tempe goreng dan sambal', 'Fallback LLM karena ambang confidence rendah');

-- 7. Item per makanan (join berdasarkan jam & nama makanan).
insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
select m.id, f.id, v.portion, v.conf, v.corrected
from (values
  ('2026-10-01T07:10:00+07'::timestamptz, 'Sarapan',     'Oatmeal',      60::numeric,  0.96::numeric, false),
  ('2026-10-01T07:10:00+07'::timestamptz, 'Sarapan',     'Alpukat',      40::numeric,  0.88::numeric, false),
  ('2026-10-01T12:35:00+07'::timestamptz, 'Makan siang', 'Nasi putih',   120::numeric, 0.91::numeric, true),
  ('2026-10-01T12:35:00+07'::timestamptz, 'Makan siang', 'Ayam bakar',   130::numeric, 0.89::numeric, false),
  ('2026-10-01T12:35:00+07'::timestamptz, 'Makan siang', 'Sayur lodeh',  150::numeric, 0.74::numeric, false),
  ('2026-10-01T15:40:00+07'::timestamptz, 'Snack',       'Kerupuk',      25::numeric,  null,          true),
  ('2026-10-01T19:05:00+07'::timestamptz, 'Makan malam', 'Tempe goreng', 90::numeric,  0.71::numeric, true),
  ('2026-10-01T19:05:00+07'::timestamptz, 'Makan malam', 'Sambal ijo',   15::numeric,  0.66::numeric, false),
  ('2026-10-01T19:05:00+07'::timestamptz, 'Makan malam', 'Es teh manis', 250::numeric, 0.58::numeric, false)
) as v(logged_at, meal_type, food_name, portion, conf, corrected)
join public.meals m
  on m.user_id = '00000000-0000-4000-8000-000000000001'
 and m.logged_at = v.logged_at
 and m.meal_type = v.meal_type
join public.food_items f on f.name = v.food_name;

-- 8. Persetujuan data.
insert into public.consents (user_id, policy_version, granted_at)
values ('00000000-0000-4000-8000-000000000001', 'v1.0-2026-10', now());

-- 9. Rekomendasi porsi.
insert into public.portion_recommendations
  (user_id, session_type, target_grams, calorie_target, rationale, sort_order)
values
  ('00000000-0000-4000-8000-000000000001', 'Sarapan',     280, 420, 'Porsi ini sekitar 30 persen dari kebutuhan harian agar metabolisme pagi tetap stabil.', 1),
  ('00000000-0000-4000-8000-000000000001', 'Snack',       150, 180, 'Porsi kecil untuk menjaga kadar gula darah tetap naik perlahan.', 2),
  ('00000000-0000-4000-8000-000000000001', 'Makan siang', 400, 620, 'Karbohidrat dialokasikan lebih besar karena aktivitas harian Anda sedang tinggi.', 3),
  ('00000000-0000-4000-8000-000000000001', 'Makan malam', 320, 480, 'Porsi malam dikurangi 20 persen untuk mendukung kualitas tidur dan metabolisme.', 4);

-- 10. Metrik tubuh.
insert into public.body_metrics (user_id, measured_on, weight_kg, waist_cm)
values
  ('00000000-0000-4000-8000-000000000001', '2026-10-01', 74.5, 84.0),
  ('00000000-0000-4000-8000-000000000001', '2026-09-24', 75.1, 85.0),
  ('00000000-0000-4000-8000-000000000001', '2026-09-17', 75.4, 85.5);

-- 11. Aktivitas.
insert into public.activities (user_id, logged_at, activity_type, duration_min, intensity)
values
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T06:45:00+07', 'Jalan kaki', 35, 'moderate'),
  ('00000000-0000-4000-8000-000000000001', '2026-10-01T17:30:00+07', 'Angkat beban', 45, 'high');

-- 12. Langganan (paket gratis).
insert into public.subscriptions (user_id, plan, status, price_idr, renews_at)
values ('00000000-0000-4000-8000-000000000001', 'free', 'active', 0, null);

-- 13. Buku besar token (pembelian + pemakaian scan).
insert into public.token_ledger (user_id, email, delta, reason, provider, provider_ref, note, created_at)
values
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai',  50, 'purchase', 'lynk', 'DEMO-PURCHASE-001', 'Pembelian Pro via Lynk.id', '2026-10-02T09:12:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan sarapan',     '2026-10-06T07:20:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan makan siang', '2026-10-06T12:40:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan makan malam', '2026-10-06T19:05:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan sarapan',     '2026-10-05T07:10:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan makan siang', '2026-10-05T12:50:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan sarapan',     '2026-10-04T08:00:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan makan siang', '2026-10-04T13:15:00+07'),
  ('00000000-0000-4000-8000-000000000001', 'redo@snapcal.ai', -1, 'scan', 'app', null, 'Scan sarapan',     '2026-10-03T07:30:00+07');

-- 14. Layar aplikasi (katalog).
insert into public.app_screens
  (slug, flow_id, flow_name, title, description, fr_refs, screen_order)
values
  ('welcome','UF-01','Registrasi dan onboarding','Selamat datang','Titik masuk pengguna, posisi produk dan janji nilai utama.','{FR-001,FR-004}',1),
  ('signup','UF-01','Registrasi dan onboarding','Buat akun','Formulir email dan kata sandi dengan validasi langsung.','{FR-001}',2),
  ('verify','UF-01','Registrasi dan onboarding','Verifikasi email','Status verifikasi dan aksi kirim ulang tautan.','{FR-002}',3),
  ('onboarding-profile','UF-01','Registrasi dan onboarding','Profil dasar','Empat langkah onboarding, langkah 1 usia dan jenis kelamin.','{FR-003}',4),
  ('onboarding-body','UF-01','Registrasi dan onboarding','Data tubuh','Tinggi, berat, dan tingkat aktivitas sebagai dasar perhitungan.','{FR-003}',5),
  ('onboarding-goal','UF-01','Registrasi dan onboarding','Tujuan dan preferensi','Pilihan tujuan, preferensi makanan, dan catatan kondisi medis.','{FR-005}',6),
  ('consent','UF-01','Registrasi dan onboarding','Izin data','Consent eksplisit sebelum data dikirim ke server.','{FR-004,NFR-013}',7),
  ('first-result','UF-01','Registrasi dan onboarding','Hasil pertama','Ringkasan profil metabolisme awal agar nilai terasa langsung.','{FR-003,FR-021}',8),
  ('home','UF-04','Logging harian','Dashboard harian','Ringkasan calories, makro, sugar load, dan progres porsi.','{FR-033}',9),
  ('scan','UF-02','Deteksi makanan dari foto','Pindai makanan','Layar kamera dengan panduan pembingkaian dan validasi kualitas.','{FR-008,FR-009}',10),
  ('scan-review','UF-02','Deteksi makanan dari foto','Review hasil deteksi','Daftar item dengan confidence, koreksi porsi, dan alasan.','{FR-016,FR-017}',11),
  ('portion','UF-03','Rekomendasi porsi harian','Rekomendasi porsi','Target porsi per sesi dengan alasan dan visual piring.','{FR-021,FR-022,FR-024}',12),
  ('log','UF-04','Logging harian','Tambah catatan','Formulir logging cepat untuk makanan, aktivitas, dan berat.','{FR-030,FR-032}',13),
  ('trends','UF-04','Logging harian','Tren','Grafik mingguan dan bulanan beserta insight otomatis.','{FR-034,FR-035}',14),
  ('report','UF-07','Ekspor laporan','Laporan','Pratinjau laporan dan aksi ekspor untuk profesional.','{FR-037}',15),
  ('coaching','UF-05','Coaching dan retensi','Coaching','Check-in harian, streak, dan rekomendasi dinamis.','{FR-039,FR-040}',16),
  ('subscribe','UF-06','Berlangganan premium','Pilih paket','Perbandingan paket gratis dan premium dengan fitur masing-masing.','{FR-043}',17),
  ('privacy','UF-08','Penghapusan akun dan data','Privasi dan data','Kontrol data pengguna, ekspor, dan hapus akun.','{FR-047,FR-048}',18),
  ('settings','UF-08','Penghapusan akun dan data','Pengaturan','Profil, notifikasi, dan preferensi aplikasi.','{FR-007,FR-036}',19)
on conflict (slug) do update set
  flow_id = excluded.flow_id, flow_name = excluded.flow_name,
  title = excluded.title, description = excluded.description,
  fr_refs = excluded.fr_refs, screen_order = excluded.screen_order;

-- 15. Paket langganan.
insert into public.plan_tiers (code, name, price_idr, tagline, features, is_featured)
values
  ('free','Free',0,'Cukup untuk mencoba alur harian',
   '{5 token scan per hari,Rekomendasi porsi harian,Logging makanan dan berat,Database nutrisi offline dasar}', false),
  ('pro_monthly','Pro Bulanan',49000,'Dapat 50 token scan, ditagih tiap bulan',
   '{+50 token scan (1 token = 1 scan AI),Estimasi glycemic response,Coaching dan insight mingguan,Ekspor laporan untuk profesional,Program terstruktur dan badge}', false),
  ('pro_yearly','Pro Tahunan',399000,'Bayar sekali setahun, lebih hemat',
   '{+50 token scan setiap pembelian,Hemat 32% (setara Rp33.250/bulan),Prioritas dukungan pelanggan,Badge pendukung awal}', true),
  ('pro_lifetime','Pro Lifetime',899000,'Bayar sekali, akses selamanya (kuota terbatas)',
   '{+50 token scan setiap pembelian,Akses selamanya tanpa perpanjangan,Kuota terbatas 100 pengguna pertama}', false)
on conflict (code) do update set
  name = excluded.name, price_idr = excluded.price_idr, tagline = excluded.tagline,
  features = excluded.features, is_featured = excluded.is_featured;
