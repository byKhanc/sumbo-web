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
                    <h2>보물 지도</h2>
                    <p>실시간으로 주변의 숨겨진 보물들을 찾아보세요.</p>
                    <a href="#treasuremap">지도 보기 →</a>
                </div>
                <div class="card">
                    <span class="material-icons">diamond</span>
                    <h2>내 보물</h2>
                    <p>지금까지 발견한 보물들을 확인해보세요.</p>
                    <a href="#mytreasures">보물 확인하기 →</a>
                </div>
                <div class="card">
                    <span class="material-icons">task</span>
                    <h2>미션</h2>
                    <p>새로운 미션을 수행하고 보물을 찾아보세요.</p>
                    <a href="#mission">미션 시작하기 →</a>
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
        const content = `
            <h1 class="page-title">내 보물</h1>
            <div class="card-grid">
                <div class="card">
                    <span class="material-icons">stars</span>
                    <h2>아직 보물이 없습니다</h2>
                    <p>보물지도에서 새로운 보물을 찾아보세요!</p>
                    <a href="#treasuremap">보물 찾으러 가기 →</a>
                </div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
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