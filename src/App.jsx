import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabaseClient'

const initialProject = {
  title: '',
  subject: '',
  scene: '',
  purpose: '',
  visualStyle: '',
  artisticReference: '',
  additionalNotes: '',
}

const initialTones = {
  energy: 3,
  emotional: 3,
  mood: 3,
  power: 3,
}

const initialBrainstorm = {
  inspirationSource: '',
  specificReference: '',
  interestingThing: '',
  keywords: '',
  mainSubject: '',
  location: '',
  moment: '',
  importantObject: '',
  capturedFeeling: '',
}

const initialTodoForm = {
  title: '',
  notes: '',
  priority: 'Sedang',
}

const initialNoteForm = {
  title: '',
  content: '',
}

const toneConfig = [
  {
    key: 'energy',
    label: 'Energi',
    left: 'Tenang',
    right: 'Dinamis',
    accent: 'from-sage to-corn',
    surface: 'bg-[#f1f6e9]',
    border: 'ring-[#cbd9bd]',
    glow: 'shadow-[0_18px_40px_rgba(139,160,112,0.18)]',
    meter: '#9cad65',
    labels: { 1: 'Sangat Tenang', 2: 'Tenang', 3: 'Seimbang', 4: 'Aktif', 5: 'Dinamis' },
    idLabels: {
      1: 'sangat tenang dan hening',
      2: 'tenang dan stabil',
      3: 'seimbang',
      4: 'aktif dan hidup',
      5: 'dinamis dan penuh gerak',
    },
    enLabels: {
      1: 'very calm, quiet pacing',
      2: 'calm and steady',
      3: 'balanced energy',
      4: 'active and lively',
      5: 'dynamic movement and expressive rhythm',
    },
  },
  {
    key: 'emotional',
    label: 'Nada Emosional',
    left: 'Imut',
    right: 'Dewasa / Sensual',
    accent: 'from-blush to-plum',
    surface: 'bg-[#fff0ef]',
    border: 'ring-[#efc2bf]',
    glow: 'shadow-[0_18px_40px_rgba(204,112,128,0.16)]',
    meter: '#c76d82',
    labels: { 1: 'Sangat Imut', 2: 'Imut', 3: 'Seimbang', 4: 'Dewasa', 5: 'Dewasa / Sensual' },
    idLabels: {
      1: 'sangat imut, manis, dan playful',
      2: 'imut dan lembut',
      3: 'seimbang dan mudah didekati',
      4: 'dewasa dan elegan',
      5: 'matang, sensual, dan percaya diri',
    },
    enLabels: {
      1: 'very cute, sweet, playful',
      2: 'cute, gentle, charming',
      3: 'balanced and approachable',
      4: 'mature and elegant',
      5: 'mature, sensual, confident',
    },
  },
  {
    key: 'mood',
    label: 'Suasana',
    left: 'Hangat',
    right: 'Dingin',
    accent: 'from-corn to-pool',
    surface: 'bg-[#fff6df]',
    border: 'ring-[#e9ce8c]',
    glow: 'shadow-[0_18px_40px_rgba(204,154,70,0.16)]',
    meter: '#e0b24f',
    labels: { 1: 'Sangat Hangat', 2: 'Hangat', 3: 'Netral', 4: 'Sejuk', 5: 'Dingin' },
    idLabels: {
      1: 'sangat hangat dan akrab',
      2: 'hangat dan ramah',
      3: 'netral dengan kontras lembut',
      4: 'sejuk dan crisp',
      5: 'dingin, tenang, dan kontemplatif',
    },
    enLabels: {
      1: 'very warm palette and intimate light',
      2: 'warm palette and inviting light',
      3: 'neutral mood with soft contrast',
      4: 'cool palette and crisp light',
      5: 'cold palette, quiet atmosphere, contemplative lighting',
    },
  },
  {
    key: 'power',
    label: 'Dinamika Kekuatan',
    left: 'Rentan',
    right: 'Kuat',
    accent: 'from-pool to-plum',
    surface: 'bg-[#edf7f8]',
    border: 'ring-[#add6dc]',
    glow: 'shadow-[0_18px_40px_rgba(87,148,164,0.16)]',
    meter: '#6198a8',
    labels: { 1: 'Rentan', 2: 'Lembut', 3: 'Netral', 4: 'Percaya Diri', 5: 'Kuat' },
    idLabels: {
      1: 'rapuh, intim, dan terbuka',
      2: 'lembut dan bersahaja',
      3: 'netral dan stabil',
      4: 'percaya diri dan tegas',
      5: 'kuat, dominan, dan berwibawa',
    },
    enLabels: {
      1: 'vulnerable, intimate body language',
      2: 'soft and humble presence',
      3: 'neutral and grounded presence',
      4: 'confident and assertive',
      5: 'strong, powerful, commanding presence',
    },
  },
]

const starterTemplates = [
  {
    id: 'cozy-character-key-visual',
    name: 'Karakter Hangat',
    project: {
      title: 'Visual Karakter Hangat',
      subject: 'kreator muda yang lembut dengan jimat buatan tangan',
      scene: 'duduk dekat jendela bercahaya matahari dengan alat kecil, catatan, dan benda kenangan',
      purpose: 'membuat ilustrasi hero yang ramah untuk media sosial atau sampul portofolio',
      visualStyle: 'ilustrasi editorial lembut dengan tekstur halus',
      artisticReference: 'kehangatan buku cerita, editorial gaya hidup cozy, tekstur hand-painted',
      additionalNotes: 'Jaga ekspresi wajah tetap terbaca dan komposisi tetap sederhana.',
    },
    tones: { energy: 2, emotional: 2, mood: 1, power: 2 },
  },
  {
    id: 'bold-fashion-poster',
    name: 'Poster Berani',
    project: {
      title: 'Poster Fashion Berani',
      subject: 'karakter utama bergaya dengan pakaian dramatis',
      scene: 'berdiri di bawah pencahayaan studio tajam dengan bentuk grafis dan kain tertiup angin',
      purpose: 'membangun poster promosi yang mencolok dengan sikap visual kuat',
      visualStyle: 'ilustrasi fashion semi-realistis yang polished',
      artisticReference: 'kampanye high-fashion, poster editorial tegas, komposisi grafis bersih',
      additionalNotes: 'Gunakan siluet kuat dan kontak mata yang percaya diri.',
    },
    tones: { energy: 5, emotional: 5, mood: 4, power: 5 },
  },
  {
    id: 'quiet-cinematic-scene',
    name: 'Sinematik Hening',
    project: {
      title: 'Adegan Sinematik Hening',
      subject: 'pengelana sendirian membawa lentera kecil',
      scene: 'berjalan melalui stasiun kosong saat fajar dengan pantulan cahaya biru pucat di lantai',
      purpose: 'membuat ilustrasi naratif dengan ketegangan emosional dan keheningan sinematik',
      visualStyle: 'lukisan digital sinematik dengan pencahayaan halus',
      artisticReference: 'still frame sinematik, concept art atmosferik, drama fiksi ilmiah yang hening',
      additionalNotes: 'Utamakan pencahayaan, ruang kosong, dan mood yang terbaca.',
    },
    tones: { energy: 1, emotional: 4, mood: 5, power: 1 },
  },
]

function normalizeToneValue(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 3
  if (number >= 1 && number <= 5) return number
  return Math.min(5, Math.max(1, Math.round(number / 25) + 1))
}

