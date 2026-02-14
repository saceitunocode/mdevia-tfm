import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-6">
            <div className="text-2xl font-heading font-bold text-primary tracking-tighter uppercase">
              FR <span className="text-white ml-1">Inmobiliaria</span>
            </div>
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              Tu confianza, nuestro compromiso. Especialistas en gestión inmobiliaria
              con más de 20 años de experiencia en el sector.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-zinc-100 mb-6 underline underline-offset-8 decoration-primary/50">Enlaces</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link href="/propiedades" className="hover:text-primary transition-colors">Propiedades</Link></li>
              <li><Link href="/#nosotros" className="hover:text-primary transition-colors">Nosotros</Link></li>
              <li><Link href="/#contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-[0.2em] text-zinc-100 mb-6 underline underline-offset-8 decoration-primary/50">Contacto</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-center gap-2">Andújar & Córdoba</li>
              <li>Email: info@frinmobiliarias.es</li>
              <li>Tel: +34 953 50 XX XX</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] text-zinc-500 uppercase tracking-[0.3em]">
          <p>© {currentYear} FR Inmobiliaria. Todos los derechos reservados.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-zinc-100 transition-colors">Aviso Legal</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-zinc-100 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
