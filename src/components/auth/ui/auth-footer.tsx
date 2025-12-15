import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthFooterProps {
  className?: string;
}

export function AuthFooter({ className }: AuthFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1 text-xs text-gray-400',
        className
      )}
    >
      <Link
        href="/privacy"
        className="hover:text-gray-600 transition-colors"
      >
        Privacy Policy
      </Link>
      <span className="text-gray-300">|</span>
      <Link
        href="/terms"
        className="hover:text-gray-600 transition-colors"
      >
        Terms of Service
      </Link>
    </div>
  );
}
