import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ProjectStatus as Status } from "@/content/types";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, index }: { children: React.ReactNode; index?: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fg-subtle">
      {index && <span className="text-accent">{index}</span>}
      <span aria-hidden className="h-px w-6 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  id,
  as: Tag = "h2",
  className = "",
}: {
  eyebrow?: string;
  index?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`reveal max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
      <Tag
        id={id}
        className={`mt-5 text-balance font-semibold tracking-[-0.03em] ${
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
        }`}
      >
        {title}
      </Tag>
      {lead && <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">{lead}</p>}
    </div>
  );
}

const statusStyle: Record<Status, { dot: string; ring: string }> = {
  completed: { dot: "bg-teal", ring: "border-teal/30 text-teal" },
  operational: { dot: "bg-accent anim-pulse", ring: "border-accent/30 text-accent" },
  "in-development": { dot: "bg-warn", ring: "border-warn/30 text-warn" },
  planned: { dot: "border border-fg-subtle bg-transparent", ring: "border-line-strong text-fg-muted" },
  "verification-required": { dot: "bg-fg-subtle", ring: "border-line-strong text-fg-subtle" },
};

/** Status is shown with text and shape, never by color alone. */
export function ProjectStatus({ status, label, size = "sm" }: { status: Status; label: string; size?: "sm" | "md" }) {
  const s = statusStyle[status];
  return (
    <span
      data-status={status}
      className={`inline-flex items-center gap-2 rounded-full border bg-bg/40 font-mono uppercase tracking-wider ${s.ring} ${
        size === "md" ? "px-3 py-1.5 text-[11px]" : "px-2.5 py-1 text-[10px]"
      }`}
    >
      <span aria-hidden className={`size-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}

export function TechList({ items, max, label }: { items: string[]; max?: number; label?: string }) {
  const shown = max ? items.slice(0, max) : items;
  const rest = max ? items.length - shown.length : 0;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {shown.map((t) => (
        <li key={t} className="rounded-md border border-line bg-surface-2/60 px-2 py-1 font-mono text-[11px] text-fg-muted">
          {t}
        </li>
      ))}
      {rest > 0 && <li className="px-1 py-1 font-mono text-[11px] text-fg-subtle">+{rest}</li>}
    </ul>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-accent text-accent-ink hover:bg-accent-strong",
    secondary: "border border-line-strong text-fg hover:border-fg-subtle hover:bg-surface",
    ghost: "text-fg hover:text-accent px-0",
  }[variant];
  const cls = `group inline-flex min-h-11 items-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors ${styles} ${className}`;
  const Icon = external ? ArrowUpRight : ArrowRight;
  const icon = <Icon aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />;
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        {icon}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {icon}
    </Link>
  );
}

export function SimulatedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-warn/30 bg-warn-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">
      <span aria-hidden className="size-1 rounded-full bg-warn" />
      {label}
    </span>
  );
}

export function PageHeader({ eyebrow, title, lead, children }: { eyebrow: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="bg-grid mask-fade-b pointer-events-none absolute inset-0" />
      <Container className="relative pb-14 pt-16 sm:pb-20 sm:pt-24">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} lead={lead} />
        {children}
      </Container>
    </div>
  );
}
