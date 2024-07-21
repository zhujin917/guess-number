<script>
import { Message } from "../definition";

export default {
    props: {
        messages: Array[Message]
    }
}
</script>

<template>
    <template v-for="(msg, index) in messages" :key="msg">
        <div v-if="msg.user == 'robot'" :class="'message robot' + (index === 0 ? ' noani' : '')">
            <div class="avatar">&#xF419;</div>
            <div class="content">
                <div class="nickname">机器人</div>
                <div v-if="msg.text" class="bubble">
                    <div class="backdrop"></div>
                    <div class="text">{{ msg.text }}</div>
                </div>
                <img v-else src="../assets/svg/waitingMessage.svg" class="waiting">
            </div>
        </div>
        <div v-else-if="msg.user == 'you'" class="message you">
            <div class="avatar">&#xF25F;</div>
            <div class="content">
                <div class="nickname">您</div>
                <div class="bubble">
                    <div class="backdrop"></div>
                    <div class="text">{{ msg.text }}</div>
                </div>
            </div>
        </div>
        <div v-else-if="msg.user == 'system'" class="card">
            <div class="item">
                <div class="title">等级</div>
                <div class="text">{{ msg.text.grade }}</div>
            </div>
            <div class="item">
                <div class="title">你的答案</div>
                <div class="text">{{ msg.text.yourAnswer }}</div>
            </div>
            <div class="item">
                <div class="title">正确答案</div>
                <div class="text">{{ msg.text.correctAnswer }}</div>
            </div>
            <div class="item">
                <div class="title">提问次数</div>
                <div class="text">{{ msg.text.questionsNum }}</div>
            </div>
            <div class="item">
                <div class="title">提问风格</div>
                <div class="text">{{ msg.text.questionStyle }}</div>
            </div>
            <div class="item">
                <div class="title">来自机器人的评价</div>
                <div class="text">{{ msg.text.commentFromRobot }}</div>
            </div>
        </div>
    </template>
</template>

<style scoped>
@import url("../assets/css/MessagesDisplayer/message.css");
@import url("../assets/css/MessagesDisplayer/card.css");
</style>