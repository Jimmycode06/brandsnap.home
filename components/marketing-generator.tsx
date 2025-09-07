"use client"

import { useState, useCallback, useMemo, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Loader2,
  AlertCircle,
  X,
  Plus
} from 'lucide-react'

export function MarketingGenerator() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)

  const dropRef = useRef<HTMLLabelElement | null>(null)

  const maxFiles = 3
  const acceptTypes = /^(image\/(png|jpg|jpeg|webp))$/
  const maxSizeMb = 15

  const handleAddFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const next: File[] = []
    const nextUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!acceptTypes.test(file.type)) {
        setError('Formats acceptés: PNG, JPG, JPEG, WEBP')
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`Chaque fichier doit faire moins de ${maxSizeMb}MB`)
        continue
      }
      next.push(file)
    }
    if (next.length === 0) return
    const total = Math.min(mediaFiles.length + next.length, maxFiles)
    const sliceCount = total - mediaFiles.length
    const selected = next.slice(0, sliceCount)
    setMediaFiles(prev => [...prev, ...selected])
    selected.forEach(f => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, String(e.target?.result || '')])
      }
      reader.readAsDataURL(f)
    })
    setError(null)
    setResultUrl(null)
  }, [mediaFiles.length, acceptTypes, maxSizeMb])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddFiles(e.target.files)
    e.currentTarget.value = ''
  }, [handleAddFiles])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleAddFiles(e.dataTransfer.files)
  }, [handleAddFiles])

  const removeAt = useCallback((index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
    setResultUrl(null)
  }, [])

  const dims = useMemo(() => ({ w: 1080, h: 1080 }), [])

  async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const handleGenerate = useCallback(async () => {
    if (mediaPreviews.length === 0) {
      setError('Ajoutez au moins un média')
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
      // 1) Try server-side image generation via /api/genai/image
      try {
        const res = await fetch('/api/genai/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt || 'Generate a social-ready composition',
            images: mediaPreviews.map((dataUrl) => ({ dataUrl })),
          }),
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.image && typeof data.image === 'string') {
            setResultUrl(data.image)
            return
          }
        }
      } catch (_) {
        // Ignore and fallback to local canvas preview
      }

      // 2) Fallback local canvas preview
      // Optional server assist: get refined text from GenAI
      let serverText = ''
      if (prompt.trim()) {
        try {
          const res = await fetch('/api/genai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          })
          const data = await res.json()
          if (data?.text) serverText = String(data.text)
        } catch (e) {
          // ignore network/genai errors for preview
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = dims.w
      canvas.height = dims.h
      const ctx = canvas.getContext('2d')!

      // Fond dégradé doux
      const grad = ctx.createLinearGradient(0, 0, dims.w, dims.h)
      grad.addColorStop(0, '#0ea5e9')
      grad.addColorStop(1, '#22c55e')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, dims.w, dims.h)

      const margin = Math.round(dims.w * 0.04)
      const boxW = dims.w - margin * 2
      const boxH = dims.h - margin * 2

      const imgs = await Promise.all(mediaPreviews.map(src => loadImage(src)))
      const count = imgs.length

      ctx.save()
      ctx.beginPath()
      const radius = Math.round(Math.min(boxW, boxH) * 0.02)
      // rounded rect
      ctx.moveTo(margin + radius, margin)
      ctx.arcTo(margin + boxW, margin, margin + boxW, margin + boxH, radius)
      ctx.arcTo(margin + boxW, margin + boxH, margin, margin + boxH, radius)
      ctx.arcTo(margin, margin + boxH, margin, margin, radius)
      ctx.arcTo(margin, margin, margin + boxW, margin, radius)
      ctx.closePath()
      ctx.clip()

      if (count === 1) {
        const img = imgs[0]
        const scale = Math.min(boxW / img.width, boxH / img.height)
        const drawW = img.width * scale
        const drawH = img.height * scale
        const dx = margin + (boxW - drawW) / 2
        const dy = margin + (boxH - drawH) / 2
        ctx.drawImage(img, dx, dy, drawW, drawH)
      } else if (count === 2) {
        const [a, b] = imgs
        const halfW = Math.floor(boxW / 2) - Math.floor(margin / 2)
        const scaleA = Math.min(halfW / a.width, boxH / a.height)
        const scaleB = Math.min(halfW / b.width, boxH / b.height)
        const wA = a.width * scaleA
        const hA = a.height * scaleA
        const wB = b.width * scaleB
        const hB = b.height * scaleB
        const xA = margin + (halfW - wA) / 2
        const yA = margin + (boxH - hA) / 2
        const xB = margin + halfW + Math.floor(margin / 2) + (halfW - wB) / 2
        const yB = margin + (boxH - hB) / 2
        ctx.drawImage(a, xA, yA, wA, hA)
        ctx.drawImage(b, xB, yB, wB, hB)
      } else {
        // 3+ => grille 2x2, le dernier centré par-dessus si 3
        const cols = 2
        const rows = 2
        const cellW = Math.floor(boxW / cols) - Math.floor(margin / 2)
        const cellH = Math.floor(boxH / rows) - Math.floor(margin / 2)
        for (let i = 0; i < Math.min(count, 4); i++) {
          const img = imgs[i]
          const col = i % cols
          const row = Math.floor(i / cols)
          const scale = Math.min(cellW / img.width, cellH / img.height)
          const w = img.width * scale
          const h = img.height * scale
          const x = margin + col * (cellW + Math.floor(margin / 2)) + (cellW - w) / 2
          const y = margin + row * (cellH + Math.floor(margin / 2)) + (cellH - h) / 2
          ctx.drawImage(img, x, y, w, h)
        }
      }
      ctx.restore()

      // Bandeau de texte du prompt (or server-refined text)
      if (prompt.trim().length > 0 || serverText) {
        const pad = Math.round(dims.w * 0.04)
        const barH = Math.round(dims.h * 0.16)
        // semi-opaque bar
        ctx.fillStyle = 'rgba(0,0,0,0.45)'
        ctx.fillRect(margin, dims.h - margin - barH, boxW, barH)
        ctx.font = `600 ${Math.round(dims.w * 0.035)}px ui-sans-serif, system-ui, -apple-system` 
        ctx.fillStyle = '#fff'
        ctx.textBaseline = 'middle'
        const text = (serverText || prompt).trim()
        // wrap text
        const maxWidth = boxW - pad * 2
        const lines: string[] = []
        const words = text.split(/\s+/)
        let line = ''
        for (const word of words) {
          const test = line.length ? line + ' ' + word : word
          if (ctx.measureText(test).width < maxWidth) {
            line = test
          } else {
            if (line) lines.push(line)
            line = word
          }
        }
        if (line) lines.push(line)
        const maxLines = 3
        const shown = lines.slice(0, maxLines)
        const lineHeight = Math.round(dims.w * 0.045)
        const startY = dims.h - margin - barH / 2 - (shown.length - 1) * (lineHeight / 2)
        shown.forEach((l, idx) => {
          ctx.fillText(l, margin + pad, startY + idx * lineHeight)
        })
      }

      const url = canvas.toDataURL('image/png')
      setResultUrl(url)
    } catch (e) {
      setError('Erreur lors de la génération de l\'aperçu')
    } finally {
      setIsGenerating(false)
    }
  }, [mediaPreviews, prompt, dims])

  const handleDownload = useCallback(() => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = `brandsnap-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [resultUrl])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            1. Add media (PNG, JPG, JPEG, WEBP)
          </CardTitle>
          <CardDescription>Drag and drop up to {maxFiles} files.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mediaPreviews.length === 0 && (
            <label
              ref={dropRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50"
           >
              <div className="flex flex-col items-center justify-center py-2 px-3 text-center">
                <ImageIcon className="w-5 h-5 mb-1.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">Click to select</span> or drag and drop
                </p>
                <p className="text-[11px] text-muted-foreground">Formats: PNG, JPG, JPEG, WEBP (max {maxSizeMb}MB each)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpg,image/jpeg,image/webp"
                multiple
                onChange={onInputChange}
              />
            </label>
          )}

          {mediaPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
              {mediaPreviews.map((src, idx) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden rounded-md border bg-background w-16 h-16"
                >
                  <img src={src} alt={`media-${idx}`} className="h-full w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 opacity-90"
                    onClick={() => removeAt(idx)}
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {mediaPreviews.length < maxFiles && (
                <label className="flex items-center justify-center rounded-md border-2 border-dashed bg-muted/30 hover:bg-muted/50 cursor-pointer w-16 h-16">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Plus className="h-4 w-4 mb-0.5" />
                    <span className="text-[11px]">Add</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png,image/jpg,image/jpeg,image/webp"
                    onChange={onInputChange}
                  />
                </label>
              )}
            </div>
          )}

          {/* Describe your visual (merged into the same card) */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Text</Label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Download the app now!"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || mediaPreviews.length === 0}
              size="default"
              className="bg-[hsl(141.9_69.2%_58%)] hover:bg-[hsl(141.9_69.2%_52%)] text-white focus-visible:ring-[hsl(141.9_69.2%_58%)] disabled:opacity-100 shadow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview block just below */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Generated preview
            </CardTitle>
            <CardDescription>Always visible preview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultUrl ? (
              <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-md border bg-background">
                <img
                  src={resultUrl}
                  alt="Result"
                  className="h-auto w-full max-h-[600px] object-contain"
                />
                <Button
                  onClick={handleDownload}
                  size="sm"
                  variant="outline"
                  className="absolute right-2 top-2"
                  aria-label="Download PNG"
                >
                  <Download className="mr-1 h-3.5 w-3.5" />
                  PNG
                </Button>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-xl rounded-md border-2 border-dashed bg-muted/20 text-muted-foreground p-6 text-center">
                Preview will appear here after generation.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
