import { tokenize } from './tokenizer.js';

export function evaluate(str) {
    if (!str || !str.trim()) return null;
    try {
        const { expr, type } = tokenize(str);
        if (!expr) return null;

        const compiled = math.compile(expr);
        const varName = type === 'x' ? 'y' : 'x';

        const scope = { e: Math.E, pi: Math.PI, [varName]: 0 };

        const probes = [0, 1, -1, 0.5, Math.PI / 4];
        const works = probes.some(v => {
            try {
                scope[varName] = v;
                return isFinite(compiled.evaluate(scope));
            } catch { return false; }
        });
        if (!works) return null;

        const fn = (val) => {
            scope[varName] = val;
            return compiled.evaluate(scope);
        };

        return { fn, type, expr };
    } catch {
        return null;
    }
}