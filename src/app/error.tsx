"use client";

import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-x py-20 lg:py-28">
      <p className="label text-muted">Erro</p>
      <h1 className="font-display mt-6 max-w-[18ch] text-[clamp(2.2rem,5vw,4.4rem)] leading-none font-bold">
        Algo não correu como previsto.
      </h1>
      <p className="mt-6 max-w-lg leading-relaxed text-muted">Tente novamente. Se o problema persistir, contacte-nos diretamente.</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-dark">
          Tentar novamente <ArrowRight size={18} />
        </button>
        <Link href="/contactos" className="btn btn-outline">
          Contactos <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
