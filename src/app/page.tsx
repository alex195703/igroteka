'use client'

// ============================================================
// ИГРОТЕКА — личный игровой портал
// ------------------------------------------------------------
// Один маршрут «/» + hash-навигация: адрес меняется после #,
// поэтому портал работает и в песочнице, и на Vercel без
// серверных настроек. Игры — самостоятельные компоненты:
//   #/saper      — классический «Сапёр»
//   #/socionika  — викторина по соционике
//   #/bravo      — бизнес-симулятор торговой сети
// Каждый прогресс живёт в localStorage своего браузера.
// ============================================================

import { useEffect, useState } from 'react'
import SaperGame from '@/components/saper-game'
import SocionikaTrainer from '@/components/socionika-trainer'
import BravoSimulator from '@/components/bravo-game'

interface GameMeta {
  route: string
  emoji: string
  title: string
  desc: string
  chip: string
  border: string
  link: string
}

const GAMES: GameMeta[] = [
  {
    route: '/saper',
    emoji: '🧨',
    title: 'Сапёр',
    desc: 'Классика жанра: откройте все клетки, не наступив на мину. Три уровня сложности, флажки и рекорды времени.',
    chip: 'bg-amber-100',
    border: 'hover:border-amber-400',
    link: 'text-amber-700',
  },
  {
    route: '/socionika',
    emoji: '🧠',
    title: 'Соционический тренажёр',
    desc: 'Викторина по 16 типам: дихотомии, функции, квадры и отношения. Раунды по 10 вопросов с объяснениями.',
    chip: 'bg-emerald-100',
    border: 'hover:border-emerald-400',
    link: 'text-emerald-700',
  },
  {
    route: '/bravo',
    emoji: '🏪',
    title: 'Сеть магазинов «Браво»',
    desc: 'Бизнес-симулятор: наймите команду менеджеров — зарплаты в гривнах по реальному рынку Украины, кризисы и итоговый отчёт.',
    chip: 'bg-rose-100',
    border: 'hover:border-rose-400',
    link: 'text-rose-700',
  },
]

function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-4">
      <p className="px-4 text-center text-xs leading-relaxed text-zinc-500">
        Игротека · весь прогресс хранится в вашем браузере · собрано на Next.js и опубликовано на Vercel
      </p>
    </footer>
  )
}

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 via-white to-zinc-50">
      <main className="flex-1">
        {/* Герой */}
        <section className="px-4 pb-4 pt-14 text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-4xl shadow-lg">
            🎮
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-zinc-900 sm:text-5xl">
            Игротека
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
            Все игры в одном месте: логика, соционика и бизнес. Играйте с телефона
            или компьютера — прогресс каждого сохраняется автоматически.
          </p>
        </section>

        {/* Карточки игр */}
        <section className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-14 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => (
            <a
              key={g.route}
              href={`#${g.route}`}
              className={`group flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${g.border}`}
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${g.chip}`}>
                {g.emoji}
              </span>
              <h2 className="mt-4 text-xl font-bold text-zinc-900">{g.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{g.desc}</p>
              <span className={`mt-4 inline-flex items-center gap-1 text-sm font-bold ${g.link}`}>
                Играть
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function GameShell({
  emoji,
  title,
  children,
}: {
  emoji: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4">
          <a
            href="#/"
            className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
          >
            ← Игротека
          </a>
          <span className="truncate font-bold text-zinc-900">
            {emoji} {title}
          </span>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function Portal() {
  const [route, setRoute] = useState('')

  // Hash-навигация: адрес после # решает, что показывать
  useEffect(() => {
    const sync = () => setRoute(window.location.hash.replace(/^#/, ''))
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  // При смене игры — наверх страницы
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  if (route === '/saper') {
    return (
      <GameShell emoji="🧨" title="Сапёр">
        <SaperGame />
      </GameShell>
    )
  }
  if (route === '/socionika') {
    return (
      <GameShell emoji="🧠" title="Соционический тренажёр">
        <SocionikaTrainer />
      </GameShell>
    )
  }
  if (route === '/bravo') {
    return (
      <GameShell emoji="🏪" title="Сеть магазинов «Браво»">
        <BravoSimulator />
      </GameShell>
    )
  }
  return <Home />
}
