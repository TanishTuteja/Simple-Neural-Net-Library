var express = require("express");
var fs = require("fs");
var NeuralNetwork = require("../../src/NeuralNetwork.js").NeuralNetwork;

let trainingData = [];

let data = fs.readFileSync("iris.data", "utf-8");
let datas = data.split("\n");

datas.forEach(element => {
  let dataPoints = element.split(",");
  let currTarget;
  switch (dataPoints[4]) {
    case "Iris-setosa":
      currTarget = [1, 0, 0];
      break;
    case "Iris-versicolor":
      currTarget = [0, 1, 0];
      break;
    case "Iris-virginica":
      currTarget = [0, 0, 1];
      break;
    default:
      console.log("Error! None matches");
      break;
  }
  trainingData.push({
    input: [
      parseFloat(dataPoints[0]),
      parseFloat(dataPoints[1]),
      parseFloat(dataPoints[2]),
      parseFloat(dataPoints[3])
    ],
    target: currTarget
  });
});

shuffleArray(trainingData);

let trainIterations = 50000;
let trainFrac = 0.9;

let nn = new NeuralNetwork(4, [4, 20, 20, 3], 1);

let trainData = [];
let testData = [];

train();
test();

const app = express();
app.listen(3000, () => {
  console.log("Listening at 3000...");
});
app.use(express.static("public"));

app.post("/trainData", (req, res) => {
  res.json({ errorData: trainData });
});
app.post("/testData", (req, res) => {
  res.json({ errorData: testData });
});

function train() {
  for (let i = 0; i < trainIterations; i++) {
    let index = Math.floor(Math.random() * trainingData.length * trainFrac);

    let inputs = trainingData[index].input;
    let targets = trainingData[index].target;

    let outputs = nn.feedForward(inputs);

    let error = 0;
    for (let j = 0; j < outputs.length; j++) {
      error += Math.abs(outputs[j] - targets[j]);
    }
    error = error / outputs.length;

    trainData.push({ iter: i, error: error });

    nn.train(targets);
  }
}

function test() {
  let testStartIndex = trainingData.length * trainFrac;

  for (let i = testStartIndex; i < trainingData.length; i++) {
    let index = Math.floor(
      Math.random() * trainingData.length * (1 - trainFrac) + testStartIndex
    );

    let inputs = trainingData[index].input;
    let targets = trainingData[index].target;

    let outputs = nn.feedForward(inputs);

    let error = 0;
    for (let j = 0; j < outputs.length; j++) {
      error += Math.abs(outputs[j] - targets[j]);
    }
    error = error / outputs.length;

    testData.push({ iter: i - testStartIndex, error: error });
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
