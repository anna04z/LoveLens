'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSearchParams, useRouter } from 'next/navigation'
import { questions } from '../questions'
import { findMainType } from '../types'

type Lang = 'zh' | 'en' | 'ko'

const attachmentMap: Record<number, Record<string, string>> = {
  1:{A:'S/A',B:'V',C:'V',D:'S'}, 2:{A:'V',B:'S',C:'X',D:'A'},
  3:{A:'S',B:'V',C:'A',D:'X'}, 4:{A:'V',B:'S',C:'S/A',D:'A'},
  5:{A:'S/V',B:'S',C:'A',D:'X'}, 6:{A:'V',B:'S',C:'A',D:'X'},
  7:{A:'S',B:'V',C:'A',D:'X'}, 8:{A:'S/V',B:'S/A',C:'A',D:'A'},
  9:{A:'S',B:'S/A',C:'V',D:'A'}, 10:{A:'S',B:'S/A',C:'V',D:'A'},
  11:{A:'S',B:'V/X',C:'A',D:'A/S'}, 12:{A:'M/A',B:'S',C:'S',D:'V/S'},
}
const expressionMap: Record<number, Record<string, string>> = {
  13:{A:'W',B:'W/P',C:'F',D:'P'}, 14:{A:'W',B:'D',C:'P',D:'F'},
  15:{A:'W',B:'D/P',C:'P',D:'D/F'}, 16:{A:'W',B:'D',C:'P',D:'F'},
  17:{A:'F',B:'W',C:'D',D:'P'}, 18:{A:'W',B:'D',C:'P',D:'F'},
  19:{A:'P',B:'F',C:'W',D:'D'}, 20:{A:'W',B:'D',C:'P',D:'F'},
  21:{A:'W',B:'D',C:'P',D:'F'}, 22:{A:'D',B:'P',C:'F',D:'W'},
  23:{A:'F',B:'W',C:'D',D:'P'}, 24:{A:'W',B:'D',C:'P',D:'F'},
}
const structureMap: Record<number, Record<string, string>> = {
  25:{A:'M',B:'N',C:'L',D:'O'}, 26:{A:'M',B:'N',C:'L',D:'O'},
  27:{A:'L',B:'O',C:'M',D:'N'}, 28:{A:'M',B:'N',C:'L',D:'O'},
  29:{A:'M',B:'N',C:'L',D:'O'}, 30:{A:'N',B:'M',C:'O',D:'L'},
  31:{A:'M',B:'N',C:'L',D:'O'}, 32:{A:'M',B:'N',C:'L',D:'O'},
  33:{A:'L',B:'N',C:'O',D:'M'}, 34:{A:'M',B:'N',C:'L',D:'O'},
  35:{A:'M',B:'N',C:'L',D:'O'}, 36:{A:'L',B:'O',C:'M',D:'N'},
}
const conflictMap: Record<number, Record<string, string>> = {
  37:{A:'C',B:'T',C:'R',D:'Y'}, 38:{A:'C',B:'T',C:'R',D:'Y'},
  39:{A:'C',B:'T',C:'R',D:'Y'}, 40:{A:'C',B:'T',C:'R',D:'Y'},
  41:{A:'C',B:'T',C:'R',D:'Y'}, 42:{A:'C',B:'T',C:'R',D:'Y'},
  43:{A:'C',B:'T',C:'R',D:'Y'}, 44:{A:'C',B:'T',C:'R',D:'Y'},
  45:{A:'C',B:'T',C:'R',D:'Y'}, 46:{A:'C',B:'T',C:'R',D:'Y'},
  47:{A:'C',B:'T',C:'R',D:'Y'}, 48:{A:'C',B:'T',C:'R',D:'Y'},
}

function addScore(scores: Record<string, number>, letters: string, points: number) {
  const parts = letters.split('/')
  const each = points / parts.length
  parts.forEach(l => { scores[l] = (scores[l] || 0) + each })
}

