import { THEME } from '../config/theme.js';
import { MATH_CFG } from '../config/math.js';

export const CameraStore = {
    x: 0,
    y: 0,
    ppu: 40,

    reset() {
        this.x = 0;
        this.y = 0;
        this.ppu = 40;
    },

    applyLimits() {
        this.ppu = Math.max(THEME.rendering.minPPU, Math.min(THEME.rendering.maxPPU, this.ppu));

        const maxCenterMath = MATH_CFG.bounds * 1.2;
        
        let currentCenterMathX = -this.x / this.ppu;
        let currentCenterMathY = this.y / this.ppu;

        currentCenterMathX = Math.max(-maxCenterMath, Math.min(maxCenterMath, currentCenterMathX));
        currentCenterMathY = Math.max(-maxCenterMath, Math.min(maxCenterMath, currentCenterMathY));

        this.x = -currentCenterMathX * this.ppu;
        this.y = currentCenterMathY * this.ppu;
    }
};