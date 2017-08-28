/// <reference path="../../game/game.ts" />
/// <reference path="../types/context2d.ts" />

/**
 * @abstract
 * @class GameState
 */
abstract class GameState {
    /**
     * Creates an instance of GameState.
     * @memberof GameState
     */
    constructor() {
        this.redraw = true;
        this.requestingClear = false;
    }

    /**
     * @type {boolean}
     * @memberof GameState
     */
    public redraw: boolean;

    /**
     * @type {boolean}
     * @memberof GameState
     */
    public requestingClear: boolean;

    /**
     * @memberof GameState
     */
    transitionIn(): void {
        this.redraw = true;
        this.update(0);
    }

    /**
     * @memberof GameState
     */
    transitionOut(): void {
        this.redraw = true;
        this.update(0);
    }

    /**
     * @abstract
     * @param {Context2D} ctx 
     * @memberof GameState
     */
    abstract draw(ctx: Context2D): void;

    /**
     * @abstract
     * @param {number} delta 
     * @memberof GameState
     */
    abstract update(delta: number): void;
}