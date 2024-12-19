import { useNavigate, useSearchParams } from "react-router-dom";

import styles from "./Map.module.css";
import { MapContainer, TileLayer, Popup, Marker, useMap } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
function Map() {
  const navigate = useNavigate();
  const { cities } = useCities();

  const [searchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  const [mapPositon, setMapPosition] = useState([51.505, -0.09]);
  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  return (
    <div
      className={styles.mapContainer}
      // onClick={() => {
      //   navigate("form");
      // }}
    >
      <MapContainer
        className={styles.map}
        // center={[mapLat, mapLng]}
        center={mapPositon}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPositon} />
      </MapContainer>
    </div>
  );
  function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
  }
}

export default Map;
