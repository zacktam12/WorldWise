import { createContext, useState, useEffect, useContext } from "react";
const BASE_URL = `http://localhost:9000`;
const citiesContext = createContext();

const intialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
};

function reducer(state, action) {

  switch(action.type){
    case "loading":
      return{
        ...state,isLoading:true
      }
    case "cities/loaded":
      return{
        ...state,isLoading:false,cities:action.payLoad
      }
    case "cities/created":
      return { ...state,currentCity:action.payLoad}
  
    case "cities/deleted":
    case "error":
      return { ...state,currentCity:action.payLoad}
    case "rejected":
      return{
        ...state,
      }
  
  default:
     throw new Error("Unknown action type");
}


function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    intialState
  );

  useEffect(function () {
    async function fetchCities() {
      dispatch({type:"loading"})
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
      dispatch({type:"cities/loaded",payLoad:data})    
  } 
  catch (e) {
        dispatch({type:"rejected" ,payLoad:"There was an error loading data..."
          
        });
      } 
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch (e) {
      alert("There was an error loading data...");
    } finally {
      setIsLoading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      setCities(() => [...cities, data]);
      setCurrentCity(data);
    } catch (e) {
      alert("There was an error Creating data...");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities(() => cities.filter((city) => city.id !== id));
    } catch (e) {
      alert("There was an error deleting city...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <citiesContext.Provider
      value={{
        isLoading,
        cities,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </citiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(citiesContext);
  if (!context) throw new Error("cities conxet is using outside cityProvider");
  return context;
}
export { CitiesProvider, useCities };
