/// <reference path="../game.ts" />

class GameScreen extends GameState {
    private level: Level;
    private markerMenuOpen: boolean;
    constructor() {
        super();
        //this.c = new Camera(new Pt(), new Dm(26, 14));
        this.c = new Camera(new Pt(), new Dm(32, 14));
        this.level = new Level(new Dm(250, 250));
        {
            let p = createPlayer();
            this.level.addEntity(p, new Pt(10, 10));
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
        this.level.update(delta, this.c);
        if (Input.KB.wasDown(Input.KB.KEY.C)) {
            this.c.z = !this.c.z;
            this.redraw = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            Game.i.e.gsm.push('MarkerMenu');
        }
        if (this.level.d) {
            this.redraw = true;
            this.level.d = false;
        }
        this.requestingClear = this.redraw;
    }

    private c: Camera;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            this.level.draw(ctx, this.c);
            Game.gd.o.forEach((e, i) => {
                let sp = <cSprite>e.components['sprite'];
                let s = sp.value;
                let p = <Pt>e.components['p-pos'].value;
                if (p.x > 0 && p.x < (c.p.x + c.s.w) && p.y > 0 && p.y < (c.p.y + c.s.h)) {
                    ctx.save();
                    ctx.translate(~~((p.x - c.p.x) * Game.T_S * 2) + Game.T_S, ~~((p.y - c.p.y) * Game.T_S * 2) + Game.T_S);
                    ctx.rotate(sp.r * Math.PI / 180);
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        -Game.T_S, -Game.T_S,
                        Game.T_S * 2, Game.T_S * 2);
                    ctx.restore();
                }
            });
            this.e.forEach((e, i) => {
                let sp = <cSprite>e.components['sprite'];
                let s = sp.value;
                let p = <Pt>e.components['p-pos'].value;
                if (p.x > 0 && p.x < (c.p.x + c.s.w) && p.y > 0 && p.y < (c.p.y + c.s.h)) {
                    ctx.save();
                    ctx.translate(~~((p.x - c.p.x) * Game.T_S * 2) + Game.T_S, ~~((p.y - c.p.y) * Game.T_S * 2) + Game.T_S);
                    ctx.rotate(sp.r * Math.PI / 180);
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        -Game.T_S, -Game.T_S,
                        Game.T_S * 2, Game.T_S * 2);
                    ctx.restore();
                }
            });

            if (this.lm.length > 0) {
                ctx.fillStyle = "#0d0d0d";
                for (let x = c.p.x, rx = 0; x < c.p.x + c.s.w; x++) {
                    for (let y = c.p.y, ry = 0; y < c.p.y + c.s.h; y++) {
                        let val = this.lm[x + (y * this.s.h)];
                        ctx.globalAlpha = (val ? val : 1);
                        ctx.fillRect(rx * Game.T_S * 2, ry * Game.T_S * 2, Game.T_S * 2, Game.T_S * 2);
                        ry++;
                    }
                    rx++;
                }
                ctx.globalAlpha = 1;
            }
        }
    }
}