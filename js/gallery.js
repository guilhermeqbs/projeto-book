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
      //Lembrando que quando for editar uma imagem, na hora do Upload tem que apagar a anterior, se não ela vai imprimir dnv.
      firebase.storage().ref().child('users/'+pathNameGalleryImage)
        .listAll().then(function(images){
          images.items.forEach(function(image){
            
            //innerHtml(image);  Acada 3 itens criar uma nova row

              image.getDownloadURL().then(function(url) {
                console.log('List imagens: '+ image.name);
                
                if(i%3 == 0 && i!=0){ //tenho que ver exatamente qual numero colocar
                  gallerySection.innerHTML += 
                  `<div class="row g-4 text-center my-5 margin-row gallery-row">
                  `;
                  galleryRow = document.querySelectorAll('.gallery-row');
                  j+=1;
                }
                //onmouseenter="setIdImageOfGallery(${i})
                galleryRow[j].innerHTML += 
                `<div class="col col-md-4" id="col-card-${i}">
                  <!--
                  <form " id="upload-form-gallery-${i}" action="" method="post" enctype="multipart/form-data">
                    <input type="file" name="file" id="file-gallery-${i}">
                    <input type="submit" value="Upload image-${i}" name="submit" id="submit-${i}">
                  </form>
                    -->
                  <div class="card h-100 w-100">
                    <img src="${url}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${image.name.substring(0,image.name.length-4)}</h5>
                    </div>
                  </div>
                </div>
                 
              `;
              i+=1;
              }).catch(function(error) {
                // Handle any errors
                console.log(error.message);
              }); 
          })
      }).catch(function(error){
        console.log(error.message);
      });

    break;
    
    default:
     
      //testeGallery.innerHTML += `<img src="${url}" width="300px">`
      galleryRow[j].innerHTML += 
      `<div class="col col-md-4" id="col-card-${i}">
        <!--
        <form " id="upload-form-gallery-${i}" action="" method="post" enctype="multipart/form-data">
          <input type="file" name="file" id="file-gallery-${i}">
          <input type="submit" value="Upload image-${i}" name="submit" id="submit-${i}">
        </form>
          -->
        <div class="card h-100 w-100">
          <img src="${url}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${fileName.substring(8,fileName.length-4)}</h5>
          </div>
        </div>
      </div>
       
    `;
    i+=1;
    break;
  }
}
function setIdImageOfGallery(id){
  idImageOfGallery = id;
  //formGalleryImage = document.getElementById(`upload-form-gallery-${idImageOfGallery}`);
 
  console.log("Deu: "+ idImageOfGallery);
  
}
function galleryImage(pathNameGalleryImage){
 
  loadImages('',pathNameGalleryImage);

  formGalleryImage.addEventListener('submit', function (ev){
    ev.preventDefault();  
    
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            //alert('Passou viu 1');
            fileGalleryImage = document.getElementById('file-gallery').files[0];
          
            firebase.storage().ref().child('users/'+pathNameGalleryImage+'/'+fileGalleryImage.name).put(fileGalleryImage).then(function(s){
            //console.log('Nome: '+ fileGalleryImage.name);
            console.log('Sucess upload image: '+s);
            //download image
            displayImage('gallery/'+fileGalleryImage.name);
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

function profileImage(fileName){
  checkExistsImage(fileName);
  
  formProfile.addEventListener('submit', function (ev){
      ev.preventDefault();  
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              // User is signed in.
            console.log('Ususario atual: '+ user.uid);
            fileProfile = document.getElementById('file-profile').files[0];
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

function displayImage(fileName){

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      
      let pathFile = 'users/'+user.uid+'/'+fileName;

      firebase.storage().ref().child(pathFile).getDownloadURL().then(function(url) {
    
        loadImages(url,fileName);

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
  let user = firebase.auth().currentUser;
  firebase.storage().ref().child('users/'+user.uid).listAll().then(function(res) {
    res.items.forEach(function(folderRef) {
      findingDirectory(user,folderRef,fileName);
    });
    
  }).catch(function(error) {
    console.log(error.message);
  });
}

function findingDirectory(user,folderRef,fileName){
  if(folderRef.fullPath == 'users/'+user.uid+'/'+fileName){
    console.log("Passou porra")
    displayImage(fileName);
  }
  else{
    console.log('Não existe '+ fileName);
  }
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



function wallpaperImage(fileName){
  checkExistsImage(fileName);
  
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

  firebase.auth().onAuthStateChanged(user =>{
    if (user) {
      // User is signed in.
      //Libera a exibição das fotos
      console.log('Usuario logado', user);
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