var express = require("express");
var NeuralNetwork = require("../../src/NeuralNetwork.js").NeuralNetwork;

let data = [
  {
    input: [0, 0],
    target: [0]
  },
  {
    input: [0, 1],
    target: [1]
  },
  {
    input: [1, 0],
    target: [1]
  },
  {
    input: [1, 1],
    target: [0]
  }
];

let iterations = 10000;

let nn = new NeuralNetwork([2, 10, 1], 1);

let errorData = [];

train();

const app = express();
app.listen(3000, () => {
  console.log("Listening at 3000...");
});
app.use(express.static("public"));

app.post("/errorData", (req, res) => {
  res.json({ errorData: errorData });
});

function train() {
  for (let i = 0; i < iterations; i++) {
    let index = Math.floor(Math.random() * data.length);

    let inputs = data[index].input;
    let targets = data[index].target;

    let outputs = nn.feedForward(inputs);

    let error = 0;
    for (let j = 0; j < outputs.length; j++) {
      error += Math.abs(outputs[j] - targets[j]);
    }
    error = error / outputs.length;

    errorData.push({ iter: i, error: error });

    nn.train(targets);
  }
}

// function sleep(time) {
//   return new Promise(resolve => setTimeout(resolve, time));
// }
