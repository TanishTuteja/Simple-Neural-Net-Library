var express = require("express");

const app = express();

var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var Agent = require("./Agent.js").Agent;

let agent;

io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("initialize", (data) => {
    console.log("Initializing...");
    agent = new Agent(data.stateLength, data.actionNum, __dirname + "/configData.json", __dirname + "/training.json");
    console.log("Done initializing");
  });

  socket.on("action", (data) => {
    let state = data.state;
    let reward = data.reward;

    let action = agent.getAction(state, reward);
    io.emit("actionRes", { action: action });
  });

  socket.on("train", (data) => {
    console.log("Training..");
    agent.currState = null;
    agent.currAction = null;
    agent.train();
  });

  socket.on("disconnect", () => {
    console.log("Disconnected, Saving Data... ");
    agent.saveNetwork(__dirname + "/configData.json", __dirname + "/training.json");
  });
});

server.listen(3000, () => {
  console.log("Listening at 3000...");
});

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));
