function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(array: any[]): any[] {
    let currentIndex: number = array.length, temporaryValue: number, randomIndex: number;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
enum WALL { N, E, S, W };
enum ROOMTYPE { CORRIDOR, ROOM };
class Room {
    p: Pt;
    s: Dm;
    w: WALL[];
    t: ROOMTYPE;
    constructor(pos: Pt = new Pt(), size: Dm = new Dm(), roomType: ROOMTYPE = ROOMTYPE.ROOM, walls: WALL[] = [WALL.N, WALL.E, WALL.S, WALL.W]) {
        this.p = pos;
        this.s = size;
        this.w = walls;
        this.t = roomType;
        this.w = shuffle(this.w);
    }
    getRandomWall(): { p: Pt, w: WALL } {
        if (this.w.length === 0)
            return null;
        let randWall: WALL = this.w.pop();
        let p: Pt = new Pt();
        if (randWall === WALL.N) {
            p.x = this.p.x + Math.floor(this.s.w / 2);
            p.y = this.p.y - 1;
        } else if (randWall === WALL.S) {
            p.x = this.p.x + Math.floor(this.s.w / 2);
            p.y = this.p.y + this.s.h;
        } else if (randWall === WALL.W) {
            p.x = this.p.x - 1;
            p.y = this.p.y + Math.floor(this.s.h / 2);
        } else if (randWall === WALL.E) {
            p.x = this.p.x + this.s.w;
            p.y = this.p.y + Math.floor(this.s.h / 2);
        }
        return { p: p, w: randWall };
    }
    static makeRoom(mw: number, mh: number): Room {
        return new Room(new Pt(), new Dm(randomInt(7, mw), randomInt(7, mh)), ROOMTYPE.ROOM);
    }
    static makeCorridor(vertical: boolean): Room {
        return new Room(new Pt(), new Dm(vertical ? 5 : randomInt(9, 17), vertical ? randomInt(9, 17) : 5), ROOMTYPE.CORRIDOR);
    }
}