# Simple-Neural-Net-Library
A simple neural network library written in javascript with multi-layer support.

## Introduction
This is a simple neural network library supporting multi-layer fully connected networks.

## Network Specifications

### Layers
Currently, only fully-connected layers are supported.

### Activation Functions
Currently, sigmoid function <code>&#963;(x) = 1/(1+e^-x)</code> is used. More functions will be added soon.

### Error Functions
Currently, Mean Squared Error, `M.S.E = 1/2 * (outputs - targets)^2` is used. More will be added soon.

## Usage 
A new instance of neural network is created as follows:

`let nn = new NeuralNetwork(depth,nodeCounts,learningRate);`

It takes three parameters:

`depth` : The number of layers in the neural network. (Number)

`nodeCounts` : An array of `depth` number of Number elements representing number of nodes in the layers. (Array)

`learningRate` : The rate of learning of the neural network. (Number)

To get the output of the neural network, call `nn.feedForward(inputs` where `inputs` is the inputs array.

To train the network, call `nn.train(expectedOutputs,[inputs])`. If `inputs` is specified, it runs the `feedForward` and then trains. Otherwise, it uses the existing values (i.e., values from the last time it ran `feedForward`) to train the network.
