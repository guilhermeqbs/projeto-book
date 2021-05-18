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
  setTimeout(function() {
  window.location.href = "/gallery.html";
  }, 300);
 
  })
  
  .catch((error) => {
    //var errorCode = error.code;
    alert(error.message);
  });
  
};

const form = document.getElementById('login-form');
form.addEventListener('submit',login);