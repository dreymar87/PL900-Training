export function vendorPath(vendorSlug: string): string {
  return `/cert/${vendorSlug}`;
}

export function certPath(vendorSlug: string, certSlug: string): string {
  return `/cert/${vendorSlug}/${certSlug}`;
}

export function modulePath(
  vendorSlug: string,
  certSlug: string,
  moduleSlug: string
): string {
  return `/cert/${vendorSlug}/${certSlug}/${moduleSlug}`;
}
