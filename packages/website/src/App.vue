<script setup lang="ts">
import { routes } from "vue-router/auto-routes";
import { IconoirProvider, Check, UserLove } from "@iconoir/vue";
import { motion } from "motion-v";
import { Navbar } from "@loved/ui";

console.log(`There are ${routes.length} routes.`);

const count = ref(0);
</script>

<template>
    <IconoirProvider
        :icon-props="{
            'stroke-width': 2,
            'width': '1em',
            'height': '1em'
        }"
    >
        <div class="app font-sans">
            <Navbar.Root>
                <Navbar.Section
                    :logo-inset="{
                        left: 15,
                        top: 32.5,
                        bottom: 9.5
                    }"
                >
                    <template #logo>
                        <p class="text-xl mr tracking-[3px] select-none glow max-lg:hidden">
                            PROJECT LOVED
                        </p>
                        <img
                            src="/icon.svg"
                            width="24"
                            height="24"
                            alt="project loved"
                            class="glow"
                        >
                    </template>
                    <template #items>
                        <Navbar.Item href="/">Submissions</Navbar.Item>
                        <Navbar.Item href="/consents">Mapper consents</Navbar.Item>
                        <Navbar.Item href="/team">Team</Navbar.Item>
                        <Navbar.Item href="/statistics">Statistics</Navbar.Item>
                    </template>
                </Navbar.Section>

                <Navbar.Section
                    :logo-inset="{
                        left: 10,
                        top: 32.5,
                        bottom: 9.5
                    }"
                >
                    <template #logo>
                        <UserLove class="opacity-50" width="24" height="24" />
                    </template>
                    <template #items>
                        <Navbar.Item href="/admin">Admin</Navbar.Item>
                    </template>
                </Navbar.Section>
            </Navbar.Root>

            <RouterView />
            <div>Count is: {{ count }}</div>
            <motion.button
                class="bg-red-500"
                :while-hover="{ scale: 1.1 }"
                :while-press="{ scale: 0.95 }"
                :transition="{
                    ease: 'easeOut',
                    duration: 0.1
                }"
                @click="count++"
            >
                +1
            </motion.button>
            <motion.button
                class="bg-blue-500"
                :while-hover="{ scale: 1.1 }"
                :while-press="{ scale: 0.95 }"
                :transition="{
                    ease: 'easeOut',
                    duration: 0.1
                }"
                @click="count--"
            >
                -1
            </motion.button>
            <Check />
        </div>
    </IconoirProvider>
</template>
