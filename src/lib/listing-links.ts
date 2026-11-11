/**
 * Server-side lookup for the claim / remove pages behind the links in
 * application emails. The token in the link is checked by the backend.
 */
export type ListingLinkSummary = {
  title: string;
  companyName: string | null;
  applicantCount: number;
  alreadyRemoved: boolean;
  claimed: boolean;
};

export async function fetchListingSummary(
  id: string,
  token: string | undefined,
  action: "claim" | "remove",
): Promise<ListingLinkSummary | null> {
  if (!token) return null;
  const base = process.env.NEXT_PUBLIC_APP_BACKEND_API_URL;
  try {
    const res = await fetch(
      `${base}/listing-links/${encodeURIComponent(id)}/summary?t=${encodeURIComponent(token)}&action=${action}`,
      {
        headers: { "G-PlaceIT-build": process.env.NEXT_PUBLIC_BUILD_KEY ?? "" },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as ListingLinkSummary;
  } catch {
    return null;
  }
}
