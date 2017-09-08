class GameData {
    /**
     * @name Players
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public p: GameEntity[] = [];

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
    
    public lights: Light[] = [];

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
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.P;
        var ind = this.p.push(entity);
        this.l.m[i] |= ((ind) << 24);
    }

    addObject(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.O;
        var ind = this.o.push(entity);
        this.l.m[i] |= ((ind) << 16);        
    }

    addMarker(entity: GameEntity, pos: Pt) {
        (<cP>entity.components["p-pos"]).value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.M;        
        var ind = this.m.push(entity);
        this.l.m[i] |= ((ind) << 8);
    }

    movePlayer(op: Pt, np: Pt): void {
        // 15 << 24
        if(!this.l.m[op.x + (op.y * this.l.s.w)])
            return;
        var i = (this.l.m[op.x + (op.y*this.l.s.w)] >> 24) - 1;
        this.l.m[op.x + (op.y * this.l.s.w)] &= ~(15 << 24);
        this.l.m[op.x + (op.y * this.l.s.w)] &= ~TMASK.P;
        
        if(this.l.m[np.x + (np.y * this.l.s.w)] == undefined)
            this.l.m[np.x + (np.y * this.l.s.w)] = 0;
        this.l.m[np.x + (np.y*this.l.s.w)] |= ((i+1) << 24);
        this.l.m[np.x + (np.y*this.l.s.w)] |= TMASK.P;        
    }

    /* 
    moveObject(op: Pt, np: Pt, i: number) {
        // 255 << 16
        if(!this.l.m[op.x + (op.y * this.l.s.w)])
            this.l.m[op.x + (op.y * this.l.s.w)] = 0;
        this.l.m[op.x + (op.y * this.l.s.w)] &= ~(255 << 16);
        if(!this.l.m[np.x + (np.y * this.l.s.w)])
            this.l.m[np.x + (np.y * this.l.s.w)] = 0;
        this.l.m[np.x + (np.y*this.l.s.w)] |= ((i+1) << 16);
    }

    moveMarker(op: Pt, np: Pt, i: number) {
        // 255 << 8
        if(!this.l.m[op.x + (op.y * this.l.s.w)])
            this.l.m[op.x + (op.y * this.l.s.w)] = 0;
        this.l.m[op.x + (op.y * this.l.s.w)] &= ~(255 << 8);
        if(!this.l.m[np.x + (np.y * this.l.s.w)])
            this.l.m[np.x + (np.y * this.l.s.w)] = 0;
        this.l.m[np.x + (np.y * this.l.s.w)] |= ((i+1) << 8);
    } 
    */

    playerAt(p: Pt): boolean {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.P) !== 0
        // return this.l.m[p.x + (p.y*this.l.s.w)] && this.l.m[p.x + (p.y*this.l.s.w)] >> 24 !== 0;
    }

    objectAt(p: Pt): boolean {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.O) !== 0
        // return this.l.m[p.x + (p.y*this.l.s.w)] && ((this.l.m[p.x + (p.y*this.l.s.w)] & ~(15 << 24) ) >> 16) !== 0;
    }

    markerAt(p: Pt): boolean {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.M) !== 0
        // return this.l.m[p.x + (p.y*this.l.s.w)] && ((this.l.m[p.x + (p.y*this.l.s.w)] & ~(4095 << 16) ) >> 8) !== 0;
    }

    getPlayerAt(p: Pt): GameEntity {
        if(this.playerAt(p)) {
            var i = (this.l.m[p.x + (p.y * this.l.s.w)] >> 24) - 1;
            return Game.gd.p[i];
        }
        return undefined;
    }

    getObjectAt(p: Pt): GameEntity {
        if(this.objectAt(p)) {
            var i = ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(15 << 24) ) >> 16) - 1;
            return Game.gd.o[i];
        }
        return undefined;
    }

    getMarkerAt(p: Pt): GameEntity {
        if(this.markerAt(p)) {
            var i = ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(4095 << 16) ) >> 8) - 1;
            return Game.gd.m[i];
        }
        return undefined;
    }

    getCurrPlayer(): GameEntity {
        for (var i in this.p) {
            if (this.p[i].components['input'] && this.p[i].components['input'].value === true) {
                return this.p[i];
            }
        }
        return undefined;
    }

    getMarkerIndex(p: Pt): number {
        if(this.markerAt(p)) {
            return ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(4095 << 16) ) >> 8) - 1;
        }
        return undefined;    
    }

}