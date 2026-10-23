import Link from "next/link";
import { CarElevation } from "@/components/brand/CarElevation";
import { ArrowRight } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <section className="container-x py-20 lg:py-28">
      <p className="label tabular text-muted">Erro 404</p>
      <h1 className="font-display mt-6 max-w-[16ch] text-[clamp(2.4rem,5.6vw,5rem)] leading-[0.98] font-bold">
        Esta página saiu de circulação.
      </h1>
      <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-muted">
        O endereço pode estar incorreto, ou a viatura que procurava já não está disponível.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/viaturas" className="btn btn-dark">
          Ver viaturas disponíveis <ArrowRight size={18} />
        </Link>
        <Link href="/" className="btn btn-outline">
          Página inicial <ArrowRight size={18} />
        </Link>
      </div>
      <div className="mt-16 max-w-3xl opacity-30" aria-hidden="true">
        <CarElevation type="hatchback" tone="dark" />
      </div>
    </section>
  );
}
