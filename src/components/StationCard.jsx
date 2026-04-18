import { useMemo } from 'react';
import { LINE2_STATIONS } from '../data/line2Stations';
import { STATION_TEASERS } from '../data/stationTeasers';
import { formatTime } from '../utils/sudoku';

const LINE2_COLOR = '#00A84D';

function StatRow({ icon, label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function StationCard({ station, time, onHome, onNextPuzzle }) {
  const teaser = STATION_TEASERS[station.key] ?? '';

  // 2호선 내 이용객 순위
  const rank = useMemo(() => {
    const sorted = [...LINE2_STATIONS].sort(
      (a, b) => b.passengers.weekday - a.passengers.weekday
    );
    return sorted.findIndex(s => s.key === station.key) + 1;
  }, [station.key]);

  const branchLabel = {
    main:     '2호선 순환',
    seongsu:  '2호선 성수지선',
    sinjeong: '2호선 신정지선',
  }[station.branch] ?? '2호선';

  return (
    <div className="station-card-screen">
      {/* 상단 해금 배너 */}
      <div className="unlock-banner">
        <span className="unlock-emoji">🎉</span>
        <span className="unlock-text">역 카드 해금!</span>
        {time != null && (
          <span className="unlock-time">{formatTime(time)}</span>
        )}
      </div>

      <div className="station-card-body">
        {/* 호선 컬러 바 */}
        <div className="station-line-bar" style={{ background: LINE2_COLOR }}>
          <span>{branchLabel}</span>
          <span>No. {station.no}</span>
        </div>

        {/* 역명 */}
        <div className="station-name-block">
          <h1 className="station-name-ko">{station.name}</h1>
          <p className="station-name-en">{station.nameEn}</p>
        </div>

        {/* 수수께끼 → 정답 */}
        <div className="station-reveal-teaser">
          <span className="teaser-tag">정답 공개</span>
          <p className="station-teaser-revealed">"{teaser}"</p>
        </div>

        {/* 이름 유래 */}
        <div className="station-origin-block">
          <div className="origin-label">📖 이름 유래</div>
          <p className="origin-text">{station.nameOrigin}</p>
        </div>

        {/* 팩트 시트 */}
        <div className="station-facts">
          <StatRow
            icon="📅"
            label="개통일"
            value={station.opened}
          />
          <StatRow
            icon="👥"
            label="이용객"
            value={`평일 ${station.passengers.weekday.toLocaleString()}명 · 주말 ${station.passengers.weekend.toLocaleString()}명`}
          />
          <StatRow
            icon="📍"
            label="역사 깊이"
            value={`지하 ${station.depth}m`}
          />
          <StatRow
            icon="🏅"
            label="2호선 순위"
            value={`${rank}위 / 51역`}
          />
        </div>

        {/* 버튼 */}
        <div className="station-card-btns">
          <button className="sc-btn primary" onClick={onNextPuzzle}>
            다음 역 도전 →
          </button>
          <button className="sc-btn outline" onClick={onHome}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
