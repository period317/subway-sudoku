import { useRef, useState, useEffect } from 'react';
import { NODE, SCHEMATIC_LINES, TRANSFER_NODES } from '../data/mapDataSchematic';

// 역 배열 → SVG polyline points 문자열 (스키매틱 좌표 직접 사용)
function pathToPoints(keys) {
  return keys
    .filter(k => NODE[k])
    .map(k => NODE[k].join(','))
    .join(' ');
}

export default function SubwayMap({ onLineSelect, selectedLineId }) {
  const svgRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  // 초기 뷰: 서울 시내 중심 기준 (스키매틱 좌표 기반)
  // 노선도 핵심 구간: x 250~760, y 280~660
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 120;
    const targetW = 760 - 250; // 510
    const targetH = 660 - 280; // 380
    const scale = Math.min(vw / targetW, vh / targetH) * 0.82;
    const centerX = (250 + 760) / 2; // 505
    const centerY = (280 + 660) / 2; // 470
    const x = vw / 2 - centerX * scale;
    const y = vh / 2 - centerY * scale;
    setTransform({ x, y, scale });
  }, []);

  // 마우스 드래그
  const onMouseDown = (e) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: transform.x, oy: transform.y };
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setTransform(t => ({ ...t, x: dragRef.current.ox + dx, y: dragRef.current.oy + dy }));
  };
  const onMouseUp = () => { dragRef.current = null; };

  // 마우스 휠 줌
  const onWheel = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.88;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    setTransform(t => {
      const newScale = Math.min(Math.max(t.scale * factor, 0.3), 8);
      const ratio = newScale / t.scale;
      return {
        scale: newScale,
        x: cx - ratio * (cx - t.x),
        y: cy - ratio * (cy - t.y),
      };
    });
  };

  // 터치 이벤트
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        ox: transform.x,
        oy: transform.y,
      };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = {
        dist: Math.hypot(dx, dy),
        scale: transform.scale,
        ox: transform.x,
        oy: transform.y,
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      dragRef.current = null;
    }
  };

  const onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragRef.current) {
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setTransform(t => ({ ...t, x: dragRef.current.ox + dx, y: dragRef.current.oy + dy }));
    } else if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / pinchRef.current.dist;
      const newScale = Math.min(Math.max(pinchRef.current.scale * factor, 0.3), 8);
      const ratio = newScale / pinchRef.current.scale;
      const { cx, cy, ox, oy } = pinchRef.current;
      setTransform({
        scale: newScale,
        x: cx - ratio * (cx - ox),
        y: cy - ratio * (cy - oy),
      });
    }
  };

  const onTouchEnd = () => { dragRef.current = null; pinchRef.current = null; };

  return (
    <div
      className="subway-map-container"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ cursor: 'grab', touchAction: 'none' }}
      >
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.scale})`}>

          {/* 호선 경로 */}
          {SCHEMATIC_LINES.map(line =>
            line.paths.map((path, pi) => {
              const pts = pathToPoints(path);
              if (!pts) return null;
              const isSelected = selectedLineId === line.id;
              return (
                <polyline
                  key={`${line.id}-${pi}`}
                  points={pts}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={isSelected ? line.width + 3 : line.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={selectedLineId && !isSelected ? 0.25 : 1}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s, stroke-width 0.2s' }}
                  onClick={() => onLineSelect(line)}
                />
              );
            })
          )}

          {/* 환승역 마커 */}
          {TRANSFER_NODES.map(s => {
            if (!NODE[s.key]) return null;
            const [x, y] = NODE[s.key];
            return (
              <g key={s.key}>
                <circle cx={x} cy={y} r={6} fill="white" stroke="#666" strokeWidth={1.5} />
                {transform.scale > 0.9 && (
                  <text
                    x={x + 9}
                    y={y + 4}
                    fontSize={9}
                    fill="#333"
                    fontWeight="600"
                    fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {s.label.split('\n').map((line, i) => (
                      <tspan key={i} x={x + 9} dy={i === 0 ? 0 : 11}>{line}</tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          })}

          {/* 문래역 홈 마커 🏠 */}
          {NODE['문래'] && (() => {
            const [x, y] = NODE['문래'];
            return (
              <g>
                <circle cx={x} cy={y} r={11} fill="#00A84D" opacity={0.25} />
                <circle cx={x} cy={y} r={7} fill="#00A84D" />
                {transform.scale > 0.7 && (
                  <text
                    x={x + 10}
                    y={y + 4}
                    fontSize={9}
                    fill="#00A84D"
                    fontWeight="800"
                    fontFamily="'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif"
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    문래 🏠
                  </text>
                )}
              </g>
            );
          })()}

        </g>
      </svg>

      {/* 호선 범례 */}
      <div className="map-legend">
        {SCHEMATIC_LINES.map(line => (
          <button
            key={line.id}
            className={`legend-btn ${selectedLineId === line.id ? 'active' : ''}`}
            style={{
              '--line-color': line.color,
              opacity: selectedLineId && selectedLineId !== line.id ? 0.4 : 1,
            }}
            onClick={() => onLineSelect(line)}
          >
            {line.name}
          </button>
        ))}
      </div>
    </div>
  );
}
