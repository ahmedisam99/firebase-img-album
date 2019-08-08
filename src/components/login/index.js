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
          height: 100
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
          Dont have an account? <Link to="/signup">Create account</Link>
        </span>
      </form>
    );
  }
}
