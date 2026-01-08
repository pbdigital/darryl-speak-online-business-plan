-- Create bug_reports table for storing user-submitted bug reports
CREATE TABLE public.bug_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  section text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Users can insert their own bug reports
CREATE POLICY "Users can create bug reports"
  ON public.bug_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can view their own bug reports
CREATE POLICY "Users can view own bug reports"
  ON public.bug_reports FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all bug reports
CREATE POLICY "Admins can view all bug reports"
  ON public.bug_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Add index for querying by user
CREATE INDEX idx_bug_reports_user_id ON public.bug_reports(user_id);

-- Add index for querying by created_at (for admin review)
CREATE INDEX idx_bug_reports_created_at ON public.bug_reports(created_at DESC);

COMMENT ON TABLE public.bug_reports IS 'User-submitted bug reports and feedback';
