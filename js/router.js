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
        const missionResults = JSON.parse(localStorage.getItem('missionResults') || '{}');
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
                        const result = missionResults[restaurant.id] || {};
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
                                <div class="mission-result" style="margin-top: 1rem;">
                                    <p><strong>내 후기:</strong> ${result.review ? result.review : '<span style=\'color:#aaa\'>미입력</span>'}</p>
                                    <p><strong>별점:</strong> ${result.rating ? '⭐'.repeat(result.rating) : '<span style=\'color:#aaa\'>미입력</span>'}</p>
                                </div>
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
        fetch('missions.json')
            .then(res => res.json())
            .then(missions => {
                const missionResults = JSON.parse(localStorage.getItem('missionCompletions') || '{}');
                let content = `<h1 class="page-title">미션</h1><div class="grid">`;
                missions.forEach(m => {
                    const isDone = !!missionResults[m.id];
                    content += `
                        <div class="card mission-card" style="position:relative;">
                            <h2 style="margin-bottom:0.5rem;">${m.title}</h2>
                            <p style="color:#666;">${m.description}</p>
                            <div style="margin:1rem 0;">
                                <span class="badge" style="background:#2563eb;color:white;padding:0.3em 0.8em;border-radius:1em;font-size:0.9em;">${m.reward}</span>
                            </div>
                            <button class="button mission-btn" data-id="${m.id}" style="width:100%;margin-top:1rem;" ${isDone ? '' : ''}>${isDone ? '완료됨' : '참여하기'}</button>
                            ${isDone ? '<div class="badge" style="position:absolute;top:1rem;right:1rem;background:#16a34a;color:white;padding:0.3em 0.8em;border-radius:1em;font-size:0.9em;">완료</div>' : ''}
                        </div>
                    `;
                });
                content += '</div>';
                document.getElementById('main-content').innerHTML = content;
                document.querySelectorAll('.mission-btn').forEach(btn => {
                    btn.onclick = function() {
                        const id = Number(this.dataset.id);
                        const missionResults = JSON.parse(localStorage.getItem('missionCompletions') || '{}');
                        if (missionResults[id]) {
                            window.location.hash = '#mission-history';
                        } else {
                            showMissionDetail(id);
                        }
                    };
                });
            });
    },

    '#suggest': () => {
        let content = `
            <h1 class="page-title">추천 맛집</h1>
            <div class="card">
                <h2>맛집 추천 등록</h2>
                <form id="suggest-form">
                    <input type="text" id="suggest-name" placeholder="맛집 이름" required style="width:100%;margin-bottom:8px;padding:8px;">
                    <input type="text" id="suggest-address" placeholder="주소" required style="width:100%;margin-bottom:8px;padding:8px;">
                    <input type="text" id="suggest-desc" placeholder="설명" required style="width:100%;margin-bottom:8px;padding:8px;">
                    <input type="number" id="suggest-lat" placeholder="위도(예: 37.5665)" required step="any" style="width:49%;margin-bottom:8px;padding:8px;">
                    <input type="number" id="suggest-lng" placeholder="경도(예: 126.978)" required step="any" style="width:49%;margin-bottom:8px;padding:8px;float:right;">
                    <button type="submit" class="button" style="width:100%;margin-top:8px;">추천 등록</button>
                </form>
            </div>
            <div class="card" style="margin-top:2rem;">
                <h2>추천 대기 맛집 목록</h2>
                <div id="suggested-list"></div>
            </div>
        `;
        document.getElementById('main-content').innerHTML = content;
        renderSuggestedList();
        document.getElementById('suggest-form').onsubmit = function(e) {
            e.preventDefault();
            const name = document.getElementById('suggest-name').value.trim();
            const address = document.getElementById('suggest-address').value.trim();
            const desc = document.getElementById('suggest-desc').value.trim();
            const lat = parseFloat(document.getElementById('suggest-lat').value);
            const lng = parseFloat(document.getElementById('suggest-lng').value);
            if (!name || !address || !desc || isNaN(lat) || isNaN(lng)) return alert('모든 항목을 입력해주세요!');
            let suggested = JSON.parse(localStorage.getItem('suggestedRestaurants') || '[]');
            suggested.push({ id: Date.now(), name, address, description: desc, lat, lng, votes: 0, voters: [] });
            localStorage.setItem('suggestedRestaurants', JSON.stringify(suggested));
            alert('추천이 등록되었습니다!');
            this.reset();
            renderSuggestedList();
        };
    },

    '#mission-history': () => {
        fetch('missions.json')
            .then(res => res.json())
            .then(missions => {
                const missionResults = JSON.parse(localStorage.getItem('missionCompletions') || '{}');
                let completed = missions.filter(m => missionResults[m.id]);
                let content = `<h1 class="page-title">내 미션 히스토리</h1>`;
                if (completed.length === 0) {
                    content += `<div class="card"><h2>아직 완료한 미션이 없습니다.</h2></div>`;
                } else {
                    content += '<div class="card-grid">';
                    completed.forEach(m => {
                        const result = missionResults[m.id];
                        content += `<div class="card">
                            <h2 style="margin-bottom:0.5rem;">${m.title}</h2>
                            <p style="color:#666;">${m.description}</p>
                            <div style="margin:1rem 0;">
                                <span class="badge" style="background:#2563eb;color:white;padding:0.3em 0.8em;border-radius:1em;font-size:0.9em;">${m.reward}</span>
                            </div>
                            <div style="color:#16a34a;font-weight:bold;">완료일: ${new Date(result.date).toLocaleString()}</div>
                            ${result.review ? `<div style='margin-top:0.5rem;'><b>리뷰:</b> ${result.review}</div>` : ''}
                        </div>`;
                    });
                    content += '</div>';
                }
                content += `<button class="button" style="margin-top:2rem;" onclick="window.location.hash='#mission'">미션 목록으로</button>`;
                document.getElementById('main-content').innerHTML = content;
            });
    }
};

