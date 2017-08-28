/*
    0000 0001 = 1 = discovered
    0000 0010 = 2 = visable
    0000 0100 = 4 = walkable
    0000 1000 = 8 = object present
    0001 0000 = 16 = wall
    0010 0000 = 32 = floor
    0100 0000 = 64 = side wall
    1000 0000 = 128 = FUTURE USE
*/
namespace TMASK {
    export const D = 1;
    export const V = 2;
    export const W = 4;
    export const O = 8;
    export const WALL = 16;
    export const FLOOR = 32;
    export const S_WALL = 64;
}
class Level {
    private e: GameEntity[] = [];
    private o: GameEntity[] = [];
    public m: number[] = [];
    public lm: number[] = [];
    private rc: HTMLCanvasElement;
    private ctx: Context2D;
    private r: boolean = true;
    public d: boolean = true;
    public s: Dm;
    constructor(s: Dm = new Dm(50, 50)) {
        this.s = s;
        this.rc = document.createElement("canvas");
        this.rc.width = (s.w * Game.T_S);
        this.rc.height = (s.h * Game.T_S);
        this.ctx = <Context2D>this.rc.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.generate();
    }
    addEntity(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        this.e.push(entity);
    }

    addObject(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        this.o.push(entity);
    }
    private calcOrigin(r: Room, d: { p: Pt, w: WALL }): Pt {
        let N = d.w === WALL.N,
            S = d.w === WALL.S,
            E = d.w === WALL.E,
            W = d.w === WALL.W;
        let x: number = d.p.x
            - (N || S ? ~~(r.s.w / 2) : 0)
            + (E ? 1 : W ? 0 : 0)
            - (W ? r.s.w : 0);
        let y: number = d.p.y
            - (E || W ? ~~(r.s.h / 2) : 0)
            + (N ? 0 : S ? 1 : 0)
            - (N ? r.s.h : 0);
        return new Pt(x, y);
    }
    private addDoor(r: Room, d: { p: Pt, w: WALL }): void {
        this.m[d.p.x + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
        if (d.w === WALL.N || d.w === WALL.S) {
            this.m[(d.p.x - 1) + (d.p.y * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
            this.m[(d.p.x + 1) + (d.p.y * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
            this.m[d.p.x + ((d.p.y - 1) * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[d.p.x + ((d.p.y + 1) * this.s.h)] = TMASK.FLOOR | TMASK.W;
        } else {
            this.m[(d.p.x - 1) + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[(d.p.x + 1) + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[d.p.x + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x - 1 + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x + 1 + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x + ((d.p.y + 1) * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
        }
    }
    private scan(r: Room, d: { p: Pt, w: WALL }): boolean {
        let result: boolean = true;
        let N = d.w === WALL.N,
            S = d.w === WALL.S,
            E = d.w === WALL.E,
            W = d.w === WALL.W;
        let o = this.calcOrigin(r, d);
        let x = o.x;
        let y = o.y;
        let w = r.s.w + (E || W ? 1 : 0);
        let h = r.s.h + (N || S ? 1 : 0);
        result = (x > 0 && y > 0 && x < this.s.w - r.s.w && y < this.s.h - r.s.h);
        for (let x0: number = x; x0 < (x + w) && result; x0++) {
            for (let y0: number = y; y0 < (y + h) && result; y0++) {
                result = result && this.m[x0 + (y0 * this.s.h)] === undefined;
            }
        }
        return result;
    }
    private roomToMap(r: Room, o: Pt): void {
        r.p.x = o.x;
        r.p.y = o.y;
        for (let mx = o.x, rx = 0; rx < r.s.w; rx++) {
            for (let my = o.y, ry = 0; ry < r.s.h; ry++) {
                if (ry === 0 && rx !== 0 && rx !== r.s.w - 1) {
                    this.m[mx + (my * this.s.h)] = TMASK.WALL;
                } else if (rx === 0 || ry === 0 || rx === r.s.w - 1 || ry === r.s.h - 1)
                    this.m[mx + (my * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
                else
                    this.m[mx + (my * this.s.h)] = TMASK.FLOOR | TMASK.W;
                my++;
            }
            mx++;
        }
    }
    private generate(): void {
        let placedRooms: Room[] = [];
        let features: GameEntity[] = [];
        let tRoom: Room;
        let tCorr: Room;
        let lRoom: Room;
        let tDW: { p: Pt, w: WALL };
        let tDWC: { p: Pt, w: WALL };
        let roomOrigin: Pt = new Pt();

        // TODO: Make a collection of features [last] = entrance, [0] = exit, [0..last]= random features, inject switches at ~20%, ~40%, ~60% and ~80%
        tRoom = lRoom = Room.makeRoom(25, 25);
        roomOrigin = new Pt(randomInt(0, this.s.w - tRoom.s.w), randomInt(0, this.s.h - tRoom.s.h));
        placedRooms.push(tRoom);
        this.roomToMap(tRoom, roomOrigin);
        // TODO: place [1..2] features

        while (placedRooms.length > 0) {
            while (lRoom.w.length > 0) {
                tDW = lRoom.getRandomWall();
                if (tDW === null)
                    break;
                tCorr = Room.makeCorridor((tDW.w === WALL.N || tDW.w === WALL.S));
                if (this.scan(tCorr, tDW)) {
                    roomOrigin = this.calcOrigin(tCorr, tDW);
                    this.roomToMap(tCorr, roomOrigin);
                    this.addDoor(tCorr, tDW);
                    while (tCorr.w.length > 0) {
                        tRoom = Room.makeRoom(25, 25);
                        tDWC = tCorr.getRandomWall();
                        if (tDWC === null)
                            break;
                        if (this.scan(tRoom, tDWC)) {
                            roomOrigin = this.calcOrigin(tRoom, tDWC);
                            this.roomToMap(tRoom, roomOrigin);
                            this.addDoor(tRoom, tDWC);
                            // TODO: add [1..2] features
                            placedRooms.push(tRoom);
                            lRoom = tRoom;
                        }
                    }
                }
            }
            if (placedRooms.length > 1) {
                placedRooms.pop();
                lRoom = placedRooms[placedRooms.length - 1];
            } else {
                placedRooms.pop();
            }
        }
    }
    update(delta: number, c: Camera): void {
        let lights: Light[] = [];
        for (let e in this.e) {
            let ent = this.e[e].components;
            if (ent['t-move']) {
                let tm = (<cTimer>ent['t-move']);
                tm.cur += delta;
                if (tm.cur >= tm.value) {
                    if (ent['input'] && ent['p-move'] && ent['input'].value) {
                        input(this.e[e]);
                        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
                            this.d = true;
                            let p: Pt = ent['p-pos'].value;
                            this.addObject(createMarker(), new Pt(p.x, p.y));
                        }
                    }
                    if (ent['aabb'] && ent['p-move'] && ent['p-pos']) {
                        this.d = this.d || collision(this.e[e], this);
                    }
                    if (ent['p-move']) {
                        if (ent['t-move']) {
                            if (movement(this.e[e])) {
                                this.d = true;
                                let p = (<Pt>ent['p-pos'].value);
                                c.p.x = p.x - ~~(c.s.w / 2);
                                c.p.y = p.y - ~~(c.s.h / 2);
                                if (ent['s-move']) {
                                    Game.i.ae.beep(ent['s-move'].value);
                                }
                            }
                        }
                    }
                }
            }
            if (this.d) {
                if (ent['light'] && ent['p-pos']) {
                    let l = (<Light>ent['light'].value);
                    l.p = (<Pt>ent['p-pos'].value);
                    l.calc(this.m, this.s);
                    lights.push(l);
                }
            }
        }
        if (lights.length > 0)
            this.lm = Light.reLM(lights, this.s);

        // sound
        // interact
    }
    render(ctx: Context2D): void {
        let tn = randomized([0, 1, 1, 2]);
        let fn = randomized([0, 0, 0, 0, 0, 0, 1, 2]);
        this.m.forEach((t, i) => {
            let ty = ~~(i / this.s.w);
            let tx = i % this.s.w;
            let tile: HTMLCanvasElement;
            if (!t) {
                ctx.fillStyle = "#000000"; // No cell at location
                ctx.fillRect(tx * Game.T_S, ty * Game.T_S, Game.T_S, Game.T_S);
            } else if (t & TMASK.WALL) {
                if (t & TMASK.S_WALL) {
                    tile = SSM.spriteSheet("wall").sprites[3];
                } else {
                    tile = SSM.spriteSheet("wall").sprites[tn()];
                }
            } else if (t & TMASK.FLOOR) {
                tile = SSM.spriteSheet("floor").sprites[fn()];
            }
            if (tile) {
                ctx.drawImage(tile,
                    0, 0,
                    Game.T_S, Game.T_S,
                    ~~(tx * Game.T_S), ~~(ty * Game.T_S),
                    Game.T_S, Game.T_S);
            }
        });
    }

    draw(ctx: Context2D, c: Camera) {
        if (this.r) {
            this.render(this.ctx);
            this.r = false;
        }
        if (c.z) {
            // DEBUG AREA
            ctx.drawImage(
                this.rc,
                ~~(c.p.x * Game.T_S), ~~(c.p.y * Game.T_S),
                ~~(Game.T_W * Game.T_S), ~~(Game.T_H * Game.T_S),
                0, 0,
                ~~(Game.T_W * Game.T_S), ~~(Game.T_H * Game.T_S));
            this.e.forEach((e, i) => {
                let s = <HTMLCanvasElement>e.components['sprite'].value;
                let p = <Pt>e.components['p-pos'].value;
                ctx.drawImage(s,
                    0, 0,
                    Game.T_S, Game.T_S,
                    ~~((p.x - c.p.x) * Game.T_S), ~~((p.y - c.p.y) * Game.T_S),
                    Game.T_S, Game.T_S);
            });
            // END DEBUG AREA
        } else {
            ctx.globalAlpha = 1;
            ctx.drawImage(
                this.rc,
                ~~(c.p.x * Game.T_S), ~~(c.p.y * Game.T_S),
                ~~(c.s.w * Game.T_S), ~~(c.s.h * Game.T_S),
                0, 0,
                ~~((c.s.w) * Game.T_S * 2), ~~((c.s.h) * Game.T_S * 2));
            this.o.forEach((e, i) => {
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