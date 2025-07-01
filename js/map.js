// Map initialization and functionality
let map = null;
let userMarker = null;
let watchId = null;
let restaurantMarkers = [];
let visitedRestaurants = JSON.parse(localStorage.getItem('visitedRestaurants') || '[]');

async function initMap() {
    if (map) {
        map.remove();
    }
    // Initialize map
    map = L.map('map-container').setView([37.5665, 126.978], 13);
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Load restaurant data
    const response = await fetch('restaurants.json');
    let restaurants = await response.json();
    // Merge with mainRestaurants (from localStorage)
    let main = JSON.parse(localStorage.getItem('mainRestaurants') || '[]');
    // Remove expired highlights
    main = main.filter(r => !r.highlightUntil || r.highlightUntil > Date.now());
    localStorage.setItem('mainRestaurants', JSON.stringify(main));
    // Merge, avoiding duplicates
    const ids = new Set(restaurants.map(r => r.id));
    main.forEach(r => { if (!ids.has(r.id)) restaurants.push(r); });
    restaurantMarkers = [];
    restaurants.forEach(r => {
        const isVisited = visitedRestaurants.includes(r.id);
        const isHighlight = r.highlightUntil && r.highlightUntil > Date.now();
        const likes = (JSON.parse(localStorage.getItem('restaurantLikes')||'{}')[r.id]||0);
        const popup = createRestaurantPopup(r, isVisited, isHighlight, likes);
        const marker = L.marker([r.lat, r.lng])
            .bindPopup(popup)
            .addTo(map);
        marker.restaurantData = r;
        restaurantMarkers.push(marker);
        // Set visited marker color if already visited
        if (isVisited) {
            marker.setIcon(L.icon({
                iconUrl: '/images/markers/visited-marker.svg',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            }));
        }
    });
    // Like button event delegation
    map.on('popupopen', function(e) {
        const btn = document.getElementById('like-btn');
        if (btn) {
            btn.onclick = function() {
                const rid = btn.dataset.id;
                let likes = JSON.parse(localStorage.getItem('restaurantLikes')||'{}');
                let userId = localStorage.getItem('userId') || (function(){ const id = 'u'+Date.now(); localStorage.setItem('userId',id); return id; })();
                likes[rid] = likes[rid] || 0;
                let userLikes = JSON.parse(localStorage.getItem('userLikes')||'{}');
                userLikes[rid] = userLikes[rid]||[];
                const alreadyLiked = userLikes[rid].includes(userId);
                if (alreadyLiked) {
                    // 취소
                    likes[rid] = Math.max(0, likes[rid]-1);
                    userLikes[rid] = userLikes[rid].filter(uid => uid !== userId);
                    localStorage.setItem('restaurantLikes', JSON.stringify(likes));
                    localStorage.setItem('userLikes', JSON.stringify(userLikes));
                    // 하이라이트 해제
                    if (likes[rid] < 10) {
                        let main = JSON.parse(localStorage.getItem('mainRestaurants')||'[]');
                        let found = main.find(x=>x.id==rid);
                        if (found) found.highlightUntil = 0;
                        localStorage.setItem('mainRestaurants', JSON.stringify(main));
                    }
                    alert('좋아요가 취소되었습니다!');
                } else {
                    // 좋아요
                    likes[rid]++;
                    userLikes[rid].push(userId);
                    localStorage.setItem('restaurantLikes', JSON.stringify(likes));
                    localStorage.setItem('userLikes', JSON.stringify(userLikes));
                    // 하이라이트 처리
                    if (likes[rid] >= 10) {
                        let main = JSON.parse(localStorage.getItem('mainRestaurants')||'[]');
                        let found = main.find(x=>x.id==rid);
                        if (found) found.highlightUntil = Date.now() + 7*24*60*60*1000;
                        else main.push({ ...restaurants.find(x=>x.id==rid), highlightUntil: Date.now() + 7*24*60*60*1000 });
                        localStorage.setItem('mainRestaurants', JSON.stringify(main));
                    }
                    alert('좋아요가 반영되었습니다!');
                }
                // 좋아요/하이라이트 등 UI 즉시 갱신
                restaurantMarkers.forEach(marker => {
                    const r = marker.restaurantData;
                    const isVisited = visitedRestaurants.includes(r.id);
                    const isHighlight = r.highlightUntil && r.highlightUntil > Date.now();
                    const likesCount = (JSON.parse(localStorage.getItem('restaurantLikes')||'{}')[r.id]||0);
                    marker.setPopupContent(createRestaurantPopup(r, isVisited, isHighlight, likesCount));
                });
                // 팝업 다시 열기 (현재 마커)
                const marker = restaurantMarkers.find(m => m.restaurantData.id == rid);
                if (marker) marker.openPopup();
            };
        }
    });
    // Start tracking user location and mission
    startLocationTracking(restaurants);
}

