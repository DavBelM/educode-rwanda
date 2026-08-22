-- Brief 5: Trigger to emit submission_graded learning event when teacher grades work.
-- Run once in Supabase SQL editor.

-- The trigger fires when marks_earned changes from NULL → a value (i.e., first time a
-- submission is graded). It inserts a learning_events row on behalf of the student so
-- grading impact shows in analytics without mutating the immutable event log.

CREATE OR REPLACE FUNCTION public.on_submission_graded()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_class_id  UUID;
  v_total     INTEGER;
  v_outcome   TEXT;
BEGIN
  -- Only fire when marks_earned changes from NULL to a real value
  IF OLD.marks_earned IS NOT NULL OR NEW.marks_earned IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT a.class_id, a.total_marks
    INTO v_class_id, v_total
    FROM public.assignments a
   WHERE a.id = NEW.assignment_id;

  v_outcome := CASE
    WHEN v_total > 0 AND NEW.marks_earned >= (v_total * 0.5) THEN 'pass'
    ELSE 'fail'
  END;

  INSERT INTO public.learning_events (
    student_id, class_id, event_type, entity_type, entity_id, outcome, metadata
  ) VALUES (
    NEW.student_id,
    v_class_id,
    'submission_graded',
    'assessment',
    NEW.assignment_id,
    v_outcome,
    jsonb_build_object(
      'marks_earned', NEW.marks_earned,
      'total_marks',  v_total,
      'graded_by',    NEW.graded_by
    )
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_submission_graded ON public.student_submissions;
CREATE TRIGGER trg_submission_graded
  AFTER UPDATE ON public.student_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.on_submission_graded();
