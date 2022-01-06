var constraints = { video: { facingMode: "environment" }, audio: true };

const cameraView = document.querySelector("#camera--view"),
      cameraSensor = document.querySelector("#camera--sensor")

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

function mic() {
    var button = document.getElementById("mic-button");
    if (button.alt=="off") {
        button.alt = "on"
        button.src = "mic on.png"
        console.log("on");
    } else {
        button.alt = "off"
        button.src = "mic off.png"
        console.log("off");
    }
}


function chatOpen() {
    document.getElementById("chat-window").style.display = "block";
    document.getElementById("camera-window").style.display = "none";
    document.getElementById("mic-button").alt="on"
    mic()
}

function chatClose(){
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("camera-window").style.display = "block";
}