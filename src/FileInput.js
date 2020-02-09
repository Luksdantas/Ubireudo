import React from 'react';
import firebase from "firebase/app"
import { storageRef } from './firebase.js'
import imageCompression from 'browser-image-compression';
import { formatBytes } from './FileSize.js';

class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.fileInput = React.createRef();
    this.state = {
      image: firebase.auth().currentUser.photoURL,
      compressedImage: null,
      name: firebase.auth().currentUser.displayName,
    }
  }

  componentDidMount() {
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid + "/urlImage")
    .on('value', snapshot => {
      this.setState({ image: snapshot.val() })
    });
    firebase.database().ref('users_public/' + firebase.auth().currentUser.uid + "/name")
    .on('value', snapshot => {
      this.setState({ name: snapshot.val() })
    });
  }

  // Função chamada quando o formulário do input da imagem é enviado ao clicar no botão
  handleSubmit(event) {
    event.preventDefault();
    var firebasePhoto = this.state.compressedImage;
    var imageReg = /image\/*/
    if (firebasePhoto != null && imageReg.test(firebasePhoto.type)) {
      var uploadTask = storageRef.child('images/' + firebase.auth().currentUser.uid).put(firebasePhoto);
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;


        //barra de progresso
        const valorDiv = document.getElementById('progress')
        valorDiv.style.width = `${progress}%`

        setTimeout(() => { valorDiv.style.width = `0%` }, 3000)

        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
          default:
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
    var component = this;
    var imageFile = document.getElementById("photoInput").files[0];
    var imageReg = /image\/*/
    if (imageFile != null && imageReg.test(imageFile.type)) {
      document.getElementById("saveImage").disabled = true;
      this.setState({ image: URL.createObjectURL(imageFile) });
      console.log(`Image size before compression: ${formatBytes(imageFile.size)}`);

      //barra de progresso
      const valorDiv = document.getElementById('progress')
      valorDiv.style.width = `1%`


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
          console.log(`Image size after compression: ${formatBytes(compressedFile.size)}`); // smaller than maxSizeMB


          //barra de progresso
          const valorDiv = document.getElementById('progress')
          valorDiv.style.width = `30%`
        })
        .catch(function (error) {
          console.log(error.message);
        })
        .finally(() => document.getElementById("saveImage").disabled = false)
    } else {
      alert("Arquivo inválido. Confira se o arquivo é realmente uma imagem.")
    }
  }

  render() {
    return (
      <div>
        <div id="text-img">
          <div>
            <img id="profilePhoto" alt="Imagem de Perfil" src={this.state.image}></img>
          </div>
          <div>
            <p>Seja bem-vindo, {this.state.name}!</p>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <label> Trocar foto:</label>
          <input id="photoInput" type="file" accept="image/*" ref={this.fileInput} onChange={this.handleImageUpload} />
          <div id="progress"></div>
          <button id="saveImage" type="submit">Salvar Nova Imagem</button>
        </form>
      </div>
    );
  }
}

export default FileInput;