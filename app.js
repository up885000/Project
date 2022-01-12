const downloadLink = document.getElementById('download'),
    cameraView = document.querySelector("#camera--view"),
    cameraSensor = document.querySelector("#camera--sensor");
var constraints = { video: { facingMode: "environment" }, audio: false },
    button = document.getElementById("mic-button"),
    recordedChunks = [];

function record() {
    navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(
        function(stream) {
            mediaRecorder = new MediaRecorder(stream,{mimeType: 'audio/webm'});
            
            mediaRecorder.addEventListener('dataavailable', function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            });
            
            mediaRecorder.addEventListener('stop', function() {
                downloadLink.innerText = URL.createObjectURL(new Blob(recordedChunks));
                // downloadLink.download = 'mic input.wav';
            });
            
            button.addEventListener('click',function() {
                if (button.alt=="off") {
                    button.alt = "on"
                    button.src = "https://raw.githubusercontent.com/up885000/Project/main/mic on.png"
                    console.log("on");
                    recordedChunks = [];
                    mediaRecorder.start();
                } else {
                    button.alt = "off"
                    button.src = "https://raw.githubusercontent.com/up885000/Project/main/mic off.png"
                    console.log("off");
                    mediaRecorder.stop();
                }
            })
        }
    )
}

function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });

    
}

window.addEventListener("load", cameraStart, false);
window.addEventListener("load", record(), false);

// function mic() {
//     var button = document.getElementById("mic-button");
//     if (button.alt=="off") {
//         button.alt = "on"
//         button.src = "https://raw.githubusercontent.com/up885000/Project/main/mic on.png"
//         console.log("on");
//     } else {
//         button.alt = "off"
//         button.src = "https://raw.githubusercontent.com/up885000/Project/main/mic off.png"
//         console.log("off");
//     }
// }


function chatOpen() {
    document.getElementById("chat-window").style.display = "block";
    document.getElementById("camera-window").style.display = "none";
    document.getElementById("mic-button").alt="on"
    // mic()
}

function chatClose(){
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("camera-window").style.display = "block";
}