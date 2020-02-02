import React, { useState, useEffect } from 'react';
import './Login.css';
import './App.css';
import './global.css'
import './App.css'
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import StudentForm from './components/StudentForm'
import Cropper from 'react-easy-crop'

const firebaseConfig = {
  apiKey: "AIzaSyBCDqncv8ZHjdxm2BOTFkDmw-LlKLhfRqY",
  authDomain: "ubireudo.firebaseapp.com",
  databaseURL: "https://ubireudo.firebaseio.com",
  projectId: "ubireudo",
  storageBucket: "ubireudo.appspot.com",
  messagingSenderId: "419030368719",
  appId: "1:419030368719:web:3708b39f72fb232a6d92ba",
  measurementId: "G-Q6BD3QCHMH"
};

firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
var database = firebase.database();
var storageRef = storage.ref();

function httpGetAsync(url, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
      }
  }
  xmlHttp.open("GET", url, true)
  xmlHttp.send(null);
}

httpGetAsync('https://ubireudo.firebaseio.com/ubireudo/users_public.json', function(texto){
  console.log(JSON.parse(texto))
});

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.state = {
      image: firebase.auth().currentUser.photoURL,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
    };
  }

  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
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
    if (prevState.image != this.state.image) {
      var firebasePhoto = this.fileInput.current.files[0];
      var uploadTask = storageRef.child('images/' + firebasePhoto.name).put(firebasePhoto);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function (snapshot) {
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
      }, function (error) {
        // Handle unsuccessful uploads
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log('File available at', downloadURL);
        });
      });

      // Sistema de persistência de foto de perfil
      //var user = firebase.auth().currentUser;
      //user.updateProfile({
      //  photoURL: 
      //}).then(function() {
      // Update successful.
      //}).catch(function(error) {
      // An error happened.
      //});
    }
  }

  render() {
    return (
      <div>
        <div className="input-block">
          <img alt="Imagem de Perfil" src={this.state.image}></img>
        </div>
        <div className="input-block">
          <form onSubmit={this.handleSubmit}>
            <label>
              Trocar foto:
            <input type="file" ref={this.fileInput} />
            </label>
            <button type="submit">Salvar alterações</button>
          </form>
        </div>
      </div>
    );
  }
}

/*<div>
  <Cropper
    image={this.state.image}
    crop={this.state.crop}
    zoom={this.state.zoom}
    aspect={this.state.aspect}
    onCropChange={this.onCropChange}
    onCropComplete={this.onCropComplete}
    onZoomChange={this.onZoomChange}
  />
</div> */

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
      (user) => this.setState({ isSignedIn: !!user })
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {

      return (
        <div id="login">
          <main>
            <strong>Ubireudo</strong>
            <div className="input-block">
              <label htmlFor="nome_aluno">Faça o cadastro usando uma das opções abaixo:</label>
            </div>
            <div className="input-block">
              <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
            </div>
          </main>
        </div >
      );

    }
    return (

      <div id="app">
        <aside>
          <strong>Ubireudo</strong>
          <div className="input-block">
            <label>Seja bem-vindo, {firebase.auth().currentUser.displayName}!</label>
          </div>
          <div className="input-block">
            <FileInput></FileInput>
          </div>
          <button onClick={() => firebase.auth().signOut()}>Desconectar</button>
        </aside>

        <main>
          <ul>

            <li className="turmas">
              <header>
                <img src="" alt="img" />
                <div className="informacoes">
                  <strong>nome da turma</strong>
                  <span>descrição</span>
                </div>
              </header>
              <p>pontuação</p>
              <a href="">provavel acesso a algo</a>
            </li>

            
          </ul>
        </main>
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
