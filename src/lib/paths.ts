const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a file in /public with the base path (needed for plain <img> and file links). */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
