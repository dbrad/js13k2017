/*
    0000 0001 = 1 = walkable
    0000 0010 = 2 = object present
    0000 0100 = 4 = player present
    0000 1000 = 8 = floor
    0001 0000 = 16 = wall
    0010 0000 = 32 = side wall
*/
namespace TMASK {
    export const W = 1;
    export const O = 2;
    export const M = 4;
    export const P = 8;
    export const FLOOR = 16;
    export const WALL = 32;
    export const S_WALL = 64;
}
//     00 00..00 0000 0000 0000 0000 0000 0000
//  |PLAYER|  |  OBJECT  | |MARKER | | META  |
class Level {
    public m: number[] = [];
    private rc: HTMLCanvasElement;
    private ctx: Context2D;
    private r: boolean = true;
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
                } else if (rx === 0 || ry === 0 || rx === r.s.w - 1 || ry === r.s.h - 1) {
                    this.m[mx + (my * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
                } else {
                    this.m[mx + (my * this.s.h)] = TMASK.FLOOR | TMASK.W;
                }
                my++;
            }
            mx++;
        }
    }
    public generate(): void {
        let placedRooms: Room[] = [];
        let features: GameEntity[] = [];
        let tRoom: Room;
        let tCorr: Room;
        let lRoom: Room;
        let tDW: { p: Pt, w: WALL };
        let tDWC: { p: Pt, w: WALL };
        let roomOrigin: Pt = new Pt();

        tRoom = lRoom = Room.makeRoom(25, 25);
        roomOrigin = new Pt(randomInt(0, this.s.w - tRoom.s.w), randomInt(0, this.s.h - tRoom.s.h));
        placedRooms.push(tRoom);
        this.roomToMap(tRoom, roomOrigin);
        Game.gd.addRandObj(roomOrigin, tRoom.s);

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
                            Game.gd.addRandObj(roomOrigin, tRoom.s);
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
        ctx.globalAlpha = 1;
        /* if (Game.gd.DEBUG) {
            // DEBUG AREA
            ctx.drawImage(
                this.rc,
                ~~(c.p.x * Game.T_S), ~~(c.p.y * Game.T_S),
                ~~(c.s.w * Game.T_S), ~~(c.s.h * Game.T_S),
                0, 0,
                ~~(Game.T_W * Game.T_S), ~~(Game.T_H * Game.T_S));
            // END DEBUG AREA
        } else { */
        ctx.drawImage(
            this.rc,
            ~~(c.p.x * Game.T_S), ~~(c.p.y * Game.T_S),
            ~~(c.s.w * Game.T_S), ~~(c.s.h * Game.T_S),
            0, 0,
            ~~((c.s.w) * Game.T_S * 2), ~~((c.s.h) * Game.T_S * 2));
        // }
    }
}