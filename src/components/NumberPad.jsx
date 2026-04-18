export default function NumberPad({
  onNumber, onErase, onNote, noteMode,
  hintCount, onHint, onUndo, canUndo,
  onFillCell, onFillAll, hasSelected,
}) {
  return (
    <div className="numpad-wrap">
      {/* 1행: 되돌리기 / 지우기 / 메모 / 힌트 */}
      <div className="numpad-tools">
        <button className={`tool-btn ${!canUndo ? 'disabled' : ''}`} onClick={onUndo} disabled={!canUndo}>
          <span className="tool-icon">↩</span>
          <span className="tool-label">되돌리기</span>
        </button>
        <button className="tool-btn" onClick={onErase}>
          <span className="tool-icon">⌫</span>
          <span className="tool-label">지우기</span>
        </button>
        <button className={`tool-btn ${noteMode ? 'active' : ''}`} onClick={onNote}>
          <span className="tool-icon">✏️</span>
          <span className="tool-label">메모 {noteMode ? 'ON' : 'OFF'}</span>
        </button>
        <button className={`tool-btn ${hintCount === 0 ? 'disabled' : ''}`} onClick={onHint} disabled={hintCount === 0}>
          <span className="tool-icon">💡</span>
          <span className="tool-label">힌트 {hintCount}</span>
        </button>
      </div>

      {/* 2행: 후보 채우기 */}
      <div className="fill-tools">
        <button
          className={`fill-btn ${!hasSelected ? 'disabled' : ''}`}
          onClick={onFillCell}
          disabled={!hasSelected}
          title="선택한 칸에 가능한 후보 숫자를 채웁니다"
        >
          이 칸 후보 채우기
        </button>
        <button className="fill-btn fill-all-btn" onClick={onFillAll} title="모든 빈 칸에 후보 숫자를 채웁니다">
          전체 후보 채우기
        </button>
      </div>

      {/* 숫자 패드 */}
      <div className="numpad">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} className="num-btn" onClick={() => onNumber(n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
