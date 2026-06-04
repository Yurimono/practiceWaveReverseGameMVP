import { GameStore } from '../../store/game.js';
import { evaluate } from './evaluator.js';
import { TargetGenerator } from './generator.js';

export const MathController = {
    startRound() {
        GameStore.targetFunc = TargetGenerator.generate(GameStore.difficulty);
        GameStore.playerFunc = null;
        GameStore.prevPlayerFunc = null;
        GameStore.fadingFunc = null;
    },
    updateFunc(str) {
        const newF = evaluate(str);
        if (!newF) {
            if (GameStore.playerFunc) { 
                GameStore.fadingFunc = GameStore.playerFunc; 
                GameStore.fadeStart = performance.now(); 
            }
            GameStore.prevPlayerFunc = null; 
            GameStore.playerFunc = null;
            return;
        }
        GameStore.fadingFunc = null;
        GameStore.prevPlayerFunc = GameStore.playerFunc || newF;
        GameStore.playerFunc = newF;
        GameStore.lerpStart = performance.now();
    }
};