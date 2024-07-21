export const MsgText = {
    youGuessing: {
        first: "我已经想好了一个两位整数 (10~99)，接下来你可以向我询问若干个问题来尝试猜出它。但对于你的问题，我只能回复「是」或「否」。现在，请你向我提出第一个问题。",
        last: {
            correct: {
                normal: "猜对啦！聪明~",
                muchQuestions: "下次还是保守一点吧",
                unbelievable: "不是，你真猜的？"
            },
            incorrect: {
                tooConfident: "你是觉得你的运气很好吗？",
                tooStupid: "杂鱼~这都猜不对"
            }
        }
    },
    robotGuessing: {
        first: "现在请你在心中想好一个两位整数 (10~99)。如果可以的话，最好将它写在纸上。接下来我会向你询问若干个问题来尝试猜出它，你只需要回复「是」或「否」。准备好了吗？"
    }
};

export const CardText = {
    correct: {
        normal: "聪明~",
        muchQuestions: "又菜又爱玩。",
        unbelievable: "我承认你是欧皇还不行吗"
    },
    incorrect: {
        tooConfident: "自不量力。",
        tooStupid: "杂鱼~"
    },
    grade(isCorrect, yourQuestionsNum) {
        if (isCorrect != "correct") return "F";
        if (yourQuestionsNum <= 5) return "A+";
        if (yourQuestionsNum <= 7) return "A";
        if (yourQuestionsNum <= 9) return "B";
        else return "C";
    },
    questionStyle(threshold) {
        if (threshold >= 0.45) return "非常保守";
        if (threshold >= 0.3) return "较为保守";
        if (threshold >= 0.15) return "较为激进";
        else return "非常激进";
    }
};