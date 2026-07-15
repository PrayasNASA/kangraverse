import { Metadata } from 'next';
import StoriesView from '@/components/StoriesView';

export const metadata: Metadata = {
  title: 'Stories | KangraVerse',
  description: 'Immersive stories of Kangra\'s sacred heritage and community traditions.',
};

export default function StoriesPage() {
  return <StoriesView />;
}
