'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import BottomNav from '../../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: { back: '← 返回', title: '焦虑型家族', subtitle: '№7–12 · 深深在乎，渴望被看见，害怕失去', loading: '读取中...' },
  en: { back: '← Back', title: 'Anxious Family', subtitle: '№7–12 · Deeply invested, longing to be seen, afraid to lose', loading: 'Loading...' },
  ko: { back: '← 돌아가기', title: '불안형 가족', subtitle: '№7–12 · 깊이 신경 쓰고, 보여지길 원하고, 잃는 게 두려워요', loading: '불러오는 중...' },
}

const types = [
  { id: 7, emoji: '🔥', zh: '热烈的追求者', en: 'The Passionate Pursuer', ko: '열정적인 추구자', code: 'A-W-M-C' },
  { id: 8, emoji: '💝', zh: '付出型的恋人', en: 'The Devoted Giver', ko: '헌신형 연인', code: 'A-D-M-R' },
  { id: 9, emoji: '🪞', zh: '紧抓的共情者', en: 'The Clinging Empath', ko: '매달리는 공감자', code: 'A-P-M-Y' },
  { id: 10, emoji: '🌷', zh: '清醒的焦虑者', en: 'The Self-Aware Worrier', ko: '명료한 불안자', code: 'A-W-N-T' },
  { id: 11, emoji: '🌸', zh: '热切的证明者', en: 'The Eager Prover', ko: '열정적인 증명자', code: 'A-D-N-C' },
  { id: 12, emoji: '🌙', zh: '温柔的候鸟', en: 'The Tender Bird', ko: '다정한 철새', code: 'A-P-N-R' },
]

export default function AnxiousFamilyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const t = ui[lang]

  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectType = async (id: number) => {
    if (selectedType === id) {
      setSelectedType(null)
      return
    }
    setSelectedType(id)
    setLoading(true)
    try {
      const res = await fetch(`/api/type-detail?id=${id}&lang=${lang}`)
      const data = await res.json()
      setContent(data.content)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-rose-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-5">

          <button
            onClick={() => router.push(`/families?lang=${lang}`)}
            className="self-start text-rose-400 text-sm hover:text-rose-500"
          >
            {t.back}
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-rose-400 mb-1">🔥 {t.title}</h1>
            <p className="text-rose-300 text-sm">{t.subtitle}</p>
          </div>

          {types.map(type => {
            const name = type[lang]
            const isSelected = selectedType === type.id
            return (
              <div key={type.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => handleSelectType(type.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-rose-50 transition-all text-left"
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">№{type.id} {name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{type.code}</div>
                  </div>
                  <span className="text-rose-300 text-sm">{isSelected ? '↑' : '↓'}</span>
                </button>

                {isSelected && (
                  <div className="px-5 pb-5 border-t border-rose-50">
                    {loading ? (
                      <p className="text-rose-300 text-sm py-4 text-center">{t.loading}</p>
                    ) : content ? (
                      <div className="mt-4">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mt-4 mb-1">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-rose-400 mt-4 mb-1">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-2 mb-1">{children}</h3>,
                            p: ({children}) => <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-rose-300 pl-3 text-rose-500 italic text-sm my-2">{children}</blockquote>,
                            ul: ({children}) => <ul className="flex flex-col gap-1 my-1">{children}</ul>,
                            li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-rose-300">•</span><span>{children}</span></li>,
                            hr: () => <hr className="border-rose-100 my-3" />,
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </div>
      <BottomNav lang={lang} />
    </>
  )
}