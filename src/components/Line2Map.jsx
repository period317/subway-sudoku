import { useState, useRef, useCallback, useEffect } from 'react';
import { LINE2_STATIONS } from '../data/line2Stations';

const G = '#00A84D';

/* ── 순환선 43개 (name 기준) ── */
const LOOP = [
  '시청','을지로입구','을지로3가','을지로4가','동대문역사문화공원',
  '신당','상왕십리','왕십리','한양대','뚝섬','성수',
  '건대입구','구의','강변','잠실나루','잠실','잠실새내',
  '종합운동장','삼성','선릉','역삼','강남','교대','서초',
  '방배','사당','낙성대','서울대입구','봉천','신림',
  '신대방','구로디지털단지','대림','신도림','문래','영등포구청',
  '당산','합정','홍대입구','신촌','이대','아현','충정로',
];

/* ── 지선 ── */
const SEONGSU   = ['성수','용답','신답','용두','신설동'];
const SHINJEONG = ['신도림','도림천','양천구청','신정네거리','까치산'];

/* ── 타원 파라미터 ── */
const CX=500, CY=445, RX=293, RY=228, START=208, N=LOOP.length;

function loopXY(i) {
  const a = (START + i*360/N) * Math.PI/180;
  return [+(CX + RX*Math.cos(a)).toFixed(1), +(CY + RY*Math.sin(a)).toFixed(1)];
}

/* ── 모든 역 좌표 계산 ── */
const POS = (() => {
  const p = {};
  LOOP.forEach((n, i) => { p[n] = loopXY(i); });

  // 성수지선: 성수에서 오른쪽 위 방향
  const [sx, sy] = p['성수'];
  SEONGSU.slice(1).forEach((n, i) => {
    p[n] = [+(sx + 38*(i+1)).toFixed(1), +(sy - 52*(i+1)).toFixed(1)];
  });

  // 신정지선: 신도림에서 왼쪽 아래 방향
  const [nx, ny] = p['신도림'];
  SHINJEONG.slice(1).forEach((n, i) => {
    p[n] = [+(nx - 55*(i+1)).toFixed(1), +(ny + 35*(i+1)).toFixed(1)];
  });

  return p;
})();

/* ── 이름 → 역 객체 맵 ── */
const STATION_MAP = Object.fromEntries(LINE2_STATIONS.map(s => [s.name, s]));

/* ── 긴 역명 멀티라인 ── */
const LABEL2 = {
  '동대문역사문화공원': ['동대문역사', '문화공원'],
  '구로디지털단지':    ['구로', '디지털단지'],
};

/* ── 특수 역 분류 ── */
const JUNCTION = new Set(['성수', '신도림']);
const TERMINAL = new Set(['신설동', '까치산']);
const ALL      = [...LOOP, ...SEONGSU.slice(1), ...SHINJEONG.slice(1)];

/* ── 콘텐츠 경계 (branch 포함) ── */
const BOUNDS = { minX:80, maxX:825, minY:5, maxY:800 };

/* ── 미리 계산: polyline 좌표 문자열 ── */
const LOOP_PTS = [...LOOP, LOOP[0]].map(n => POS[n].join(',')).join(' ');
const SS_PTS   = SEONGSU.map(n => POS[n].join(',')).join(' ');
const SJ_PTS   = SHINJEONG.map(n => POS[n].join(',')).join(' ');

