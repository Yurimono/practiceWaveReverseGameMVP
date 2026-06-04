import { dom } from './dom.js';
import { CameraStore } from '../store/camera.js';
import { PlayerStore } from '../store/player.js';
import { GameStore } from '../store/game.js';
import { THEME } from '../config/theme.js';
import { MathController } from '../engines/math/controller.js';
import { MATH_CFG } from '../config/math.js'; // Підключаємо конфіг

export function initInputs() {
    const evTarget = dom.mathCanvasGraph;
    if (!evTarget) return;

    window.addEventListener('resize', () => {
        if (dom.mathCanvasGrid && dom.mathCanvasGraph) {
            dom.mathCanvasGrid.width = dom.mathCanvasGraph.width = window.innerWidth;
            dom.mathCanvasGrid.height = dom.mathCanvasGraph.height = window.innerHeight;
        }
    });
    window.dispatchEvent(new Event('resize'));

    let isDragging = false;
    let startX = 0, startY = 0;

    evTarget.addEventListener('mousedown', e => {
        if (e.button === 0) {
            isDragging = true;
            startX = e.clientX - CameraStore.x;
            startY = e.clientY - CameraStore.y;
            evTarget.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', e => {
        const r = evTarget.getBoundingClientRect();
        const mouseX = e.clientX - r.left;
        const mouseY = e.clientY - r.top;

        const w2 = evTarget.width / 2;
        const h2 = evTarget.height / 2;

        if (isDragging) {
            CameraStore.x = e.clientX - startX;
            CameraStore.y = e.clientY - startY;
            CameraStore.applyLimits();
        }

        const mX = (mouseX - (w2 + CameraStore.x)) / CameraStore.ppu;
        const mY = ((h2 + CameraStore.y) - mouseY) / CameraStore.ppu;

        PlayerStore.rawX = mouseX;
        PlayerStore.rawY = mouseY;

        if (dom.globalCoordsEl) {
            dom.globalCoordsEl.innerText = `X: ${mX.toFixed(2)} | Y: ${mY.toFixed(2)}`;
        }

        PlayerStore.snapX = null;
        PlayerStore.snapY = null;

        const b = MATH_CFG.bounds;
        if (mX < -b || mX > b || mY < -b || mY > b) {
            return;
        }

        if (GameStore.playerFunc && GameStore.playerFunc.fn) {
            try {
                const func = GameStore.playerFunc.fn;
                const type = GameStore.playerFunc.type || 'y';

                if (type === 'y') {
                    const expectedY = func(mX);
                    if (isFinite(expectedY) && expectedY >= -b && expectedY <= b) {
                        const screenY = h2 + CameraStore.y - expectedY * CameraStore.ppu;
                        if (Math.abs(mouseY - screenY) < THEME.rendering.snapDist) {
                            PlayerStore.snapX = mX; PlayerStore.snapY = expectedY;
                        }
                    }
                } else {
                    const expectedX = func(mY);
                    if (isFinite(expectedX) && expectedX >= -b && expectedX <= b) {
                        const screenX = w2 + CameraStore.x + expectedX * CameraStore.ppu;
                        if (Math.abs(mouseX - screenX) < THEME.rendering.snapDist) {
                            PlayerStore.snapX = expectedX; PlayerStore.snapY = mY;
                        }
                    }
                }
            } catch (err) {}
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            evTarget.style.cursor = 'default';
        }
    });

    evTarget.addEventListener('wheel', e => {
        e.preventDefault();
        const r = evTarget.getBoundingClientRect();
        const mouseX = e.clientX - r.left;
        const mouseY = e.clientY - r.top;
        const w2 = evTarget.width / 2, h2 = evTarget.height / 2;
        const oldPpu = CameraStore.ppu;
        const mathX = (mouseX - (w2 + CameraStore.x)) / oldPpu;
        const mathY = ((h2 + CameraStore.y) - mouseY) / oldPpu;

        const z = THEME.rendering.zoomFact;
        CameraStore.ppu = e.deltaY < 0 ? oldPpu * z : oldPpu / z;
        CameraStore.applyLimits();

        CameraStore.x = mouseX - w2 - mathX * CameraStore.ppu;
        CameraStore.y = mouseY - h2 + mathY * CameraStore.ppu;
        CameraStore.applyLimits();
    });

    evTarget.addEventListener('mouseleave', () => {
        PlayerStore.rawX = PlayerStore.rawY = PlayerStore.snapX = PlayerStore.snapY = null;
        isDragging = false;
        evTarget.style.cursor = 'default';
        if (dom.globalCoordsEl) dom.globalCoordsEl.innerText = `X: 0.00 | Y: 0.00`;
    });

    if (dom.mathInput) {
        dom.mathInput.addEventListener('input', e => {
            MathController.updateFunc(e.target.value);
        });
    }
}