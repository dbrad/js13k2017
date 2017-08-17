/// <reference path="./game-state-dictionary.ts" />

class GameStateManager {
    private stateCollection: GameStateDictionary;
    private stateStack: GameState[];
    
    constructor() {
        this.stateCollection = {};
        this.stateStack = [];
    }
    register(stateName:string, gameState: GameState): void {
        this.stateCollection[stateName] = gameState;
    }
    get current(): GameState {
        return this.stateStack[this.stateStack.length-1];
    }
    push(stateName: string): void {
        this.current && this.current.transitionOut();
        this.stateStack.push(this.stateCollection[stateName]);
        this.current && this.current.transitionIn();
    }
    pop(): void {
        this.current && this.current.transitionOut();
        this.stateStack.pop();
        this.current && this.current.transitionIn();
    }
}