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
  Zap,
  Home
} from 'lucide-react'
import { useCredits, CREDIT_COSTS } from '@/contexts/credit-context'

export function HomeStagingGenerator() {
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState<'21:9' | '1:1' | '4:3' | '3:2' | '2:3' | '5:4' | '4:5' | '3:4' | '16:9' | '9:16'>('16:9')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  
  const { credits, deductCredits, canAfford } = useCredits()
  const creditCost = CREDIT_COSTS['marketing-generator'] // Utilise la même API

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

  async function resizeImageIfNeeded(dataUrl: string): Promise<string> {
    const img = await loadImage(dataUrl)
    if (img.naturalWidth <= dims.w && img.naturalHeight <= dims.h) {
      return dataUrl
    }
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const aspectRatio = img.naturalWidth / img.naturalHeight
    if (aspectRatio > 1) {
      canvas.width = dims.w
      canvas.height = dims.w / aspectRatio
    } else {
      canvas.height = dims.h
      canvas.width = dims.h * aspectRatio
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  const handleGenerate = useCallback(async () => {
    if (mediaFiles.length === 0) {
      setError('Veuillez ajouter au moins une photo de votre pièce vide')
      return
    }

    if (!prompt.trim()) {
      setError('Veuillez décrire le style d\'intérieur souhaité')
      return
    }

    if (!canAfford(creditCost)) {
      setError(`Pas assez de crédits. Il vous faut ${creditCost} crédits.`)
      return
    }

    setIsGenerating(true)
    setError(null)
    setResultUrl(null)

    try {
      // Resize images if needed
      const resizedPreviews = await Promise.all(
        mediaPreviews.map(url => resizeImageIfNeeded(url))
      )

      // Deduct credits
      deductCredits(creditCost)

      const response = await fetch('/api/gemini-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          image_urls: resizedPreviews,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Échec de la génération')
      }

      if (data.image_url) {
        setResultUrl(data.image_url)
      } else {
        throw new Error('Pas d\'image générée')
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la génération')
    } finally {
      setIsGenerating(false)
    }
  }, [mediaFiles, mediaPreviews, prompt, aspectRatio, credits, canAfford, deductCredits, creditCost, dims])

  const handleDownload = useCallback(async () => {
    if (!resultUrl) return
    try {
      // Fetch the image as a blob
      const response = await fetch(resultUrl)
      const blob = await response.blob()
      
      // Create a temporary URL and download
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `home-staging-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab
      window.open(resultUrl, '_blank')
    }
  }, [resultUrl])

  const clearResults = useCallback(() => {
    setResultUrl(null)
    setMediaFiles([])
    setMediaPreviews([])
    setPrompt('')
    setError(null)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Input Section - Left Side */}
      <div className="space-y-6 flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-500" />
              Configuration
            </CardTitle>
            <CardDescription>
              Uploadez vos photos de pièces vides et décrivez le style souhaité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label>Photos de la pièce vide (max {maxFiles})</Label>
              <label
                ref={dropRef}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="
                  border-2 border-dashed rounded-lg p-8 text-center
                  hover:border-primary/50 hover:bg-muted/20 transition-colors cursor-pointer
                  flex flex-col items-center justify-center min-h-[180px] relative
                  bg-muted/10 border-muted-foreground/20
                "
              >
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpg,image/jpeg,image/webp"
                  onChange={onInputChange}
                  className="sr-only"
                  disabled={mediaFiles.length >= maxFiles}
                />
                <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1 text-foreground">
                  {mediaFiles.length >= maxFiles
                    ? 'Maximum de fichiers atteint'
                    : 'Cliquez ou glissez-déposez vos photos'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, JPEG, WEBP (max {maxSizeMb}MB par fichier)
                </p>
              </label>

              {/* Preview Grid */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {mediaPreviews.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                      <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeAt(i)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-black text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Description du style d'intérieur*</Label>
              <textarea
                id="prompt"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Salon moderne avec canapé gris, table basse en bois, plantes vertes, éclairage chaleureux, style scandinave"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <p className="text-xs text-muted-foreground">
                💡 Soyez précis : mobilier, couleurs, style, ambiance...
              </p>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
              <Label>Format de l'image</Label>
              <Select value={aspectRatio} onValueChange={(v: any) => setAspectRatio(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Paysage large)</SelectItem>
                  <SelectItem value="4:3">4:3 (Paysage standard)</SelectItem>
                  <SelectItem value="3:2">3:2 (Photo classique)</SelectItem>
                  <SelectItem value="1:1">1:1 (Carré)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait vertical)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={clearResults}
                variant="outline"
                className="flex-1"
                disabled={isGenerating}
              >
                Réinitialiser
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || mediaFiles.length === 0 || !prompt.trim() || !canAfford(creditCost)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    Générer <Zap className="ml-1 h-4 w-4" /> {creditCost}
                  </>
                )}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Result Section - Right Side */}
      <div className="flex flex-col">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Résultat</CardTitle>
              {resultUrl && (
                <Button onClick={handleDownload} size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="flex flex-col space-y-4">
              {/* Generated Image */}
              {resultUrl ? (
                <div className="relative rounded-lg overflow-hidden border bg-muted/20">
                  <img
                    src={resultUrl}
                    alt="Résultat généré"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center bg-muted/10 min-h-[400px]">
                  <div className="text-center p-4">
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
                        <p className="text-sm text-muted-foreground">Transformation en cours...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Votre intérieur meublé apparaîtra ici</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="text-sm text-muted-foreground flex-shrink-0">
                <p className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Transformation IA optimisée pour l'immobilier
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

