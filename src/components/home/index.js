import React from "react";
import { AppBar, Toolbar, Button, Avatar, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import { firebaseApp, firebase } from "../../firebase";
import { right as RightArrow, left as LeftArrow } from "../icons/arrow";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImg: 0
    };
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("keydown", e => {
      const key = e.keyCode;
      if (key === 39) this.pressRightArrow();
      else if (key === 37) this.pressLeftArrow();
    });
    firebaseApp
      .storage()
      .ref("images/")
      .listAll()
      .then(listResult =>
        Promise.all(
          listResult.items.map(item =>
            firebase
              .storage()
              .ref(item.location.path)
              .getDownloadURL()
          )
        )
      )
      .then(images => this.setState({ images }))
      .catch(() => {
        alert("couldn't load your images please refersh the page or try later");
        window.location.reload();
      });
  }

  pressRightArrow = () => {
    const { currentImg, images } = this.state;
    if (currentImg === images.length - 1) this.setState({ currentImg: 0 });
    else
      this.setState(prev => {
        return {
          currentImg: prev.currentImg + 1
        };
      });
  };

  pressLeftArrow = () => {
    const { currentImg } = this.state;
    if (currentImg === 0)
      this.setState(prev => {
        return {
          currentImg: prev.images.length - 1
        };
      });
    else
      this.setState(prev => {
        return {
          currentImg: prev.currentImg - 1
        };
      });
  };

  uploadImg = () => {
    if (this.fileInput.current.files.length > 1) {
      alert("please upload one image at a time");
      this.fileInput.current.files = [];
    }
    const file = this.fileInput.current.files[0];
    const ref = firebaseApp.storage().ref(`images/${file.name}`);
    ref.put(file).then(() => window.location.reload());
  };

  render() {
    const { photoURL, email, displayName, uid } = firebase.auth().currentUser;

    return (
      <>
        <AppBar
          position="fixed"
          style={{ top: 0, left: 0, right: 0, width: "100vw" }}
        >
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {photoURL ? (
                <Avatar src={photoURL} />
              ) : (
                <Avatar style={{ background: "#f44336" }}>
                  {email[0].toUpperCase()}
                </Avatar>
              )}
              <div style={{ marginLeft: 5 }}>
                <div style={{ color: "#d6d6d6", fontSize: "0.9rem" }}>
                  {displayName || email}
                </div>
                <div style={{ color: "#9a9a9a", fontSize: "0.6rem" }}>
                  #{uid}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "1.5rem" }}>Photo Album</div>
            <Button
              variant="contained"
              style={{
                color: "#3f51b5",
                fontWeight: "bold",
                fontFamily: "Lato"
              }}
              onClick={this.props.logout}
            >
              Log out
            </Button>
          </Toolbar>
        </AppBar>
        <div
          style={{
            marginTop: 64,
            marginBottom: 130,
            width: "100vw",
            height: "calc(100vh - (64px + 130px))",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {this.state.images.length ? (
            <>
              <div
                style={{
                  // background: "#e0e0e0",
                  height: "100%",
                  width: 65,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <LeftArrow
                  onClick={this.pressLeftArrow}
                  style={{ width: 50, color: "#3f51b5", cursor: "pointer" }}
                />
              </div>
              <img
                src={this.state.images[this.state.currentImg]}
                alt="selected"
                height="400"
                style={{ border: "1px solid gray" }}
              />
              <div
                style={{
                  // background: "#e0e0e0",
                  height: "100%",
                  width: 65,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <RightArrow
                  onClick={this.pressRightArrow}
                  style={{ width: 50, color: "#3f51b5", cursor: "pointer" }}
                />
              </div>
            </>
          ) : (
            <h1>You have no images stored</h1>
          )}
        </div>
        <AppBar
          position="absolute"
          style={{
            top: "auto",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100vw",
            height: 130
          }}
        >
          <Toolbar
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingRight: 12
            }}
          >
            <div
              style={{
                width: "95%",
                height: 130,
                display: "flex",
                alignItems: "center",
                overflowX: "auto"
              }}
            >
              {this.state.images.map((img, i) => (
                <img
                  src={img}
                  height="90"
                  alt={`${i + 1}`}
                  style={
                    this.state.currentImg === i
                      ? {
                          marginRight: 10,
                          marginBottom: 10,
                          borderRadius: 5,
                          border: "2.5px solid #f5f5f5"
                        }
                      : {
                          marginRight: 10,
                          border: "1px solid #f5f5f5",
                          cursor: "pointer"
                        }
                  }
                  onClick={() => this.setState({ currentImg: i })}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 130
              }}
            >
              <Fab
                color="primary"
                aria-label="add"
                style={{ background: "#FFF" }}
              >
                <input
                  type="file"
                  multiple={false}
                  style={{ display: "none", visibility: "hidden" }}
                  ref={this.fileInput}
                  onChange={this.uploadImg}
                />
                <AddIcon
                  style={{ color: "#3f51b5" }}
                  onClick={() => this.fileInput.current.click()}
                />
              </Fab>
            </div>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}
