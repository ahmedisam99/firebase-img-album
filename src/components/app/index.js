import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";

import LoginPage from "../login";
import HomePage from "../home";
import SignupPage from "../signup";
import { firebase } from "../../firebase";
import "./style.css";

export default class extends React.Component {
  state = {
    user: {},
    loggedIn: false,
    loading: true
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log("user", user);
      if (user) {
        const { email, uid } = user;
        this.setState({ user: { email, uid }, loggedIn: true, loading: false });
      } else this.setState({ user: {}, loggedIn: false, loading: false });
    });
  }

  logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => this.setState({ user: {}, loggedIn: false, loading: false }))
      .catch(console.error);
  };

  render() {
    return this.state.loading ? (
      <h1>Loading...</h1>
    ) : this.state.loggedIn ? (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={props => (
              <HomePage
                {...props}
                user={this.state.user}
                logout={this.logout}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={props => <Redirect {...props} to="/" />}
          />
          <Route
            exact
            path="/signup"
            render={props => <Redirect {...props} to="/" />}
          />
          <Route
            path="/"
            render={() => (
              <>
                <h1 className="App">404 Page Not Found</h1>
                <h4 className="App">
                  <Link to="/">Back to Home</Link>
                </h4>
              </>
            )}
          />
        </Switch>
      </Router>
    ) : (
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route
            path="/"
            render={props => <Redirect {...props} to={"/login"} />}
          />
        </Switch>
      </Router>
    );
  }
}
