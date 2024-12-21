import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
import { useGeolocation } from "../Hooks/UseGeoLocation";
import { UseUrlPosition } from "../Hooks/UseUrlPosition";
import Button from "./Button";
import styles from "./Map.module.css";
import { map } from "leaflet";

function Map() {
  const { cities } = useCities();

  const [mapPositon, setMapPosition] = useState([51.505, -0.09]);

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = UseUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([parseFloat(lat), parseFloat(lng)]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (geoLocationPosition)
        setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    },
    [geoLocationPosition]
  );
  // useEffect(() => {
  //   if (cities.length > 0) {
  //     const bounds = cities.map((city) => [
  //       city.position.lat,
  //       city.position.lng,
  //     ]);
  //     map.fitBounds(bounds);
  //   }
  // }, [cities]);

  return (
    <div className={styles.mapContainer}>
      {" "}
      {!geoLocationPosition && (
        <Button
          type="position"
          onClick={getPosition}
          disabled={isLoadingPosition}
        >
          {isLoadingPosition ? "loading..." : "use your position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        // center={[lat, lng]}
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
        <DetectClick />
      </MapContainer>
    </div>
  );
}
function ChangeCenter({ position }) {
  const map = useMap();
  useEffect(
    function () {
      map.setView(position);
    },
    [position, map]
  );
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
