import NeuralNetwork from "./neural_network"

//XOR
const trainingData = [
    {input: [0,0], output: [0]},
    {input: [0,1], output: [1]},
    {input: [1,0], output: [1]},
    {input: [1,1], output: [0]},
]

const network = new NeuralNetwork(2,[2],1,'relu')

const learningRate = 0.1
const epochs = 10000
network.train(trainingData,learningRate,epochs,true)
console.log('\nTEST')
const testData = [
    [0,0],
    [0,1],
    [1,0],
    [1,1]
]

for(let input of testData){
    const prediction = network.forward(input)
    let pred = prediction
    console.log(`Input: ${input}, Prediction: ${(pred/1).toFixed(8)}`)
}