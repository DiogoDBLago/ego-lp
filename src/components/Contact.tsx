"use client";

import type { FormEvent } from "react";
import Magnetic from "./Magnetic";
import { EMAIL, INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/content";

export default function Contact() {
  // Sem backend no MVP: o formulário abre o WhatsApp da Ego com a mensagem pronta.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      "Olá! Vim pelo site da EGO CORP.",
      `Nome: ${data.get("nome")}`,
      `Telefone: ${data.get("telefone")}`,
      `Email: ${data.get("email")}`,
      `Mensagem: ${data.get("mensagem")}`,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener");
  };

  return (
    <section className="sec ct" id="contato">
      <div className="wrap ct-grid">
        <div>
          <h2 className="ct-title display">Domine o jogo.</h2>
          <p className="ct-lead">
            Quer trabalhar conosco? Conte o que a sua marca precisa e a conversa continua no
            WhatsApp.
          </p>
          <ul className="ct-links">
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                @egocorporation
              </a>
            </li>
          </ul>
        </div>

        <form className="ct-form" onSubmit={onSubmit}>
          <label>
            Nome
            <input name="nome" type="text" autoComplete="name" required />
          </label>
          <label>
            Telefone
            <input name="telefone" type="tel" autoComplete="tel" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Mensagem
            <textarea name="mensagem" rows={4} required />
          </label>
          <Magnetic>
            <button className="btn btn-primary" type="submit">
              Enviar pelo WhatsApp
            </button>
          </Magnetic>
        </form>
      </div>
    </section>
  );
}
