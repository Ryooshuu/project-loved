<script setup lang="ts">
const count = ref(0);

function decrement(e: MouseEvent) {
    e.preventDefault();
    count.value--;
}
</script>

<template>
    <button @click="count++" @contextmenu="decrement">Count is: {{ count }}</button>
</template>
