import { STATION_TEASERS } from '../data/stationTeasers';

const DIFF_INFO = [
  { name: '입문',      clues: 26, stars: 1 },
  { name: '도전',      clues: 23, stars: 2 },
  { name: '고수',      clues: 21, stars: 3 },
  { name: '마스터',    clues: 19, stars: 4 },
  { name: '신의 영역', clues: 17, stars: 5 },
];

function Stars({ count }) {
  return (
    <span className="diff-stars">
      {Array(5).fill(null).map((_, i) => (
        <span key={i} className={i < count ? 'star on' : 'star off'}>★</span>
      ))}
    </span>
  );
}

export default function DailyModal({ station, diffIdx, onStart, onClose }) {
  const diff   = DIFF_INFO[diffIdx];
  const teaser = STATION_TEASERS[station?.key] ?? '서울 어딘가의 역';

  return (
    <div className="daily-modal-overlay" onClick={onClose}>
      <div className="daily-modal" onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="daily-modal-header">
          <span className="daily-modal-badge">🗝️ 오늘의 스도쿠</span>
          <button className="daily-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* 미스터리 역명 */}
        <div className="daily-modal-mystery">??? 역</div>

        {/* 힌트 문구 */}
        <div className="daily-modal-teaser-wrap">
          <p className="daily-modal-teaser">"{teaser}"</p>
        </div>

        {/* 난이도 */}
        <div className="daily-modal-diff-row">
          <Stars count={diff.stars} />
          <span className="daily-modal-diff-label">{diff.name} · 힌트 {diff.clues}개</span>
        </div>

        {/* 안내 */}
        <div className="daily-modal-tips">
          <div className="daily-modal-tip">⏱ 시작 버튼을 누르는 순간 타이머가 시작됩니다</div>
          <div className="daily-modal-tip">🔒 완성하면 오늘의 역 카드가 해금됩니다</div>
        </div>

        {/* 시작 버튼 */}
        <button className="daily-modal-start-btn" onClick={onStart}>
          지금 시작 →
        </button>

      </div>
    </div>
  );
}
