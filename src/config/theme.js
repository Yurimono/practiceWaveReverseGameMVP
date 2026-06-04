export const THEME = {
    colors: { 
        gridMinor: 'rgba(255,255,255,0.06)', 
        gridMajor: 'rgba(255,255,255,0.25)', 
        text: 'rgba(255,255,255,0.4)', 
        targetGraph: 'rgba(255,255,255,0.25)', 
        playerGraph: '#00ffcc', 
        snapPointBg: '#0a0a0b', 
        snapPointHover: 'rgba(10,10,11,0.9)', 
        guideLine: 'rgba(255,255,255,0.03)', 
        rectStroke: 'rgba(0,255,204,0.4)' 
    },

    dims: { 
        snapRadius: 6, 
        rectPadX: 12, 
        rectPadY: 28, 
        rectExtra: 16, 
        rectH: 28, 
        textOffX: 20, 
        textOffY: 14 
    },

    fonts: { 
        main: '14px monospace', 
        grid: '11px monospace' 
    },

    rendering: { 
        lerpDur: 400, 
        fadeDur: 500, 
        clearBuf: 50, 
        zoomFact: 1.1, 
        snapDist: 15,
        
        minPPU: 4,
        maxPPU: 150,
        
        baseLine: 3,
        glowBlur: 8
    },

    grid: {
        thresholds: [100, 50, 20, 8, 0],
        steps: [1, 2, 5, 10, 25]
    }
};