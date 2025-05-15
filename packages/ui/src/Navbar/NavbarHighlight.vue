<script setup lang="ts">
import { useRafFn } from "@vueuse/core";
import Paper from "paper";
import { PaperRoundCorners } from "paperjs-round-corners";

const { logo, logoInset } = defineProps<{
    logo: HTMLDivElement | null
    logoInset: {
        left: number
        top: number
        bottom: number
    }
}>();

const paperCanvas = useTemplateRef("paperCanvas");
const sizeRef = useTemplateRef("sizeRef");

useRafFn(updateCanvas);

function updateCanvas() {
    if (!paperCanvas.value)
        return;

    const canvas = paperCanvas.value;
    canvas.style.width = `${sizeRef.value!.clientWidth}px`;
    const selfBounding = canvas.getBoundingClientRect();

    Paper.setup(paperCanvas.value!);
    Paper.view.autoUpdate = false;

    const topPath = new Paper.Path();
    const group = new Paper.CompoundPath({
        children: [topPath],
        // selected: true,
        strokeColor: new Paper.Color(1, 1, 1, 0.5),
        strokeWidth: 2
    });

    const logoBounding = logo!.getBoundingClientRect();
    const topLineWidth = logoBounding.width + logoBounding.left - logoInset.left;

    const topLineYPosition = 15;
    const bottomLineYPosition = 60;
    const strikeThroughDistance = bottomLineYPosition - topLineYPosition;

    topPath.add(
        new Paper.Point(0, topLineYPosition),
        new Paper.Point(topLineWidth - strikeThroughDistance / 2, topLineYPosition),
        new Paper.Point((topLineWidth + strikeThroughDistance / 2) - logoInset.top, bottomLineYPosition - logoInset.top)
    );
    PaperRoundCorners.round(topPath.segments[1]!, 5);
    topPath.translate(new Paper.Point(-selfBounding.x, 0));

    const bottomPath = new Paper.Path();
    group.addChild(bottomPath);

    const lightBar = document.getElementById("navbar-item") as HTMLSpanElement;
    const lightBarBounding = lightBar.getBoundingClientRect();
    let bottomLineXPosition = lightBarBounding.left - 4;
    if (bottomLineXPosition < (topLineWidth + strikeThroughDistance / 2)) {
        bottomLineXPosition = (topLineWidth + strikeThroughDistance / 2);
    }
    bottomPath.add(
        new Paper.Point((topLineWidth + strikeThroughDistance / 2) - logoInset.bottom, bottomLineYPosition - logoInset.bottom),
        new Paper.Point((topLineWidth + strikeThroughDistance / 2), bottomLineYPosition),
        new Paper.Point(bottomLineXPosition, bottomLineYPosition)
    );
    bottomPath.translate(new Paper.Point(-selfBounding.x, 0));
    PaperRoundCorners.round(bottomPath.segments[1]!, 5);

    const remainingPath = new Paper.Path();
    group.addChild(remainingPath);
    remainingPath.strokeColor = new Paper.Color(1, 0, 0, 0.5);
    let remainingPathXPosition = lightBarBounding.left + lightBarBounding.width + 4;

    if (remainingPathXPosition < (topLineWidth + strikeThroughDistance / 2)) {
        remainingPathXPosition = (topLineWidth + strikeThroughDistance / 2);
    }

    remainingPath.add(
        new Paper.Point(remainingPathXPosition, bottomLineYPosition),
        new Paper.Point(remainingPathXPosition + selfBounding.width, bottomLineYPosition)
    );
    remainingPath.translate(new Paper.Point(-selfBounding.x, 0));

    Paper.view.update();
}
</script>

<template>
    <canvas ref="paperCanvas" class="absolute inset-0 -ml-2 -mt-2 w-[calc(100%+2em)] h-20 pointer-events-none -z-10 opacity-100" />
    <div ref="sizeRef" class="absolute inset-0 -ml-2 -mt-2 w-[calc(100%+2em)] h-20 pointer-events-none" />
</template>
