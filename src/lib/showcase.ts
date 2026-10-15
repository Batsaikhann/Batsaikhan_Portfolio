import type { Project } from "@/data/projects";

/** Only what the showcase renders — everything passed here is serialized into the page's HTML. */
export type ShowcaseProject = Pick<Project, "slug" | "number" | "title" | "year" | "category" | "status" | "description" | "stack" | "visual" | "shots">;

/** Trims a project to the fields and the two screenshots (desktop + phone) the showcase uses. */
export function toShowcaseProject(project: Project): ShowcaseProject {
  const { slug, number, title, year, category, status, description, stack, visual } = project;
  const shots = (["desktop", "mobile"] as const).flatMap((device) => project.shots.find((shot) => shot.device === device) ?? []);
  return { slug, number, title, year, category, status, description, stack: stack.slice(0, 6), visual, shots };
}
