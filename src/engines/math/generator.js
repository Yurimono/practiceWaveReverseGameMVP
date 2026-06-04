import { MATH_CFG } from '../../config/math.js';
import { evaluate } from './evaluator.js';

function rInt(min, max) {
    const val = Math.floor(Math.random() * (Math.max(Math.abs(min), Math.abs(max)) + 1));
    return Math.random() > 0.5 ? val : -val;
}

export const TargetGenerator = {
    generate(level) {
        const rules = MATH_CFG.difficulty[level] || MATH_CFG.difficulty.medium;
        const termsCount = Math.floor(Math.random() * rules.maxTerms) + 1;
        let terms = [];

        for (let i = 0; i < termsCount; i++) {
            const func = rules.allowedFuncs[Math.floor(Math.random() * rules.allowedFuncs.length)];
            
            let A = rInt(rules.coefRange[0], rules.coefRange[1]);
            if (A === 0) A = 1;
            
            let B = Math.random() < rules.chanceInnerCoef ? rInt(rules.coefRange[0], rules.coefRange[1]) : 1;
            if (B === 0) B = 1;
            
            let strB = B === 1 ? 'x' : B === -1 ? '-x' : `${B}x`;
            let termStr = '';

            if (func === 'x') {
                termStr = `${A}*x`;
            } else if (func === 'x^2') {
                termStr = `${A}*(${strB})^2`;
            } else {
                termStr = `${A}*${func}(${strB})`;
            }
            terms.push(termStr);
        }

        let finalExpr = terms.join(' + ').replace(/\+ -/g, '- ');
        
        if (Math.random() < rules.chanceOffset) {
            const offset = rInt(rules.coefRange[0], rules.coefRange[1]);
            finalExpr += offset >= 0 ? ` + ${offset}` : ` - ${Math.abs(offset)}`;
        }

        const funcObj = evaluate(`y = ${finalExpr}`);
        return { fn: funcObj.fn, type: 'y', expr: finalExpr };
    }
};