function renderSuggestedList() {
    let suggested = JSON.parse(localStorage.getItem('suggestedRestaurants') || '[]');
    let userId = localStorage.getItem('userId') || (function(){ const id = 'u'+Date.now(); localStorage.setItem('userId',id); return id; })();
    let html = '';
    if (suggested.length === 0) {
        html = '<p style="color:#888;">아직 추천된 맛집이 없습니다.</p>';
    } else {
        html = '<ul style="list-style:none;padding:0;">';
        suggested.forEach(r => {
            const voted = r.voters && r.voters.includes(userId);
            html += `<li class="card" style="margin-bottom:1rem;">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div>
                        <b>${r.name}</b><br>
                        <span style="color:#666;">${r.address}</span><br>
                        <span style="color:#888;">${r.description}</span>
                    </div>
                    <div style="text-align:right;">
                        <button class="button vote-btn" data-id="${r.id}" style="margin-bottom:0.5rem;${voted ? 'background:#eee;color:#2563eb;' : ''}">👍 ${voted ? '투표 취소' : '투표'}</button><br>
                        <span style="font-size:1.1rem;">득표: <b>${r.votes}</b></span>
                    </div>
                </div>
            </li>`;
        });
        html += '</ul>';
    }
    document.getElementById('suggested-list').innerHTML = html;
    // 투표 버튼 이벤트
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.onclick = function() {
            const id = Number(this.dataset.id);
            let suggested = JSON.parse(localStorage.getItem('suggestedRestaurants') || '[]');
            let userId = localStorage.getItem('userId') || (function(){ const id = 'u'+Date.now(); localStorage.setItem('userId',id); return id; })();
            let r = suggested.find(x => x.id === id);
            if (!r) return;
            r.voters = r.voters||[];
            const voted = r.voters.includes(userId);
            if (voted) {
                // 투표 취소
                r.votes = Math.max(0, (r.votes||1)-1);
                r.voters = r.voters.filter(uid => uid !== userId);
                alert('투표가 취소되었습니다!');
            } else {
                // 투표
                r.votes = (r.votes||0)+1;
                r.voters.push(userId);
                alert('투표가 반영되었습니다!');
            }
            // 5표 이상이면 공식 맛집으로 이동
            if (r.votes >= 5) {
                let main = JSON.parse(localStorage.getItem('mainRestaurants') || '[]');
                main.push({ ...r, highlightUntil: Date.now() + 7*24*60*60*1000 });
                localStorage.setItem('mainRestaurants', JSON.stringify(main));
                suggested = suggested.filter(x => x.id !== id);
                alert('공식 맛집으로 등록되었습니다! (7일간 하이라이트)');
            }
            localStorage.setItem('suggestedRestaurants', JSON.stringify(suggested));
            renderSuggestedList();
        };
    });
}

