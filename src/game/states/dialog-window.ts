/// <reference path="../game.ts" />

class DialogWindow extends GameState {

    constructor() {
        super();
    }

    transitionIn(): void {
        super.transitionIn()
    }

    transitionOut(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    update(delta: number): void {
        this.requestingClear = this.redraw;
    }

    draw(ctx: Context2D): void {
       
        
    }
}