import { Phone, Mail, MessageCircle, MapPin, User } from "lucide-react";

const agents = [
  {
    name: "MIGUEL",
    location: "ANDÚJAR",
    phone: "+34 600 000 002",
    email: "mpoyatos@frinmobiliaria.com",
    whatsapp: "34600000002",
  },
  {
    name: "FRAN",
    location: "CÓRDOBA",
    phone: "+34 600 000 001",
    email: "faceituno@frinmobiliaria.com",
    whatsapp: "34600000001",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-6 md:py-20 bg-muted/20 border-b border-border/50">
        <div className="container px-4 mx-auto text-center space-y-1 md:space-y-4">
          <div className="hidden md:inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Phone size={32} />
          </div>
          <h1 className="text-2xl md:text-5xl font-heading font-bold tracking-tight uppercase">Contacto</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl mx-auto italic">
            Estamos aquí para ayudarte a encontrar tu hogar ideal.
          </p>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-6 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 lg:gap-24">
              {agents.map((agent) => (
                <div 
                  key={agent.name} 
                  className="flex flex-col items-center p-4 md:p-8 rounded-2xl md:rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm md:shadow-md transition-shadow space-y-4 md:space-y-10"
                >
                  {/* Agent Profile Header */}
                  <div className="flex flex-col items-center space-y-3 md:space-y-6">
                    <div className="relative w-20 h-20 md:w-48 md:h-48 rounded-full flex items-center justify-center bg-primary/5 border-2 md:border-4 border-white shadow-lg md:shadow-2xl text-primary/20">
                      <User size={40} className="md:w-[100px] md:h-[100px]" strokeWidth={1} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-primary font-heading font-bold text-lg md:text-2xl tracking-widest uppercase">
                        {agent.name} / {agent.location}
                      </h3>
                    </div>
                  </div>

                  {/* Contact Buttons Stack */}
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center justify-between px-4 py-2.5 md:px-6 md:py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-1.5 md:p-2 bg-accent/10 text-accent rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                        <Phone size={18} className="md:w-6 md:h-6" />
                      </div>
                      <span className="text-primary font-heading font-bold text-base md:text-xl italic tracking-tight">Llamar</span>
                    </a>

                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-between px-4 py-2.5 md:px-6 md:py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-1.5 md:p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Mail size={18} className="md:w-6 md:h-6" />
                      </div>
                      <span className="text-primary font-heading font-bold text-base md:text-xl italic tracking-tight">Correo</span>
                    </a>

                    <a
                      href={`https://wa.me/${agent.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 md:px-6 md:py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-1.5 md:p-2 bg-green-500/10 text-green-500 rounded-full group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <MessageCircle size={18} className="md:w-6 md:h-6" />
                      </div>
                      <span className="text-primary font-heading font-bold text-base md:text-xl italic tracking-tight">WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-8 md:py-20 bg-muted/10">
        <div className="container px-4 mx-auto max-w-4xl text-center space-y-4 md:space-y-8">
            <div className="inline-flex items-center gap-2 text-primary font-heading font-bold uppercase tracking-widest text-[10px] md:text-sm">
                <MapPin size={14} />
                Nuestras Oficinas
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 text-xs md:text-base text-zinc-600 dark:text-zinc-400">
                <div className="space-y-1 md:space-y-2">
                    <h4 className="text-foreground font-bold uppercase text-[11px] md:text-sm">Andújar (Jaén)</h4>
                    <p>C/ Emperador Trajano, 1</p>
                    <p>+34 953 00 00 00</p>
                </div>
                <div className="space-y-1 md:space-y-2">
                    <h4 className="text-foreground font-bold uppercase text-[11px] md:text-sm">Córdoba</h4>
                    <p>Delegación Córdoba</p>
                    <p>+34 600 00 00 01</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
