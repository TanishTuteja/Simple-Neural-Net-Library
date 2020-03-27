var express = require("express");
var Agent = require("./Agent.js").Agent;

const app = express();
const server = app.listen(3000, () => {
  console.log("Listening at 3000...");
});

app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));

let agent;

app.post("/initialize", (req, res) => {
  let data = req.body;
  agent = new Agent(
    data.stateLength,
    data.actionNum,
    __dirname + "/configData.json"
  );
});

app.post("/action", (req, res) => {
  let data = req.body;
  let state = data.state;
  let reward = data.reward;

  let action = agent.getAction(state, reward);
  res.json({ action: action });
});

app.post("/train", (req, res) => {
  // let data = req.body;
  // let state = data.state;
  // let reward = data.reward;

  // let action = agent.getAction(state, reward);
  // res.json({ action: action });
  console.log("Training..");
  agent.currState = null;
  agent.currAction = null;
  agent.train();
  res.end();
});

app.post("/exit", (req, res) => {
  console.log("Exiting");
  agent.nn.save(__dirname + "/configData.json");
  res.end();
});
