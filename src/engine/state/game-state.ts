/// <reference path="../../game/game.ts" />
/// <reference path="../types/context2d.ts" />

abstract class GameState {
    constructor(game: Game) {
        this.game = game;
        this.redraw = true;
        this.requestingClear = false;
    }
    protected game: Game;
    public redraw: boolean;
    public requestingClear: boolean;

    transition(): void {
        this.redraw = true;
        this.update(0);
    }

    abstract draw(ctx: Context2D): void;
    abstract update(delta: number): void;
}