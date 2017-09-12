/// <reference path="../game.ts" />
enum diff { EASY, NORMAL, HARD, VHARD };
class GameScreen extends GameState {
    constructor() {
        super();
        this.c = new Camera(new Pt(), new Dm(32, 17));
    }

    transitionIn(): void {
        this.requestingClear = true;
        super.transitionIn();
    }

    transitionOut(): void {
        super.transitionOut();
    }

    private mt: number = 0;
    update(delta: number): void {
        /*
        // DEBUG
        if (Input.KB.wasDown(Input.KB.KEY.C)) {
            Game.gd.DEBUG = !Game.gd.DEBUG;
            if (Game.gd.DEBUG) {
                this.c.s.w = Game.T_W;
                this.c.s.h = Game.T_H;
            } else {
                this.c.s.w = 32;
                this.c.s.h = 17;
            }
            let p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
            this.c.p.x = p.x - ~~(this.c.s.w / 2);
            this.c.p.y = p.y - ~~(this.c.s.h / 2);
            this.redraw = true;
        }
        // END DEBUG
        */

        // Marker glow effect
        this.mt += delta;
        if (this.mt >= 250) {
            this.mt = 0;
            this.ma += this.md;
            if (this.ma >= 1.0 || this.ma <= 0.55) {
                this.md *= -1;
            }
            this.redraw = true;
        }

        // LOOP THROUGH SPAWNERS
        for (let e in Game.gd.s) {
            spawn(Game.gd.s[e]);
        }

        if (Game.gd.players <= 0) {
            Game.i.e.gsm.pop();            
            let sp = Game.gd.score/Game.gd.t_score;
            if(sp > 0 && sp < 0.25) { // 1 - 24%
                Game.gd.message = Message.ENDING_1_24;
            } else if(sp >= 0.25 && sp < 0.5) { // 25 - 49%
                Game.gd.message = Message.ENDING_25_49;
            } else if(sp >= 0.5 && sp < 0.75) { // 50 - 74 %
                Game.gd.message = Message.ENDING_50_74;
            } else if(sp >= 0.75 && sp < 0.99) { // 75 - 99%
                Game.gd.message = Message.ENDING_75_99;
            } else if(sp == 1) { // 75 - 100%
                Game.gd.message = Message.ENDING_100;
            } else { // 0%
                Game.gd.message = Message.ENDING_0;
            }
            Game.i.e.gsm.push('dialog');
        }

        // LOOP THROUGH PLAYERS
        for (let e in Game.gd.p) {
            let ent = Game.gd.p[e].components;
            let pe = Game.gd.p[e];
            if (!Game.gd.getCurrPlayer()) {
                ent['input'].value = true;
                let p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
                this.c.p.x = p.x - ~~(this.c.s.w / 2);
                this.c.p.y = p.y - ~~(this.c.s.h / 2);
            }

            // ACTIVE MOVING PLAYER BLOCK
            if (ent['input'] && ent['input'].value && ent['t-move']) {
                let tm = (<cTimer>ent['t-move']);
                tm.cur += delta;
                if (tm.cur >= tm.value) {
                    if (ent['p-move'] && input(pe)) {
                        tm.cur = 0;
                        if (ent['p-pos'] && !collision(pe, Game.gd.l)) {
                            ent['sprite'] && animate(pe);
                            if (movement(pe)) {
                                this.redraw = true;
                                let p: Pt = ent['p-pos'].value;
                                this.c.p.x = p.x - ~~(this.c.s.w / 2);
                                this.c.p.y = p.y - ~~(this.c.s.h / 2);

                                if (Game.gd.objectAt(p)) {
                                    let o = Game.gd.getObjectAt(p);
                                    switch (o.components['type'].value) {
                                        case 'gold':
                                            Game.i.ae.beep(new Beep(2500, 2500, 'square', 0.75, 1));
                                            pickup(o);
                                            break;
                                        case 'chest':
                                            Game.i.ae.beep(new Beep(635, 3, 'square', 0.1, 1));
                                            pickup(o);
                                            break;
                                        case 'switch':
                                            activate(o);
                                            break;
                                        case 'exit':
                                            exit(pe);
                                            break;
                                        default:
                                            break;
                                    }
                                } else if (ent['s-move']) {
                                    Game.i.ae.beep(ent['s-move'].value);
                                }
                            }
                        }
                    }
                }
            }
        }

        // LOOP THROUGH GUIDES
        for (let e in Game.gd.g) {
            let ent = Game.gd.g[e].components;
            let ge = Game.gd.g[e];
            let tm = (<cTimer>ent['t-move']);
            tm.cur += delta;
            if (tm.cur >= tm.value) {
                tm.cur = 0;
                guideMove(ge);
                this.redraw = true;
            }
        }

        // Update Lighting if we are re-drawing
        if (this.redraw) {
            Game.gd.lights.length = 0;
            for (let e in Game.gd.p) {
                let ent = Game.gd.p[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    let l = (<Light>ent['light'].value);
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            for (let e in Game.gd.g) {
                let ent = Game.gd.g[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    let l = (<Light>ent['light'].value);
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            for (let e in Game.gd.m) {
                let ent = Game.gd.m[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    let l = (<Light>ent['light'].value);
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            if (Game.gd.lights.length > 0)
                Game.gd.lm = Light.reLM(Game.gd.lights, Game.gd.l.s);
        }

        // OPEN MARKER MENU IF ACTION BUTTON PRESSED
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION))
            Game.i.e.gsm.push('marker-menu');

        if(!this.redraw && !Game.gd.opShown) {
            Game.gd.message = Message.OPENING;
            Game.i.e.gsm.push('dialog');
            Game.gd.opShown = true;
        } else if (!this.redraw && !Game.gd.ctrlShown) {
            Game.gd.message = Message.CONTROLS;
            Game.i.e.gsm.push('dialog');
            Game.gd.ctrlShown = true;
        }

        this.requestingClear = this.redraw;
    }
    private c: Camera;
    private ma: number = 1;
    private md: number = -0.15;
    draw(ctx: Context2D): void {
        if (this.redraw) {
            // DRAW LEVEL
            Game.gd.l.draw(ctx, this.c);

            /*
            /// DEBUG
            if (Game.gd.DEBUG) {
                Game.gd.m.forEach((e: GameEntity) => {
                    let s = <HTMLCanvasElement>e.components['sprite'].value;
                    let p = <Pt>e.components['p-pos'].value;
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        ~~((p.x - this.c.p.x) * Game.T_S), ~~((p.y - this.c.p.y) * Game.T_S),
                        Game.T_S, Game.T_S);
                });
                Game.gd.o.forEach((e: GameEntity) => {
                    let s = <HTMLCanvasElement>e.components['sprite'].value;
                    let p = <Pt>e.components['p-pos'].value;
                    ctx.drawImage(s,
                        0, 0,
                        Game.T_S, Game.T_S,
                        ~~((p.x - this.c.p.x) * Game.T_S), ~~((p.y - this.c.p.y) * Game.T_S),
                        Game.T_S, Game.T_S);
                });
                Game.gd.p.forEach((e: GameEntity) => {
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
                        var t = Game.gd.l.m[x + (y * Game.gd.l.s.w)];
                        if (t & TMASK.W) {
                            ctx.fillStyle = "green";
                        } else {
                            ctx.fillStyle = "red";
                        }
                        if (Game.gd.markerAt(pt)) {
                            ctx.fillStyle = "yellow";
                        }
                        if (Game.gd.objectAt(pt)) {
                            ctx.fillStyle = "blue";
                        }
                        if (Game.gd.playerAt(pt)) {
                            ctx.fillStyle = "orange";
                        }
                        ctx.fillRect((~~(x - this.c.p.x) * Game.T_S) + 2, (~~(y - this.c.p.y) * Game.T_S) + 2, 4, 4);
                    }
                }
                ctx.globalAlpha = 1;
            } else {
                /// END DEBUG
                */

            // DRAW MARKERS
            ctx.globalAlpha = this.ma;
            Game.gd.m.forEach((e: GameEntity) => {
                drawEnt(ctx, e, this.c);
            });
            ctx.globalAlpha = 1;

            // DRAW OBJECTS
            Game.gd.o.forEach((e: GameEntity) => {
                drawEnt(ctx, e, this.c);
            });

            // DRAW PLAYERS
            Game.gd.p.forEach((e: GameEntity) => {
                drawEnt(ctx, e, this.c);
            });

            // DRAW GUIDES
            ctx.globalAlpha = 0.3;
            Game.gd.g.forEach((e: GameEntity) => {
                drawEnt(ctx, e, this.c);
            });
            ctx.globalAlpha = 1;

            // DRAW STATUS BAR
            {
                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.font = '11px helvetica';

                drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(0.5, 17.5), 2);
                drawSpr(ctx, SSM.spriteSheet("marker").sprites[1], new Pt(1.5, 17.5), 2);
                ctx.fillText(` x ${Game.gd.markers}`, Game.T_S * 4, Game.P_H - 4);
                let c: number = 0;
                for (let p in Game.gd.p) {
                    drawSpr(ctx, SSM.spriteSheet("sprites").sprites[0], new Pt(4.5 + (1 * c), 17.5), 2);
                    c++;
                }
                ctx.textAlign = 'right';
                ctx.fillText(`$${Game.gd.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, Game.P_W - 4, Game.P_H - 4);
            }

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
            // }
        }
    }
}