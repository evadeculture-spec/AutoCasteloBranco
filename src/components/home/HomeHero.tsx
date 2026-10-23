"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { CarRender } from "@/components/brand/CarRender";
import { ArrowRight, Calendar, Car, Phone } from "@/components/ui/icons";
import { inspectionPoints } from "@/components/workshop/InspectionDiagram";
import { formatPrice } from "@/lib/format";
import { phoneLabel, telHref } from "@/lib/contact";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Mode = "comprar" | "oficina";

export interface HeroData {
  vehicles: Array<{ make: string; priceEur: number }>;
  makes: string[];
  prices: number[];
  services: Array<{ value: string; label: string }>;
}

/**
 * Hero de conversão: um único palco que se transforma conforme a intenção
 * do visitante — comprar uma viatura ou tratar da que já tem.
 * Os formulários são GET simples: funcionam mesmo sem JavaScript.
 */
export function HomeHero({ data }: { data: HeroData }) {
  const [mode, setMode] = useState<Mode>("comprar");
  const [make, setMake] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const uid = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const total = data.vehicles.length;
  const fromPrice = total ? formatPrice(Math.min(...data.vehicles.map((v) => v.priceEur))) : "—";
  const matches = useMemo(
    () =>
      data.vehicles.filter(
        (v) => (!make || v.make.toLowerCase() === make) && (!maxPrice || v.priceEur <= Number(maxPrice)),
      ).length,
    [data.vehicles, make, maxPrice],
  );
  const workshop = mode === "oficina";
  const tel = telHref();

  const modes: Array<{ id: Mode; label: string; icon: React.ReactNode }> = [
    { id: "comprar", label: "Comprar viatura", icon: <Car size={18} /> },
    { id: "oficina", label: "Oficina", icon: <Calendar size={18} /> },
  ];

  function onTabKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (index + (e.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length;
    setMode(modes[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section aria-labelledby="hero-title" className="on-dark relative isolate overflow-hidden bg-ink text-paper">
      <Stage workshop={workshop} />

      <div className="container-x relative grid min-h-[max(40rem,min(calc(100svh-2rem),52rem))] content-start gap-y-8 pt-[calc(var(--header-h)+1.5rem)] pb-10 sm:pt-[calc(var(--header-h)+2.5rem)] lg:grid-cols-12 lg:gap-x-8 lg:pt-[calc(var(--header-h)+2rem)] lg:pb-14">
        {/* ---------- Mensagem ---------- */}
        <div className="relative z-10 lg:col-span-12 lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <h1 id="hero-title" className="lg:col-span-9">
            <span className="label anim-rise block text-metal" style={{ ["--delay" as string]: "80ms" }}>
              <span className="max-sm:hidden">Auto Castelo Branco — </span>Viaturas usadas e oficina
            </span>
            <span
              className="font-display anim-rise mt-5 block text-[clamp(2.5rem,4.9vw,4.6rem)] leading-[0.98] font-bold"
              style={{ ["--delay" as string]: "160ms" }}
            >
              Confiança na estrada.
              <br />
              <span className="text-metal">Rigor em cada detalhe.</span>
            </span>
          </h1>
          <p
            className="anim-rise mt-6 hidden max-w-md text-[1.05rem] leading-relaxed text-mist sm:block lg:col-span-3 lg:mt-0 lg:hidden lg:pb-2 lg:text-[0.98rem] xl:block"
            style={{ ["--delay" as string]: "240ms" }}
          >
            Compra e venda de viaturas e assistência técnica em Castelo Branco, com o mesmo critério: informação clara e
            trabalho bem explicado.
          </p>
        </div>

        {/* ---------- Ação ---------- */}
        <div className="relative z-10 lg:col-span-5 lg:self-end">
          {/* Seletor de intenção */}
          <div className="anim-rise max-w-md" style={{ ["--delay" as string]: "320ms" }}>
            <div role="tablist" aria-label="O que procura?" className="grid grid-cols-2 border border-steel bg-ink/70 p-1 backdrop-blur">
              {modes.map((m, i) => {
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    type="button"
                    id={`${uid}-tab-${m.id}`}
                    aria-selected={active}
                    aria-controls={`${uid}-panel`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setMode(m.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={cn(
                      "flex min-h-12 items-center justify-center gap-2 text-[0.92rem] font-semibold transition-colors duration-300",
                      active ? "bg-paper text-ink" : "text-mist hover:text-paper",
                    )}
                  >
                    {m.icon}
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${mode}`}
              className="border-x border-b border-steel bg-graphite/80 p-5 backdrop-blur sm:p-6"
            >
              {mode === "comprar" ? (
                <form
                  key="comprar"
                  action="/viaturas"
                  method="get"
                  className="anim-rise grid gap-4"
                  onSubmit={() => track("inventory_filter", { context: "hero", marca: make || "todas", ate: maxPrice || "sem" })}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="label mb-2 block text-[0.62rem] text-metal">Marca</span>
                      <select
                        name="marca"
                        className="field min-h-12 py-2 text-[0.95rem]"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                      >
                        <option value="">Todas</option>
                        {data.makes.map((m) => (
                          <option key={m} value={m.toLowerCase()}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="label mb-2 block text-[0.62rem] text-metal">Preço até</span>
                      <select
                        name="ate"
                        className="field min-h-12 py-2 text-[0.95rem]"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      >
                        <option value="">Sem limite</option>
                        {data.prices.map((p) => (
                          <option key={p} value={p}>
                            {formatPrice(p)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary w-full">
                    <span aria-live="polite">
                      {matches === 0 ? "Sem resultados — ver todas" : `Ver ${matches} ${matches === 1 ? "viatura" : "viaturas"}`}
                    </span>
                    <ArrowRight size={18} />
                  </button>
                  <p className="text-[0.85rem] text-metal">
                    {total} em inventário · desde {fromPrice}
                  </p>
                </form>
              ) : (
                <form
                  key="oficina"
                  action="/oficina#marcacao"
                  method="get"
                  className="anim-rise grid gap-4"
                  onSubmit={() => track("contact_click", { context: "hero_workshop" })}
                >
                  <label className="block">
                    <span className="label mb-2 block text-[0.62rem] text-metal">De que precisa?</span>
                    <select name="servico" className="field min-h-12 py-2 text-[0.95rem]" defaultValue="revisao">
                      {data.services.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button type="submit" className="btn btn-light w-full">
                    Pedir marcação <ArrowRight size={18} />
                  </button>
                  <p className="flex flex-wrap items-center gap-x-2 text-[0.85rem] text-metal">
                    <span>Data sujeita a confirmação.</span>
                    {tel ? (
                      <a
                        href={tel}
                        onClick={() => track("phone_click", { context: "hero_workshop" })}
                        className="inline-flex items-center gap-1.5 text-paper underline-offset-4 hover:underline"
                      >
                        <Phone size={14} /> {phoneLabel()}
                      </a>
                    ) : (
                      <Link href="/oficina" className="text-paper underline-offset-4 hover:underline">
                        Conhecer a oficina
                      </Link>
                    )}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Palco ---------- */}
        <div className="relative lg:col-span-7 lg:self-end">
          <div className="relative -mr-[14%] ml-[-4%] sm:mr-0 sm:ml-0 lg:-mr-[8%] lg:ml-[-6%]">
            <div className="anim-fade" style={{ ["--delay" as string]: "200ms" }}>
              <CarRender type="berlina" xray={workshop} className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]" />
            </div>

            {/* Pontos de inspeção (modo oficina) */}
            {inspectionPoints("berlina").map((p, i) => (
              <div
                key={p.code}
                aria-hidden={!workshop}
                className="absolute transition-all duration-500"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  opacity: workshop ? 1 : 0,
                  transform: workshop ? "scale(1)" : "scale(0.6)",
                  transitionDelay: workshop ? `${200 + i * 80}ms` : "0ms",
                }}
              >
                <span className="relative -mt-2.5 -ml-2.5 flex size-5 items-center justify-center rounded-full border border-accent-light bg-ink">
                  <span className="size-1.5 rounded-full bg-accent-light" />
                  {workshop && <span className="absolute inset-0 animate-ping rounded-full border border-accent-light/60" />}
                </span>
                <span
                  className={cn(
                    "absolute top-0 hidden -translate-y-1/2 items-center md:flex",
                    p.x > 70 ? "right-2.5 flex-row-reverse" : "left-2.5",
                  )}
                >
                  <span aria-hidden="true" className="h-px w-5 bg-accent-light/70" />
                  <span className="label border border-steel bg-ink px-1.5 py-1 text-[0.6rem] whitespace-nowrap text-mist">
                    <span className="text-accent-light">{p.code}</span> {p.label}
                  </span>
                </span>
              </div>
            ))}

            {/* Etiquetas de inventário (modo comprar) */}
            <div
              aria-hidden="true"
              className="absolute top-[4%] left-[8%] hidden transition-all duration-500 md:block"
              style={{ opacity: workshop ? 0 : 1, transform: workshop ? "translateY(8px)" : "none" }}
            >
              <span className="label block border border-steel bg-ink/80 px-2.5 py-2 text-[0.62rem] text-mist backdrop-blur">
                <span className="block text-metal">Desde</span>
                <span className="font-display tabular mt-1 block text-[1.35rem] font-semibold tracking-normal text-paper normal-case">
                  {fromPrice}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Cenário: luz de estúdio e piso em perspetiva com as faixas de estrada do
 * logótipo a irradiar do ponto de fuga — a marca transformada em espaço.
 */
function Stage({ workshop }: { workshop: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(55% 50% at 68% 60%, rgba(207,203,196,0.16) 0%, rgba(17,18,19,0) 70%), linear-gradient(180deg, #0d0e0f 0%, #141618 55%, #1b1e21 100%)",
        }}
      />
      {/* brilho vermelho em modo oficina */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: workshop ? 1 : 0,
          background: "radial-gradient(45% 40% at 68% 62%, rgba(165,30,34,0.22) 0%, rgba(165,30,34,0) 70%)",
        }}
      />
      <svg
        className="anim-fade absolute inset-x-0 bottom-0 h-[46%] w-full [mask-image:linear-gradient(to_bottom,transparent,black_55%)]"
        viewBox="0 0 1600 500"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="hero-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f0eb" stopOpacity="0.14" />
            <stop offset="1" stopColor="#f3f0eb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-stripe" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3f0eb" stopOpacity="0" />
            <stop offset="0.35" stopColor="#f3f0eb" stopOpacity="0.07" />
            <stop offset="1" stopColor="#f3f0eb" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* horizonte */}
        <line x1="0" y1="2" x2="1600" y2="2" stroke="url(#hero-floor)" strokeWidth="2" />
        {/* linhas de fuga */}
        <g stroke="#f3f0eb" strokeOpacity="0.06">
          {Array.from({ length: 17 }, (_, i) => (
            <line key={i} x1="1080" y1="0" x2={-1200 + i * 300} y2="500" />
          ))}
          {[40, 100, 180, 290, 430].map((y) => (
            <line key={y} x1="0" y1={y} x2="1600" y2={y} strokeOpacity={0.03 + y / 12000} />
          ))}
        </g>
        {/* faixas de estrada do logótipo */}
        <g fill="url(#hero-stripe)">
          <polygon points="1060,10 1100,10 1210,500 950,500" />
          <polygon points="1010,10 1040,10 760,500 560,500" />
          <polygon points="1120,10 1150,10 1640,500 1440,500" />
        </g>
      </svg>
      {/* grelha de construção */}
      <div className="absolute inset-0 opacity-[0.045]">
        <div className="container-x grid h-full grid-cols-4 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-l border-paper last:border-r max-lg:[&:nth-child(n+5)]:hidden" />
          ))}
        </div>
      </div>
    </div>
  );
}
