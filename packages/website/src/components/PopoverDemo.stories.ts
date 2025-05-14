import type { Meta, StoryObj } from "@storybook/vue3";

import PopoverDemo from "./PopoverDemo.vue";

const meta: Meta<typeof PopoverDemo> = {
    component: PopoverDemo
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => ({
        components: { PopoverDemo },
        template: "<PopoverDemo />"
    })
};
