"use client";

import { Button } from "@/components/ui/Button";
import { MapPin, Home as HomeIcon, Euro } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image Placeholder - Replace with actual image */}
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1000")' }}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="container relative z-20 px-4 pt-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Headings */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white drop-shadow-lg">
              Tu Futuro <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-blue-100 to-white/80">
                Empieza Aquí
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto drop-shadow-md">
              Expertos en gestión inmobiliaria en Andújar y Córdoba. 
              Encuentra la propiedad perfecta con la garantía de FR Inmobiliaria.
            </p>
          </div>

          {/* Search Bar Card */}
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-4xl mx-auto border border-white/20 text-left">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-transparent focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors outline-none" 
                  placeholder="Ciudad, zona o código postal" 
                  type="text"
                />
              </div>
              
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HomeIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <select className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl bg-transparent focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors appearance-none outline-none">
                  <option>Tipo de Propiedad</option>
                  <option>Piso</option>
                  <option>Casa</option>
                  <option>Local Comercial</option>
                  <option>Terreno</option>
                </select>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Euro className="h-5 w-5 text-muted-foreground" />
                </div>
                <select className="block w-full pl-10 pr-10 py-3 border border-border rounded-xl bg-transparent focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors appearance-none outline-none">
                  <option>Rango de Precio</option>
                  <option>Hasta 100.000€</option>
                  <option>100k€ - 200k€</option>
                  <option>200k€ - 300k€</option>
                  <option>Más de 300k€</option>
                </select>
              </div>

              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all h-auto">
                Buscar
              </Button>
            </form>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">1.2k+</p>
              <p className="text-sm text-white/80 uppercase tracking-wider font-medium">Propiedades Vendidas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">850+</p>
              <p className="text-sm text-white/80 uppercase tracking-wider font-medium">Clientes Felices</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="text-sm text-white/80 uppercase tracking-wider font-medium">Años de Experiencia</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
