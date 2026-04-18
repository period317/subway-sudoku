import { useState } from 'react';
import SubwayMap from './SubwayMap';
import { SUBWAY_LINES } from '../data/subwayLines';

export default function LineSelect({ onSelect, onAbout, onHome }) {
  const [selectedLine, setSelectedLine] = useState(null);

  const handleLineSelect = (line) => {
    // SubwayMap에서 오는 line 객체와 SUBWAY_LINES 데이터 매핑
    const lineData = SUBWAY_LINES.find(l => l.id === line.id) || line;
    setSelectedLine(lineData);
  };

  return (
    <div className="line-select-map">
      {/* 헤더 */}
      <div className="map-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onHome && (
            <button className="back-btn" onClick={onHome} style={{ fontSize: 16 }}>←</button>
          )}
          <div>
            <h1 className="title" style={{ fontSize: 18 }}>노선도 탐색</h1>
            <p className="subtitle">호선을 선택하세요 · 수도권</p>
          </div>
        </div>
        <button className="about-btn" onClick={onAbout}>만든이</button>
      </div>

      {/* 지하철 맵 */}
      <SubwayMap
        onLineSelect={handleLineSelect}
        selectedLineId={selectedLine?.id}
      />

      {/* 선택된 호선 하단 패널 */}
      {selectedLine && (
        <div className="line-bottom-panel">
          <div className="line-panel-info">
            <div className="line-badge" style={{ background: selectedLine.color }}>
              {selectedLine.name}
            </div>
            <div>
              <div className="line-panel-name">{selectedLine.desc || ''}</div>
              <div className="line-count">{selectedLine.stations}개 역</div>
            </div>
          </div>
          <button
            className="line-start-btn"
            style={{ background: selectedLine.color }}
            onClick={() => onSelect(selectedLine)}
          >
            시작 →
          </button>
        </div>
      )}
    </div>
  );
}
