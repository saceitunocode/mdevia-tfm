"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  initialImages?: { id: string; url: string }[];
}

export function ImageUpload({ onImagesSelected, maxFiles = 10, initialImages = [] }: ImageUploadProps) {
  const [previews, setPreviews] = useState<{ id: string; url: string; file?: File }[]>(
    initialImages.map(img => ({ id: img.id, url: img.url }))
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
    
    const newPreviews = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file
    }));

    setPreviews(prev => {
      const combined = [...prev, ...newPreviews].slice(0, maxFiles);
      const filesOnly = combined.map(p => p.file).filter((f): f is File => f !== undefined);
      onImagesSelected(filesOnly);
      return combined;
    });
  }, [maxFiles, onImagesSelected]);

  const removeImage = (id: string) => {
    setPreviews(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const filesOnly = filtered.map(p => p.file).filter((f): f is File => f !== undefined);
      onImagesSelected(filesOnly);
      return filtered;
    });
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
        )}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Upload size={24} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">Pulsa para subir o arrastra tus fotos</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG o WebP hasta 10MB</p>
        </div>
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((preview) => (
            <div key={preview.id} className="relative aspect-square rounded-md overflow-hidden group border border-border">
              <Image
                src={preview.url}
                alt="Preview"
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(preview.id); }}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
              {preview.id.includes("uploading") && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
