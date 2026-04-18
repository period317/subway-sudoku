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

export default function Home({ onDailyPuzzle, onBrowseMap, onAbout }) {
  const { station, diffIdx } = useMemo(() => ({
    station: getDailyStation(),
    diffIdx: getDailyDiffIdx(),
  }), []);

  const teaser = STATION_TEASERS[station.key] ?? '서울 어딘가의 역';
  const diff = DIFF_DISPLAY[diffIdx];

  const today = new Date();
  const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;

  return (
    <div className="home-screen">
      {/* 헤더 */}
      <header className="home-header">
        <div className="home-brand">
          <span className="home-logo">🚇</span>
          <div>
            <h1 className="home-title">서브웨이 스도쿠</h1>
            <p className="home-subtitle">서울 지하철로 떠나는 퍼즐 여행</p>
          </div>
        </div>
        <button className="about-btn" onClick={onAbout}>만든이</button>
      </header>

      <main className="home-main">

        {/* ── 오늘의 스도쿠 카드 ── */}
        <section className="home-section">
          <h2 className="section-label">
            <span className="section-dot today-dot" />
            오늘의 스도쿠
            <span className="section-date">{dateStr}</span>
          </h2>

          <div className="daily-card" onClick={() => onDailyPuzzle({ station, diffIdx })}>
            {/* 미스터리 뱃지 */}
            <div className="daily-card-top">
              <span className="mystery-badge">??? 역</span>
              <span className="daily-line-hint">2호선</span>
            </div>

            {/* 수수께끼 문구 */}
            <div className="daily-teaser-wrap">
              <span className="teaser-quote open">"</span>
              <p className="daily-teaser-text">{teaser}</p>
              <span className="teaser-quote close">"</span>
            </div>

            <p className="daily-sub">어느 역인지 알겠나요? 풀면 밝혀집니다.</p>

            {/* 난이도 */}
            <div className="daily-diff-row">
              <Stars count={diff.stars} />
              <span className="daily-diff-label">{diff.name} · 힌트 {diff.clues}개</span>
            </div>

            <button className="daily-start-btn" onClick={e => { e.stopPropagation(); onDailyPuzzle({ station, diffIdx }); }}>
              지금 풀기 →
            </button>
          </div>
        </section>

        {/* ── 노선도 탐색 ── */}
        <section className="home-section">
          <h2 className="section-label">
            <span className="section-dot map-dot" />
            직접 고르기
          </h2>

          <button className="browse-card" onClick={onBrowseMap}>
            <div className="browse-card-inner">
              <span className="browse-icon">🗺</span>
              <div className="browse-text">
                <span className="browse-title">노선도 탐색</span>
                <span className="browse-desc">수도권 전체 지도에서 역을 골라 도전</span>
              </div>
            </div>
            <span className="browse-arrow">→</span>
          </button>
        </section>

      </main>
    </div>
  );
}
