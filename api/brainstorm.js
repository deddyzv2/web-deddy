const GEMINI_MODEL = 'gemini-2.0-flash'
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const responseSchema = {
  type: 'OBJECT',
  properties: {
    keyword: { type: 'STRING' },
    characters: { type: 'ARRAY', items: { type: 'STRING' } },
    poses: { type: 'ARRAY', items: { type: 'STRING' } },
    highlights: { type: 'ARRAY', items: { type: 'STRING' } },
    colorsAndMood: { type: 'ARRAY', items: { type: 'STRING' } },
    conceptSummary: { type: 'STRING' },
  },
  required: ['keyword', 'characters', 'poses', 'highlights', 'colorsAndMood', 'conceptSummary'],
}

function buildPrompt(keyword) {
  return `
Kamu membantu artist/illustrator yang sedang blank mau menggambar apa.
Buat bahan brainstorming visual dari kata kunci: "${keyword}".

Aturan:
- Bahasa Indonesia.
- Singkat, praktis, visual.
- Tidak terlalu puitis.
- Cocok untuk ide ilustrasi karakter/anime/semi-realistic.
- Jangan membuat prompt gambar AI panjang.
- Fokus pada bahan visual untuk memilih karakter, pose, highlight, warna, dan mood.
- Setiap array berisi tepat 3 opsi pendek.

Kembalikan hanya JSON sesuai schema.
`
}

function cleanList(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim()).slice(0, 3)
    : []
}

function normalizeResult(result, keyword) {
  return {
    keyword: typeof result.keyword === 'string' && result.keyword.trim() ? result.keyword.trim() : keyword,
    characters: cleanList(result.characters),
    poses: cleanList(result.poses),
    highlights: cleanList(result.highlights),
    colorsAndMood: cleanList(result.colorsAndMood),
    conceptSummary: typeof result.conceptSummary === 'string' ? result.conceptSummary.trim() : '',
  }
}

function getRequestBody(request) {
  if (typeof request.body === 'string') {
    try {
      return JSON.parse(request.body)
    } catch {
      return {}
    }
  }

  return request.body || {}
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method tidak diizinkan.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return response.status(500).json({ error: 'Konfigurasi Gemini belum tersedia di server.' })
  }

  const body = getRequestBody(request)
  const keyword = typeof body.keyword === 'string' ? body.keyword.trim() : ''
  if (!keyword) {
    return response.status(400).json({ error: 'Kata kunci wajib diisi.' })
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(keyword) }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          response_mime_type: 'application/json',
          response_schema: responseSchema,
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text().catch(() => '')
      console.error('Gemini request failed:', { status: geminiResponse.status, message: errorText.slice(0, 300) })
      return response.status(geminiResponse.status).json({
        error: `Gagal menghubungi Gemini. Status ${geminiResponse.status}.`,
      })
    }

    const data = await geminiResponse.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      console.error('Gemini response missing text')
      return response.status(502).json({ error: 'Gemini tidak mengembalikan hasil yang bisa dibaca.' })
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (error) {
      console.error('Gemini JSON parse failed:', error.message)
      return response.status(502).json({ error: 'Gemini mengembalikan format JSON yang tidak valid.' })
    }
    const normalized = normalizeResult(parsed, keyword)

    if (
      normalized.characters.length === 0 ||
      normalized.poses.length === 0 ||
      normalized.highlights.length === 0 ||
      normalized.colorsAndMood.length === 0 ||
      !normalized.conceptSummary
    ) {
      console.error('Gemini response incomplete')
      return response.status(502).json({ error: 'Format hasil Gemini tidak lengkap.' })
    }

    return response.status(200).json(normalized)
  } catch (error) {
    console.error('Brainstorm endpoint error:', error.message)
    return response.status(500).json({ error: `Gagal membuat ide dengan Gemini: ${error.message || 'Terjadi kesalahan server.'}` })
  }
}
