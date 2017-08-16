var SpriteSheetManager;
(function (SpriteSheetManager) {
    var sheets = {};
    function storeSheet(sheet) {
        sheets[sheet.name] = sheet;
    }
    SpriteSheetManager.storeSheet = storeSheet;
    function spriteSheet(name) {
        return sheets[name];
    }
    SpriteSheetManager.spriteSheet = spriteSheet;
})(SpriteSheetManager || (SpriteSheetManager = {}));
