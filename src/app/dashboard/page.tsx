import { Metadata } from 'next';
import DashboardView from '@/components/DashboardView';

export const metadata: Metadata = {
  title: 'Dashboard | KangraVerse',
  description: 'Sacred landscape dataset overview and research progress.',
};

export default function DashboardPage() {
  return <DashboardView />;
}
