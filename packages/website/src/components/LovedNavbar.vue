<script setup lang="ts">
import { UserLove } from "@iconoir/vue";
import { Navbar } from "@loved/ui";

const isAdmin = ref(false);
</script>

<template>
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
            v-if="isAdmin"
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
</template>
