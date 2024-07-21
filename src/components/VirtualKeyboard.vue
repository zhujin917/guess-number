<script>
import KeyPad from "./KeyPad.vue";

import { GameStatus, Question, Answer, AnswerYN } from "../definition";

export default {
    components: { KeyPad },
    props: {
        gameStat: GameStatus
    },
    data() {
        return {
            kbStat: 0,
            yQuestion: new Question(),
            yAnswer: new Answer(),
            rAnswer: new AnswerYN(null),
            rangeTxt: {
                "itself": "这个数",
                "first": "这个数的十位数",
                "second": "这个数的个位数",
                "sum": "这个数的个位数与十位数之和",
                "diff": "这个数的个位数与十位数之差",
                "prod": "这个数的个位数与十位数之积"
            },
            wayWithNumTxt: {
                "bigger": ["大于", ""],
                "smaller": ["小于", ""],
                "times": ["是", "的整数倍"]
            }
        };
    },
    methods: {
        back() {
            this.kbStat = 0;
            this.yQuestion = new Question();
            this.yAnswer = new Answer();
            this.rAnswer = new AnswerYN(null);
        },
        setQuesAttr(attrName, attrValue) {
            this.yQuestion[attrName] = attrValue;
            if (!this.yQuestion.way) this.kbStat = 1.1;
            else if (this.yQuestion.way != "prime") this.kbStat = 1.2;
        },
        setNextNum(n) {
            let number = this.kbStat == 1.2 ? this.yQuestion.number : this.yAnswer.number;
            if (number >= 10) return;
            else if (!number) number = n;
            else number = number * 10 + n;
            if (this.kbStat == 1.2) this.yQuestion.number = number;
            else this.yAnswer.number = number;
        },
        delLastNum() {
            let number = this.kbStat == 1.2 ? this.yQuestion.number : this.yAnswer.number;
            if (!number) return;
            number = Math.floor(number / 10);
            if (this.kbStat == 1.2) this.yQuestion.number = number;
            else this.yAnswer.number = number;
        },
        sendMsg() {
            if (this.gameStat.mode == "youGuessing") {
                if (this.kbStat < 2 && this.yQuestion.isOk()) {
                    this.$emit("sendMsg", this.yQuestion);
                    this.back();
                }
                else if (this.kbStat == 2 && this.yAnswer.number) {
                    this.$emit("sendMsg", this.yAnswer);
                    this.back();
                }
            }
            else if (this.gameStat.mode == "robotGuessing") {
                this.$emit("sendMsg", this.rAnswer);
            }
        },
        sendRAnswer(answer) {
            this.rAnswer = new AnswerYN(answer);
            this.sendMsg();
        }
    },
    mounted() {
        document.addEventListener("keydown", (evt) => {
            if (evt.key == "Enter") {
                this.sendMsg();
                return;
            }
            else if (this.gameStat.mode != "youGuessing") return;
            else if (this.kbStat != 1.2 && this.kbStat != 2) return;
            else if (evt.key == "Backspace") this.delLastNum();
            else if (!isNaN(Number(evt.key))) this.setNextNum(Number(evt.key));
        });
    },
    expose: ["kbStat", "back"],
    emits: ["sendMsg"]
}
</script>

