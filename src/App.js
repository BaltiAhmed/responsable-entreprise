import React from "react";
import { Authcontext } from "./context/auth-context";
import { UserAuth } from "./hooks/Auth-houks";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import NavLogin from "./components/nav-login";
import MenuDrawer from "./components/menu";
import AjoutSerice from "./pages/services/ajout-service";
import ListeService from "./pages/services/liste-service";
import UpdateService from "./pages/services/update-service";
import ListDemandeAchat from "./pages/demande-service/list";
import ListDemandeProduit from "./pages/demande-produit/list";

function App() {
  const { user, token, login, logout } = UserAuth();
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" exact component={Home} />
        <Route path="/liste-service" component={ListeService} />
        <Route path="/ajout-service" component={AjoutSerice} />
        <Route path="/update-service/:id" component={UpdateService} />
        <Route path="/list-demande-achat" component={ListDemandeAchat} />
        <Route path="/list-demande-produit" component={ListDemandeProduit} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" exact component={Login} />
        <Redirect to="/" />
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
