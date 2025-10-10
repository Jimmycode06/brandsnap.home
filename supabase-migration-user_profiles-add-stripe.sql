-- Migration: ensure user_profiles has Stripe + subscription columns
-- Run this in Supabase SQL editor

BEGIN;

-- Core columns
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT CHECK (subscription_status IN ('active','canceled','past_due','trialing','incomplete')),
  ADD COLUMN IF NOT EXISTS plan TEXT CHECK (plan IN ('starter','professional','enterprise')),
  ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ;

-- Credits default + not null
DO $$
BEGIN
  -- If column credits exists, enforce default and not null
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='user_profiles' AND column_name='credits'
  ) THEN
    EXECUTE 'ALTER TABLE user_profiles ALTER COLUMN credits SET DEFAULT 0';
    EXECUTE 'ALTER TABLE user_profiles ALTER COLUMN credits SET NOT NULL';
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_stripe_customer ON user_profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON user_profiles(stripe_subscription_id);

-- RLS and policies (service role bypasses RLS, but we add explicit policy)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Ensure basic policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Users can view own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Users can update own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'Service role can do everything'
  ) THEN
    EXECUTE 'CREATE POLICY "Service role can do everything" ON user_profiles USING (auth.role() = ''service_role'')';
  END IF;
END $$;

COMMIT;


