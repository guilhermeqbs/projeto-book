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

const gallery = document.getElementById('gallery');
var profile = document.getElementById('img-profile');
var  wallpaper= document.getElementById('img-wallpaper');
const fileNameProfile = 'profile.jpg';
const fileNameWallpaper = 'wallpaper.jpg';

//imprimir a imagem na tela
const innerHtmlImage = (url, fileName) => {
  switch (fileName) {
    case fileNameProfile:
      profile.src = url;
    break;
    case fileNameWallpaper:
      wallpaper.src = url;
    break;
    default:
    alert('Imagem não encontrada');
    break;
  }

  //gallery.innerHTML += `<img src="${url}" width="300" />`;
}

function displayImage(fileName){

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
      let pathFile = 'users/'+user.uid+'/'+fileName;

      firebase.storage().ref().child(pathFile).getDownloadURL().then(function(url) {
    
        innerHtmlImage(url, fileName);

      }).catch(function(error) {
        // Handle any errors
        console.log(error.message);
      });
    }else {
      // No user is signed in.
      alert('Error de autentificação: Faça o login novamente');
    }
  });

}

function checkExistsImage(fileName){
  var user = firebase.auth().currentUser;
  return firebase.storage().ref().child('users/'+user.uid+'/'+fileName);
}

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', () => {
  ev.preventDefault();
  firebase.auth().signOut().then(() => {
    console.log('user signed out');
  })
  // Redireciona o usuário 
  setTimeout(function() {
    window.location.href = "/gallery.html";
    }, 300);
});

function profileImage(fileName){

  if(checkExistsImage(fileName)!= null){
    console.log('Existe profile.jpg');
    displayImage(fileName);
  }
  else{
    //Chamada do upload de imagem? | Exibir imagem padrão?
  }
  const formProfile = document.getElementById('upload-form-profile');
  formProfile.addEventListener('submit', function (ev){
      ev.preventDefault();  
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              // User is signed in.
            console.log('Ususario atual: '+ user.uid);
            const fileProfile = document.getElementById('file-profile').files[0];
            firebase.storage().ref().child('users/'+user.uid+'/'+fileName).put(fileProfile).then(function(){
              console.log('Sucess upload image');
              //download image
              displayImage(fileName);
            })
            .catch((error) => {
            //var errorCode = error.code;
            console.log(error.message);
            });
          }else {
            // No user is signed in.
            alert('Error de autentificação: Faça o login novamente');
          }
        })  
  });
}

function wallpaperImage(fileName){

  if(checkExistsImage(fileName) ==! null){
    console.log('Existe'+ fileName);
    displayImage(fileName);
  }
  else{
    //Chamada do upload de imagem? | Exibir imagem padrão?
  }

  const formWallpaper = document.getElementById('upload-form-wallpaper');
  formWallpaper.addEventListener('submit', function (ev){
      ev.preventDefault();  
      
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              // User is signed in.
            console.log('Ususario atual: '+ user.uid);
            const fileWallpaper = document.getElementById('file-wallpaper').files[0];

            firebase.storage().ref().child('users/'+user.uid+'/'+fileName).put(fileWallpaper).then(function(){
              console.log('Sucess upload image');
              //download image
              displayImage(fileName);
            })
            .catch((error) => {
            //var errorCode = error.code;
            console.log(error.message);
            });
          }else {
            // No user is signed in.
            alert('Error de autentificação: Faça o login novamente');
          }
        })  
  });
}

function userLogged(){
  //var user = firebase.auth();

  firebase.auth().onAuthStateChanged(user =>{
    if (user) {
      // User is signed in.
      //Libera a exibição das fotos
      console.log('Usuario logado', user);

      profileImage(fileNameProfile);
      wallpaperImage(fileNameWallpaper);

    } else {
      // No user is signed in.
      alert('Usuario não logado');
    }
  });
}