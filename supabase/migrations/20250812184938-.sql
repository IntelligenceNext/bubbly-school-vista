-- Fix: recreate policies without IF NOT EXISTS (not supported)
-- Ensure table exists
CREATE TABLE IF NOT EXISTS public.user_custom_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role_id)
);

ALTER TABLE public.user_custom_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only administrators manage custom role assignments" ON public.user_custom_roles;
CREATE POLICY "Only administrators manage custom role assignments"
ON public.user_custom_roles
AS PERMISSIVE
FOR ALL
TO authenticated
USING (current_has_role('administrator'::app_role))
WITH CHECK (current_has_role('administrator'::app_role));

DROP POLICY IF EXISTS "Users can view their own custom role assignments" ON public.user_custom_roles;
CREATE POLICY "Users can view their own custom role assignments"
ON public.user_custom_roles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_user_custom_roles_role_id ON public.user_custom_roles(role_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'permissions_name_unique'
  ) THEN
    ALTER TABLE public.permissions ADD CONSTRAINT permissions_name_unique UNIQUE (name);
  END IF;
END$$;

-- Seed permissions (id auto)
INSERT INTO public.permissions (name, category, description) VALUES
  ('add_inquiries','Inquiries','Add inquiries'),
  ('view_inquiries','Inquiries','View inquiries'),
  ('edit_inquiries','Inquiries','Edit inquiries'),
  ('delete_inquiries','Inquiries','Delete inquiries'),
  ('manage_admissions','Admissions','Manage admissions'),
  ('view_students','Students','View students'),
  ('edit_students','Students','Edit students'),
  ('delete_students','Students','Delete students'),
  ('student_promotion','Students','Promote students'),
  ('transfer_student','Students','Transfer student between classes'),
  ('only_manage_assigned_class','Students','Restrict to assigned class'),
  ('add_remove_admins','Administration','Add or remove admins'),
  ('add_remove_staff','Staff','Add or remove staff'),
  ('manage_roles','Administration','Manage roles and permissions'),
  ('add_certificates','Certificates','Add certificates'),
  ('issue_certificates','Certificates','Issue certificates'),
  ('view_certificates','Certificates','View certificates'),
  ('edit_certificates','Certificates','Edit certificates'),
  ('delete_certificates','Certificates','Delete certificates'),
  ('manage_classes_sections','Classes & Sections','Manage classes and sections'),
  ('delete_class_sections','Classes & Sections','Delete class sections'),
  ('add_subjects','Subjects','Add subjects'),
  ('view_subjects','Subjects','View subjects'),
  ('edit_subjects','Subjects','Edit subjects'),
  ('delete_subjects','Subjects','Delete subjects'),
  ('manage_assigned_subjects','Subjects','Manage assigned subjects'),
  ('view_timetable','Timetable','View timetable'),
  ('add_timetable','Timetable','Add timetable'),
  ('edit_timetable','Timetable','Edit timetable'),
  ('delete_timetable','Timetable','Delete timetable'),
  ('manage_timetable','Timetable','Manage timetable'),
  ('add_student_attendance','Attendance','Add student attendance'),
  ('edit_student_attendance','Attendance','Edit student attendance'),
  ('view_student_attendance','Attendance','View student attendance'),
  ('manage_staff_attendance','Attendance','Manage staff attendance'),
  ('take_staff_attendance','Attendance','Take staff attendance'),
  ('view_staff_attendance','Attendance','View staff attendance'),
  ('add_student_leaves','Leaves','Add student leaves'),
  ('edit_student_leaves','Leaves','Edit student leaves'),
  ('delete_student_leaves','Leaves','Delete student leaves'),
  ('view_student_leaves','Leaves','View student leaves'),
  ('edit_staff_leaves','Leaves','Edit staff leaves'),
  ('delete_staff_leaves','Leaves','Delete staff leaves'),
  ('view_staff_leaves','Leaves','View staff leaves'),
  ('edit_study_materials','Study Materials','Edit study materials'),
  ('delete_study_materials','Study Materials','Delete study materials'),
  ('view_study_materials','Study Materials','View study materials'),
  ('edit_homework','Homework','Edit homework'),
  ('delete_homework','Homework','Delete homework'),
  ('view_homework','Homework','View homework'),
  ('add_live_classes','Live Classes','Add live classes'),
  ('edit_live_classes','Live Classes','Edit live classes'),
  ('delete_live_classes','Live Classes','Delete live classes'),
  ('view_live_classes','Live Classes','View live classes'),
  ('add_books','Library','Add books'),
  ('view_library','Library','View library'),
  ('edit_library','Library','Edit library'),
  ('delete_library','Library','Delete from library'),
  ('issue_books','Library','Issue books'),
  ('issue_library_card','Library','Issue library card'),
  ('add_transport','Transport','Add transport'),
  ('view_transport','Transport','View transport'),
  ('edit_transport','Transport','Edit transport'),
  ('delete_transport','Transport','Delete transport'),
  ('add_noticeboard','Noticeboard','Add noticeboard'),
  ('view_noticeboard','Noticeboard','View noticeboard'),
  ('edit_noticeboard','Noticeboard','Edit noticeboard'),
  ('delete_noticeboard','Noticeboard','Delete noticeboard'),
  ('add_events','Events','Add events'),
  ('view_events','Events','View events'),
  ('edit_events','Events','Edit events'),
  ('delete_events','Events','Delete events'),
  ('add_exams','Exams','Add exams'),
  ('view_exams','Exams','View exams'),
  ('edit_exams','Exams','Edit exams'),
  ('delete_exams','Exams','Delete exams'),
  ('add_expenses','Finance - Expenses','Add expenses'),
  ('view_expenses','Finance - Expenses','View expenses'),
  ('edit_expenses','Finance - Expenses','Edit expenses'),
  ('delete_expenses','Finance - Expenses','Delete expenses'),
  ('add_income','Finance - Income','Add income'),
  ('view_income','Finance - Income','View income'),
  ('edit_income','Finance - Income','Edit income'),
  ('delete_income','Finance - Income','Delete income'),
  ('add_invoices','Finance - Invoices','Add invoices'),
  ('view_invoices','Finance - Invoices','View invoices'),
  ('edit_invoices','Finance - Invoices','Edit invoices'),
  ('delete_invoices','Finance - Invoices','Delete invoices'),
  ('delete_payments','Finance - Payments','Delete payments'),
  ('add_fee_types','Finance - Fee Types','Add fee types'),
  ('view_fee_types','Finance - Fee Types','View fee types'),
  ('edit_fee_types','Finance - Fee Types','Edit fee types'),
  ('delete_fee_types','Finance - Fee Types','Delete fee types'),
  ('view_stats_amount_by_fees_structure','Statistics','View stats - amount by fees structure'),
  ('view_stats_payments','Statistics','View stats - payments'),
  ('view_stats_income','Statistics','View stats - income'),
  ('view_stats_expense','Statistics','View stats - expense'),
  ('send_notifications','Notifications','Send notifications'),
  ('add_hostel','Hostel','Add hostel'),
  ('view_hostel','Hostel','View hostel'),
  ('edit_hostel','Hostel','Edit hostel'),
  ('delete_hostel','Hostel','Delete hostel'),
  ('add_activities','Activities','Add activities'),
  ('view_activities','Activities','View activities'),
  ('edit_activities','Activities','Edit activities'),
  ('delete_activities','Activities','Delete activities'),
  ('add_lessons','Lessons','Add lessons'),
  ('view_lessons','Lessons','View lessons'),
  ('edit_lessons','Lessons','Edit lessons'),
  ('delete_lessons','Lessons','Delete lessons'),
  ('add_tickets','Tickets','Add tickets'),
  ('view_tickets','Tickets','View tickets'),
  ('edit_tickets','Tickets','Edit tickets'),
  ('delete_tickets','Tickets','Delete tickets'),
  ('view_only_assigned_tickets','Tickets','View only assigned tickets'),
  ('manage_logs','Administration','Manage logs'),
  ('manage_settings','Administration','Manage settings')
ON CONFLICT (name) DO UPDATE SET category = EXCLUDED.category, description = EXCLUDED.description;