// Map initialization and functionality
let map = null;
let userMarker = null;
let watchId = null;

function initMap() {
    if (map) {
        map.remove();
    }

    // Initialize map
    map = L.map('map-container').setView([37.5665, 126.978], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Sample treasures data
    const treasures = [
        { lat: 37.5665, lng: 126.978, name: "시청 광장 보물", hint: "분수대 근처를 찾아보세요" },
        { lat: 37.5707, lng: 126.9762, name: "경복궁 보물", hint: "정문 주변을 살펴보세요" },
        { lat: 37.5639, lng: 126.9816, name: "남대문 보물", hint: "성벽을 따라가보세요" }
    ];

    // Add treasure markers
    treasures.forEach(treasure => {
        const marker = L.marker([treasure.lat, treasure.lng])
            .bindPopup(`<b>${treasure.name}</b><br>${treasure.hint}`)
            .addTo(map);
    });

    // Start tracking user location
    startLocationTracking();
}

function startLocationTracking() {
    if ("geolocation" in navigator) {
        // Create user location marker
        const userIcon = L.icon({
            iconUrl: '/default-marker.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
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
} 