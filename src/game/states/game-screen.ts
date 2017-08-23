/// <reference path="../game.ts" />

class GameScreen extends GameState {
    private level: Level;
    private lightMap: number[];
    constructor(game: Game) {
        super(game);
        this.camera = new Camera(new Pt(), new Dm(26, 14));
        this.light = new Light(new Pt(13, 7), 0.45);
        this.level = new Level(new Dm(250, 250));
    }

    transitionIn(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    transitionOut(): void {
        super.transitionOut()
    }

    update(delta: number): void {
        this.level.update(delta);
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            this.game.engine.gsm.pop();
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
            this.camera.p.y--;
            this.light.p.y--;
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
            this.camera.p.y++;
            this.light.p.y++;
            
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
            this.camera.p.x--;
            this.light.p.x--;
            
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
            this.camera.p.x++;
            this.light.p.x++;
            
            this.redraw = true;
        }
        if (Input.KB.wasDown(Input.KB.KEY.C)) {
            this.camera.z = !this.camera.z;
            this.redraw = true;
        }
        if (this.redraw) {
            let c = this.camera;
            this.light.calc(this.level.map, this.level.s);
            this.lightMap = Light.reLM([this.light], this.level.s);
        }
        this.requestingClear = this.redraw;
    }

    private camera: Camera;
    private light: Light;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            this.level.draw(ctx, this.camera);
            ctx.fillStyle = "black";
            for (let x = this.camera.p.x, rx = 0; x < this.camera.p.x + this.camera.s.w; x++) {
                for (let y = this.camera.p.y, ry = 0; y < this.camera.p.y + this.camera.s.h; y++) {
                    let val = this.lightMap[x + (y * this.level.s.h)];
                    ctx.globalAlpha = 1 - (val ? val : 0);
                    ctx.fillRect(rx * Game.T_S * 2, ry * Game.T_S * 2, Game.T_S * 2, Game.T_S * 2);
                    ry++;
                }
                rx++;
            }
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "red";
            ctx.strokeRect(13 * Game.T_S * 2, 7 * Game.T_S * 2, Game.T_S * 2, Game.T_S * 2);
            
        }
    }
}