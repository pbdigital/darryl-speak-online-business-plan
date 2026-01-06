'use client';

import { Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SaveStatus } from '@/hooks/use-auto-save';

interface SaveIndicatorProps {
  status: SaveStatus;
  lastSavedAt?: Date | null;
  className?: string;
}

/**
 * Displays the current save status with appropriate icon and text
 * Shows: idle (cloud), saving (spinner), saved (check), error (cloud-off)
 */
export function SaveIndicator({
  status,
  lastSavedAt,
  className,
}: SaveIndicatorProps) {
  return (
    <div
      className={cn(
        'hidden md:flex items-center gap-1.5 text-xs text-muted-foreground transition-opacity',
        status === 'idle' && !lastSavedAt && 'opacity-0',
        className
      )}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Saving...</span>
        </>
      )}

      {status === 'saved' && (
        <>
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-green-600">Saved</span>
        </>
      )}

      {status === 'error' && (
        <>
          <CloudOff className="h-3.5 w-3.5 text-red-500" />
          <span className="text-red-600">Save failed</span>
        </>
      )}

      {status === 'idle' && lastSavedAt && (
        <>
          <Cloud className="h-3.5 w-3.5" />
          <span>{formatRelativeTime(lastSavedAt)}</span>
        </>
      )}
    </div>
  );
}

/**
 * Format a date as relative time (e.g., "just now", "2m ago")
 */
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 10) return 'Saved just now';
  if (seconds < 60) return `Saved ${seconds}s ago`;
  if (seconds < 3600) return `Saved ${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `Saved ${Math.floor(seconds / 3600)}h ago`;
  return `Saved ${Math.floor(seconds / 86400)}d ago`;
}
