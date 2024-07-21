<script>
export default {
    data() {
        return {
            btns: (() => {
                let arr = [];
                for (let i = 1; i <= 9; i += 1) {
                    arr.push(String(i));
                }
                arr.push(String(0));
                return arr;
            })()
        };
    },
    emits: ["num", "del"]
}
</script>

<template>
    <template v-for="(btn, index) in btns" :key="btn">
        <div class="btn" @click="$emit('num', Number(btn))">
            <span>{{ btn }}</span>
        </div>
        <br v-if="(index + 1) % 3 == 0">
    </template>
    <div class="btn" @click="$emit('del')">
        <span>&#xEC1A;</span>
    </div>
</template>

<style scoped>
@import url("../assets/css/KeyPad/style.css");
</style>