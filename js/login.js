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

const email = document.getElementById('email');
const password = document.getElementById('password');
const formUp = document.getElementById('upload-form');

const login = (ev) =>{
  ev.preventDefault();
  
  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
  .then((userCredential) => {
  // Signed in
  var user = userCredential.user;

  
  // Redireciona o usuário 
  //setTimeout(function() {
  window.location.href = "/gallery.html";
  //}, 300);
 
  })
  
  .catch((error) => {
    //var errorCode = error.code;
    alert(error.message);
  });
  
};

const form = document.getElementById('login-form');
form.addEventListener('submit',login);