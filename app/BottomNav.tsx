'use client'

import { useRouter, usePathname } from 'next/navigation'

type Lang = 'zh' | 'en' | 'ko'

const labels = {
  zh: { home: '首页', families: '家族', letters: '字母', mixed: '混合', about: '关于' },
  en: { home: 'Home', families: 'Families', letters: 'Letters', mixed: 'Mixed', about: 'About' },
  ko: { home: '홈', families: '가족', letters: '글자', mixed: '혼합', about: '소개' },
}

export default function BottomNav({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const t = labels[lang]

  const items = [
    { key: 'home', label: t.home, emoji: '🏠', path: '/' },
    { key: 'families', label: t.families, emoji: '🌸', path: '/families' },
    { key: 'letters', label: t.letters, emoji: '🔤', path: '/letters' },
    { key: 'mixed', label: t.mixed, emoji: '🌀', path: '/mixed' },
    { key: 'about', label: t.about, emoji: '📖', path: '/about' },
  ]

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #ffe4e6',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 16px',
    }}>
      {items.map(item => {
        const isActive = pathname === item.path || pathname.startsWith(item.path + '/')
        return (
          <button
            key={item.key}
            onClick={() => router.push(`${item.path}?lang=${lang}`)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 8px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: isActive ? '#fb7185' : '#d1d5db',
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.emoji}</span>
            <span style={{ fontSize: '11px' }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}