// 미션 상세에서 '미션 목록으로' 버튼 동작 연결
function showMissionDetail(missionId) {
    fetch('missions.json')
        .then(res => res.json())
        .then(missions => {
            const m = missions.find(x => x.id === missionId);
            if (!m) return;
            const missionResults = JSON.parse(localStorage.getItem('missionCompletions') || '{}');
            let content = `<div class="card" style="max-width:500px;margin:2rem auto;">
                <h2 style="margin-bottom:0.5rem;">${m.title}</h2>
                <p style="color:#666;">${m.description}</p>
                <div style="margin:1rem 0;">
                    <span class="badge" style="background:#2563eb;color:white;padding:0.3em 0.8em;border-radius:1em;font-size:0.9em;">${m.reward}</span>
                </div>
            `;
            if (missionResults[m.id]) {
                content += `<div class="badge" style="background:#16a34a;color:white;padding:0.3em 0.8em;border-radius:1em;font-size:0.9em;">이미 완료한 미션입니다!</div>`;
                content += `<button class="button" id="to-mission-history-btn" style="margin-top:1.5rem;">내 미션 히스토리</button>`;
            } else {
                if (m.type === 'visit') {
                    content += `<button class="button" id="visit-mission-btn">위치 인증하기</button>`;
                } else if (m.type === 'review') {
                    content += `<textarea id="review-mission-input" rows="3" style="width:100%;margin:1rem 0;padding:8px;border-radius:5px;border:1px solid #ddd;" placeholder="한 줄 리뷰를 남겨주세요!"></textarea><button class="button" id="review-mission-btn">리뷰 제출</button>`;
                } else if (m.type === 'vote') {
                    content += `<button class="button" id="vote-mission-btn">추천 맛집 투표하러 가기</button>`;
                }
            }
            content += `<button class="button" id="to-mission-list-btn" style="margin-top:1.5rem;background:#eee;color:#333;">미션 목록으로</button></div>`;
            document.getElementById('main-content').innerHTML = content;
            // 미션 목록으로 버튼 동작
            document.getElementById('to-mission-list-btn').onclick = function() {
                window.location.hash = '#mission';
            };
            // 완료된 미션일 때 히스토리로 이동 버튼 동작
            if (missionResults[m.id]) {
                document.getElementById('to-mission-history-btn').onclick = function() {
                    window.location.hash = '#mission-history';
                };
            }
            if (!missionResults[m.id]) {
                if (m.type === 'visit') {
                    document.getElementById('visit-mission-btn').onclick = function() {
                        if (!navigator.geolocation) return alert('위치 권한이 필요합니다!');
                        navigator.geolocation.getCurrentPosition(pos => {
                            missionResults[m.id] = { completed: true, date: Date.now() };
                            localStorage.setItem('missionCompletions', JSON.stringify(missionResults));
                            alert('위치 인증 미션 완료!');
                            window.location.hash = '#mission';
                        }, err => {
                            alert('위치 인증에 실패했습니다.');
                        });
                    };
                } else if (m.type === 'review') {
                    document.getElementById('review-mission-btn').onclick = function() {
                        const val = document.getElementById('review-mission-input').value.trim();
                        if (!val) return alert('리뷰를 입력해주세요!');
                        missionResults[m.id] = { completed: true, review: val, date: Date.now() };
                        localStorage.setItem('missionCompletions', JSON.stringify(missionResults));
                        alert('리뷰 미션 완료!');
                        window.location.hash = '#mission';
                    };
                } else if (m.type === 'vote') {
                    document.getElementById('vote-mission-btn').onclick = function() {
                        window.location.hash = '#suggest';
                    };
                }
            }
        });
}

// Initialize router
const router = new Router(routes); 