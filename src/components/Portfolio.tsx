"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Chevron from "./Chevron";
import SectionTitle from "./SectionTitle";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { useArcRing } from "@/lib/useArcRing";
import { PORTFOLIO } from "@/lib/content";

// As peças ficam num arco côncavo em 3D (ver useArcRing), e cada uma abre
// ampliada ao clicar.
export default function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const zoomed = useRef<HTMLImageElement>(null);
  const { sim, nudge } = useArcRing(root, stage, ".pf-card");
  const [open, setOpen] = useState<number | null>(null);

  const openPiece = (index: number, from: HTMLElement) => {
    const box = dialog.current!;
    const start = from.getBoundingClientRect();
    flushSync(() => setOpen(index)); // a imagem ampliada precisa existir antes de medir
    box.showModal();
    if (!window.matchMedia(MOTION_OK).matches) return;
    const end = zoomed.current!.getBoundingClientRect();
    gsap.fromTo(
      zoomed.current,
      {
        x: start.left + start.width / 2 - (end.left + end.width / 2),
        y: start.top + start.height / 2 - (end.top + end.height / 2),
        scale: start.height / end.height,
      },
      { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
    );
    gsap.fromTo(box, { backgroundColor: "rgba(0,0,0,0)" }, { backgroundColor: "rgba(0,0,0,0.92)", duration: 0.3 });
  };

  const step = (delta: number) => {
    setOpen((current) =>
      current === null ? current : (current + delta + PORTFOLIO.length) % PORTFOLIO.length,
    );
  };

  // Enquanto a peça está ampliada o arco para; rolar a página fecha a ampliação,
  // então o scroll nunca fica preso aqui.
  useEffect(() => {
    sim.current.paused = open !== null;
    if (open === null) return;

    const close = () => dialog.current?.close();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("wheel", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", close);
      window.removeEventListener("touchmove", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="pf" id="portfolio" ref={root}>
      <div className="pf-head">
        <div>
          <SectionTitle>Portfólio</SectionTitle>
          <p className="pf-hint">Arraste para girar. Clique numa peça para ampliar.</p>
        </div>
        <div className="pf-arrows">
          <button type="button" className="pf-arrow" onClick={() => nudge(-1)} aria-label="Peça anterior">
            <Chevron flip />
          </button>
          <button type="button" className="pf-arrow" onClick={() => nudge(1)} aria-label="Próxima peça">
            <Chevron />
          </button>
        </div>
      </div>

      <div className="pf-stage" ref={stage}>
        <div className="pf-ring">
          {PORTFOLIO.map((src, i) => (
            <button
              type="button"
              className="pf-card"
              key={src}
              onClick={(event) => openPiece(i, event.currentTarget)}
              aria-label={`Ampliar peça ${i + 1} de ${PORTFOLIO.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" decoding="async" draggable={false} />
            </button>
          ))}
          <div className="pf-card pf-end">
            <p className="display">A próxima peça pode ser a sua.</p>
            <a className="btn btn-dark" href="#contato">
              Fale conosco
            </a>
          </div>
        </div>
      </div>

      <dialog
        className="pf-box"
        ref={dialog}
        aria-label="Peça ampliada"
        onClose={() => setOpen(null)}
        onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      >
        {open !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={zoomed} src={PORTFOLIO[open]} alt={`Peça ${open + 1} criada pela Ego Corp`} />
        )}
        <button type="button" className="pf-arrow pf-box-prev" onClick={() => step(-1)} aria-label="Peça anterior">
          <Chevron flip />
        </button>
        <button type="button" className="pf-arrow pf-box-next" onClick={() => step(1)} aria-label="Próxima peça">
          <Chevron />
        </button>
        <button type="button" className="btn btn-ghost btn-small pf-box-close" onClick={() => dialog.current?.close()}>
          Fechar
        </button>
      </dialog>
    </section>
  );
}
