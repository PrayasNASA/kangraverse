import { Metadata } from 'next';
import ResearchView from '@/components/ResearchView';

export const metadata: Metadata = {
  title: 'Research | KangraVerse',
  description: 'Researching the Living Sacred Landscapes of Western Himachal Himalayas',
};

export default function ResearchPage() {
  return <ResearchView />;
}