function getTopTwo(scores: Record<string, number>): [string, string | null] {
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return ['?', null]
  const top = sorted[0]
  const second = sorted[1]
  if (second && second[1] >= top[1] * 0.5) return [top[0], second[0]]
  return [top[0], null]
}

function calcCode(answers: string[][]): string {
  const att: Record<string,number> = {}
  const exp: Record<string,number> = {}
  const str: Record<string,number> = {}
  const con: Record<string,number> = {}
  questions.forEach((q, i) => {
    const selected = answers[i] || []
    const points = [3, 2, 1]
    selected.forEach((optId, rank) => {
      const p = points[rank] || 0
      if (q.dimension === 'attachment' && attachmentMap[q.id]?.[optId]) addScore(att, attachmentMap[q.id][optId], p)
      else if (q.dimension === 'expression' && expressionMap[q.id]?.[optId]) addScore(exp, expressionMap[q.id][optId], p)
      else if (q.dimension === 'structure' && structureMap[q.id]?.[optId]) addScore(str, structureMap[q.id][optId], p)
      else if (q.dimension === 'conflict' && conflictMap[q.id]?.[optId]) addScore(con, conflictMap[q.id][optId], p)
    })
  })
  const [a1,a2] = getTopTwo(att)
  const [e1,e2] = getTopTwo(exp)
  const [s1,s2] = getTopTwo(str)
  const [c1,c2] = getTopTwo(con)
  return `${a2?`${a1}/${a2}`:a1}-${e2?`${e1}/${e2}`:e1}-${s2?`${s1}/${s2}`:s1}-${c2?`${c1}/${c2}`:c1}`
}

const dimLabels = {
  zh: ['依恋', '表达', '结构', '冲突'],
  en: ['Attachment', 'Expression', 'Structure', 'Conflict'],
  ko: ['애착', '표현', '구조', '갈등'],
}
const dimColors = ['bg-blue-100 text-blue-600','bg-green-100 text-green-600','bg-yellow-100 text-yellow-600','bg-red-100 text-red-600']

const ui = {
  zh: { title:'你的 LoveLens 代码', subtitle:'这是一面镜子，不是判决 🌷', type:'你最接近的类型', expand:'展开完整类型说明 ↓', collapse:'收起 ↑', strengths:'✨ 优势', watchouts:'🌱 注意', letter:'💌 给自己', again:'再做一次', share:'复制分享链接', copied:'已复制！', note:'面对不同的人，你会是不同的你。这不是最终答案，是一个起点。', loading:'读取中...' },
  en: { title:'Your LoveLens Code', subtitle:'This is a mirror, not a verdict 🌷', type:'Your closest type', expand:'Expand full type description ↓', collapse:'Collapse ↑', strengths:'✨ Strengths', watchouts:'🌱 Watch out for', letter:'💌 A note to yourself', again:'Take Again', share:'Copy share link', copied:'Copied!', note:'You become a different you with different people. This is a starting point, not a final answer.', loading:'Loading...' },
  ko: { title:'당신의 LoveLens 코드', subtitle:'이건 거울이에요, 판결이 아니에요 🌷', type:'가장 가까운 유형', expand:'전체 유형 설명 펼치기 ↓', collapse:'접기 ↑', strengths:'✨ 강점', watchouts:'🌱 눈여겨볼 부분', letter:'💌 자신에게 건네는 한마디', again:'다시 하기', share:'공유 링크 복사', copied:'복사됐어요!', note:'다른 사람 앞에서는 다른 당신이 돼요. 이건 최종 답이 아니라 출발점이에요.', loading:'불러오는 중...' },
}

