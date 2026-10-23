import Link from "next/link";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CarRender } from "@/components/brand/CarRender";
import { ArrowRight } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre nós",
  description:
    "A Auto Castelo Branco: comércio de viaturas usadas e oficina em Castelo Branco, com transparência na relação comercial e rigor na apresentação de cada viatura.",
  path: "/sobre-nos",
});

/*
 * Página institucional. Não contém história, datas, números ou distinções:
 * esses dados devem ser fornecidos e confirmados pelo proprietário
 * (ver secção "Dados por confirmar" no README).
 */

const commitments = [
  {
    n: "01",
    title: "Compromisso com o cliente",
    text: "Quem nos procura está a tomar uma decisão importante — comprar um automóvel ou confiar-nos o que já tem. Respondemos com tempo, com clareza e sem pressão.",
  },
  {
    n: "02",
    title: "Transparência comercial",
    text: "O preço está à vista. As condições são explicadas antes, não depois. E o que não sabemos sobre uma viatura dizemos que não sabemos.",
  },
  {
    n: "03",
    title: "Rigor na apresentação",
    text: "Cada viatura é apresentada com fotografias e dados verificados. Uma especificação por confirmar aparece identificada — nunca estimada.",
  },
  {
    n: "04",
    title: "A manutenção como cuidado",
    text: "Um automóvel bem mantido é mais seguro, mais fiável e vale mais. A oficina existe para isso: prevenir antes de reparar.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section aria-labelledby="sobre-title" className="container-x pt-14 pb-20 lg:pt-20 lg:pb-28">
        <SectionLabel className="text-muted">Sobre nós</SectionLabel>
        <h1
          id="sobre-title"
          className="font-display mt-8 max-w-[18ch] text-[clamp(2.6rem,6.4vw,6rem)] leading-[0.98] font-bold text-balance"
        >
          Uma casa automóvel de Castelo Branco.
        </h1>
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <p className="font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.3] font-medium lg:col-span-6">
            Vendemos viaturas usadas e cuidamos de automóveis. Duas atividades que pedem o mesmo: conhecimento técnico e
            honestidade na relação com quem nos procura.
          </p>
          <div className="grid gap-5 text-[1.05rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8">
            <p>
              Trabalhamos para quem vive e conduz na região de Castelo Branco — pessoas que precisam de um automóvel em que
              possam confiar, e de alguém que o mantenha assim.
            </p>
            <p>
              Não acreditamos em letra pequena nem em promessas vagas. Preferimos mostrar a informação completa e deixar que
              cada cliente decida com tempo.
            </p>
          </div>
        </div>
      </section>

      {/* Faixa panorâmica */}
      <section aria-hidden="true" className="relative overflow-hidden bg-ink py-16 lg:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-6xl">
            <CarRender type="berlina" />
          </div>
        </div>
      </section>

      <section aria-labelledby="compromissos-title" className="container-x py-20 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <SectionLabel index="01" className="text-muted">
                Princípios
              </SectionLabel>
              <h2 id="compromissos-title" className="font-display mt-6 text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] font-bold">
                Aquilo com que nos comprometemos.
              </h2>
            </div>
          </div>
          <ol className="border-t border-ink/15 lg:col-span-7 lg:col-start-6">
            {commitments.map((c) => (
              <li key={c.n} className="reveal grid gap-3 border-b border-ink/15 py-9 sm:grid-cols-[4rem_1fr]">
                <span className="label tabular pt-2 text-accent">{c.n}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.8rem)] font-semibold">{c.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-muted">{c.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="regiao-title" className="border-t border-ink/10 bg-paper-2">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <SectionLabel index="02" className="text-muted">
              Região
            </SectionLabel>
            <h2 id="regiao-title" className="font-display mt-6 text-[clamp(2rem,3.6vw,3rem)] leading-[1.04] font-bold text-balance">
              Perto de quem conduz na Beira Baixa.
            </h2>
          </div>
          <div className="grid gap-6 text-[1.05rem] leading-relaxed text-muted lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p>
              Numa região onde o automóvel é indispensável no dia a dia, a proximidade importa: poder ver a viatura com calma,
              falar com quem a conhece e ter a quem recorrer depois da compra.
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Link href="/viaturas" className="link-line inline-flex items-center gap-2 font-semibold text-ink">
                Ver viaturas <ArrowRight size={18} />
              </Link>
              <Link href="/contactos" className="link-line inline-flex items-center gap-2 font-semibold text-ink">
                Como chegar <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClosingCta title="Fale connosco. Respondemos com clareza." context="about_cta" />
    </>
  );
}
