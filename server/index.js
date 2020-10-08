const { userInfo } = require("os");

const port = 3000;
const io = require("socket.io")(port);

const arrUserInfo = [];

io.on("connection", (socket) => {
  socket.on("USER_SIGN_UP", (user) => {
    arrUserInfo.push(user);

    //answer to clients
    socket.emit("LIST_USER_ONLINE", arrUserInfo);
    io.emit("NEW_USERS", user);
  });
});
