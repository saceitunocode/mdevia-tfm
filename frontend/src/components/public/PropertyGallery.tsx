"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface ImageItem {
  id: string;
  public_url: string;
  alt_text?: string;
  is_cover: boolean;
}

interface PropertyGalleryProps {
  images: ImageItem[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on("select", onSelect);
    emblaMainApi.on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border group transition-all hover:bg-muted/50">
        <Camera className="h-12 w-12 mb-2 opacity-20 group-hover:opacity-40 transition-opacity" />
        <span className="italic font-medium">Sin imágenes disponibles</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main viewport */}
      <div className="relative group overflow-hidden rounded-2xl bg-muted shadow-2xl ring-1 ring-white/10">
        <div className="overflow-hidden" ref={emblaMainRef}>
          <div className="flex touch-pan-y">
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className="relative flex-[0_0_100%] min-w-0 aspect-video md:aspect-video"
              >
                <Image
                  src={image.public_url}
                  alt={image.alt_text || "Propiedad"}
                  fill
                  unoptimized
                  priority={index === 0}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 850px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge className="bg-black/40 backdrop-blur-md text-white border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            {selectedIndex + 1} / {images.length}
          </Badge>
          {images[selectedIndex].is_cover && (
            <Badge className="bg-primary/80 backdrop-blur-md text-white border-none px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Destacada
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 transition-all shadow-lg active:scale-90"
            title="Ampliar imagen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => emblaMainApi?.scrollPrev()}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300 z-10 active:scale-95"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => emblaMainApi?.scrollNext()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 duration-300 z-10 active:scale-95"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbs Gallery */}
      {images.length > 1 && (
        <div className="relative px-1 pt-2">
          <div className="overflow-hidden" ref={emblaThumbsRef}>
            <div className="flex gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative flex-[0_0_20%] sm:flex-[0_0_15%] md:flex-[0_0_12%] aspect-square rounded-xl overflow-hidden min-w-0 transition-all duration-300 border-2",
                    index === selectedIndex
                      ? "border-primary scale-105 shadow-md shadow-primary/20 brightness-110"
                      : "border-transparent opacity-60 hover:opacity-100 grayscale-[0.5] hover:grayscale-0"
                  )}
                >
                  <Image
                    src={image.public_url}
                    alt={image.alt_text || `Miniatura ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Overlay */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-8 pb-12 px-4"
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-4 text-white/60 hover:text-white transition-colors z-50 hover:bg-white/10 rounded-full"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative w-full h-full flex flex-col">
              <div className="flex-1 relative w-full overflow-hidden flex items-center justify-center">
                 <motion.div 
                    key={selectedIndex}
                    initial={{ scale: 0.9, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    className="relative w-full h-full max-h-[80vh]"
                 >
                    <Image
                      src={images[selectedIndex].public_url}
                      alt="Lightbox"
                      fill
                      unoptimized
                      className="object-contain"
                      priority
                    />
                 </motion.div>
              </div>

              {/* Lightbox Controls */}
              <div className="flex items-center justify-between mt-auto w-full max-w-2xl mx-auto px-4">
                <button
                  onClick={() => {
                    const prev = (selectedIndex - 1 + images.length) % images.length;
                    setSelectedIndex(prev);
                    emblaMainApi?.scrollTo(prev);
                  }}
                  className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <div className="text-white/80 font-mono text-lg tracking-widest tabular-nums">
                  {selectedIndex + 1} <span className="text-white/30 ml-2 mr-3">/</span> {images.length}
                </div>
                <button
                  onClick={() => {
                    const next = (selectedIndex + 1) % images.length;
                    setSelectedIndex(next);
                    emblaMainApi?.scrollTo(next);
                  }}
                  className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
