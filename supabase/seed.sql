-- ==============================================================================
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — SEED DATA
-- ==============================================================================

-- 1. Administrative Unit Types
INSERT INTO public.administrative_unit_types (id, name_en, name_bn, hierarchy_level) VALUES
('division', 'Division', 'বিভাগ', 1),
('district', 'District (Zilla)', 'জেলা', 2),
('upazila', 'Upazila (Sub-district)', 'উপজেলা', 3),
('metropolitan_thana', 'Metropolitan Thana', 'মেট্রোপলিটন থানা', 3),
('city_corporation', 'City Corporation', 'সিটি কর্পোরেশন', 3),
('municipality', 'Municipality (Pourashava)', 'পৌরসভা', 3),
('union', 'Union Parishad', 'ইউনিয়ন পরিষদ', 4),
('ward', 'Ward', 'ওয়ার্ড', 4)
ON CONFLICT (id) DO NOTHING;

-- 2. Role Definitions
INSERT INTO public.role_definitions (id, display_name_en, display_name_bn, description, badge_color, rank_level, is_administrative) VALUES
('super_admin', 'Super Administrator', 'প্রধান প্রশাসক', 'Full platform administrative oversight', '#580F1A', 100, true),
('co_super_admin', 'Co-Super Administrator (Equal Power)', 'কো-সুপার প্রশাসক (সমান নির্বাহী ক্ষমতা)', 'Full nationwide equal administrative authority', '#580F1A', 100, true),
('division_admin', 'Division Administrator', 'বিভাগীয় প্রশাসক', 'Regional administrative coordinator', '#0D3B66', 80, true),
('district_admin', 'District Administrator', 'জেলা সমন্বয়ক ও প্রশাসক', 'District operational coordinator', '#006A4E', 70, true),
('upazila_admin', 'Upazila Administrator', 'উপজেলা প্রশাসক', 'Sub-district operational lead', '#D84A1B', 60, true),
('thana_admin', 'Metropolitan Thana Admin', 'মেট্রোপলিটন থানা প্রশাসক', 'Metropolitan urban coordinator', '#008080', 60, true),
('city_corp_admin', 'City Corporation Admin', 'সিটি কর্পোরেশন প্রশাসক', 'Megacity municipal administrative lead', '#1B4931', 60, true),
('municipality_admin', 'Municipality Administrator', 'পৌরসভা প্রশাসক', 'Pourashava town coordinator', '#1D3557', 50, true),
('union_admin', 'Union Administrator', 'ইউনিয়ন সমন্বয়ক', 'Grassroots rural coordinator', '#4A154B', 40, true),
('ward_admin', 'Ward Administrator', 'ওয়ার্ড প্রতিনিধি', 'Local ward coordinator', '#9B111E', 30, true),
('hospital_admin', 'Hospital Administrator', 'হাসপাতাল প্রশাসক', 'Hospital account manager', '#1565C0', 50, false),
('hospital_staff', 'Hospital Clinical Staff', 'হাসপাতাল প্রতিনিধি', 'Clinical blood bank verifier', '#1565C0', 35, false),
('verification_officer', 'Donation Verification Officer', 'রক্তদান যাচাইকরণ কর্মকর্তা', 'Independent donation validator', '#2E7D32', 55, false),
('moderator', 'Community Moderator', 'প্ল্যাটফর্ম মডারেটর', 'Trust, safety and feedback moderator', '#E69A17', 45, false),
('campaign_manager', 'Campaign Organizer', 'ক্যাম্পেইন সমন্বয়ক', 'Blood drive coordinator', '#D84A1B', 35, false),
('volunteer', 'Registered Volunteer', 'স্বেচ্ছাসেবক', 'Grassroots platform volunteer', '#006A4E', 20, false),
('donor', 'Voluntary Blood Donor', 'স্বেচ্ছাসেবী রক্তদাতা', 'Verified blood donor', '#C8102E', 10, false),
('requester', 'Blood Requester', 'রক্ত গ্রহীতা / আবেদনকারী', 'Patient family member or requester', '#707070', 10, false)
ON CONFLICT (id) DO NOTHING;

