import { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import NumberPad from './components/NumberPad';
import LineSelect from './components/LineSelect';
import About from './components/About';
import Home from './components/Home';
import StationCard from './components/StationCard';
import TabBar from './components/TabBar';
import RecordsTab from './components/RecordsTab';
import DailyModal from './components/DailyModal';
import {
  generatePuzzle, findConflicts, isComplete,
  formatTime, initNotes, eliminateNotes
} from './utils/sudoku';
import { getDailyStation, getDailyDiffIdx } from './utils/daily';
import './App.css';

export const DIFFICULTIES = [
  { key: 'hard',    clues: 26, label: '26개', name: '입문',      desc: '논리적 추론만으로 풀 수 있는 가장 쉬운 도전 난이도. 기본기 점검용.' },
  { key: 'expert',  clues: 23, label: '23개', name: '도전',      desc: '후보 제거와 기본 기법이 필요. 풀이 경로가 하나씩 좁아지는 느낌.' },
  { key: 'extreme', clues: 21, label: '21개', name: '고수',      desc: 'X-Wing, Swordfish 등 중급 기법이 등장. 메모 없이는 힘들어지는 구간.' },
  { key: 'master',  clues: 19, label: '19개', name: '마스터',    desc: '복합 기법과 시행착오가 필요. 평균 풀이 시간 30분 이상.' },
  { key: 'god',     clues: 17, label: '17개', name: '신의 영역', desc: '수학적으로 증명된 최소 힌트 개수. 세상에서 가장 어려운 스도쿠.' },
];

const MAX_MISTAKES = 3;

function makeGame(puzzle, solution, diff) {
  return {
    puzzle, solution,
    board: puzzle.map(r => [...r]),
    notes: {}, selected: null,
    conflicts: new Set(),
    complete: false, failed: false,
    time: 0, hintCount: 3, mistakes: 0, diff,
  };
}

// 탭 기반 화면 vs 풀스크린 화면
// screen: 'tabs' | 'setup' | 'generating' | 'playing' | 'stationCard' | 'about'

export default function App() {
  const [screen, setScreen]           = useState('tabs');
  const [activeTab, setActiveTab]     = useState('today');
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(DIFFICULTIES[4]);
  const [game, setGame]               = useState(null);
  const [noteMode, setNoteMode]       = useState(false);
  const [paused, setPaused]           = useState(false);
  const [history, setHistory]         = useState([]);
  const [isDailyPuzzle, setIsDailyPuzzle] = useState(false);
  const [dailyStation, setDailyStation]   = useState(null);
  const [pendingDaily, setPendingDaily]   = useState(null); // { station, diffIdx }

  // 타이머
  useEffect(() => {
    if (screen !== 'playing' || !game || game.complete || game.failed || paused) return;
    const id = setInterval(() => setGame(g => ({ ...g, time: g.time + 1 })), 1000);
    return () => clearInterval(id);
  }, [screen, game?.complete, game?.failed, paused]);

  // ── 퍼즐 시작 ──
  const startGame = useCallback((diff) => {
    setScreen('generating');
    setTimeout(() => {
      const { puzzle, solution } = generatePuzzle(diff.key, diff.clues);
      setGame(makeGame(puzzle, solution, diff));
      setHistory([]);
      setNoteMode(false);
      setPaused(false);
      setScreen('playing');
    }, 80);
  }, []);

  const handleStart = useCallback(() => {
    setIsDailyPuzzle(false);
    startGame(selectedDiff);
  }, [selectedDiff, startGame]);

  const handleDailyStart = useCallback(({ station, diffIdx } = {}) => {
    const s  = station  ?? getDailyStation();
    const di = diffIdx  ?? getDailyDiffIdx();
    const diff = DIFFICULTIES[di];
    setDailyStation(s);
    setIsDailyPuzzle(true);
    setSelectedDiff(diff);
    startGame(diff);
  }, [startGame]);

  // ── 게임 로직 ──
  const saveHistory = useCallback((g) => {
    setHistory(h => [...h.slice(-30), {
      board: g.board.map(r => [...r]),
      notes: Object.fromEntries(Object.entries(g.notes).map(([k,v]) => [k, new Set(v)])),
      mistakes: g.mistakes, conflicts: new Set(g.conflicts),
    }]);
  }, []);

  const handleSelect = useCallback((r, c) => setGame(g => ({ ...g, selected: [r, c] })), []);

  const handleNumber = useCallback((num) => {
    setGame(g => {
      if (!g.selected || g.complete || g.failed) return g;
      const [r, c] = g.selected;
      if (g.puzzle[r][c] !== 0) return g;
      if (noteMode) {
        const key = `${r}-${c}`;
        const cn = new Set(g.notes[key] || []);
        cn.has(num) ? cn.delete(num) : cn.add(num);
        saveHistory(g);
        return { ...g, notes: { ...g.notes, [key]: cn } };
      }
      const isWrong = num !== g.solution[r][c];
      const newMistakes = isWrong ? g.mistakes + 1 : g.mistakes;
      saveHistory(g);
      const nb = g.board.map(r => [...r]);
      nb[r][c] = num;
      if (isWrong) return { ...g, board: nb, conflicts: findConflicts(nb), mistakes: newMistakes, failed: newMistakes >= MAX_MISTAKES };
      const nn = eliminateNotes(g.notes, r, c, num);
      return { ...g, board: nb, notes: nn, conflicts: findConflicts(nb), mistakes: newMistakes, complete: isComplete(nb, g.solution) };
    });
  }, [noteMode, saveHistory]);

  const handleErase = useCallback(() => {
    setGame(g => {
      if (!g.selected || g.complete || g.failed) return g;
      const [r, c] = g.selected;
      if (g.puzzle[r][c] !== 0) return g;
      saveHistory(g);
      const nb = g.board.map(r => [...r]);
      nb[r][c] = 0;
      const cands = new Set();
      for (let n = 1; n <= 9; n++) {
        let ok = true;
        for (let i = 0; i < 9; i++) if (nb[r][i] === n || nb[i][c] === n) { ok = false; break; }
        if (ok) { const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3; for (let ri=br;ri<br+3&&ok;ri++) for (let ci=bc;ci<bc+3&&ok;ci++) if (nb[ri][ci]===n) ok=false; }
        if (ok) cands.add(n);
      }
      return { ...g, board: nb, notes: { ...g.notes, [`${r}-${c}`]: cands }, conflicts: findConflicts(nb) };
    });
  }, [saveHistory]);

  const handleHint = useCallback(() => {
    setGame(g => {
      if (!g.selected || g.hintCount<=0 || g.complete || g.failed) return g;
      const [r,c] = g.selected;
      if (g.puzzle[r][c]!==0 || g.board[r][c]===g.solution[r][c]) return g;
      saveHistory(g);
      const nb = g.board.map(r=>[...r]);
      nb[r][c] = g.solution[r][c];
      const nn = eliminateNotes(g.notes, r, c, g.solution[r][c]);
      return { ...g, board: nb, notes: nn, conflicts: findConflicts(nb), complete: isComplete(nb, g.solution), hintCount: g.hintCount-1 };
    });
  }, [saveHistory]);

  const handleFillCell = useCallback(() => {
    setGame(g => {
      if (!g.selected) return g;
      const [r,c] = g.selected;
      if (g.puzzle[r][c]!==0 || g.board[r][c]!==0) return g;
      const cands = new Set();
      for (let n=1;n<=9;n++) {
        let ok=true;
        for (let i=0;i<9;i++) if (g.board[r][i]===n||g.board[i][c]===n){ok=false;break;}
        if (ok){const br=Math.floor(r/3)*3,bc=Math.floor(c/3)*3;for(let ri=br;ri<br+3&&ok;ri++)for(let ci=bc;ci<bc+3&&ok;ci++)if(g.board[ri][ci]===n)ok=false;}
        if (ok) cands.add(n);
      }
      return { ...g, notes: { ...g.notes, [`${r}-${c}`]: cands } };
    });
  }, []);

  const handleFillAll = useCallback(() => {
    setGame(g => { saveHistory(g); return { ...g, notes: initNotes(g.board) }; });
  }, [saveHistory]);

  const handleUndo = useCallback(() => {
    if (!history.length) return;
    const prev = history[history.length-1];
    setHistory(h => h.slice(0,-1));
    setGame(g => ({ ...g, ...prev }));
  }, [history]);

  // 키보드
  useEffect(() => {
    if (screen !== 'playing') return;
    const handler = (e) => {
      if (e.key>='1'&&e.key<='9') handleNumber(parseInt(e.key));
      if (e.key==='Backspace'||e.key==='Delete') handleErase();
      if (e.key==='n'||e.key==='N') setNoteMode(m=>!m);
      if ((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();handleUndo();}
      if (game?.selected) {
        const [r,c]=game.selected;
        if (e.key==='ArrowUp'&&r>0) handleSelect(r-1,c);
        if (e.key==='ArrowDown'&&r<8) handleSelect(r+1,c);
        if (e.key==='ArrowLeft'&&c>0) handleSelect(r,c-1);
        if (e.key==='ArrowRight'&&c<8) handleSelect(r,c+1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [screen, game?.selected, handleNumber, handleErase, handleUndo, handleSelect]);

  // ──────────────── 화면 렌더 ────────────────

  // 만든이
  if (screen === 'about') {
    return <About onBack={() => setScreen('tabs')} />;
  }

  // 역 카드 해금
  if (screen === 'stationCard') {
    return (
      <StationCard
        station={dailyStation}
        time={game?.time}
        onHome={() => setScreen('tabs')}
        onNextPuzzle={() => handleDailyStart()}
      />
    );
  }

  // 난이도 선택 (호선 선택 후)
  if (screen === 'setup') {
    return (
      <div className="app">
        <header className="header setup-header">
          <button className="back-btn" onClick={() => setScreen('tabs')}>←</button>
          <div>
            <h1 className="title" style={{ color: selectedLine?.color }}>
              {selectedLine?.name ?? '스도쿠'}
            </h1>
            <p className="subtitle">힌트 개수를 선택하세요</p>
          </div>
        </header>
        <div className="diff-list">
          {DIFFICULTIES.map(d => (
            <button
              key={d.key}
              className={`diff-card ${selectedDiff.key===d.key ? 'active' : ''}`}
              onClick={() => setSelectedDiff(d)}
            >
              <div className="diff-card-left">
                <span className="diff-clues">{d.label}</span>
                <span className="diff-name">{d.name}</span>
              </div>
              <p className="diff-desc">{d.desc}</p>
              {d.key==='god' && <span className="badge">최소</span>}
            </button>
          ))}
        </div>
        <button className="start-btn" onClick={handleStart}>시작</button>
      </div>
    );
  }

  // 퍼즐 생성 중
  if (screen === 'generating') {
    return (
      <div className="app center-screen">
        <div className="generating-box">
          <div className="spinner" />
          <p>퍼즐 생성 중...</p>
          <p className="gen-sub">{selectedDiff.label} · {selectedDiff.name}</p>
          {isDailyPuzzle && <p className="gen-sub" style={{marginTop:4,color:'#888'}}>오늘의 스도쿠</p>}
        </div>
      </div>
    );
  }

  // 게임 플레이
  if (screen === 'playing') {
    const backToTabs = () => setScreen('tabs');
    return (
      <div className="app">
        <header className="header">
          <button className="back-btn" onClick={backToTabs}>←</button>
          <div className="header-center">
            <span className="playing-diff">{game.diff.label} · {game.diff.name}</span>
            {isDailyPuzzle && <span className="daily-badge-playing">오늘</span>}
          </div>
          <div className="header-right">
            <div className="mistake-counter">
              {Array(MAX_MISTAKES).fill(null).map((_,i) => (
                <span key={i} className={`mistake-dot ${i<game.mistakes?'filled':''}`} />
              ))}
            </div>
            <button className="pause-btn" onClick={() => setPaused(p=>!p)}>
              {paused ? '▶' : '⏸'}
            </button>
            <div className="timer">{formatTime(game.time)}</div>
          </div>
        </header>

        {paused ? (
          <div className="paused-overlay">
            <p>일시정지</p>
            <button onClick={() => setPaused(false)}>계속하기</button>
          </div>
        ) : (
          <>
            <Board
              board={game.board} puzzle={game.puzzle} solution={game.solution}
              selected={game.selected} onSelect={handleSelect}
              conflicts={game.conflicts} notes={game.notes}
            />
            <NumberPad
              onNumber={handleNumber} onErase={handleErase}
              onNote={() => setNoteMode(m=>!m)} noteMode={noteMode}
              hintCount={game.hintCount} onHint={handleHint}
              onUndo={handleUndo} canUndo={history.length>0}
              onFillCell={handleFillCell} onFillAll={handleFillAll}
              hasSelected={!!game.selected&&game.board[game.selected[0]][game.selected[1]]===0&&game.puzzle[game.selected[0]][game.selected[1]]===0}
            />
          </>
        )}

        {/* 실패 */}
        {game.failed && (
          <div className="complete-overlay">
            <div className="complete-card">
              <div className="complete-emoji">💀</div>
              <h2>실패</h2>
              <p className="complete-diff">실수 {MAX_MISTAKES}회 초과</p>
              <p className="complete-time">{formatTime(game.time)}</p>
              <div className="complete-btns">
                <button onClick={() => isDailyPuzzle ? handleDailyStart({station:dailyStation}) : handleStart()}>다시 하기</button>
                <button className="outline" onClick={backToTabs}>홈으로</button>
              </div>
            </div>
          </div>
        )}

        {/* 완성 */}
        {game.complete && (
          <div className="complete-overlay">
            <div className="complete-card">
              {isDailyPuzzle ? (
                <>
                  <div className="complete-emoji">🗝️</div>
                  <h2>완성!</h2>
                  <p className="complete-diff">{game.diff.label} · {game.diff.name}</p>
                  <p className="complete-time">{formatTime(game.time)}</p>
                  <p className="complete-hint">역 카드가 잠금 해제됩니다</p>
                  <div className="complete-btns">
                    <button className="unlock-btn" onClick={() => setScreen('stationCard')}>역 카드 해금 →</button>
                    <button className="outline" onClick={backToTabs}>홈으로</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="complete-emoji">🎉</div>
                  <h2>완성!</h2>
                  <p className="complete-diff">{game.diff.label} · {game.diff.name}</p>
                  <p className="complete-time">{formatTime(game.time)}</p>
                  <div className="complete-btns">
                    <button onClick={handleStart}>다시 하기</button>
                    <button className="outline" onClick={() => setScreen('setup')}>난이도 변경</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 탭 화면 ──
  const isMapTab = activeTab === 'map';
  return (
    <div className="tabs-screen">
      {/* 공통 앱 헤더 — 지도 탭에선 LineSelect 자체 헤더 사용 */}
      {!isMapTab && (
        <header className="app-header">
          <div className="app-header-brand">
            <span className="app-header-logo">🚇</span>
            <div>
              <h1 className="app-header-title">서브웨이 스도쿠</h1>
              <p className="app-header-sub">서울 지하철 퍼즐 여행</p>
            </div>
          </div>
          <button className="about-btn" onClick={() => setScreen('about')}>만든이</button>
        </header>
      )}

      {/* 탭 콘텐츠 */}
      <main className={`tabs-content${isMapTab ? ' map-active' : ''}`}>
        {activeTab === 'today' && (
          <Home onDailyPuzzle={({ station, diffIdx }) => setPendingDaily({ station, diffIdx })} />
        )}
        {activeTab === 'map' && (
          <LineSelect
            onSelect={(line) => { setSelectedLine(line); setScreen('setup'); }}
            onAbout={() => setScreen('about')}
          />
        )}
        {activeTab === 'records' && (
          <RecordsTab />
        )}
      </main>

      {/* 하단 탭바 */}
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* 오늘의 스도쿠 시작 모달 */}
      {pendingDaily && (
        <DailyModal
          station={pendingDaily.station}
          diffIdx={pendingDaily.diffIdx}
          onClose={() => setPendingDaily(null)}
          onStart={() => {
            handleDailyStart(pendingDaily);
            setPendingDaily(null);
          }}
        />
      )}
    </div>
  );
}
