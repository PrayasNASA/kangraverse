import { Metadata } from 'next';
import GalleryView from '@/components/GalleryView';

export const metadata: Metadata = {
  title: 'Gallery | KangraVerse',
  description: 'Visual Stories of Sacred Landscapes in the Western Himalayas',
};

export default function GalleryPage() {
  return <GalleryView />;
}
