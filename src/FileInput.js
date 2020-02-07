import React, { useState, useEffect } from 'react';
import firebase from "firebase"
import { storageRef } from './firebase.js'
import imageCompression from 'browser-image-compression';

firebase.auth().onAuthStateChanged(function (user) {
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
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.fileInput = React.createRef();
    this.state = {
      image: firebase.auth().currentUser.photoURL,
      compressedImage: null,
    }
  }

  componentDidMount() {
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid + "/urlImage").on('value', snapshot => {
      console.log("ok");
      this.setState({ image: snapshot.val() })
      // document.getElementById("profilePhoto").src = snapshot.val();
    });
  }

  // Função chamada quando o formulário do input da imagem é enviado ao clicar no botão
  handleSubmit(event) {
    console.log(this.fileInput);
    event.preventDefault();
    var firebasePhoto = this.state.compressedImage;
    // var firebasePhoto = this.fileInput.current.files[0];
    var imageReg = /image\/*/
    if (imageReg.test(firebasePhoto.type)) {
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
            urlImage: downloadURL,
          });
        });
      });
    }
    else {
      alert("Arquivo inválido. Confira se o arquivo é realmente uma imagem.")
    }
  }

  // Função chamada quando o arquivo do input é mudado.
  handleImageUpload(event) {
    document.getElementById("saveImage").disabled = true;
    var component = this;
    var imageFile = document.getElementById("photoInput").files[0];
    this.setState({ image: URL.createObjectURL(imageFile) });
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    // Configurações da compressão. Altere os valores dos atributos para atingir o resultado almejado.
    var options = {
      maxSizeMB: 0.01,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    imageCompression(imageFile, options)
      .then(function (compressedFile) {
        component.setState({ image: URL.createObjectURL(compressedFile) });
        component.setState({ compressedImage: compressedFile });
        // var compressedFiles = [compressedFile];
        // document.getElementById("photoInput").files[0] = [...compressedFiles];
        console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
        console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
        // return uploadToServer(compressedFile); // write your own logic
      })
      .catch(function (error) {
        console.log(error.message);
      })
      .finally(() => document.getElementById("saveImage").disabled = false)
  }

  render() {
    return (
      <div>
        <div id="text-img">
          <div>
            <img id="profilePhoto" alt="Imagem de Perfil" src={this.state.image}></img>
          </div>
          <div>
            <label>Seja bem-vindo, {firebase.auth().currentUser.displayName}!</label>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <label> Trocar foto: </label>
          <input id="photoInput" type="file" accept="image/*" ref={this.fileInput} onChange={this.handleImageUpload} />
          <button id="saveImage" type="submit">Salvar Nova Imagem</button>
        </form>
      </div>
    );
  }
}

export default FileInput;