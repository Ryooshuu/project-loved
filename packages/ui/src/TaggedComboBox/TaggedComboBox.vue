<script setup lang="ts" generic="T extends AcceptableInputValue">
import { Combobox, TagsInput } from "reka-ui/namespaced";
import { AcceptableInputValue, useFilter } from "reka-ui";
import { AnimatePresence, motion } from "motion-v";
import { NavArrowDown, Xmark } from "@iconoir/vue";

const { contains } = useFilter({ sensitivity: "base" });

const {
    options,
    label,
    getOptionKey = v => v as string,
    getOptionStyle = undefined
} = defineProps<{
    options: T[]
    label: string
    getOptionKey?: (value: T) => string
    getOptionStyle?: (value: T) => unknown
}>();

const model = defineModel<T[]>();
const query = ref("");

const dropdownOpen = ref(false);

const filteredOptions = computed(
    () => options.filter(o => contains(getOptionKey(o), query.value) && !model.value?.map(v => getOptionKey(v as T)).includes(getOptionKey(o)))
);

watch(model, () => {
    query.value = "";
}, { deep: true });
</script>

<template>
    <div class="flex flex-col gap-1">
        <p class="text-col-5">{{ label }}</p>
        <Combobox.Root
            v-model="model"
            v-model:open="dropdownOpen"
            multiple
            ignore-filter
            class="relative text-sm"
        >
            <Combobox.Anchor class="w-full flex p-1 surface-solid-1 rounded-md">
                <TagsInput.Root
                    v-model="model"
                    delimiter=""
                    :display-value="v => getOptionKey(v as T)"
                    class="flex gap-2 flex-wrap w-full"
                >
                    <TagsInput.Item
                        v-for="(item, idx) in model"
                        :key="idx"
                        :value="item"
                        class="flex gap-1 rounded-md px-1.5 text-col-6 surface-solid-3 border-2 border-transparent transition-colors aria-[current=true]:border-surface-4 font-semibold"
                        :style="getOptionStyle?.(item as T) ?? {}"
                    >
                        <TagsInput.ItemText />
                        <TagsInput.ItemDelete class="cursor-pointer">
                            <Xmark class="h-4 w-4" />
                        </TagsInput.ItemDelete>
                    </TagsInput.Item>

                    <Combobox.Input
                        v-model="query"
                        as-child
                    >
                        <TagsInput.Input
                            placeholder="Search..."
                            class="focus:outline-none flex-1 px-1 placeholder:text-col-4"
                            @keydown.enter.prevent
                        />
                    </Combobox.Input>
                </TagsInput.Root>

                <Combobox.Trigger>
                    <motion.div
                        layout
                        :animate="{
                            rotate: dropdownOpen ? 180 : 0
                        }"
                        :transition="{
                            type: 'spring',
                            visualDuration: 0.3,
                            bounce: 0.4
                        }"
                    >
                        <NavArrowDown
                            class="h-4 w-4 text-col-5"
                        />
                    </motion.div>
                </Combobox.Trigger>
            </Combobox.Anchor>

            <Combobox.Portal>
                <AnimatePresence>
                    <Combobox.Content as-child position="popper" class="z-10 w-[260px] mt-2 rounded-md surface-solid-1 shadow-md overflow-hidden">
                        <motion.div
                            animate="show"
                            exit="hidden"
                            initial="hidden"
                            :variants="{
                                hidden: { height: 0, y: -5, opacity: 0 },
                                show: { height: 'auto', y: 0, opacity: 1 }
                            }"
                            :transition="{
                                type: 'spring',
                                visualDuration: 0.3,
                                bounce: 0.4
                            }"
                        >
                            <Combobox.Viewport class="p-1.5">
                                <Combobox.Group>
                                    <Combobox.Item
                                        v-for="(option, idx) in filteredOptions"
                                        :key="idx"
                                        :value="option"
                                        class="flex gap-2 p-1.5 rounded-md hover:surface-1 transition-colors cursor-pointer data-[disabled]:text-col-4 data-[disabled]:pointer-events-none data-[highlighted]:surface-1"
                                    >
                                        <span class="text-sm">{{ getOptionKey(option as T) }}</span>
                                    </Combobox.Item>
                                </Combobox.Group>
                            </Combobox.Viewport>
                        </motion.div>
                    </Combobox.Content>
                </AnimatePresence>
            </Combobox.Portal>
        </Combobox.Root>
    </div>
</template>
