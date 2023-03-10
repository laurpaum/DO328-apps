import React, { Component } from 'react';
import Structure from './MainStructure'
import HistoricalDataForm from './HistoricalDataForm'
import WelcomePage from './Welcome'
import SingleCurrencyExchange from './SingleCurrencyExchange'

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import KeycloakProvider, { configureKeycloak, PrivateRoute, Login, Logout } from 'react-router-keycloak';

const KEYCLOAK_URL = `${process.env.KEYCLOAK_URL}`;
const KEYCLOAK_REALM = `${process.env.KEYCLOAK_REALM}`;
const KEYCLOAK_CLIENT_ID = `${process.env.KEYCLOAK_CLIENT_ID}`;

function handleRefresh(token) {
  console.log('Called every time the token is refreshed so you can update it locally', token);
}

function handleLoginSuccess(token) {
  console.log('Called on login success', token);
}

function handleLogoutSuccess() {
  console.log('Called on logout success');
}

// Initialize a keycloak instance that will be used in every sub-components
configureKeycloak(KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID);

class App extends Component {
  render() {
    return (
      <KeycloakProvider loginPath="/login" logoutPath="/logout" onRefresh={handleRefresh}>
        <Router basename="/frontend">
          <Switch>
            <Structure>
              <Route path="/" exact >
                <WelcomePage />
              </Route>
              <Route path="/exchange" exact >
                <SingleCurrencyExchange />
              </Route>
              <Route path="/history" exact >
                <HistoricalDataForm />
              </Route>
              <Route path="/login" render={props => 
                <Login redirectTo="/" onSuccess={handleLoginSuccess} {...props} />
              }/>
              <Route path="/logout" render={props =>
                <Logout redirectTo="/" onSuccess={handleLogoutSuccess} {...props} />
              }/>
              <PrivateRoute path="/secure" component={() => <div>Login successful</div>} />
            </Structure>
          </Switch>
        </Router>
      </KeycloakProvider>
    )
  }
}

export default App;
