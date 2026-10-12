-- ==============================================================================
-- WILD FIRE: AI-Powered Student Analytics & Success Platform
-- Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. User Profiles Table (Linked to Supabase Auth)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'educator',
  institution TEXT DEFAULT 'Wild Fire Academy',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. Students Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  course TEXT NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  attendance_rate NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  average_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  trend TEXT NOT NULL DEFAULT 'stable' CHECK (trend IN ('improving', 'stable', 'declining')),
  risk_level TEXT NOT NULL DEFAULT 'low' CHECK (risk_level IN ('low', 'moderate', 'high')),
  risk_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  advisor TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'leave')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. Assessments Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  score NUMERIC(6,2) NOT NULL,
  max_score NUMERIC(6,2) NOT NULL DEFAULT 100.00,
  percentage NUMERIC(5,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  term TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'assignment' CHECK (type IN ('quiz', 'midterm', 'final', 'assignment', 'lab')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. Interventions Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  student_name TEXT,
  category TEXT NOT NULL CHECK (category IN (
    'attendance_support',
    'subject_tutoring',
    'study_planning',
    'assignment_completion',
    'teacher_follow_up',
    'academic_counseling'
  )),
  title TEXT NOT NULL,
  reason TEXT NOT NULL,
  evidence TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'under_review', 'escalated')),
  target_review_date DATE,
  pre_attendance_rate NUMERIC(5,2),
  pre_average_score NUMERIC(5,2),
  post_attendance_rate NUMERIC(5,2),
  post_average_score NUMERIC(5,2),
  follow_up_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. Attendance Records Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. Assignment Records Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.assignment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  submitted_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'overdue')),
  score NUMERIC(6,2),
  max_score NUMERIC(6,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. High-Performance Foreign Key & Query Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_student_id ON public.assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_interventions_user_id ON public.interventions(user_id);
CREATE INDEX IF NOT EXISTS idx_interventions_student_id ON public.interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON public.attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON public.assignment_records(student_id);

-- ==============================================================================
-- 9. Row Level Security (RLS) Enablement
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_records ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 10. Row Level Security Policies (Only Authenticated Users Access Their Own Data)
-- ==============================================================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- STUDENTS POLICIES
DROP POLICY IF EXISTS "Users can view own students" ON public.students;
CREATE POLICY "Users can view own students"
  ON public.students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own students" ON public.students;
CREATE POLICY "Users can insert own students"
  ON public.students FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own students" ON public.students;
CREATE POLICY "Users can update own students"
  ON public.students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own students" ON public.students;
CREATE POLICY "Users can delete own students"
  ON public.students FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ASSESSMENTS POLICIES
DROP POLICY IF EXISTS "Users can view own assessments" ON public.assessments;
CREATE POLICY "Users can view own assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON public.assessments;
CREATE POLICY "Users can insert own assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own assessments" ON public.assessments;
CREATE POLICY "Users can update own assessments"
  ON public.assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own assessments" ON public.assessments;
CREATE POLICY "Users can delete own assessments"
  ON public.assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- INTERVENTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own interventions" ON public.interventions;
CREATE POLICY "Users can view own interventions"
  ON public.interventions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own interventions" ON public.interventions;
CREATE POLICY "Users can insert own interventions"
  ON public.interventions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own interventions" ON public.interventions;
CREATE POLICY "Users can update own interventions"
  ON public.interventions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own interventions" ON public.interventions;
CREATE POLICY "Users can delete own interventions"
  ON public.interventions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ATTENDANCE POLICIES
DROP POLICY IF EXISTS "Users can manage own attendance" ON public.attendance_records;
CREATE POLICY "Users can manage own attendance"
  ON public.attendance_records FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ASSIGNMENTS POLICIES
DROP POLICY IF EXISTS "Users can manage own assignments" ON public.assignment_records;
CREATE POLICY "Users can manage own assignments"
  ON public.assignment_records FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 11. Automated Trigger: Auto-create Profile on Supabase User Signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'educator')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
