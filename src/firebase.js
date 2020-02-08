import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

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
var storageRef = storage.ref();

export {storageRef};