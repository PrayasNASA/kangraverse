'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import InfoPanel from '@/components/InfoPanel';
import LayerControl from '@/components/LayerControl';

const CesiumMap = dynamic(() => import('@/components/CesiumMap'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <main className="relative w-screen h-screen m-0 p-0 overflow-hidden bg-slate-900">
      <CesiumMap />
      <Sidebar />
      <InfoPanel />
      <LayerControl />
    </main>
  );
}
