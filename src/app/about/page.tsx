import { Metadata } from 'next';
import AboutView from '@/components/AboutView';

export const metadata: Metadata = {
  title: 'About Us | KangraVerse',
  description: 'Preserving Sacred Heritage, Empowering Communities',
};

export default function AboutPage() {
  return <AboutView />;
}
