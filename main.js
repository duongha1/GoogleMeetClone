const socket = io("http://localhost:3000");

//Listen data from server
socket.on("LIST_USER_ONLINE", (arrUserInfo) => console.log(arrUserInfo));
socket.on("NEW_USERS", (user) => console.log(user));

//access media devices to get stream
function openStream() {
  const constraints = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(constraints);
}

//This function to play the stream
function playStream(idVideoEl, stream) {
  const video = document.getElementById(idVideoEl);
  video.srcObject = stream;
  video.play();
}

//Element
const peer = new Peer();

//Create an ID of a call
const peerIdCall = peer.on("open", (id) => {
  console.log(id);
  $("#my-peer").append(id);

  //when connect with client successfully, client click on sign up will send usrname and id to server
  $("#btnSignup").click(() => {
    const username = $("#txtUsername").val();

    //send to server
    socket.emit("USER_SIGN_UP", { usr: username, peerId: id });
  });
});
console.log(peerIdCall);

//Caller
$("#btn-call").click(() => {
  const id = $("remoteId").val(); //ID of the person want to call to
  openStream()
    .then((stream) => {
      playStream("localStream", stream); //this is a local stream in your computer
      const call = peer.call(id, stream); //.call(insert the id want to call, providing our mediaStream)

      //when receiver pick up the phone, we will play the stream from them
      call.on("stream", (remoteStream) =>
        playStream("remoteStream", remoteStream)
      );
    })
    .catch((err) => console.log(err.message));
});

//Receiver
peer.on("call", (call) => {
  openStream()
    .then((stream) => {
      call.answer(stream);
      playStream("localStream", stream);
      //stream from the caller
      call.on("stream", (remoteStream) =>
        playStream("remoteStream", remoteStream)
      );
    })
    .catch((err) => console.log(err.message));
});
