const COLS = 6;
const ROWS = 7;
const CELL_W = 100 / COLS;
const CELL_H = 100 / ROWS;
const GUTTER = 1.4;

const AVENUES_V = [CELL_W * 2, CELL_W * 4.5];
const AVENUES_H = [CELL_H * 2.5, CELL_H * 5];

export default function StreetGrid() {
  const blocks = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      blocks.push(
        <rect
          key={`${r}-${c}`}
          x={c * CELL_W + GUTTER}
          y={r * CELL_H + GUTTER}
          width={CELL_W - GUTTER * 2}
          height={CELL_H - GUTTER * 2}
          fill="#e9e3d5"
        />
      );
    }
  }

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <rect x={0} y={0} width={100} height={100} fill="#f2eee6" />
      {blocks}
      {AVENUES_V.map((x) => (
        <rect key={`av-${x}`} x={x - 0.5} y={0} width={1} height={100} fill="#cfc6b3" />
      ))}
      {AVENUES_H.map((y) => (
        <rect key={`ah-${y}`} x={0} y={y - 0.5} width={100} height={1} fill="#cfc6b3" />
      ))}
    </svg>
  );
}
