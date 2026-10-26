'use client'

// ============================================================
// САПЁР — классическая логическая игра
// ------------------------------------------------------------
// • ЛКМ — открыть клетку, ПКМ — поставить флажок
// • На телефоне: кнопка «Режим ⚑» — тап ставит/снимает флажок
// • Первый клик всегда безопасен: мины расставляются после него
// • Открытие «нулевых» областей каскадом, как в классике
// • Рекорды времени по трём уровням — в localStorage
// ============================================================

import { useCallback, useEffect, useRef, useState } from 'react'

interface Level {
  id: string
  name: string
  w: number
  h: number
  mines: number
  hint: string
}

const LEVELS: Level[] = [
  { id: 'beginner', name: 'Новичок', w: 9, h: 9, mines: 10, hint: '9×9 · 10 мин' },
  { id: 'amateur', name: 'Любитель', w: 16, h: 16, mines: 40, hint: '16×16 · 40 мин' },
  { id: 'pro', name: 'Профи', w: 30, h: 16, mines: 99, hint: '30×16 · 99 мин' },
]

interface Cell {
  mine: boolean
  adj: number
  revealed: boolean
  flagged: boolean
  boom: boolean
}

type Status = 'idle' | 'play' | 'win' | 'lose'

const BEST_KEY = 'saper-best'

// Классические цвета цифр соседства
const NUM_COLORS = [
  '',
  'text-sky-700',
  'text-emerald-700',
  'text-rose-600',
  'text-violet-700',
  'text-amber-700',
  'text-teal-700',
  'text-zinc-900',
  'text-zinc-500',
]

function makeGrid(w: number, h: number): Cell[][] {
  return Array.from({ length: h }, () =>
    Array.from({ length: w }, () => ({ mine: false, adj: 0, revealed: false, flagged: false, boom: false })),
  )
}

function neighbors(w: number, h: number, r: number, c: number): Array<[number, number]> {
  const out: Array<[number, number]> = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < h && nc >= 0 && nc < w) out.push([nr, nc])
    }
  }
  return out
}

/** Расставить мины, не трогая безопасную зону вокруг первого клика */
function placeMines(grid: Cell[][], w: number, h: number, mines: number, safeR: number, safeC: number): Cell[][] {
  const g = grid.map((row) => row.map((cell) => ({ ...cell })))
  const forbidden = new Set<string>([`${safeR}:${safeC}`])
  for (const [nr, nc] of neighbors(w, h, safeR, safeC)) forbidden.add(`${nr}:${nc}`)

  let placed = 0
  while (placed < mines) {
    const r = Math.floor(Math.random() * h)
    const c = Math.floor(Math.random() * w)
    if (forbidden.has(`${r}:${c}`) || g[r][c].mine) continue
    g[r][c].mine = true
    placed++
  }
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (g[r][c].mine) continue
      g[r][c].adj = neighbors(w, h, r, c).filter(([nr, nc]) => g[nr][nc].mine).length
    }
  }
  return g
}

/** Каскадное открытие; возвращает новое поле и признак взрыва */
function revealCells(grid: Cell[][], w: number, h: number, r0: number, c0: number): { grid: Cell[][]; boom: boolean } {
  const g = grid.map((row) => row.map((cell) => ({ ...cell })))
  if (g[r0][c0].flagged || g[r0][c0].revealed) return { grid: g, boom: false }

  if (g[r0][c0].mine) {
    g[r0][c0].revealed = true
    g[r0][c0].boom = true
    return { grid: g, boom: true }
  }

  const stack: Array<[number, number]> = [[r0, c0]]
  while (stack.length) {
    const [r, c] = stack.pop()!
    const cell = g[r][c]
    if (cell.revealed || cell.flagged) continue
    cell.revealed = true
    if (cell.adj === 0) {
      for (const [nr, nc] of neighbors(w, h, r, c)) {
        if (!g[nr][nc].revealed && !g[nr][nc].mine) stack.push([nr, nc])
      }
    }
  }
  return { grid: g, boom: false }
}

