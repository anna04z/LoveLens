'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { questions } from '../questions'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: {
    progress: (cur: number, total: number) => `第 ${cur} / ${total} 题`,
    instruction: '按"最像你"的顺序点击，可以选多个',
    next: '下一题',
    prev: '上一题',
    finish: '查看结果',
  },
  en: {
    progress: (cur: number, total: number) => `${cur} / ${total}`,
    instruction: 'Click in order of how much they resemble you. You can pick multiple.',
    next: 'Next',
    prev: 'Back',
    finish: 'See Results',
  },
  ko: {
    progress: (cur: number, total: number) => `${cur} / ${total} 문항`,
    instruction: '가장 비슷한 순서대로 클릭하세요. 여러 개 선택 가능해요.',
    next: '다음',
    prev: '이전',
    finish: '결과 보기',
  },
}

export default function TestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const t = ui[lang]

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[][]>(
    Array(questions.length).fill(null).map(() => [])
  )

  const question = questions[current]
  const selected = answers[current]
  const total = questions.length
  const progress = ((current + 1) / total) * 100

  const toggleOption = (optId: string) => {
    setAnswers(prev => {
      const curr = [...prev[current]]
      const idx = curr.indexOf(optId)
      if (idx !== -1) {
        curr.splice(idx, 1)
      } else if (curr.length < 4) {
        curr.push(optId)
      }
      const next = [...prev]
      next[current] = curr
      return next
    })
  }

  const goNext = () => {
    if (current < total - 1) setCurrent(c => c + 1)
    else handleFinish()
  }

  const goPrev = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const handleFinish = () => {
    const encoded = encodeURIComponent(JSON.stringify(answers))
    router.push(`/result?lang=${lang}&answers=${encoded}`)
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {/* 进度 */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-rose-400 font-medium text-sm">
              {t.progress(current + 1, total)}
            </span>
            <span className="text-rose-300 text-xs">💕 LoveLens</span>
          </div>
          <div className="w-full bg-rose-100 rounded-full h-2">
            <div
              className="bg-rose-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 题目 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-gray-800 font-medium text-base leading-relaxed">
            {lang === 'ko' ? question.ko : question.zh}
          </p>
        </div>

        {/* 提示 */}
        <p className="text-rose-300 text-xs text-center -mt-2">{t.instruction}</p>

        {/* 选项 */}
        <div className="flex flex-col gap-3">
          {question.options.map((opt) => {
            const rank = selected.indexOf(opt.id)
            const isSelected = rank !== -1

            return (
              <button
                key={opt.id}
                onClick={() => toggleOption(opt.id)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-gray-100 bg-white hover:border-rose-200'
                }`}
              >
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-rose-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {isSelected ? rank + 1 : opt.id}
                </div>
                <span className={`text-sm leading-relaxed pt-0.5 ${
                  isSelected ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {lang === 'ko' ? opt.ko : opt.zh}
                </span>
              </button>
            )
          })}
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {current > 0 && (
            <button
              onClick={goPrev}
              className="flex-1 py-3 rounded-full border-2 border-rose-200 text-rose-400 font-medium transition-all hover:bg-rose-50"
            >
              {t.prev}
            </button>
          )}
          <button
            onClick={goNext}
            disabled={selected.length === 0}
            className={`flex-1 py-3 rounded-full font-medium transition-all ${
              selected.length > 0
                ? 'bg-rose-400 text-white hover:bg-rose-500'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {current === total - 1 ? t.finish : t.next}
          </button>
        </div>

      </div>
    </div>
  )
}