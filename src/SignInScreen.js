import React, { useState, useEffect } from 'react';
import FileInput from './FileInput.js'
import firebase from "firebase"
import TeamManager from './TeamManager.js';
import NameManager from './NameManager.js';
import ubireudo from "./ubireudo_tranparente_tudo.png"

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

  handleSubmit() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
        console.log(result);
        var user = result.user;
        if(result.additionalUserInfo.isNewUser)
        {
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
      .catch(function(error) {
       // Handle error.
      });
  }

  render() {
    if (!this.state.isSignedIn) {

      return (
        <div id="login">
          <main>
            {/* <img src={require('./logo.jpeg')}></img> */}
            <div className="input-block">
              <label htmlFor="nome_aluno">Faça o cadastro usando uma das opções abaixo:</label>
            </div>
            <button onClick={this.handleSubmit}>Login com Google</button>
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

        <aside>
          <TeamManager></TeamManager>
          <NameManager></NameManager>
        </aside>

        {/* <main>
          <ul>

            <li className="turmas">
              <header>
                <img src="" alt="img" />
                <div className="informacoes">
                  <strong>nome da turma</strong>
                  <span>professor</span>
                </div>
              </header>
              <p>pontuação</p>
            </li>

            <li className="turmas">
              <header>
                <img src="" alt="img" />
                <div className="informacoes">
                  <strong>nome da turma</strong>
                  <span>professor</span>
                </div>
              </header>
              <p>pontuação</p>
            </li>

            <li className="turmas">
              <header>
                <img src="" alt="img" />
                <div className="informacoes">
                  <strong>nome da turma</strong>
                  <span>professor</span>
                </div>
              </header>
              <p>pontuação</p>
            </li>

          </ul>
        </main> */}
      </div>

    );
  }
}

export default SignInScreen;