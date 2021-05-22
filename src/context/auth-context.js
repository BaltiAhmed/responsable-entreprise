import { createContext } from "react";

export const Authcontext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  

});
