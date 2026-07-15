'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import InfoPanel from '@/components/InfoPanel';
import MapDock from '@/components/MapDock';

const CesiumMap = dynamic(() => import('@/components/CesiumMap'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <main className="relative w-screen h-[100dvh] m-0 p-0 overflow-hidden bg-slate-900">
      {/* Background Map Layer */}
      <div className="absolute inset-0 z-0">
        <CesiumMap />
      </div>
      
      {/* Absolute Layout Zones (z-40) */}
      <div className="absolute inset-0 z-40 pointer-events-none p-6 flex flex-col justify-between">
        {/* TOP ZONE (TopNav will handle this via position fixed/absolute, but we can reserve space if needed) */}
        <div id="zone-top" className="w-full shrink-0 flex justify-center"></div>
        
        {/* MIDDLE ZONES (Left Sidebar + Right InfoPanel) */}
        <div id="zone-middle" className="flex-1 min-h-0 flex justify-between items-stretch pt-24 pb-4">
          <div id="zone-left" className="h-full flex flex-col justify-start">
            <Sidebar />
          </div>
          <div id="zone-right" className="h-full flex flex-col justify-start">
            <InfoPanel />
          </div>
        </div>
        
        {/* BOTTOM ZONES (MapDock Center + AI Assistant Right) */}
        <div id="zone-bottom" className="w-full shrink-0 flex items-end justify-between relative">
          <div className="w-[380px] shrink-0" /> {/* Spacer to balance MapDock centering if needed */}
          <div id="zone-bottom-center" className="flex-1 flex justify-center pointer-events-auto">
            <MapDock />
          </div>
          <div id="zone-bottom-right" className="w-[380px] shrink-0 flex justify-end pointer-events-auto">
            {/* Chatbot will render here intrinsically or we'll wrap it */}
          </div>
        </div>
      </div>
    </main>
  );
}
