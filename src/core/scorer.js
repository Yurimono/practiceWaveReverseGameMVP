import { SCORE_CFG } from '../config/scoring.js';
import { CameraStore } from '../store/camera.js';
import { dom } from '../ui/dom.js';

const PIXEL_RADIUS = 40;
const PIXEL_RADIUS_SQ = PIXEL_RADIUS * PIXEL_RADIUS;

const SAMPLE_STEP = 2;

function buildScreenPoints(fn, type, cX, cY, ppu, w, h) {
    const isY = type === 'y';
    const limit = isY ? w : h;
    const points = [];

    for (let p = 0; p <= limit; p += SAMPLE_STEP) {
        const mathVar = isY ? (p - cX) / ppu : (cY - p) / ppu;
        try {
            const val = fn(mathVar);
            if (!isFinite(val)) continue;
            const scr = isY ? cY - val * ppu : cX + val * ppu;
            if (scr < -h || scr > h * 2) continue;
            points.push(isY ? [p, scr] : [scr, p]);
        } catch {  }
    }
    return points;
}

export const Scorer = {
    calc(targetObj, playerObj) {
        if (!playerObj || targetObj.type !== playerObj.type) return 0;

        const w = dom.mathCanvasGraph.width;
        const h = dom.mathCanvasGraph.height;
        const { x: offX, y: offY, ppu } = CameraStore;
        const cX = w / 2 + offX;
        const cY = h / 2 + offY;

        const targetPts = buildScreenPoints(targetObj.fn, targetObj.type, cX, cY, ppu, w, h);
        const playerPts = buildScreenPoints(playerObj.fn, playerObj.type, cX, cY, ppu, w, h);

        if (targetPts.length === 0 || playerPts.length === 0) return 0;

        let scoreSum = 0;
        const window = PIXEL_RADIUS;

        for (let i = 0; i < playerPts.length; i++) {
            const [px, py] = playerPts[i];

            const primary = targetObj.type === 'y' ? px : py;

            let lo = 0, hi = targetPts.length - 1;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                const tPrimary = targetObj.type === 'y' ? targetPts[mid][0] : targetPts[mid][1];
                if (tPrimary < primary - window) lo = mid + 1;
                else hi = mid;
            }

            let minDistSq = PIXEL_RADIUS_SQ + 1;

            for (let j = lo; j < targetPts.length; j++) {
                const [tx, ty] = targetPts[j];
                const tPrimary = targetObj.type === 'y' ? tx : ty;
                if (tPrimary > primary + window) break;

                const dx = px - tx, dy = py - ty;
                const dSq = dx * dx + dy * dy;
                if (dSq < minDistSq) minDistSq = dSq;
            }

            if (minDistSq <= PIXEL_RADIUS_SQ) {
                scoreSum += 1 - Math.sqrt(minDistSq) / PIXEL_RADIUS;
            }
        }

        return (scoreSum / playerPts.length) * SCORE_CFG.maxScore;
    }
};