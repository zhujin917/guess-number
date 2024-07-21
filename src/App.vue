<script>
import MessagesDisplayer from "./components/MessagesDisplayer.vue";
import VirtualKeyboard from "./components/VirtualKeyboard.vue";
import FooterContent from "./components/FooterContent.vue";
import MoreAndAbout from "./components/MoreAndAbout.vue";

import { Message, GameStatus, Question, Answer } from "./definition";
import { MsgText, CardText } from "./text";

export default {
    components: { MessagesDisplayer, VirtualKeyboard, FooterContent, MoreAndAbout },
    data() {
        return {
            messages: [new Message("robot", MsgText.youGuessing.first)],
            gameStat: new GameStatus("youGuessing"),
            isKeyboardStowed: false,
            programScrollingMessages: false,
            displayMoreAndAbout: false
        };
    },
    methods: {
        refreshSession(refreshGameStat = true) {
            this.messages = [new Message("robot", MsgText[this.gameStat.mode].first)];
            if (refreshGameStat) {
                this.gameStat = new GameStatus(this.gameStat.mode);
            }
            this.isKeyboardStowed = false;
            this.programScrollingMessages = false;
            this.$refs.vkb.back();
        },
        getYourQuestionsNum() {
            return this.messages.filter(msg => msg.user == "you").length - 1;
        },
        pushMessage(user, text = null) {
            this.messages.push(new Message(user, text));
            this.programScrollingMessages = true;
            setTimeout(() => {
                this.$refs.messages.scrollTo({
                    left: 0,
                    top: this.$refs.messages.scrollHeight,
                    behavior: "instant"
                });
            }, 1);
            setTimeout(() => {
                this.programScrollingMessages = false;
            }, 100);
        },
        processMessage(msg) {
            this.gameStat.vkbVisible = false;
            let text = msg.toText();
            if (text) {
                this.pushMessage("you", msg.toText());
            }
            setTimeout(() => {
                this.pushMessage("robot");
            }, 800);

            let gameOver = false;
            let setText = (text) => {
                setTimeout(() => {
                    this.messages[this.messages.length - 1].text = text;
                    this.gameStat.vkbVisible = true;
                    this.gameStat.isOver = gameOver;
                }, 2200);
            };

            if (this.gameStat.mode == "youGuessing") {
                if (msg instanceof Question) {
                    let answer = this.gameStat.youGuessing.giveAnswer(msg);
                    let threshold = this.gameStat.robotGuessing.applyAnswer(msg, answer);
                    this.gameStat.youGuessing.sumThreshold += threshold;
                    setText(answer ? "是" : "否");
                }
                else if (msg instanceof Answer) {
                    gameOver = true;
                    let yourQuestionsNum = this.getYourQuestionsNum();
                    let isCorrect = (this.gameStat.youGuessing.targetNumber == msg.number) ? "correct" : "incorrect";

                    let comment;
                    if (isCorrect == "correct") {
                        if (this.gameStat.robotGuessing.numbers.length < 10) comment = "normal";
                        else if (yourQuestionsNum >= 10) comment = "muchQuestions";
                        else comment = "unbelievable";
                    }
                    else {
                        if (this.gameStat.robotGuessing.numbers.length <= 3 || yourQuestionsNum >= 10) comment = "tooStupid";
                        else comment = "tooConfident";
                    }

                    let averageThreshold = 0;
                    if (yourQuestionsNum > 0) {
                        averageThreshold = this.gameStat.youGuessing.sumThreshold / yourQuestionsNum;
                    }

                    setText(MsgText.youGuessing.last[isCorrect][comment]);
                    setTimeout(() => {
                        this.pushMessage("system", {
                            "grade": CardText.grade(isCorrect, yourQuestionsNum),
                            "yourAnswer": msg.number,
                            "correctAnswer": this.gameStat.youGuessing.targetNumber,
                            "questionsNum": yourQuestionsNum,
                            "questionStyle": CardText.questionStyle(averageThreshold),
                            "commentFromRobot": CardText[isCorrect][comment]
                        });
                    }, 2300);
                }
            }
            else if (this.gameStat.mode == "robotGuessing") {
                if (msg.bool !== null) this.gameStat.robotGuessing.applyAnswer(this.gameStat.robotGuessing.latestQuestion, msg.bool);
                if (this.gameStat.robotGuessing.numbers.length > 1) {
                    let cQuestion = this.gameStat.robotGuessing.getQuestion();
                    let dQuestion = new Question(cQuestion.way, cQuestion.range, cQuestion.number);
                    setText(dQuestion.toText());
                }
                else {
                    gameOver = true;
                    setText(`这个数是 ${this.gameStat.robotGuessing.numbers[0]}`);
                }
            }
        },
        setKeyboardProperty() {
            this.$refs.keyboard.style.setProperty("--client-height", this.$refs.keyboard.clientHeight + "px");
        },
        setKeyboardStowed() {
            this.isKeyboardStowed = (this.$refs.vkb.kbStat == 0 && this.gameStat.mode == "youGuessing");
        }
    },
    mounted() {
        this.$refs.messages.addEventListener("scroll", () => {
            if (!this.programScrollingMessages) this.setKeyboardStowed();
        });
        this.setKeyboardProperty();
        window.addEventListener("resize", this.setKeyboardProperty);
    },
    watch: {
        gameStat() {
            this.$nextTick(() => {
                this.refreshSession(false);
            });
        }
    },
    expose: ["messages", "gameStat", "refreshSession", "setKeyboardProperty", "isKeyboardStowed", "setKeyboardStowed", "displayMoreAndAbout"]
}
</script>

<template>
    <main>
        <div class="title">
            <div class="text">猜数字</div>
            <div class="btn" @click="displayMoreAndAbout = true">&#xEF78;</div>
        </div>
        <div class="messages" ref="messages">
            <MessagesDisplayer :messages="messages" />
        </div>
        <div ref="keyboard"
            :class="'keyboard' + (isKeyboardStowed ? ' stowed' : '') + (gameStat.mode == 'robotGuessing' ? ' lower' : '')">
            <VirtualKeyboard ref="vkb" :gameStat="gameStat" @sendMsg="processMessage" />
        </div>
        <MoreAndAbout v-if="displayMoreAndAbout" />
    </main>
    <footer>
        <FooterContent />
    </footer>
</template>

<style>
/* global */
@import url("./assets/css/style.css");
</style>

<style scoped>
@import url("./assets/css/App/main.css");
@import url("./assets/css/App/footer.css");
@import url("./assets/css/App/mobile.css") screen and (max-width: 800px);
</style>