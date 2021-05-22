 // Your web app's Firebase configuration
 var firebaseConfig = {
  apiKey: "AIzaSyCJtCHtye7kifUSluz-rdiIuhryq40kMT0",
  authDomain: "projeto-book.firebaseapp.com",
  projectId: "projeto-book",
  storageBucket: "projeto-book.appspot.com",
  messagingSenderId: "293512059061",
  appId: "1:293512059061:web:cfe037efdf57d2b13786fc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const userName = document.getElementById('user');
const email = document.getElementById('email');
const password = document.getElementById('password');

const register = (ev) =>{
    ev.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(auth => {
        
        window.location.href = "/gallery.html";
        })
        .catch(error =>{
            console.log(error.message);
            alert(error.message)
        })
};

const form = document.getElementById('create-account-form');
form.addEventListener('submit',register);