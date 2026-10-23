"use client";

import { useId } from "react";
import { ConsentField, Field, FormStatus, Honeypot, SubmitButton, SuccessPanel, fieldProps } from "./Fields";
import { useLeadForm } from "./useLeadForm";

/**
 * Pedido de informação sobre uma viatura. A viatura é identificada
 * automaticamente — o visitante não precisa de a descrever.
 */
export function VehicleEnquiryForm({ vehicleId, vehicleLabel }: { vehicleId: string; vehicleLabel: string }) {
  const uid = useId();
  const { values, errors, state, set, submit, reset, formRef } = useLeadForm(
    {
      kind: "viatura",
      name: "",
      phone: "",
      email: "",
      message: "",
      consent: false,
      vehicleId,
      vehicleLabel,
      website: "",
    },
    "vehicle_enquiry_submit",
    { vehicle_id: vehicleId },
  );

  if (state.status === "success")
    return (
      <SuccessPanel title="Pedido recebido." delivered={state.delivered} onReset={reset}>
        Obrigado. Entraremos em contacto sobre o <strong>{vehicleLabel}</strong> pelo meio que indicou.
      </SuccessPanel>
    );

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="relative grid gap-5">
      <div className="border-l-2 border-accent bg-current/[0.04] px-4 py-3">
        <p className="label text-[0.62rem] opacity-60">Viatura</p>
        <p className="mt-1 font-semibold">{vehicleLabel}</p>
      </div>

      <Field id={`${uid}-name`} label="Nome" error={errors.name}>
        <input
          {...fieldProps(`${uid}-name`, errors.name)}
          className="field"
          autoComplete="name"
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
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
      </div>
      <p className="-mt-2 text-[0.82rem] opacity-65">Basta um dos dois: telefone ou email.</p>
      <Field id={`${uid}-message`} label="Mensagem" optional error={errors.message}>
        <textarea
          {...fieldProps(`${uid}-message`, errors.message)}
          className="field"
          rows={4}
          placeholder="Ex.: gostaria de saber se aceitam retoma ou de agendar uma visita."
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </Field>
      <ConsentField id={`${uid}-consent`} checked={values.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
      <Honeypot value={values.website ?? ""} onChange={(v) => set("website", v)} />
      <FormStatus state={state} />
      <div>
        <SubmitButton state={state}>Pedir informação</SubmitButton>
      </div>
    </form>
  );
}
