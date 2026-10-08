import {
  useState,
} from "react";
import AuthContext from "./authContextValue";

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(() => {

    const savedUser =
      sessionStorage.getItem("currentUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  const login = (user) => {

    setCurrentUser(user);

    sessionStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );
  };


  const logout = () => {

    setCurrentUser(null);

    sessionStorage.removeItem("currentUser");

    sessionStorage.removeItem("currentPage");

    sessionStorage.removeItem("selectedRequestId");
  };


  const isLoggedIn =
    currentUser !== null;

  const role =
    currentUser?.role || null;


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}