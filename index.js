import NeuralNetwork from "./neural_network"

//XOR
const trainingData = [
    {input: [0,0,0], output: [0,0]},
    {input: [0,0,1], output: [0,1]},
    {input: [0,1,0], output: [1,0]},
    {input: [0,1,1], output: [1,1]},
]

const network = new NeuralNetwork(3,[2],2,'relu')

const learningRate = 0.1
const epochs = 300
network.train(trainingData,learningRate,epochs,true)
console.log('TESTING...')
const testData = [
    [0,0,1],
    [0,1,0],
    [0,0,0],
    [0,1,1]
]

for(let input of testData){
    const prediction = network.forward(input)
    console.log(`Input: ${input}, Prediction: ${prediction}`)
}



  