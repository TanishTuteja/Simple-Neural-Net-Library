var NeuralNetwork = require("../../src/NeuralNetwork.js").NeuralNetwork;

class Agent {
  constructor(stateLength, actionNum) {
    this.nn = new NeuralNetwork(3, [stateLength, 100, actionNum]);
    this.eGreed = 0.9;
    this.trainingData = [];
    this.currState = null;
    this.currAction = null;
  }

  getAction(newState, reward) {
    if (this.currAction != null && this.currState != null) {
      this.trainingData.push({
        prevState: this.currState,
        action: this.currAction,
        reward: reward,
        newState: newState
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

  softMax(values, beta = 1) {
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
}

exports.Agent = Agent;
