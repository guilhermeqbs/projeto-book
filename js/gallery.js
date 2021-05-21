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
var profile = document.getElementById('img-profile');
var  wallpaper= document.getElementById('img-wallpaper');
const fileNameProfile = 'profile.jpg';
const fileNameWallpaper = 'wallpaper.jpg';
var pathNameGalleryImage;

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
      var j = 0;
      var i = 1;//contagem das imagens | Decidir se vai usar id ou classe para o upload das imagens
      //Lembrando que quando for editar uma imagem, na hora do Upload tem que apagar a anterior, se não ela vai imprimir dnv.
      //Da pra pegar o name usando meta data
      firebase.storage().ref().child('users/'+pathNameGalleryImage)
        .listAll().then(function(images){
          images.items.forEach(function(image){
            
            //innerHtml(image);  Acada 3 itens criar uma nova row

            image.getDownloadURL().then(function(url) {
              console.log('List imagens: '+ image.name);
              //mudar pra (resto da divisao por 3) == 0
              if(i == 4){ //tenho que ver exatamente qual numero colocar
                gallerySection.innerHTML += 
                `<div class="row g-4 text-center my-5 margin-row gallery-row">
                `;
                galleryRow = document.querySelectorAll('.gallery-row');
                j+=1;
              }

              galleryRow[j].innerHTML += 
              `<div class="col col-md-4" id="col-card-${i}">

                <form id="upload-form-gallery-${i}" action="" method="post" enctype="multipart/form-data">
                  <input type="file" name="file" id="file-gallery-${i}">
                  <input type="submit" value="Upload image" name="submit">
                </form>
                  
                <div class="card h-100 w-100">
                  <img src="${url}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${image.name}</h5>
                  </div>
                </div>
              </div>
               
            `;

            var cardAdd = document.getElementById('col-card-0');
            var newCard = document.getElementById(`col-card-${i}`);
            newCard.insertAdjacentElement("afterend", cardAdd); 

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
    alert('Imagem não encontrada');
    break;
  }

  //gallery.innerHTML += `<img src="${url}" width="300" />`;
}

function galleryImage(pathNameGalleryImage){
  checkExistsImage(pathNameGalleryImage);
  loadImages('',pathNameGalleryImage);
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
  var user = firebase.auth().currentUser;       //posso passar so o nome dapasta
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

  if(checkExistsImage(fileName)){
    console.log('Existe '+ fileName);
    displayImage(fileName);
  }
  else{
    console.log('Não existe '+ fileName);
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

  if(checkExistsImage(fileName)){
    console.log('Existe '+ fileName);
    displayImage(fileName);
  }
  else{
    console.log('Não existe '+ fileName);
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