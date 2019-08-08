import React from "react";
import { Link } from "react-router-dom";

import { firebase } from "../../firebase";
import "./style.css";

export default class extends React.Component {
  state = {
    email: "",
    password: ""
  };

  handleLogin = e => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
      .then(() => this.props.history.push("/home"))
      .catch(console.error);
  };

  updateEmail = ({ target: { value } }) => {
    this.setState({ email: value });
  };

  updatePass = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  loginWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    provider.setCustomParameters({ login_hint: "user@example.com" });

    firebase.auth().useDeviceLanguage();

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => firebase.auth().signInWithPopup(provider))
      .then(() => this.props.history.push("/"))
      .catch(console.error);
  };

  render() {
    return (
      <form
        onSubmit={this.handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          margin: 10,
          width: 400,
          height: 180
        }}
      >
        <input
          type="email"
          placeholder="Email Address"
          onChange={this.updateEmail}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={this.updatePass}
        />
        <input type="submit" value="Login" />
        <span>
          Don't have an account? <Link to="/signup">Create account</Link>
        </span>
        <div>
          <input
            type="button"
            value="Login with Google"
            onClick={this.loginWithGoogle}
          />
        </div>
      </form>
    );
  }
}
