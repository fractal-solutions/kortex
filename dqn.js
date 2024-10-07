import NeuralNetwork from './neural_network.js' 
const log = console.log
import asciichart from 'asciichart'

class DQNAgent {
    constructor(env) {
        this.env = env  // Environment instance
        this.stateSize = env.stateSize
        this.actionSize = env.actionSize
        this.gamma = 0.99
        this.epsilon = 1.0
        this.epsilonMin = 0.1
        this.epsilonDecay = 0.99994
        this.learningRate = 0.001
        this.memory = []
        this.scoreCurve = []

        this.model = new NeuralNetwork(this.stateSize, [24,8], this.actionSize)
        this.targetModel = new NeuralNetwork(this.stateSize, [24,8], this.actionSize)
    }

    remember(state, action, reward, nextState, done) {
        const qValues = this.model.forward(state)
        const nextQValues = this.targetModel.forward(nextState)
        const target = reward + (done ? 0 : this.gamma * Math.max(...nextQValues))
        const tdError = Math.abs(target - qValues[action])
    
        // Store with priority (TD error)
        this.memory.push({ state, action, reward, nextState, done, priority: tdError })
    }
    
    act(state, explore = true) {
        if (explore && Math.random() <= this.epsilon) {
            return Math.floor(Math.random() * this.actionSize)
        }
        const qValues = this.model.forward(state)
        return this.argmax(qValues)
    }

    argmax(array) {
        return array.indexOf(Math.max(...array))
    }

    replay(batchSize) {
        // Sort memory by priority and sample from the top
        const batch = this.memory.sort((a, b) => b.priority - a.priority).slice(0, batchSize)
        batch.forEach(exp => {
            let target = exp.reward
            if (!exp.done) {
                const nextQ = this.targetModel.forward(exp.nextState)
                target += this.gamma * Math.max(...nextQ)
            }
            const targetQ = this.model.forward(exp.state)
            targetQ[exp.action] = target
            this.model.backward(exp.state, targetQ, this.learningRate)
        });
        if (this.epsilon > this.epsilonMin) {
            this.epsilon *= this.epsilonDecay
        }
    }

    updateTargetModel() {
        //this.targetModel = JSON.parse(JSON.stringify(this.model))
        this.targetModel.weights  = this.model.weights.map(layer => layer.map(node => [...node]))
        this.targetModel.biases = this.model.biases.map(bias => [...bias])
    }

    train(episodes = 100, batchSize = 32) {
        log('Starting training...')
        for (let episode = 0; episode < episodes; episode++) {
            let state = this.env.reset()
            let totalReward = 0

            for (let time = 0; time < 200; time++) {
                const action = this.act(state)
                const { nextState, reward, done, info } = this.env.step(action)
                this.remember(state, action, reward, nextState, done)

                state = nextState
                totalReward += reward

                if (done) {
                    console.log(`Episode: ${episode + 1}, Score: ${totalReward} Epsilon: ${this.epsilon}`)
                    if(episode % 10 === 9)this.scoreCurve.push(totalReward)
                    break
                }

                if (this.memory.length >= batchSize) {
                    this.replay(batchSize)
                }
            }

            this.updateTargetModel()
        }
        log('reward:')
        log(asciichart.plot([this.scoreCurve,[0]],{height: 7, colors: [asciichart.blue,asciichart.white]}))
    }

    evaluate(episodes = 10) {
        log('Starting evaluation...')
        let totalRewards = 0
        let rewardHistory = []
        for (let episode = 0; episode < episodes; episode++) {
            let state = this.env.reset()
            let totalReward = 0
            let done = false
            while (!done) {
                const action = this.act(state, false)  // No exploration
                const { nextState, reward, done: episodeDone, info } = this.env.step(action)
                state = nextState
                totalReward += reward
                done = episodeDone
            }
            totalRewards += totalReward
            rewardHistory.push(totalReward)
        }
        log(`Evaluation over ${episodes} episodes: Average score: ${totalRewards / episodes}`)
        log('scores: ',rewardHistory)
    }
    

    
}

export default DQNAgent
