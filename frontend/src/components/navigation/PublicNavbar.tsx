"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Menu, X, Home, Search, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Propiedades", href: "/propiedades", icon: Search },
    { name: "Contacto", href: "/contacto", icon: Phone },
  ];

  return (
    <nav className={`sticky top-0 z-50 w-full border-b border-border transition-colors duration-200 ${isOpen ? 'bg-background' : 'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'}`}>
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
            className="p-2 text-foreground focus:outline-none"
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-[64px] z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-[64px] left-0 right-0 z-50 border-b border-border bg-background shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 text-lg font-medium text-foreground py-3 border-b border-border/40 last:border-0 hover:text-primary transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-primary" />
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-2"
              >
                <Link href="/oficina/acceso" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-base py-6 font-bold shadow-md">Acceso Agente</Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}