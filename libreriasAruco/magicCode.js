var video, canvas, context, imageData, detector;


const students = [
  {"id": 0, "name": "Test"},
  {"id": 1, "name": "Cervantes Gonzalez"},
  {"id": 2, "name": "Chavez Ramirez"},
  {"id": 3, "name": "Flores Ramirez"},
  {"id": 4, "name": "Garcia Gonzalez"},
  {"id": 5, "name": "Montero Valdez"},
  {"id": 6, "name": "Pastor Martinez"},
  {"id": 7, "name": "Rios Martinez"},
  {"id": 8, "name": "Parra Lopez"},
  {"id": 9, "name": "Guzman Diaz"},
  {"id": 10, "name": "Contreras Cardenas"},
  {"id": 11, "name": "Iglesias Jimenez"}
]

//funcion para que inicie justo cuando carga la pantalla
const  onLoad = () => {
  //toma los elemtos del dom, tanto el video como el cambas mediante id
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = parseInt(canvas.style.width);
  canvas.height = parseInt(canvas.style.height);
  
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }

      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
  
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function(stream) {
      if ("srcObject" in video) {
        video.srcObject = stream;
      } else {
        video.src = window.URL.createObjectURL(stream);
      }
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }
  );
    
  detector = new AR.Detector();

  requestAnimationFrame(tick);
}

const tick = () => {
  requestAnimationFrame(tick);
  
  if (video.readyState === video.HAVE_ENOUGH_DATA){
    snapshot();

    //Esta variable es la que cuenta con un objeto Ar.marker el cual tiene id y corners (4 como array)
    var markers = detector.detect(imageData);
    drawCorners(markers);
    drawId(markers);
    getId(markers)
    //console.log(markers)
    //send_data(markers)
  }
}

const snapshot = () => {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}
      
const  drawCorners = (markers) => {
  var corners, corner, i, j;

  context.lineWidth = 3;

  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;
    
    context.strokeStyle = "red";
    context.beginPath();
    
    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];
      context.moveTo(corner.x, corner.y);
      corner = corners[(j + 1) % corners.length];
      context.lineTo(corner.x, corner.y);
    }

    context.stroke();
    context.closePath();
    
    context.strokeStyle = "green";
    context.strokeRect(corners[0].x - 2, corners[0].y - 2, 4, 4);
  }
}


//Esta funcion en este caso imprime el nommbre del usuario con su id asi como tambien con coordenadas ubica el nombre de una esquina
const  drawId = (markers) =>  {
  var corners, corner, x, y, i, j;
  
  context.strokeStyle = "black";
  context.font = '25px Arial';
  context.lineWidth = 2;
  
  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;
    
    x = Infinity;
    y = Infinity;
    
    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];
      
      x = Math.min(x, corner.x);
      y = Math.min(y, corner.y);
    }

    context.strokeText(`${students[markers[i].id].name}`, x, y)
    
    //LaLista(students[markers[i].id].name)
  }
}

// Asi es como se consigue el id de un marker
const getId = (markers) => {
  for (let i = 0; i !== markers.length; ++ i){
    console.log(LaLista(lista, students[markers[i].id].name))
    //console.log(markers[i].id)
  }
}

var lista = []

const takelist = () => {
  lista = []
  console.log('Lista limpiada preparada para llenarse :)')
}

const LaLista = (lista, student) => {
  if(lista.indexOf(student) === -1 ){
    lista.push(student)
  }else {
    return lista
  }
}

const showlist = () =>{
  console.log('esta es la lista')
  var thelist  = lista
  for(let i = 0; i < thelist.length; i++){
    console.log(thelist[i])
    document.getElementById("demo").innerHTML = thelist[i]
    document.createElement("br")
  }


  lista.map((item) => {
    
  })


}


function loadTableData() {
  const table = document.getElementById("testBody");
  lista.forEach( item => {
    let row = table.insertRow();
    let date = row.insertCell(0);
    date.innerHTML = item;
    let name = row.insertCell(1);
    name.innerHTML = 'yes';
  });
}

window.onload = onLoad;
