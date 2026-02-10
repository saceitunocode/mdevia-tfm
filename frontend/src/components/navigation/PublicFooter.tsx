import Link from "next/link";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-xl font-heading font-bold text-primary tracking-tighter uppercase">
              FR <span className="text-foreground ml-1">Inmobiliaria</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Tu confianza, nuestro compromiso. Especialistas en gestión inmobiliaria
              con más de 20 años de experiencia en el sector.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/propiedades" className="hover:text-primary transition-colors">Propiedades</Link></li>
              <li><Link href="/#nosotros" className="hover:text-primary transition-colors">Nosotros</Link></li>
              <li><Link href="/#contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Andújar & Córdoba</li>
              <li>Email: info@frinmobiliarias.es</li>
              <li>Tel: +34 953 50 XX XX</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-muted-foreground uppercase tracking-widest">
          <p>© {currentYear} FR Inmobiliaria. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-foreground">Aviso Legal</a>
            <a href="#" className="hover:text-foreground">Privacidad</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
