import DQNAgent from "./dqn"
import ctx from "axel"
const log = console.log

class DummyEnvironment {
    constructor() {
        this.stateSize = 2; // Example state size
        this.actionSize = 5; // Example action size
        this.count = 0
        this.prevAction = null
        this.prevState = null
    }

    reset() {
        // Reset the environment and return the initial state
        //return Array(this.stateSize).fill(0);
        return [1,0]
    }
    
    step(action) {
        let reward = (action === 3 ) ? 1 : -1
        let nextState = (reward > 0) ? [0,0] : [1,0]
        switch(action){
            case 0:
                if(false){//if(this.prevAction === action) {
                    reward = -1
                    nextState = [6,6]
                } else {
                    reward = 1
                    nextState = [1,1]
                }
                break
            case 1:
                reward = -1
                nextState = [0,0]
                break
            case 2:
                reward = 0
                nextState = [0,0]
                break
            case 3:
                if(false){//if(this.prevAction === action) {
                    reward = -1
                    nextState = [6,6]
                } else {
                    reward = 1
                    nextState = [1,1]
                }
                break
            case 4:
                if(false){//if(this.prevState === [6,6]) {
                    reward = 5
                    nextState = [10,10]
                } else {
                    reward = -1
                    nextState = [1,0]
                }
                
                break    
        }
        //if(Math.random() > 0.95)log( 'a:',action, ', n:', nextState, 'r:',reward)
        //let done = Math.random() > 0.95; // Randomly end episodes
        this.count++
        let done = false
        if(this.count === 40) {
            done = true 
            this.count = 0
            log( 'a:',action, ', n:', nextState, 'r:',reward)
        } else done = false
        this.prevAction = action
        this.prevState = nextState
        return { nextState, reward, done }
    }

    initDraw(){
        ctx.clear()
        ctx.bg(0,255,0)
    }
}

const env = new DummyEnvironment()
const agent = new DQNAgent(env)

const EPISODES = 1000
const BATCH_SIZE = 32

// Train the agent
//agent.train(EPISODES, BATCH_SIZE)
//env.initDraw()

const red=0,green=128,blue=255
//log(red,green,blue)
ctx.clear()
const sea = new Environment(red,green,blue)
const ship = new Ship(30,15)

class Environment {
    constructor(r,g,b){
        ctx.bg(r,g,b)
        ctx.box(0,0,128+64,64)
    }
}

class Ship {
    constructor(x,y){
        this.x = x
        this.y = y
        this.draw(this.x,this.y)
        this.gui()
        ctx.cursor.restore()
        this.erase(this.x,this.y)
    }

    draw(x,y){
        
        this.x = x
        this.y = y
        ctx.bg(255,255,0)
        ctx.line(x-1,y,x+3,y)
        ctx.bg(255,255,0)
        ctx.line(x-1,y+1,x-1,y-1)
        ctx.bg(255,32,64)
        ctx.line(x-2,y-1,x-2,y-1)
        ctx.bg(255,32,64)
        ctx.line(x-2,y+1,x-2,y+1)
        
    }

    erase(x,y){
        ctx.cursor.reset()
        ctx.bg(red,green,blue)
        ctx.line(x-1,y,x+3,y)
        ctx.line(x-1,y+1,x-1,y-1)
        ctx.line(x-2,y-1,x-2,y-1)
        ctx.line(x-2,y+1,x-2,y+1)
    }

    gui(){
        ctx.bg(255,255,255)
        ctx.fg(255,0,0)
        ctx.text(1,1," KORTEX DQN TEST!! ")
    }
}
