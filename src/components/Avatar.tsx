import { useMemo } from 'react';
import { avatarById, colorFor, spriteRows } from '../avatars';

interface Props {
  id: string;
  skinTone?: number;
  hairColor?: number;
  size?: number;
}

export function Avatar({ id, skinTone = 0, hairColor = 0, size = 64 }: Props) {
  const def = avatarById(id);
  const rects = useMemo(() => {
    const out: { x: number; y: number; fill: string }[] = [];
    spriteRows(def).forEach((row, y) =>
      [...row].forEach((ch, x) => {
        const fill = colorFor(ch, skinTone, hairColor);
        if (fill) out.push({ x, y, fill });
      }),
    );
    return out;
  }, [def, skinTone, hairColor]);

  return (
    <svg
      className="avatar"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role="img"
      aria-label={def.name}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={1.02} height={1.02} fill={r.fill} />
      ))}
    </svg>
  );
}