function createRestaurantPopup(restaurant, isVisited, isHighlight, likes) {
    const visitedBadge = isVisited ? '<span style="color: green; font-weight: bold;">✓ 방문완료</span><br>' : '';
    const highlightStar = isHighlight ? '<span style="color: gold; font-size:1.5em;">★</span> <b style="color:gold">하이라이트</b><br>' : '';
    const likeBtn = `<button id="like-btn" data-id="${restaurant.id}" style="background:#ffe066;color:#333;border:none;padding:4px 10px;border-radius:5px;cursor:pointer;font-size:1em;">👍 좋아요</button> <span style="font-size:1.1em;">${likes}명</span>`;
    return `
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0;">${restaurant.name}</h3>
            ${highlightStar}
            ${visitedBadge}
            <p style="margin: 5px 0;"><strong>카테고리:</strong> ${restaurant.category||''}</p>
            <p style="margin: 5px 0;"><strong>주소:</strong> ${restaurant.address||''}</p>
            <p style="margin: 5px 0;"><strong>설명:</strong> ${restaurant.description||''}</p>
            <p style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <strong>미션:</strong> ${restaurant.mission||''}
            </p>
            <div style="margin:10px 0;">${likeBtn}</div>
        </div>
    `;
}

function startLocationTracking(restaurants) {
    if ("geolocation" in navigator) {
        // Create user location marker
        const userIcon = L.icon({
            iconUrl: '/images/markers/default-marker.svg',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });

        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (!userMarker) {
                    userMarker = L.marker([latitude, longitude], { icon: userIcon })
                        .bindPopup('현재 위치')
                        .addTo(map);
                } else {
                    userMarker.setLatLng([latitude, longitude]);
                }
                // Center map on user's location
                map.setView([latitude, longitude]);
                // Check for mission success (within 50m)
                restaurants.forEach(r => {
                    const dist = getDistanceFromLatLonInM(latitude, longitude, r.lat, r.lng);
                    if (dist < 50 && !visitedRestaurants.includes(r.id)) {
                        completeMission(r);
                    }
                });
            },
            (error) => {
                console.error('위치 추적 오류:', error);
                alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            }
        );
    } else {
        alert('이 브라우저에서는 위치 추적이 지원되지 않습니다.');
    }
}

function completeMission(restaurant) {
    visitedRestaurants.push(restaurant.id);
    localStorage.setItem('visitedRestaurants', JSON.stringify(visitedRestaurants));
    // Show mission completion modal with input
    showMissionModal(restaurant);
    // Update marker color
    const marker = restaurantMarkers.find(m => m.restaurantData.id === restaurant.id);
    if (marker) {
        marker.setIcon(L.icon({
            iconUrl: '/images/markers/visited-marker.svg',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        }));
        marker.setPopupContent(createRestaurantPopup(restaurant, true, false, 0));
    }
}

function showMissionModal(restaurant) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    // 미션 입력 폼
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <h2 style="color: #16a34a; margin-bottom: 20px;">🎉 미션 성공!</h2>
            <h3 style="margin-bottom: 15px;">${restaurant.name}</h3>
            <p style="margin-bottom: 20px; color: #666;">${restaurant.mission}</p>
            <form id="mission-form">
                <textarea id="mission-review" rows="3" style="width: 100%; border-radius: 5px; border: 1px solid #ddd; padding: 8px; margin-bottom: 10px;" placeholder="한 줄 후기를 남겨보세요!"></textarea>
                <div style="margin-bottom: 15px;">
                    <label for="mission-rating">별점: </label>
                    <select id="mission-rating" style="font-size: 1.1rem;">
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>
                    </select>
                </div>
                <button type="submit" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">미션 저장</button>
            </form>
            <button id="mission-close-btn" style="margin-top: 15px; background: #eee; color: #333; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">닫기</button>
        </div>
    `;
    document.body.appendChild(modal);
    // 닫기 버튼
    modal.querySelector('#mission-close-btn').onclick = () => modal.remove();
    // 폼 제출
    modal.querySelector('#mission-form').onsubmit = function(e) {
        e.preventDefault();
        const review = modal.querySelector('#mission-review').value.trim();
        const rating = modal.querySelector('#mission-rating').value;
        // 저장
        let missionResults = JSON.parse(localStorage.getItem('missionResults') || '{}');
        missionResults[restaurant.id] = { review, rating };
        localStorage.setItem('missionResults', JSON.stringify(missionResults));
        alert('미션 결과가 저장되었습니다!');
        modal.remove();
    };
}

// 거리 계산 함수
function getDistanceFromLatLonInM(lat1, lon1, lat2, lon2) {
    const R = 6371000; // m
    const dLat = (lat2-lat1) * Math.PI/180;
    const dLon = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Cleanup function
function cleanupMap() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    if (map) {
        map.remove();
        map = null;
    }
    userMarker = null;
    restaurantMarkers = [];
} 