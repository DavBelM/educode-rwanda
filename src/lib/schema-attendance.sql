-- Attendance tracking for EduCode
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  topic TEXT,
  teacher_id UUID REFERENCES public.profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(class_id, session_date)
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT CHECK(status IN ('present','absent','late','excused')) NOT NULL DEFAULT 'absent',
  note TEXT,
  UNIQUE(session_id, student_id)
);

ALTER TABLE public.attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own class sessions
CREATE POLICY "teachers_manage_sessions" ON public.attendance_sessions
  FOR ALL USING (auth.uid() = teacher_id);

-- Teachers can manage records in their sessions
CREATE POLICY "teachers_manage_records" ON public.attendance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.attendance_sessions s
      WHERE s.id = attendance_records.session_id AND s.teacher_id = auth.uid()
    )
  );

-- Students can view their own attendance records
CREATE POLICY "students_view_own_records" ON public.attendance_records
  FOR SELECT USING (auth.uid() = student_id);

-- Students can view sessions for classes they are enrolled in
CREATE POLICY "students_view_sessions" ON public.attendance_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments e
      WHERE e.class_id = attendance_sessions.class_id AND e.student_id = auth.uid()
    )
  );
