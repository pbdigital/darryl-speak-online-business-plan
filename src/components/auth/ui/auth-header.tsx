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
          className="-ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      )}

      <h1 className="text-2xl font-semibold text-center text-gray-900">{title}</h1>
      {subtitle && (
        <p className="text-center text-gray-500 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
