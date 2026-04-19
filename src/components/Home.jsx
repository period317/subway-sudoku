import { useMemo } from 'react';
import { getDailyStation, getDailyDiffIdx } from '../utils/daily';
import { STATION_TEASERS } from '../data/stationTeasers';

const DIFF_DISPLAY = [
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

export default function Home({ onDailyPuzzle }) {
  const { station, diffIdx } = useMemo(() => ({
    station: getDailyStation(),
    diffIdx: getDailyDiffIdx(),
  }), []);

  const teaser = STATION_TEASERS[station.key] ?? '서울 어딘가의 역';
  const diff = DIFF_DISPLAY[diffIdx];

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="today-tab">

      {/* 날짜 헤더 */}
      <div className="today-date-header">
        <span className="today-label">오늘의 스도쿠</span>
        <span className="today-date">{dateStr}</span>
      </div>

      {/* 메인 수수께끼 카드 */}
      <div className="daily-card" onClick={() => onDailyPuzzle({ station, diffIdx })}>

        <div className="daily-card-top">
          <span className="mystery-badge">??? 역</span>
          <span className="daily-line-hint">2호선</span>
        </div>

        <div className="daily-teaser-wrap">
          <span className="teaser-quote open">"</span>
          <p className="daily-teaser-text">{teaser}</p>
          <span className="teaser-quote close">"</span>
        </div>

        <p className="daily-sub">어느 역인지 알겠나요? 풀면 밝혀집니다.</p>

        <div className="daily-diff-row">
          <Stars count={diff.stars} />
          <span className="daily-diff-label">{diff.name} · 힌트 {diff.clues}개</span>
        </div>

        <button
          className="daily-start-btn"
          onClick={e => { e.stopPropagation(); onDailyPuzzle({ station, diffIdx }); }}
        >
          지금 풀기 →
        </button>
      </div>

      {/* 안내 카드 */}
      <div className="today-info-grid">
        <div className="info-card">
          <span className="info-icon">🔒</span>
          <span className="info-text">풀면 역 카드 해금</span>
        </div>
        <div className="info-card">
          <span className="info-icon">📅</span>
          <span className="info-text">매일 새 역</span>
        </div>
        <div className="info-card">
          <span className="info-icon">🚇</span>
          <span className="info-text">2호선 51개 역</span>
        </div>
      </div>

      {/* 힌트 박스 */}
      <div className="today-hint-box">
        <div className="hint-box-title">💡 스도쿠란?</div>
        <p className="hint-box-text">
          9×9 칸에 1~9를 한 번씩만 채우는 퍼즐.<br />
          힌트가 적을수록 어렵고, <strong>17개</strong>는 수학적으로 증명된 최솟값입니다.
        </p>
      </div>

    </div>
  );
}
