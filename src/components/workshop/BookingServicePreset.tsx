"use client";

import { useSearchParams } from "next/navigation";
import { BookingForm } from "@/components/forms/BookingForm";
import { serviceOptions } from "@/data/services";

/** Pré-seleciona o serviço quando se chega a partir de "Marcar" (?servico=…). */
export function BookingServicePreset() {
  const requested = useSearchParams().get("servico") ?? "";
  const service = serviceOptions.some((o) => o.value === requested) ? requested : "";
  return <BookingForm key={service} defaultService={service} />;
}
