export const GameStore = { 
    targetFunc: { fn: (x) => Math.sin(x), type: 'y', expr: 'sin(x)' }, 
    playerFunc: null, 
    prevPlayerFunc: null, 
    fadingFunc: null, 
    lerpStart: 0, 
    fadeStart: 0, 
    activeMode: null,
    difficulty: 'medium'
};