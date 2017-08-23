// Guiding Lights at .6 & 3 maybe? 
class Light {
    p: Pt;
    r: number;
    i: number
    a: number[];
    constructor(p: Pt, i: number) {
        this.p = p;
        this.i = .80; //i;
        this.r = 6; //~~(i / 0.05);
    }
    calc(m: number[], s: Dm) {
        this.a = [];
        let es = Light.poc(this.p.x, this.p.y, this.r);

        for (let e in es) {
            let l = Light.pol(this.p.x, this.p.y, es[e].x, es[e].y);
            let mx = this.i / l.length;

            for (let tl in l) {
                if (l[tl].x < 0 || l[tl].x >= s.w ||
                    l[tl].y < 0 || l[tl].y >= s.h) { break; }

                let idx = ((l[tl].y * s.w) + l[tl].x);
                let st = mx * (l.length - parseInt(tl));

                if (!(idx in this.a) || this.a[idx] < st) {
                    this.a[idx] = (st > 1 ? 1 : st);
                }
                if (m[idx] & TMASK.WALL) { break; }
            }
        }
    }

    static reLM(al: Light[], s: Dm) {
        let lm: number[] = [];
        for (let l in al) {
            for (let idx in al[l].a) {
                if (!lm[idx] || lm[idx] < al[l].a[idx]) {
                    lm[idx] = al[l].a[idx];
                }
            }
        }
        return lm;
    }
    static pol(x1: number, y1: number, x2: number, y2: number)
    {
        let l: Pt[] = [];    
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var x = x1;
        var y = y1;
        var n = 1 + dx + dy;
        var xInc = (x1 < x2 ? 1 : -1);
        var yInc = (y1 < y2 ? 1 : -1);
        var e = dx - dy;
        dx *= 2;
        dy *= 2;
        while(n>0) {
            l.push(new Pt(x, y));
            if(e>0) {
                x+= xInc;
                e-= dy;
            } else {
                y+= yInc;
                e+= dx;
            }
            n-= 1;
        }
        return l;
    }

    static poc(cx: number, cy: number, cr: number) {
        let l: Pt[] = [];
        let x = cr;
        let y = 0;
        let o2 = Math.floor(1 - x);
        while (y <= x) {
            l.push(new Pt(x + cx, y + cy));
            l.push(new Pt(y + cx, x + cy));
            l.push(new Pt(-x + cx, y + cy));
            l.push(new Pt(-y + cx, x + cy));
            l.push(new Pt(-x + cx, -y + cy));
            l.push(new Pt(-y + cx, -x + cy));
            l.push(new Pt(x + cx, -y + cy));
            l.push(new Pt(y + cx, -x + cy));
            y += 1;
            if (o2 <= 0) { o2 += (2 * y) + 1; }
            else {
                x -= 1;
                o2 += (2 * (y - x)) + 1;
            }
        }
        return l;
    }
}