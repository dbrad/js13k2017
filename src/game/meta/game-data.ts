class GameData {
    /**
     * @name Entities
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public e: GameEntity[] = [];

    /**
     * @name Markers
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public m: GameEntity[] = [];

    /**
     * @name Objects
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public o: GameEntity[] = [];

    public l: Level;

    public lm: number[] = [];

    public DEBUG: boolean;

    private objectBank: Function;

    buildObjBank(p: number, g: number) {
        let seq: number[] = [0];
        for (var i = 0; i < p; i++) { seq.push(1); }
        for (var i = 0; i < g; i++) { seq.push(2); }
        for (var i = 0; i < 50; i++) { seq.push(3); }
        for (var i = 0; i < 25; i++) { seq.push(4); }
        this.objectBank = randomized(seq, false);
    }
    addRandObj(o: Pt, s: Dm) {
        let obj = parseInt(this.objectBank());
        let p = new Pt(randomInt(o.x + 1, o.x + s.w - 2), randomInt(o.y + 1, o.y + s.h - 2));
        if (obj !== undefined) {
            switch (obj) {
                case 0:
                    this.addObject(createObject(0), p);
                    break;
                case 1:
                    break;
                case 2:
                    this.addObject(createSwitch(), p);
                    break;
                case 3:
                    this.addObject(createObject(1), p);
                    break;
                case 4:
                    this.addObject(createObject(2), p);
                    break;
                default:
                    this.addObject(createObject(2), p);
                    break;
            }
        } else {
            this.addObject(createObject(2), p);
        }
    }

    addEntity(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        Game.gd.e.push(entity);
    }

    addObject(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        Game.gd.o.push(entity);
    }

    getCurrPlayer(): GameEntity {
        for (var i in this.e) {
            if (this.e[i].components['input'] && this.e[i].components['input'].value) {
                return this.e[i];
            }
        }
        return undefined;
    }

    getEntAt(p: Pt): GameEntity {
        let _p: Pt;
        for (var i in this.e) {
            if (this.e[i].components['p-pos']) {
                _p = this.e[i].components['p-pos'].value;
                if (_p.x === p.x && _p.y === p.y)
                    return this.e[i];
            }
        }
        return undefined;
    }

    getObjAt(p: Pt): GameEntity {
        let _p: Pt;
        for (var i in this.o) {
            if (this.o[i].components['p-pos']) {
                _p = this.o[i].components['p-pos'].value;
                if (_p.x === p.x && _p.y === p.y)
                    return this.o[i];
            }
        }
        return undefined;
    }

    getObjIndexAt(p: Pt): number {
        let _p: Pt;
        for (var i in this.o) {
            if (this.o[i].components['p-pos']) {
                _p = this.o[i].components['p-pos'].value;
                if (_p.x === p.x && _p.y === p.y)
                    return parseInt(i);
            }
        }
        return undefined;
    }

}