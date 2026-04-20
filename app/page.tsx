'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const content = {
  zh: {
    title: 'LoveLens',
    subtitle: '一个关于你在爱里是什么样子的测试',
    start: '开始测试',
    chooseLanguage: '选择你的语言',
    sections: [
      { emoji: '🪞', title: '这只是一个测试', body: '不是判决，不是标签，不是定义你是谁的工具。48 个问题不可能装下一个完整的人。你比任何一个代码、任何一个类型，都要复杂得多、丰富得多、可爱得多。' },
      { emoji: '💫', title: '面对不同的人，你会是不同的你', body: '你的"类型"不是永远不变的。遇到让你感到安全的人，你会变得更稳、更会表达；遇到让你不安的人，你可能会突然变得焦虑、缩起来。两个都是你。' },
      { emoji: '🌱', title: '类型会随人生阶段变化', body: '这个测试测的是你"现在"——不是你"永远"。几年后再做一次，结果可能不一样。那不是测试不准，是你成长了、走了更远的路。' },
      { emoji: '🌸', title: '没有好类型，没有坏类型', body: '安全型不是"正确答案"，焦虑型不是"需要修复的"，回避型不是"不会爱的"，混乱型不是"有问题的"。每一种类型都有它的美。' },
      { emoji: '🌿', title: '爱需要磨合', body: '没有"天生合适"的两个人——只有"愿意磨合"的两个人。感情最重要的不是找到对的人，是两个人一起，慢慢变成对彼此对的人。' },
    ]
  },
  en: {
    title: 'LoveLens',
    subtitle: 'A test about who you are, in love.',
    start: 'Start Test',
    chooseLanguage: 'Choose your language',
    sections: [
      { emoji: '🪞', title: 'This is just a test', body: 'Not a verdict, not a label. 48 questions can\'t hold a whole person. You are more complex, more layered, more lovable than any code or type.' },
      { emoji: '💫', title: 'You become a different you, with different people', body: 'Your "type" isn\'t fixed forever. With someone who makes you feel safe, you become steadier. With someone who makes you anxious, you might withdraw. Both are you.' },
      { emoji: '🌱', title: 'Types shift with life stages', body: 'This test measures who you are now — not who you\'ll always be. If you take it again in a few years, the result might be different. That\'s you growing.' },
      { emoji: '🌸', title: 'No good or bad types', body: 'Secure isn\'t the right answer. Anxious isn\'t something to fix. Avoidant isn\'t not knowing how to love. Every type has its beauty.' },
      { emoji: '🌿', title: 'Love is about meeting each other halfway', body: 'There\'s no such thing as two people who are naturally meant for each other — only two people who are willing to meet each other halfway.' },
    ]
  },
  ko: {
    title: 'LoveLens',
    subtitle: '사랑 앞에서의 당신이 어떤 모습인지에 대한 테스트',
    start: '테스트 시작',
    chooseLanguage: '언어를 선택해주세요',
    sections: [
      { emoji: '🪞', title: '이건 그저 하나의 테스트예요', body: '판결도, 라벨도 아니에요. 48개의 질문으로는 한 사람의 전부를 담을 수 없어요. 당신은 어떤 타입보다도 훨씬 더 복잡하고, 풍부하고, 사랑스러운 사람이에요.' },
      { emoji: '💫', title: '다른 사람 앞에서는, 다른 당신이 돼요', body: '당신의 "타입"은 영원히 변하지 않는 게 아니에요. 안전하게 느끼게 해주는 사람 앞에서는 더 안정되고, 불안하게 하는 사람 앞에서는 움츠러들 수 있어요. 둘 다 당신이에요.' },
      { emoji: '🌱', title: '타입은 인생의 단계에 따라 변해요', body: '이 테스트는 "지금의" 당신을 측정해요. 몇 년 뒤에 다시 해보면 결과가 다를 수도 있어요. 테스트가 부정확한 게 아니라, 당신이 성장한 거예요.' },
      { emoji: '🌸', title: '좋은 타입도, 나쁜 타입도 없어요', body: '안정형이 정답은 아니에요. 불안형이 고쳐야 하는 것도 아니에요. 모든 타입에는 그 나름의 아름다움이 있어요.' },
      { emoji: '🌿', title: '사랑은 맞춰가는 거예요', body: '"천생연분"인 두 사람은 없어요. "기꺼이 맞춰갈 준비가 된" 두 사람이 있을 뿐이에요. 사랑에서 가장 중요한 건 맞춰가는 거예요.' },
    ]
  }
}

type Lang = 'zh' | 'en' | 'ko'

export default function Home() {
  const [lang, setLang] = useState<Lang>('zh')
  const router = useRouter()
  const t = content[lang]

  const handleStart = () => {
    router.push(`/test?lang=${lang}`)
  }

  return (
    <main className="min-h-screen bg-rose-50 flex flex-col items-center px-6 py-12">

      {/* 标题 */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-rose-400 mb-3">💕 {t.title}</h1>
        <p className="text-rose-300 text-lg">{t.subtitle}</p>
      </div>

      {/* 语言选择 */}
      <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-sm mb-8">
        <p className="text-gray-500 text-sm mb-3 text-center">{t.chooseLanguage}</p>
        <div className="flex gap-3 justify-center">
          {(['zh', 'en', 'ko'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                lang === l
                  ? 'bg-rose-400 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-400 border border-rose-200'
              }`}
            >
              {l === 'zh' ? '中文' : l === 'en' ? 'English' : '한국어'}
            </button>
          ))}
        </div>
      </div>

      {/* 内容卡片 */}
      <div className="w-full max-w-xl flex flex-col gap-4 mb-10">
        {t.sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-2xl mb-2">{s.emoji}</div>
            <h2 className="font-semibold text-gray-800 mb-1">{s.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      {/* 开始按钮 */}
      <button
        onClick={handleStart}
        className="bg-rose-400 hover:bg-rose-500 text-white text-lg font-semibold px-12 py-4 rounded-full shadow-md transition-all"
      >
        {t.start} ☁️
      </button>

      <p className="mt-8 text-rose-300 text-xs">🌹 设计不是为了判决，是为了让你被看见。</p>
    </main>
  )
}