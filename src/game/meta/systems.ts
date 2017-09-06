function input(e: GameEntity): void {
    let m = (<Pt>e.components['p-move'].value);
    m.x = m.y = 0;
    if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
        m.y -= 1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
        m.y += 1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
        m.x -= 1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
        m.x += 1;
    }
}

function exit(e: GameEntity) {
    
}

function activate(e: GameEntity) {

}

function spawn(e: GameEntity) {

}

function pickup(e: GameEntity) {

}

function collision(e: GameEntity, l: Level): boolean {
    let ec = e.components;
    let p = ec['p-pos'].value;
    let m: Pt = ec['p-move'].value;
    let t: Pt = new Pt(m.x, m.y);
    let r: boolean = false;
    if (!(l.m[p.x + m.x + ((p.y + m.y) * l.s.w)] & TMASK.W)) {
        m.x = m.y = 0;
        r = true;
    }
    if (t.x !== 0 && l.m[p.x + t.x + (p.y * l.s.w)] & TMASK.W) {
        m.x = t.x;
        r = false;
    } else if (t.y !== 0 && l.m[p.x + ((p.y + t.y) * l.s.w)] & TMASK.W) {
        m.y = t.y;
        r = false;
    }
    return r;
}

function movement(e: GameEntity): boolean {
    let ec = e.components;
    let s = (<cSprite>ec['sprite']);
    let t = (<cTimer>ec['t-move']);
    let p = ec['p-pos'];
    let m: Pt = ec['p-move'].value;
    if (m.x !== 0 || m.y !== 0) {
        if (t.cur >= t.value) {
            t.cur = 0;
            if (m.x === 1) s.r += 90;
            else if (m.x === -1) s.r -= 90;
            else if ((m.y === -1 || m.y === 1) && s.r % 180 !== 0) s.r = 0;
            else if ((m.y === -1 || m.y === 1) && s.r % 180 === 0) s.r += 180;
            if (Math.abs(s.r % 360) === 1) s.r = 0;
            Game.gd.l.m[p.value.x + (p.value.y * Game.gd.l.s.w)] |= TMASK.W | TMASK.P;
            p.value.x += m.x;
            p.value.y += m.y;
            Game.gd.l.m[p.value.x + (p.value.y * Game.gd.l.s.w)] &= ~TMASK.W & ~TMASK.P;
            m.x = m.y = 0;
            return true;
        }
    }
    return false;
}

function drawEnt(ctx: Context2D, e: GameEntity, c: Camera): void {
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
}

function drawSpr(ctx: Context2D, sp: HTMLCanvasElement, p: Pt, s: number = 1, r: number = 0): void {
    ctx.save();
    ctx.translate(~~(p.x * Game.T_S * s), ~~(p.y * Game.T_S * s));
    ctx.rotate(r * Math.PI / 180);
    ctx.drawImage(sp,
        0, 0,
        Game.T_S, Game.T_S,
        -Game.T_S, -Game.T_S,
        Game.T_S * s, Game.T_S * s);
    ctx.restore();
}