import { useRef, useState, useEffect } from 'react';
import { toXY, STATIONS, LINE2_STATIONS, LINE9_STATIONS, SINBUNDANG_STATIONS } from '../data/mapData';

const W = 800, H = 920;

// 역 배열 → SVG polyline points 문자열
function stationsToPoints(keys) {
  return keys
    .filter(k => STATIONS[k])
    .map(k => toXY(...STATIONS[k]).join(','))
    .join(' ');
}

// 각 호선 경로 정의
const LINES = [
  {
    id: '1', name: '1호선', color: '#0052A4', strokeW: 6,
    segments: [
      // 경인선 (인천~구로)
      ['인천','부평','송내','부천','역곡','온수','오류동','개봉','구일','구로'],
      // 경부선 본선 (구로~천안)
      ['구로','금천구청','석수','관악','안양','수원','천안'],
      // 경부선 서울 구간
      ['구로','신도림1','대방','노량진','용산','서울역1','종각','종로3가','종로5가','동대문','신설동','제기동','청량리'],
      // 경원선 (청량리~소요산)
      ['청량리','회기','광운대','창동','도봉산','의정부','소요산'],
    ],
  },
  {
    id: '2', name: '2호선', color: '#00A84D', strokeW: 7,
    segments: [
      [
        '시청2','을지로입구','을지로3가','을지로4가','동대문역사',
        '신당','상왕십리','왕십리','한양대','뚝섬','성수',
        '건대입구','구의','강변','잠실나루','잠실2',
        '잠실새내','종합운동장','삼성','선릉','역삼','강남2',
        '교대2','서초','방배','사당2','낙성대','서울대입구',
        '봉천','신림','신대방','구로디지털','대림2',
        '신도림2','문래','영등포구청','당산',
        '합정','홍대입구','신촌2','이대','아현','충정로2','시청2',
      ],
      // 성수지선
      ['성수','뚝섬'],
      // 신정지선
      ['신도림2','까치산'],
    ],
  },
  {
    id: '3', name: '3호선', color: '#EF7C1C', strokeW: 6,
    segments: [[
      '대화','주엽','정발산','마두','백석','대곡','화정','원당','삼송','지축',
      '구파발','연신내','불광','녹번','홍제','무악재','독립문','경복궁','안국',
      '종로3가3','을지로3가3','충무로3','동대입구','약수','금호','옥수',
      '압구정','신사','잠원','고속터미널3','교대3','남부터미널',
      '양재3','매봉','도곡','대청','일원','수서','가락시장','경찰병원','오금',
    ]],
  },
  {
    id: '4', name: '4호선', color: '#00A5DE', strokeW: 6,
    segments: [[
      '당고개','상계','노원4','창동4','쌍문','수유','미아','미아사거리','길음',
      '성신여대','한성대입구','혜화','동대문4','동대입구4','충무로4','명동',
      '회현','서울역4','숙대입구','삼각지','신용산','이촌','동작4',
      '총신대입구','사당4','남태령','선바위','경마공원','대공원',
      '과천','정부과천청사','인덕원','평촌','범계','금정4',
      '산본','수리산','대야미','반월','상록수','한대앞','중앙','고잔','초지','안산','신길온천','정왕','오이도',
    ]],
  },
  {
    id: '5', name: '5호선', color: '#996CAC', strokeW: 6,
    segments: [
      [
        '방화','개화산','김포공항5','송정5','마곡','발산','우장산','화곡','까치산',
        '신정','목동','오목교','양평5','영등포구청5','영등포시장','신길5',
        '여의도5','여의나루','마포','공덕5','애오개','충정로5','서대문5',
        '광화문','종로3가5','을지로4가5','동대입구5','청구','신금호','행당',
        '왕십리5','마장','답십리','장한평','군자5','아차산','광나루','천호5','강동5',
      ],
      // 마천 지선
      ['강동5','둔촌동','올림픽공원','방이','오금5','개롱','거여','마천'],
      // 하남 지선
      ['강동5','길동','굽은다리','명일','고덕','상일동'],
    ],
  },
  {
    id: '9', name: '9호선', color: '#BDB27A', strokeW: 5,
    segments: [[...LINE9_STATIONS]],
  },
  {
    id: 'sin', name: '신분당선', color: '#D31145', strokeW: 5,
    segments: [[...SINBUNDANG_STATIONS]],
  },
];

