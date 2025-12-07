"use client";

import Input from "@/components/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { upload as uploadAction } from "@/actions";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const { execute } = useAction(uploadAction);

  const upload = () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");

    execute({ file });
  };

  return (
    <div className="flex flex-col mx-auto p-6 justify-center gap-2">
      <Input
        type="file"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] || null;
          setFile(selectedFile);
        }}
      />
      {error && <p className="text-red-400">{error}</p>}
      <Button onClick={upload}>upload</Button>
    </div>
  );
}
