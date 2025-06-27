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
    const restaurants = await response.json();
    restaurantMarkers = [];
    restaurants.forEach(r => {
        const isVisited = visitedRestaurants.includes(r.id);
        const marker = L.marker([r.lat, r.lng])
            .bindPopup(createRestaurantPopup(r, isVisited))
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

    // Start tracking user location and mission
    startLocationTracking(restaurants);
}

function createRestaurantPopup(restaurant, isVisited) {
    const visitedBadge = isVisited ? '<span style="color: green; font-weight: bold;">✓ 방문완료</span><br>' : '';
    return `
        <div style="min-width: 200px;">
            <h3 style="margin: 0 0 10px 0;">${restaurant.name}</h3>
            ${visitedBadge}
            <p style="margin: 5px 0;"><strong>카테고리:</strong> ${restaurant.category}</p>
            <p style="margin: 5px 0;"><strong>주소:</strong> ${restaurant.address}</p>
            <p style="margin: 5px 0;"><strong>설명:</strong> ${restaurant.description}</p>
            <p style="margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                <strong>미션:</strong> ${restaurant.mission}
            </p>
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
    
    // Show mission completion modal
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
        marker.setPopupContent(createRestaurantPopup(restaurant, true));
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
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #2563eb;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
            ">확인</button>
        </div>
    `;
    
    document.body.appendChild(modal);
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