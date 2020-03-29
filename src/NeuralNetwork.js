var Matrix = require("../lib/Matrix.js").Matrix;

function sigmoid(num, i, j) {
  return 1 / (1 + Math.pow(Math.E, -num));
}

function dsigmoid(sigNum) {
  return sigNum * (1 - sigNum);
}

class NeuralNetwork {
  constructor(nodeCounts, learningRate) {
    this.depth = nodeCounts.length;
    this.learningRate = learningRate;

    this.layers = [];
    this.weights = [];
    this.biases = [];

    for (var i = 0; i < this.depth; i++) {
      this.layers[i] = new Matrix(nodeCounts[i], 1);
    }

    for (var i = 1; i < this.depth; i++) {
      this.weights[i] = new Matrix(nodeCounts[i], nodeCounts[i - 1]);
      this.weights[i].randomize(-1, 1);

      this.biases[i] = new Matrix(nodeCounts[i], 1);
    }
  }

  feedForward(inputs) {
    this.layers[0] = Matrix.fromArray(inputs);

    for (var i = 1; i < this.depth; i++) {
      this.layers[i] = Matrix.matrixProduct(
        this.weights[i],
        this.layers[i - 1]
      );
      this.layers[i] = Matrix.addElementwise(this.layers[i], this.biases[i]);
      this.layers[i].map(sigmoid);
    }

    //To display the result
    //this.layers[this.depth - 1].display();

    var outputs = Matrix.toArray(this.layers[this.depth - 1]);

    return outputs;
  }

  train(targets_array, inputs) {
    //if inputs is specified, update all values by running feedforward
    if (typeof inputs !== "undefined") {
      this.feedForward(inputs);
    }

    //convert targets array to matrix
    let targets = Matrix.fromArray(targets_array);

    //stores errors
    let errors = [];

    //stores changes in weights and biases
    let deltaW = [];
    let deltaB = [];

    //Cost funtion is mean squared error

    //specify error for output layer
    let derivativeMatrix = Matrix.map(this.layers[this.depth - 1], dsigmoid);
    errors[this.depth - 1] = Matrix.subtractElementwise(
      this.layers[this.depth - 1],
      targets
    );
    errors[this.depth - 1] = Matrix.multiplyElementwise(
      errors[this.depth - 1],
      derivativeMatrix
    );

    //calculate deltaB and deltaW for output layer
    let transposedInputs = Matrix.transpose(this.layers[this.depth - 2]);
    deltaW[this.depth - 1] = Matrix.matrixProduct(
      errors[this.depth - 1],
      transposedInputs
    );
    deltaW[this.depth - 1] = Matrix.multiplyScalar(
      deltaW[this.depth - 1],
      -this.learningRate
    );
    deltaB[this.depth - 1] = Matrix.multiplyScalar(
      errors[this.depth - 1],
      -this.learningRate
    );

    //for each layer from 2nd last to 1st hidden, calculate error and then deltaW and deltaB
    for (var i = this.depth - 2; i > 0; i--) {
      let transposedWeights = Matrix.transpose(this.weights[i + 1]);
      let derivativeMatrix = Matrix.map(this.layers[i], dsigmoid);

      errors[i] = Matrix.matrixProduct(transposedWeights, errors[i + 1]);
      errors[i] = Matrix.multiplyElementwise(errors[i], derivativeMatrix);

      let transposedInputs = Matrix.transpose(this.layers[i - 1]);

      deltaW[i] = Matrix.matrixProduct(errors[i], transposedInputs);
      deltaW[i] = Matrix.multiplyScalar(deltaW[i], -this.learningRate);

      deltaB[i] = Matrix.multiplyScalar(errors[i], -this.learningRate);
    }

    //update weights and biases
    for (var i = 1; i < this.depth; i++) {
      this.weights[i] = Matrix.addElementwise(this.weights[i], deltaW[i]);
      this.biases[i] = Matrix.addElementwise(this.biases[i], deltaB[i]);
    }
  }

  save(path) {
    var fs = require("fs");

    let contentObj = {
      weights: this.weights,
      biases: this.biases
    };

    const content = JSON.stringify(contentObj);

    try {
      const data = fs.writeFileSync(path, content);
      console.log("Saved NN successfully");
    } catch (err) {
      console.log("Couldn't save NN");
    }
  }

  load(path) {
    var fs = require("fs");

    try {
      let data = fs.readFileSync(path, "utf-8");

      let content = JSON.parse(data);

      this.weights = content.weights;
      this.biases = content.biases;

      console.log("Loaded NN successfully");
    } catch (err) {
      console.log("Failed to load file, going with new NN");
    }
  }
}

exports.NeuralNetwork = NeuralNetwork;
