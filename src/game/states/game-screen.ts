/// <reference path="../game.ts" />

class GameScreen extends GameState {
    constructor() {
        super();
        this.c = new Camera(new Pt(), new Dm(32, 14));
        Game.gd.buildObjBank(4, 8);
        Game.gd.l = new Level(new Dm(250, 250));
        Game.gd.l.generate();
        {
            let p = createPlayer();
            Game.gd.addEntity(p, new Pt(10, 10));
        }
        {
            let p = createPlayer();
            p.components['input'].value = true;
            Game.gd.addEntity(p, new Pt(11, 10));
        }
        let p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
        this.c.p.x = p.x - ~~(this.c.s.w / 2);
        this.c.p.y = p.y - ~~(this.c.s.h / 2);
    }

    transitionIn(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    transitionOut(): void {
        super.transitionOut()
    }

    update(delta: number): void {
        // DEBUG
        if (Input.KB.wasDown(Input.KB.KEY.C)) {
            Game.gd.DEBUG = !Game.gd.DEBUG;
            if (Game.gd.DEBUG) {
                this.c.s.w = Game.T_W;
                this.c.s.h = Game.T_H;
            } else {
                this.c.s.w = 32;
                this.c.s.h = 14;
            }
            let p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
            this.c.p.x = p.x - ~~(this.c.s.w / 2);
            this.c.p.y = p.y - ~~(this.c.s.h / 2);
            this.redraw = true;
        }
        // END DEBUG

        Game.gd.l.update(delta, this.c);

        for (let e in Game.gd.e) {
            let ent = Game.gd.e[e].components;
            
            // ACTIVE MOVING PLAYER BLOCK
            if (ent['input'] && ent['input'].value && ent['t-move']) {
                let tm = (<cTimer>ent['t-move']);
                tm.cur += delta;
                if (tm.cur >= tm.value) {
                    if (ent['p-move']) {
                        if(input(Game.gd.e[e])) {
                            tm.cur = 0;
                            if (ent['p-pos'] && !collision(Game.gd.e[e], Game.gd.l)) {
                                if (ent['sprite']) {
                                    animate(Game.gd.e[e]);
                                }          
                                if (movement(Game.gd.e[e])) {
                                    this.redraw = true;
                                    let p: Pt = ent['p-pos'].value;
                                    this.c.p.x = p.x - ~~(this.c.s.w / 2);
                                    this.c.p.y = p.y - ~~(this.c.s.h / 2);
                                    if (ent['s-move']) {
                                        Game.i.ae.beep(ent['s-move'].value);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // Guiding Light Block
        }

        if (this.redraw) {
            for (let e in Game.gd.e) {
                let ent = Game.gd.e[e].components;
                if (ent['light'] && ent['p-pos']) {
                    let l = (<Light>ent['light'].value);
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }        
            if(Game.gd.lights.length > 0)
                Game.gd.lm = Light.reLM(Game.gd.lights, Game.gd.l.s);
        }

        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION))
            Game.i.e.gsm.push('marker-menu');

        this.requestingClear = this.redraw;
    }
    private c: Camera;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            // DRAW LEVEL
            Game.gd.l.draw(ctx, this.c);

            /// DEBUG
            if (Game.gd.DEBUG) {
                Game.gd.m.forEach((e) => {
                    let s = <HTMLCanvasElement>e.components['sprite'].value;
                    let p = <Pt>e.components['p-pos'].value;
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        ~~((p.x - this.c.p.x) * Game.T_S), ~~((p.y - this.c.p.y) * Game.T_S),
                        Game.T_S, Game.T_S);
                });
                Game.gd.o.forEach((e) => {
                    let s = <HTMLCanvasElement>e.components['sprite'].value;
                    let p = <Pt>e.components['p-pos'].value;
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        ~~((p.x - this.c.p.x) * Game.T_S), ~~((p.y - this.c.p.y) * Game.T_S),
                        Game.T_S, Game.T_S);
                });
                Game.gd.e.forEach((e) => {
                    let s = <HTMLCanvasElement>e.components['sprite'].value;
                    let p = <Pt>e.components['p-pos'].value;
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        ~~((p.x - this.c.p.x) * Game.T_S), ~~((p.y - this.c.p.y) * Game.T_S),
                        Game.T_S, Game.T_S);
                });
                ctx.globalAlpha = 0.7;
                var pt: Pt = new Pt();
                for (var x = this.c.p.x; x < this.c.p.x + this.c.s.w; x++) {
                    for (var y = this.c.p.y; y < this.c.p.y + this.c.s.h; y++) {
                        pt.x = x;
                        pt.y = y;
                        var t = Game.gd.l.m[x+(y*Game.gd.l.s.w)];
                        if(t & TMASK.W) {
                            ctx.fillStyle = "green";
                        } else {
                            ctx.fillStyle = "red";
                        }
                        if(Game.gd.markerAt(pt)) {
                            ctx.fillStyle = "yellow";
                        }
                        if(Game.gd.objectAt(pt)) {
                            ctx.fillStyle = "blue";
                        }
                        if(Game.gd.playerAt(pt)) {
                            ctx.fillStyle = "orange";
                        }
                        ctx.fillRect((~~(x - this.c.p.x) * Game.T_S) + 2, (~~(y - this.c.p.y) * Game.T_S) + 2, 4, 4);
                    }
                }
                ctx.globalAlpha = 1;
            } else {
            /// END DEBUG
                
                // DRAW MARKERS
                Game.gd.m.forEach((e) => {
                    drawEnt(ctx, e, this.c);
                });

                // DRAW OBJECTS
                Game.gd.o.forEach((e) => {
                    drawEnt(ctx, e, this.c);
                });

                // DRAW ENTITIES
                Game.gd.e.forEach((e) => {
                    drawEnt(ctx, e, this.c);
                });

                // DRAW LIGHT MAP
                if (Game.gd.lm.length > 0) {
                    ctx.fillStyle = "#0d0d0d";
                    for (let x = this.c.p.x, rx = 0; x < this.c.p.x + this.c.s.w; x++) {
                        for (let y = this.c.p.y, ry = 0; y < this.c.p.y + this.c.s.h; y++) {
                            let val = Game.gd.lm[x + (y * Game.gd.l.s.h)];
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
}