"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimationFrames = getAnimationFrames;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Extracts animation frames from the provided HTML/JS file dynamically.
 * @param filePath Path to the animation file
 * @returns Array of string frames
 */
function getAnimationFrames(filePath) {
    try {
        const fullPath = path_1.default.resolve(filePath);
        if (!fs_1.default.existsSync(fullPath)) {
            return [];
        }
        const content = fs_1.default.readFileSync(fullPath, 'utf8');
        const frames = [];
        // Simple string splitting to avoid regex ReDoS
        const parts = content.split('n[');
        for (let i = 1; i < parts.length; i++) {
            const p = parts[i];
            const startStr = "] = '";
            const startIdx = p.indexOf(startStr);
            if (startIdx > -1) {
                const body = p.substring(startIdx + startStr.length);
                const endIdx = body.indexOf("';");
                if (endIdx > -1) {
                    // Extract the string and replace literal \\n with actual newlines
                    let frame = body.substring(0, endIdx);
                    frame = frame.replace(/\\n/g, '\n');
                    // Add some spacing or trim if necessary, but keep original for now
                    frames.push(frame);
                }
            }
        }
        // Second pass: Crop the frames to the minimum bounding box
        let minLeadingSpaces = Infinity;
        let minTrailingSpaces = Infinity;
        let firstNonEmptyLine = Infinity;
        let lastNonEmptyLine = -1;
        const parsedFrames = frames.map(f => f.split('\n'));
        const frameHeight = parsedFrames[0]?.length || 0;
        for (const lines of parsedFrames) {
            for (let r = 0; r < lines.length; r++) {
                const line = lines[r];
                if (line.trim().length === 0)
                    continue;
                firstNonEmptyLine = Math.min(firstNonEmptyLine, r);
                lastNonEmptyLine = Math.max(lastNonEmptyLine, r);
                const leading = line.match(/^ */)?.[0].length || 0;
                const trailing = line.match(/ *$/)?.[0].length || 0;
                minLeadingSpaces = Math.min(minLeadingSpaces, leading);
                minTrailingSpaces = Math.min(minTrailingSpaces, trailing);
            }
        }
        const croppedFrames = [];
        for (const lines of parsedFrames) {
            const croppedLines = [];
            for (let r = firstNonEmptyLine; r <= lastNonEmptyLine; r++) {
                const line = lines[r] || '';
                // Remove the minimum leading spaces, and trim the end
                croppedLines.push(line.substring(Math.min(minLeadingSpaces, line.length)).trimEnd());
            }
            croppedFrames.push(croppedLines.join('\n'));
        }
        // User requested smaller size, re-adding downscaling to maximum 25x12
        const MAX_WIDTH = 25;
        const MAX_HEIGHT = 12;
        const scaledFrames = [];
        for (const frame of croppedFrames) {
            const lines = frame.split('\n');
            const height = lines.length;
            const width = Math.max(...lines.map(l => l.length));
            if (height > MAX_HEIGHT || width > MAX_WIDTH) {
                const scaleY = height / MAX_HEIGHT;
                const scaleX = width / MAX_WIDTH;
                const scale = Math.max(scaleX, scaleY);
                const newHeight = Math.floor(height / scale);
                const newWidth = Math.floor(width / scale);
                const scaledLines = [];
                for (let y = 0; y < newHeight; y++) {
                    let newLine = '';
                    for (let x = 0; x < newWidth; x++) {
                        const origY = Math.floor(y * scale);
                        const origX = Math.floor(x * scale);
                        const origChar = lines[origY]?.[origX] || ' ';
                        newLine += origChar;
                    }
                    scaledLines.push(newLine);
                }
                scaledFrames.push(scaledLines.join('\n'));
            }
            else {
                scaledFrames.push(frame);
            }
        }
        return scaledFrames;
    }
    catch (e) {
        console.error("Animator error:", e);
        return [];
    }
}
