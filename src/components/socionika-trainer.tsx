'use client'

// ============================================================
// СОЦИОНИЧЕСКИЙ ТРЕНАЖЁР — викторина по узнаванию соционики
// ------------------------------------------------------------
// Логика вопросов целиком в src/lib/socionics-quiz.ts:
// buildRound() собирает раунд из 10 неповторяющихся вопросов
// с 4 вариантами, правильным ответом и объяснением.
// Здесь только интерфейс: выбор темы → раунд → результат.
// Лучшие результаты по темам хранятся в localStorage.
// ============================================================

import { useCallback, useEffect, useState } from 'react'
import {
  buildRound,
  TOPIC_HINTS,
  TOPIC_LABELS,
  type Question,
  type Topic,
} from '@/lib/socionics-quiz'
import type { QuadraId } from '@/lib/socionics-data'

const BEST_KEY = 'socionika-best'
const ROUND_SIZE = 10

const TOPICS: Topic[] = ['types', 'dichotomies', 'functions', 'quadras', 'relations', 'full']

const TOPIC_ICONS: Record<Topic, string> = {
  types: '🎭',
  dichotomies: '⚖️',
  functions: '⚙️',
  quadras: '🏠',
  relations: '🔗',
  full: '🎲',
}

// Квадровые акценты карточки вопроса
const ACCENTS: Record<QuadraId, { border: string; chip: string }> = {
  alpha: { border: 'border-l-amber-500', chip: 'bg-amber-100 text-amber-900' },
  beta: { border: 'border-l-rose-500', chip: 'bg-rose-100 text-rose-900' },
  gamma: { border: 'border-l-emerald-500', chip: 'bg-emerald-100 text-emerald-900' },
  delta: { border: 'border-l-teal-500', chip: 'bg-teal-100 text-teal-900' },
}

const LETTERS = ['А', 'Б', 'В', 'Г']

function readBest(): Record<string, number> {
  try {
    const raw = localStorage.getItem(BEST_KEY)
    return raw ? (JSON.parse(raw) as Record<string, number>) : {}
  } catch {
    return {}
  }
}

type Phase = 'menu' | 'quiz' | 'result'

export default function SocionikaTrainer() {
  const [phase, setPhase] = useState<Phase>('menu')
  const [topic, setTopic] = useState<Topic>('full')
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [best, setBest] = useState<Record<string, number>>({})

  // Рекорды читаем после монтирования: localStorage есть только
  // в браузере, на SSR поле пустое — это осознанный паттерн
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBest(readBest())
  }, [])

  const startRound = useCallback((t: Topic) => {
    setQuestions(buildRound(t, ROUND_SIZE))
    setTopic(t)
    setIdx(0)
    setChosen(null)
    setCorrectCount(0)
    setPhase('quiz')
  }, [])

  const answer = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    if (i === questions[idx].correct) setCorrectCount((n) => n + 1)
  }

  const next = () => {
    if (idx + 1 >= questions.length) {
      // Финал раунда: обновляем рекорд темы
      // (клэмп 100% — страховка от аномалий счётчика)
      const percent = Math.min(100, Math.round((correctCount / questions.length) * 100))
      try {
        const all = readBest()
        const prev = all[topic]
        if (prev === undefined || percent > prev) {
          all[topic] = percent
          localStorage.setItem(BEST_KEY, JSON.stringify(all))
          setBest(all)
        }
      } catch {}
      setPhase('result')
    } else {
      setIdx(idx + 1)
      setChosen(null)
    }
  }

  // ---------- Меню тем ----------
  if (phase === 'menu') {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-900">Выберите тему</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Раунд — {ROUND_SIZE} вопросов с объяснениями. Рекорды сохраняются по каждой теме.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TOPICS.map((t) => {
            const topicBest = best[t]
            return (
              <button
                key={t}
                onClick={() => startRound(t)}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{TOPIC_ICONS[t]}</span>
                  {topicBest !== undefined && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      рекорд {topicBest}%
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-lg font-bold text-zinc-900 group-hover:text-emerald-700">
                  {TOPIC_LABELS[t]}
                </h3>
                <p className="mt-1 text-sm text-zinc-600">{TOPIC_HINTS[t]}</p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ---------- Итог раунда ----------
  if (phase === 'result') {
    const percent = Math.round((correctCount / questions.length) * 100)
    const verdict =
      percent >= 90
        ? 'Блестяще! Соционика слушается вас.'
        : percent >= 70
          ? 'Отличный результат — до идеала один шаг.'
          : percent >= 50
            ? 'Неплохо! Основа есть, дальше проще.'
            : 'Есть куда расти — пройдите ещё раунд.'
    const topicBest = best[topic]
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-10 text-center">
        <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-8 border-emerald-200 bg-emerald-50">
          <div>
            <div className="text-4xl font-black text-emerald-700">{percent}%</div>
            <div className="text-sm text-emerald-600">
              {correctCount} из {questions.length}
            </div>
          </div>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-zinc-900">{verdict}</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Тема «{TOPIC_LABELS[topic]}» · личный рекорд: {topicBest !== undefined ? `${topicBest}%` : '—'}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => startRound(topic)}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Ещё раунд
          </button>
          <button
            onClick={() => setPhase('menu')}
            className="rounded-xl border border-zinc-300 bg-white px-5 py-3 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            К темам
          </button>
        </div>
      </div>
    )
  }

  // ---------- Раунд ----------
  if (!questions.length) return null
  const q = questions[idx]
  const accent = ACCENTS[q.accent] ?? ACCENTS.alpha
  const answered = chosen !== null

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      {/* Прогресс раунда */}
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-zinc-600">
        <span>
          Вопрос {idx + 1} из {questions.length}
        </span>
        <span className="rounded-full bg-zinc-100 px-3 py-1">
          Верно: {correctCount}
        </span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-zinc-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Карточка вопроса */}
      <div className={`rounded-2xl border border-l-8 ${accent.border} border-zinc-200 bg-white p-5 shadow-sm`}>
        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${accent.chip}`}>
          {TOPIC_LABELS[q.topic]}
        </span>
        <h2 className="mt-3 text-lg font-bold leading-snug text-zinc-900 sm:text-xl">{q.prompt}</h2>

        <div className="mt-5 grid gap-2.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct
            const isChosen = i === chosen
            let cls = 'border-zinc-300 bg-white hover:border-emerald-400 hover:bg-emerald-50'
            if (answered) {
              if (isCorrect) cls = 'border-emerald-500 bg-emerald-50'
              else if (isChosen) cls = 'border-rose-500 bg-rose-50'
              else cls = 'border-zinc-200 bg-white opacity-60'
            }
            return (
              <button
                key={i}
                onClick={() => answer(i)}
                disabled={answered}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${cls} ${
                  answered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-600">
                  {LETTERS[i]}
                </span>
                <span className="text-sm leading-snug text-zinc-800 sm:text-base">{opt}</span>
                {answered && isCorrect && <span className="ml-auto text-emerald-600">✓</span>}
                {answered && isChosen && !isCorrect && <span className="ml-auto text-rose-600">✗</span>}
              </button>
            )
          })}
        </div>

        {/* Объяснение и переход дальше */}
        {answered && (
          <div className="mt-5 rounded-xl bg-zinc-50 p-4">
            <p className="text-sm leading-relaxed text-zinc-700">{q.explanation}</p>
            <button
              onClick={next}
              autoFocus
              className="mt-4 w-full rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-zinc-700 sm:w-auto"
            >
              {idx + 1 >= questions.length ? 'Итог раунда →' : 'Дальше →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
