import Link from "next/link";
import { Suspense } from "react";
import { BookingForm } from "@/components/forms/BookingForm";
import { EmailLink, PhoneLink, WhatsAppLink } from "@/components/ui/ContactLinks";
import { ArrowRight } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BookingServicePreset } from "@/components/workshop/BookingServicePreset";
import { InspectionDiagram } from "@/components/workshop/InspectionDiagram";
import { services } from "@/data/services";
import { site, PLACEHOLDER } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Oficina automóvel em Castelo Branco",
  description:
    "Oficina da Auto Castelo Branco: manutenção preventiva, revisão, diagnóstico, travagem e pneus. Peça a sua marcação online ou por telefone.",
  path: "/oficina",
});

const bookingSteps = [
  {
    title: "Envie o pedido",
    text: "Indique o veículo, o serviço e uma data que lhe convenha. Se não souber qual o serviço, descreva o que nota.",
  },
  {
    title: "Confirmamos consigo",
    text: "Entramos em contacto para acertar o dia e a hora. A data indicada no formulário é apenas uma preferência.",
  },
  {
    title: "Marcação confirmada",
    text: "Só nesse momento a marcação fica feita. Se precisar de alterar, basta avisar-nos.",
  },
];

export default function WorkshopPage() {
  const pending = services.some((s) => !s.confirmed);

  return (
    <div className="on-dark bg-graphite text-paper">
      {/* ---------- Hero ---------- */}
      <section aria-labelledby="oficina-title" className="relative isolate overflow-hidden bg-ink">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(55% 60% at 70% 62%, rgba(207,203,196,0.10) 0%, rgba(17,18,19,0) 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#f3f0eb 1px, transparent 1px), linear-gradient(90deg, #f3f0eb 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="container-x grid gap-12 pt-[calc(var(--header-h)+3rem)] pb-16 lg:grid-cols-12 lg:pt-[calc(var(--header-h)+5rem)] lg:pb-24">
          <div className="lg:col-span-5">
            <SectionLabel className="anim-rise text-metal">Assistência técnica</SectionLabel>
            <h1 id="oficina-title" className="anim-rise mt-6" style={{ ["--delay" as string]: "120ms" }}>
              <span className="font-display-wide block text-[clamp(3.2rem,8vw,7rem)] leading-[0.9] font-extrabold">Oficina</span>
              <span className="font-display mt-5 block text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.15] font-semibold text-mist">
                Manutenção, revisão e diagnóstico. Com método e com o trabalho explicado.
              </span>
            </h1>
            <div className="anim-rise mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row" style={{ ["--delay" as string]: "260ms" }}>
              <a href="#marcacao" className="btn btn-primary">
                Pedir marcação <ArrowRight size={18} />
              </a>
              <a href="#servicos" className="btn btn-outline">
                Ver serviços <ArrowRight size={18} />
              </a>
            </div>
            <div className="anim-rise mt-8 text-[1.05rem]" style={{ ["--delay" as string]: "360ms" }}>
              <PhoneLink context="workshop_hero" className="link-line font-semibold" />
            </div>
          </div>
          <div className="self-end lg:col-span-7 lg:-mr-[4%] lg:pb-4">
            <InspectionDiagram />
          </div>
        </div>
      </section>

      {/* ---------- Serviços ---------- */}
      <section id="servicos" aria-labelledby="servicos-title" className="container-x py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="01" className="text-metal">
              Serviços
            </SectionLabel>
            <h2 id="servicos-title" className="font-display mt-6 text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.04] font-bold text-balance">
              O que pode tratar connosco.
            </h2>
          </div>
          <p className="max-w-lg text-[1.05rem] leading-relaxed text-mist lg:col-span-6 lg:col-start-7 lg:pt-14">
            Cada intervenção começa pela verificação e pela explicação do que é necessário. Não avançamos com trabalho que não
            tenha sido combinado consigo.
          </p>
        </div>

        <div className="mt-14 border-t border-steel">
          {services.map((s) => (
            <article key={s.id} className="reveal grid gap-4 border-b border-steel py-8 md:grid-cols-12 md:gap-8">
              <p className="label tabular text-accent-light md:col-span-1 md:pt-2">{s.code}</p>
              <div className="md:col-span-5">
                <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.8rem)] leading-tight font-semibold">{s.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-metal">{s.summary}</p>
              </div>
              <ul className="grid content-start gap-2 text-[0.95rem] text-mist md:col-span-4 md:col-start-7 md:pt-2">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-metal" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="md:col-span-2 md:pt-1.5 md:text-right">
                <Link
                  href={`/oficina?servico=${s.id}#marcacao`}
                  className="link-line inline-flex items-center gap-1.5 text-[0.9rem] font-semibold"
                >
                  Marcar<span className="sr-only">: {s.title}</span> <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        {pending && (
          <p className="label mt-6 leading-relaxed text-metal">
            Lista demonstrativa: serviços, âmbito e meios técnicos sujeitos a confirmação pela empresa.
          </p>
        )}
      </section>

      {/* ---------- Manutenção preventiva ---------- */}
      <section aria-labelledby="preventiva-title" className="on-light bg-paper text-ink">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <SectionLabel index="02" className="text-muted">
              Manutenção preventiva
            </SectionLabel>
            <h2 id="preventiva-title" className="font-display mt-6 text-[clamp(2rem,4vw,3.4rem)] leading-[1.03] font-bold text-balance">
              A manutenção que se adia é a que sai mais cara.
            </h2>
          </div>
          <div className="grid gap-6 text-[1.05rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p>
              Óleo, filtros, correias, travões, pneus: os componentes de desgaste avisam pouco antes de falhar. Cumprir os
              intervalos definidos pelo fabricante — no livro de manutenção da sua viatura — é a forma mais simples de evitar
              avarias e reparações maiores.
            </p>
            <p>
              Se não sabe quando foi feita a última revisão, ou se o seu automóvel mudou de comportamento, comece por aí: diga-nos
              o que nota e verificamos.
            </p>
            <a href="#marcacao" className="link-line inline-flex w-fit items-center gap-2 font-semibold text-ink">
              Pedir uma verificação <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Como funciona a marcação ---------- */}
      <section aria-labelledby="marcacao-processo-title" className="container-x py-20 lg:py-28">
        <SectionLabel index="03" className="text-metal">
          Pedido de marcação
        </SectionLabel>
        <h2 id="marcacao-processo-title" className="font-display mt-6 max-w-[20ch] text-[clamp(2rem,3.8vw,3.2rem)] leading-[1.04] font-bold">
          Três passos, sem surpresas.
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {bookingSteps.map((s, i) => (
            <li key={s.title} className="reveal">
              <div className="rule-ticks" aria-hidden="true" />
              <p className="label tabular mt-5 text-accent-light">Passo {String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display mt-3 text-[1.35rem] font-semibold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-metal">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Formulário de marcação ---------- */}
      <section id="marcacao" aria-labelledby="marcacao-title" className="border-t border-steel bg-ink">
        <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <SectionLabel index="04" className="text-metal">
              Marcação
            </SectionLabel>
            <h2 id="marcacao-title" className="font-display mt-6 text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] font-bold">
              Pedir marcação
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-mist">
              Preencha o essencial. Confirmamos o dia e a hora consigo antes de a marcação ficar feita.
            </p>

            <div className="mt-12 grid gap-4 border-t border-steel pt-8 text-[1rem]">
              <p className="label text-metal">Contacto direto da oficina</p>
              <PhoneLink context="workshop_booking" className="font-display text-[1.4rem] font-semibold" />
              <EmailLink context="workshop_booking" subject="Pedido de marcação — oficina" className="text-mist hover:text-paper" />
              <WhatsAppLink context="workshop_booking" message="Olá, gostaria de pedir uma marcação na oficina." className="text-mist hover:text-paper" />
              <p className="text-[0.92rem] text-metal">
                {site.openingHours.length ? site.openingHours.join(" · ") : PLACEHOLDER.hours}
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<BookingForm />}>
              <BookingServicePreset />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
