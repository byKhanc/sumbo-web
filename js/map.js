// Map initialization and functionality
let map = null;
let userMarker = null;
let watchId = null;
let restaurantMarkers = [];

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
        const marker = L.marker([r.lat, r.lng])
            .bindPopup(`<b>${r.name}</b><br>${r.address}`)
            .addTo(map);
        marker.restaurantData = r;
        restaurantMarkers.push(marker);
    });

    // Start tracking user location and mission
    startLocationTracking(restaurants);
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
                    if (dist < 50 && !r._visited) {
                        r._visited = true;
                        alert(`미션 성공! [${r.name}]에 도착했습니다.`);
                        // Change marker color to visited
                        const marker = restaurantMarkers.find(m => m.restaurantData.name === r.name);
                        if (marker) {
                            marker.setIcon(L.icon({
                                iconUrl: '/images/markers/visited-marker.svg',
                                iconSize: [30, 30],
                                iconAnchor: [15, 30],
                                popupAnchor: [0, -30]
                            }));
                        }
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