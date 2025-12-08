"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface EncouragementToastProps {
  message: string;
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export function EncouragementToast({
  message,
  show,
  onHide,
  duration = 2500,
}: EncouragementToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsLeaving(false);

      const hideTimer = setTimeout(() => {
        setIsLeaving(true);
      }, duration - 300);

      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        onHide();
      }, duration);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [show, duration, onHide]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-32 z-50 flex justify-center">
      <div
        className={cn(
          "rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300",
          isLeaving
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        )}
      >
        {message}
      </div>
    </div>
  );
}
