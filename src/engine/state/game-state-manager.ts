/// <reference path="./game-state-dictionary.ts" />

class GameStateManager {
    private stateCollection: GameStateDictionary;
    private stateStack: GameState[];
    
    register(stateName:string, gameState: GameState): void {
        this.stateCollection[stateName] = gameState;
    }
    get current(): GameState {
        return this.stateStack[this.stateStack.length];
    }
    push(stateName: string): void {
        this.stateStack.push(this.stateCollection[stateName]);
    }
    pop(): void {
        this.stateStack.pop();
    }
}