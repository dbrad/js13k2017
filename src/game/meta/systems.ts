function input(e: GameEntity): boolean {
    let m = (<Pt>e.components['p-move'].value);
    let r: boolean;
    m.x = m.y = 0;
    if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
        m.y -= 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
        m.y += 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
        m.x -= 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
        m.x += 1;
        r = true;
    }
    return r;
}

function exit(e: GameEntity) {
    var i = Game.gd.p.indexOf(e);
    if (i !== -1) {
        Game.gd.removePlayer(Pt.from(e.components['p-pos'].value));
        delete Game.gd.p[i];
        Game.gd.players -= 1;
    }
}

function activate(e: GameEntity) {
    let ec = e.components;
    if (ec['active'] && ec['active'].value === false) {
        ec['active'].value = true;
        ec['sprite'].value = SSM.spriteSheet("guide").sprites[2];
        Game.i.ae.beep(ec['s-interact'].value);
        Game.gd.addSpawner(createSpawner('guide'), Pt.from(ec['p-pos'].value));
    }
}

function spawn(e: GameEntity) {
    let ec = e.components;
    let p = Pt.from(ec['p-pos'].value);
    switch (ec['type'].value) {
        case 'player':
            Game.gd.addPlayer(createPlayer(), p);
            break;
        case 'guide':
            Game.gd.addGuide(createGuidingLight(), p);
            break;
        default:
            break;
    }
    var i = Game.gd.s.indexOf(e);
    if (i !== -1) {
        delete Game.gd.s[i];
    }
}

function pickup(e: GameEntity) {
    var i = Game.gd.o.indexOf(e);
    if (i !== -1) {
        Game.gd.removeObject(Pt.from(e.components['p-pos'].value));
        delete Game.gd.o[i];
        switch (e.components['type'].value) {
            case "chest":
                Game.gd.score += 100000;
                break;
            case "gold":
                Game.gd.score += 1000;
                break;
            default:
                break;
        }
    }
}

function collision(e: GameEntity, l: Level): boolean {
    let ec = e.components;
    let p = ec['p-pos'].value;
    let m: Pt = ec['p-move'].value;
    let t: Pt = new Pt(m.x, m.y);
    let r: boolean = false;
    if (!(l.m[p.x + m.x + ((p.y + m.y) * l.s.w)] & TMASK.W) || Game.gd.playerAt(new Pt(p.x + m.x, p.y + m.y))) {
        m.x = m.y = 0;
        r = true;
    }
    if (t.x !== 0 && (l.m[p.x + t.x + (p.y * l.s.w)] & TMASK.W) && !Game.gd.playerAt(new Pt(p.x + t.x, p.y))) {
        m.x = t.x;
        r = false;
    } else if (t.y !== 0 && (l.m[p.x + ((p.y + t.y) * l.s.w)] & TMASK.W) && !Game.gd.playerAt(new Pt(p.x, p.y + t.y))) {
        m.y = t.y;
        r = false;
    }
    return r;
}

function animate(e: GameEntity): void {
    let ec = e.components;
    let s = (<cSprite>ec['sprite']);
    let m: Pt = ec['p-move'].value;
    if (m.x !== 0 || m.y !== 0) {
        if (m.x === 1) s.r += 90;
        else if (m.x === -1) s.r -= 90;
        else if ((m.y === -1 || m.y === 1) && s.r % 180 !== 0) s.r = 0;
        else if ((m.y === -1 || m.y === 1) && s.r % 180 === 0) s.r += 180;
        if (Math.abs(s.r % 360) === 1) s.r = 0;
    }
}

function movement(e: GameEntity): boolean {
    let ec = e.components;
    let p = ec['p-pos'];
    let m: Pt = ec['p-move'].value;
    if (m.x !== 0 || m.y !== 0) {
        var o = Pt.from(p.value);
        p.value.x += m.x;
        p.value.y += m.y;
        Game.gd.movePlayer(o, p.value);
        m.x = m.y = 0;
        return true;
    }
    return false;
}

function guideMove(e: GameEntity): void {
    let ec = e.components;
    var ep = Game.gd.exit.components['p-pos'].value;
    var gp = ec['p-pos'].value;
    var dx = ep.x - gp.x;
    var dy = ep.y - gp.y;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    if (dx == 0 && dy == 0) {
        ec['p-pos'].value = Pt.from(ec['p-origin'].value);
    } else if (adx !== 0 && ady !== 0) {
        gp.x += dx > 0 ? 1 : -1;
        gp.y += dy > 0 ? 1 : -1;
    } else if (adx !== 0) {
        gp.x += dx > 0 ? 1 : -1;
    } else if (ady !== 0) {
        gp.y += dy > 0 ? 1 : -1;
    }
    let s = (<cSprite>ec['sprite']);
    s.r += 15;
    if (s.r == 360)
        s.r = 0;
}

function drawEnt(ctx: Context2D, e: GameEntity, c: Camera): void {
    let p = <Pt>e.components['p-pos'].value;
    if (p.x >= c.p.x && p.x < (c.p.x + c.s.w) && p.y >= c.p.y && p.y < (c.p.y + c.s.h)) {
        let sp = <cSprite>e.components['sprite'];
        let s = sp.value;
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