import { createContext, useContext, useReducer } from "react";
const AuthoContext = createContext();
const intialState = {
  user: null,
  isAuthenticated: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      throw new Error("unknown action type");
  }
}

function AuthoProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    intialState
  );

  function Login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }
  function Logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthoContext.Provider value={{ user, isAuthenticated, Login, Logout }}>
      {children}
    </AuthoContext.Provider>
  );
}
function useAutho() {
  const context = useContext(AuthoContext);
  if (context === undefined)
    throw new Error("useAuthon must be used within a AuthProvider");
}
export { AuthoProvider, useAutho };