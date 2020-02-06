import React, { useState, useEffect } from 'react';
import firebase from "firebase"
import { storageRef} from './firebase.js'

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User logged in.");
  } else {
    // No user is signed in.
  }
});

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
    this.state = {
      image: firebase.auth().currentUser.photoURL,
    }
  }

  componentDidMount() {
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid + "/urlImage").on('value', snapshot => {
      console.log("ok");
      this.setState({image: snapshot.val()})
     // document.getElementById("profilePhoto").src = snapshot.val();
    });
  }

  handleSubmit(event) {
    event.preventDefault();
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
          firebase.database().ref('users_public/' + firebase.auth().currentUser.uid).update({
            urlImage : downloadURL,
          });
        });
      });
  }

  render() {
    return (
      <div>
        <div className="input-block">
          <img id="profilePhoto" alt="Imagem de Perfil" src={this.state.image}></img>
        </div>
        <div className="input-block">
          <form onSubmit={this.handleSubmit}>
            <label> Trocar foto: </label>
            <div className="input-block">
              <input type="file" ref={this.fileInput} />
            </div>
            <button type="submit">Salvar alterações</button>
          </form>
        </div>
      </div>
    );
  }
}

export default FileInput;