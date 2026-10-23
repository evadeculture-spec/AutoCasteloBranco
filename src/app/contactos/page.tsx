import Link from "next/link";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactSubjectPreset } from "@/components/forms/ContactSubjectPreset";
import { EmailLink, PhoneLink, WhatsAppLink } from "@/components/ui/ContactLinks";
import { ArrowUpRight, Clock, Pin } from "@/components/ui/icons";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { site, PLACEHOLDER } from "@/config/site";
import { addressLines, mapsHref } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contactos",
  description:
    "Contacte a Auto Castelo Branco por telefone, email ou formulário. Morada e horário em Castelo Branco, para viaturas e oficina.",
  path: "/contactos",
});

export default function ContactPage() {
  const maps = mapsHref();
  const configured = Boolean(site.contact.phone || site.contact.email);

  return (
    <>
      <section aria-labelledby="contactos-title" className="container-x pt-14 pb-16 lg:pt-20 lg:pb-20">
        <SectionLabel className="text-muted">Contactos</SectionLabel>
        <h1 id="contactos-title" className="font-display mt-8 max-w-[16ch] text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] font-bold">
          Fale connosco.
        </h1>
        <p className="mt-6 max-w-xl text-[1.1rem] leading-relaxed text-muted">
          Para viaturas ou oficina: ligue, escreva ou deixe o seu pedido. Respondemos pelo meio que preferir.
        </p>
        {!configured && (
          <p className="label mt-8 inline-block border border-accent/40 px-2 py-1 text-accent">
            Contactos por configurar — ver .env.example
          </p>
        )}
      </section>

      <section aria-label="Contactos diretos" className="border-y border-ink/15">
        <div className="container-x grid divide-ink/15 md:grid-cols-3 md:divide-x">
          <div className="py-10 md:pr-10">
            <h2 className="label text-muted">Telefone e email</h2>
            <div className="mt-5 grid gap-3 text-[1.05rem]">
              <PhoneLink context="contact_page" className="font-display text-[1.5rem] font-semibold" />
              <EmailLink context="contact_page" className="link-line w-fit" />
              <WhatsAppLink context="contact_page" className="link-line w-fit" />
            </div>
          </div>
          <div className="border-t border-ink/15 py-10 md:border-t-0 md:px-10">
            <h2 className="label flex items-center gap-2 text-muted">
              <Pin size={16} /> Morada
            </h2>
            <address className="mt-5 text-[1.05rem] leading-relaxed not-italic">
              {addressLines().map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            {maps ? (
              <a href={maps} target="_blank" rel="noopener noreferrer" className="link-line mt-4 inline-flex items-center gap-1.5 font-semibold">
                Abrir no mapa <ArrowUpRight size={16} />
              </a>
            ) : (
              <p className="mt-4 text-[0.88rem] text-muted">O acesso ao mapa fica disponível quando a morada for validada.</p>
            )}
          </div>
          <div className="border-t border-ink/15 py-10 md:border-t-0 md:pl-10">
            <h2 className="label flex items-center gap-2 text-muted">
              <Clock size={16} /> Horário
            </h2>
            {site.openingHours.length ? (
              <ul className="mt-5 grid gap-1.5 text-[1.05rem]">
                {site.openingHours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[1.05rem] text-muted">{PLACEHOLDER.hours}</p>
            )}
          </div>
        </div>
      </section>

      <section id="formulario" aria-labelledby="formulario-title" className="container-x py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel index="01" className="text-muted">
              Formulário
            </SectionLabel>
            <h2 id="formulario-title" className="font-display mt-6 text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.05] font-bold">
              Envie-nos uma mensagem.
            </h2>
            <p className="mt-5 max-w-sm leading-relaxed text-muted">
              Para uma viatura concreta, use o botão “Pedir informação” na página da viatura — o pedido segue já identificado.
              Para marcações na oficina, use o{" "}
              <Link href="/oficina#marcacao" className="link-line font-semibold text-ink">
                formulário de marcação
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense fallback={<ContactForm />}>
              <ContactSubjectPreset />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
