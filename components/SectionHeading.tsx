import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  label,
  title,
  lead,
}: {
  index: string;
  label: string;
  title: ReactNode;
  lead?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="label-mono mb-4">
        <span className="text-steel-dim">{index} /</span> {label}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
        {title}
      </h2>
      {lead && (
        <p className="mt-5 text-lg leading-relaxed text-muted">{lead}</p>
      )}
    </Reveal>
  );
}
