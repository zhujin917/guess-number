import { RobotGuessing, YouGuessing } from "./core";

export class Message {
    user = "";
    text = "";
    constructor(user, text) {
        this.user = user;
        this.text = text;
    }
}

export class GameStatus {
    isOver = false;
    robotGuessing = new RobotGuessing();
    youGuessing = new YouGuessing();
    vkbVisible = true;

    mode = "";
    constructor(mode) {
        this.mode = mode;
    }
}

export class Question {
    way = "";
    range = "";
    number = -114514;
    constructor(way, range, number) {
        this.way = way;
        this.range = range;
        this.number = number;
    }
    isOk() {
        if (!this.way || !this.range) return false;
        if (!this.number && this.way != "prime") return false;
        return true;
    }
    toText() {
        let str = "";
        str += {
            "itself": "这个数",
            "first": "这个数的十位数",
            "second": "这个数的个位数",
            "sum": "这个数的个位数与十位数之和",
            "diff": "这个数的个位数与十位数之差",
            "prod": "这个数的个位数与十位数之积"
        }[this.range];
        str += {
            "bigger": `大于 ${this.number} `,
            "smaller": `小于 ${this.number} `,
            "times": `是 ${this.number} 的整数倍`,
            "prime": "是质数",
        }[this.way];
        str += "吗？";
        return str;
    }
}

export class Answer {
    number = -114514;
    constructor(number) {
        this.number = number;
    }

    toText() {
        return `这个数是 ${this.number}`;
    }
}

export class AnswerYN {
    bool = null;
    constructor(bool) {
        this.bool = bool;
    }

    toText() {
        if (this.bool === null) return undefined;
        if (this.bool === true) return "是";
        if (this.bool === false) return "否";
    }
}