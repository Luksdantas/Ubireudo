import React, { useState, useEffect } from 'react';
import firebase from "firebase"
import Cropper from 'react-easy-crop'
import {storage, database, storageRef, httpGetAsync, httpPostAsync, httpPutAsync} from './firebase.js'

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
        `Arquivo escolhido - ${
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

  export default FileInput;