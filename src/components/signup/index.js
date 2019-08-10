import React from "react";
import { Link } from "react-router-dom";
import { Container, TextField, Button } from "@material-ui/core";

import { firebase } from "../../firebase";
import GoogleIcon from "../icons/google";

export default class extends React.Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    err: false,
    errCode: "",
    errMsg: ""
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
    if (!email)
      return this.setState({
        err: true,
        errCode: "email",
        errMsg: "The email address is badly formatted."
      });
    if (password !== confirmPassword)
      return this.setState({
        err: true,
        errCode: "password",
        errMsg: "Passwords don't match!"
      });

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() =>
        firebase.auth().createUserWithEmailAndPassword(email, password)
      )
      .then(() => this.props.history.push("/"))
      .catch(({ code, message }) =>
        this.setState({ err: true, errCode: code, errMsg: message })
      );
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
      .catch(({ code, message }) =>
        this.setState({ err: true, errCode: code, errMsg: message })
      );
  };

  render() {
    return (
      <Container
        fixed
        maxWidth="sm"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f0f1ff70"
        }}
      >
        <form
          onSubmit={this.handleSignup}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            margin: 10,
            width: 400,
            height: 420
          }}
        >
          <label
            style={{
              textAlign: "center",
              fontFamily: "Lato",
              fontSize: "1.4rem",
              color: "#3f51b5"
            }}
          >
            Sign up with your account
          </label>
          <TextField
            error={this.state.err && this.state.errCode.includes("email")}
            label="Email Address"
            margin="normal"
            variant="outlined"
            onChange={this.updateEmail}
          />
          <TextField
            error={
              this.state.err &&
              (this.state.errCode.includes("password") ||
                this.state.errCode.includes("user-not-found"))
            }
            label="Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
            onChange={this.updatePass}
          />
          <TextField
            error={this.state.err && this.state.errCode.includes("password")}
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            margin="normal"
            variant="outlined"
            onChange={this.updateConfirmPass}
          />
          {this.state.err && (
            <div style={{ color: "#f44336", paddingLeft: 10, marginBottom: 8 }}>
              {this.state.errMsg}
            </div>
          )}
          <Button variant="outlined" color="primary" type="submit">
            Sign up
          </Button>
          <span style={{ color: "gray", margin: "5px 0" }}>
            Don't have an account? <Link to="/login">Login instead</Link>
          </span>
          <div>
            <Button
              variant="outlined"
              style={{
                color: "#ea4335",
                fontFamily: "Lato"
              }}
              type="button"
              onClick={this.signupWithGoogle}
            >
              <GoogleIcon />{" "}
              <span style={{ marginLeft: 5 }}>Sign up with Google</span>
            </Button>
          </div>
        </form>
      </Container>
    );
  }
}
