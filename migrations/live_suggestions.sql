-- Create live_suggestions table
CREATE TABLE
    public.live_suggestions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
        belt_level INTEGER NOT NULL,
        program_slug TEXT NOT NULL,
        topic_title TEXT NOT NULL,
        topic_description TEXT NOT NULL,
        country_code CHAR(2) NOT NULL,
        county_code TEXT,
        status TEXT DEFAULT 'pending' CHECK (
            status IN ('pending', 'reviewed', 'approved', 'rejected')
        ),
        admin_notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW ()
    );

-- Enable RLS
ALTER TABLE public.live_suggestions ENABLE ROW LEVEL SECURITY;

-- Policies (admins can read all, users can only read their own)
CREATE POLICY "Users can view own suggestions" ON public.live_suggestions FOR
SELECT
    USING (auth.uid () = user_id);

CREATE POLICY "Users can insert own suggestions" ON public.live_suggestions FOR INSERT
WITH
    CHECK (auth.uid () = user_id);

CREATE POLICY "Admins can view all suggestions" ON public.live_suggestions FOR
SELECT
    USING (
        EXISTS (
            SELECT
                1
            FROM
                public.users_profile
            WHERE
                id = auth.uid ()
                AND role IN ('admin', 'superadmin')
        )
    );

-- Index for better performance
CREATE INDEX idx_live_suggestions_user_id ON public.live_suggestions (user_id);

CREATE INDEX idx_live_suggestions_status ON public.live_suggestions (status);

CREATE INDEX idx_live_suggestions_created_at ON public.live_suggestions (created_at DESC);