import React, { useEffect, useRef, useState } from 'react';
const { kakao } = window;

const MapForUpdate = ({ markerInfo, setMarkerInfo, posts }) => {
  console.log('map에 posts', posts);
  console.log('markerInfo', markerInfo);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);
  const [map, setMap] = useState(null);
  // const [markerInfo, setMarkerInfo] = useState(null);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(posts.latLng.latitude, posts.latLng.longitude),
      level: 4, // 확대/축소 레벨
    };
    //지도 생성 및 객체 리턴
    const newMap = new kakao.maps.Map(container, options);
    // [ ] test
    // let marker = new kakao.maps.Marker({
    //   map: newMap,
    //   position: new kakao.maps.LatLng(posts.latLng.latitude, posts.latLng.longitude),
    // });
    // marker.setMap(newMap);
    const position = new kakao.maps.LatLng(posts.latLng.latitude, posts.latLng.longitude);
    markerRef.current = new kakao.maps.Marker({
      position,
    });
    markerRef.current.setMap(newMap);

    // 지도를 클릭했을 때 이벤트 핸들러(핀생성)
    const mapClickHandler = mouseEvent => {
      const position = mouseEvent.latLng;
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      markerRef.current = new kakao.maps.Marker({
        position,
      });
      markerRef.current.setMap(newMap);
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.coord2Address(position.getLng(), position.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          setMarkerInfo({ position, address });
          showCustomOverlay(newMap, position, address);
        }
      });
    };

    kakao.maps.event.addListener(newMap, 'click', mapClickHandler);
    const zoomControl = new kakao.maps.ZoomControl();
    newMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    newMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    setMap(newMap);
  }, []);

  const showCustomOverlay = (map, position, text) => {
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }

    const content = `
    <div style="position: absolute; left: 50%; bottom: 40px; transform: translateX(-50%); background-color: #fff; padding: 5px; font-size: 12px; font-weight:800; border:2px solid">
    주소: ${posts.address}
  </div>
    `;

    const customOverlay = new kakao.maps.CustomOverlay({
      content,
      position,
      yAnchor: 1,
    });

    overlayRef.current = customOverlay;
    customOverlay.setMap(map);
  };

  const searchHandler = () => {
    const keyword = document.getElementById('search-input').value;
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        if (overlayRef.current) {
          overlayRef.current.setMap(null);
          overlayRef.current = null;
        }

        data.forEach(place => {
          const position = new kakao.maps.LatLng(place.y, place.x);
          bounds.extend(position);
          const marker = new kakao.maps.Marker({
            position: position,
          });
          marker.setMap(map);
          kakao.maps.event.addListener(marker, 'click', () => {
            const address = place.address_name;
            setMarkerInfo({ position, address });
            showCustomOverlay(map, position, address);
          });
        });

        map.setBounds(bounds);
        setSearchError(false);
      } else {
        setSearchError(true);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        if (overlayRef.current) {
          overlayRef.current.setMap(null);
          overlayRef.current = null;
        }
      }
    });
  };
  const handleOnKeyPress = e => {
    e.preventDefault();
    if (e.key === 'Enter') {
      searchHandler(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };
  return (
    <div>
      <div>
        <input id="search-input" type="text" placeholder="장소를 검색하세요" onKeyPress={handleOnKeyPress} />
        <button type="button" onClick={searchHandler}>
          검색
        </button>
      </div>
      {searchError && <p>해당 장소를 찾을 수 없습니다.</p>}
      {markerInfo && (
        <div>
          <p>
            좌표: {markerInfo.position.getLat()}, {markerInfo.position.getLng()}
          </p>
          <p>주소: {markerInfo.address}</p>
        </div>
      )}
      <div ref={mapRef} style={{ width: '500px', height: '500px' }} />
    </div>
  );
};
export default MapForUpdate;
