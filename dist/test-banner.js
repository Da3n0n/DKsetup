"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const animator_js_1 = require("./installers/animator.js");
const gradient_string_1 = __importDefault(require("gradient-string"));
async function test() {
    const frames = (0, animator_js_1.getAnimationFrames)('ASCII Animations/ring aniamtion.html');
    console.clear();
    const bannerText = [
        "██████╗ ██╗  ██╗    ██████╗██╗     ██╗",
        "██╔══██╗██║ ██╔╝   ██╔════╝██║     ██║",
        "██║  ██║█████╔╝    ██║     ██║     ██║",
        "██║  ██║██╔═██╗    ██║     ██║     ██║",
        "██████╔╝██║  ██╗██╗╚██████╗███████╗██║",
        "╚═════╝ ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝╚═╝"
    ];
    if (frames.length > 0) {
        for (let i = 0; i < 40; i++) {
            const frameIdx = i % frames.length;
            const Math = global.Math;
            const frameLines = frames[frameIdx].split('\n');
            const height = Math.max(bannerText.length, frameLines.length);
            const combinedLines = [];
            for (let line = 0; line < height; line++) {
                const bLine = bannerText[line] || '';
                const fLine = frameLines[line] || '';
                combinedLines.push(bLine.padEnd(42, ' ') + fLine);
            }
            process.stdout.write('\x1b[0;0H');
            console.log(gradient_string_1.default.rainbow(combinedLines.join('\n')));
            await new Promise(r => setTimeout(r, 60));
        }
    }
    else {
        console.log("no frames");
    }
}
test();
