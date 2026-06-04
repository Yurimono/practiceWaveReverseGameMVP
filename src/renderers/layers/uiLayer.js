import { THEME } from '../../config/theme.js';
import { CameraStore } from '../../store/camera.js';
import { PlayerStore } from '../../store/player.js';
export const UiLayer = {
    draw(ctx, w, h) {
        const { rawX, rawY, snapX, snapY, isDragging } = PlayerStore;
        if (rawX !== null && rawY !== null && !isDragging) {
            ctx.strokeStyle = THEME.colors.guideLine; ctx.lineWidth = 1; ctx.beginPath();
            ctx.moveTo(rawX, 0); ctx.lineTo(rawX, h); ctx.moveTo(0, rawY); ctx.lineTo(w, rawY); ctx.stroke();
        }
        if (snapX !== null && snapY !== null && !isDragging) {
            const px = w / 2 + CameraStore.x + snapX * CameraStore.ppu;
            const py = h / 2 + CameraStore.y - snapY * CameraStore.ppu;
            ctx.fillStyle = THEME.colors.snapPointBg; ctx.beginPath(); ctx.arc(px, py, THEME.dims.snapRadius, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = THEME.colors.playerGraph; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, THEME.dims.snapRadius, 0, Math.PI*2); ctx.stroke();
            
            const txt = `${snapX.toFixed(2)}, ${snapY.toFixed(2)}`;
            ctx.font = THEME.fonts.main; const tW = ctx.measureText(txt).width;
            ctx.fillStyle = THEME.colors.snapPointHover;
            ctx.fillRect(px + THEME.dims.rectPadX, py - THEME.dims.rectPadY, tW + THEME.dims.rectExtra, THEME.dims.rectH);
            ctx.strokeStyle = THEME.colors.rectStroke;
            ctx.strokeRect(px + THEME.dims.rectPadX, py - THEME.dims.rectPadY, tW + THEME.dims.rectExtra, THEME.dims.rectH);
            ctx.fillStyle = THEME.colors.playerGraph; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
            ctx.fillText(txt, px + THEME.dims.textOffX, py - THEME.dims.textOffY);
        }
    }
};