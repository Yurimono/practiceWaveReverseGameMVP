import { MATH_CFG } from '../../config/math.js';

const SORTED_ALIASES = Object.keys(MATH_CFG.aliases).sort((a, b) => b.length - a.length);

const ALL_FUNCS = [...new Set([
    ...MATH_CFG.functions,
    ...Object.values(MATH_CFG.aliases)
])].sort((a, b) => b.length - a.length);

export function tokenize(str) {
    let type = 'y';
    let p = str.trim().toLowerCase();

    if (/^x\s*=/.test(p)) {
        type = 'x';
        p = p.replace(/^x\s*=\s*/, '');
    } else {
        p = p.replace(/^(?:y\s*=\s*|f\(x\)\s*=\s*)/, '');
    }

    for (const alias of SORTED_ALIASES) {
        const canonical = MATH_CFG.aliases[alias];
        p = p.replace(new RegExp(`\\b${alias}\\b`, 'g'), canonical);
    }

    const funcPattern = ALL_FUNCS.join('|');
    p = p.replace(new RegExp(`(\\d)(${funcPattern})`, 'g'), '$1*$2');

    p = p.replace(/(\d)([a-df-wyz])/g, '$1*$2');

    p = p.replace(new RegExp(`\\)(${funcPattern})`, 'g'), ')*$1');
    p = p.replace(/\)(\d)/g, ')*$1');
    p = p.replace(/\)([a-df-wyz])/g, ')*$1');

    const funcRe = new RegExp(`\\b(${funcPattern})\\s*(?!\\()([^+\\-*/^(),\\s][^+\\-*/^(),]*)`, 'g');
    p = p.replace(funcRe, (_, fn, arg) => `${fn}(${arg})`);

    p = p.replace(/\|([^|]+)\|/g, 'abs($1)');

    return { expr: p, type };
}