import { BusinessPlanProvider } from '@/providers/business-plan-provider';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BusinessPlanProvider year={CURRENT_PLAN_YEAR}>
      {children}
    </BusinessPlanProvider>
  );
}
