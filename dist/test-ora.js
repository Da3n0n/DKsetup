"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ora_1 = __importDefault(require("ora"));
const animator_js_1 = require("./installers/animator.js");
const frames = (0, animator_js_1.getAnimationFrames)('ASCII Animations/ring aniamtion.html');
const spinner = (0, ora_1.default)({
    text: 'Installing...',
    spinner: {
        interval: 30,
        frames: frames
    }
}).start();
setTimeout(() => {
    spinner.succeed('Installed!');
}, 4000);
