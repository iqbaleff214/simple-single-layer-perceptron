class NeuralNetwork {
  constructor(trainingData) {
    this.isTrained = false;
    this.trainingData = trainingData;
    this.networkConfig = {
      inputSize: 3,
      inputRange: 3,
      //   hiddenLayers: 3,
      //   outputSize: 1,
    };
    this.net = new brain.NeuralNetwork(this.networkConfig);
  }
  getNetwork() {
    return this.net;
  }
  getRendered(config) {
    if (!this.isTrained) this.trainData();
    return brain.utilities.toSVG(this.net, config);
  }
  trainData(log = false) {
    this.isTrained = true;
    console.log("data training...");
    this.net.train(this.trainingData, { log: log });
  }
  testData(obj) {
    return this.net.run(obj);
  }
}
