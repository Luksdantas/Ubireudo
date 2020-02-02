import firebase from "firebase"

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

export {storage, database, storageRef};