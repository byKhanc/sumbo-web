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
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-50">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <nav className="w-64 bg-white shadow-xl">
            <div className="fixed w-64 h-full">
              <div className="flex flex-col h-full">
                {/* Logo/Title Section */}
                <div className="p-6 bg-blue-600">
                  <h1 className="text-2xl font-bold text-white">숨보 Sumbo</h1>
                  <p className="text-blue-100 text-sm mt-1">보물찾기 플랫폼</p>
                </div>
                
                {/* Navigation Links */}
                <div className="p-4 flex-grow">
                  <ul className="space-y-3">
                    <li>
                      <a href="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-icons">home</span>
                        <span>홈</span>
                      </a>
                    </li>
                    <li>
                      <a href="/treasuremap" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-icons">map</span>
                        <span>보물지도</span>
                      </a>
                    </li>
                    <li>
                      <a href="/mytreasures" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-icons">diamond</span>
                        <span>내 보물</span>
                      </a>
                    </li>
                    <li>
                      <a href="/mission" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <span className="material-icons">task</span>
                        <span>미션</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">© 2024 Sumbo</p>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
