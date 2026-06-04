import { THEME } from '../../config/theme.js';
import { CameraStore } from '../../store/camera.js';
import { MATH_CFG } from '../../config/math.js';

export const GraphLayer = {
    draw(ctx, w, h, funcObj, color, glow, prevFuncObj = null, lerpT = 1, width = null, alpha = 1) {
        if (!funcObj || !funcObj.fn) return;

        const func = funcObj.fn;
        const type = funcObj.type || 'y';
        const { x: offX, y: offY, ppu } = CameraStore;
        const bounds = MATH_CFG.bounds;

        const cX = w / 2 + offX;
        const cY = h / 2 + offY;

        ctx.save();
        ctx.beginPath();
        ctx.rect(cX - bounds * ppu, cY - bounds * ppu, bounds * 2 * ppu, bounds * 2 * ppu);
        ctx.clip();

        ctx.lineWidth = width !== null ? width : THEME.rendering.baseLine;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;

        if (glow) {
            ctx.shadowBlur = THEME.rendering.glowBlur;
            ctx.shadowColor = color;
        }

        ctx.beginPath();

        const isY = type === 'y';
        const step = 0.5 / ppu; //
        const limit = bounds * 1.2;

        let first = true;
        let prevV = null;

        for (let mV = -bounds; mV <= bounds; mV += step) {
            try {
                let cVal = func(mV);
                if (!isFinite(cVal)) { first = true; continue; }

                if (prevV !== null && Math.abs(cVal - prevV) > bounds * 0.5 && Math.sign(cVal) !== Math.sign(prevV)) {

                    const anchor = Math.sign(prevV) * limit;
                    const pX = isY ? cX + (mV - step) * ppu : cX + anchor * ppu;
                    const pY = isY ? cY - anchor * ppu : cY - (mV - step) * ppu;
                    ctx.lineTo(pX, pY);
                    ctx.stroke();
                    ctx.beginPath();

                    const anchor2 = Math.sign(cVal) * limit;
                    const pX2 = isY ? cX + mV * ppu : cX + anchor2 * ppu;
                    const pY2 = isY ? cY - anchor2 * ppu : cY - mV * ppu;
                    ctx.moveTo(pX2, pY2);
                    first = false;
                }

                prevV = cVal;
                
                const pX = isY ? cX + mV * ppu : cX + cVal * ppu;
                const pY = isY ? cY - cVal * ppu : cY - mV * ppu;

                if (first) { ctx.moveTo(pX, pY); first = false; }
                else { ctx.lineTo(pX, pY); }

            } catch (e) { first = true; }
        }

        ctx.stroke();
        ctx.restore();
    }
};