"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionTitle from "./SectionTitle";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { SERVICES } from "@/lib/content";

const GAP = 14; // distância entre o colchete e o nome

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2 8.5 6.2 12.5 14 3.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

// Os "> <" dos títulos viram um seletor que pula para o serviço em foco.
export default function Services() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLSpanElement>(null);
  const right = useRef<HTMLSpanElement>(null);

  const place = useCallback((index: number, animate: boolean) => {
    const name = list.current?.querySelectorAll<HTMLElement>(".svc-name")[index];
    if (!name || !list.current) return;
    const box = name.getBoundingClientRect();
    const origin = list.current.getBoundingClientRect();
    const y = box.top - origin.top + box.height / 2;
    const motion = animate && window.matchMedia(MOTION_OK).matches;
    const tween = { y, duration: motion ? 0.42 : 0, ease: "back.out(2.4)", overwrite: true };
    gsap.to(left.current, { ...tween, x: box.left - origin.left - GAP, xPercent: -100, yPercent: -50 });
    gsap.to(right.current, { ...tween, x: box.right - origin.left + GAP, yPercent: -50 });
  }, []);

  useEffect(() => {
    place(active, true);
  }, [active, place]);

  useEffect(() => {
    const settle = () => place(active, false);
    window.addEventListener("resize", settle);
    document.fonts?.ready.then(settle);
    return () => window.removeEventListener("resize", settle);
  }, [active, place]);

  const current = SERVICES[active];

  return (
    <section className="sec svc" id="servicos">
      <div className="wrap">
        <SectionTitle>Serviços</SectionTitle>

        <div className="svc-grid">
          <div className="svc-list" ref={list}>
            <ul>
              {SERVICES.map((service, i) => (
              <li key={service.name}>
                <button
                  type="button"
                  className="svc-btn"
                  aria-current={i === active}
                  onPointerEnter={(event) => event.pointerType === "mouse" && setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  <span className="svc-name display">{service.name}</span>
                </button>
                <ul className="svc-sub">
                  {service.items.map((item) => (
                    <li key={item}>
                      <Check />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
              ))}
            </ul>
            <span className="svc-br display" ref={left} aria-hidden="true">
              &gt;
            </span>
            <span className="svc-br display" ref={right} aria-hidden="true">
              &lt;
            </span>
          </div>

          <div className="svc-panel" aria-live="polite">
            <ul key={current.name}>
              {current.items.map((item, i) => (
                <li key={item} style={{ animationDelay: `${i * 55}ms` }}>
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
            <a className="btn btn-primary" href="#contato">
              Quero isso para a minha marca
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
