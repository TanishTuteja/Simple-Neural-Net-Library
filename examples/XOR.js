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

let iterations = 100000;
let input = [0, 0];
let target = 1;

let nn = new NeuralNetwork(3, [2, 10, 1], 0.1);

for (let i = 0; i < iterations; i++) {

    let index = Math.floor(Math.random() * data.length);

    let inputs = data[index].input;
    let targets = data[index].target;

    nn.train(targets, inputs);
}

let out = nn.feedForward([1, 1]);
console.log(out);
//console.log("Error: " + (outputs[0] - targets[0]) + " Inputs: " + inputs.toString() + " Outputs: " + outputs.toString() + " Targets: " + targets.toString());