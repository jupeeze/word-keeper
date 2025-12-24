import { useEffect, useCallback } from "react";

interface UseKeyboardNavigationOptions {
  onFlip?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canNavigateNext?: boolean;
  enabled?: boolean;
}

/**
 * キーボードナビゲーションのカスタムフック
 * スペースキー、矢印キーでの操作をサポート
 */
export const useKeyboardNavigation = ({
  onFlip,
  onNext,
  onPrevious,
  canNavigateNext = true,
  enabled = true,
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        onFlip?.();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (canNavigateNext && onNext) {
          onNext();
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevious?.();
      }
    },
    [onFlip, onNext, onPrevious, canNavigateNext, enabled],
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, enabled]);
};
