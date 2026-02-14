"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  onDelete: (id: string) => void;
  onSetMain: (id: string) => void;
}

function SortableImageCard({ image, onDelete, onSetMain }: SortableItemProps) {
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
      className={cn(
        "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group",
        image.is_cover ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50",
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
            className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg"
          >
            <Star className="h-3 w-3 fill-current" /> PORTADA
          </motion.div>
        )}
      </div>

      <div className="absolute top-2 right-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
        {!image.is_cover && (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border-none shadow-md hover:bg-primary hover:text-white"
            onClick={() => onSetMain(image.id)}
            title="Marcar como portada"
          >
            <Star className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="h-8 w-8 rounded-full bg-destructive/80 backdrop-blur-md border-none shadow-md hover:bg-destructive hover:scale-110 transition-all font-bold"
          onClick={() => onDelete(image.id)}
          title="Eliminar imagen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>


      
      {/* Selection Overlay */}
      <div className={cn(
        "absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-300",
        image.is_cover ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
}

export function PropertyGalleryManager({ propertyId, initialImages, onImagesChange }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
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
        // Rollback? or just alert
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
                (Arrastra las fotos para cambiar el orden)
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
