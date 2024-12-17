import { useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
function Map() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  return (
    <div className={styles.mapContainer}>
      Map
      <h1>
        position:{lat} ,{lng}
      </h1>
      <button
        onClick={() => {
          setSearchParams({ lat: 53, lng: 24 });
        }}
      >
        change port
      </button>
    </div>
  );
}

export default Map;
