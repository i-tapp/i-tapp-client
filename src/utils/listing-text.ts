/** Free text from a listing (requirements, benefits) as clean text, or "". */
export function listingText(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((v) => String(v).trim())
      .filter(Boolean)
      .join("\n");
  }
  return typeof value === "string" ? value.trim() : "";
}
