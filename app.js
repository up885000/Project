const cameraView = document.querySelector("#camera--view"),
    cameraSensor = document.querySelector("#camera--sensor");
var constraints = { video: { facingMode: "environment" }, audio: false },
    button = document.getElementById("mic-button"),
    recordedChunks = [];
    audioBlob = new Blob([], { type: 'audio/wav' });

function record() {
    navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(
        function(stream) {
            mediaRecorder = new MediaRecorder(stream,{mimeType: 'audio/webm'});
            
            mediaRecorder.addEventListener('dataavailable', function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            });
            
            mediaRecorder.addEventListener('stop', function() {
                audioBlob = new Blob(recordedChunks);
                document.getElementById('test').href = URL.createObjectURL(audioBlob);
                document.getElementById('test').download="bob.wav";
                var formData = new FormData();
                formData.append('source', audioBlob);
                $.ajax({
                    type: 'POST',
                    url: 'audioInput',
                    data: formData,
                    // contentType: false,
                    // processData: false,
                });
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


function chatOpen() {
    document.getElementById("chat-window").style.display = "block";
    document.getElementById("camera-window").style.display = "none";
    document.getElementById("mic-button").alt="on"
}

function chatClose(){
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("camera-window").style.display = "block";
}