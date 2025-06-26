# 숨보 (Sumbo) - 보물찾기 플랫폼

## 소개
숨보는 위치 기반의 보물찾기 웹 애플리케이션입니다. 실시간 위치 추적과 지도를 통해 숨겨진 보물을 찾아보세요!

## 기술 스택
- HTML5
- CSS3
- JavaScript (ES6+)
- Leaflet.js (지도)

## 주요 기능
- 실시간 위치 추적
- 보물 위치 표시
- 반응형 디자인
- SPA (Single Page Application)

## 시작하기
1. 저장소를 클론합니다
2. 웹 서버를 실행합니다 (예: `python -m http.server 8000`)
3. 브라우저에서 `http://localhost:8000`으로 접속합니다

## 프로젝트 구조
```
sumbo-web/
├── index.html          # 메인 HTML 파일
├── styles/            # CSS 파일
│   └── main.css       # 메인 스타일시트
├── js/               # JavaScript 파일
│   ├── app.js        # 앱 초기화
│   ├── map.js        # 지도 관련 기능
│   └── router.js     # 라우팅 처리
├── images/           # 이미지 파일
│   ├── markers/      # 지도 마커 이미지
│   └── icons/        # UI 아이콘
└── README.md         # 프로젝트 문서
```