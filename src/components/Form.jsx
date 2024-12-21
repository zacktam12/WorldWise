// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
import { useEffect, useState } from "react";
import { UseUrlPosition } from "../Hooks/UseUrlPosition";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import Message from "./Message";
import Spinner from "./Spinner";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());

  return String.fromCodePoint(...codePoints);
}
const BASE_URL = `https://api.bigdatacloud.net/data/reverse-geocode-client`;
function Form() {
  const [lat, lng] = UseUrlPosition();
  console.log(convertToEmoji("US")); // Should log 🇺🇸

  const [isLodingGeocoding, setIsLodingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState();
  const [geoCodingError, setGeocodingError] = useState("");

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          setIsLodingGeocoding(true);
          setGeocodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city ,please click somewhere else"
            );

          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLodingGeocoding(false);
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );
  function handleSubmit(e) {
    e.preventDefault();
  }

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;
  if (isLodingGeocoding) return <Spinner />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <DatePicker />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
