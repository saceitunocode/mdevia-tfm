"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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

  const onSelect = useCallback(() => {
    if (!emblaMainApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, setSelectedIndex]);

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
    <div className="relative w-full h-[60vh] min-h-[500px] overflow-hidden group bg-background">
      <div className="relative w-full h-full" ref={emblaMainRef}>
        <div className="flex h-full touch-pan-y">
          {images.map((image, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={image.id}>
              <div className="absolute inset-0">
                <Image
                  src={image.public_url}
                  alt={image.alt_text || "Vista de la propiedad"}
                  fill
                  className="object-cover select-none"
                  priority={index === 0}
                  sizes="100vw"
                />
              </div>
              
              {/* Cover Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Top Badges */}
      <div className="absolute top-6 left-6 flex gap-2 z-10">
          {images[selectedIndex]?.is_cover && (
            <Badge className="bg-primary hover:bg-primary text-white border-none px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-lg">
              Destacada
            </Badge>
          )}
        </div>

      {/* Bottom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-linear-to-t from-black/70 to-transparent">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-end">
          <div className="hidden sm:block">
            <button 
              onClick={() => setIsLightboxOpen(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-white/30 shadow-sm"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="font-medium text-sm">Ver las {images.length} fotos</span>
            </button>
          </div>
          
          <div className="hidden sm:block bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 shadow-sm">
             {selectedIndex + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Nav Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => emblaMainApi?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all opacity-0 group-hover:opacity-100 duration-300 z-20 active:scale-95 transform -translate-x-2 group-hover:translate-x-0"
            aria-label="Cargar imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => emblaMainApi?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-lg transition-all opacity-0 group-hover:opacity-100 duration-300 z-20 active:scale-95 transform translate-x-2 group-hover:translate-x-0"
            aria-label="Cargar siguiente imagen"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Mobile Only overlay button */}
      <div className="absolute bottom-4 right-4 sm:hidden z-20">
          <button 
            onClick={() => setIsLightboxOpen(true)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-lg"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
      </div>

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
                    className="relative w-full h-full max-h-[80vh] flex items-center justify-center"
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
              <div className="flex items-center justify-between mt-auto w-full max-w-2xl mx-auto px-4 py-4">
                <button
                  onClick={() => {
                    const prev = (selectedIndex - 1 + images.length) % images.length;
                    setSelectedIndex(prev);
                    emblaMainApi?.scrollTo(prev);
                  }}
                  className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 backdrop-blur-md"
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                <div className="text-white/90 font-mono text-lg tracking-widest tabular-nums">
                  {selectedIndex + 1} <span className="text-white/30 ml-2 mr-3">/</span> {images.length}
                </div>
                <button
                  onClick={() => {
                    const next = (selectedIndex + 1) % images.length;
                    setSelectedIndex(next);
                    emblaMainApi?.scrollTo(next);
                  }}
                  className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 backdrop-blur-md"
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
