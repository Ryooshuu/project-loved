import type { Meta, StoryObj } from "@storybook/vue3";
import { userEvent, within, expect } from "@storybook/test";

import TestComponent from "./index.vue";

const meta: Meta<typeof TestComponent> = {
    component: TestComponent
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => ({
        components: { TestComponent },
        template: "<TestComponent />"
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        await expect(canvas.getByText("Count is: 0")).toBeVisible();

        await userEvent.click(canvas.getByRole("button"));
        await userEvent.click(canvas.getByRole("button"));

        await expect(canvas.getByText("Count is: 2")).toBeVisible();

        await userEvent.pointer({ keys: "[MouseRight]", target: canvas.getByRole("button") });

        await expect(canvas.getByText("Count is: 1")).toBeVisible();
    }
};
