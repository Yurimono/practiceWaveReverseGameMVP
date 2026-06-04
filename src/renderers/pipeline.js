import { dom } from '../ui/dom.js';
import { GridLayer } from './layers/gridLayer.js';
import { GraphLayer } from './layers/graphLayer.js';
import { UiLayer } from './layers/uiLayer.js';
import { GameStore } from '../store/game.js';
import { THEME } from '../config/theme.js';

export const Pipeline = {
    render(time) {
        const ctxGrid = dom.mathCanvasGrid.getContext('2d'), ctxGraph = dom.mathCanvasGraph.getContext('2d');
        const w = dom.mathCanvasGraph.width, h = dom.mathCanvasGraph.height, b = THEME.rendering.clearBuf;
        
        ctxGraph.clearRect(-b, -b, w + b*2, h + b*2);
        ctxGrid.clearRect(0, 0, w, h); 
        
        GridLayer.draw(ctxGrid, w, h);
        GraphLayer.draw(ctxGraph, w, h, GameStore.targetFunc, THEME.colors.targetGraph, false);
        
        if (GameStore.fadingFunc) {
            let fT = (time - GameStore.fadeStart) / THEME.rendering.fadeDur;
            if (fT >= 1) GameStore.fadingFunc = null;
            else GraphLayer.draw(ctxGraph, w, h, GameStore.fadingFunc, THEME.colors.playerGraph, true, null, 1, Math.max(0, THEME.rendering.baseLine*(1-fT)), Math.max(0, 1-fT));
        }
        if (GameStore.playerFunc) {
            let t = Math.min((time - GameStore.lerpStart) / THEME.rendering.lerpDur, 1);
            GraphLayer.draw(ctxGraph, w, h, GameStore.playerFunc, THEME.colors.playerGraph, true, GameStore.prevPlayerFunc, isNaN(t)?1:t);
        }
        UiLayer.draw(ctxGraph, w, h);
    }
};