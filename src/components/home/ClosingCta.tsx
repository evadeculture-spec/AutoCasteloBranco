import Link from "next/link";
import { EmailLink, PhoneLink, WhatsAppLink } from "@/components/ui/ContactLinks";
import { ArrowRight } from "@/components/ui/icons";
import { CarElevation } from "@/components/brand/CarElevation";

export function ClosingCta({
  title = "Tem uma viatura em vista ou um serviço por marcar?",
  context = "closing_cta",
}: {
  title?: string;
  context?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="on-dark relative isolate overflow-hidden bg-ink text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute -right-[18%] bottom-[-12%] -z-10 w-[85%] opacity-[0.16] lg:w-[60%]">
        <CarElevation type="hatchback" />
      </div>
      <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <h2 id="cta-title" className="font-display text-[clamp(2.1rem,4.8vw,4.4rem)] leading-[1.02] font-bold text-balance">
            {title}
          </h2>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contactos#formulario" className="btn btn-primary sm:min-w-56">
              Enviar pedido <ArrowRight size={18} />
            </Link>
            <Link href="/viaturas" className="btn btn-outline sm:min-w-56">
              Ver viaturas <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-4 text-[1.05rem] lg:col-span-4 lg:col-start-9">
          <p className="label text-metal">Contacto direto</p>
          <PhoneLink context={context} className="font-display text-[1.5rem] font-semibold" />
          <EmailLink context={context} className="text-mist hover:text-paper" />
          <WhatsAppLink context={context} className="text-mist hover:text-paper" />
        </div>
      </div>
    </section>
  );
}
