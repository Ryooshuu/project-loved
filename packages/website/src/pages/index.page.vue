<script setup lang="ts">
import { BorderedBox } from "@loved/ui";
import SubmissionsFilters from "./submissions/SubmissionsFilters.vue";

</script>

<template>
    <div class="flex flex-[1] justify-center">
        <BorderedBox
            align="bottom"
            color="hsla(333, 46%, 70%, 8%)"
            gradient-type="linear"
            class="w-[98%] max-w-[1250px] h-[800px] surface-bg rounded-md shadow-md p-5 flex flex-row"
        >
            <SubmissionsFilters />
        </BorderedBox>
    </div>
</template>
