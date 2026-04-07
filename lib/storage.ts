import { DailyNewsRecord, StorageData, FullAnalysisResult } from "@/types/news";

const STORAGE_KEY = "so-what-news-data";

// ── 추상화된 저장소 인터페이스 ──
// 추후 Supabase/DB로 교체할 때 이 인터페이스를 구현하면 된다.

// 시드 데이터 버전. 시드를 갱신할 때마다 이 값을 올려야 한다.
const SEED_VERSION = "4";
const SEED_VERSION_KEY = "so-what-news-seed-version";

export function loadAllData(): StorageData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StorageData;
  } catch {
    return {};
  }
}

/**
 * 시드 데이터를 로드한다.
 * 버전이 바뀌면 기존 데이터를 덮어쓰고 새 시드를 적용한다.
 */
export async function ensureSeedData(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const loadedVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (loadedVersion === SEED_VERSION) return false;

  try {
    const res = await fetch("/seed-data.json");
    if (!res.ok) return false;
    const data: StorageData = await res.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
    return true;
  } catch {
    return false;
  }
}

export function loadDailyRecord(date: string): DailyNewsRecord | null {
  const data = loadAllData();
  return data[date] || null;
}

export function saveDailyRecord(record: DailyNewsRecord): void {
  const data = loadAllData();
  data[record.date] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function saveAnalysisResult(
  date: string,
  analysis: FullAnalysisResult
): void {
  const data = loadAllData();
  const record = data[date];
  if (!record) return;
  record.analysis = analysis;
  data[date] = record;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAvailableDates(): string[] {
  const data = loadAllData();
  return Object.keys(data).sort().reverse();
}

export function deleteDailyRecord(date: string): void {
  const data = loadAllData();
  delete data[date];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
