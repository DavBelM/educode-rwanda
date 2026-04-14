-- Run this in the Supabase SQL Editor

create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references classes(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  title      text not null,
  body       text not null,
  pinned     boolean not null default false,
  created_at timestamptz not null default now()
);

alter table announcements enable row level security;

-- Teachers can do everything on announcements they own
create policy "Teachers manage own announcements"
  on announcements for all
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

-- Students can read announcements for classes they're enrolled in
create policy "Students read class announcements"
  on announcements for select
  using (
    exists (
      select 1 from class_enrollments
      where class_enrollments.class_id = announcements.class_id
        and class_enrollments.student_id = auth.uid()
    )
  );