-- 3. ID Card Templates
INSERT INTO public.id_card_templates (id, role_id, primary_color, secondary_color, accent_color, title_en, title_bn, is_active) VALUES
('super_admin_card', 'super_admin', '#580F1A', '#30080E', '#D4AF37', 'Super Administrator Card', 'প্রধান প্রশাসক পরিচয়পত্র', true),
('co_super_admin_card', 'co_super_admin', '#580F1A', '#30080E', '#D4AF37', 'Co-Super Administrator Card', 'কো-সুপার প্রশাসক পরিচয়পত্র', true),
('division_admin_card', 'division_admin', '#0D3B66', '#062038', '#F4D35E', 'Division Administrator Card', 'বিভাগীয় প্রশাসক পরিচয়পত্র', true),
('district_admin_card', 'district_admin', '#006A4E', '#004532', '#E8F5E9', 'District Administrator Card', 'জেলা সমন্বয়ক পরিচয়পত্র', true),
('upazila_admin_card', 'upazila_admin', '#D84A1B', '#93300E', '#FFF3E0', 'Upazila Administrator Card', 'উপজেলা প্রশাসক পরিচয়পত্র', true),
('thana_admin_card', 'thana_admin', '#008080', '#004C4C', '#E0F2F1', 'Thana Administrator Card', 'থানা প্রশাসক পরিচয়পত্র', true),
('city_corp_card', 'city_corp_admin', '#1B4931', '#0C2618', '#D4AF37', 'City Corporation Admin Card', 'সিটি কর্পোরেশন প্রশাসক কার্ড', true),
('municipality_card', 'municipality_admin', '#1D3557', '#0E1D33', '#A8DADC', 'Municipality Administrator Card', 'পৌরসভা প্রশাসক পরিচয়পত্র', true),
('union_card', 'union_admin', '#4A154B', '#2B082C', '#F3E5F5', 'Union Administrator Card', 'ইউনিয়ন সমন্বয়ক পরিচয়পত্র', true),
('ward_card', 'ward_admin', '#9B111E', '#580A11', '#FFEBEE', 'Ward Administrator Card', 'ওয়ার্ড প্রতিনিধি পরিচয়পত্র', true),
('donor_card', 'donor', '#C8102E', '#8E0B20', '#FFF5F6', 'Voluntary Donor Card', 'স্বেচ্ছাসেবী রক্তদাতা কার্ড', true),
('volunteer_card', 'volunteer', '#006A4E', '#004734', '#E8F5E9', 'Volunteer Card', 'স্বেচ্ছাসেবক পরিচয়পত্র', true),
('hospital_staff_card', 'hospital_staff', '#1565C0', '#0B3F7A', '#E3F2FD', 'Hospital Clinical Card', 'হাসপাতাল প্রতিনিধি কার্ড', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Achievement Definitions
INSERT INTO public.achievement_definitions (id, title_en, title_bn, description_en, description_bn, category, required_count, badge_color, is_active) VALUES
('first_drop', 'First Drop', 'প্রথম বিন্দু', 'Completed your first verified whole blood donation.', 'আপনার প্রথম সফল ও যাচাইকৃত রক্তদান সম্পন্ন করেছেন।', 'blood_donation', 1, '#C8102E', true),
('life_saver', 'Life Saver', 'জীবন রক্ষক', 'Completed 5 verified blood donations.', '৫ বার রক্তদান করে জীবন রক্ষায় গৌরবময় অবদান রেখেছেন।', 'blood_donation', 5, '#1565C0', true),
('hero_donor', 'Hero Donor', 'বীর রক্তদাতা', 'Completed 10 verified blood donations.', '১০ বার রক্তদান করে মানবতার বিরল দৃষ্টান্ত স্থাপন করেছেন।', 'blood_donation', 10, '#D4AF37', true),
('guardian_of_life', 'Guardian of Life', 'জীবনের অভিভাবক', 'Completed 25 verified blood donations.', '২৫ বার রক্তদান করে দেশের অন্যতম শ্রেষ্ঠ জীবন রক্ষক হিসেবে স্বীকৃতি।', 'blood_donation', 25, '#580F1A', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Donation Types
INSERT INTO public.donation_types (id, name_en, name_bn, cooldown_months, cooldown_days_min) VALUES
('whole_blood', 'Whole Blood (পূর্ণাঙ্গ রক্ত)', 'পূর্ণাঙ্গ রক্ত', 3, 90),
('platelets', 'Platelets (অণুচক্রিকা - এফেরেসিস)', 'অণুচক্রিকা (প্লেটলেট)', 0, 14),
('plasma', 'Plasma (প্লাজমা)', 'প্লাজমা', 1, 28)
ON CONFLICT (id) DO NOTHING;

-- 6. Bangladesh Divisions
INSERT INTO public.locations (id, code, unit_type, parent_id, name_en, name_bn, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'BD-DHA', 'division', NULL, 'Dhaka', 'ঢাকা', true),
('a0000000-0000-0000-0000-000000000002', 'BD-CTG', 'division', NULL, 'Chattogram', 'চট্টগ্রাম', true),
('a0000000-0000-0000-0000-000000000003', 'BD-RAJ', 'division', NULL, 'Rajshahi', 'রাজশাহী', true),
('a0000000-0000-0000-0000-000000000004', 'BD-KHU', 'division', NULL, 'Khulna', 'খুলনা', true),
('a0000000-0000-0000-0000-000000000005', 'BD-BAR', 'division', NULL, 'Barishal', 'বরিশাল', true),
('a0000000-0000-0000-0000-000000000006', 'BD-SYL', 'division', NULL, 'Sylhet', 'সিলেট', true),
('a0000000-0000-0000-0000-000000000007', 'BD-RAN', 'division', NULL, 'Rangpur', 'রংপুর', true),
('a0000000-0000-0000-0000-000000000008', 'BD-MYM', 'division', NULL, 'Mymensingh', 'ময়মনসিংহ', true)
ON CONFLICT (code) DO NOTHING;

-- 7. Bangladesh Sample Districts
INSERT INTO public.locations (id, code, unit_type, parent_id, division_id, name_en, name_bn, is_active) VALUES
('b0000000-0000-0000-0000-000000000013', 'BD-13', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Dhaka', 'ঢাকা', true),
('b0000000-0000-0000-0000-000000000018', 'BD-18', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Gazipur', 'গাজীপুর', true),
('b0000000-0000-0000-0000-000000000040', 'BD-40', 'district', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Narayanganj', 'নারায়ণগঞ্জ', true),
('b0000000-0000-0000-0000-000000000010', 'BD-10', 'district', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'Chattogram', 'চট্টগ্রাম', true),
('b0000000-0000-0000-0000-000000000054', 'BD-54', 'district', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Rajshahi', 'রাজশাহী', true),
('b0000000-0000-0000-0000-000000000027', 'BD-27', 'district', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'Khulna', 'খুলনা', true),
('b0000000-0000-0000-0000-000000000060', 'BD-60', 'district', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000006', 'Sylhet', 'সিলেট', true),
('b0000000-0000-0000-0000-000000000006', 'BD-06', 'district', 'a0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'Barishal', 'বরিশাল', true),
('b0000000-0000-0000-0000-000000000055', 'BD-55', 'district', 'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000007', 'Rangpur', 'রংপুর', true),
('b0000000-0000-0000-0000-000000000039', 'BD-39', 'district', 'a0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000008', 'Mymensingh', 'ময়মনসিংহ', true)
ON CONFLICT (code) DO NOTHING;
