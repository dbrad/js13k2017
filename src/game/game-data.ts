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
    
    /**
     * @name Spawners
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public s: GameEntity[] = [];

    /**
     * @name Guides
     * @type {GameEntity[]}
     * @memberof GameData
     */
    public g: GameEntity[] = [];

    public l: Level;
    public lm: number[] = [];
    public lights: Light[] = [];
    //public DEBUG: boolean;
    public exit: GameEntity;
    private objectBank: Function;
    public score: number = 0;
    public t_score: number = 0;
    public players: number = 0;
    public markers: number = 0;
    public message: Message;
    public opShown: boolean;
    public ctrlShown: boolean;
    private P_OFF: number = 26;
    private O_OFF: number = 16;
    private M_OFF: number = 8;

    setupGame(d: diff): void {
        var p: number;
        var g: number;
        var s: Dm;
        switch(d) {
            case diff.EASY:
                p = 2;
                g = 2;
                this.markers = 10;
                s = new Dm(100, 100); // 10 000, 10+ rooms
                break;
            case diff.NORMAL:
                p = 2;
                g = 4;
                this.markers = 25;                
                s = new Dm(175, 175); // 30 625, 40+ rooms
                break;
            case diff.HARD:
                p = 4;
                g = 8;
                this.markers = 50;                
                s = new Dm(250, 250); // 62 500, 100+ room
                break;
            case diff.VHARD:
                p = 8;
                g = 16;
                this.markers = 100;
                s = new Dm(500, 500); // 250 000, 450+ rooms
                break;
            default:
                p = 1;
                g = 2;
                this.markers = 10;
                s = new Dm(50, 50);
        }
        this.players = p;
        this.p.length = this.o.length = this.m.length = this.g.length = this.s.length = 0;
        this.buildObjBank(p, g, s);
        this.l = new Level(s);
        this.l.generate();
    }

    buildObjBank(p: number, g: number, s: Dm): void {
        let seq: number[] = [0];
        let tot = ~~(s.w * s.h * 0.001);
        let t = ~~((tot - p - g) * .25);
        let m = ~~(tot - p - g - t);
        for (var i = 0; i < p; i++) { seq.push(1); }
        for (var i = 0; i < g; i++) { seq.push(2); }
        for (var i = 0; i < t; i++) { seq.push(3); }
        for (var i = 0; i < m; i++) { seq.push(4); }
        this.objectBank = randomized(seq, false);
    }

    addRandObj(o: Pt, s: Dm): void {
        let obj = parseInt(this.objectBank());
        let p = new Pt(randomInt(o.x + 1, o.x + s.w - 2), randomInt(o.y + 1, o.y + s.h - 2));
        if (obj !== undefined) {
            switch (obj) {
                case 0: // exit
                    this.exit = createObject(0);
                    this.addObject(this.exit, p);
                    break;
                case 1: // player spawns
                    this.addSpawner(createSpawner('player'), p);
                    break;
                case 2: // guiding light switches
                    this.addObject(createSwitch(), p);
                    break;
                case 3: // chests
                    this.addObject(createObject(1), p);
                    this.t_score += 100000;
                    break;
                default: // also gold
                    this.addObject(createObject(2), p);
                    this.t_score += 1000;                    
                    break;
            }
        } else {
            this.addObject(createObject(2), p);
            this.t_score += 1000;                    
        }
    }

    addGuide(e: GameEntity, pos: Pt): void {
        (<cP>e.components["p-pos"]).value = pos;
        (<cP>e.components["p-origin"]).value = Pt.from(pos);
        this.g.push(e);
    }

    addSpawner(e: GameEntity, pos: Pt): void {
        (<cP>e.components["p-pos"]).value = pos;
        this.s.push(e);
    }

    addPlayer(e: GameEntity, pos: Pt): void {
        (<cP>e.components["p-pos"]).value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.P;
        var ind = this.p.push(e);
        this.l.m[i] |= ((ind) << this.P_OFF);
    }

    addObject(e: GameEntity, pos: Pt): void {
        (<cP>e.components["p-pos"]).value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.O;
        var ind = this.o.push(e);
        this.l.m[i] |= ((ind) << this.O_OFF);        
    }

    addMarker(e: GameEntity, pos: Pt): void {
        (<cP>e.components["p-pos"]).value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.M;        
        var ind = this.m.push(e);
        this.l.m[i] |= ((ind) << this.M_OFF);
    }

    movePlayer(op: Pt, np: Pt): void {
        // 15 << 24
        if(!this.l.m[op.x + (op.y * this.l.s.w)])
            return;
        var i = (this.l.m[op.x + (op.y*this.l.s.w)] >> this.P_OFF) - 1;
        this.removePlayer(op);
        
        if(this.l.m[np.x + (np.y * this.l.s.w)] == undefined)
            this.l.m[np.x + (np.y * this.l.s.w)] = 0;
        this.l.m[np.x + (np.y*this.l.s.w)] |= ((i+1) << this.P_OFF);
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
    
    removePlayer(p: Pt): void {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(15 << this.P_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.P);                
    }

    removeMarker(p: Pt): void {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(255 << this.M_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.M);                
    }

    removeObject(p: Pt): void {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(1023 << this.O_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.O);                
    }

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

    /*
    getPlayerAt(p: Pt): GameEntity {
        if(this.playerAt(p)) {
            var i = (this.l.m[p.x + (p.y * this.l.s.w)] >> this.P_OFF) - 1;
            return Game.gd.p[i];
        }
        return undefined;
    }
    */

    getObjectAt(p: Pt): GameEntity {
        if(this.objectAt(p)) {
            var i = ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(15 << this.P_OFF) ) >> this.O_OFF) - 1;
            return Game.gd.o[i];
        }
        return undefined;
    }

    /*
    getMarkerAt(p: Pt): GameEntity {
        if(this.markerAt(p)) {
            var i = ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(16383 << this.O_OFF) ) >> this.M_OFF) - 1;
            return Game.gd.m[i];
        }
        return undefined;
    }
    */
    getMarkerIndex(p: Pt): number {
        if(this.markerAt(p)) {
            return ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(16383 << this.O_OFF) ) >> this.M_OFF) - 1;
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
}