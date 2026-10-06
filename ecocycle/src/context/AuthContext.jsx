import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(() => {

    const savedUser =
      localStorage.getItem("currentUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });


  const login = (user) => {

    setCurrentUser(user);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );
  };


  const logout = () => {

    setCurrentUser(null);

    localStorage.removeItem("currentUser");

    localStorage.removeItem("currentPage");

    localStorage.removeItem("selectedRequestId");
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


export function useAuth() {
  return useContext(AuthContext);
}