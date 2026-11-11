import type { Metadata } from "next";
import { Wrapper } from "@/components/wrapper";
import { fetchListingSummary } from "@/lib/listing-links";
import { RemoveListingActions } from "./_molecules/remove-actions";

export const metadata: Metadata = {
  title: "Remove a listing",
  robots: { index: false, follow: false },
};

export default async function RemoveListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { id } = await params;
  const { t } = await searchParams;
  const summary = await fetchListingSummary(id, t, "remove");

  return (
    <Wrapper className="py-16 flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
        {summary ? (
          <RemoveListingActions id={id} token={t!} summary={summary} />
        ) : (
          <>
            <h1 className="text-lg font-bold">This link isn&apos;t valid</h1>
            <p className="mt-2 text-sm text-gray-500">
              It may have been copied incorrectly. Please use the link in the
              original email, or write to support@getplaceit.com and we&apos;ll
              help.
            </p>
          </>
        )}
      </div>
    </Wrapper>
  );
}
