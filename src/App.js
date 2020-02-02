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

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.state = {image: firebase.auth().currentUser.photoURL};
  }
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${
        this.fileInput.current.files[0].name
      }`
    );
    this.setState({
      image: URL.createObjectURL(this.fileInput.current.files[0])
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.image != this.state.image)
    {
      var firebasePhoto = this.fileInput.current.files[0];
      var uploadTask = storageRef.child('images/' + firebasePhoto.name).put(firebasePhoto);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function(snapshot){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log('File available at', downloadURL);
        });
      });
    }
  }

  render() {
    return (
      <div>
        <img alt="Imagem de Perfil" src={this.state.image}></img>
        <form onSubmit={this.handleSubmit}>
          <label>
            Selecionar Foto:
            <input type="file" ref={this.fileInput} />
          </label>
          <br />
          <button type="submit">Salvar</button>
        </form>
      </div>
    );
  }
}

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
        <FileInput></FileInput>
        <p>Seja bem-vindo, {firebase.auth().currentUser.displayName}! Agora você está conectado!</p>
        <a onClick={() => firebase.auth().signOut()}>Desconectar</a>
      </div>
    );
  }
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
