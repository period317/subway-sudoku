export default function About({ onBack }) {
  return (
    <div className="about-page">
      <header className="header">
        <button className="back-btn" onClick={onBack}>←</button>
        <div className="header-center">
          <span className="playing-diff">만든이</span>
        </div>
        <div style={{ width: 36 }} />
      </header>

      <div className="about-content">

        {/* 메인 카드 */}
        <div className="about-card">
          <div className="about-station-badge">🟢 문래역</div>
          <h2 className="about-title">
            이 앱은 문래역에서<br />시작되었습니다.
          </h2>
          <p className="about-reason">
            만든이가 문래역에 살거든요.
          </p>
        </div>

        {/* 개발 스토리 */}
        <div className="about-story-card">
          <p className="about-story">
            그래서 2호선이 제일 먼저 만들어졌고,<br />
            문래역에서 출발하면 거점 보너스가 있습니다.<br />
            (이건 비밀입니다)
          </p>
        </div>

        {/* 만든이 */}
        <div className="about-maker-card">
          <div className="about-maker-label">만든이</div>
          <div className="about-maker-name">허호필</div>
          <div className="about-maker-role">네이버페이 서비스 기획자</div>
          <div className="about-maker-desc">
            개발자도 디자이너도 없이,<br />AI와 함께 혼자 만든 앱입니다.
          </div>
        </div>

        {/* 문의 버튼 */}
        <button
          className="about-contact-btn"
          onClick={() => window.location.href = 'mailto:hhp8621@gmail.com?subject=서브웨이 스도쿠 문의'}
        >
          어떻게 만들었는지 물어보기
        </button>

        <p className="about-footer">
          더 많은 호선과 도시가 업데이트될 예정입니다.<br />
          부산, 대구, 그리고 해외까지.
        </p>

      </div>
    </div>
  );
}
