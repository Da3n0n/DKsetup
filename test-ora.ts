import ora from 'ora';
import { getAnimationFrames } from './installers/animator.js';

const frames = getAnimationFrames('ASCII Animations/ring aniamtion.html');

const spinner = ora({
    text: 'Installing...',
    spinner: {
        interval: 30,
        frames: frames
    }
}).start();

setTimeout(() => {
    spinner.succeed('Installed!');
}, 4000);