function readBest(): Record<string, number> {
  try {
    const raw = localStorage.getItem(BEST_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SaperGame() {
  const [level, setLevel] = useState<Level>(LEVELS[0])
  const [grid, setGrid] = useState<Cell[][]>(() => makeGrid(LEVELS[0].w, LEVELS[0].h))
  const [status, setStatus] = useState<Status>('idle')
  const [time, setTime] = useState(0)
  const [flagMode, setFlagMode] = useState(false)
  const [best, setBest] = useState<Record<string, number>>({})
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const flags = grid.flat().filter((c) => c.flagged).length

  // Таймер идёт только во время игры
  useEffect(() => {
    if (status === 'play') {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  // Рекорды читаем один раз при монтировании: localStorage есть только
  // в браузере, поэтому на этапе SSR поле пустое — это осознанный паттерн
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBest(readBest())
  }, [])

  const reset = useCallback((lv: Level = level) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setLevel(lv)
    setGrid(makeGrid(lv.w, lv.h))
    setStatus('idle')
    setTime(0)
  }, [level])

  // Сохранение рекорда при победе
  useEffect(() => {
    if (status !== 'win') return
    try {
      const all = readBest()
      const prev = all[level.id]
      if (prev === undefined || time < prev) {
        all[level.id] = time
        localStorage.setItem(BEST_KEY, JSON.stringify(all))
        // Синхронизируем состояние с уже записанным хранилищем
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBest(all)
      }
    } catch {}
  }, [status, time, level.id])

  const openCell = (r: number, c: number) => {
    if (status === 'win' || status === 'lose') return
    if (grid[r][c].flagged) return

    // Первый клик: расставляем мины и стартуем
    let g = grid
    if (status === 'idle') {
      g = placeMines(grid, level.w, level.h, level.mines, r, c)
      setStatus('play')
    }

    const { grid: next, boom } = revealCells(g, level.w, level.h, r, c)
    if (boom) {
      // Показать все мины, отметить неверные флажки
      for (let rr = 0; rr < level.h; rr++) {
        for (let cc = 0; cc < level.w; cc++) {
          if (next[rr][cc].mine && !next[rr][cc].flagged) next[rr][cc].revealed = true
          if (!next[rr][cc].mine && next[rr][cc].flagged) next[rr][cc].flagged = false
        }
      }
      setGrid(next)
      if (timerRef.current) clearInterval(timerRef.current)
      setStatus('lose')
      return
    }

    const revealed = next.flat().filter((x) => x.revealed).length
    if (revealed === level.w * level.h - level.mines) {
      // Победа: автоматически флажим оставшиеся мины
      for (let rr = 0; rr < level.h; rr++) {
        for (let cc = 0; cc < level.w; cc++) {
          if (next[rr][cc].mine) next[rr][cc].flagged = true
        }
      }
      if (timerRef.current) clearInterval(timerRef.current)
      setStatus('win')
    }
    setGrid(next)
  }

  const toggleFlag = (r: number, c: number) => {
    if (status === 'win' || status === 'lose') return
    if (status === 'idle') setStatus('play')
    setGrid((prev) => {
      const g = prev.map((row) => row.map((cell) => ({ ...cell })))
      if (g[r][c].revealed) return g
      g[r][c].flagged = !g[r][c].flagged
      return g
    })
  }

  const face = status === 'lose' ? '😵' : status === 'win' ? '😎' : '🙂'
  const bestTime = best[level.id]
  const cellPx = level.id === 'beginner' ? 'minmax(0, 2.5rem)' : 'minmax(0, 2rem)'

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      {/* Панель управления */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {LEVELS.map((lv) => (
            <button
              key={lv.id}
              onClick={() => reset(lv)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                lv.id === level.id
                  ? 'border-amber-500 bg-amber-100 text-amber-900'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {lv.name}
              <span className="ml-1 hidden text-xs text-zinc-500 sm:inline">{lv.hint}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setFlagMode((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            flagMode
              ? 'border-rose-500 bg-rose-100 text-rose-900'
              : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
          }`}
          aria-pressed={flagMode}
        >
          ⚑ Режим флажков {flagMode ? 'вкл' : 'выкл'}
        </button>
      </div>

      {/* Табло */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-zinc-300 bg-zinc-200 px-4 py-3 shadow-inner">
        <div className="rounded-lg bg-zinc-900 px-3 py-1 font-mono text-xl font-bold text-rose-500 tabular-nums">
          {String(level.mines - flags).padStart(3, '0')}
        </div>
        <button
          onClick={() => reset()}
          className="rounded-full border border-zinc-400 bg-zinc-100 px-4 py-1 text-2xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Начать заново"
        >
          {face}
        </button>
        <div className="rounded-lg bg-zinc-900 px-3 py-1 font-mono text-xl font-bold text-rose-500 tabular-nums">
          {fmtTime(time)}
        </div>
      </div>

      {/* Поле */}
      <div className="overflow-x-auto rounded-xl border border-zinc-300 bg-zinc-200 p-2 shadow-inner">
        <div
          className="mx-auto grid w-fit gap-px select-none"
          style={{ gridTemplateColumns: `repeat(${level.w}, ${cellPx})` }}
          role="grid"
          aria-label={`Поле сапёра ${level.w} на ${level.h}`}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`
              const label = cell.revealed
                ? cell.mine
                  ? cell.boom
                    ? '💥'
                    : '💣'
                  : cell.adj > 0
                    ? String(cell.adj)
                    : ''
                : cell.flagged
                  ? '🚩'
                  : ''
              return (
                <button
                  key={key}
                  role="gridcell"
                  aria-label={`Клетка ${r + 1}:${c + 1}${cell.revealed ? ', открыта' : ''}`}
                  onClick={() => (flagMode ? toggleFlag(r, c) : openCell(r, c))}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    toggleFlag(r, c)
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-sm text-sm font-bold transition-colors sm:h-[2rem] sm:w-[2rem] ${
                    cell.revealed
                      ? cell.boom
                        ? 'bg-rose-500'
                        : 'bg-zinc-100'
                      : 'bg-gradient-to-b from-zinc-100 to-zinc-300 shadow-sm hover:from-zinc-50 hover:to-zinc-200'
                  } ${cell.revealed && !cell.mine && cell.adj > 0 ? NUM_COLORS[cell.adj] : ''} ${
                    status === 'lose' && !cell.mine && label === '🚩' ? 'bg-rose-100' : ''
                  }`}
                >
                  {label}
                </button>
              )
            }),
          )}
        </div>
      </div>

      {/* Статус и подсказки */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600">
        <p>
          {status === 'idle' && 'Откройте первую клетку — мины расставятся после неё, первый клик всегда безопасен.'}
          {status === 'play' && 'ЛКМ — открыть, ПКМ — флажок. На телефоне включите режим ⚑.'}
          {status === 'win' && `Победа за ${fmtTime(time)}! Все мины обезврежены.`}
          {status === 'lose' && 'Взрыв! Попробуйте ещё раз — нажмите на смайлик.'}
        </p>
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-amber-900">
          🏆 Рекорд «{level.name}»: {bestTime !== undefined ? fmtTime(bestTime) : '—'}
        </p>
      </div>
    </div>
  )
}
