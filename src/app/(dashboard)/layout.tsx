import { BusinessPlanProvider } from '@/providers/business-plan-provider';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BusinessPlanProvider year={2026}>
      {children}
    </BusinessPlanProvider>
  );
}
