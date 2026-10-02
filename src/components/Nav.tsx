"use client";

import { useRef } from "react";
import Logo from "./Logo";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { WHATSAPP_URL } from "@/lib/content";

const LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#feedbacks", label: "Feedbacks" },
];

export default function Nav() {
  const nav = useRef<HTMLElement>(null);

  // O logo pequeno só aparece depois que o logo grande do hero saiu de cena.
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#inicio",
      start: "45% top",
      end: "max",
      toggleClass: { targets: nav.current, className: "is-scrolled" },
    });
  });

  return (
    <header className="nav" ref={nav}>
      <a href="#inicio" className="nav-logo" aria-label="Ego Corp, voltar ao início">
        <Logo />
      </a>
      <nav className="nav-links" aria-label="Seções">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-primary btn-small" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
        Falar no WhatsApp
      </a>
    </header>
  );
}
