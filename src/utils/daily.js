import { LINE2_STATIONS } from '../data/line2Stations';

const EPOCH = new Date(2024, 0, 1); // 기산일

function daysSinceEpoch() {
  return Math.floor((Date.now() - EPOCH.getTime()) / 86400000);
}

/** 오늘의 역 (날짜 기반 결정론적 선택) */
export function getDailyStation() {
  const days = daysSinceEpoch();
  return LINE2_STATIONS[Math.abs(days) % LINE2_STATIONS.length];
}

/**
 * 오늘의 난이도 인덱스 (DIFFICULTIES 배열 기준)
 * 고수(2) · 마스터(3) · 신의영역(4) 사이클, 극한 가중치 높음
 */
export function getDailyDiffIdx() {
  const days = daysSinceEpoch();
  const pattern = [2, 3, 4, 3, 4, 2, 4]; // 7일 주기, 4(극한)이 3/7
  return pattern[Math.abs(days) % pattern.length];
}
