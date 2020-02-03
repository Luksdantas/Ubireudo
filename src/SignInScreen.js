import React, { useState, useEffect } from 'react';
import FileInput from './FileInput.js'
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import TeamManager from './TeamManager.js';
import {storage, database, storageRef, httpGetAsync, httpPostAsync, httpPutAsync} from './firebase.js'

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    if (firebase.auth().currentUser.metadata.creationTime === 
    firebase.auth().currentUser.metadata.lastSignInTime){
      httpPostAsync('https://ubireudo.firebaseio.com/users_public.json', JSON.stringify(user), function(texto) {
        console.log(texto);
      });
    }
  } else {
    // No user is signed in.
  }
});

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
                <TeamManager></TeamManager>
              </li>
  
              
            </ul>
          </main>
        </div>
  
      );
    }
  }

  export default SignInScreen;