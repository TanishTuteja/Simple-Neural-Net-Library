let data = [{
    input: [0, 0],
    target: [0]
}, {
    input: [0, 1],
    target: [1]
}, {
    input: [1, 0],
    target: [1]
}, {
    input: [1, 1],
    target: [0]
}]

let iterations = 5000;
let input = [0, 0];
let target = 1;

let nn = new NeuralNetwork(3, [2, 10, 1], 1);

let myGraph = new Graph(4, 0.002);

for (let i = 0; i < iterations; i++) {

    let index = Math.floor(Math.random() * data.length);

    let inputs = data[index].input;
    let targets = data[index].target;

    let outputs = nn.feedForward(inputs);

    let error = outputs[0] - targets[0];
    myGraph.addData(i, Math.abs(error));

    nn.train(targets, inputs);
}

myGraph.update();