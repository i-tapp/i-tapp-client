"use client";

import Link from "next/link";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

/**
 * The "share my details with companies" agreement on the student and corps
 * member signup forms. It has to be ticked to create an account.
 *
 * The backend records when it was ticked and which wording was shown
 * (SHARING_CONSENT_VERSION in i-tapp-backend). If the wording below changes in
 * a way that matters, bump that version too.
 */
export function ShareConsentField<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: Path<T>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                className="mt-0.5"
              />
            </FormControl>
            <div className="text-xs leading-relaxed text-gray-600">
              <FormLabel className="text-sm font-medium text-gray-800 cursor-pointer">
                I agree to share my details with companies
              </FormLabel>
              <p className="mt-1">
                When I apply for an opportunity, PlaceIT may send my name,
                email, phone number, school or NYSC details, CV and the answers
                I give in my application to the company I am applying to,
                including by email. I have read the{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-primary underline"
                >
                  Privacy Policy
                </Link>
                . I can ask PlaceIT to stop sharing my details at any time by
                contacting support@getplaceit.com.
              </p>
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
