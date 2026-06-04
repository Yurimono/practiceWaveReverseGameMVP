export const MATH_CFG = {
    bounds: 100,

    functions: [
        'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 
        'asin', 'acos', 'atan', 'acot', 'asec', 'acsc',
        'log', 'ln', 'log10', 'lg',
        'abs', 'exp', 
        'sqrt', 'cbrt', 'pow',
        'tg', 'ctg', 'arcsin', 'arccos', 'arctan', 'arctg', 'arcctg'
    ],
    aliases: { 
        'tg':     'tan', 
        'ctg':    'cot', 
        'lg':     'log10',
        'ln':     'log',
        'arcsin': 'asin', 
        'arccos': 'acos', 
        'arctan': 'atan', 
        'arctg':  'atan', 
        'arcctg': 'acot'
    },

    difficulty: {
        easy: {
            allowedFuncs: ['x', 'abs', 'sqrt', 'x^2'], 
            maxTerms: 1, 
            coefRange: [1, 5],
            chanceInnerCoef: 0,
            chanceOffset: 0.3
        },
        medium: {
            allowedFuncs: ['x', 'sin', 'cos', 'abs', 'x^2', 'sqrt'], 
            maxTerms: 2, 
            coefRange: [1, 8], 
            chanceInnerCoef: 0.5,
            chanceOffset: 0.5
        },
        hard: {
            allowedFuncs: ['x', 'sin', 'cos', 'tan', 'abs', 'x^2', 'x^3', 'sqrt', 'log'], 
            maxTerms: 3, 
            coefRange: [1, 12], 
            chanceInnerCoef: 0.7,
            chanceOffset: 0.7
        }
    }
};