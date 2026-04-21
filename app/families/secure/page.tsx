'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import BottomNav from '../../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: { back: '← 返回', title: '安全型家族', subtitle: '№1–6 · 内在稳定，能亲密也能独立', loading: '读取中...' },
  en: { back: '← Back', title: 'Secure Family', subtitle: '№1–6 · Inner stability, capable of both intimacy and independence', loading: 'Loading...' },
  ko: { back: '← 돌아가기', title: '안정형 가족', subtitle: '№1–6 · 내면이 안정되어 있어, 친밀함도 독립도 가능해요', loading: '불러오는 중...' },
}

const types = [
  { id: 1, emoji: '🌹', zh: '明眼的共建者', en: 'The Clear-Eyed Co-Builder', ko: '눈 밝은 공동 건축가', code: 'S-F-N-C' },
  { id: 2, emoji: '🏛️', zh: '稳定的建筑师', en: 'The Steady Architect', ko: '안정된 건축가', code: 'S-F-L-T' },
  { id: 3, emoji: '🌿', zh: '诚实的同行者', en: 'The Honest Companion', ko: '솔직한 동반자', code: 'S-W-N-C' },
  { id: 4, emoji: '🌲', zh: '静默的守护者', en: 'The Silent Guardian', ko: '조용한 수호자', code: 'S-P-L-Y' },
  { id: 5, emoji: '🕊️', zh: '温柔的陪伴者', en: 'The Gentle Companion', ko: '다정한 동반자', code: 'S-D-N-R' },
  { id: 6, emoji: '🌊', zh: '深情的连接者', en: 'The Deep Connector', ko: '깊은 연결자', code: 'S-W-M-C' },
]

export default function SecureFamilyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const t = ui[lang]

  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [contents, setContents] = useState<Record<number, string>>({})
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleSelectType = async (id: number) => {
    if (selectedType === id) {
      setSelectedType(null)
      return
    }
    setSelectedType(id)
    if (contents[id]) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/type-detail?id=${id}&lang=${lang}`)
      const data = await res.json()
      setContents(prev => ({ ...prev, [id]: data.content }))
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-5">

          <button
            onClick={() => router.push(`/families?lang=${lang}`)}
            className="self-start text-emerald-400 text-sm hover:text-emerald-500"
          >
            {t.back}
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-emerald-500 mb-1">🌿 {t.title}</h1>
            <p className="text-emerald-300 text-sm">{t.subtitle}</p>
          </div>

          {types.map(type => {
            const name = type[lang]
            const isSelected = selectedType === type.id
            const content = contents[type.id]
            const isLoading = loadingId === type.id

            return (
              <div key={type.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => handleSelectType(type.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-emerald-50 transition-all text-left"
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">№{type.id} {name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{type.code}</div>
                  </div>
                  <span className="text-emerald-300 text-sm">{isSelected ? '↑' : '↓'}</span>
                </button>

                {isSelected && (
                  <div className="px-5 pb-5 border-t border-emerald-50">
                    {isLoading ? (
                      <p className="text-emerald-300 text-sm py-4 text-center">{t.loading}</p>
                    ) : content ? (
                      <div className="mt-4">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mt-4 mb-1">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-emerald-500 mt-4 mb-1">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-2 mb-1">{children}</h3>,
                            p: ({children}) => <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-emerald-300 pl-3 text-emerald-600 italic text-sm my-2">{children}</blockquote>,
                            ul: ({children}) => <ul className="flex flex-col gap-1 my-1">{children}</ul>,
                            li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-emerald-300">•</span><span>{children}</span></li>,
                            hr: () => <hr className="border-emerald-100 my-3" />,
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