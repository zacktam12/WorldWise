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
    case "city/created":
      return { ...state,isLoading:false,cities:[...state.cities,action.payLoad]}
   case "cities/loaded":
    return{
      ...state,isLoading:false,currentCity:action.payLoad
    };
    case "city/deleted":
           return { ...state,isLoading:false, cities:state.cities.filter((city) => city.id !== action.payload),

      }
   
    case "rejected":
      return{
        ...state,error:action.payLoad,isLoading:false
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
        dispatch({type:"rejected" ,payLoad:"There was an error loading cities..."

        });
      } 
    }
    fetchCities();
  }, []);

  async function getCity(id) {
          dispatch({type:"loading"})
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({type:"city/loaded",payLoad:data})    
    } catch (e) {
        dispatch({type:"rejected" ,payLoad:"There was an error loading city..."
    } )
  }

  async function createCity(newCity) {
          dispatch({type:"loading"})

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
dispatch({type:"cities/created" ,payload:data})   

} catch (e) {
        dispatch({type:"rejected" ,payLoad:"There was an error creating city..."}) 
  }

  async function deleteCity(id) {
          dispatch({type:"loading"})

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
dispatch({type:"cities/deleted" ,payLoad:id})    } catch (e) {
        dispatch({type:"rejected" ,payLoad:"There was an error deleting city..."
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
