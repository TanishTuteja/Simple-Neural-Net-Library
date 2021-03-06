var NeuralNetwork = require("../../src/NeuralNetwork.js");

class Agent {
  constructor(stateLength, actionNum, fileToLoad, trainingFileToLoad) {
    this.nn = new NeuralNetwork([stateLength, 50, 20, actionNum], 0.5);
    if (fileToLoad) {
      this.nn.load(fileToLoad);
    } else {
      console.log("No File Specified, Generating Random NN");
    }

    this.trainingNum = 0;

    if (trainingFileToLoad) {
      var fs = require("fs");
      try {
        let data = fs.readFileSync(trainingFileToLoad, "utf-8");
        let content = JSON.parse(data);

        this.trainingNum = content.trainingNum;

        console.log("Loaded Training Count successfully");
      } catch (err) {
        console.log("Failed to load Training Count, initial training count will be 0");
      }
    }

    this.defaultEGreed = 0.95;
    this.eGreedTimeConst = 100;
    this.eGreed = this.defaultEGreed * Math.exp(-this.trainingNum / this.eGreedTimeConst);
    this.trainingData = [];
    this.currState = null;
    this.currAction = null;
    this.batchSize = 100;
    this.memory = 1000;
    this.discountFac = 0.9;
  }

  getAction(newState, reward) {
    if (this.currAction != null && this.currState != null) {
      if (this.trainingData.length > this.memory) {
        this.trainingData.shift();
      }
      this.trainingData.push({
        prevState: this.currState,
        action: this.currAction,
        reward: reward,
        newState: newState,
      });
    }

    let outputs = this.nn.feedForward(newState);

    let randOrProb = Math.random();
    let action;

    if (randOrProb > this.eGreed) {
      let probs = this.softMax(outputs);

      let p = Math.random();
      let cumulativeProbability = 0;

      for (let i = 0; i < probs.length; i++) {
        cumulativeProbability += probs[i];
        if (p <= cumulativeProbability) {
          action = i;
          break;
        }
      }
    } else {
      action = Math.floor(Math.random() * outputs.length);
    }

    this.currState = newState;
    this.currAction = action;

    return action;
  }

  train() {
    let iter = Math.min(this.batchSize, this.trainingData.length);
    for (let i = 0; i < iter; i++) {
      let index = Math.floor(Math.random() * this.trainingData.length);
      const currData = this.trainingData[index];

      let targets = this.nn.feedForward(currData.prevState);
      let nextOutputs = this.nn.feedForward(currData.newState);
      let maxFutureReward = this.getMax(nextOutputs);
      let expectedQ = currData.reward + this.discountFac * maxFutureReward;
      targets[currData.action] = expectedQ;
      this.nn.train(targets, currData.prevState);
    }

    this.trainingNum++;
    this.eGreed = this.defaultEGreed * Math.exp(-this.trainingNum / this.eGreedTimeConst);
  }

  softMax(values, beta = 5) {
    let intermediates = [];
    let probs = [];
    let total = 0;

    for (let i = 0; i < values.length; i++) {
      let expVal = Math.exp(values[i] * beta);
      intermediates[i] = expVal;
      total += expVal;
    }

    for (let i = 0; i < values.length; i++) {
      probs[i] = intermediates[i] / total;
    }

    return probs;
  }

  getMax(array) {
    let maxIndex = 0;
    let maxValue = array[0];

    for (let i = 0; i < array.length; i++) {
      if (array[i] > maxValue) {
        maxValue = array[i];
        maxIndex = i;
      }
    }
    return maxValue;
  }

  saveNetwork(savePathNetwork, savePathTraining) {
    this.nn.save(savePathNetwork);
    var fs = require("fs");

    let contentObj = {
      trainingNum: this.trainingNum,
    };

    const content = JSON.stringify(contentObj);

    try {
      const data = fs.writeFileSync(savePathTraining, content);
      console.log("Saved Training Count successfully");
    } catch (err) {
      console.log("Couldn't save Training Count");
    }
  }
}

exports.Agent = Agent;