export default function ResultPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const lang = (searchParams.get('lang') as Lang) || 'zh'
  const answersParam = searchParams.get('answers')
  const [expanded, setExpanded] = useState(false)
  const [longContent, setLongContent] = useState<string | null>(null)
  const [loadingLong, setLoadingLong] = useState(false)
  const t = ui[lang]

  let answers: string[][] = []
  try { answers = JSON.parse(decodeURIComponent(answersParam || '[]')) } catch { answers = [] }

  const code = calcCode(answers)
  const parts = code.split('-')
  const matchedType = findMainType(code)
  const labels = dimLabels[lang]

  const typeName = lang === 'ko' ? matchedType.koName : matchedType.zhName
  const typeShort = lang === 'ko' ? matchedType.short.ko : matchedType.short.zh
  const typeStrengths = lang === 'ko' ? matchedType.strengths.ko : matchedType.strengths.zh
  const typeWatchouts = lang === 'ko' ? matchedType.watchouts.ko : matchedType.watchouts.zh
  const typeLetter = lang === 'ko' ? matchedType.letter.ko : matchedType.letter.zh
  const typeSig = lang === 'ko' ? matchedType.signature.ko : matchedType.signature.zh

  const handleExpand = async () => {
    if (!expanded && !longContent) {
      setLoadingLong(true)
      try {
        const res = await fetch(`/api/type-detail?id=${matchedType.id}&lang=${lang}`)
        const data = await res.json()
        setLongContent(data.content)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingLong(false)
      }
    }
    setExpanded(!expanded)
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-xl flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-rose-400 mb-1">💕 {t.title}</h1>
          <p className="text-rose-300 text-sm">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="text-3xl font-bold text-rose-400 tracking-widest mb-1">{code}</div>
          <p className="text-gray-400 text-xs mt-1">你的关系风格代码</p>
        </div>

        <div className="flex flex-col gap-2">
          {parts.map((part, i) => (
            <div key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${dimColors[i]}`}>{labels[i]}</div>
              <span className="text-gray-700 text-sm font-medium">{part}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-rose-300 text-xs mb-2">{t.type}</p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{matchedType.emoji}</span>
            <div>
              <div className="font-bold text-gray-800">{matchedType.enName}</div>
              <div className="text-gray-500 text-sm">{typeName}</div>
            </div>
          </div>
          <p className="text-rose-400 text-sm italic mb-3">{typeSig}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{typeShort}</p>

          <button
            onClick={handleExpand}
            className="mt-4 w-full py-2.5 rounded-xl border-2 border-rose-200 text-rose-400 text-sm font-medium hover:bg-rose-50 transition-all"
          >
            {loadingLong ? t.loading : expanded ? t.collapse : t.expand}
          </button>

          {expanded && (
            <div className="mt-5 flex flex-col gap-5">
              {longContent && (
                <div className="border-b border-rose-100 pb-5">
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
                    {longContent}
                  </ReactMarkdown>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-700 mb-2">{t.strengths}</p>
                <ul className="flex flex-col gap-1">
                  {typeStrengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-rose-300 mt-0.5">•</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">{t.watchouts}</p>
                <ul className="flex flex-col gap-1">
                  {typeWatchouts.map((w, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-rose-300 mt-0.5">•</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 rounded-xl p-4">
                <p className="font-semibold text-gray-700 mb-2">{t.letter}</p>
                <p className="text-rose-500 text-sm leading-relaxed italic">{typeLetter}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-rose-100 rounded-2xl p-4">
          <p className="text-rose-500 text-sm leading-relaxed text-center">{t.note}</p>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/?lang=${lang}`)}
            className="flex-1 py-3 rounded-full border-2 border-rose-200 text-rose-400 font-medium hover:bg-rose-50 transition-all text-sm"
          >
            {t.again}
          </button>
          <button
            onClick={() => {
              const url = `https://love-lens-beige.vercel.app`
              navigator.clipboard.writeText(
                lang === 'zh' ? `我的 LoveLens 代码是 ${code}！快来测测你的：${url}` :
                lang === 'ko' ? `내 LoveLens 코드는 ${code}예요! 테스트해봐요: ${url}` :
                `My LoveLens code is ${code}! Take the test: ${url}`
              )
              alert(t.copied)
            }}
            className="flex-1 py-3 rounded-full bg-rose-400 text-white font-medium hover:bg-rose-500 transition-all text-sm"
          >
            {t.share}
          </button>
        </div>

        {/* 结尾提醒 */}
        <div className="pt-6 border-t border-rose-200">
          <p className="text-gray-400 text-xs text-center mb-4">···</p>
          <div className="text-gray-500 text-xs leading-loose space-y-3">
            {lang === 'zh' && <>
              <p>不管你测出什么类型——</p>
              <p>如果你在一段关系里，一直觉得自己在缩小、在让步、在消耗；如果你需要不停地解释、证明、讨好，才能留住那个人；如果那个人让你越来越不像自己——</p>
              <p>请记得：<strong className="text-gray-600">磨合不是单方面的委屈。</strong></p>
              <p>爱不应该让你变得更小。一段让你每天都在怀疑自己的关系，不是"你还不够努力"——是你的身体在告诉你，你值得被不一样地对待。</p>
              <p><strong className="text-gray-600">离开一段伤害你的关系，不是失败——是爱自己。</strong></p>
              <p>LoveLens 帮你看见"你在爱里是什么样子"——但<strong className="text-gray-600">你是什么样子，永远比"能不能留住一段关系"重要</strong>。</p>
              <p className="text-center pt-2">🌷</p>
            </>}
            {lang === 'ko' && <>
              <p>어떤 타입이 나왔든 상관없이—</p>
              <p>어떤 관계 안에서, 당신이 계속 작아지고, 양보하고, 소진되고 있다고 느낀다면; 그 사람을 붙잡기 위해, 계속 설명하고, 증명하고, 맞춰주어야만 한다면; 그 사람 앞에서, 당신이 점점 당신답지 않아진다면—</p>
              <p>기억해 주세요: <strong className="text-gray-600">맞춰간다는 건, 한 사람만 참는다는 뜻이 아니에요.</strong></p>
              <p>사랑은 당신을 더 작게 만들면 안 돼요. 매일 스스로를 의심하게 만드는 관계는, "당신이 아직 충분히 노력하지 않아서"가 아니에요—당신의 몸이 말해주고 있는 거예요. 당신은 다르게 대우받을 자격이 있다고요.</p>
              <p><strong className="text-gray-600">당신을 아프게 하는 관계에서 떠나는 건, 실패가 아니에요—스스로를 사랑하는 거예요.</strong></p>
              <p>LoveLens는 "당신이 사랑 앞에서 어떤 모습인지"를 보여줘요—하지만 <strong className="text-gray-600">당신이 어떤 사람인지는, "이 관계를 지킬 수 있는지"보다 언제나 더 중요해요.</strong></p>
              <p className="text-center pt-2">🌷</p>
            </>}
            {lang === 'en' && <>
              <p>No matter which type you got —</p>
              <p>If you find yourself shrinking, giving in, being drained in a relationship; if you have to keep explaining, proving, pleasing, just to hold on to that person; if that person is slowly making you less like yourself —</p>
              <p>Please remember: <strong className="text-gray-600">Meeting each other halfway is not one person doing all the bending.</strong></p>
              <p>Love shouldn't make you smaller. A relationship that has you doubting yourself every day isn't about "you not trying hard enough" — it's your body telling you that you deserve to be treated differently.</p>
              <p><strong className="text-gray-600">Leaving a relationship that hurts you isn't failure — it's loving yourself.</strong></p>
              <p>LoveLens helps you see "who you are in love" — but <strong className="text-gray-600">who you are will always matter more than whether you can keep a relationship.</strong></p>
              <p className="text-center pt-2">🌷</p>
            </>}
          </div>
        </div>

      </div>
    </div>
  )
}