-- ==============================================================================
-- LALBINDU NATIONWIDE BLOOD DONATION PLATFORM — NOTIFICATIONS & BROADCASTS SCHEMA
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BROADCAST NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.broadcast_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('emergency', 'achievement', 'verification', 'id_card', 'campaign', 'system')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    title_en VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255) NOT NULL,
    message_en TEXT NOT NULL,
    message_bn TEXT NOT NULL,
    action_link VARCHAR(255) DEFAULT '/blood-requests',
    target_group VARCHAR(50) DEFAULT 'all' CHECK (target_group IN ('all', 'specific_blood_group', 'division', 'admins_only')),
    target_value VARCHAR(100),
    sender_name VARCHAR(255) DEFAULT 'LalBindu Authority',
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USER NOTIFICATION READ RECEIPTS & PREFERENCES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.broadcast_notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (notification_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 3. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_active ON public.broadcast_notifications(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broadcast_notifications_target ON public.broadcast_notifications(target_group, target_value);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_read ON public.user_notifications(user_id, is_read);

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Read policy: Anyone can read active broadcasts intended for all, or their matching segment
CREATE POLICY "Public & donors can view active broadcasts"
    ON public.broadcast_notifications
    FOR SELECT
    USING (
        is_active = TRUE AND (
            target_group = 'all' OR
            target_group IS NULL OR
            auth.role() = 'authenticated'
        )
    );

-- Insert/Update/Delete policy: Only administrators can dispatch, update or delete broadcasts
CREATE POLICY "Admins can manage broadcast notifications"
    ON public.broadcast_notifications
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = TRUE
            AND ura.role_id IN ('super_admin', 'co_super_admin', 'division_admin', 'district_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND ura.is_active = TRUE
            AND ura.role_id IN ('super_admin', 'co_super_admin', 'division_admin', 'district_admin')
        )
    );

-- User notifications policies: Users manage their own read receipts
CREATE POLICY "Users can view their notification read receipts"
    ON public.user_notifications
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notification read receipts"
    ON public.user_notifications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their notification read receipts"
    ON public.user_notifications
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. SEED INITIAL NOTIFICATIONS
-- ------------------------------------------------------------------------------
INSERT INTO public.broadcast_notifications (
    type, priority, title_en, title_bn, message_en, message_bn, 
    action_link, target_group, target_value, sender_name
) VALUES
(
    'emergency', 
    'urgent', 
    'Critical Emergency: O+ Blood Needed', 
    'সংকটাপন্ন জরুরি: O+ রক্তের আবেদন', 
    'Open-heart surgery at NICVD. Matches your O+ blood group and location.', 
    'এনআইসিভিডিতে উন্মুক্ত হার্ট সার্জারি। আপনার রক্তের গ্রুপ ও এলাকার সাথে ম্যাচ করেছে।', 
    '/blood-requests', 
    'specific_blood_group', 
    'O+', 
    'National Emergency Dispatch'
),
(
    'achievement', 
    'normal', 
    'Achievement Unlocked: Life Saver!', 
    'অর্জন আনলক: জীবন রক্ষক!', 
    'Congratulations! You have completed 5 verified donations.', 
    'অভিনন্দন! আপনি সফলভাবে ৫টি যাচাইকৃত রক্তদান সম্পন্ন করেছেন।', 
    '/achievements', 
    'all', 
    NULL, 
    'LalBindu Recognition Board'
),
(
    'verification', 
    'high', 
    'Donation Record Verified by Hospital', 
    'হাসপাতাল কর্তৃক রক্তদান রেকর্ড যাচাই সম্পন্ন', 
    'Dhaka Medical College has approved your whole blood donation from Aug 10.', 
    'ঢাকা মেডিকেল কলেজ হাসপাতাল আপনার ১০ আগস্টের রক্তদান অনুমোদন করেছে।', 
    '/dashboard/donor', 
    'all', 
    NULL, 
    'Hospital Verification Desk'
),
(
    'id_card', 
    'normal', 
    'LalBindu Digital ID Card Active', 
    'লালবিন্দু ডিজিটাল পরিচয়পত্র সক্রিয়', 
    'Your cryptographic QR ID is active and ready for verification.', 
    'আপনার কিউআর সমৃদ্ধ ডিজিটাল কার্ড প্রস্তুত ও সক্রিয় রয়েছে।', 
    '/dashboard/donor#id-card', 
    'all', 
    NULL, 
    'LalBindu Identity Secretariat'
);
