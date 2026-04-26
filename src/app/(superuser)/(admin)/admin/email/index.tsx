"use client";

import { useState, useMemo } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "react-toastify";
import { sendSystemEmail } from "@/actions";
import { useFetchAllStudents, useFetchCompanies } from "@/queries/admin";
import { Mail, Search, X, Users, Building, Eye, EyeOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type Recipient = { id: string; name: string; email: string; type: "student" | "company" };

export default function AdminEmailPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audienceMode, setAudienceMode] = useState<"all-students" | "all-companies" | "all" | "custom">("all-students");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState<Recipient[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { data: students = [] } = useFetchAllStudents();
  const { data: companies = [] } = useFetchCompanies();

  const { execute, isExecuting } = useAction(sendSystemEmail, {
    onSuccess: () => {
      toast.success("Email sent successfully!");
      setSubject("");
      setBody("");
      setSelectedRecipients([]);
      setSearchQuery("");
    },
    onError: (e) => toast.error(e?.error?.serverError || "Failed to send email."),
  });

  // Build unified recipient pool for custom search
  const allPeople: Recipient[] = useMemo(() => {
    const s: Recipient[] = (students as any[]).map((s: any) => ({
      id: s.id,
      name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "Unknown",
      email: s.user?.email ?? "",
      type: "student" as const,
    }));
    const c: Recipient[] = (companies as any[]).map((c: any) => ({
      id: c.id,
      name: c.name ?? "Unknown",
      email: c.user?.email ?? c.email ?? "",
      type: "company" as const,
    }));
    return [...s, ...c];
  }, [students, companies]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allPeople
      .filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
      .slice(0, 20);
  }, [searchQuery, allPeople]);

  const toggleRecipient = (person: Recipient) => {
    setSelectedRecipients((prev) =>
      prev.find((p) => p.id === person.id)
        ? prev.filter((p) => p.id !== person.id)
        : [...prev, person],
    );
  };

  const removeRecipient = (id: string) => {
    setSelectedRecipients((prev) => prev.filter((p) => p.id !== id));
  };

  const resolvedEmails = (): string[] => {
    if (audienceMode === "all-students") return (students as any[]).map((s: any) => s.user?.email).filter(Boolean);
    if (audienceMode === "all-companies") return (companies as any[]).map((c: any) => c.user?.email ?? c.email).filter(Boolean);
    if (audienceMode === "all") return allPeople.map((p) => p.email).filter(Boolean);
    return selectedRecipients.map((r) => r.email).filter(Boolean);
  };

  const recipientCount = resolvedEmails().length;

  const handleSend = () => {
    const emails = resolvedEmails();
    if (!subject.trim()) return toast.error("Subject is required.");
    if (!body.trim()) return toast.error("Email body is required.");
    if (emails.length === 0) return toast.error("No recipients selected.");
    execute({ subject, body, emails });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Mail size={22} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Email</h1>
          <p className="text-sm text-gray-500">Send a broadcast email to users on the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Compose */}
        <div className="lg:col-span-2 space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Body</label>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? "Edit" : "Preview"}
              </button>
            </div>

            {showPreview ? (
              <div
                className="min-h-64 w-full border border-gray-300 rounded-lg p-4 text-sm text-gray-800 bg-white whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: body.replace(/\n/g, "<br/>") }}
              />
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email message here..."
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            )}
            <p className="text-xs text-gray-400 mt-1">Plain text. Line breaks are preserved.</p>
          </div>
        </div>

        {/* Right: Recipients */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Recipients</h2>

            {/* Audience mode */}
            <div className="space-y-2">
              {(
                [
                  { value: "all-students", label: "All Students", icon: <Users size={14} /> },
                  { value: "all-companies", label: "All Companies", icon: <Building size={14} /> },
                  { value: "all", label: "Everyone", icon: <Mail size={14} /> },
                  { value: "custom", label: "Custom", icon: <Search size={14} /> },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="audience"
                    value={opt.value}
                    checked={audienceMode === opt.value}
                    onChange={() => setAudienceMode(opt.value)}
                    className="accent-blue-600"
                  />
                  <span className="flex items-center gap-1.5 text-gray-700">
                    {opt.icon} {opt.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Custom search */}
            {audienceMode === "custom" && (
              <div className="space-y-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                  <div className="border border-gray-200 rounded-lg divide-y max-h-48 overflow-y-auto">
                    {searchResults.map((person) => {
                      const selected = !!selectedRecipients.find((r) => r.id === person.id);
                      return (
                        <div
                          key={person.id}
                          onClick={() => toggleRecipient(person)}
                          className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-xs hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`}
                        >
                          <input type="checkbox" readOnly checked={selected} className="accent-blue-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">{person.name}</p>
                            <p className="text-gray-400 truncate">{person.email}</p>
                          </div>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${person.type === "student" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700"}`}>
                            {person.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Selected chips */}
                {selectedRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecipients.map((r) => (
                      <span
                        key={r.id}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {r.name}
                        <button onClick={() => removeRecipient(r.id)} className="hover:text-blue-600">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Count */}
            <p className="text-xs text-gray-500 pt-1 border-t border-gray-100">
              <span className="font-semibold text-gray-800">{recipientCount}</span> recipient{recipientCount !== 1 ? "s" : ""} will receive this email
            </p>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={isExecuting || !subject.trim() || !body.trim() || recipientCount === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <Send size={16} />
            {isExecuting ? "Sending..." : `Send to ${recipientCount} recipient${recipientCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
