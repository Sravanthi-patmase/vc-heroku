const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");//templating language used to generate HTML markup with plain JavaScript
const io = require("socket.io")(server);

// const { ExpressPeerServer } = require("peer");
// const { ENGINE_METHOD_RAND } = require("constants");
const  {PeerServer} = require("peer");
//  var peerServer = PeerServer({ port: 9000, path: '/myapp' });
// ExpressPeerServer(server, {
//   debug: true,
// });

app.use("/peerjs", PeerServer);
// app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("index", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  console.log('connected');
  socket.on("joinRoom", (roomId, userId, userName) => {

    var total = io.engine.clientsCount;
    console.log(total,'NoOfClinets');
    if(total < 3){
      socket.join(roomId);
      socket.to(roomId).emit("userConnected", userId);//broadcast all the users in room including sender
      socket.on("message", (message) => {
        io.to(roomId).emit("createMessage", message, userName);
      });
    }else{
      console.log('GGGG',roomId)
      socket.emit('roomfull',roomId);
    }

    // Communicate the disconnection
    socket.on('disconnect', () => {
      var total = io.engine.clientsCount;
      console.log(total,'totalAfterDisconccted');
      console.log("disconnected")
      socket.broadcast.emit('user-disconnected', userId)
    })
  });
});

server.listen(process.env.PORT || 3030); 