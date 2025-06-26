// app/treasuremap/page.tsx
import dynamic from 'next/dynamic';

// 클라이언트 컴포넌트 dynamic import (SSR 방지)
const TreasureMapClient = dynamic(() => import('./TreasureMapClient'), {
  ssr: false,
});

export default function TreasureMapPage() {
  return (
    <div className="w-full h-screen">
      <TreasureMapClient />
    </div>
  );
}
