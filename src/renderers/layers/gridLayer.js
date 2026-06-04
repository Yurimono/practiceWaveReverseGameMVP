import { THEME } from '../../config/theme.js';
import { CameraStore } from '../../store/camera.js';
import { MATH_CFG } from '../../config/math.js';

export const GridLayer = {
    draw(ctx, w, h) {
        const { x: offX, y: offY, ppu } = CameraStore;
        const cX = w / 2 + offX;
        const cY = h / 2 + offY;
        const bounds = MATH_CFG.bounds;

        const leftPx = cX - bounds * ppu;
        const rightPx = cX + bounds * ppu;
        const topPx = cY - bounds * ppu;
        const bottomPx = cY + bounds * ppu;

        ctx.fillStyle = '#09090b';
        ctx.fillRect(leftPx, topPx, rightPx - leftPx, bottomPx - topPx);

        ctx.strokeStyle = THEME.colors.rectStroke;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(leftPx, topPx, rightPx - leftPx, bottomPx - topPx);

        let step = THEME.grid.steps[4];
        const [t, s] = [THEME.grid.thresholds, THEME.grid.steps];
        if (ppu > t[0]) step = s[0];
        else if (ppu > t[1]) step = s[1];
        else if (ppu > t[2]) step = s[2];
        else if (ppu > t[3]) step = s[3];

        ctx.strokeStyle = THEME.colors.gridMinor;
        ctx.lineWidth = 1;
        ctx.beginPath();

        let startValue = Math.ceil(-bounds / step) * step;

        for (let mX = startValue; mX <= bounds; mX += step) {
            if (Math.abs(mX) < 0.001) continue;
            const px = cX + mX * ppu;
            ctx.moveTo(px, topPx);
            ctx.lineTo(px, bottomPx);
        }
        for (let mY = startValue; mY <= bounds; mY += step) {
            if (Math.abs(mY) < 0.001) continue;
            const py = cY - mY * ppu;
            ctx.moveTo(leftPx, py);
            ctx.lineTo(rightPx, py);
        }
        ctx.stroke();

        ctx.strokeStyle = THEME.colors.gridMajor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (cX >= leftPx && cX <= rightPx) {
            ctx.moveTo(cX, topPx); ctx.lineTo(cX, bottomPx);
        }
        if (cY >= topPx && cY <= bottomPx) {
            ctx.moveTo(leftPx, cY); ctx.lineTo(rightPx, cY);
        }
        ctx.stroke();

        ctx.fillStyle = THEME.colors.text;
        ctx.font = THEME.fonts.grid;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        for (let mX = startValue; mX <= bounds; mX += step * 2) {
            if (Math.abs(mX) < 0.001) continue;
            const px = cX + mX * ppu;
            if (px >= leftPx && px <= rightPx && cY >= topPx && cY <= bottomPx) {
                ctx.fillText(mX.toString(), px, Math.min(bottomPx - 15, Math.max(topPx + 5, cY + 6)));
            }
        }

        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        for (let mY = startValue; mY <= bounds; mY += step * 2) {
            if (Math.abs(mY) < 0.001) continue;
            const py = cY - mY * ppu;
            if (py >= topPx && py <= bottomPx && cX >= leftPx && cX <= rightPx) {
                ctx.fillText(mY.toString(), Math.min(rightPx - 6, Math.max(leftPx + 20, cX - 6)), py);
            }
        }
    }
};