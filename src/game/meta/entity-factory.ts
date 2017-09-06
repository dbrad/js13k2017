function createPlayer(): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cP('move'));
    p.addComponent(new cSound('move', new Beep(50, 5 ,'sine', .25, 1)));
    p.addComponent(new cTimer('move', 150));            
    p.addComponent(new cLight(new Light(new Pt(), 0.85)));
    p.addComponent(new cFlag('input', true));
    p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[0]));
    return p;
}

function createMarker(t: number, r: number = 0): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    let s = new cSprite(SSM.spriteSheet("marker").sprites[t]);
    s.r = r;
    p.addComponent(s);
    return p;
}

function createSwitch(): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cFlag('state', false));
    p.addComponent(new cSprite(SSM.spriteSheet("guide").sprites[1]));
    return p;
}

function createObject(s: number): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cSprite(SSM.spriteSheet("objects").sprites[s]));
    p.addComponent(new cSound('collide', new Beep(50, 5 ,'sine', .25, 1)));
    return p;
}