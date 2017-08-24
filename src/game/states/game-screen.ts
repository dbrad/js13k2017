/// <reference path="../game.ts" />

class GameScreen extends GameState {
    private level: Level;
    private lightMap: number[];
    constructor(game: Game) {
        super(game);
        this.c = new Camera(new Pt(), new Dm(26, 14));
        this.level = new Level(new Dm(250, 250));
        {
            let p = new GameEntity();
            p.addComponent(new cPos());
            p.addComponent(new cLight(new Light(new Pt(), 0.45)));
            p.addComponent(new cAABB(new Dm(1,1)));
            p.addComponent(new cFlag('player', true));
            p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[2]));
            this.level.addEntity(p, new Pt(10,10));
        }

        {
            let p = new GameEntity();
            p.addComponent(new cPos());
            p.addComponent(new cLight(new Light(new Pt(), 0.45)));
            p.addComponent(new cAABB(new Dm(1,1)));
            p.addComponent(new cFlag('player', true));
            p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[2]));
            this.level.addEntity(p, new Pt(20,20));
        }
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
            this.g.e.gsm.pop();
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
            this.c.p.y--;
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
            this.c.p.y++;
            
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
            this.c.p.x--;
            
            this.redraw = true;
        }
        if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
            this.c.p.x++;
            
            this.redraw = true;
        }
        if (Input.KB.wasDown(Input.KB.KEY.C)) {
            this.c.z = !this.c.z;
            this.redraw = true;
        }
        this.requestingClear = this.redraw;
    }

    private c: Camera;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            this.level.draw(ctx, this.c);          
        }
    }
}