"use client";

import { useId, useSyncExternalStore } from "react";
import { ConsentField, Field, FormStatus, Honeypot, SubmitButton, SuccessPanel, fieldProps } from "./Fields";
import { useLeadForm } from "./useLeadForm";
import { serviceOptions } from "@/data/services";
import { todayISO } from "@/lib/leads";

const noopSubscribe = () => () => {};

/**
 * Pedido de marcação na oficina. Recolhe só o necessário.
 * A data é uma preferência — a marcação só fica confirmada pela empresa.
 */
export function BookingForm({ defaultService = "" }: { defaultService?: string }) {
  const uid = useId();
  // A data de hoje só é calculada no browser (o servidor valida-a de novo no envio).
  const today = useSyncExternalStore(noopSubscribe, todayISO, () => undefined);
  const { values, errors, state, set, submit, reset, formRef } = useLeadForm(
    {
      kind: "marcacao",
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
      carMakeModel: "",
      service: defaultService,
      preferredDate: "",
      website: "",
    },
    "workshop_booking_submit",
  );

  if (state.status === "success")
    return (
      <SuccessPanel title="Pedido de marcação recebido." delivered={state.delivered} onReset={reset}>
        A data indicada fica registada como preferência. A marcação só fica confirmada quando entrarmos em contacto
        consigo para acertar o dia e a hora.
      </SuccessPanel>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Nome" error={errors.name} className="sm:col-span-2">
          <input
            {...fieldProps(`${uid}-name`, errors.name)}
            className="field"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field id={`${uid}-phone`} label="Telefone" error={errors.phone}>
          <input
            {...fieldProps(`${uid}-phone`, errors.phone)}
            className="field tabular"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field id={`${uid}-email`} label="Email" error={errors.email}>
          <input
            {...fieldProps(`${uid}-email`, errors.email)}
            className="field"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <p className="-mt-2 text-[0.82rem] opacity-65 sm:col-span-2">Basta um dos dois: telefone ou email.</p>

        <Field id={`${uid}-car`} label="Marca e modelo do veículo" error={errors.carMakeModel} hint="Ex.: Renault Clio, 2017" className="sm:col-span-2">
          <input
            {...fieldProps(`${uid}-car`, errors.carMakeModel, "Ex.: Renault Clio, 2017")}
            className="field"
            value={values.carMakeModel}
            onChange={(e) => set("carMakeModel", e.target.value)}
          />
        </Field>
        <Field id={`${uid}-service`} label="Serviço pretendido" error={errors.service}>
          <select
            {...fieldProps(`${uid}-service`, errors.service)}
            className="field"
            value={values.service}
            onChange={(e) => set("service", e.target.value)}
          >
            <option value="" disabled>
              Escolher…
            </option>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${uid}-date`} label="Data preferencial" error={errors.preferredDate} hint="Sujeita a confirmação.">
          <input
            {...fieldProps(`${uid}-date`, errors.preferredDate, "Sujeita a confirmação.")}
            className="field tabular"
            type="date"
            min={today}
            value={values.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
          />
        </Field>
        <Field id={`${uid}-message`} label="Descrição" optional error={errors.message} className="sm:col-span-2">
          <textarea
            {...fieldProps(`${uid}-message`, errors.message)}
            className="field"
            rows={3}
            placeholder="Ex.: luz de aviso acesa no painel, ruído ao travar…"
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </Field>
      </div>
      <ConsentField id={`${uid}-consent`} checked={values.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
      <Honeypot value={values.website ?? ""} onChange={(v) => set("website", v)} />
      <FormStatus state={state} />
      <div>
        <SubmitButton state={state} tone="light">
          Pedir marcação
        </SubmitButton>
      </div>
    </form>
  );
}
