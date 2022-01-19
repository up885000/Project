const cameraView = document.querySelector("#camera--view"),
    cameraSensor = document.querySelector("#camera--sensor");
var constraints = { video: { facingMode: "environment" }, audio: false },
    button = document.getElementById("mic-button"),
    recordedChunks = [],
    chat = [];

function record() {
    navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(
        function(stream) {
            mediaRecorder = new MediaRecorder(stream,{type: 'audio/wav'});
            
            mediaRecorder.addEventListener('dataavailable', function(e) {
                if (e.data.size > 0) recordedChunks.push(e.data);
            });
            
            mediaRecorder.addEventListener('stop', function() {
                let audioBlob = new Blob(recordedChunks, { type: "audio/wav" });
                var formData = new FormData()
                formData.append('source', audioBlob)
                console.log(audioBlob);
                $.ajax({
                    type: 'POST',
                    url: 'audioInput',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: sttOutput,
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

function sttOutput(response){
    console.log(response);
    chat.push([0,response]);
    $.ajax({
                    type: 'POST',
                    url: 'assistantOutput',
                    data: response,
                    processData: false,
                    contentType: false,
                    success: assistantOutput,
                });
}


function assistantOutput(response){
    console.log(response);
    chat.push([1,response]);
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
    loadChat;
}

function chatClose(){
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("camera-window").style.display = "block";
}

function loadChat(){

}