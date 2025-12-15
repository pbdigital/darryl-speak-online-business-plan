import { cn } from '@/lib/utils';

interface AuthDividerProps {
  className?: string;
  text?: string;
}

export function AuthDivider({ className, text = 'or' }: AuthDividerProps) {
  return (
    <div className={cn('relative py-2', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-white px-4 text-gray-400 font-normal">{text}</span>
      </div>
    </div>
  );
}
