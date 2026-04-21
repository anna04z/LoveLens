'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import BottomNav from '../BottomNav'

type Lang = 'zh' | 'en' | 'ko'

const docFiles: Record<Lang, string> = {
  zh: 'LoveLens_13_16个字母详解.md',
  en: 'LoveLens_13_16_Letters_EN.md',
  ko: 'LoveLens_13_16글자설명_KR.md',
}

const ui = {
  zh: { title: '16个字母', subtitle: '每一个字母，都是一种爱的语言', loading: '读取中...' },
  en: { title: '16 Letters', subtitle: 'Every letter is a language of love', loading: 'Loading...' },
  ko: { title: '16개 글자', subtitle: '모든 글자는 사랑의 언어예요', loading: '불러오는 중...' },
}

export default function LettersPage() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const t = ui[lang]

  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/docs/${docFiles[lang]}`)
      .then(r => r.text())
      .then(text => { setContent(text); setLoading(false) })
      .catch(() => setLoading(false))
  }, [lang])

  return (
    <>
      <div className="min-h-screen bg-rose-50 flex flex-col items-center px-6 py-12 pb-24">
        <div className="w-full max-w-xl flex flex-col gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-rose-400 mb-1">🔤 {t.title}</h1>
            <p className="text-rose-300 text-sm">{t.subtitle}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {loading ? (
              <p className="text-rose-300 text-sm text-center py-8">{t.loading}</p>
            ) : content ? (
              <ReactMarkdown
                components={{
                  h1: ({children}) => <h1 className="text-xl font-bold text-gray-800 mt-6 mb-2">{children}</h1>,
                  h2: ({children}) => <h2 className="text-base font-semibold text-rose-400 mt-5 mb-1">{children}</h2>,
                  h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-3 mb-1">{children}</h3>,
                  p: ({children}) => <p className="text-sm text-gray-600 leading-relaxed mb-2">{children}</p>,
                  strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                  blockquote: ({children}) => <blockquote className="border-l-2 border-rose-300 pl-3 text-rose-500 italic text-sm my-2">{children}</blockquote>,
                  ul: ({children}) => <ul className="flex flex-col gap-1 my-1">{children}</ul>,
                  li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-rose-300">•</span><span>{children}</span></li>,
                  hr: () => <hr className="border-rose-100 my-4" />,
                  table: ({children}) => <table className="w-full text-sm my-3 border-collapse">{children}</table>,
                  th: ({children}) => <th className="text-left p-2 bg-rose-50 text-gray-700 font-medium border border-rose-100">{children}</th>,
                  td: ({children}) => <td className="p-2 text-gray-600 border border-rose-100">{children}</td>,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 text-sm text-center py-8">内容加载失败</p>
            )}
          </div>
        </div>
      </div>
      <BottomNav lang={lang} />
    </>
  )
}