"use client";

import { useState } from "react";
import { Link2, Mail, MessageCircle, Send, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/tailwind";
import {
  canNativeShare,
  copyShareLink,
  emailShareUrl,
  nativeShare,
  telegramShareUrl,
  whatsappShareUrl,
  type ShareableOpportunity,
} from "@/lib/share-opportunity";

type Props = {
  opportunity: ShareableOpportunity;
  /** "icon" is a bare icon for cards and headers; "button" shows a label. */
  variant?: "icon" | "button";
  className?: string;
};

const itemClass =
  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer";

/**
 * Share an opportunity outside the platform.
 *
 * On a phone browser this opens the system share sheet (WhatsApp, Telegram,
 * SMS ... whatever is installed). Where the browser has no share sheet - most
 * desktops and the Android app's WebView - it opens a small menu with
 * WhatsApp, Telegram, email and copy-link instead, so there is always a way.
 */
export function ShareOpportunityButton({
  opportunity,
  variant = "icon",
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const copy = async () => {
    const ok = await copyShareLink(opportunity);
    if (ok) toast.success("Link copied");
    else toast.error("Couldn't copy the link. Please try again.");
    close();
  };

  return (
    // This sits inside clickable cards. Without stopPropagation, tapping Share
    // would also select the card underneath it.
    <span
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      className="inline-flex"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            title="Share"
            aria-label="Share this opportunity"
            onClick={async (e) => {
              if (!canNativeShare()) return; // no share sheet: let the menu open
              e.preventDefault(); // stops the popover toggling
              const result = await nativeShare(opportunity);
              if (result === "failed") setOpen(true);
            }}
            className={cn(
              variant === "icon"
                ? "p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                : "inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-primary/40 hover:text-primary transition-colors",
              className,
            )}
          >
            <Share2 className={variant === "icon" ? "w-4 h-4" : "w-3.5 h-3.5"} />
            {variant === "button" && "Share"}
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          className="w-52 p-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Share this opportunity
          </p>
          <a
            href={whatsappShareUrl(opportunity)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={itemClass}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            WhatsApp
          </a>
          <a
            href={telegramShareUrl(opportunity)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className={itemClass}
          >
            <Send className="w-4 h-4 text-sky-600" />
            Telegram
          </a>
          <a href={emailShareUrl(opportunity)} onClick={close} className={itemClass}>
            <Mail className="w-4 h-4 text-gray-500" />
            Email
          </a>
          <button type="button" onClick={copy} className={itemClass}>
            <Link2 className="w-4 h-4 text-gray-500" />
            Copy link
          </button>
        </PopoverContent>
      </Popover>
    </span>
  );
}
