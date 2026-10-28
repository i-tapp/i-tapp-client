// ---------------------------------------------------------------------------
// Sharing an opportunity outside PlaceIT (WhatsApp, Telegram, email, ...).
//
// The link points at the PUBLIC opportunities page, not a /portal route, so it
// opens for someone who isn't signed in:
//
//   https://www.getplaceit.com/opportunities?type=ppa&o=<opportunity id>
//
// /opportunities reads `type` and `o` and opens that listing's detail dialog
// (see app/(site)/opportunities/_molecules/browse.tsx). The link carries only
// the opportunity id - nothing about who shared it or how many people applied.
// ---------------------------------------------------------------------------

export type ShareableOpportunity = {
  id: string;
  title?: string | null;
  companyName?: string | null;
  program?: "ppa" | "siwes";
};

const PRODUCTION_ORIGIN = "https://www.getplaceit.com";

function siteOrigin(): string {
  if (typeof window === "undefined") return PRODUCTION_ORIGIN;
  const { origin, hostname } = window.location;
  // A link copied from localhost or a Vercel preview would be dead for
  // everyone it is sent to, so always hand out the real site.
  if (hostname === "localhost" || hostname.endsWith(".vercel.app")) {
    return PRODUCTION_ORIGIN;
  }
  return origin;
}

export function opportunityShareUrl(o: ShareableOpportunity): string {
  const params = new URLSearchParams({
    type: o.program ?? "ppa",
    o: o.id,
  });
  return `${siteOrigin()}/opportunities?${params.toString()}`;
}

export function opportunityShareText(o: ShareableOpportunity): string {
  const what = o.title?.trim() || "an opportunity";
  const where = o.companyName?.trim() ? ` at ${o.companyName.trim()}` : "";
  const label = o.program === "siwes" ? "SIWES placement" : "NYSC PPA opportunity";
  return `${what}${where} - ${label} on PlaceIT. Apply here:`;
}

export function whatsappShareUrl(o: ShareableOpportunity): string {
  const text = `${opportunityShareText(o)} ${opportunityShareUrl(o)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function telegramShareUrl(o: ShareableOpportunity): string {
  const params = new URLSearchParams({
    url: opportunityShareUrl(o),
    text: opportunityShareText(o),
  });
  return `https://t.me/share/url?${params.toString()}`;
}

export function emailShareUrl(o: ShareableOpportunity): string {
  const subject = `${o.title?.trim() || "Opportunity"} on PlaceIT`;
  const body = `${opportunityShareText(o)}\n\n${opportunityShareUrl(o)}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** True where the browser can open the phone's own share sheet. */
export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export type NativeShareResult = "shared" | "cancelled" | "failed";

/**
 * Opens the system share sheet. Must run straight from a click: browsers
 * refuse navigator.share() without a user gesture.
 */
export async function nativeShare(o: ShareableOpportunity): Promise<NativeShareResult> {
  try {
    await navigator.share({
      title: o.title?.trim() || "PlaceIT opportunity",
      text: opportunityShareText(o),
      url: opportunityShareUrl(o),
    });
    return "shared";
  } catch (err) {
    // Closing the sheet without choosing an app is not an error.
    if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
    return "failed";
  }
}

/** Copies the link. Returns false if the browser blocked it. */
export async function copyShareLink(o: ShareableOpportunity): Promise<boolean> {
  const url = opportunityShareUrl(o);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // fall through to the textarea route below
  }
  try {
    const el = document.createElement("textarea");
    el.value = url;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
