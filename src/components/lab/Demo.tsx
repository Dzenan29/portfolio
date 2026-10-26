import type { DemoId } from "@/content/types";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { AvailabilityFlow } from "./AvailabilityFlow";
import { InfrastructureTopology } from "./InfrastructureTopology";
import { InteractiveGauge } from "./InteractiveGauge";
import { SimulatedSensorDashboard } from "./SimulatedSensorDashboard";

/** Renders one Engineering Lab demo with only the strings it needs (keeps client payloads small). */
export function Demo({ id, locale, dict }: { id: DemoId; locale: Locale; dict: Dictionary }) {
  const c = dict.common;
  switch (id) {
    case "gauge":
      return <InteractiveGauge labels={{ ...dict.lab.gauge, simulated: c.simulated, reset: c.reset }} />;
    case "iot":
      return <SimulatedSensorDashboard labels={{ ...dict.lab.iot, simulated: c.simulated, pause: c.pause, resume: c.resume, reset: c.reset }} />;
    case "infra":
      return <InfrastructureTopology locale={locale} labels={{ ...dict.lab.infra, simulated: c.simulated, conceptual: c.conceptual }} />;
    case "flow":
      return <AvailabilityFlow locale={locale} labels={{ ...dict.lab.flow, simulated: c.simulated, reset: c.reset }} />;
  }
}

export function demoTitle(id: DemoId, dict: Dictionary): string {
  return { gauge: dict.lab.gauge.title, iot: dict.lab.iot.title, infra: dict.lab.infra.title, flow: dict.lab.flow.title }[id];
}
