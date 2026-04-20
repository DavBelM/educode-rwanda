import { useState, useEffect, useCallback, useRef } from 'react';

export interface ExamViolations {
  tabSwitches: number;
  pasteCount: number;
  fullscreenExits: number;
}

interface UseExamModeOptions {
  enabled: boolean;
  onViolation?: (type: keyof ExamViolations, total: ExamViolations) => void;
}

export function useExamMode({ enabled, onViolation }: UseExamModeOptions) {
  const [violations, setViolations] = useState<ExamViolations>({ tabSwitches: 0, pasteCount: 0, fullscreenExits: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const violationsRef = useRef<ExamViolations>({ tabSwitches: 0, pasteCount: 0, fullscreenExits: 0 });

  const record = useCallback((type: keyof ExamViolations) => {
    const updated = { ...violationsRef.current, [type]: violationsRef.current[type] + 1 };
    violationsRef.current = updated;
    setViolations({ ...updated });
    onViolation?.(type, updated);
  }, [onViolation]);

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      // Browser denied — not a violation
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // Fullscreen change
    const onFullscreenChange = () => {
      const inFs = !!document.fullscreenElement;
      setIsFullscreen(inFs);
      if (!inFs && isFullscreen) record('fullscreenExits');
    };

    // Tab/window visibility
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') record('tabSwitches');
    };

    // Window blur (covers Alt+Tab, clicking taskbar, etc.)
    const onBlur = () => record('tabSwitches');

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  }, [enabled, isFullscreen, record]);

  // Paste tracking — exposed as an event handler to attach to the editor container
  const onPaste = useCallback(() => {
    if (enabled) record('pasteCount');
  }, [enabled, record]);

  return { violations: violationsRef, violationsState: violations, isFullscreen, requestFullscreen, onPaste };
}
