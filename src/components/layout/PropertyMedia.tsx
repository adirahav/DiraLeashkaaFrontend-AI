import React, { useRef, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { Card } from '../common/Card'
import { SectionHeader } from '../common/SectionHeader'
import { cn } from '../../lib/utils'
import { useSplash } from '../../hooks/useSplash'
import { mediaService } from '../../services/media.service'
import { CloudinaryMediaNode } from '../../types/property.types'

const MAX_MEDIA_COUNT = 4

interface PropertyMediaProps {
  viewMode: 'form' | 'results'
  list: CloudinaryMediaNode[]
  onUpload: (node: CloudinaryMediaNode) => void
  onRemove: (publicId: string) => void
  isCalculating?: boolean
}

export const PropertyMedia: React.FC<PropertyMediaProps> = ({
  viewMode,
  list,
  onUpload,
  onRemove,
  isCalculating = false,
}) => {
  const { getPhrase } = useSplash()
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (viewMode !== 'form') return null

  const canUpload = list.length < MAX_MEDIA_COUNT && !isCalculating

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const remaining = MAX_MEDIA_COUNT - list.length
    if (remaining <= 0) return

    setError(null)
    setIsUploading(true)
    try {
      const batch = Array.from(files).slice(0, remaining)
      for (const file of batch) {
        const node = await mediaService.upload(file)
        onUpload(node)
      }
    } catch {
      setError(getPhrase('property_media_error', 'Image upload failed. Please try again.'))
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (!isCalculating && !isUploading) handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!isCalculating && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <section
      className="mt-12"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <SectionHeader
        icon={<Upload />}
        title={getPhrase('property_images_title', 'Property Images')}
        variant="slate"
      />

      <Card
        className={cn(
          'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative transition-all duration-200',
          isDragging && 'ring-2 ring-blue-400 bg-blue-50/40',
        )}
      >
        {isCalculating && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 rounded-[2rem] cursor-not-allowed" />
        )}

        {list.map((item) => (
          <div key={item.publicId || item.url} className="relative aspect-square group">
            <img
              src={item.url}
              alt=""
              className="w-full h-full object-cover rounded-2xl border border-slate-200"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => !isCalculating && onRemove(item.publicId)}
              disabled={isCalculating}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 disabled:hidden"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {canUpload && (
          <label
            className={cn(
              'aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 transition-all gap-2',
              isUploading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 cursor-pointer',
            )}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus size={24} />
            )}
            <span className="text-xs font-bold">
              {isUploading
                ? getPhrase('property_images_uploading', 'Uploading...')
                : getPhrase('property_images_add', 'Add Image')}
            </span>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              disabled={isUploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        )}
      </Card>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </section>
  )
}
