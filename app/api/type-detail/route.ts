import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 每个类型在文档里的标题对应关系
const TYPE_HEADERS: Record<number, string> = {
  1: '№1', 2: '№2', 3: '№3', 4: '№4', 5: '№5', 6: '№6',
  7: '№7', 8: '№8', 9: '№9', 10: '№10', 11: '№11', 12: '№12',
  13: '№13', 14: '№14', 15: '№15', 16: '№16', 17: '№17', 18: '№18',
  19: '№19', 20: '№20', 21: '№21', 22: '№22', 23: '№23', 24: '№24',
}

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
  const header = TYPE_HEADERS[typeNum]
  const lines = content.split('\n')
  let start = -1
  let end = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (start === -1 && line.includes(header + ' ') && line.startsWith('#')) {
      start = i
      continue
    }
    if (start !== -1 && i > start + 2) {
      const nextNum = typeNum + 1
      if (nextNum <= 24 && line.includes('№' + nextNum + ' ') && line.startsWith('#')) {
        end = i
        break
      }
    }
  }

  if (start === -1) return ''
  const section = lines.slice(start, end === -1 ? undefined : end).join('\n')
  
  // 找到要약 버전 / 短版 之前的内容（去掉摘要部分）
  const shortVersionMarkers = ['## 🌿 短版', '## 🌿 요약 버전', '## 🌿 Short Version']
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