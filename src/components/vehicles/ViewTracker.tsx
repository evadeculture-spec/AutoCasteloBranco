"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Regista a visualização de uma viatura (só envia com consentimento). */
export function ViewTracker({ vehicleId, name, price }: { vehicleId: string; name: string; price: number }) {
  useEffect(() => {
    track("view_vehicle", { vehicle_id: vehicleId, vehicle_name: name, value: price, currency: "EUR" });
  }, [vehicleId, name, price]);
  return null;
}