// 주요 환승역 (표시용)
const TRANSFER_STATIONS = [
  { key: '서울역1',     label: '서울역',    lines: ['1','4'] },
  { key: '시청2',       label: '시청',      lines: ['1','2'] },
  { key: '종로3가',     label: '종로3가',   lines: ['1','3','5'] },
  { key: '동대문역사',  label: '동대문\n역사', lines: ['2','4','5'] },
  { key: '왕십리',      label: '왕십리',    lines: ['2','5','경의'] },
  { key: '신도림1',     label: '신도림',    lines: ['1','2'] },
  { key: '잠실2',       label: '잠실',      lines: ['2','8'] },
  { key: '강남2',       label: '강남',      lines: ['2','신분당'] },
  { key: '교대2',       label: '교대',      lines: ['2','3'] },
  { key: '사당2',       label: '사당',      lines: ['2','4'] },
  { key: '합정',        label: '합정',      lines: ['2','6'] },
  { key: '홍대입구',    label: '홍대입구',  lines: ['2','경의','공항'] },
  { key: '충정로2',     label: '충정로',    lines: ['2','5'] },
  { key: '고속터미널3', label: '고속\n터미널', lines: ['3','7','9'] },
  { key: '양재3',       label: '양재',      lines: ['3','신분당'] },
  { key: '당산',        label: '당산',      lines: ['2','9'] },
  { key: '여의도5',     label: '여의도',    lines: ['5','9'] },
  { key: '노량진9',     label: '노량진',    lines: ['1','9'] },
  { key: '증미',        label: '증미',      lines: ['9'] },
];

export default function SubwayMap({ onLineSelect, selectedLineId }) {
  const svgRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const dragRef = useRef(null);
  const pinchRef = useRef(null);

  // 초기 뷰: 서울 시내 중심 (강남~홍대 구간) 기준
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 120;
    // 서울 중심부 좌표 범위만 보이도록 스케일 계산
    // 서울 중심: lon 126.85~127.15 → x 229~571, lat 37.45~37.65 → y 230~690
    const targetW = 571 - 229;  // 342
    const targetH = 690 - 230;  // 460
    const scale = Math.min(vw / targetW, vh / targetH) * 0.85;
    // 중심점을 화면 중앙에
    const centerX = (229 + 571) / 2; // 400
    const centerY = (230 + 690) / 2; // 460
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
      const newScale = Math.min(Math.max(t.scale * factor, 0.3), 5);
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
      const newScale = Math.min(Math.max(pinchRef.current.scale * factor, 0.3), 5);
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
          {LINES.map(line =>
            line.segments.map((seg, si) => {
              const pts = stationsToPoints(seg);
              if (!pts) return null;
              const isSelected = selectedLineId === line.id;
              return (
                <polyline
                  key={`${line.id}-${si}`}
                  points={pts}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={isSelected ? line.strokeW + 3 : line.strokeW}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={selectedLineId && !isSelected ? 0.25 : 1}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s, stroke-width 0.2s' }}
                  onClick={() => onLineSelect(line)}
                />
              );
            })
          )}

          {/* 환승역 */}
          {TRANSFER_STATIONS.map(s => {
            if (!STATIONS[s.key]) return null;
            const [x, y] = toXY(...STATIONS[s.key]);
            const scale = transform.scale;
            const r = scale < 0.8 ? 7 : 5;
            return (
              <g key={s.key}>
                <circle cx={x} cy={y} r={r + 3} fill="white" stroke="#888" strokeWidth={1.5} />
                <circle cx={x} cy={y} r={r} fill="#fff" stroke="#555" strokeWidth={1} />
                {scale > 1.0 && (
                  <text
                    x={x + 8}
                    y={y + 4}
                    fontSize={10}
                    fill="#333"
                    fontWeight="600"
                    fontFamily="'Segoe UI', sans-serif"
                  >
                    {s.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* 문래역 강조 (홈 베이스) */}
          {STATIONS['문래'] && (() => {
            const [x, y] = toXY(...STATIONS['문래']);
            return (
              <g>
                <circle cx={x} cy={y} r={10} fill="#00A84D" opacity={0.3} />
                <circle cx={x} cy={y} r={6} fill="#00A84D" />
                {transform.scale > 0.8 && (
                  <text x={x + 9} y={y + 4} fontSize={10} fill="#00A84D" fontWeight="800" fontFamily="'Segoe UI', sans-serif">
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
        {LINES.map(line => (
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
