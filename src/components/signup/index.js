import React from "react";
import { Link } from "react-router-dom";

import { firebase } from "../../firebase";
import "./style.css";

export default class extends React.Component {
  state = {
    email: "",
    password: "",
    confirmPassword: ""
  };

  updateEmail = ({ target: { value } }) => {
    this.setState({ email: value });
  };

  updatePass = ({ target: { value } }) => {
    this.setState({ password: value });
  };

  updateConfirmPass = ({ target: { value } }) => {
    this.setState({ confirmPassword: value });
  };

  handleSignup = e => {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      alert("password don't match");
      return;
    }
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() =>
        firebase.auth().createUserWithEmailAndPassword(email, password)
      )
      .then(() => this.props.history.push("/"))
      .catch(console.error);
  };

  signupWithGoogle = () => {
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
        onSubmit={this.handleSignup}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          margin: 10,
          width: 400,
          height: 220
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
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={this.updateConfirmPass}
        />
        <input type="submit" value="Signup" />
        <span>
          Already have an account? <Link to="/login">login instead</Link>
        </span>
        <div>
          <input
            type="button"
            value="Sign up with Google"
            onClick={this.signupWithGoogle}
          />
        </div>
      </form>
    );
  }
}
