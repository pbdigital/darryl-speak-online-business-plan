'use client';

import { useState } from 'react';
import { LogoutButton } from './logout-button';
import { BugReportDialog } from '@/components/bug-report-dialog';
import { Bug } from 'lucide-react';

interface PlanFooterProps {
  userName: string;
  userEmail: string;
}

export function PlanFooter({ userName, userEmail }: PlanFooterProps) {
  const [bugDialogOpen, setBugDialogOpen] = useState(false);

  return (
    <>
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <button
                onClick={() => setBugDialogOpen(true)}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Bug className="h-3.5 w-3.5" />
                Report an Issue
              </button>
              <span className="hidden sm:inline text-slate-300">|</span>
              <div className="text-center sm:text-right">
                <p className="text-xs text-slate-500">
                  &copy; {new Date().getFullYear()} Darryl Davis Seminars, Inc. All rights reserved.
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </footer>

      <BugReportDialog
        open={bugDialogOpen}
        onOpenChange={setBugDialogOpen}
        defaultName={userName}
        defaultEmail={userEmail}
      />
    </>
  );
}
