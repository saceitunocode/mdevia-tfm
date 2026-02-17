import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Award, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      <FeaturedProperties />

      {/* Services / Value Prop Section */}
      <section className="py-12 md:py-20 bg-accent border-b border-white/10">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16 space-y-4">
             <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-white">
               Por qué elegir FR Inmobiliaria
             </h2>
             <p className="text-white/90 text-base md:text-lg">
               Combinamos experiencia tradicional con las últimas tecnologías para ofrecerte un servicio transparente y eficaz.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Confianza Total", 
                desc: "Más de 20 años de experiencia garantizan una gestión segura y sin sorpresas." 
              },
              { 
                icon: Award, 
                title: "Servicio Premium", 
                desc: "Atención personalizada y exclusiva para compradores y vendedores exigentes." 
              },
              { 
                icon: Clock, 
                title: "Agilidad", 
                desc: "Procesos optimizados digitalmente para cerrar operaciones en tiempo récord." 
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center p-4 md:p-6 gap-4 md:space-y-4 bg-background rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 md:h-16 md:w-16 shrink-0 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <feature.icon size={24} className="md:w-8 md:h-8" />
                </div>
                <div className="flex flex-col space-y-1 md:space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">{feature.title}</h3>
                  <p className="text-xs md:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-24 bg-primary text-primary-foreground relative overflow-hidden text-balance">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="container px-4 mx-auto text-center relative z-10 space-y-4 md:space-y-8">
          <h2 className="text-2xl md:text-5xl font-heading font-bold tracking-tight max-w-4xl mx-auto px-2">
            ¿Listo para encontrar tu lugar en el mundo?
          </h2>
          <p className="text-base md:text-xl text-primary-foreground/80 max-w-2xl mx-auto px-4">
            Nuestro equipo de expertos está esperando para guiarte en cada paso del camino.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 md:pt-4">
             <Link 
               href="/contacto"
               className="bg-white text-primary px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg shadow-xl hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
             >
               Contactar Ahora
             </Link>
             <Link 
               href="/propiedades"
               className="bg-transparent border-2 border-white/30 text-white px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
             >
               Ver Inmuebles
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
