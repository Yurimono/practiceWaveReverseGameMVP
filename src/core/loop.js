import { Pipeline } from '../renderers/pipeline.js';
export const EngineLoop = {
    id: null,
    start() {
        const tick = (t) => { Pipeline.render(t); this.id = requestAnimationFrame(tick); };
        this.id = requestAnimationFrame(tick);
    },
    stop() { cancelAnimationFrame(this.id); }
};