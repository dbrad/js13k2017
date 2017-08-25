function input(e: GameEntity): void {
    let m = (<Pt>e.components['p-move'].value);
    if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
        m.y=-1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
        m.y=1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
        m.x=-1;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
        m.x=1;
    }
}
function movement(e: GameEntity): boolean {
    let ec = e.components;
    let t = (<cTimer>ec['t-move']);
    if(t.cur >= t.value) {
        t.cur = 0;
        let p = ec['p-pos'];
        let m: Pt = ec['p-move'].value;
        if(m.x !==0 || m.y !== 0) {
            p.value.x += m.x;
            p.value.y += m.y;
            m.x = m.y = 0;
            return true;
        }
    }
    return false;
}
function collision(e: GameEntity, l: Level): void {
    // TODO: AABB collision and tile collision.
}