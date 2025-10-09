import { useState, useCallback, useRef, useEffect } from 'react'

interface UseDragDropOptions {
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  onDrop?: (files: File[]) => void
  onError?: (error: string) => void
}

export function useDragDrop({
  accept = 'image/*',
  multiple = false,
  maxFiles = 1,
  maxSize = 15,
  onDrop,
  onError
}: UseDragDropOptions = {}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file type
    if (!file.type.match(accept)) {
      return `File type not supported. Please use: ${accept}`
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxSize}MB`
    }

    return null
  }, [accept, maxSize])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    // Check number of files
    if (fileArray.length > maxFiles) {
      onError?.(`Too many files. Maximum: ${maxFiles}`)
      return
    }

    // Validate each file
    const validFiles: File[] = []
    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        onError?.(error)
        return
      }
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      onDrop?.(validFiles)
    }
  }, [maxFiles, validateFile, onDrop, onError])

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!dropRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragActive(false)
      setIsDragOver(false)
    }
  }, [])

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsDragActive(false)
    setIsDragOver(false)

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file' && item.type.match(accept)) {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }
      if (files.length > 0) {
        handleFiles(files)
      }
    }
  }, [accept, handleFiles])

  useEffect(() => {
    const element = dropRef.current
    if (!element) return

    // Add drag event listeners
    element.addEventListener('dragenter', handleDragEnter)
    element.addEventListener('dragleave', handleDragLeave)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)

    // Add paste event listener to document
    document.addEventListener('paste', handlePaste)

    return () => {
      element.removeEventListener('dragenter', handleDragEnter)
      element.removeEventListener('dragleave', handleDragLeave)
      element.removeEventListener('dragover', handleDragOver)
      element.removeEventListener('drop', handleDrop)
      document.removeEventListener('paste', handlePaste)
    }
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handlePaste])

  return {
    dropRef,
    isDragOver,
    isDragActive
  }
}

