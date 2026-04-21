'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Lang = 'zh' | 'en' | 'ko'

const docFiles: Record<Lang, string> = {
  zh: 'LoveLens_00_开篇哲学.md',
  en: 'LoveLens_00_开篇哲学_EN.md',
  ko: 'LoveLens_00_开篇哲学_KR.md',
}

const ui = {
  zh: { start: 'OK，我准备好了 →', loading: '读取中...' },
  en: { start: 'OK, I\'m ready →', loading: 'Loading...' },
  ko: { start: 'OK, 준비됐어요 →', loading: '불러오는 중...' },
}

export default function IntroPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
    <div className="min-h-screen bg-rose-50 flex flex-col items-center px-6 pt-6 pb-16">
      <div className="w-full max-w-xl flex flex-col gap-6">

        {loading ? (
          <p className="text-rose-300 text-sm text-center py-16">{t.loading}</p>
        ) : content ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <ReactMarkdown
              components={{
                h1: ({children}) => <h1 className="text-xl font-bold text-gray-800 mt-6 mb-3">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-semibold text-rose-400 mt-6 mb-2">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-semibold text-gray-600 mt-4 mb-1">{children}</h3>,
                p: ({children}) => <p className="text-sm text-gray-600 leading-loose mb-3">{children}</p>,
                strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                blockquote: ({children}) => <blockquote className="border-l-2 border-rose-300 pl-4 text-rose-500 italic text-sm my-3 leading-loose">{children}</blockquote>,
                ul: ({children}) => <ul className="flex flex-col gap-2 my-2">{children}</ul>,
                li: ({children}) => <li className="text-sm text-gray-600 leading-relaxed flex gap-2"><span className="text-rose-300 mt-0.5">•</span><span>{children}</span></li>,
                hr: () => <hr className="border-rose-100 my-6" />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : null}

        {/* 按钮在内容底部 */}
        <button
          onClick={() => router.push(`/test?lang=${lang}`)}
          className="w-full py-4 rounded-full bg-rose-400 text-white font-semibold text-base hover:bg-rose-500 transition-all shadow-md"
        >
          {t.start}
        </button>

        <p className="text-rose-300 text-xs text-center">🌹 设计不是为了判决，是为了让你被看见。</p>

      </div>
    </div>
  )
}