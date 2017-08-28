function createPlayer(): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cP('move'));
    p.addComponent(new cSound('move', new Beep(50, 5 ,'sine', .25, 1)));
    p.addComponent(new cTimer('move', 150));            
    p.addComponent(new cLight(new Light(new Pt(), 0.85)));
    p.addComponent(new cAABB(new Dm(1,1)));
    p.addComponent(new cFlag('input', true));
    p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[0]));
    return p;
}

function createMarker(): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cSprite(SSM.spriteSheet("marker").sprites[0]));
    return p;
}

function createSwitch(): GameEntity {
    let p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cFlag('state', false));
    p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[0]));
    return p;
}