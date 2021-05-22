import { useState, useCallback, useEffect } from "react";



export const UserAuth = () => {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(false);

  const login = useCallback((user, token) => {
    setToken(token);
    setUser(user);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        user: user,
        token: token
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("userData");
  }, []);



  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token 
    ) {
      login(
        storedData.user,
        storedData.token
      );
    }
  }, [login]);

  return { token, login, logout, user };
};