<template>
    <div v-if="gameStat.isOver" :class="'over' + ($parent.isKeyboardStowed ? ' stowed' : '')">
        此对话已结束。<div class="reset" @click="$parent.refreshSession()">重置对话</div>
    </div>
    <div v-else-if="!gameStat.vkbVisible" :class="'waitingRobot' + ($parent.isKeyboardStowed ? ' stowed' : '')">
        <div class="notice">
            <div class="icon">&#xF3D8;</div>
            <div class="text">机器人正在输入</div>
        </div>
    </div>
    <template v-else-if="gameStat.mode == 'youGuessing'">
        <div v-if="kbStat == 0" :class="'y0' + ($parent.isKeyboardStowed ? ' stowed' : '')">
            <div class="option" @click="kbStat = 1; $parent.setKeyboardStowed()">
                <div class="icon">&#xF048;</div>
                <div class="title">我需要询问</div>
                <div class="text">向机器人询问有关的情报</div>
            </div>
            <div class="option" @click="kbStat = 2; $parent.setKeyboardStowed()">
                <div class="icon">&#xEEA9;</div>
                <div class="title">我已有答案</div>
                <div class="text">只有一次核验答案的机会</div>
            </div>
        </div>
        <div v-if="kbStat >= 1 && kbStat <= 2" class="y1">
            <div class="header">
                <div class="back" @click="back()">&#xF493;</div>
                <div class="displayer">
                    <div v-if="kbStat < 2" class="text">
                        <span v-if="kbStat >= 1.0 || yQuestion.range"
                            :class="(kbStat == 1.0 ? 'active' : '') + (yQuestion.range ? '' : ' empty')"
                            @click="kbStat = 1.0">
                            <template v-if="!yQuestion.range">询问对象</template>
                            <template v-else>{{ rangeTxt[yQuestion.range] }}</template>
                        </span>
                        <span v-if="kbStat >= 1.1 || yQuestion.way"
                            :class="(kbStat == 1.1 ? 'active' : '') + (yQuestion.way ? '' : ' empty')"
                            @click="kbStat = 1.1">
                            <template v-if="!yQuestion.way">询问条件</template>
                            <template v-else-if="['bigger', 'smaller', 'times'].includes(yQuestion.way)">
                                {{ wayWithNumTxt[yQuestion.way][0] }}<span v-if="kbStat >= 1.2 || yQuestion.number"
                                    :class="(kbStat == 1.2 ? 'active' : '') + (yQuestion.number ? '' : ' empty')"
                                    @click="kbStat = 1.2; $event.stopPropagation()">
                                    <template v-if="!yQuestion.number">整数</template>
                                    <template v-else>{{ yQuestion.number }}</template>
                                </span><template v-else>...</template>{{ wayWithNumTxt[yQuestion.way][1] }}
                            </template>
                            <template v-else-if="yQuestion.way == 'prime'">是质数</template>
                        </span>
                        <span v-if="yQuestion.isOk()">吗？</span>
                    </div>
                    <div v-else class="text">
                        <span>这个数是</span>
                        <span :class="'active' + (yAnswer.number ? '' : ' empty')"
                            @click="kbStat = 2; $event.stopPropagation()"
                            :data-correct-answer="gameStat.youGuessing.targetNumber">
                            <template v-if="!yAnswer.number">整数</template>
                            <template v-else>{{ yAnswer.number }}</template>
                        </span>
                    </div>
                </div>
                <div :class="'submit' + ((kbStat < 2 && yQuestion.isOk() || kbStat == 2 && yAnswer.number) ? ' ok' : '')"
                    @click="sendMsg">
                    &#xF0D9;
                </div>
            </div>
            <div v-if="kbStat == 1" class="options">
                <div v-for="key in Object.keys(rangeTxt)" :key="key" @click="setQuesAttr('range', key)" class="option">
                    {{ rangeTxt[key] }}
                </div>
            </div>
            <div v-if="kbStat == 1.1" class="options">
                <div class="option" @click="setQuesAttr('way', 'bigger')">大于...</div>
                <div class="option" @click="setQuesAttr('way', 'smaller')">小于...</div>
                <div class="option" @click="setQuesAttr('way', 'times')">是...的整数倍</div>
                <div class="option" @click="setQuesAttr('way', 'prime')">是质数</div>
            </div>
            <div v-if="kbStat == 1.2 || kbStat == 2" class="keypad">
                <KeyPad @num="setNextNum" @del="delLastNum" />
            </div>
        </div>
    </template>
    <template v-else-if="gameStat.mode == 'robotGuessing'">
        <div v-if="kbStat == 0" class="r0">
            <div class="btn" @click="kbStat = 1; sendMsg()">
                <div class="text">准备好了</div>
                <div class="icon">&#xEA6C;</div>
            </div>
        </div>
        <div v-if="kbStat == 1" class="r1">
            <div class="btn" @click="sendRAnswer(true)">
                <div class="icon">&#xEB7A;</div>
                <div class="text">是</div>
            </div>
            <div class="btn" @click="sendRAnswer(false)">
                <div class="icon">&#xEB99;</div>
                <div class="text">否</div>
            </div>
        </div>
    </template>
</template>

<style scoped>
@import url("../assets/css/VirtualKeyboard/style.css");
@import url("../assets/css/VirtualKeyboard/youGuessing.css");
@import url("../assets/css/VirtualKeyboard/robotGuessing.css");
@import url("../assets/css/VirtualKeyboard/mobile.css") screen and (max-width: 800px);
</style>