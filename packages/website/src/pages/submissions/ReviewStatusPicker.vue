<script setup lang="ts">
import { TaggedComboBox } from "@loved/ui";

const options = ["Reviewed", "Not reviewed", "Positive", "Neutral", "Negative"];
</script>

<template>
    <div class="flex flex-col gap-0.5">
        <p class="text-col-5">Review status</p>
        <TaggedComboBox
            :options="options"
        />
    </div>
</template>
