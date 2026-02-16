import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950 py-8 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Mission */}
          <div className="col-span-2 md:col-span-2 space-y-4 md:space-y-6">
            <div className="text-xl md:text-2xl font-heading font-bold text-primary tracking-tighter uppercase">
              FR <span className="text-white ml-1">Inmobiliaria</span>
            </div>
            <p className="text-zinc-400 text-xs md:text-sm max-w-sm leading-relaxed">
              Tu confianza, nuestro compromiso. Especialistas en gestión inmobiliaria
              con más de 20 años de experiencia en el sector.
            </p>
          </div>

          {/* Quick Links (Hidden on Mobile) */}
          <div className="hidden md:block">
            <h4 className="font-heading font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-100 mb-4 md:mb-6 underline underline-offset-8 decoration-primary/50">Enlaces</h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-zinc-400">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link href="/propiedades" className="hover:text-primary transition-colors">Propiedades</Link></li>
              <li><Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Info (Hidden on Mobile) */}
          <div className="hidden md:block">
            <h4 className="font-heading font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-100 mb-4 md:mb-6 underline underline-offset-8 decoration-primary/50">Contacto</h4>
            <ul className="space-y-2 md:space-y-4 text-xs md:text-sm text-zinc-400">
              <li className="flex items-center gap-2">Andújar & Córdoba</li>
              <li>info@frinmobiliaria.es</li>
              <li>+34 953 00 00 00</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
          <p>© {currentYear} FR Inmobiliaria. Todos los derechos reservados.</p>
          <div className="flex space-x-8">
            <Link href="/legal" className="hover:text-zinc-100 transition-colors">
              Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
