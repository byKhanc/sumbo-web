'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// leaflet 기본 마커 아이콘 설정
const defaultIcon = L.icon({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

export default function TreasureMapClient() {
  useEffect(() => {
    // 개발자 도구에서 console log로 진입 여부 확인
    console.log('📍 TreasureMapClient 렌더링됨');
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={[37.5665, 126.978]}
        zoom={13}
        style={{ height: '100%', width: '100%', position: 'absolute' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[37.5665, 126.978]}>
          <Popup>숨겨진 보물 위치입니다!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
