"use client"

import { useState, useCallback, useMemo, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload,
  Image as ImageIcon,
  Wand2,
  Download,
  Loader2,
  AlertCircle,
  X,
  Plus,
  Zap
} from 'lucide-react'
import { useCredits, CREDIT_COSTS } from '@/contexts/credit-context'

export function MarketingGenerator() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'21:9' | '1:1' | '4:3' | '3:2' | '2:3' | '5:4' | '4:5' | '3:4' | '16:9' | '9:16'>('1:1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  
  const { credits, deductCredits, canAfford } = useCredits()
  const creditCost = CREDIT_COSTS['marketing-generator']

  const dropRef = useRef<HTMLLabelElement | null>(null)

  const maxFiles = 3
  const acceptTypes = useMemo(() => /^(image\/(png|jpg|jpeg|webp))$/, [])
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
    
    // Check if user has enough credits
    if (!canAfford(creditCost)) {
      setError(`Insufficient credits. You need ${creditCost} credits to generate an image.`)
      return
    }
    
    // Deduct credits before generation
    const creditDeducted = await deductCredits(creditCost)
    if (!creditDeducted) {
      setError(`Failed to deduct ${creditCost} credits. Please try again.`)
      return
    }
    
    setIsGenerating(true)
    setError(null)
    try {
      // 1) Try Fal.ai Gemini image generation
      try {
        const response = await fetch('/api/gemini-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: prompt || 'Generate a social-ready composition',
            image_urls: mediaPreviews,
            num_images: 1
          }),
        })

        const data = await response.json()

        if (response.ok && data.success && data.image_url) {
          setResultUrl(data.image_url)
          return
        } else {
          console.warn('Fal.ai Gemini API failed:', data.error)
        }
      } catch (e: any) {
        // Fallback to local canvas preview
        console.warn('Fal.ai Gemini API failed, fallback to canvas:', e?.message || e)
      }

      // 2) Fallback local canvas preview
      // Optional server assist: get refined text from GenAI
      let serverText = ''
      if (prompt.trim()) {
        try {
          const response = await fetch('/api/genai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt }),
          })
          if (response.ok) {
            const data = await response.json()
            if (data?.text) serverText = String(data.text)
          }
        } catch (e) {
          // ignore; fallback continues
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
      setError("Network issue while generating preview. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }, [mediaPreviews, prompt, aspectRatio, dims])

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section - Left Side */}
      <div className="space-y-6 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-500" />
              Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          {/* Text Input */}
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

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <Label>Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={(value: any) => setAspectRatio(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="21:9">Ultra Wide (21:9)</SelectItem>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
                <SelectItem value="3:4">Vertical (3:4)</SelectItem>
                <SelectItem value="3:2">Photo (3:2)</SelectItem>
                <SelectItem value="2:3">Vertical Photo (2:3)</SelectItem>
                <SelectItem value="5:4">Classic (5:4)</SelectItem>
                <SelectItem value="4:5">Portrait Classic (4:5)</SelectItem>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose the aspect ratio for your generated image.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !canAfford(creditCost)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate <Zap className="ml-1 h-4 w-4" /> 10
                </>
              )}
            </Button>
          </div>
          

          {/* Error Display */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Result Section - Right Side */}
      <div className="flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Result</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {isGenerating ? 'Generating...' : resultUrl ? 'Completed' : ''}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex flex-col space-y-4">
              {/* Generated Image */}
              {resultUrl ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted/20" style={{ height: '400px' }}>
                  <img
                    src={resultUrl}
                    alt="Generated marketing image"
                    className="w-full h-full object-contain"
                  />
                  <Button
                    onClick={handleDownload}
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    size="sm"
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/10" style={{ height: '400px' }}>
                  <div className="text-center p-4">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No image generated yet</p>
                  </div>
                </div>
              )}

              {/* Cost Information */}
              <div className="text-sm text-muted-foreground flex-shrink-0">
                Powered by Fal.ai Gemini 2.5 Flash - AI marketing image generation.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
