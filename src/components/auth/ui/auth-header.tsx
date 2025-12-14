'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function AuthHeader({
  title,
  subtitle,
  showBackButton = false,
  onBack,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showBackButton && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      )}

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <svg
              className="h-6 w-6 text-primary-foreground"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-primary">
            MyPlanForSuccess
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center text-primary">{title}</h1>
      {subtitle && (
        <p className="text-center text-muted-foreground text-sm">{subtitle}</p>
      )}
    </div>
  );
}
