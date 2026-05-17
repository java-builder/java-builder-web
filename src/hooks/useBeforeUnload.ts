import { useEffect } from 'react';

interface UseBeforeUnloadProps {
  enabled: boolean;
  message?: string;
}

/**
 * Hook to prevent page reload/close with confirmation dialog
 * @param enabled - Whether to enable the beforeunload warning
 * @param message - Custom message (note: most browsers ignore this and show their own message)
 */
export const useBeforeUnload = ({ enabled, message }: UseBeforeUnloadProps) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (enabled) {
        e.preventDefault();
        // Modern browsers ignore custom messages and show their own
        // But we still need to set returnValue for the dialog to appear
        e.returnValue = message || '';
      }
    };

    if (enabled) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [enabled, message]);
};
