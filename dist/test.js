"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const animator_js_1 = require("./installers/animator.js");
const frames = (0, animator_js_1.getAnimationFrames)('ASCII Animations/ring aniamtion.html');
console.log(frames[0]);
