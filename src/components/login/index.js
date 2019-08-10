import React from "react";
import { Link } from "react-router-dom";
import { Container, TextField, Button } from "@material-ui/core";

import { firebase } from "../../firebase";
import GoogleIcon from "../icons/google";

export default class extends React.Component {
  state = {
    email: "",
    password: "",
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

  handleLogin = e => {
    e.preventDefault();
    const { email, password } = this.state;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
      .then(() => this.props.history.push("/home"))
      .catch(({ code, message }) =>
        this.setState({ err: true, errCode: code, errMsg: message })
      );
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
          onSubmit={this.handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            margin: 10,
            width: 400,
            height: 360
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
            Login to your account
          </label>
          <TextField
            error={
              this.state.err &&
              (this.state.errCode.includes("email") ||
                this.state.errCode.includes("user-not-found"))
            }
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
          {this.state.err && (
            <div style={{ color: "#f44336", paddingLeft: 10, marginBottom: 8 }}>
              {this.state.errMsg}
            </div>
          )}
          <Button variant="outlined" color="primary" type="submit">
            Login
          </Button>
          <span style={{ color: "gray", margin: "5px 0" }}>
            Don't have an account? <Link to="/signup">Create account</Link>
          </span>
          <div>
            <Button
              variant="outlined"
              style={{
                color: "#ea4335",
                fontFamily: "Lato"
              }}
              type="button"
              onClick={this.loginWithGoogle}
            >
              <GoogleIcon />{" "}
              <span style={{ marginLeft: 5 }}>Login with Google</span>
            </Button>
          </div>
        </form>
      </Container>
    );
  }
}
