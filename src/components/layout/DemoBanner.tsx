import { site } from "@/config/site";

/** Faixa permanente enquanto o site estiver em modo de demonstração. */
export function DemoBanner() {
  if (!site.demoMode) return null;
  return (
    <div className="relative z-[60] bg-ink text-mist">
      <p className="container-x flex items-center gap-3 py-2 text-[0.78rem] leading-snug">
        <span className="label shrink-0 bg-accent px-1.5 py-0.5 text-[0.62rem] tracking-[0.18em] text-white">Demo</span>
        <span>
          Versão de demonstração. Viaturas, preços e serviços são exemplos fictícios; contactos por configurar.
        </span>
      </p>
    </div>
  );
}
