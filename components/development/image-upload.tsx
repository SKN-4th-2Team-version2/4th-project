"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  maxImages?: number
  initialImages?: string[]
}

export function ImageUpload({ onImagesChange, maxImages = 5, initialImages = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)

    try {
      const newImages: string[] = []
      const files = Array.from(e.target.files)
      const remainingSlots = maxImages - images.length

      // 최대 이미지 개수를 초과하지 않도록 제한
      const filesToProcess = files.slice(0, remainingSlots)

      for (const file of filesToProcess) {
        if (!file.type.startsWith("image/")) continue

        const base64 = await convertFileToBase64(file)
        newImages.push(base64)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (error) {
      console.error("Error processing images:", error)
    } finally {
      setIsUploading(false)
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group w-24 h-24 border rounded-md overflow-hidden bg-background">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Uploaded image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-24 h-24 flex flex-col items-center justify-center gap-1 border-dashed",
              isUploading && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-xs">사진 추가</span>
              </>
            )}
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
        disabled={isUploading || images.length >= maxImages}
      />

      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} 이미지 (최대 5MB/이미지)
      </p>
    </div>
  )
}
