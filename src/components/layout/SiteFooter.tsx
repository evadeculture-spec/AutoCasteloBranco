import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { EmailLink, PhoneLink, WhatsAppLink } from "@/components/ui/ContactLinks";
import { ArrowUpRight } from "@/components/ui/icons";
import { nav, site, PLACEHOLDER } from "@/config/site";
import { addressLines, mapsHref } from "@/lib/contact";

/** Ano corrente, guardado em cache (o rodapé continua estático). */
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const maps = mapsHref();
  const year = await currentYear();

  return (
    <footer className="on-dark overflow-hidden bg-ink pb-24 text-mist lg:pb-0">
      <div className="container-x">
        {/* Assinatura: o nome à largura total, a régua técnica por baixo. */}
        <p
          aria-hidden="true"
          className="font-display-wide pt-16 text-[min(5.8vw,5.65rem)] leading-[0.85] font-extrabold tracking-[-0.045em] whitespace-nowrap text-paper uppercase md:pt-24"
        >
          Auto Castelo Branco<span className="text-accent">.</span>
        </p>
        <div className="rule-ticks mt-6 text-paper" aria-hidden="true" />
        <div className="grid gap-12 border-b border-steel py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-5">
            <Link href="/" className="text-paper">
              <Logo />
              <span className="sr-only"> — página inicial</span>
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-metal">
              Comércio de viaturas usadas e oficina automóvel em {site.address.locality}.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <h2 className="label text-metal">Navegação</h2>
            <ul className="mt-5 grid gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line text-paper/90 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="label text-metal">Contactos</h2>
            <address className="mt-5 grid gap-3 text-[0.95rem] not-italic text-paper/90">
              <PhoneLink context="footer" className="hover:text-paper" />
              <EmailLink context="footer" className="hover:text-paper" />
              <WhatsAppLink context="footer" className="hover:text-paper" />
              <span className="mt-2 leading-relaxed text-metal">
                {addressLines().map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              {maps && (
                <a href={maps} target="_blank" rel="noopener noreferrer" className="link-line inline-flex w-fit items-center gap-1.5 text-paper">
                  Ver no mapa <ArrowUpRight size={16} />
                </a>
              )}
              <span className="text-metal">
                {site.openingHours.length ? site.openingHours.join(" · ") : PLACEHOLDER.hours}
              </span>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 py-8 text-[0.82rem] text-metal md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legal.name ?? site.name}
            {site.legal.nif ? ` · NIF ${site.legal.nif}` : " · Identificação legal por configurar"}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/privacidade" className="link-line hover:text-paper">
                Política de privacidade
              </Link>
            </li>
            <li>
              <a
                href="https://www.livroreclamacoes.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="link-line hover:text-paper"
              >
                Livro de Reclamações Eletrónico
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
