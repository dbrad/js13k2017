/// <reference path="../game.ts" />

class GameScreen extends GameState {

    constructor(game: Game) {
        super(game);
    }

    transitionIn(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    transitionOut(): void {
        super.transitionOut()
    }

    update(delta: number): void {
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            this.game.engine.gsm.pop();
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.UP)) {
            this.game.audioEngine.beep(new Beep(300, 2000, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.DOWN)) {
            this.game.audioEngine.beep(new Beep(150, 400, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.LEFT)) {
            this.game.audioEngine.beep(new Beep(1500, 7500, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.RIGHT)) {
            this.game.audioEngine.beep(new Beep(50, 3000, 'square', 1, 1));
        }
    }

    draw(ctx: Context2D): void {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;                
            ctx.fillStyle = "blue";
            ctx.fillRect(
                0, 0,
                ~~(Game.GAME_PIXEL_WIDTH), ~~(Game.GAME_PIXEL_HEIGHT));
            ctx.globalAlpha = 0.75;
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.fillText(
                `This is the game screen, baby.`,
                ~~((Game.GAME_PIXEL_WIDTH / 2) | 0),
                ~~(64));
        }
    }
}