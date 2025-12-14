import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthFooterProps {
  className?: string;
}

export function AuthFooter({ className }: AuthFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-4 text-xs text-muted-foreground',
        className
      )}
    >
      <Link href="/privacy" className="hover:text-foreground hover:underline">
        Privacy Policy
      </Link>
      <span>|</span>
      <Link href="/terms" className="hover:text-foreground hover:underline">
        Terms of Service
      </Link>
    </div>
  );
}
