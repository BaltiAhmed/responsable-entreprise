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
import ListProduitFinal from "./pages/produit-final/list-produit";
import AjoutProduit from "./pages/produit-final/ajout-produit";
import UpdateProduit from "./pages/produit-final/update-produit";
import ListCommande from "./pages/commande/ListCommande";
import DetailCommande from "./pages/commande/detailsCommande";
import ListCategorie from "./pages/categories/ListCategorie";
import ChartsPage from "./pages/dashbord";
import ChatAgriculteur from "./pages/agriculteur/chat/chat";
import ChatClient from "./pages/client/chat/chat";
import ListAgriculteurChat from './pages/agriculteur/list'
import ListClientChat from './pages/client/list'

function App() {
  const { user, token, login, logout } = UserAuth();
  let routes;
  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/agriculteur"  component={Home} />
        <Route path="/liste-service" component={ListeService} />
        <Route path="/ajout-service" component={AjoutSerice} />
        <Route path="/update-service/:id" component={UpdateService} />
        <Route path="/list-demande-achat" component={ListDemandeAchat} />
        <Route path="/list-demande-produit" component={ListDemandeProduit} />
        <Route path="/list-produit-final" component={ListProduitFinal} />
        <Route path="/ajout-produit-final" component={AjoutProduit} />
        <Route path="/update-produit-final/:id" component={UpdateProduit} />
        <Route path="/commande" component={ListCommande} />
        <Route path="/detailCommande/:id" component={DetailCommande} />
        <Route path="/list-categorie" component={ListCategorie} />
        <Route path="/chat-agriculteur/:id"  component={ChatAgriculteur} />
        <Route path="/chat-client/:id"  component={ChatClient} />
        <Route path="/list-client"  component={ListClientChat} />
        <Route path="/list-agriculteur"  component={ListAgriculteurChat} />
        <Route path="/" exact component={ChartsPage} />
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
