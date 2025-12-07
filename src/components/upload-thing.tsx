"use client";

import { FileText, FileUpIcon, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function UploadThing({
  onChange,
}: {
  onChange: (file: File | null, error: string | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        const errMsg = "Please upload a PDF or DOCX file";
        setError(errMsg);
        setFile(null);
        onChange?.(null, errMsg);
        return;
      }

      if (file.size > maxSize) {
        const errMsg = "File size must be less than 5MB";
        setError(errMsg);
        setFile(null);
        onChange?.(null, errMsg);
        return;
      }

      setFile(file);
      setError(null);
      onChange?.(file, null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    onChange?.(null, null);
  };
  return (
    <div className="flex flex-col w-full">
      <label
        className="font-medium mb-1 text-sm text-gray-700"
        htmlFor="file-upload"
      >
        Upload Offer Letter <span className="text-red-500">*</span>
      </label>

      {!file ? (
        <label
          htmlFor="file-upload"
          className={`
                  border-2 border-dashed rounded-xl p-5 
                  flex flex-col items-center justify-center 
                  cursor-pointer transition
border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100
                
                `}
        >
          <FileUpIcon
            className={`mb-2 ${error ? "text-red-400" : "text-gray-400"}`}
            size={40}
          />
          <p
            className={` "text-gray-600"
                   font-medium`}
          >
            Click to upload file
          </p>
          <p className="text-sm text-gray-400 mt-1">PDF, DOCX up to 5MB</p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="border border-gray-300 rounded-xl p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" size={32} />
            <div>
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="p-2 rounded-lg hover:bg-red-100 transition"
            aria-label="Remove file"
          >
            <Trash2 className="text-red-500" size={18} />
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
