/// <reference path="./game-state-dictionary.ts" />

/**
 * @class GameStateManager
 */
class GameStateManager {
    /**
     * @private
     * @type {GameStateDictionary}
     * @memberof GameStateManager
     */
    private stateCollection: GameStateDictionary;
    
    /**
     * @private
     * @type {GameState[]}
     * @memberof GameStateManager
     */
    private stateStack: GameState[];
    
    /**
     * Creates an instance of GameStateManager.
     * @memberof GameStateManager
     */
    constructor() {
        this.stateCollection = {};
        this.stateStack = [];
    }

    /**
     * @name register
     * @param {string} stateName 
     * @param {GameState} gameState 
     * @memberof GameStateManager
     */
    reg(stateName:string, gameState: GameState): void {
        this.stateCollection[stateName] = gameState;
    }

    /**
     * @readonly
     * @name current
     * @desc The currently active state.
     * @type {GameState}
     * @memberof GameStateManager
     */
    get cur(): GameState {
        return this.stateStack[this.stateStack.length-1];
    }

    /**
     * @param {string} stateName 
     * @memberof GameStateManager
     */
    push(stateName: string): void {
        Input.KB.clearInputQueue();
        this.cur && this.cur.transitionOut();
        this.stateStack.push(this.stateCollection[stateName]);
        this.cur && this.cur.transitionIn();
    }

    /**
     * @memberof GameStateManager
     */
    pop(): void {
        Input.KB.clearInputQueue();
        this.cur && this.cur.transitionOut();
        this.stateStack.pop();
        this.cur && this.cur.transitionIn();
    }
}