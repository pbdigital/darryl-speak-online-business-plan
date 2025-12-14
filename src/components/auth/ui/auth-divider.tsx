import { cn } from '@/lib/utils';

interface AuthDividerProps {
  className?: string;
  text?: string;
}

export function AuthDivider({ className, text = 'or' }: AuthDividerProps) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-muted-foreground/20" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
