// 스도쿠 퍼즐 생성 및 검증 유틸리티

// 빈 9x9 보드 생성
export function emptyBoard() {
  return Array(9).fill(null).map(() => Array(9).fill(0));
}

// 특정 위치에 숫자 놓을 수 있는지 검증
export function isValid(board, row, col, num) {
  // 행 검사
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  // 열 검사
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // 3x3 박스 검사
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

// 백트래킹으로 완전한 보드 생성
function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// 배열 셔플 (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 유일한 해가 있는지 확인 (제한된 깊이)
function countSolutions(board, limit = 2) {
  let count = 0;
  function solve(b) {
    if (count >= limit) return;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              solve(b);
              b[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  const copy = board.map(r => [...r]);
  solve(copy);
  return count;
}

// 퍼즐 생성
export function generatePuzzle(difficulty = 'extreme', targetClues = 21) {
  const solution = emptyBoard();
  fillBoard(solution);

  const puzzle = solution.map(r => [...r]);
  const cells = shuffle(
    Array(81).fill(null).map((_, i) => [Math.floor(i / 9), i % 9])
  );

  let removed = 0;
  const target = 81 - targetClues;

  for (const [row, col] of cells) {
    if (removed >= target) break;
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    if (countSolutions(puzzle) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution };
}

// 보드 전체 유효성 검사 (현재 상태에서 충돌 찾기)
export function findConflicts(board) {
  const conflicts = new Set();

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (!num) continue;

      // 행
      for (let c = 0; c < 9; c++) {
        if (c !== col && board[row][c] === num) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${row}-${c}`);
        }
      }
      // 열
      for (let r = 0; r < 9; r++) {
        if (r !== row && board[r][col] === num) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${r}-${col}`);
        }
      }
      // 박스
      const br = Math.floor(row / 3) * 3;
      const bc = Math.floor(col / 3) * 3;
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          if ((r !== row || c !== col) && board[r][c] === num) {
            conflicts.add(`${row}-${col}`);
            conflicts.add(`${r}-${c}`);
          }
        }
      }
    }
  }
  return conflicts;
}

// 완성 여부 확인
export function isComplete(board, solution) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== solution[r][c]) return false;
    }
  }
  return true;
}

// 빈 칸의 후보 숫자 자동 계산
export function initNotes(puzzle) {
  const notes = {};
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (puzzle[r][c] === 0) {
        const candidates = new Set();
        for (let n = 1; n <= 9; n++) {
          if (isValid(puzzle, r, c, n)) candidates.add(n);
        }
        notes[`${r}-${c}`] = candidates;
      }
    }
  }
  return notes;
}

// 숫자 놓았을 때 관련 칸(행/열/박스)에서 해당 숫자 메모 제거
export function eliminateNotes(notes, row, col, num) {
  const newNotes = { ...notes };
  for (let i = 0; i < 9; i++) {
    // 같은 행
    const rKey = `${row}-${i}`;
    if (newNotes[rKey]) {
      const s = new Set(newNotes[rKey]);
      s.delete(num);
      newNotes[rKey] = s;
    }
    // 같은 열
    const cKey = `${i}-${col}`;
    if (newNotes[cKey]) {
      const s = new Set(newNotes[cKey]);
      s.delete(num);
      newNotes[cKey] = s;
    }
  }
  // 같은 박스
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      const key = `${r}-${c}`;
      if (newNotes[key]) {
        const s = new Set(newNotes[key]);
        s.delete(num);
        newNotes[key] = s;
      }
    }
  }
  // 놓은 칸 자체 메모 삭제
  delete newNotes[`${row}-${col}`];
  return newNotes;
}

// 시간 포맷 (초 → mm:ss)
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
