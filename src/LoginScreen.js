import React from 'react';
import FileInput from './FileInput.js'
import firebase from "firebase/app"

import './css/Login.css';
import './css/App.css';
import './css/Global.css'
import './css/TeamsList.css'

import TeamAssigner from './TeamAssigner.js';
import UserRenamer from './UserRenamer.js';
import TeamsList from './TeamsList.js'
//import googleIcon from "./images/google_logo.png";
import googleIconWhite from "./images/google_logo_white.png";
import logoUbireudo from "./images/ubireudo_logo.png";

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("User logged in.");
    firebase.database().ref("users_public").child(user.uid)
      .update({ lastSignInTime: user.metadata.lastSignInTime });
  } else {
    // No user is signed in.
  }
});

class LoginScreen extends React.Component {

  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google as auth provider.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  handleSubmit() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function (result) {
        var user = result.user;
        if (result.additionalUserInfo.isNewUser) {
          console.log("Seja bem-vindo, novo usuário!");
          var userRelevantData = {
            "name": user.displayName,
            "nameGoogle": user.providerData[0].displayName,
            "urlImage": user.photoURL,
            "urlImageGoogle": user.providerData[0].photoURL,
            "email": user.email,
            "emailVerified": user.emailVerified,
            "creationTime": user.metadata.creationTime,
            "lastSignInTime": user.metadata.lastSignInTime,
          };
          var ref_user = firebase.database().ref("users_public").child(user.uid);
          ref_user.update(userRelevantData);
        }
      })
      .catch(function (error) {
        // Handle error.
      });
  }

  //Interface

  render() {
    if (!this.state.isSignedIn) {

      return (

        <div id="login">
          <main>
            <img alt="Logo" src={logoUbireudo}></img>
            <button onClick={this.handleSubmit}>
              <div id="img-text">
                <div>
                  <img alt="Google" src={googleIconWhite}></img>
                </div>
                <div>
                  <strong>Login com Google</strong>
                </div>
              </div>
            </button>
          </main>
        </div >

      );

    }

    return (

      <div id="app">
        <aside>
          <h1>Perfil</h1>
          <FileInput></FileInput>
          <UserRenamer></UserRenamer>
          <TeamAssigner></TeamAssigner>
          <button onClick={() => firebase.auth().signOut()}>Desconectar</button>
        </aside>
        <main>
          <ul>
            <TeamsList></TeamsList>
          </ul>
        </main>
      </div>

    );
  }
}

export default LoginScreen;