"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Home, Search, Info, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Propiedades", href: "/propiedades", icon: Search },
    { name: "Nosotros", href: "/#nosotros", icon: Info },
    { name: "Contacto", href: "/#contacto", icon: Phone },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 mr-1">
             <Image 
               src="/logo.png" 
               alt="FR Inmobiliaria Logo" 
               fill
               className="object-contain"
               priority
             />
          </div>
          <div className="flex items-center text-2xl font-heading font-bold text-primary tracking-tighter uppercase">
            FR <span className="text-foreground ml-1">Inmobiliaria</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-4 w-px bg-border" />
          <ThemeToggle />
          <Link href="/oficina/acceso">
            <Button size="sm">Acceso Agente</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-foreground"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-2 text-base font-medium text-foreground py-2 hover:text-primary transition-colors"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.name}</span>
            </Link>
          ))}
          <div className="pt-4 border-t border-border">
            <Link href="/oficina/acceso" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Acceso Agente</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
