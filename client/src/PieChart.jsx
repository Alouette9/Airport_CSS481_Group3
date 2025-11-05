export function PieChart({ items, size = 160}) {
        const cx = size / 2;
        const cy = size / 2;
        const r = size / 2;

        const total = items.reduce((s, it) => s + Math.max(0, it.value), 0) || 1;

        let cumulative = 0;

        function polarToCartesian(cx, cy, r, angleDeg) {
            const angleRad = (angleDeg - 90) * Math.PI / 180.0;
            return { x: cx + (r * Math.cos(angleRad)), y: cy + (r * Math.sin(angleRad)) };
        }

        function describeArc(cx, cy, r, startAngle, endAngle) {
            const start = polarToCartesian(cx, cy, r, endAngle);
            const end = polarToCartesian(cx, cy, r, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
            return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
        }

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {items.map((it, idx) => {
                    const start = (cumulative / total) * 360;
                    cumulative += Math.max(0, it.value);
                    const end = (cumulative / total) * 360;
                    const path = describeArc(cx, cy, r, start, end);
                    return <path key={idx} d={path} fill={it.color || '#888'} stroke="#fff" strokeWidth={1} />;
                })}
            </svg>
        );
    }