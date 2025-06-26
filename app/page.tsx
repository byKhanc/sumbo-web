// app/page.tsx
export default function Home() {
  return (
    <div className="fade-in">
      <h1 className="page-title">숨보 Sumbo에 오신 것을 환영합니다!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <span className="material-icons text-blue-600 text-4xl mb-4">map</span>
          <h2 className="text-xl font-semibold mb-2">보물 지도</h2>
          <p className="text-gray-600">실시간으로 주변의 숨겨진 보물들을 찾아보세요.</p>
          <a href="/treasuremap" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            지도 보기 →
          </a>
        </div>

        <div className="card">
          <span className="material-icons text-blue-600 text-4xl mb-4">diamond</span>
          <h2 className="text-xl font-semibold mb-2">내 보물</h2>
          <p className="text-gray-600">지금까지 발견한 보물들을 확인해보세요.</p>
          <a href="/mytreasures" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            보물 확인하기 →
          </a>
        </div>

        <div className="card">
          <span className="material-icons text-blue-600 text-4xl mb-4">task</span>
          <h2 className="text-xl font-semibold mb-2">미션</h2>
          <p className="text-gray-600">새로운 미션을 수행하고 보물을 찾아보세요.</p>
          <a href="/mission" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            미션 시작하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
