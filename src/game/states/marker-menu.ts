/// <reference path="../game.ts" />

class MarkerMenu extends GameState {

    constructor() {
        super();
    }

    private selectedIndex: number = 0;
    private bip: Beep = new Beep(1050, 1050, 'sawtooth', 0.25, 1);
    private boop: Beep = new Beep(495, 495, 'square', 0.25, 1);

    transitionIn(): void {
        this.selectedIndex = 5;
        super.transitionIn();
    }

    transitionOut(): void {
        super.transitionOut();
    }

    update(delta: number): void {
        if (Input.KB.wasDown(Input.KB.KEY.ESC))
            Game.i.e.gsm.pop();

        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            let p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
            let i = Game.gd.getMarkerIndex(p);
            if (i !== undefined) {
                delete Game.gd.m[i];
                Game.gd.removeMarker(p);
                Game.gd.markers += 1;
            }
            if (this.selectedIndex !== 5 && Game.gd.markers > 0) {
                let m = createMarker(this.selectedIndex === 4 ? 1 : 0, 90 * this.selectedIndex);
                Game.gd.addMarker(m, p);
                Game.gd.markers -= 1;
            }
            Game.i.ae.beep(this.boop);
            Game.i.e.gsm.pop();
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.RIGHT)) {
            this.selectedIndex = (this.selectedIndex + 1) % 6;
            Game.i.ae.beep(this.bip);
            this.redraw = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.LEFT)) {
            if (this.selectedIndex === 0) {
                this.selectedIndex = 5;
            } else {
                this.selectedIndex = (this.selectedIndex - 1) % 6;
            }
            Game.i.ae.beep(this.bip);
            this.redraw = true;
        }
    }

    draw(ctx: Context2D): void {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "black";
            ctx.fillRect(128, 112, ~~(Game.P_W - 256), ~~(Game.P_H - 240));

            ctx.globalAlpha = 1;
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(10, 9), 2);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(12, 9), 2, 90);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(14, 9), 2, 180);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(16, 9), 2, 270);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[1], new Pt(18, 9), 2);

            ctx.font = "11px helvetica";
            ctx.textAlign = "left";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(
                `PICKUP`,
                ~~(39 * Game.T_S) + 4,
                ~~(18.5 * Game.T_S));

            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(
                `PLACE A MARKER`,
                ~~(32 * Game.T_S),
                ~~(15.5 * Game.T_S));


            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;

            ctx.strokeRect(
                ((19 + (this.selectedIndex * 4)) * Game.T_S) - 2,
                (17 * Game.T_S) - 2,
                (this.selectedIndex === 5 ? (Game.T_S * 6) : (Game.T_S * 2)) + 4,
                (Game.T_S * 2) + 4);
        }
    }
}