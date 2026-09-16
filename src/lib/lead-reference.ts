export function leadReference(id: string): string {
  return `DLB-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}
