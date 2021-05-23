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

const userName = document.getElementById('userName');

var gallerySection = document.getElementById('gallery');
var galleryRow = document.querySelectorAll('.gallery-row');
var idImageOfGallery = 0; //

var formProfile = document.querySelector('#upload-form-profile');
var fileProfile;// Captura do file profile
var profile = document.getElementById('img-profile');
const fileNameProfile = 'profile.jpg';

var  wallpaper= document.getElementById('img-wallpaper');
const fileNameWallpaper = 'wallpaper.jpg';

var formGalleryImage = document.getElementById('upload-form-gallery');
var fileGalleryImage;
var pathNameGalleryImage;
const testeGallery = document.getElementById('teste-gallery');
var titleImageGallery;

var j = 0;
var i = 0;

//imprimir a imagem na tela
function loadImages(url, fileName){
  switch (fileName) {
    case fileNameProfile:
      profile.src = url;
    break;
    case fileNameWallpaper:
      wallpaper.src = url;
    break;
    case pathNameGalleryImage:

      firebase.storage().ref().child('users/'+pathNameGalleryImage)
        .listAll().then(function(images){
          images.items.forEach(function(image){
              image.getDownloadURL().then(function(url) {
                if(i%3 == 0 && i!=0){ 
                  gallerySection.innerHTML += 
                  `<div class="row g-4 text-center my-5 margin-row gallery-row">
                  `;
                  galleryRow = document.querySelectorAll('.gallery-row');
                  j+=1;
                }
                
                galleryRow[j].innerHTML += 
                `<div class="col col-md-4" id="col-card-${i} mb-5">
                  <div class="card h-100 w-100">
                    <button class="position-absolute top-0 start-100 translate-middle btn-delete rounded-circle" onmouseenter="setIdImageOfGallery(${i})" onclick="deleteImagaGalley()">X</button> 
                    <img src="${url}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title" id="card-title-${i}" name="${image.name}">${image.name.substring(0,image.name.length-4)}</h5>
                    </div>
                  </div>
                </div>
              `;
              i+=1;
              }).catch(function(error) {
                // Handle any errors
                alert(error.message);
              }); 
          })
      }).catch(function(error){
        alert(error.message);
      });

    break;
    
    default:

      galleryRow[j].innerHTML += 
      `<div class="col col-md-4" id="col-card-${i} mb-5">         
        <div class="card h-100 w-100">
          <button class="position-absolute top-0 start-100 translate-middle btn-delete rounded-circle" onmouseenter="setIdImageOfGallery(${i})" onclick="deleteImagaGalley()">X</button>
          <img src="${url}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title" id="card-title-${i}" name="${fileName.substring(8)}">${fileName.substring(8,fileName.length-4)}</h5>
          </div>
        </div>
      </div>
    `;
    i+=1;
    break;
  }
}

function deleteImagaGalley(){
  titleImageGallery = document.getElementById(`card-title-${idImageOfGallery}`);
  let fileName = titleImageGallery.attributes[2].value;

  firebase.storage().ref().child('users/'+pathNameGalleryImage+'/'+fileName).delete().then(function() {
    window.location.reload(false);
  }).catch(function(error) {
    alert(error.message);
  });
  
}
function setIdImageOfGallery(id){
  idImageOfGallery = id;  
}

function galleryImage(pathNameGalleryImage){
 
  loadImages('',pathNameGalleryImage);

  formGalleryImage.addEventListener('submit', function (ev){
    ev.preventDefault();  
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            fileGalleryImage = document.getElementById('file-gallery').files[0];
            firebase.storage().ref().child('users/'+pathNameGalleryImage+'/'+fileGalleryImage.name).put(fileGalleryImage).then(function(s){
            console.log('Sucess upload image: '+s);
            displayImage('gallery/'+fileGalleryImage.name);
          })
          .catch((error) => {
            alert(error.message);
          }); 
        }else {
          alert('Error de autentificação: Faça o login novamente');
        }
      }) 
      
  });
}

function profileImage(fileName){
  checkExistsImage(fileName);
  
  formProfile.addEventListener('submit', function (ev){
      ev.preventDefault();  
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              
            fileProfile = document.getElementById('file-profile').files[0];
            firebase.storage().ref().child('users/'+user.uid+'/'+fileName).put(fileProfile).then(function(){
              console.log('Sucess upload image');
              //download image
              displayImage(fileName);
            })
            .catch((error) => {
              alert(error.message);
            });
          }else {
            // No user is signed in.
            alert('Error de autentificação: Faça o login novamente');
          }
        })  
  });
}

function displayImage(fileName){

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
      let pathFile = 'users/'+user.uid+'/'+fileName;
    
      firebase.storage().ref().child(pathFile).getDownloadURL().then(function(url) {
    
        loadImages(url,fileName);

      }).catch(function(error) {
        // Handle any errors
        alert(error.message);
      });
    }else {
      // No user is signed in.
      alert('Error de autentificação: Faça o login novamente');
    }
  });
}

function checkExistsImage(fileName){
  let user = firebase.auth().currentUser;
  firebase.storage().ref().child('users/'+user.uid).listAll().then(function(res) {
    res.items.forEach(function(folderRef) {
      findingDirectory(user,folderRef,fileName);
    });
    
  }).catch(function(error) {
    alert(error.message);
  });
}

function findingDirectory(user,folderRef,fileName){
  if(folderRef.fullPath == 'users/'+user.uid+'/'+fileName){
   
    displayImage(fileName);
  }
  else{
  }
}

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', () => {
  ev.preventDefault();
  firebase.auth().signOut().then(() => {
   
  })
    window.location.href = "/gallery.html";

});

function wallpaperImage(fileName){
  checkExistsImage(fileName);
  
  const formWallpaper = document.getElementById('upload-form-wallpaper');
  formWallpaper.addEventListener('submit', function (ev){
      ev.preventDefault();  
      
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              // User is signed in.
            const fileWallpaper = document.getElementById('file-wallpaper').files[0];
            firebase.storage().ref().child('users/'+user.uid+'/'+fileName).put(fileWallpaper).then(function(){
              console.log('Sucess upload image');
              //download image
              displayImage(fileName);
            })
            .catch((error) => {
            
              alert(error.message);
            });
          }else {
            // No user is signed in.
            alert('Error de autentificação: Faça o login novamente');
          }
        })  
  });
}

function userLogged(){

  firebase.auth().onAuthStateChanged(user =>{
    if (user) {
     
      userName.innerHTML = `<p id="userName"> <sup>by</sup>${user.email}</p>`

      pathNameGalleryImage = `${user.uid}/gallery`;

      profileImage(fileNameProfile);
      wallpaperImage(fileNameWallpaper);
      galleryImage(pathNameGalleryImage);

    } else {
      // No user is signed in.
      alert('Usuario não logado');
    }
  });
}
