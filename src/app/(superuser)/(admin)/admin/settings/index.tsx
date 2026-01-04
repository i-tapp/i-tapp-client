"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users2, CreditCard, Shield, Plus } from "lucide-react";
import { cn } from "@/utils/tailwind";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import AdminList from "./_molecules/admin-list";

const settingsItems = [
  { name: "General", icon: <Users2 size={16} /> },
  { name: "Users & Roles", icon: <Users2 size={16} /> },
  { name: "Payment/Billings", icon: <CreditCard size={16} /> },
  { name: "Security", icon: <Shield size={16} /> },
];

export default function SettingsPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage system-wide configuration and defaults for the i-Tapp
            platform
          </p>
        </div>

        <Button className="self-start md:self-auto">Save Changes</Button>
      </div>

      {/* TAB NAVIGATION */}
      {/* TAB NAVIGATION */}
      <div className="flex flex-row gap-4 border-b overflow-x-auto">
        {settingsItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={cn(
              "flex items-center gap-2 text-sm px-4 py-2 rounded-t-lg border-b transition-all whitespace-nowrap",
              selected === index
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* CONTENT PANEL */}
      <div className="rounded-lg border p-6 bg-white shadow-sm min-h-[300px]">
        {selected === 0 && (
          <div className="flex flex-row justify-between">
            <div>
              <h4 className=" font-semibold">Maintanace Mode</h4>
              <p className="text-sm">
                Temporarily diasbled public access to the platform
              </p>
            </div>

            <Switch />
          </div>
        )}
        {selected === 1 && <AdminList />}

        {selected === 2 && <div>Payment/Billings Content</div>}
        {selected === 3 && <div>Security Content</div>}
      </div>
    </div>
  );
}
