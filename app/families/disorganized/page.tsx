'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import BottomNav from '../../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: { back: '← 返回', title: '混乱型家族', subtitle: '№19–24 · 想靠近又害怕，爱得复杂而真实', loading: '读取中...' },
  en: { back: '← Back', title: 'Disorganized Family', subtitle: '№19–24 · Want closeness but fear it — love that is complex and real', loading: 'Loading...' },
  ko: { back: '← 돌아가기', title: '혼란형 가족', subtitle: '№19–24 · 가까워지고 싶지만 두렵고, 복잡하고 진실한 사랑이에요', loading: '불러오는 중...' },
}

const types = [
  { id: 19, emoji: '🌊', zh: '情感的潮汐', en: 'The Emotional Tide', ko: '감정의 조수', code: 'X-W-M-C' },
  { id: 20, emoji: '🌌', zh: '追寻的理想主义者', en: 'The Searching Idealist', ko: '탐구하는 이상주의자', code: 'X-P-O-R' },
  { id: 21, emoji: '🎭', zh: '清醒的撕裂者', en: 'The Conscious Torn', ko: '의식하는 갈등자', code: 'X-W-N-T' },
  { id: 22, emoji: '🦋', zh: '飞蛾扑火型', en: 'The Moth to Flame', ko: '불꽃에 뛰어드는 나방', code: 'X-F-M-C' },
  { id: 23, emoji: '🌑', zh: '沉默的矛盾者', en: 'The Silent Paradox', ko: '침묵하는 역설자', code: 'X-P-O-T' },
  { id: 24, emoji: '⚡', zh: '闪电型', en: 'The Lightning Type', ko: '번개형', code: 'X-F-L-Y' },
]

export default function DisorganizedFamilyPage() {
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
      <div className="min-h-screen bg-purple-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-5">

          <button
            onClick={() => router.push(`/families?lang=${lang}`)}
            className="self-start text-purple-400 text-sm hover:text-purple-500"
          >
            {t.back}
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-purple-400 mb-1">🌊 {t.title}</h1>
            <p className="text-purple-300 text-sm">{t.subtitle}</p>
          </div>

          {types.map(type => {
            const name = type[lang]
            const isSelected = selectedType === type.id
            return (
              <div key={type.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => handleSelectType(type.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-purple-50 transition-all text-left"
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">№{type.id} {name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{type.code}</div>
                  </div>
                  <span className="text-purple-300 text-sm">{isSelected ? '↑' : '↓'}</span>
                </button>

                {isSelected && (
                  <div className="px-5 pb-5 border-t border-purple-50">
                    {loading ? (
                      <p className="text-purple-300 text-sm py-4 text-center">{t.loading}</p>
                    ) : content ? (
                      <div className="mt-4">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mt-4 mb-1">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-purple-400 mt-4 mb-1">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-2 mb-1">{children}</h3>,
                            p: ({children}) => <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-purple-300 pl-3 text-purple-500 italic text-sm my-2">{children}</blockquote>,
                            ul: ({children}) => <ul className="flex flex-col gap-1 my-1">{children}</ul>,
                            li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-purple-300">•</span><span>{children}</span></li>,
                            hr: () => <hr className="border-purple-100 my-3" />,
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