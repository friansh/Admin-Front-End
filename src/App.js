import Typography from "@material-ui/core/Typography";
import Login from "./pages/login";
import Home from "./pages/home";
import CreateArticle from "./pages/article/create";
import EditArticle from "./pages/article/edit";
import IndexArticle from "./pages/article/index";
import IndexProduct from "./pages/product/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";

import Axios from "axios";
Axios.defaults.baseURL = process.env.REACT_APP_API_URL + "/api";

function App() {
  return (
    <CookiesProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/article">
            <IndexArticle />
          </Route>
          <Route exact path="/article/create">
            <CreateArticle />
          </Route>
          <Route path="/article/:id">
            <EditArticle />
          </Route>
          <Route exact path="/product">
            <IndexProduct />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
        </Switch>
      </Router>
    </CookiesProvider>
  );
}

export default App;
