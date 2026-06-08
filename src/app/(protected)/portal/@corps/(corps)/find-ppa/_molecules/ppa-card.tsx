"use client";

import { MapPin, Clock, BookmarkIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { saveCorpsPPA } from "@/actions";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/utils/tailwind";
import Image from "next/image";
import { toast } from "react-toastify";

export default function PPACard({
  ppa,
  selected,
  onSelect,
}: {
  ppa: any;
  selected: boolean;
  onSelect: () => void;
}) {
  const queryClient = useQueryClient();
  const { execute: toggleSave } = useAction(saveCorpsPPA, {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["corps-ppa"] }),
    onError: () => toast.error("Failed to save"),
  });

  return (
    <div
      onClick={onSelect}
      className={cn(
        "bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30",
        selected && "border-primary shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {ppa.company?.logo ? (
            <Image
              src={ppa.company.logo}
              alt={ppa.company.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg object-contain border shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center shrink-0">
              {ppa.company?.name?.charAt(0) ?? "P"}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{ppa.title}</p>
            <p className="text-sm text-gray-500 truncate">{ppa.company?.name}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave({ id: ppa.id }); }}
          className={cn(
            "shrink-0 p-1.5 rounded-lg transition-colors",
            ppa.isSaved ? "text-emerald-600 bg-emerald-50" : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
          )}
        >
          <BookmarkIcon className="w-4 h-4" fill={ppa.isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {ppa.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {ppa.duration}
        </span>
        {ppa.mode && (
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{ppa.mode}</span>
        )}
        {ppa.stipend && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">₦{ppa.stipend?.toLocaleString()}/mo</span>
        )}
      </div>

      {ppa.preferredFields?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {ppa.preferredFields.slice(0, 3).map((f: string) => (
            <span key={f} className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">{f}</span>
          ))}
        </div>
      )}
    </div>
  );
}
