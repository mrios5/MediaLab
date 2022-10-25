var video, canvas, context, imageData, detector;


const student = [
    {"id": 0, "name": "foo"},
    {"id": 1, "name": "Manuel"},
    {"id": 2, "name": "Gerardo"},
    {"id": 3, "name": "Angel"},
    {"id": 4, "name": "Luis"},
    {"id": 5, "name": "Skittles"},
    {"id": 6, "name": "Jeff"}
]

const  onLoad = () => {
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

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

    var markers = detector.detect(imageData);
    drawCorners(markers);
    drawId(markers);

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

const  drawId = (markers) =>  {
  var corners, corner, x, y, i, j;
  
  context.strokeStyle = "lightgreen";
  context.font = 'bold 48px serif'
  context.lineWidth = 5;
  
  for (i = 0; i !== markers.length; ++ i){
    corners = markers[i].corners;
    
    x = Infinity;
    y = Infinity;
    
    for (j = 0; j !== corners.length; ++ j){
      corner = corners[j];
      
      x = Math.min(x, corner.x);
      y = Math.min(y, corner.y);
    }

    //context.strokeText(`Got it ${markers[i].id}`, x, y)
    context.strokeText(`Got it ${student[markers[i].id].name}`, x, y)
  }
}

const send_data = (markers) => {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://admin:admin@cluster0.tzrgkus.mongodb.net/TakeTheList');

    const listData = mongoose.model('people', 
        { 
            name: String, 
            assist: String
        });
    
    const get_data = (name) => {
        const Data = {"name": `${name}`, "assist": "Yes"}
        return Data
    }

    const save_Data = () => {
        var GoodData = new listData(get_data())
        GoodData.save()
        console.log("maybe its done")
    }
    
    var corners, i;
    
    for (i = 0; i !== markers.length; ++ i){
      corners = markers[i].corners;
      console.log(markers[i].id)
      get_data(student[markers[i].id].name)
    }
}


window.onload = onLoad;