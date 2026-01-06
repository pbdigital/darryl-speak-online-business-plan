"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationToastProps {
  missingFields: string[];
  show: boolean;
  onHide: () => void;
  duration?: number;
}

export function ValidationToast({
  missingFields,
  show,
  onHide,
  duration = 4000,
}: ValidationToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (show && missingFields.length > 0) {
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
  }, [show, duration, onHide, missingFields.length]);

  if (!isVisible || missingFields.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-32 z-50 flex justify-center px-4">
      <div
        className={cn(
          "flex max-w-md items-start gap-3 rounded-lg bg-amber-50 px-4 py-3 text-sm shadow-xl ring-1 ring-amber-200 transition-all duration-300",
          isLeaving
            ? "translate-y-2 opacity-0"
            : "translate-y-0 opacity-100"
        )}
      >
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
        <div className="space-y-1">
          <p className="font-medium text-amber-800">
            Some fields are incomplete
          </p>
          <ul className="list-inside list-disc text-amber-700">
            {missingFields.slice(0, 3).map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
            {missingFields.length > 3 && (
              <li>...and {missingFields.length - 3} more</li>
            )}
          </ul>
          <p className="text-xs text-amber-600">
            You can still proceed — this step won&apos;t show as complete.
          </p>
        </div>
      </div>
    </div>
  );
}
