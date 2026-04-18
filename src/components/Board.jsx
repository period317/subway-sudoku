export default function Board({ board, puzzle, solution, selected, onSelect, conflicts, notes }) {
  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((val, c) => {
          const key = `${r}-${c}`;
          const isFixed = puzzle[r][c] !== 0;
          const isSelected = selected && selected[0] === r && selected[1] === c;
          const isConflict = conflicts.has(key);
          const isSameNum = selected && val !== 0 && board[selected[0]][selected[1]] === val && !isSelected;
          const isHighlight = selected && !isSelected &&
            (r === selected[0] || c === selected[1] ||
              (Math.floor(r / 3) === Math.floor(selected[0] / 3) &&
               Math.floor(c / 3) === Math.floor(selected[1] / 3)));
          const isCorrect = val !== 0 && solution && val === solution[r][c];
          const cellNotes = notes[key] || new Set();

          let className = 'cell';
          if (isFixed) className += ' fixed';
          if (isSelected) className += ' selected';
          else if (isHighlight) className += ' highlight';
          if (isConflict) className += ' conflict';
          if (isSameNum && !isConflict) className += ' same-num';

          // 박스 경계선
          if (c % 3 === 0 && c !== 0) className += ' border-left';
          if (r % 3 === 0 && r !== 0) className += ' border-top';

          return (
            <div key={key} className={className} onClick={() => onSelect(r, c)}>
              {val !== 0 ? (
                <span className={isConflict ? 'conflict-num' : isFixed ? '' : isCorrect ? 'user-num' : 'user-num wrong'}>
                  {val}
                </span>
              ) : cellNotes.size > 0 ? (
                <div className="notes-grid">
                  {[1,2,3,4,5,6,7,8,9].map(n => (
                    <span key={n} className={`note ${cellNotes.has(n) ? 'visible' : ''}`}>{n}</span>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })
      )}
    </div>
  );
}
