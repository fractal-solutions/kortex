// test_dqn_agent.js

import DQNAgent from './dqn.js';
import NeuralNetwork from './neural_network.js';

// Mock environment for testing
class SimpleEnv {
    constructor() {
        this.stateSize = 4;    // Size of the state vector
        this.actionSize = 2;   // Number of possible actions
        this.currentState = this.reset();
    }

    reset() {
        // Reset the environment to an initial state
        this.currentState = [Math.random(), Math.random(), Math.random(), Math.random()];
        return this.currentState;
    }

    step(action) {
        // Simulate taking an action in the environment
        // For simplicity, we'll generate the next state and reward randomly
        const nextState = [Math.random(), Math.random(), Math.random(), Math.random()];
        const reward = Math.random() < 0.5 ? 1 : -1;  // Random reward
        const done = Math.random() < 0.1;  // Randomly end the episode
        return { nextState, reward, done };
    }

    // Optional: Define methods for reward shaping if needed
    isCloseToGoal(state) {
        // Placeholder function
        return false;
    }

    isDangerousMove(state, action) {
        // Placeholder function
        return false;
    }
}

// Main test function
async function testDQNAgent() {
    const env = new SimpleEnv();
    const agent = new DQNAgent(env);

    //console.log('Starting training...');
    agent.train(100,32);

    //console.log('Starting evaluation...');
    agent.evaluate(100);
}

testDQNAgent();
