// app/treasuremap/page.tsx
import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트 dynamic import (SSR 방지)
const TreasureMapClient = dynamic(() => import('./TreasureMapClient'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">지도를 불러오는 중...</div>
});

export default function TreasureMapPage() {
  return (
    <div className="w-full h-[calc(100vh-2rem)] p-4">
      <h1 className="text-2xl font-bold mb-4">보물 지도</h1>
      <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
        <TreasureMapClient />
      </div>
    </div>
  );
}
