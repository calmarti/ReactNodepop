import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import AdvertsPage from "./components/adverts/AdvertsPage";
import AdvertPage from "./components/adverts/AdvertPage";
import NewAdvertPage from "./components/adverts/NewAdvertPage";
import { useState, useContext } from "react";
import { AuthProvider, AuthConsumer } from "./components/auth/context";
import PrivateRoute from "./components/auth/PrivateRoute";
import { logout } from "./components/auth/service";



function App({ isAlreadyLogged }) {
  const [isLogged, setIsLogged] = useState(isAlreadyLogged);

  function handleIsLogged() {
    setIsLogged(true);
  }

  function handleLogout() {
    logout().then(() => setIsLogged(false));
  }

  return (
    <Router>
      <AuthProvider value={{ isLogged, handleIsLogged, handleLogout }}>
        <Switch>
          <Route path="/login">
            {(routeProps) => (
              <AuthConsumer>
                {(value) => (
                  <LoginPage onLogin={value.handleIsLogged} {...routeProps} {...routeProps} />
                )}
              </AuthConsumer>
            )}
          </Route>
          <PrivateRoute path="/adverts/new" component={NewAdvertPage} />
          <PrivateRoute path="/adverts/:id" component={AdvertPage} />
          <PrivateRoute path="/adverts" component={AdvertsPage} />
          <Route exact path="/">
            <Redirect to="/adverts" />
          </Route>
          <Route path="/404">Not Found</Route>
          <Route>
            <Redirect to="/404" />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  );
  
}

  App.propTypes = {
    
  }
  

export default App;
