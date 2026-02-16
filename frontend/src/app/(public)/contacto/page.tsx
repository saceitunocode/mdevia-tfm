import Image from "next/image";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const agents = [
  {
    name: "MIGUEL",
    location: "ANDÚJAR",
    image: "/agent_miguel_andujar.png",
    phone: "+34 600 000 002",
    email: "mpoyatos@frinmobiliaria.com",
    whatsapp: "34600000002",
  },
  {
    name: "FRAN",
    location: "CÓRDOBA",
    image: "/agent_fran_cordoba.png",
    phone: "+34 600 000 001",
    email: "faceituno@frinmobiliaria.com",
    whatsapp: "34600000001",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted/20 border-b border-border/50">
        <div className="container px-4 mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
            <Phone size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight uppercase">Contacto</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto italic">
            Estamos aquí para ayudarte a encontrar tu hogar ideal. Contacta con nuestros expertos.
          </p>
        </div>
      </section>

      {/* Agents Section - Grid 2 Columns */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              {agents.map((agent) => (
                <div 
                  key={agent.name} 
                  className="flex flex-col items-center space-y-10 p-8 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Agent Profile Header */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <Image
                        src={agent.image}
                        alt={`${agent.name} - ${agent.location}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="text-primary font-heading font-bold text-2xl tracking-widest uppercase">
                        {agent.name} / {agent.location}
                      </h3>
                    </div>
                  </div>

                  {/* Contact Buttons Stack */}
                  <div className="flex flex-col w-full gap-4 max-w-xs">
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center justify-between px-6 py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-2 bg-accent/10 text-accent rounded-full group-hover:bg-accent group-hover:text-white transition-colors">
                        <Phone size={24} />
                      </div>
                      <span className="text-primary font-heading font-bold text-xl italic tracking-tight">Llamar</span>
                    </a>

                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center justify-between px-6 py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-2 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Mail size={24} />
                      </div>
                      <span className="text-primary font-heading font-bold text-xl italic tracking-tight">Correo</span>
                    </a>

                    <a
                      href={`https://wa.me/${agent.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-6 py-4 border-2 border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      <div className="p-2 bg-green-500/10 text-green-500 rounded-full group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <MessageCircle size={24} />
                      </div>
                      <span className="text-primary font-heading font-bold text-xl italic tracking-tight">WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-20 bg-muted/10">
        <div className="container px-4 mx-auto max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 text-primary font-heading font-bold uppercase tracking-widest text-sm">
                <MapPin size={16} />
                Nuestras Oficinas
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-600 dark:text-zinc-400">
                <div className="space-y-2">
                    <h4 className="text-foreground font-bold uppercase">Andújar (Jaén)</h4>
                    <p>C/ Emperador Trajano, 1</p>
                    <p>+34 953 00 00 00</p>
                </div>
                <div className="space-y-2">
                    <h4 className="text-foreground font-bold uppercase">Córdoba</h4>
                    <p>Delegación Córdoba</p>
                    <p>+34 600 00 00 01</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
