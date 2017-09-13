enum Message {
    OPENING,
    CONTROLS,
    ENDING_0,
    ENDING_1_24,
    ENDING_25_49,
    ENDING_50_74,
    ENDING_75_99,
    ENDING_100
}

namespace Message {
    let _m: string[] = [];

    _m[Message.OPENING] = "Seeking fame and fortune, you have recently joined an ambitious team of explorers. Thanks to funding received from a mysterious group of investors, your team was able to set out to explore ancient ruins across the globe. It appears that luck is not on your side, however, as during the exploration you all got separated from each other. The wealth you obtain will only be useful if you live to see the light of day again.";
    _m[Message.CONTROLS] = "WASD / ARROWS - Movement\nSPACE / ENTER - Open Marker Menu\nZ - Switch Team Member\n\nFind the exit, and lead your entire team back to the surface.\n(Don't forget to pickup some treasure along the way.)";
    _m[Message.ENDING_0] = "You and your team make it out alive, but without a penny to show for your efforts. You receive a communication from the investor group recommending that if you cannot make their investment worthwhile, perhaps you should just stay lost in the ruins...";
    _m[Message.ENDING_1_24] = "You and your team make it out with a few fist fulls of treasure. It's not much to write home about, but hopefully it is enough to convince everyone that it is worth the risk of trying again.";
    _m[Message.ENDING_25_49] = "Your entire team makes it back to safety, and with modest about of loot in tow. It was a pay cheque well earned, but you know that this is just the tip of the iceberg.";
    _m[Message.ENDING_50_74] = "Your team steps out into the light, happy to be free of that dusty prison. The weight of your bags acting as a reminder of why you took this risk in the first place. You all know there must have been more treasure to discover, but for today, this was more than enough.";
    _m[Message.ENDING_75_99] = "Your team emerges from the ruins victorious, bags heavy with gold and jewels. The team looks forward to an evening of celebration and drinking, and the investor group looks forward to seeing a return on their investment.";
    _m[Message.ENDING_100] = "The expedition was a resounding success. Not a speck of wealth was left behind in the ruins that tried to rob you of your life. The investor group is pleased with the performance of the team, and looks forward to future endeavours together.";
    export function getText(m: Message): string {
        return _m[m];
    }
}