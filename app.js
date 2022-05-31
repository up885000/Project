const cameraView = document.querySelector("#camera--view"),
    cameraSensor = document.querySelector("#camera--sensor"),
    modelAnimation = document.querySelector("#model"),
    volButton = document.querySelector("#vol-button");
var constraints = { video: { facingMode: "environment" }, audio: false },
    button = document.getElementById("mic-button"),
    textBox = document.getElementById("textBox"),
    recordedChunks = [],
    currentLocation = null,
    chat = [],
    speaker = window.speechSynthesis,
    msg = new SpeechSynthesisUtterance();
    // chat.push([0,"me"]);
    // chat.push([0,"me"]);
    // chat.push([1,"server"]);
    // chat.push([0,"me"]);
    // chat.push([1,"server"]);
    // chat.push([1,"server"]);
    

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
                urlData = "/audioInput"
                $.ajax({
                    type: 'POST',
                    url: urlData,
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
    let ajaxData = {};
    ajaxData.msgdata = response;
    urlData = "/assistantOutput"
    $.ajax({
                    type: 'POST',
                    url: urlData,
                    data: ajaxData,
                    success: assistantOutput,
                });
    loadChat();
}

function send(){
    console.log(textBox.value)
    sttOutput(textBox.value)
    textBox.value = ""
}

function speak(){
    modelAnimation.setAttribute("animation-mixer","clip: *; loop: repeat")
}

function idle(){
    modelAnimation.setAttribute("animation-mixer","clip: idle; loop: once")
}

msg.onend = function(event){
    idle();
};

function assistantOutput(response){
    console.log(response);
    chat.push([1,response]);
    msg.text = response;
    speak();
    speaker.speak(msg);  
    loadChat();
}


window.addEventListener("load", record(), false);


function chatOpen() {
    document.getElementById("chat-window").style.display = "block";
    document.getElementById("camera-window").style.display = "none";
    document.getElementById("mic-button").alt="on"
    loadChat();
}

function chatClose(){
    document.getElementById("chat-window").style.display = "none";
    document.getElementById("camera-window").style.display = "block";
}

function loadChat(){
    document.getElementById("chat-box").innerHTML=""
    for (let i = 0; i < chat.length; i++){
        document.getElementById("chat-box").innerHTML = document.getElementById("chat-box").innerHTML + "<h2 id=index"+chat[i][0] +">"+chat[i][1]+"</h2>"
    }
}

function volSwitch(){
    if (volButton.alt=="on") {
        volButton.alt = "off"
        volButton.src = "https://raw.githubusercontent.com/up885000/Project/main/vol off.png"
        msg.volume=0;
        speaker.cancel();
    } else {
        volButton.alt = "on"
        volButton.src = "https://raw.githubusercontent.com/up885000/Project/main/vol on.png"
        msg.volume=1;
    }
}
msg.volume=1
// idle();
assistantOutput("Hello, I can answer questions about locations, hours, events, and COVID-19 information of Portsmouth university.  How can I help you?")