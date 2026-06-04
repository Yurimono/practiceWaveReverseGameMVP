import { dom } from './dom.js';
import { EngineLoop } from '../core/loop.js';
import { Scorer } from '../core/scorer.js';
import { GameStore } from '../store/game.js';
import { CameraStore } from '../store/camera.js';
import { PlayerStore } from '../store/player.js';
import { MathController } from '../engines/math/controller.js';
import { initInputs } from './inputs.js';

export function initRouter() {
    initInputs();
    const nav = (show) => { [dom.screenHub, dom.screenMath, dom.screenAudio, dom.screenScore].forEach(s => s.classList.add('hidden')); show.classList.remove('hidden'); };
    
    dom.btnMathMode.addEventListener('click', () => { 
        GameStore.activeMode = 'MATH';
        GameStore.difficulty = dom.mathDifficulty.value;
        CameraStore.reset();
        MathController.startRound();
        nav(dom.screenMath); 
        EngineLoop.start(); 
    });
    
    dom.btnBackMath.addEventListener('click', () => { nav(dom.screenHub); EngineLoop.stop(); });
    
    dom.btnSubmitMath.addEventListener('click', () => {
        EngineLoop.stop();
        const score = Scorer.calc(GameStore.targetFunc, GameStore.playerFunc);
        dom.scoreDisplay.innerText = score.toFixed(2);
        nav(dom.screenScore);
        
        CameraStore.reset();
        PlayerStore.rawX = PlayerStore.rawY = null;
        dom.mathInput.value = '';
    });
    
    dom.btnScoreMenu.addEventListener('click', () => nav(dom.screenHub));
    
    dom.btnScoreRetry.addEventListener('click', () => {
        CameraStore.reset();
        MathController.startRound();
        nav(dom.screenMath);
        EngineLoop.start();
    });

    if (dom.btnCenterCamera) {
        dom.btnCenterCamera.addEventListener('click', () => {
            CameraStore.reset();
        });
    }
}