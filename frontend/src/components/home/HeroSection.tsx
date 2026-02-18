"use client";

import Link from "next/link";
import { ShieldCheck, Percent } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full bg-background overflow-hidden">
      {/* Top Banner - Financing Focus */}
      <div className="bg-primary py-3 px-4">
        <div className="flex items-center justify-center gap-3 text-white text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-center">
          <Percent size={16} className="text-accent shrink-0" />
          <span>Asesores en Financiación 100% y servicios adicionales</span>
          <ShieldCheck size={16} className="text-accent shrink-0" />
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[450px] md:min-h-[750px]">
        
        {/* Andujar Block */}
        <Link 
          href="/propiedades?city=Andújar"
          className="group relative flex flex-col items-center justify-center overflow-hidden transition-all duration-700 hover:scale-[1.01] py-16 md:py-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale-30 group-hover:grayscale-0"
            style={{ backgroundImage: 'url("/hero_andujar.png")' }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-emerald-900/40 group-hover:bg-emerald-900/20 transition-colors duration-500" />
          <div className="absolute inset-0 bg-linear-to-t from-emerald-900/80 via-transparent to-transparent" />
          
          {/* Text Content */}
          <div className="relative z-20 text-center space-y-4 md:space-y-6 px-4">
            <h2 className="text-4xl md:text-7xl font-heading font-black text-white tracking-tighter drop-shadow-2xl">
              ANDÚJAR
            </h2>
            <div className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-primary rounded-full font-bold uppercase tracking-widest text-xs md:text-sm shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
              Ver inmuebles
            </div>
          </div>
        </Link>

        {/* Cordoba Block */}
        <Link 
          href="/propiedades?city=Córdoba"
          className="group relative flex flex-col items-center justify-center overflow-hidden transition-all duration-700 hover:scale-[1.01] z-10 py-16 md:py-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 grayscale-30 group-hover:grayscale-0"
            style={{ backgroundImage: 'url("/hero_cordoba.png")' }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-500" />
          <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent" />
          
          {/* Text Content */}
          <div className="relative z-20 text-center space-y-4 md:space-y-6 px-4">
            <h2 className="text-4xl md:text-7xl font-heading font-black text-white tracking-tighter drop-shadow-2xl">
              CÓRDOBA
            </h2>
            <div className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-primary rounded-full font-bold uppercase tracking-widest text-xs md:text-sm shadow-xl group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
              Ver inmuebles
            </div>
          </div>
        </Link>

      </div>

      {/* Floating Mission Statement */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 hidden lg:block">
        <div className="bg-white/95 backdrop-blur-md px-10 py-6 rounded-2xl shadow-2xl border border-white/20 text-center max-w-xl mx-auto">
          <p className="text-primary font-heading font-bold text-xs uppercase tracking-[0.3em] mb-2">Más de 20 años de experiencia</p>
          <p className="text-zinc-600 text-sm leading-relaxed">
            Especialistas en la gestión integral de activos inmobiliarios en las provincias de <span className="text-foreground font-bold italic">Jaén y Córdoba</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
