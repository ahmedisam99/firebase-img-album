import React from "react";

import { firebaseApp, firebase } from "../../firebase";
import "./style.css";

export default class extends React.Component {
  state = {
    images: { current: "" }
  };

  componentDidMount() {
    firebaseApp
      .storage()
      .ref()
      .child("images/img.jpg")
      .getDownloadURL()
      .then(url => this.setState({ images: { current: url } }));
  }

  render() {
    const { email } = firebase.auth().currentUser;
    return (
      <div className="App">
        <h1>Hello </h1>
        <h4>{email}</h4>
        <img src={this.state.images.current} width="450" alt="selected" />
        <br />
        <input type="button" value="Logout" onClick={this.props.logout} />
      </div>
    );
  }
}
