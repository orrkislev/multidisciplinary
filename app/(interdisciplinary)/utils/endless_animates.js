export const lerp = (a, b, t) => a + t * (b - a);


export default function endlessAnimate(items) {
    return items.map(p => ({
        ...p,
        x: lerp(p.x, p.targetX, 0.1),
        y: lerp(p.y, p.targetY, 0.1)
    }));
}