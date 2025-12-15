'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * Skeleton loader for section content while data is being fetched
 */
export function SectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-6 mt-8">
        {/* Field group 1 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Field group 2 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Field group 3 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Field group 4 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-52" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>

      {/* Button skeleton */}
      <div className="flex justify-end gap-3 mt-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

/**
 * Compact skeleton for smaller loading areas
 */
export function CompactSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
