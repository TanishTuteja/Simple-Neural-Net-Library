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

let nn = new NeuralNetwork(3, [2, 10, 1], 1);

let myGraph = new Graph(10, 0.002);

train();

function train() {
  for (let i = 0; i < iterations; i++) {
    let index = Math.floor(Math.random() * data.length);

    let inputs = data[index].input;
    let targets = data[index].target;

    let outputs = nn.feedForward(inputs);

    let error = outputs[0] - targets[0];

    if (i % 100 == 0) {
      sleep(0).then(() => {
        myGraph.addData(i, Math.abs(error));
      });
    }
    nn.train(targets);
  }
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
