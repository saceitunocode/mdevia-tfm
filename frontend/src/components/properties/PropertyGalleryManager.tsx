"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Star, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  public_url: string;
  is_cover: boolean;
  position: number;
}

interface GalleryManagerProps {
  propertyId: string;
  initialImages: GalleryImage[];
  onImagesChange?: (images: GalleryImage[]) => void;
}

interface SortableItemProps {
  image: GalleryImage;
  isSelected?: boolean;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  onSetMain: (id: string) => void;
}

function SortableImageCard({ image, isSelected, onSelect, onDelete, onSetMain }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(isSelected ? null : image.id)}
      className={cn(
        "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group cursor-pointer",
        image.is_cover ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
        isSelected && "border-primary ring-4 ring-primary/20 scale-[0.98]",
        isDragging ? "opacity-50 scale-105 shadow-2xl" : "shadow-sm hover:shadow-lg"
      )}
    >
      <Image
        src={image.public_url}
        alt="Property"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 20vw"
        unoptimized={image.public_url.startsWith("http://localhost") || image.public_url.startsWith("http://127.0.0.1")}
      />
      
      {/* Drag Handle Overlay */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
      />

      {/* Badges & Actions */}
      <div className="absolute top-2 left-2 z-20">
        {image.is_cover && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 shadow-xl border border-white/20"
          >
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> PORTADA
          </motion.div>
        )}
      </div>

      <div className={cn(
        "absolute top-2 right-2 flex gap-2 z-30 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0",
        isSelected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none md:pointer-events-auto"
      )}>
        {!image.is_cover && (
          <Button
            type="button"
            size="icon"
            className="h-10 w-10 md:h-8 md:w-8 rounded-full bg-white text-amber-500 border border-border shadow-xl hover:bg-amber-500 hover:text-white active:scale-90 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onSetMain(image.id);
            }}
            title="Marcar como portada"
          >
            <Star className="h-5 w-5 md:h-4 md:w-4 fill-current" />
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          className="h-10 w-10 md:h-8 md:w-8 rounded-full bg-white text-destructive border border-border shadow-xl hover:bg-destructive hover:text-white hover:scale-110 active:scale-95 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.id);
          }}
          title="Eliminar imagen"
        >
          <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
        </Button>
      </div>

      {/* Selection Overlay */}
      <div className={cn(
        "absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-300",
        (image.is_cover || isSelected) ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}

export function PropertyGalleryManager({ propertyId, initialImages, onImagesChange }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const newOrder = arrayMove(images, oldIndex, newIndex);
      setImages(newOrder);
      
      // Persist reorder to backend
      try {
        setIsUpdating(true);
        await apiRequest(`/properties/${propertyId}/images/reorder`, {
          method: "PATCH",
          body: JSON.stringify({
            image_ids: newOrder.map(img => img.id)
          }),
        });
        onImagesChange?.(newOrder);
      } catch (error) {
        console.error("Error reordering images:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta imagen?")) return;

    try {
      setIsUpdating(true);
      await apiRequest(`/properties/images/${imageId}`, {
        method: "DELETE",
      });
      const filtered = images.filter(img => img.id !== imageId);
      setImages(filtered);
      onImagesChange?.(filtered);
      if (selectedId === imageId) setSelectedId(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSetMain = async (imageId: string) => {
    try {
      setIsUpdating(true);
      await apiRequest(`/properties/${propertyId}/images/${imageId}/set-main`, {
        method: "PATCH",
      });
      
      const updated = images.map(img => ({
        ...img,
        is_cover: img.id === imageId
      }));
      setImages(updated);
      onImagesChange?.(updated);
      setSelectedId(null);
    } catch (error) {
      console.error("Error setting main image:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                Orden de la Galería
            </h4>
            <span className="text-[10px] text-muted-foreground/60 font-medium normal-case">
                (Toca para gestionar, mantén pulsado para mover)
            </span>
        </div>
        {isUpdating && (
            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
                <CheckCircle2 className="h-3 w-3" /> Sincronizando...
            </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={() => setSelectedId(null)}
      >
        <SortableContext
          items={images.map(img => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {images.map((image) => (
                <SortableImageCard
                  key={image.id}
                  image={image}
                  isSelected={selectedId === image.id}
                  onSelect={setSelectedId}
                  onDelete={handleDelete}
                  onSetMain={handleSetMain}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-xl border-muted bg-muted/10">
          <p className="text-sm text-muted-foreground">La galería está vacía.</p>
        </div>
      )}
    </div>
  );
}
