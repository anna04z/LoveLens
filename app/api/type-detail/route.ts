import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DOC_FILES: Record<string, Record<number, string>> = {
  zh: {
    1: 'LoveLens_01_安全型家族.md', 2: 'LoveLens_01_安全型家族.md',
    3: 'LoveLens_01_安全型家族.md', 4: 'LoveLens_01_安全型家族.md',
    5: 'LoveLens_01_安全型家族.md', 6: 'LoveLens_01_安全型家族.md',
    7: 'LoveLens_02_焦虑型家族.md', 8: 'LoveLens_02_焦虑型家族.md',
    9: 'LoveLens_02_焦虑型家族.md', 10: 'LoveLens_02_焦虑型家族.md',
    11: 'LoveLens_02_焦虑型家族.md', 12: 'LoveLens_02_焦虑型家族.md',
    13: 'LoveLens_03_回避型家族.md', 14: 'LoveLens_03_回避型家族.md',
    15: 'LoveLens_03_回避型家族.md', 16: 'LoveLens_03_回避型家族.md',
    17: 'LoveLens_03_回避型家族.md', 18: 'LoveLens_03_回避型家族.md',
    19: 'LoveLens_04_混乱型家族.md', 20: 'LoveLens_04_混乱型家族.md',
    21: 'LoveLens_04_混乱型家族.md', 22: 'LoveLens_04_混乱型家族.md',
    23: 'LoveLens_04_混乱型家族.md', 24: 'LoveLens_04_混乱型家族.md',
  },
  ko: {
    1: 'LoveLens_01_안정형가족.md', 2: 'LoveLens_01_안정형가족.md',
    3: 'LoveLens_01_안정형가족.md', 4: 'LoveLens_01_안정형가족.md',
    5: 'LoveLens_01_안정형가족.md', 6: 'LoveLens_01_안정형가족.md',
    7: 'LoveLens_02_불안형가족.md', 8: 'LoveLens_02_불안형가족.md',
    9: 'LoveLens_02_불안형가족.md', 10: 'LoveLens_02_불안형가족.md',
    11: 'LoveLens_02_불안형가족.md', 12: 'LoveLens_02_불안형가족.md',
    13: 'LoveLens_03_회피형가족.md', 14: 'LoveLens_03_회피형가족.md',
    15: 'LoveLens_03_회피형가족.md', 16: 'LoveLens_03_회피형가족.md',
    17: 'LoveLens_03_회피형가족.md', 18: 'LoveLens_03_회피형가족.md',
    19: 'LoveLens_04_혼란형가족.md', 20: 'LoveLens_04_혼란형가족.md',
    21: 'LoveLens_04_혼란형가족.md', 22: 'LoveLens_04_혼란형가족.md',
    23: 'LoveLens_04_혼란형가족.md', 24: 'LoveLens_04_혼란형가족.md',
  },
  en: {
    1: 'LoveLens_01_Secure_Family_EN.md', 2: 'LoveLens_01_Secure_Family_EN.md',
    3: 'LoveLens_01_Secure_Family_EN.md', 4: 'LoveLens_01_Secure_Family_EN.md',
    5: 'LoveLens_01_Secure_Family_EN.md', 6: 'LoveLens_01_Secure_Family_EN.md',
    7: 'LoveLens_02_Anxious_Family_EN.md', 8: 'LoveLens_02_Anxious_Family_EN.md',
    9: 'LoveLens_02_Anxious_Family_EN.md', 10: 'LoveLens_02_Anxious_Family_EN.md',
    11: 'LoveLens_02_Anxious_Family_EN.md', 12: 'LoveLens_02_Anxious_Family_EN.md',
    13: 'LoveLens_03_Avoidant_Family_EN.md', 14: 'LoveLens_03_Avoidant_Family_EN.md',
    15: 'LoveLens_03_Avoidant_Family_EN.md', 16: 'LoveLens_03_Avoidant_Family_EN.md',
    17: 'LoveLens_03_Avoidant_Family_EN.md', 18: 'LoveLens_03_Avoidant_Family_EN.md',
    19: 'LoveLens_04_Disorganized_Family_EN.md', 20: 'LoveLens_04_Disorganized_Family_EN.md',
    21: 'LoveLens_04_Disorganized_Family_EN.md', 22: 'LoveLens_04_Disorganized_Family_EN.md',
    23: 'LoveLens_04_Disorganized_Family_EN.md', 24: 'LoveLens_04_Disorganized_Family_EN.md',
  },
}

function extractTypeSection(content: string, typeNum: number): string {
  const lines = content.split('\n')
  let start = -1
  let end = -1

  // 精确匹配：# №6 开头（只有 # 号标题，且紧接着就是 №数字）
  const exactPattern = new RegExp(`^#+\\s*№${typeNum}\\s`)

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (start === -1) {
      if (exactPattern.test(line)) {
        start = i
      }
      continue
    }

    // 找结束：遇到其他 №X 的顶级标题
    if (i > start + 2 && /^#+\s*№(\d+)\s/.test(line)) {
      const match = /^#+\s*№(\d+)\s/.exec(line)
      if (match && parseInt(match[1]) !== typeNum) {
        end = i
        break
      }
    }
  }

  if (start === -1) return ''
  const section = lines.slice(start, end === -1 ? undefined : end).join('\n')

  // 去掉摘要部分
  const shortVersionMarkers = [
    '## 🌿 短版', '## 🌿 요약 버전', '## 🌿 Short Version',
    '## 🌿 요약', '## Short Version', '## 短版'
  ]
  for (const marker of shortVersionMarkers) {
    const markerIdx = section.indexOf(marker)
    if (markerIdx !== -1) {
      return section.slice(0, markerIdx).trim()
    }
  }

  return section.trim()
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const typeId = parseInt(searchParams.get('id') || '1')
  const lang = searchParams.get('lang') || 'zh'

  try {
    const fileName = DOC_FILES[lang]?.[typeId]
    if (!fileName) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), 'public', 'docs', fileName)
    const content = fs.readFileSync(filePath, 'utf-8')
    const section = extractTypeSection(content, typeId)

    return NextResponse.json({ content: section, typeId, lang })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 })
  }
}