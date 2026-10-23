import { SectionLabel } from "@/components/ui/SectionLabel";
import { site } from "@/config/site";

const steps = [
  {
    title: "Envie o seu pedido",
    text: `Por telefone, email${site.contact.whatsapp ? ", WhatsApp" : ""} ou formulário. Indique a viatura ou o serviço — o resto tratamos nós.`,
  },
  {
    title: "Confirmamos os detalhes",
    text: "Respondemos com a informação disponível, esclarecemos dúvidas e dizemos com franqueza o que ainda não sabemos.",
  },
  {
    title: "Combinamos a visita ou a marcação",
    text: "A data que sugerir é uma preferência. A visita ou a marcação só fica feita quando a confirmarmos consigo.",
  },
];

/** Processo de contacto — linha temporal com régua técnica. */
export function ContactProcess({ index, tone = "paper" }: { index?: string; tone?: "paper" | "graphite" }) {
  const dark = tone === "graphite";
  return (
    <section
      aria-labelledby="processo-title"
      className={dark ? "on-dark bg-graphite py-20 text-paper lg:py-28" : "border-t border-ink/10 bg-paper-2 py-20 lg:py-28"}
    >
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index={index} className={dark ? "text-metal" : "text-muted"}>
              Como funciona
            </SectionLabel>
            <h2 id="processo-title" className="font-display mt-6 text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.04] font-bold text-balance">
              Um contacto simples, sem compromisso.
            </h2>
          </div>
        </div>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="reveal">
              <div className="rule-ticks" aria-hidden="true" />
              <p className="label tabular mt-5 text-accent">Passo {String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-display mt-3 text-[1.35rem] leading-tight font-semibold">{s.title}</h3>
              <p className={`mt-3 leading-relaxed ${dark ? "text-metal" : "text-muted"}`}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
