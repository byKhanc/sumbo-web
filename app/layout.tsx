// app/layout.tsx
import './globals.css';

export const metadata = {
  title: "숨보 Sumbo",
  description: "숨겨진 보물을 찾는 지도 기반 미션 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          <nav className="w-64 bg-white shadow-lg p-4">
            <h1 className="text-xl font-bold mb-4">숨보 Sumbo</h1>
            <ul className="space-y-2">
              <li><a href="/" className="text-blue-600 hover:text-blue-800">홈</a></li>
              <li><a href="/treasuremap" className="text-blue-600 hover:text-blue-800">보물지도</a></li>
              <li><a href="/mytreasures" className="text-blue-600 hover:text-blue-800">내 보물</a></li>
              <li><a href="/mission" className="text-blue-600 hover:text-blue-800">미션</a></li>
            </ul>
          </nav>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