export default function Line2Map({ onSelectStation }) {
  const wrapRef  = useRef(null);
  const dragRef  = useRef(null);
  const pinchRef = useRef(null);
  const [tr,  setTr]  = useState({ x: 0, y: 0, s: 1 });
  const [sel, setSel] = useState(null);

  /* ── 초기 fit ── */
  useEffect(() => {
    const fit = () => {
      const el = wrapRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const cW = BOUNDS.maxX - BOUNDS.minX;
      const cH = BOUNDS.maxY - BOUNDS.minY;
      const s  = Math.min(width / cW, height / cH) * 0.86;
      setTr({
        x: (width  - cW * s) / 2 - BOUNDS.minX * s,
        y: (height - cH * s) / 2 - BOUNDS.minY * s,
        s,
      });
    };
    const t = setTimeout(fit, 30);
    return () => clearTimeout(t);
  }, []);

  /* ── 마우스 패닝 ── */
  const onPDown = useCallback((e) => {
    if (e.pointerType === 'touch') return;
    dragRef.current = { sx: e.clientX - tr.x, sy: e.clientY - tr.y };
    wrapRef.current.setPointerCapture(e.pointerId);
  }, [tr]);
  const onPMove = useCallback((e) => {
    if (!dragRef.current) return;
    setTr(t => ({ ...t, x: e.clientX - dragRef.current.sx, y: e.clientY - dragRef.current.sy }));
  }, []);
  const onPUp = useCallback(() => { dragRef.current = null; }, []);

  /* ── 휠 줌 ── */
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const f = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setTr(t => {
      const ns   = Math.max(0.25, Math.min(6, t.s * f));
      const rect = wrapRef.current.getBoundingClientRect();
      const cx   = e.clientX - rect.left, cy = e.clientY - rect.top;
      return { s: ns, x: cx - (cx - t.x) * (ns / t.s), y: cy - (cy - t.y) * (ns / t.s) };
    });
  }, []);

  /* ── 터치 패닝/핀치줌 ── */
  const onTStart = useCallback((e) => {
    if (e.touches.length === 1) {
      dragRef.current  = { sx: e.touches[0].clientX - tr.x, sy: e.touches[0].clientY - tr.y };
      pinchRef.current = null;
    } else if (e.touches.length === 2) {
      dragRef.current  = null;
      pinchRef.current = {
        dist: Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        ),
        cx: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        cy: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        tx: tr.x, ty: tr.y, ts: tr.s,
      };
    }
  }, [tr]);

  const onTMove = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragRef.current) {
      setTr(t => ({ ...t,
        x: e.touches[0].clientX - dragRef.current.sx,
        y: e.touches[0].clientY - dragRef.current.sy,
      }));
    } else if (e.touches.length === 2 && pinchRef.current) {
      const d  = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ns   = Math.max(0.25, Math.min(6, pinchRef.current.ts * (d / pinchRef.current.dist)));
      const rect = wrapRef.current.getBoundingClientRect();
      const cx   = pinchRef.current.cx - rect.left;
      const cy   = pinchRef.current.cy - rect.top;
      setTr({
        s: ns,
        x: cx - (cx - pinchRef.current.tx) * (ns / pinchRef.current.ts),
        y: cy - (cy - pinchRef.current.ty) * (ns / pinchRef.current.ts),
      });
    }
  }, []);

  const onTEnd = useCallback(() => { dragRef.current = null; pinchRef.current = null; }, []);

  /* ── 역 탭 ── */
  const onStationClick = useCallback((name, e) => {
    e.stopPropagation();
    setSel(p => p === name ? null : name);
  }, []);

  /* ── 퍼즐 시작 ── */
  const handleStart = useCallback(() => {
    const st = STATION_MAP[sel];
    if (st) onSelectStation?.(st);
  }, [sel, onSelectStation]);

  const showLabels = tr.s >= 0.58;

  return (
    <div className="line2-map-container">

      {/* 헤더 */}
      <div className="line2-map-header">
        <div className="line2-header-badge">
          <span className="line2-num">2</span>
          <span className="line2-num-txt">호선</span>
        </div>
        <span className="line2-header-hint">51개 역 · 핀치 확대 · 탭하면 시작</span>
      </div>

      {/* SVG 지도 */}
      <div
        className="line2-svg-wrap"
        ref={wrapRef}
        onPointerDown={onPDown}
        onPointerMove={onPMove}
        onPointerUp={onPUp}
        onPointerCancel={onPUp}
        onWheel={onWheel}
        onTouchStart={onTStart}
        onTouchMove={onTMove}
        onTouchEnd={onTEnd}
        onClick={() => setSel(null)}
        style={{ touchAction: 'none', cursor: 'grab', userSelect: 'none' }}
      >
        <svg width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
          <g transform={`translate(${tr.x.toFixed(1)},${tr.y.toFixed(1)}) scale(${tr.s.toFixed(5)})`}>

            {/* ── 2호선 라인 ── */}
            <polyline points={LOOP_PTS} fill="none" stroke={G}
              strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={SS_PTS} fill="none" stroke={G}
              strokeWidth={8}  strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={SJ_PTS} fill="none" stroke={G}
              strokeWidth={8}  strokeLinejoin="round" strokeLinecap="round" />

            {/* ── 역명 라벨 (확대 시) ── */}
            {showLabels && ALL.map(name => {
              const [x, y] = POS[name];
              const dx = x - CX, dy = y - CY;
              const len = Math.hypot(dx, dy) || 1;
              const nx  = dx / len, ny = dy / len;
              const lx  = x + nx * 17, ly = y + ny * 17;
              const anchor = nx > 0.3 ? 'start' : nx < -0.3 ? 'end' : 'middle';
              const lines  = LABEL2[name];
              const isSel  = sel === name;

              return (
                <text
                  key={name}
                  x={lx} y={ly}
                  textAnchor={anchor}
                  fontSize={isSel ? 11.5 : 9.5}
                  fontWeight={isSel ? 700 : 500}
                  fill={isSel ? G : '#334155'}
                  fontFamily="'Noto Sans KR', sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {lines
                    ? <>
                        <tspan x={lx} dy="0">{lines[0]}</tspan>
                        <tspan x={lx} dy="11">{lines[1]}</tspan>
                      </>
                    : name
                  }
                </text>
              );
            })}

            {/* ── 역 마커 ── */}
            {ALL.map(name => {
              const [x, y] = POS[name];
              const isSel  = sel === name;
              const isJunc = JUNCTION.has(name);
              const isTerm = TERMINAL.has(name);
              const r = isJunc ? 9 : isTerm ? 7.5 : 6;

              return (
                <g key={name}
                  onClick={e => onStationClick(name, e)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* 선택 글로우 */}
                  {isSel && (
                    <circle cx={x} cy={y} r={r + 10} fill={G} opacity={0.15} />
                  )}
                  {/* 메인 도트 */}
                  <circle
                    cx={x} cy={y} r={r}
                    fill={isSel ? G : '#fff'}
                    stroke={G}
                    strokeWidth={isJunc ? 3.5 : 2.5}
                  />
                  {/* 종착역 이중 원 */}
                  {isTerm && !isSel && (
                    <circle cx={x} cy={y} r={r - 3}
                      fill="none" stroke={G} strokeWidth={1.5} />
                  )}
                </g>
              );
            })}

          </g>
        </svg>
      </div>

      {/* 선택 역 하단 패널 */}
      {sel && (
        <div className="line2-station-panel">
          <div className="line2-panel-info">
            <span className="line2-panel-badge">2호선</span>
            <span className="line2-panel-name">{sel}</span>
          </div>
          <button className="line2-panel-btn" onClick={handleStart}>
            퍼즐 시작 →
          </button>
        </div>
      )}

    </div>
  );
}
