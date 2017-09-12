/// <reference path="../game.ts" />

class DialogWindow extends GameState {

    constructor() {
        super();
    }

    transitionIn(): void {
        super.transitionIn()
    }

    transitionOut(): void {
        super.transitionOut()
    }

    update(delta: number): void {
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            Game.i.e.gsm.pop();
        }
    }

    draw(ctx: Context2D): void {
        if (this.redraw) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = 'black';
            ctx.fillRect(64, 64, ~~(Game.P_W - 128), ~~(Game.P_H - 128));

            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.font = "10px consolas";

            var x = 80, y = 88;
            
            if (Game.gd.message != Message.CONTROLS) {
                var words = Message.getText(Game.gd.message).split(' ');
                var line = '';
                for (var n = 0; n < words.length; n++) {
                    var tl = line + words[n] + ' ';
                    var s = ctx.measureText(tl);
                    var tw = s.width;
                    if (tw > ~~(Game.P_W - 152) && n > 0) {
                        ctx.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += 16;
                    }
                    else {
                        line = tl;
                    }
                }
                ctx.fillText(line, x, y);
            } else {
                var lines = Message.getText(Game.gd.message).split('\n');
                for (var n = 0; n < lines.length; n++) {
                    ctx.fillText(lines[n], x, y);
                    y += 16;
                }
            }
            ctx.textAlign = 'right';
            ctx.fillText('Press SPACE / ENTER to continue...', ~~(Game.P_W - 72), ~~(Game.P_H - 72));

            ctx.strokeStyle = 'white';            
            ctx.strokeRect(64, 64, ~~(Game.P_W - 128), ~~(Game.P_H - 128));
            this.redraw = false;
        }
    }
}