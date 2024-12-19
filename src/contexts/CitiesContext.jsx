import { createContext, useState, useEffect, useContext } from "react";
const BASE_URL = `http://localhost:9000`;
const citiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch (e) {
        alert("There was an error loading data...");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  return (
    <citiesContext.Provider value={{ isLoading, cities }}>
      {children}
    </citiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(citiesContext);
  if (context) throw new Error("cities conxet is using outside cityProvider");
  return context;
}
export { CitiesProvider, useCities };
