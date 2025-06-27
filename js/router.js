// Simple router implementation
class Router {
    constructor(routes) {
        this.routes = routes;
        this.mainContent = document.getElementById('main-content');
        
        // Handle initial route
        window.addEventListener('load', () => this.handleRoute());
        
        // Handle route changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                document.querySelector('.nav-link.active')?.classList.remove('active');
                e.target.closest('.nav-link').classList.add('active');
            });
        });
    }

    async handleRoute() {
        // Always cleanup map before rendering new route
        if (typeof cleanupMap === 'function') {
            cleanupMap();
        }
        const hash = window.location.hash || '#home';
        const route = this.routes[hash];
        
        if (route) {
            this.mainContent.innerHTML = '';
            this.mainContent.classList.remove('fade-in');
            
            // Add fade-in animation
            setTimeout(() => {
                this.mainContent.classList.add('fade-in');
                route();
            }, 10);
        }
    }
}

// Define routes
const routes = {
    '#home': () => {
        const content = `
            <h1 class="page-title">숨보 Sumbo에 오신 것을 환영합니다!</h1>
            <div class="card-grid">
                <div class="card">
                    <span class="material-icons">map</span>
                    <h2>맛집 지도</h2>
                    <p>실시간으로 주변의 맛집들을 찾아보세요.</p>
                    <a href="#treasuremap">지도 보기 →</a>
                </div>
                <div class="card">
                    <span class="material-icons">restaurant</span>
                    <h2>내 맛집 기록</h2>
                    <p>지금까지 방문한 맛집들을 확인해보세요.</p>
                    <a href="#mytreasures">기록 확인하기 →</a>
                </div>
                <div class="card">
                    <span class="material-icons">task</span>
                    <h2>맛집 미션</h2>
                    <p>새로운 맛집을 발견하고 미션을 수행해보세요.</p>
                    <a href="#treasuremap">미션 시작하기 →</a>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
    },

    '#treasuremap': () => {
        const content = `
            <h1 class="page-title">보물 지도</h1>
            <div id="map-container"></div>
        `;
        document.getElementById('main-content').innerHTML = content;
        initMap();
    },

    '#mytreasures': () => {
        const visitedRestaurants = JSON.parse(localStorage.getItem('visitedRestaurants') || '[]');
        const response = fetch('restaurants.json')
            .then(res => res.json())
            .then(restaurants => {
                const visitedData = restaurants.filter(r => visitedRestaurants.includes(r.id));
                
                let content = `
                    <h1 class="page-title">내 맛집 기록</h1>
                    <div class="stats-card">
                        <h3>방문 통계</h3>
                        <p>총 ${visitedData.length}개 맛집 방문 완료</p>
                        <p>전체 ${restaurants.length}개 중 ${Math.round((visitedData.length / restaurants.length) * 100)}% 달성</p>
                    </div>
                `;
                
                if (visitedData.length > 0) {
                    content += '<div class="card-grid">';
                    visitedData.forEach(restaurant => {
                        content += `
                            <div class="card visited-card">
                                <div class="card-header">
                                    <span class="material-icons" style="color: #16a34a;">restaurant</span>
                                    <h3>${restaurant.name}</h3>
                                </div>
                                <p><strong>카테고리:</strong> ${restaurant.category}</p>
                                <p><strong>주소:</strong> ${restaurant.address}</p>
                                <p><strong>미션:</strong> ${restaurant.mission}</p>
                                <div class="completion-badge">✓ 완료</div>
                            </div>
                        `;
                    });
                    content += '</div>';
                } else {
                    content += `
                        <div class="card">
                            <span class="material-icons">restaurant</span>
                            <h2>아직 방문한 맛집이 없습니다</h2>
                            <p>보물지도에서 새로운 맛집을 찾아보세요!</p>
                            <a href="#treasuremap">맛집 찾으러 가기 →</a>
                        </div>
                    `;
                }
                
                document.getElementById('main-content').innerHTML = content;
            })
            .catch(error => {
                document.getElementById('main-content').innerHTML = `
                    <h1 class="page-title">내 맛집 기록</h1>
                    <div class="card">
                        <span class="material-icons">error</span>
                        <h2>데이터를 불러올 수 없습니다</h2>
                        <p>잠시 후 다시 시도해주세요.</p>
                    </div>
                `;
            });
    },

    '#mission': () => {
        const content = `
            <h1 class="page-title">미션</h1>
            <div class="card-grid">
                <div class="card">
                    <span class="material-icons">lock_clock</span>
                    <h2>곧 공개됩니다</h2>
                    <p>새로운 미션이 곧 추가될 예정입니다. 조금만 기다려주세요!</p>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
    }
};

// Initialize router
const router = new Router(routes); 