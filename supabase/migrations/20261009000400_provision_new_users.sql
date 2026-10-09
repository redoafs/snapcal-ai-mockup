-- Provisioning data awal untuk pengguna yang baru mendaftar.
-- Dipanggil otomatis oleh trigger handle_new_user, sehingga layar mockup
-- tidak kosong saat akun baru dibuat (rekomendasi, metrik, aktivitas,
-- satu hari log makanan, langganan gratis, consent, dan bonus token).

create or replace function public.provision_starter_data(target uuid)
returns void
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  meal_morning bigint;
  meal_noon bigint;
begin
  -- hindari duplikasi bila dipanggil ulang
  if exists (select 1 from public.subscriptions where user_id = target) then
    return;
  end if;

  insert into public.subscriptions (user_id, plan, status, price_idr)
  values (target, 'free', 'active', 0);

  insert into public.consents (user_id, policy_version)
  values (target, 'v1.0-2026-10');

  insert into public.portion_recommendations
    (user_id, session_type, target_grams, calorie_target, rationale, sort_order)
  values
    (target, 'Sarapan',      280, 420, 'Porsi ini sekitar 30 persen dari kebutuhan harian agar metabolisme pagi tetap stabil.', 1),
    (target, 'Snack',        150, 180, 'Porsi kecil untuk menjaga kadar gula darah tetap naik perlahan.', 2),
    (target, 'Makan siang',  400, 620, 'Karbohidrat dialokasikan lebih besar karena aktivitas harian Anda sedang tinggi.', 3),
    (target, 'Makan malam',  320, 480, 'Porsi malam dikurangi 20 persen untuk mendukung kualitas tidur dan metabolisme.', 4);

  insert into public.body_metrics (user_id, measured_on, weight_kg, waist_cm)
  values
    (target, current_date,        70.0, 82.0),
    (target, current_date - 7,    70.6, 82.5),
    (target, current_date - 14,   71.0, 83.0);

  insert into public.activities (user_id, logged_at, activity_type, duration_min, intensity)
  values
    (target, now() - interval '10 hours', 'Jalan kaki',   30, 'moderate'),
    (target, now() - interval '3 hours',  'Angkat beban', 40, 'high');

  -- satu hari log makanan contoh
  insert into public.meals (user_id, logged_at, meal_type, detection_source, confidence, photo_label)
  values (target, current_date + time '07:15', 'Sarapan', 'on_device', 0.94, 'Oatmeal dan alpukat')
  returning id into meal_morning;

  insert into public.meals (user_id, logged_at, meal_type, detection_source, confidence, photo_label)
  values (target, current_date + time '12:35', 'Makan siang', 'on_device', 0.88, 'Nasi ayam dan sayur')
  returning id into meal_noon;

  insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
  select meal_morning, id,  60, 0.96, false from public.food_items where name = 'Oatmeal';
  insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
  select meal_morning, id,  40, 0.88, false from public.food_items where name = 'Alpukat';
  insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
  select meal_noon,    id, 120, 0.91, false from public.food_items where name = 'Nasi putih';
  insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
  select meal_noon,    id, 130, 0.89, false from public.food_items where name = 'Ayam bakar';
  insert into public.meal_items (meal_id, food_id, portion_grams, confidence, user_corrected)
  select meal_noon,    id, 100, 0.74, false from public.food_items where name = 'Brokoli';

  -- bonus token selamat datang
  insert into public.token_ledger (user_id, email, delta, reason, note)
  select target, p.email, 5, 'bonus', 'Bonus selamat datang'
  from public.user_profiles p
  where p.user_id = target;
end;
$function$;

-- Fungsi hanya dipanggil oleh trigger (bukan dari klien).
revoke execute on function public.provision_starter_data(uuid) from public, anon, authenticated;

-- Trigger pendaftaran kini juga menyiapkan data awal.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
begin
  insert into public.user_profiles (user_id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (user_id) do nothing;

  perform public.provision_starter_data(new.id);
  return new;
end;
$function$;