function normalizeTones(tones = {}) {
  return {
    energy: normalizeToneValue(tones.energy),
    emotional: normalizeToneValue(tones.emotional),
    mood: normalizeToneValue(tones.mood),
    power: normalizeToneValue(tones.power),
  }
}

function normalizeProject(project = {}) {
  return { ...initialProject, ...project }
}

function normalizeBrainstorm(brainstorm = {}) {
  return { ...initialBrainstorm, ...brainstorm }
}

function mapTemplateRow(row) {
  return {
    id: row.id,
    name: row.name,
    project: normalizeProject(row.project),
    tones: normalizeTones(row.tones),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapBrainstormRow(row) {
  return {
    id: row.id,
    name: row.name,
    idea: normalizeBrainstorm(row.idea),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapTodoRow(row) {
  return {
    id: row.id,
    title: row.title || '',
    notes: row.notes || '',
    priority: row.priority || 'Sedang',
    isDone: Boolean(row.is_done),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapNoteRow(row) {
  return {
    id: row.id,
    title: row.title || '',
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function cleanTemplateForImport(item, index) {
  const project = normalizeProject(item?.project)
  const tones = normalizeTones(item?.tones)
  const fallbackName = project.title || `Template Import ${index + 1}`

  return {
    name: typeof item?.name === 'string' && item.name.trim() ? item.name.trim() : fallbackName,
    project,
    tones,
  }
}

function validateTemplateBackup(payload) {
  if (!payload || typeof payload !== 'object') return null
  if (!Array.isArray(payload.templates)) return null
  return payload.templates.map(cleanTemplateForImport)
}

function normalizeTemplateName(name) {
  return String(name || '').trim().toLowerCase()
}

function templateNameExists(name, templates, ignoredId = '') {
  const normalized = normalizeTemplateName(name)
  return templates.some((template) => template.id !== ignoredId && normalizeTemplateName(template.name) === normalized)
}

function getNextTemplateName(baseName, templates, ignoredId = '') {
  const cleanBase = String(baseName || 'Template Tanpa Nama').trim() || 'Template Tanpa Nama'
  if (!templateNameExists(cleanBase, templates, ignoredId)) return cleanBase

  let index = 1
  let candidate = `${cleanBase} (${index})`
  while (templateNameExists(candidate, templates, ignoredId)) {
    index += 1
    candidate = `${cleanBase} (${index})`
  }
  return candidate
}

function getToneConfig(key) {
  return toneConfig.find((tone) => tone.key === key)
}

function toneLabel(key, value) {
  return getToneConfig(key).labels[value]
}

function tonePhrase(key, value, language) {
  const config = getToneConfig(key)
  return language === 'id' ? config.idLabels[value] : config.enLabels[value]
}

function generateOutputs(project, tones) {
  const subject = project.subject || 'main illustrated character'
  const scene = project.scene || 'a clear, readable visual situation'
  const purpose = project.purpose || 'create a focused illustration concept'
  const style = project.visualStyle || 'soft modern illustration'
  const reference = project.artisticReference || 'clean contemporary illustration references'
  const notes = project.additionalNotes || 'keep the image polished, readable, and intentional'

  const toneSummary = toneConfig
    .map((tone) => `${tone.label}: ${tones[tone.key]} - ${toneLabel(tone.key, tones[tone.key])}`)
    .join('\n')

  const idTones = [
    tonePhrase('energy', tones.energy, 'id'),
    tonePhrase('emotional', tones.emotional, 'id'),
    tonePhrase('mood', tones.mood, 'id'),
    tonePhrase('power', tones.power, 'id'),
  ].join(', ')

  const enTones = [
    tonePhrase('energy', tones.energy, 'en'),
    tonePhrase('emotional', tones.emotional, 'en'),
    tonePhrase('mood', tones.mood, 'en'),
    tonePhrase('power', tones.power, 'en'),
  ].join(', ')

  return {
    summary: toneSummary,
    artDirection: `Arahkan ilustrasi "${project.title || 'Proyek Tanpa Judul'}" sebagai ${style} tentang ${subject}. Situasi utama: ${scene}. Tujuan visual: ${purpose}. Tone diarahkan menjadi ${idTones}. Gunakan referensi artistik seperti ${reference}. Catatan tambahan: ${notes}. Pastikan focal point jelas, gestur terbaca, warna mendukung mood, dan detail visual tidak mengganggu narasi utama.`,
    prompt: `${style} of ${subject}, scene: ${scene}, purpose: ${purpose}. Artistic reference: ${reference}. Tone direction: ${enTones}. Additional notes: ${notes}. Clean composition, clear focal point, expressive pose, thoughtful color palette, polished illustration, high quality art direction.`,
    negativePrompt: 'low quality, blurry, messy anatomy, extra fingers, distorted face, cluttered composition, unreadable details, harsh artifacts, watermark, text',
  }
}

function generateBrainstormOutputs(brainstorm) {
  const subject = brainstorm.mainSubject || 'subjek utama belum ditentukan'
  const location = brainstorm.location || 'lokasi belum ditentukan'
  const moment = brainstorm.moment || 'momen atau aktivitas belum ditentukan'
  const object = brainstorm.importantObject || 'objek penting belum ditentukan'
  const feeling = brainstorm.capturedFeeling || 'rasa yang ingin ditangkap belum ditentukan'
  const source = brainstorm.inspirationSource || 'sumber inspirasi belum ditentukan'
  const reference = brainstorm.specificReference || 'referensi spesifik belum ditentukan'
  const interesting = brainstorm.interestingThing || 'hal menarik belum ditentukan'
  const keywords = brainstorm.keywords || 'kata kunci belum ditentukan'

  return {
    summary: `Ide gambar ini berangkat dari ${source}, terutama referensi ${reference}. Hal yang menarik untuk diangkat adalah ${interesting}. Visual berfokus pada ${subject} di ${location}, sedang mengalami momen ${moment}. Rasa utama yang ingin ditangkap adalah ${feeling}, dengan kata kunci: ${keywords}.`,
    visualElements: `Elemen visual yang bisa dipakai: lokasi ${location}; objek penting ${object}; nuansa rasa ${feeling}; kata kunci ${keywords}. Kombinasikan elemen tersebut sebagai focal point, detail pendukung, palet warna, gestur, dan atmosfer agar ide terasa utuh.`,
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataStatus, setDataStatus] = useState('')
  const [saveStatus, setSaveStatus] = useState('')
  const [project, setProject] = useState(initialProject)
  const [tones, setTones] = useState(initialTones)
  const [templates, setTemplates] = useState([])
  const [templateName, setTemplateName] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [brainstorm, setBrainstorm] = useState(initialBrainstorm)
  const [brainstorms, setBrainstorms] = useState([])
  const [brainstormName, setBrainstormName] = useState('')
  const [selectedBrainstormId, setSelectedBrainstormId] = useState('')
  const [todos, setTodos] = useState([])
  const [todoForm, setTodoForm] = useState(initialTodoForm)
  const [editingTodoId, setEditingTodoId] = useState('')
  const [todoFilter, setTodoFilter] = useState('semua')
  const [notes, setNotes] = useState([])
  const [noteForm, setNoteForm] = useState(initialNoteForm)
  const [editingNoteId, setEditingNoteId] = useState('')
  const [noteSearch, setNoteSearch] = useState('')
  const [copiedTarget, setCopiedTarget] = useState('')

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data.session?.user || null)
      setAuthLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setAuthLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadUserData()
  }, [user])

  const outputs = useMemo(() => generateOutputs(project, tones), [project, tones])
  const brainstormOutputs = useMemo(() => generateBrainstormOutputs(brainstorm), [brainstorm])

  const loadUserData = async () => {
    if (!user) {
      setDataStatus('Silakan login terlebih dahulu')
      return
    }

    setDataStatus('Memuat data...')
    const [templateResult, brainstormResult, todoResult, noteResult] = await Promise.all([
      supabase.from('tone_templates').select('*').order('updated_at', { ascending: false }),
      supabase.from('brainstorming_ideas').select('*').order('updated_at', { ascending: false }),
      supabase.from('todos').select('*').order('created_at', { ascending: false }),
      supabase.from('notes').select('*').order('updated_at', { ascending: false }),
    ])

    if (templateResult.error || brainstormResult.error || todoResult.error || noteResult.error) {
      setDataStatus(todoResult.error ? 'Gagal memuat tugas' : noteResult.error ? 'Gagal memuat catatan' : 'Gagal memuat data')
      return
    }

    setTemplates(templateResult.data.map(mapTemplateRow))
    setBrainstorms(brainstormResult.data.map(mapBrainstormRow))
    setTodos(todoResult.data.map(mapTodoRow))
    setNotes(noteResult.data.map(mapNoteRow))
    setDataStatus('Tersimpan')
  }

  const updateProject = (field, value) => {
    setProject((current) => ({ ...current, [field]: value }))
  }

  const updateBrainstorm = (field, value) => {
    setBrainstorm((current) => ({ ...current, [field]: value }))
  }

  const updateTodoForm = (field, value) => {
    setTodoForm((current) => ({ ...current, [field]: value }))
  }

  const updateNoteForm = (field, value) => {
    setNoteForm((current) => ({ ...current, [field]: value }))
  }

  const updateTone = (field, value) => {
    setTones((current) => ({ ...current, [field]: Number(value) }))
  }

  const saveTemplate = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }

    let name = templateName.trim() || project.title.trim() || `Template ${templates.length + 1}`
    const isDuplicate = templateNameExists(name, templates)

    if (isDuplicate) {
      setSaveStatus('Nama template sudah digunakan')
      const confirmed = window.confirm('Template dengan nama ini sudah ada. Tetap simpan sebagai template baru?')
      if (!confirmed) return
      name = getNextTemplateName(name, templates)
    }

    setSaveStatus('Menyimpan...')
    const { data, error } = await supabase
      .from('tone_templates')
      .insert({ user_id: user.id, name, project, tones })
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    const template = mapTemplateRow(data)
    setTemplates((current) => [template, ...current])
    setSelectedTemplateId(`saved:${template.id}`)
    setTemplateName(template.name)
    setSaveStatus(isDuplicate ? `Template berhasil disimpan sebagai ${template.name}` : 'Template berhasil disimpan')
  }

  const updateSavedTemplate = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }
    if (!selectedTemplateId.startsWith('saved:')) return

    setSaveStatus('Menyimpan...')
    const id = selectedTemplateId.replace('saved:', '')
    let name = templateName.trim() || project.title.trim() || 'Template Tanpa Nama'
    const isDuplicate = templateNameExists(name, templates, id)

    if (isDuplicate) {
      setSaveStatus('Nama template sudah digunakan')
      const confirmed = window.confirm('Nama template ini sudah dipakai. Tetap perbarui dengan nama baru otomatis?')
      if (!confirmed) return
      name = getNextTemplateName(name, templates, id)
    }

    const { data, error } = await supabase
      .from('tone_templates')
      .update({ name, project, tones })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    const updated = mapTemplateRow(data)
    setTemplates((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    setTemplateName(updated.name)
    setSaveStatus('Template berhasil diperbarui')
  }

  const exportTemplates = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }

    setSaveStatus('Meng-export template...')
    const { data, error } = await supabase
      .from('tone_templates')
      .select('name, project, tones, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      setSaveStatus('Gagal export template')
      return
    }

    const payload = {
      versi_backup: 1,
      tanggal_export: new Date().toISOString(),
      jumlah_template: data.length,
      templates: data.map((item) => ({
        name: item.name,
        project: normalizeProject(item.project),
        tones: normalizeTones(item.tones),
      })),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    anchor.href = url
    anchor.download = `backup-template-tone-${date}.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setSaveStatus('Template berhasil diexport')
  }

  const importTemplates = async (file) => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }
    if (!file) return

    setSaveStatus('Meng-import template...')

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const cleanTemplates = validateTemplateBackup(parsed)

      if (!cleanTemplates) {
        setSaveStatus('Format file backup tidak valid')
        return
      }

      if (cleanTemplates.length === 0) {
        setSaveStatus('Template berhasil diimport: 0 template diimport')
        return
      }

      const rows = cleanTemplates.map((template) => ({
        user_id: user.id,
        name: template.name,
        project: template.project,
        tones: template.tones,
      }))
      const { error } = await supabase.from('tone_templates').insert(rows)

      if (error) {
        setSaveStatus('Gagal import template')
        return
      }

      await loadUserData()
      setSaveStatus(`Template berhasil diimport: ${rows.length} template diimport`)
    } catch {
      setSaveStatus('Format file backup tidak valid')
    }
  }

  const loadSelectedTemplate = () => {
    if (selectedTemplateId.startsWith('starter:')) {
      const template = starterTemplates.find((item) => item.id === selectedTemplateId.replace('starter:', ''))
      if (!template) return
      loadTemplate(template)
      return
    }

    const template = templates.find((item) => item.id === selectedTemplateId.replace('saved:', ''))
    if (!template) return
    setProject(normalizeProject(template.project))
    setTones(normalizeTones(template.tones))
    setTemplateName(template.name)
    setSaveStatus('Template berhasil dimuat')
  }

  const deleteTemplate = async () => {
    if (!selectedTemplateId.startsWith('saved:')) return
    const confirmed = window.confirm('Yakin ingin menghapus template ini?')
    if (!confirmed) return

    setSaveStatus('Menyimpan...')
    const id = selectedTemplateId.replace('saved:', '')
    const { error } = await supabase.from('tone_templates').delete().eq('id', id)

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    setTemplates((current) => current.filter((item) => item.id !== id))
    setSelectedTemplateId('')
    setTemplateName('')
    setSaveStatus('Template berhasil dihapus')
  }

  const resetForm = () => {
    const confirmed = window.confirm('Yakin ingin mengosongkan semua isian? Template yang sudah tersimpan tidak akan dihapus.')
    if (!confirmed) return
    setProject(initialProject)
    setTones(initialTones)
    setTemplateName('')
    setSelectedTemplateId('')
    setSaveStatus('Form berhasil dikosongkan')
  }

  const resetToneSliders = () => {
    setTones(initialTones)
    setSaveStatus('Slider tone berhasil direset')
  }

  const loadTemplate = (template) => {
    setProject(normalizeProject(template.project))
    setTones(normalizeTones(template.tones))
    setTemplateName(template.name)
    setSaveStatus('Template berhasil dimuat')
  }

  const saveBrainstorm = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }

    setSaveStatus('Menyimpan...')
    const name = brainstormName.trim() || brainstorm.mainSubject.trim() || `Ide ${brainstorms.length + 1}`
    const { data, error } = await supabase
      .from('brainstorming_ideas')
      .insert({ user_id: user.id, name, idea: brainstorm })
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    const saved = mapBrainstormRow(data)
    setBrainstorms((current) => [saved, ...current])
    setSelectedBrainstormId(saved.id)
    setBrainstormName(saved.name)
    setSaveStatus('Tersimpan')
  }

  const updateSavedBrainstorm = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }
    if (!selectedBrainstormId) return

    setSaveStatus('Menyimpan...')
    const name = brainstormName.trim() || brainstorm.mainSubject.trim() || 'Ide Tanpa Nama'
    const { data, error } = await supabase
      .from('brainstorming_ideas')
      .update({ name, idea: brainstorm })
      .eq('id', selectedBrainstormId)
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    const updated = mapBrainstormRow(data)
    setBrainstorms((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    setBrainstormName(updated.name)
    setSaveStatus('Tersimpan')
  }

  const loadSelectedBrainstorm = () => {
    const selected = brainstorms.find((item) => item.id === selectedBrainstormId)
    if (!selected) return
    setBrainstorm(normalizeBrainstorm(selected.idea))
    setBrainstormName(selected.name)
  }

  const deleteBrainstorm = async () => {
    if (!selectedBrainstormId) return

    setSaveStatus('Menyimpan...')
    const { error } = await supabase.from('brainstorming_ideas').delete().eq('id', selectedBrainstormId)

    if (error) {
      setSaveStatus('Gagal menyimpan')
      return
    }

    setBrainstorms((current) => current.filter((item) => item.id !== selectedBrainstormId))
    setSelectedBrainstormId('')
    setBrainstormName('')
    setSaveStatus('Tersimpan')
  }

  const resetBrainstorm = () => {
    setBrainstorm(initialBrainstorm)
    setBrainstormName('')
    setSelectedBrainstormId('')
  }

  const sendBrainstormToTemplate = () => {
    const sceneParts = [brainstorm.location, brainstorm.moment].filter(Boolean).join(' - ')
    setProject((current) => ({
      ...current,
      subject: brainstorm.mainSubject,
      scene: sceneParts,
      additionalNotes: brainstormOutputs.summary,
    }))
    setActiveTab('template')
  }

  const resetTodoForm = () => {
    setTodoForm(initialTodoForm)
    setEditingTodoId('')
  }

  const saveTodo = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }

    const title = todoForm.title.trim()
    if (!title) {
      setSaveStatus('Judul tugas wajib diisi')
      return
    }

    setSaveStatus('Menyimpan...')
    const payload = {
      title,
      notes: todoForm.notes.trim() || null,
      priority: todoForm.priority,
    }

    if (editingTodoId) {
      const { data, error } = await supabase
        .from('todos')
        .update(payload)
        .eq('id', editingTodoId)
        .select()
        .single()

      if (error) {
        setSaveStatus('Gagal menyimpan tugas')
        return
      }

      const updated = mapTodoRow(data)
      setTodos((current) => current.map((todo) => (todo.id === updated.id ? updated : todo)))
      resetTodoForm()
      setSaveStatus('Tugas berhasil diperbarui')
      return
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id: user.id, ...payload, is_done: false })
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan tugas')
      return
    }

    setTodos((current) => [mapTodoRow(data), ...current])
    resetTodoForm()
    setSaveStatus('Tugas berhasil ditambahkan')
  }

  const editTodo = (todo) => {
    setTodoForm({
      title: todo.title,
      notes: todo.notes,
      priority: todo.priority,
    })
    setEditingTodoId(todo.id)
  }

  const toggleTodoDone = async (todo) => {
    setSaveStatus('Menyimpan...')
    const { data, error } = await supabase
      .from('todos')
      .update({ is_done: !todo.isDone })
      .eq('id', todo.id)
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan tugas')
      return
    }

    const updated = mapTodoRow(data)
    setTodos((current) => current.map((item) => (item.id === updated.id ? updated : item)))
    setSaveStatus(updated.isDone ? 'Tugas selesai' : 'Status tugas diperbarui')
  }

  const deleteTodo = async (todoId) => {
    const confirmed = window.confirm('Yakin ingin menghapus tugas ini?')
    if (!confirmed) return

    setSaveStatus('Menyimpan...')
    const { error } = await supabase.from('todos').delete().eq('id', todoId)

    if (error) {
      setSaveStatus('Gagal menyimpan tugas')
      return
    }

    setTodos((current) => current.filter((todo) => todo.id !== todoId))
    if (editingTodoId === todoId) resetTodoForm()
    setSaveStatus('Tugas berhasil dihapus')
  }

  const resetNoteForm = () => {
    setNoteForm(initialNoteForm)
    setEditingNoteId('')
  }

  const saveNote = async () => {
    if (!user) {
      setSaveStatus('Silakan login terlebih dahulu')
      return
    }

    const title = noteForm.title.trim()
    if (!title) {
      setSaveStatus('Judul catatan wajib diisi')
      return
    }

    setSaveStatus('Menyimpan...')
    const payload = {
      title,
      content: noteForm.content.trim() || null,
    }

    if (editingNoteId) {
      const { data, error } = await supabase
        .from('notes')
        .update(payload)
        .eq('id', editingNoteId)
        .select()
        .single()

      if (error) {
        setSaveStatus('Gagal menyimpan catatan')
        return
      }

      const updated = mapNoteRow(data)
      setNotes((current) => current.map((note) => (note.id === updated.id ? updated : note)))
      resetNoteForm()
      setSaveStatus('Catatan berhasil diperbarui')
      return
    }

    const { data, error } = await supabase
      .from('notes')
      .insert({ user_id: user.id, ...payload })
      .select()
      .single()

    if (error) {
      setSaveStatus('Gagal menyimpan catatan')
      return
    }

    setNotes((current) => [mapNoteRow(data), ...current])
    resetNoteForm()
    setSaveStatus('Catatan berhasil disimpan')
  }

  const editNote = (note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
    })
    setEditingNoteId(note.id)
  }

  const deleteNote = async (noteId) => {
    const confirmed = window.confirm('Yakin ingin menghapus catatan ini?')
    if (!confirmed) return

    setSaveStatus('Menyimpan...')
    const { error } = await supabase.from('notes').delete().eq('id', noteId)

    if (error) {
      setSaveStatus('Gagal menyimpan catatan')
      return
    }

    setNotes((current) => current.filter((note) => note.id !== noteId))
    if (editingNoteId === noteId) resetNoteForm()
    setSaveStatus('Catatan berhasil dihapus')
  }

  const copyText = async (label, text) => {
    await navigator.clipboard.writeText(text)
    setCopiedTarget(label)
    window.setTimeout(() => setCopiedTarget(''), 1500)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setTemplates([])
    setBrainstorms([])
    setTodos([])
    setNotes([])
    setProject(initialProject)
    setBrainstorm(initialBrainstorm)
    setTodoForm(initialTodoForm)
    setNoteForm(initialNoteForm)
    setEditingTodoId('')
    setEditingNoteId('')
    setSaveStatus('Silakan login terlebih dahulu')
  }

  if (authLoading) {
    return <Shell><Panel title="Status">Memuat data...</Panel></Shell>
  }

  if (!user) {
    return (
      <Shell>
        <AuthPage />
      </Shell>
    )
  }

  return (
    <Shell>
      <header className="relative flex flex-col justify-between gap-4 overflow-hidden rounded-[28px] bg-white/80 p-5 shadow-soft ring-1 ring-white backdrop-blur lg:flex-row lg:items-end">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sage via-corn via-blush to-pool" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-plum">Brief ilustrasi tersinkron</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Web Deddy</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base">
            Ruang kerja pribadi untuk ide, ilustrasi, catatan, dan tugas.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-ink/55">
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-[#eadfce]">{user.email}</span>
            <StatusBadge text={saveStatus || dataStatus || 'Tersimpan'} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="btn-danger" type="button" onClick={logout}>
            Keluar
          </button>
        </div>
      </header>

      {activeTab === 'home' ? (
        <HomeView setActiveTab={setActiveTab} />
      ) : activeTab === 'template' ? (
        <>
          <BackHomeButton setActiveTab={setActiveTab} />
        <TemplateToneView
          copiedTarget={copiedTarget}
          copyText={copyText}
          deleteTemplate={deleteTemplate}
          loadSelectedTemplate={loadSelectedTemplate}
          outputs={outputs}
          project={project}
          resetForm={resetForm}
          resetToneSliders={resetToneSliders}
          exportTemplates={exportTemplates}
          importTemplates={importTemplates}
          saveTemplate={saveTemplate}
          selectedTemplateId={selectedTemplateId}
          setSelectedTemplateId={setSelectedTemplateId}
          setTemplateName={setTemplateName}
          starterTemplates={starterTemplates}
          templateName={templateName}
          templates={templates}
          tones={tones}
          updateProject={updateProject}
          updateSavedTemplate={updateSavedTemplate}
          updateTone={updateTone}
        />
        </>
      ) : activeTab === 'brainstorm' ? (
        <>
          <BackHomeButton setActiveTab={setActiveTab} />
        <BrainstormingView
          brainstorm={brainstorm}
          brainstormName={brainstormName}
          brainstorms={brainstorms}
          copiedTarget={copiedTarget}
          copyText={copyText}
          deleteBrainstorm={deleteBrainstorm}
          loadSelectedBrainstorm={loadSelectedBrainstorm}
          outputs={brainstormOutputs}
          resetBrainstorm={resetBrainstorm}
          saveBrainstorm={saveBrainstorm}
          selectedBrainstormId={selectedBrainstormId}
          sendBrainstormToTemplate={sendBrainstormToTemplate}
          setBrainstormName={setBrainstormName}
          setSelectedBrainstormId={setSelectedBrainstormId}
          updateBrainstorm={updateBrainstorm}
          updateSavedBrainstorm={updateSavedBrainstorm}
        />
        </>
      ) : (
        activeTab === 'todo' ? (
        <>
          <BackHomeButton setActiveTab={setActiveTab} />
        <TodoListView
          deleteTodo={deleteTodo}
          editTodo={editTodo}
          editingTodoId={editingTodoId}
          resetTodoForm={resetTodoForm}
          saveTodo={saveTodo}
          setTodoFilter={setTodoFilter}
          todoFilter={todoFilter}
          todoForm={todoForm}
          todos={todos}
          toggleTodoDone={toggleTodoDone}
          updateTodoForm={updateTodoForm}
        />
        </>
        ) : (
        <>
          <BackHomeButton setActiveTab={setActiveTab} />
          <NotesView
            deleteNote={deleteNote}
            editNote={editNote}
            editingNoteId={editingNoteId}
            noteForm={noteForm}
            noteSearch={noteSearch}
            notes={notes}
            resetNoteForm={resetNoteForm}
            saveNote={saveNote}
            setNoteSearch={setNoteSearch}
            updateNoteForm={updateNoteForm}
          />
        </>
        )
      )}
    </Shell>
  )
}

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: 'info', text: 'Silakan login terlebih dahulu' })
  const isLogin = mode === 'login'

  const submit = async (event) => {
    event.preventDefault()
    setStatus({ type: 'info', text: 'Memuat data...' })

    const result = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (result.error) {
      setStatus({ type: 'error', text: result.error.message })
      return
    }

    setStatus({
      type: 'success',
      text: isLogin ? 'Login berhasil.' : 'Pendaftaran berhasil. Silakan periksa email untuk konfirmasi akun jika diminta.',
    })
  }

  return (
    <section className="mx-auto w-full max-w-md rounded-[28px] bg-white/86 p-6 shadow-soft ring-1 ring-white/90 backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-plum">Akun Supabase</p>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-[#f8f5ee] p-2 ring-1 ring-[#eadfce]">
        <button
          className={`rounded-xl px-4 py-3 text-sm font-bold transition ${isLogin ? 'bg-ink text-white shadow-[0_10px_20px_rgba(32,33,43,0.18)]' : 'text-ink/60 hover:bg-white hover:text-ink'}`}
          type="button"
          onClick={() => setMode('login')}
        >
          Masuk
        </button>
        <button
          className={`rounded-xl px-4 py-3 text-sm font-bold transition ${!isLogin ? 'bg-ink text-white shadow-[0_10px_20px_rgba(32,33,43,0.18)]' : 'text-ink/60 hover:bg-white hover:text-ink'}`}
          type="button"
          onClick={() => setMode('register')}
        >
          Daftar Akun
        </button>
      </div>
      <h1 className="mt-5 text-3xl font-bold">{isLogin ? 'Masuk ke Illustration Studio' : 'Daftar Akun Illustration Studio'}</h1>
      <p className="mt-2 text-sm leading-6 text-ink/65">
        {isLogin
          ? 'Masuk untuk membuka Template Tone dan Brainstorming Ide milikmu.'
          : 'Buat akun untuk menyimpan data dan menyinkronkannya antar perangkat.'}
      </p>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <Field label="Email" value={email} onChange={setEmail} placeholder="nama@email.com" />
        <Field label="Kata Sandi" value={password} onChange={setPassword} placeholder="Minimal 6 karakter" type="password" />
        <button className="btn-primary w-full" type="submit">
          {isLogin ? 'Masuk' : 'Daftar Akun'}
        </button>
      </form>
      <button className="mt-4 text-sm font-bold text-plum hover:text-ink" type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {isLogin ? 'Belum punya akun? Daftar Akun' : 'Sudah punya akun? Masuk'}
      </button>
      <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ring-1 ${
        status.type === 'success'
          ? 'bg-[#eaf6e8] text-[#275c35] ring-[#b9ddb8]'
          : status.type === 'error'
            ? 'bg-[#fff0ef] text-[#8a2932] ring-[#efc2bf]'
            : 'bg-[#f8f5ee] text-ink/75 ring-[#eadfce]'
      }`}>
        {status.text}
      </p>
    </section>
  )
}

function TemplateToneView({
  copiedTarget,
  copyText,
  deleteTemplate,
  loadSelectedTemplate,
  outputs,
  project,
  resetForm,
  resetToneSliders,
  exportTemplates,
  importTemplates,
  saveTemplate,
  selectedTemplateId,
  setSelectedTemplateId,
  setTemplateName,
  starterTemplates,
  templateName,
  templates,
  tones,
  updateProject,
  updateSavedTemplate,
  updateTone,
}) {
  return (
    <section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex min-w-0 flex-col gap-6">
        <Panel title="Template">
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#f8f5ee] p-4 ring-1 ring-[#eadfce]">
              <h3 className="mb-3 text-sm font-bold text-ink/70">Template Baru</h3>
              <div className="grid min-w-0 gap-3">
                <input className="input-base min-w-0" value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Nama template" />
                <div className="flex min-w-0 flex-wrap gap-3">
                <button className="btn-primary" type="button" onClick={saveTemplate}>Simpan Template</button>
                <button className="btn-secondary" type="button" onClick={updateSavedTemplate} disabled={!selectedTemplateId.startsWith('saved:')}>Perbarui Template</button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8f5ee] p-4 ring-1 ring-[#eadfce]">
              <h3 className="mb-3 text-sm font-bold text-ink/70">Template Tersimpan</h3>
              <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
                <select className="input-base min-w-0" value={selectedTemplateId} onChange={(event) => setSelectedTemplateId(event.target.value)}>
                  <option value="">Pilih template tersimpan</option>
                  <optgroup label="Template awal">
                    {starterTemplates.map((template) => <option key={template.id} value={`starter:${template.id}`}>{template.name}</option>)}
                  </optgroup>
                  {templates.length > 0 && (
                    <optgroup label="Template tersimpan">
                      {templates.map((template) => <option key={template.id} value={`saved:${template.id}`}>{template.name}</option>)}
                    </optgroup>
                  )}
                </select>
                <button className="btn-secondary" type="button" onClick={loadSelectedTemplate} disabled={!selectedTemplateId}>Muat Template</button>
                <button className="btn-danger" type="button" onClick={deleteTemplate} disabled={!selectedTemplateId.startsWith('saved:')}>Hapus Template</button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#f8f5ee] p-4 ring-1 ring-[#eadfce]">
              <h3 className="mb-3 text-sm font-bold text-ink/70">Backup Template</h3>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary px-4 py-2" type="button" onClick={exportTemplates}>Export Template</button>
                <label className="btn-secondary cursor-pointer px-4 py-2">
                  Import Template
                  <input
                    className="hidden"
                    type="file"
                    accept="application/json,.json"
                    onChange={(event) => {
                      importTemplates(event.target.files?.[0])
                      event.target.value = ''
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Brief Proyek">
          <div className="mb-4 flex flex-wrap justify-end gap-3">
            <button className="btn-danger px-4 py-2" type="button" onClick={resetForm}>Kosongkan Semua</button>
          </div>
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <Field label="Judul" value={project.title} onChange={(value) => updateProject('title', value)} onClear={() => updateProject('title', '')} placeholder="Contoh: Poster Toko Roti Tengah Malam" />
            <Field label="Subjek / Karakter" value={project.subject} onChange={(value) => updateProject('subject', value)} onClear={() => updateProject('subject', '')} placeholder="Contoh: koki pastry muda dengan teman rubah kecil" />
            <Field label="Adegan / Situasi" value={project.scene} onChange={(value) => updateProject('scene', value)} onClear={() => updateProject('scene', '')} multiline placeholder="Contoh: menutup toko roti hangat saat lampu kota menyala di luar" />
            <Field label="Tujuan" value={project.purpose} onChange={(value) => updateProject('purpose', value)} onClear={() => updateProject('purpose', '')} multiline placeholder="Contoh: membuat key visual hangat untuk kampanye media sosial" />
            <div className="sm:col-span-2"><Field label="Gaya Visual" value={project.visualStyle} onChange={(value) => updateProject('visualStyle', value)} onClear={() => updateProject('visualStyle', '')} placeholder="Contoh: ilustrasi editorial lembut, anime semi-realistis, buku cerita cat air" /></div>
            <div className="sm:col-span-2"><Field label="Referensi Artistik" value={project.artisticReference} onChange={(value) => updateProject('artisticReference', value)} onClear={() => updateProject('artisticReference', '')} placeholder="Contoh: editorial cozy, concept art sinematik, sampul manga bersih" /></div>
            <div className="sm:col-span-2"><Field label="Catatan Tambahan" value={project.additionalNotes} onChange={(value) => updateProject('additionalNotes', value)} onClear={() => updateProject('additionalNotes', '')} multiline placeholder="Contoh: latar jangan terlalu ramai, tekankan gestur tangan, hindari teks di gambar" /></div>
          </div>
        </Panel>

        <Panel title="Pengatur Tone">
          <div className="mb-4 flex justify-end">
            <button className="text-left text-sm font-bold text-ink/65 hover:text-ink" type="button" onClick={resetToneSliders}>Reset</button>
          </div>
          <div className="space-y-5">
            {toneConfig.map((tone) => <ToneSlider key={tone.key} tone={tone} value={tones[tone.key]} onChange={(value) => updateTone(tone.key, value)} />)}
          </div>
        </Panel>
      </div>

      <div className="flex min-w-0 flex-col gap-6">
        <Panel title="Ringkasan Tone"><OutputBlock text={outputs.summary} compact preLine /></Panel>
        <Panel title="Arahan Seni">
          <OutputActions copied={copiedTarget === 'art'} label="Salin Arahan Seni" onCopy={() => copyText('art', outputs.artDirection)} />
          <OutputBlock text={outputs.artDirection} />
        </Panel>
        <Panel title="Prompt Gambar AI">
          <OutputActions copied={copiedTarget === 'prompt'} label="Salin Prompt AI" onCopy={() => copyText('prompt', outputs.prompt)} />
          <OutputBlock text={outputs.prompt} />
        </Panel>
        <Panel title="Prompt Negatif"><OutputBlock text={outputs.negativePrompt} compact /></Panel>
      </div>
    </section>
  )
}

function BrainstormingView({
  brainstorm,
  brainstormName,
  brainstorms,
  copiedTarget,
  copyText,
  deleteBrainstorm,
  loadSelectedBrainstorm,
  outputs,
  resetBrainstorm,
  saveBrainstorm,
  selectedBrainstormId,
  sendBrainstormToTemplate,
  setBrainstormName,
  setSelectedBrainstormId,
  updateBrainstorm,
  updateSavedBrainstorm,
}) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col gap-6">
        <Panel title="Data Ide">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input className="input-base" value={brainstormName} onChange={(event) => setBrainstormName(event.target.value)} placeholder="Nama ide" />
            <button className="btn-primary" type="button" onClick={saveBrainstorm}>Simpan</button>
            <button className="btn-secondary" type="button" onClick={updateSavedBrainstorm} disabled={!selectedBrainstormId}>Perbarui</button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <select className="input-base" value={selectedBrainstormId} onChange={(event) => setSelectedBrainstormId(event.target.value)}>
              <option value="">Pilih ide tersimpan</option>
              {brainstorms.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <button className="btn-secondary" type="button" onClick={loadSelectedBrainstorm} disabled={!selectedBrainstormId}>Muat</button>
            <button className="btn-danger" type="button" onClick={deleteBrainstorm} disabled={!selectedBrainstormId}>Hapus</button>
          </div>
        </Panel>

        <Panel title="Inspirasi">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sumber Inspirasi" value={brainstorm.inspirationSource} onChange={(value) => updateBrainstorm('inspirationSource', value)} placeholder="Contoh: lagu, film, memori masa kecil, foto perjalanan" />
            <Field label="Referensi Spesifik" value={brainstorm.specificReference} onChange={(value) => updateBrainstorm('specificReference', value)} placeholder="Contoh: adegan hujan di film, cover album, foto pasar malam" />
            <Field label="Hal yang Menarik" value={brainstorm.interestingThing} onChange={(value) => updateBrainstorm('interestingThing', value)} multiline placeholder="Contoh: kontras antara lampu hangat dan langit dingin" />
            <Field label="Kata Kunci" value={brainstorm.keywords} onChange={(value) => updateBrainstorm('keywords', value)} multiline placeholder="Contoh: hening, neon, nostalgia, kain merah, kabut tipis" />
          </div>
        </Panel>

        <Panel title="Ide Gambar">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Subjek Utama" value={brainstorm.mainSubject} onChange={(value) => updateBrainstorm('mainSubject', value)} placeholder="Contoh: penjaga toko bunga yang mengantuk" />
            <Field label="Lokasi" value={brainstorm.location} onChange={(value) => updateBrainstorm('location', value)} placeholder="Contoh: gang kecil setelah hujan" />
            <Field label="Momen / Aktivitas" value={brainstorm.moment} onChange={(value) => updateBrainstorm('moment', value)} multiline placeholder="Contoh: menyusun bunga terakhir sebelum toko tutup" />
            <Field label="Objek Penting" value={brainstorm.importantObject} onChange={(value) => updateBrainstorm('importantObject', value)} multiline placeholder="Contoh: payung transparan, papan toko tua, buket kuning" />
            <div className="sm:col-span-2"><Field label="Rasa yang Ingin Ditangkap" value={brainstorm.capturedFeeling} onChange={(value) => updateBrainstorm('capturedFeeling', value)} placeholder="Contoh: tenang, sedikit melankolis, tapi tetap hangat" /></div>
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-6">
        <Panel title="Hasil Ide">
          <div className="mb-3 flex flex-wrap justify-end gap-2">
            <button className="btn-secondary px-4 py-2" type="button" onClick={() => copyText('brainstorm-summary', outputs.summary)}>{copiedTarget === 'brainstorm-summary' ? 'Tersalin' : 'Salin Ringkasan'}</button>
            <button className="btn-secondary px-4 py-2" type="button" onClick={sendBrainstormToTemplate}>Kirim ke Illustration Slider</button>
            <button className="btn-danger px-4 py-2" type="button" onClick={resetBrainstorm}>Atur Ulang</button>
          </div>
          <h3 className="mb-2 text-sm font-bold text-ink/70">Ringkasan Ide</h3>
          <OutputBlock text={outputs.summary} />
          <h3 className="mb-2 mt-4 text-sm font-bold text-ink/70">Elemen Visual</h3>
          <OutputBlock text={outputs.visualElements} compact />
        </Panel>
      </div>
    </section>
  )
}

function HomeView({ setActiveTab }) {
  const menuItems = [
    {
      id: 'template',
      title: 'Illustration Slider',
      description: 'Atur tone, brief, dan prompt ilustrasi.',
      style: 'bg-[#eef3ff] ring-[#c9d6f5] hover:bg-[#f7f9ff]',
      accent: 'from-[#9ed2d7] to-[#6f5f7d]',
    },
    {
      id: 'brainstorm',
      title: 'Brainstorming Ide',
      description: 'Bantu menemukan ide gambar saat sedang blank.',
      style: 'bg-[#fff4dd] ring-[#efd49c] hover:bg-[#fff9ed]',
      accent: 'from-[#f5cf7c] to-[#efb08b]',
    },
    {
      id: 'todo',
      title: 'To-Do List',
      description: 'Kelola daftar tugas kreatif dan pekerjaan.',
      style: 'bg-[#eef7e9] ring-[#c7dcb8] hover:bg-[#f7fbf3]',
      accent: 'from-[#b8c6ad] to-[#7fa37b]',
    },
    {
      id: 'notes',
      title: 'Catatan',
      description: 'Simpan catatan, ide mentah, dan pengingat penting.',
      style: 'bg-[#fff0ef] ring-[#e8c7bd] hover:bg-[#fff8f7]',
      accent: 'from-[#f7d8d0] to-[#b98f7b]',
    },
  ]

  return (
    <section className="min-w-0 rounded-[28px] bg-white/86 p-6 shadow-soft ring-1 ring-white/90 backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-plum">Home</p>
        <h2 className="mt-2 text-3xl font-bold">Illustration Studio</h2>
        <p className="mt-2 text-sm leading-6 text-ink/60">Pilih ruang kerja yang ingin dibuka.</p>
      </div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`min-w-0 overflow-hidden rounded-[24px] p-5 text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-soft ${item.style}`}
            type="button"
            onClick={() => setActiveTab(item.id)}
          >
            <span className={`mb-4 block h-1.5 w-20 rounded-full bg-gradient-to-r ${item.accent}`} />
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-ink/60">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}

function BackHomeButton({ setActiveTab }) {
  return (
    <div className="flex justify-start">
      <button className="btn-secondary px-4 py-2" type="button" onClick={() => setActiveTab('home')}>
        Kembali ke Home
      </button>
    </div>
  )
}

function TodoListView({
  deleteTodo,
  editTodo,
  editingTodoId,
  resetTodoForm,
  saveTodo,
  setTodoFilter,
  todoFilter,
  todoForm,
  todos,
  toggleTodoDone,
  updateTodoForm,
}) {
  const filteredTodos = todos.filter((todo) => {
    if (todoFilter === 'belum') return !todo.isDone
    if (todoFilter === 'selesai') return todo.isDone
    return true
  })

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <Panel title={editingTodoId ? 'Edit Tugas' : 'Tambah Tugas'}>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
          <Field label="Judul tugas" value={todoForm.title} onChange={(value) => updateTodoForm('title', value)} placeholder="Contoh: Sketsa karakter utama" />
          <Field label="Catatan tugas opsional" value={todoForm.notes} onChange={(value) => updateTodoForm('notes', value)} placeholder="Contoh: buat 3 variasi pose" />
          <label className="block min-w-0">
            <span className="mb-2 block text-sm font-semibold text-ink/70">Prioritas</span>
            <select className="input-base" value={todoForm.priority} onChange={(event) => updateTodoForm('priority', event.target.value)}>
              <option value="Rendah">Rendah</option>
              <option value="Sedang">Sedang</option>
              <option value="Tinggi">Tinggi</option>
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="btn-primary" type="button" onClick={saveTodo}>
            {editingTodoId ? 'Perbarui Tugas' : 'Tambah Tugas'}
          </button>
          <button className="btn-secondary" type="button" onClick={resetTodoForm}>
            Kosongkan Form
          </button>
          {editingTodoId ? (
            <button className="btn-danger" type="button" onClick={resetTodoForm}>
              Batal Edit
            </button>
          ) : null}
        </div>
      </Panel>

      <Panel title="Daftar Tugas">
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            ['semua', 'Semua'],
            ['belum', 'Belum selesai'],
            ['selesai', 'Selesai'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${todoFilter === value ? 'bg-ink text-white' : 'bg-[#f8f5ee] text-ink/60 hover:bg-white hover:text-ink'}`}
              type="button"
              onClick={() => setTodoFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-[#eadfce]">
          {filteredTodos.length === 0 ? (
            <div className="bg-[#f8f5ee] p-4 text-sm font-semibold text-ink/55">
              Belum ada tugas pada filter ini.
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div key={todo.id} className="grid min-w-0 gap-3 border-b border-[#eadfce] bg-[#f8f5ee] p-4 last:border-b-0 sm:grid-cols-[32px_minmax(0,1fr)_auto] sm:items-start">
                <input
                  className="mt-1 h-5 w-5 accent-ink"
                  type="checkbox"
                  checked={todo.isDone}
                  onChange={() => toggleTodoDone(todo)}
                  aria-label={todo.isDone ? 'Batalkan selesai' : 'Tandai selesai'}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`break-words text-sm font-bold sm:text-base ${todo.isDone ? 'text-ink/35 line-through' : 'text-ink'}`}>{todo.title}</h3>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-plum ring-1 ring-[#eadfce]">{todo.priority}</span>
                  </div>
                  {todo.notes ? <p className={`mt-1 break-words text-sm leading-6 ${todo.isDone ? 'text-ink/35' : 'text-ink/60'}`}>{todo.notes}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <button className="btn-secondary px-4 py-2" type="button" onClick={() => editTodo(todo)}>
                    Edit
                  </button>
                  <button className="btn-danger px-4 py-2" type="button" onClick={() => deleteTodo(todo.id)}>
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </section>
  )
}

function NotesView({
  deleteNote,
  editNote,
  editingNoteId,
  noteForm,
  noteSearch,
  notes,
  resetNoteForm,
  saveNote,
  setNoteSearch,
  updateNoteForm,
}) {
  const [expandedNotes, setExpandedNotes] = useState({})
  const search = noteSearch.trim().toLowerCase()
  const filteredNotes = notes.filter((note) => {
    if (!search) return true
    return `${note.title} ${note.content}`.toLowerCase().includes(search)
  })

  const toggleExpanded = (noteId) => {
    setExpandedNotes((current) => ({ ...current, [noteId]: !current[noteId] }))
  }

  return (
    <section className="flex min-w-0 flex-col gap-6">
      <Panel title={editingNoteId ? 'Edit Catatan' : 'Catatan Baru'}>
        <div className="space-y-4">
          <Field label="Judul catatan" value={noteForm.title} onChange={(value) => updateNoteForm('title', value)} placeholder="Contoh: Ide warna untuk karakter utama" />
          <Field label="Isi catatan" value={noteForm.content} onChange={(value) => updateNoteForm('content', value)} multiline placeholder="Tulis catatan, ide mentah, atau pengingat penting di sini." />
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" type="button" onClick={saveNote}>
              {editingNoteId ? 'Perbarui Catatan' : 'Simpan Catatan'}
            </button>
            {editingNoteId ? (
              <button className="btn-danger" type="button" onClick={resetNoteForm}>
                Batal Edit
              </button>
            ) : null}
            <button className="btn-secondary" type="button" onClick={resetNoteForm}>
              Kosongkan Form
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Daftar Catatan">
        <div className="mb-4">
          <input className="input-base" value={noteSearch} onChange={(event) => setNoteSearch(event.target.value)} placeholder="Cari catatan..." />
        </div>
        <div className="space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="rounded-2xl bg-[#f8f5ee] p-4 text-sm font-semibold text-ink/55 ring-1 ring-[#eadfce]">
              Belum ada catatan yang cocok.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isLong = note.content.length > 180
              const isExpanded = Boolean(expandedNotes[note.id])
              const preview = isLong && !isExpanded ? `${note.content.slice(0, 180)}...` : note.content
              const created = new Date(note.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
              const updated = new Date(note.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })

              return (
                <article key={note.id} className="min-w-0 rounded-2xl bg-[#f8f5ee] p-4 ring-1 ring-[#eadfce]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-bold">{note.title}</h3>
                      {preview ? <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-ink/65 [overflow-wrap:anywhere]">{preview}</p> : null}
                      <p className="mt-2 text-xs font-semibold text-ink/40">
                        Dibuat: {created}{updated !== created ? ` | Diperbarui: ${updated}` : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button className="btn-secondary px-4 py-2" type="button" onClick={() => editNote(note)}>
                        Edit
                      </button>
                      <button className="btn-danger px-4 py-2" type="button" onClick={() => deleteNote(note.id)}>
                        Hapus
                      </button>
                    </div>
                  </div>
                  {isLong ? (
                    <button className="mt-3 text-sm font-bold text-plum hover:text-ink" type="button" onClick={() => toggleExpanded(note.id)}>
                      {isExpanded ? 'Sembunyikan' : 'Lihat Selengkapnya'}
                    </button>
                  ) : null}
                </article>
              )
            })
          )}
        </div>
      </Panel>
    </section>
  )
}

function Shell({ children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f5ee] text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(245,207,124,0.35),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(158,210,215,0.36),transparent_26%),linear-gradient(135deg,#fbf6ea_0%,#f6efe4_42%,#eef7f6_100%)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">{children}</div>
    </main>
  )
}

function TabButton({ active, children, onClick }) {
  return <button className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${active ? 'bg-ink text-white shadow-[0_12px_24px_rgba(32,33,43,0.18)]' : 'bg-white/70 text-ink/65 hover:bg-white hover:text-ink'}`} type="button" onClick={onClick}>{children}</button>
}

function StatusBadge({ text }) {
  return <span className="rounded-full bg-[#f8f5ee] px-3 py-1 ring-1 ring-[#eadfce]">{text}</span>
}

function Panel({ title, children }) {
  return <section className="min-w-0 overflow-hidden rounded-[24px] bg-white/86 p-5 shadow-soft ring-1 ring-white/90 backdrop-blur"><h2 className="mb-4 text-lg font-bold">{title}</h2>{children}</section>
}

function Field({ label, value, onChange, onClear, multiline = false, placeholder = '', type = 'text' }) {
  const Input = multiline ? 'textarea' : 'input'
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-ink/70">
        <span className="min-w-0 truncate">{label}</span>
        {onClear ? (
          <button
            className="shrink-0 text-xs font-bold text-ink/45 transition hover:text-plum"
            type="button"
            onClick={(event) => {
              event.preventDefault()
              onClear()
            }}
          >
            Kosongkan
          </button>
        ) : null}
      </span>
      <Input className={`input-base min-w-0 ${multiline ? 'min-h-32 resize-y leading-6' : ''}`} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  )
}

function ToneSlider({ tone, value, onChange }) {
  const progress = ((value - 1) / 4) * 100
  return (
    <div className={`rounded-2xl p-4 ring-1 transition hover:-translate-y-0.5 ${tone.surface} ${tone.border} ${tone.glow}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div><p className="font-bold">{tone.label}</p><p className="text-xs font-semibold text-ink/50">{tone.left} ke {tone.right}</p></div>
        <div className={`rounded-full bg-gradient-to-r ${tone.accent} px-3 py-1 text-sm font-bold text-white`}>{value} - {tone.labels[value]}</div>
      </div>
      <input className="tone-range" style={{ background: `linear-gradient(90deg, ${tone.meter} 0%, ${tone.meter} ${progress}%, rgba(255,255,255,0.78) ${progress}%, rgba(255,255,255,0.78) 100%)` }} type="range" min="1" max="5" step="1" value={value} onChange={(event) => onChange(event.target.value)} />
      <div className="mt-2 grid grid-cols-5 text-center text-xs font-semibold text-ink/45">{[1, 2, 3, 4, 5].map((number) => <span key={number}>{number}</span>)}</div>
      <div className="mt-1 flex justify-between text-xs font-semibold text-ink/45"><span>{tone.left}</span><span>{tone.right}</span></div>
    </div>
  )
}

function OutputActions({ label, copied, onCopy }) {
  return <div className="mb-3 flex justify-end"><button className="btn-secondary px-4 py-2" type="button" onClick={onCopy}>{copied ? 'Tersalin' : label}</button></div>
}

function OutputBlock({ text, compact = false, preLine = false }) {
  return <div className={`min-w-0 overflow-hidden break-words rounded-2xl bg-gradient-to-br from-[#f8f5ee] to-white p-4 text-sm leading-6 text-ink/75 ring-1 ring-[#eadfce] [overflow-wrap:anywhere] ${compact ? '' : 'min-h-36'} ${preLine ? 'whitespace-pre-wrap' : 'whitespace-normal'}`}>{text}</div>
}

export default App
