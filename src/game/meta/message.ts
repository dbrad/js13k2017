enum Message {
    OPENING,
    CONTROLS,
    ENDING_0,
    ENDING_25,
    ENDING_50,
    ENDING_75,
    ENDING_100
}

namespace Message {
    let _m: string[] = [];

    _m[Message.OPENING] = '';
    _m[Message.CONTROLS] = '';
    _m[Message.ENDING_0] = '';
    _m[Message.ENDING_25] = '';
    _m[Message.ENDING_50] = '';
    _m[Message.ENDING_75] = '';
    _m[Message.ENDING_100] = '';
    export function getText(m: Message): string {
        return btoa(_m[m]);
    }
}