import React, { useState, useEffect } from 'react';

import './App.css';
import './global.css'
import './Main.css'
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import StudentForm from './components/StudentForm'

// Configure Firebase.
const config = {
  apiKey: 'AIzaSyBCDqncv8ZHjdxm2BOTFkDmw-LlKLhfRqY',
  authDomain: 'ubireudo.firebaseapp.com',
  storageBucket: 'gs://ubireudo.appspot.com'
  // ...
};
firebase.initializeApp(config);
var storage = firebase.storage();
var storageRef = storage.ref();

class SignInScreen extends React.Component {

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
        (user) => this.setState({isSignedIn: !!user})
    );
  }
  
  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div>
          <h1>Ubireudo</h1>
          <p>Por favor, faça o login:</p>
          <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
        </div>
      );
    }
    return (
      <div>
        <h1>Ubireudo</h1>
        <img alt="Imagem de Perfil" src={firebase.auth().currentUser.photoURL}></img>
        <p>Seja bem-vindo, {firebase.auth().currentUser.displayName}! Agora você está conectado!</p>
        <a onClick={() => firebase.auth().signOut()}>Desconectar</a>
        <input type="file" id="avatar" name="avatar"
       accept="image/png, image/jpeg" onChange={() => handleFiles(this.files)}/>
      </div>
    );
  }
}

function handleFiles(files) {
  var avatar = files[0];
  console.log(avatar.name);
  // Upload file and metadata to the object 'images/mountains.jpg'
//var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);
}

function App() {
  return <SignInScreen></SignInScreen>
}

/*
function App() {

  return (

    <div id="app">

      <main>

        <strong>Cadastrar</strong>
        <StudentForm />

      </main>

    </div>

  );
}
*/

export default App;
