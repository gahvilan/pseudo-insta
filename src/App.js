import React, { Component } from 'react';
import firebase from 'firebase';
import FileUpload from './FileUpload.js';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    };

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user});
    });

    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });

  }

  handleAuth () {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
      .then(result => console.log(`${result.user.email} ha iniciado sesion`))
      .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogOut () {
    firebase.auth().signOut()
     .then(result => console.log(`${result.user.email} ha cerrado secion`))
     .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleUpload (event) {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref(`/photos/${file.name}`);
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
        let percentage = (snapshot.byteTransferred / snapshot.totalBytes) * 100;
        this.setState({
          uploadValue: percentage
        })
      }, error => {
        console.log(error.message)
      },() => {
          const record = {
            photoURL: this.state.user.photoURL,
            displayName: this.state.user.displayName,
            image: task.snapshot.downloadURL
          };
          const dbref = firebase.database().ref('pictures');
          const newPicture = dbref.push();
          newPicture.set(record);
        });
  }

  renderLoginButton() {
    if (this.state.user) {
      return (
          <div>
            <div>
              <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
              <p>Hola {this.state.user.displayName}</p>
              <button onClick={this.handleLogOut}> Salir </button>
            </div>
            <div>
              <FileUpload onUpload={this.handleUpload}/>

              {
                this.state.pictures.map(picture => (
                  <div>
                    <img src={picture.image} />
                    <br />
                    <img src={picture.photoURL} alt={picture.displayName} />
                    <br />
                    <span>{picture.displayName}</span>
                  </div>
                )).reverse()
              }

            </div>
          </div>
        );
    }
    else {
      return (
        <button onClick={this.handleAuth}> Login con Google </button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudo Insta</h2>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
