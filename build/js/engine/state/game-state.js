var GameState = (function () {
    function GameState(game) {
        this.game = game;
        this.redraw = true;
        this.requestingClear = false;
    }
    GameState.prototype.transition = function () {
        this.redraw = true;
        this.update(0);
    };
    return GameState;
}());
