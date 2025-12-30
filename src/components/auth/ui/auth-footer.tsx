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
      <a
        href="https://darrylspeaks.com/privacy-policy"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-600 transition-colors"
      >
        Privacy Policy
      </a>
      <span className="text-gray-300">|</span>
      <a
        href="https://darrylspeaks.com/terms-of-service"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-600 transition-colors"
      >
        Terms of Service
      </a>
    </div>
  );
}
