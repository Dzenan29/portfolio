import type { Localized } from "@/i18n/config";

export type ProjectStatus =
  | "completed"
  | "operational"
  | "in-development"
  | "planned"
  | "verification-required";

export type ProjectCategory = "embedded" | "infrastructure" | "monitoring" | "software" | "hpc-ai";

/** flagship = full case study, supporting = shorter page, capability = summary of a skill area. */
export type ProjectTier = "flagship" | "supporting" | "capability";

export type Verification =
  /** Facts confirmed by Dzenan and cleared for publication. */
  | "verified"
  /** Content drafted from the brief; needs a final read by Dzenan before going public. */
  | "needs-review";

export type DemoId = "gauge" | "iot" | "infra" | "flow";

export type StageKind = "hardware" | "firmware" | "network" | "service" | "data" | "ui" | "ops";

export interface ArchitectureStage {
  id: string;
  kind: StageKind;
  label: Localized;
  detail: Localized;
  /** Mark stages that are designed but not implemented yet. */
  planned?: boolean;
}

export interface ImplementationBlock {
  title: Localized;
  items: Localized[];
  planned?: boolean;
}

export interface ProjectImage {
  src: string;
  alt: Localized;
  width: number;
  height: number;
  caption?: Localized;
}

export interface Project {
  id: string;
  slug: string;
  tier: ProjectTier;
  category: ProjectCategory;
  status: ProjectStatus;
  verification: Verification;
  /** Hard switch: false keeps the entry out of every page, the sitemap and metadata. */
  publish: boolean;
  featured?: boolean;
  context: "professional" | "independent";
  title: Localized;
  summary: Localized;
  /** One line each for featured cards. */
  problem?: Localized;
  solution?: Localized;
  role?: Localized;
  technologies: string[];
  challenge?: Localized;
  approach?: Localized[];
  architecture?: ArchitectureStage[];
  implementation?: ImplementationBlock[];
  challenges?: Localized[];
  outcomes?: Localized[];
  images?: ProjectImage[];
  demo?: DemoId;
  repository?: string;
  related?: string[];
  /** Internal note, never rendered. Explains what still needs checking. */
  reviewNote?: string;
}

export interface ExperienceEntry {
  id: string;
  role: Localized;
  organization: Localized;
  location: Localized;
  start: string; // YYYY or YYYY-MM
  end: string | null; // null = present
  focus: Localized[];
  technologies?: string[];
  verification: Verification;
  reviewNote?: string;
}

export type EvidenceLevel = "professional" | "project" | "exploring";

export interface SkillGroup {
  id: string;
  title: Localized;
  description: Localized;
  items: { name: string; level: EvidenceLevel }[];
  projects: string[];
}

export interface Domain {
  id: string;
  title: Localized;
  description: Localized;
  technologies: string[];
  projects: string[];
  glyph: "chip" | "stack" | "pulse" | "code" | "cluster" | "shield";
}
