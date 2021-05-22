import React from "react";
import { Authcontext } from "./context/auth-context";
import { UserAuth } from "./hooks/Auth-houks";
import { Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import NavLogin from "./components/nav-login";
import MenuDrawer from './components/menu'

function App() {
  const { user, token, login, logout } = UserAuth();
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" exact component={Home} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" exact component={Login} />
      </React.Fragment>
    );
  }
  return (
    <div>
      <Authcontext.Provider
        value={{ user: user, token: token, login: login, logout: logout }}
      >
        <BrowserRouter>
          {!token ? <NavLogin /> : <MenuDrawer content={routes} />}

          {!token && routes}
        </BrowserRouter>
      </Authcontext.Provider>
    </div>
  );
}

export default App;
