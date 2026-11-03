// ============================================================
// ИГРОТЕКА — витрина игр («магазин»)
// ------------------------------------------------------------
// Это лёгкая страница-визитка: карточки со ссылками и проспекты.
// Каждая игра живёт на своём собственном адресе и публикуется
// отдельно, поэтому:
//   • правка одной игры не трогает витрину и остальные игры;
//   • новая игра не требует «полной пересборки» — достаточно
//     дописать один блок в список GAMES ниже.
//
// ➕ КАК ДОБАВИТЬ НОВУЮ ИГРУ (по образцу соседних блоков):
//    1. Опубликуйте игру: репозиторий на GitHub → Vercel → Deploy.
//    2. Скопируйте её адрес вида https://имя.vercel.app
//    3. Допишите в список GAMES ниже новый блок: карточка (emoji,
//       title, desc, url, цвета) + проспект (blocks или short).
//    Если игра ещё готовится — url можно не указывать вовсе:
//    карточка станет заглушкой «Скоро», а после публикации просто
//    допишите строку url.
// ============================================================

interface ProspectBlock {
  icon: string
  label: string
  text: string
}

interface GameMeta {
  emoji: string
  title: string
  desc: string
  url?: string // без адреса карточка превращается в заглушку «Скоро»
  chip: string
  border: string
  link: string
  video?: string // адрес деморолика (mp4) — встраивается в проспект игры
  prospect?: {
    short?: string // короткий проспект одним абзацем
    blocks?: ProspectBlock[] // полный проспект: 4 блока
  }
}

const GAMES: GameMeta[] = [
  {
    emoji: '🧨',
    title: 'Сапёр',
    desc: 'Классика жанра: три поля, флажки, «аккорд» профи и рекорды времени.',
    url: 'https://saper-fawn.vercel.app',
    chip: 'bg-amber-100',
    border: 'hover:border-amber-400',
    link: 'text-amber-700',
    prospect: {
      short:
        'Классика в аккуратном современном исполнении — коротко и по делу. Правила осваиваются за минуту: открывайте клетки, ставьте флажки (на телефоне — длинное нажатие), а если на открытой цифре уже стоит нужное число флажков, кликните по ней — соседи откроются сами, это «аккорд» профи. Три поля — 9×9, 16×16 и большое 30×16, таймер и личные рекорды на каждом уровне.',
    },
  },
  {
    emoji: '🧠',
    title: 'Соционический тренажёр',
    desc: 'Викторина по 16 типам: от дихотомий до модель А и интертипных отношений.',
    url: 'https://socionika.vercel.app',
    chip: 'bg-emerald-100',
    border: 'hover:border-emerald-400',
    link: 'text-emerald-700',
    prospect: {
      blocks: [
        {
          icon: '👥',
          label: 'Кому подойдёт',
          text: 'Изучающим соционику на любом уровне: новичкам, которые только знакомятся с 16 типами, практикам, оттачивающим скорость распознавания, и тем, кто готовится к типированию.',
        },
        {
          icon: '⚙️',
          label: 'Что внутри',
          text: 'Шесть тем в отдельных режимах: 16 типов личности, дихотомии, чтение аббревиатур, 8 функций и модель А, квадры, отношения (дуалы, конфликты, зеркальные). Плюс полный курс, смешанный режим и глоссарий терминов.',
        },
        {
          icon: '🎯',
          label: 'Цель игрока',
          text: 'Научиться мгновенно и уверенно определять тип информации: видеть за аббревиатурой функции, за функциями — квадру, а за квадрой — отношения между людьми.',
        },
        {
          icon: '🏆',
          label: 'Что получите',
          text: 'Раунды викторины с объяснением к каждому ответу, счёт и процент точности, личные рекорды по темам — прогресс сохраняется прямо в браузере, без регистрации.',
        },
      ],
    },
  },
  {
    emoji: '🏪',
    title: 'Пульс сети',
    desc: 'Бизнес-симулятор: примите сеть магазинов «Браво» как есть и 12 месяцев ведите её к линии идеального управления.',
    url: 'https://bravo-amber.vercel.app',
    chip: 'bg-rose-100',
    border: 'hover:border-rose-400',
    link: 'text-rose-700',
    video: 'https://bravo-amber.vercel.app/puls-seti-demo.mp4',
    prospect: {
      blocks: [
        {
          icon: '👥',
          label: 'Кому подойдёт',
          text: 'Любителям бизнес-симуляторов и прикладной соционики: здесь HR встречается с экономикой, а каждая должность — это и профессиональный профиль, и соционический тип. Полезна и тем, кто учится управлять людьми: игра честно показывает цену ошибок найма.',
        },
        {
          icon: '⚙️',
          label: 'Что внутри',
          text: 'Сценарий «Компания как есть»: сеть из четырёх магазинов с сильными, случайными и пустыми креслами живёт на живом рынке — спрос покупателей и рынок труда меняются каждый месяц. Рынок кандидатов с типами и резюме, эталоны должностей, анализ любого назначения «до → после», карьерный рост с каскадом вакансий, кризисы и автопилот на трёх скоростях.',
        },
        {
          icon: '🎯',
          label: 'Цель игрока',
          text: 'Держать команду как можно ближе к линии идеального управления: теневой управляющий играет те же условия без ошибок, и его золотая линия всегда рядом на графике. А иногда вы её опережаете — удача любит смелых.',
        },
        {
          icon: '🏆',
          label: 'Что получите',
          text: 'Финальный отчёт владельцу: сколько миллионов гривен вы добавили к стоимости сети, сколько процентов от линии идеала набрали и какие кризисы пережили. Плюс рекорд партии, который захочется побить.',
        },
      ],
    },
  },
  {
    emoji: '🏛️',
    title: 'Виртуальное министерство',
    desc: 'Политический симулятор: реальные кабинеты Украины 2005–2026 прогнаны через алгоритм «Пульса сети». Соберите свой Кабмин и встаньте в рейтинг с историей.',
    url: 'https://vsrtualne-ministersnvo.vercel.app',
    chip: 'bg-sky-100',
    border: 'hover:border-sky-400',
    link: 'text-sky-700',
    prospect: {
      blocks: [
        {
          icon: '👥',
          label: 'Кому подойдёт',
          text: 'Любителям политической истории и прикладной соционики: 13 реальных правительств Украины — от второй Тимошенко до действующего Кабмина — разобраны как команды: кто квадровый единомышленник, а кто конфликтёр в соседнем кресле.',
        },
        {
          icon: '⚙️',
          label: 'Что внутри',
          text: 'Три экрана. «История» — все кабинеты 2005–2026 прогнаны через один алгоритм: компетенции против требований должностей, соционическая посадка, интертипные отношения и квадровый баланс, с поправкой на эпоху (война поднимает вес обороны, кризис — финансов). «Конструктор» — соберите свой Кабмин из 12 должностей и более чем сотни кандидатов: политики и госслужащие, выдающиеся менеджеры и «новые лица», в списках — только профильные кандидатуры, а своих выдвиженцев игрок добавляет сам. «Сравнение» — ваш проект встаёт в общий рейтинг.',
        },
        {
          icon: '🎯',
          label: 'Цель игрока',
          text: 'Обойти лидеров истории: закрыть требования должностей сильными кандидатами, собрать дружную квадру — и не посадить конфликтёров в соседние кресла. Правила честные: ваш кабинет оценивают по тем же критериям, что и реальные правительства.',
        },
        {
          icon: '🏆',
          label: 'Что получите',
          text: 'Место в общем рейтинге кабинетов, разбор по трём осям (компетентность, соционика, сплочённость), список конфликтных пар и ближайший исторический аналог вашего проекта. Оценки — игровая экспертная модель, а не наука; собранный кабинет сохраняется в браузере.',
        },
      ],
    },
  },
]

