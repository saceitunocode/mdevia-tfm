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
      <section className="py-20 bg-muted/20 border-b border-border/50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
             <h2 className="text-3xl font-heading font-bold tracking-tight">
               Por qué elegir FR Inmobiliaria
             </h2>
             <p className="text-muted-foreground text-lg">
               Combinamos experiencia tradicional con las últimas tecnologías para ofrecerte un servicio transparente y eficaz.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <div key={i} className="flex flex-col items-center text-center p-6 space-y-4 bg-background rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="container px-4 mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold tracking-tight max-w-4xl mx-auto">
            ¿Listo para encontrar tu lugar en el mundo?
          </h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Nuestro equipo de expertos está esperando para guiarte en cada paso del camino.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Link 
               href="/contacto"
               className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
             >
               Contactar Ahora
             </Link>
             <Link 
               href="/propiedades"
               className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
             >
               Ver Inmuebles
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
