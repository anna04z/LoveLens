'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import BottomNav from '../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: { title: '四个家族', subtitle: '每一种依恋，都有它的样子' },
  en: { title: 'Four Families', subtitle: 'Every attachment style has its own beauty' },
  ko: { title: '네 가족', subtitle: '모든 애착 방식에는 그만의 아름다움이 있어요' },
}

const families = [
  {
    id: 'secure',
    emoji: '🌿',
    color: '#6ee7b7',
    bg: '#ecfdf5',
    border: '#a7f3d0',
    zh: { name: '安全型家族', desc: '内在稳定，能亲密也能独立。№1–6', types: ['№1 明眼的共建者', '№2 稳定的建筑师', '№3 诚实的同行者', '№4 静默的守护者', '№5 温柔的陪伴者', '№6 深情的连接者'] },
    en: { name: 'Secure Family', desc: 'Inner stability, capable of both intimacy and independence. №1–6', types: ['№1 The Clear-Eyed Co-Builder', '№2 The Steady Architect', '№3 The Honest Companion', '№4 The Silent Guardian', '№5 The Gentle Companion', '№6 The Deep Connector'] },
    ko: { name: '안정형 가족', desc: '내면이 안정되어 있어, 친밀함도 독립도 모두 가능해요. №1–6', types: ['№1 눈 밝은 공동 건축가', '№2 안정된 건축가', '№3 솔직한 동반자', '№4 조용한 수호자', '№5 다정한 동반자', '№6 깊은 연결자'] },
  },
  {
    id: 'anxious',
    emoji: '🔥',
    color: '#fca5a5',
    bg: '#fff1f2',
    border: '#fecdd3',
    zh: { name: '焦虑型家族', desc: '深深在乎，渴望被看见，害怕失去。№7–12', types: ['№7 热烈的追求者', '№8 付出型的恋人', '№9 紧抓的共情者', '№10 清醒的焦虑者', '№11 热切的证明者', '№12 温柔的候鸟'] },
    en: { name: 'Anxious Family', desc: 'Deeply invested, longing to be seen, afraid to lose. №7–12', types: ['№7 The Passionate Pursuer', '№8 The Devoted Giver', '№9 The Clinging Empath', '№10 The Self-Aware Worrier', '№11 The Eager Prover', '№12 The Tender Bird'] },
    ko: { name: '불안형 가족', desc: '깊이 신경 쓰고, 보여지길 원하고, 잃는 게 두려워요. №7–12', types: ['№7 열정적인 추구자', '№8 헌신형 연인', '№9 매달리는 공감자', '№10 명료한 불안자', '№11 열정적인 증명자', '№12 다정한 철새'] },
  },
  {
    id: 'avoidant',
    emoji: '🌲',
    color: '#86efac',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    zh: { name: '回避型家族', desc: '爱得深沉，只是不擅长靠近。№13–18', types: ['№13 沉默的奉献者', '№14 自由的灵魂', '№15 克制的理性者', '№16 温柔的旁观者', '№17 清晰的独行者', '№18 安静的岸'] },
    en: { name: 'Avoidant Family', desc: 'Love deeply, just not good at getting close. №13–18', types: ['№13 The Quiet Devotee', '№14 The Free Spirit', '№15 The Reserved Rationalist', '№16 The Tender Observer', '№17 The Clear Solo', '№18 The Quiet Shore'] },
    ko: { name: '회피형 가족', desc: '깊이 사랑하지만, 가까이 가는 게 서툴러요. №13–18', types: ['№13 침묵의 헌신자', '№14 자유로운 영혼', '№15 절제된 이성주의자', '№16 다정한 관찰자', '№17 명료한 독행자', '№18 조용한 해변'] },
  },
  {
    id: 'disorganized',
    emoji: '🌊',
    color: '#c4b5fd',
    bg: '#faf5ff',
    border: '#ddd6fe',
    zh: { name: '混乱型家族', desc: '想靠近又害怕，爱得复杂而真实。№19–24', types: ['№19 情感的潮汐', '№20 追寻的理想主义者', '№21 清醒的撕裂者', '№22 飞蛾扑火型', '№23 沉默的矛盾者', '№24 闪电型'] },
    en: { name: 'Disorganized Family', desc: 'Want closeness but fear it — love that is complex and real. №19–24', types: ['№19 The Emotional Tide', '№20 The Searching Idealist', '№21 The Conscious Torn', '№22 The Moth to Flame', '№23 The Silent Paradox', '№24 The Lightning Type'] },
    ko: { name: '혼란형 가족', desc: '가까워지고 싶지만 두렵고, 복잡하고 진실한 사랑이에요. №19–24', types: ['№19 감정의 조수', '№20 탐구하는 이상주의자', '№21 의식하는 갈등자', '№22 불꽃에 뛰어드는 나방', '№23 침묵하는 역설자', '№24 번개형'] },
  },
]

export default function FamiliesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const t = ui[lang]

  return (
    <>
      <div className="min-h-screen bg-rose-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-6">

          <div className="text-center">
            <h1 className="text-2xl font-bold text-rose-400 mb-1">🌸 {t.title}</h1>
            <p className="text-rose-300 text-sm">{t.subtitle}</p>
          </div>

          {families.map(f => {
            const content = f[lang]
            return (
              <div
                key={f.id}
                className="rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-all"
                style={{ backgroundColor: f.bg, border: `1px solid ${f.border}` }}
                onClick={() => router.push(`/families/${f.id}?lang=${lang}`)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{f.emoji}</span>
                  <div>
                    <h2 className="font-bold text-gray-800">{content.name}</h2>
                    <p className="text-gray-500 text-xs">{content.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {content.types.map((type, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-white text-gray-500"
                      style={{ border: `1px solid ${f.border}` }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}

        </div>
      </div>
      <BottomNav lang={lang} />
    </>
  )
}