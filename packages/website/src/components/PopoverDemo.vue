<script setup lang="ts">
import { NavArrowDown } from "@iconoir/vue";
import { AnimatePresence, motion } from "motion-v";
import { Popover } from "reka-ui/namespaced";

const open = ref(false);
</script>

<template>
    <Popover.Root v-model:open="open">
        <Popover.Trigger class="flex flex-row gap-1 items-center p-1 rounded-md border-surface-solid-2 outline-1 hover:surface-1 transition-colors cursor-pointer">
            <p>More info</p>
            <motion.div
                layout
                :animate="{
                    rotate: open ? 180 : 0
                }"
                :transition="{
                    type: 'spring',
                    visualDuration: 0.3,
                    bounce: 0.4
                }"
            >
                <NavArrowDown />
            </motion.div>
        </Popover.Trigger>
        <Popover.Portal>
            <AnimatePresence>
                <Popover.Content
                    as-child
                    class="rounded-md m-1 p-5 w-64 surface-solid-1 shadow-sm z-10"
                    :collision-padding="{ bottom: 5, top: 5, left: 5, right: 5 }"
                >
                    <motion.div
                        animate="show"
                        exit="hidden"
                        initial="hidden"
                        :variants="{
                            hidden: { opacity: 0, y: -5 },
                            show: { opacity: 1, y: 5 }
                        }"
                        :transition="{
                            type: 'spring',
                            visualDuration: 0.3,
                            bounce: 0.4
                        }"
                    >
                        <p>Some more info...</p>
                    </motion.div>
                </Popover.Content>
            </AnimatePresence>
        </Popover.Portal>
    </Popover.Root>
</template>
