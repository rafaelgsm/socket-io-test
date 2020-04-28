var io = require("socket.io")(80);

const express = require("express");
const app = express();

//use name of root folder as parameter (Requests for static files)
let staticMiddleware = express.static("public");

//Requests to the server will pass through the middleware:
app.use(staticMiddleware);

//To parse request body: "req.body.fieldName"
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Exposing js library form socketIO to the front end:
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io-client/dist/socket.io.js");
});

/**
 * Here we are listening to the 'chat message' event, and broadcasting it to everyone,
 * as soon as we receive it.
 */
io.on("connection", socket => {
  console.log("a user connected");

  //This is how you listen to an event:
  socket.on("chat message", msg => {
    console.log("message: " + msg);

    //This is how you broadcast:
    io.emit("chat message", msg);
  });
});

///////////////////////////////////////////////////////////////////

//.....

//Create a setting value for our application:
//Check if the environment already has a port, otherwise use 8080
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), () => {
  console.log("Server listening on ", app.get("port"));
});

io.listen(server);
