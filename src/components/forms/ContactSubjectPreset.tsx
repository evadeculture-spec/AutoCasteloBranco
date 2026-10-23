"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "./ContactForm";

/** Pré-seleciona o assunto a partir de ?assunto=… (ex.: vindo do inventário). */
export function ContactSubjectPreset() {
  const subject = useSearchParams().get("assunto") ?? undefined;
  return <ContactForm key={subject ?? "default"} defaultSubject={subject} />;
}