function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-4">
      <p className="px-4 text-center text-xs leading-relaxed text-zinc-500">
        Игротека · каждая игра живёт на своём адресе · витрина на Next.js, игры опубликованы на Vercel
      </p>
    </footer>
  )
}

export default function Portal() {
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
            Моя коллекция игр: логика, соционика, бизнес и политика. Нажмите «Играть» — игра
            откроется на своём собственном адресе. Ниже — проспекты: кому какая
            подойдёт и что внутри.
          </p>
        </section>

        {/* Карточки игр — по одной на каждый блок списка GAMES */}
        <section className="mx-auto grid w-full max-w-4xl gap-5 px-4 pb-10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) =>
            g.url ? (
              <a
                key={g.title}
                href={g.url}
                aria-label={`Открыть игру «${g.title}» на сайте ${new URL(g.url).hostname}`}
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
                <span className="mt-2 truncate font-mono text-[11px] text-zinc-400">
                  {new URL(g.url).hostname}
                </span>
              </a>
            ) : (
              <div
                key={g.title}
                className="flex flex-col rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${g.chip}`}>
                  {g.emoji}
                </span>
                <h2 className="mt-4 text-xl font-bold text-zinc-900">{g.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{g.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-zinc-400">
                  🚧 Скоро
                </span>
              </div>
            ),
          )}
        </section>

        {/* Проспекты игр */}
        <section className="mx-auto w-full max-w-4xl px-4 pb-16">
          <h2 className="text-2xl font-black tracking-tight text-zinc-900">📖 Проспекты игр</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Коротко о каждой: кто играет, что внутри, к какой цели идти и что останется
            после партии.
          </p>
          {GAMES.map((g) =>
            g.prospect ? (
              <article
                key={g.title}
                className="mt-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
              >
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-6 py-4">
                  <h3 className="text-lg font-bold text-zinc-900">
                    {g.emoji} {g.title}
                  </h3>
                  {g.url && (
                    <span className="flex items-center gap-3">
                      <span className="hidden font-mono text-xs text-zinc-400 sm:inline">
                        {new URL(g.url).hostname}
                      </span>
                      <a
                        href={g.url}
                        className={`rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-zinc-100 ${g.link}`}
                      >
                        Открыть игру ↗
                      </a>
                    </span>
                  )}
                </header>
                {g.prospect.short ? (
                  <p className="px-6 py-5 text-sm leading-relaxed text-zinc-600">
                    {g.prospect.short}
                  </p>
                ) : (
                  g.prospect.blocks && (
                    <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
                      {g.prospect.blocks.map((b) => (
                        <div key={b.label} className="rounded-xl bg-zinc-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">
                            {b.icon} {b.label}
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{b.text}</p>
                        </div>
                      ))}
                    </div>
                  )
                )}
                {g.video && (
                  <div className="border-t border-zinc-100 px-6 py-5">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                      🎬 Деморолик · 2 минуты
                    </p>
                    <video
                      className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-zinc-900 shadow-sm"
                      src={g.video}
                      controls
                      preload="none"
                    />
                    <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                      Суть игры, элементы управления, свободы и ограничения — и живой пример:
                      ошибка → штраф кассе → исправление. Смотрите прямо здесь или
                      <a
                        href={g.video}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-1 font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-600"
                      >
                        в отдельной вкладке ↗
                      </a>.
                    </p>
                  </div>
                )}
              </article>
            ) : null,
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
