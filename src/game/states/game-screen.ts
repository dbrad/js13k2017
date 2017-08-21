/// <reference path="../game.ts" />

class GameScreen extends GameState {
    private level: Level;
    constructor(game: Game) {
        super(game);
        this.camera = new Camera(new Pt(), new Dm(26, 14));
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
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
            this.camera.p.y++;
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
            this.camera.p.x--;
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
            this.camera.p.x++;    
            this.redraw = true;            
        }
        if(Input.KB.wasDown(Input.KB.KEY.C)) {
            this.camera.z = !this.camera.z;
            this.redraw = true;
        }
        this.requestingClear = this.redraw;        
    }

    private camera: Camera;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            this.level.draw(ctx, this.camera);
        }
    }
}