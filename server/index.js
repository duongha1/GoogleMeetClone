const { userInfo } = require("os");

const port = 3000;
const io = require("socket.io")(port);

const arrUserInfo = [];

io.on("connection", (socket) => {
  socket.on("USER_SIGN_UP", (user) => {
    //check username exist or not
    const isExist = arrUserInfo.some(el => el.name === user.name);
    socket.peerId = user.peerId;
    if(isExist){
      return socket.emit('SIGN_UP_FAIL');
    }
    
    //if username does not exist
    arrUserInfo.push(user);

    //answer to clients
    socket.emit("LIST_USER_ONLINE", arrUserInfo);
    socket.broadcast.emit("NEW_USERS", user);//send to everyone except the sender
  });

  //Disconnect
  socket.on('disconnect', ()=>{
    const index = arrUserInfo.findIndex(user => user.peerId === socket.peerId);
    arrUserInfo.splice(index,1);
    io.emit('USER_DISCONNECT', socket.peerId);
  });
});
