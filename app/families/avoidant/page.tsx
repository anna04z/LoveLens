'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import BottomNav from '../../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const ui = {
  zh: { back: '← 返回', title: '回避型家族', subtitle: '№13–18 · 爱得深沉，只是不擅长靠近', loading: '读取中...' },
  en: { back: '← Back', title: 'Avoidant Family', subtitle: '№13–18 · Love deeply, just not good at getting close', loading: 'Loading...' },
  ko: { back: '← 돌아가기', title: '회피형 가족', subtitle: '№13–18 · 깊이 사랑하지만, 가까이 가는 게 서툴러요', loading: '불러오는 중...' },
}

const types = [
  { id: 13, emoji: '🕊️', zh: '沉默的奉献者', en: 'The Quiet Devotee', ko: '침묵의 헌신자', code: 'V-D-L-Y' },
  { id: 14, emoji: '🌿', zh: '自由的灵魂', en: 'The Free Spirit', ko: '자유로운 영혼', code: 'V-P-O-Y' },
  { id: 15, emoji: '🏛️', zh: '克制的理性者', en: 'The Reserved Rationalist', ko: '절제된 이성주의자', code: 'V-F-L-T' },
  { id: 16, emoji: '🍃', zh: '温柔的旁观者', en: 'The Tender Observer', ko: '다정한 관찰자', code: 'V-D-O-Y' },
  { id: 17, emoji: '🌌', zh: '清晰的独行者', en: 'The Clear Solo', ko: '명료한 독행자', code: 'V-W-L-C' },
  { id: 18, emoji: '🌫️', zh: '安静的岸', en: 'The Quiet Shore', ko: '조용한 해변', code: 'V-P-L-R' },
]

export default function AvoidantFamilyPage() {
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
      <div className="min-h-screen bg-green-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-5">

          <button
            onClick={() => router.push(`/families?lang=${lang}`)}
            className="self-start text-green-500 text-sm hover:text-green-600"
          >
            {t.back}
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-green-600 mb-1">🌲 {t.title}</h1>
            <p className="text-green-400 text-sm">{t.subtitle}</p>
          </div>

          {types.map(type => {
            const name = type[lang]
            const isSelected = selectedType === type.id
            return (
              <div key={type.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => handleSelectType(type.id)}
                  className="w-full p-5 flex items-center gap-4 hover:bg-green-50 transition-all text-left"
                >
                  <span className="text-3xl">{type.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">№{type.id} {name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{type.code}</div>
                  </div>
                  <span className="text-green-400 text-sm">{isSelected ? '↑' : '↓'}</span>
                </button>

                {isSelected && (
                  <div className="px-5 pb-5 border-t border-green-50">
                    {loading ? (
                      <p className="text-green-400 text-sm py-4 text-center">{t.loading}</p>
                    ) : content ? (
                      <div className="mt-4">
                        <ReactMarkdown
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold text-gray-800 mt-4 mb-1">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-green-500 mt-4 mb-1">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-2 mb-1">{children}</h3>,
                            p: ({children}) => <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                            blockquote: ({children}) => <blockquote className="border-l-2 border-green-300 pl-3 text-green-600 italic text-sm my-2">{children}</blockquote>,
                            ul: ({children}) => <ul className="flex flex-col gap-1 my-1">{children}</ul>,
                            li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-green-400">•</span><span>{children}</span></li>,
                            hr: () => <hr className="border-green-100 my-3" />,
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