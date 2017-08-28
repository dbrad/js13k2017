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

function collision(e: GameEntity, l: Level): boolean {
    let ec = e.components;
    let p = ec['p-pos'].value;
    let m: Pt = ec['p-move'].value;
    let t: Pt = new Pt(m.x, m.y);
    let r: boolean = false;
    if (l.m[p.x + m.x + ((p.y + m.y) * l.s.w)] & TMASK.WALL) {
        m.x = m.y = 0;
        r = true;
    }
    if (t.x !== 0 && l.m[p.x + t.x + (p.y * l.s.w)] & TMASK.FLOOR) {
        m.x = t.x;
        r = false;
    } else if (t.y !== 0 && l.m[p.x + ((p.y + t.y) * l.s.w)] & TMASK.FLOOR) {
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
            if(m.x === 1) s.r += 90;
            if(m.x === -1) s.r -= 90;
            if((m.y === -1 || m.y === 1) && s.r % 180 !== 0) s.r = 0;
            if((m.y === -1 || m.y === 1) && s.r % 180 === 0) s.r += 180;
            if (Math.abs(s.r % 360) === 1) s.r = 0;
            p.value.x += m.x;
            p.value.y += m.y;
            m.x = m.y = 0;
            return true;
        }
    }
    return false;
}

