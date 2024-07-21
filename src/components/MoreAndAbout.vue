<script>
import FooterContent from "./FooterContent.vue";

import { GameStatus } from "../definition";

export default {
    components: { FooterContent },
    methods: {
        quit() {
            this.$refs.more.classList.add("noani");
            setTimeout(() => {
                this.$refs.more.classList.remove("noani");
                this.$refs.more.classList.add("quit");
            }, 1);
            setTimeout(() => {
                this.$parent.displayMoreAndAbout = false;
            }, 320);
        },
        refreshSession() {
            this.quit();
            setTimeout(() => {
                this.$parent.refreshSession();
            }, 310);
        },
        changeGameStat(mode) {
            this.quit();
            setTimeout(() => {
                this.$parent.gameStat = new GameStatus(mode);
            }, 310);
            setTimeout(() => {
                this.$parent.setKeyboardProperty();
            }, 1000);
        }
    }
}
</script>

<template>
    <div class="more" ref="more" @click="quit()">
        <div class="choices" @click="$event.stopPropagation()">
            <div :class="'choice' + ($parent.gameStat.vkbVisible && $parent.messages.length > 1 ? '' : ' disabled')"
                @click="refreshSession()">
                <div class="icon">&#xF064;</div>
                <div class="text">重置对话</div>
            </div>
            <div :class="'choice' + ($parent.gameStat.vkbVisible ? '' : ' disabled')"
                v-if="$parent.gameStat.mode == 'youGuessing'" @click="changeGameStat('robotGuessing')">
                <div class="icon">&#xF41A;</div>
                <div class="text">让机器人来猜</div>
            </div>
            <div :class="'choice' + ($parent.gameStat.vkbVisible ? '' : ' disabled')"
                v-if="$parent.gameStat.mode == 'robotGuessing'" @click="changeGameStat('youGuessing')">
                <div class="icon">&#xF264;</div>
                <div class="text">让我来猜</div>
            </div>
            <footer>
                <FooterContent />
            </footer>
        </div>
    </div>
</template>

<style scoped>
@import url("../assets/css/MoreAndAbout/style.css");
@import url("../assets/css/MoreAndAbout/mobile.css") screen and (max-width: 800px);
</style>