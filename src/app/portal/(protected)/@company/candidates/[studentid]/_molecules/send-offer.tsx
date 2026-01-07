"use client";
import { useState } from "react";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { FileUpIcon, X, FileText, Trash2 } from "lucide-react";
import FileUpload from "@/components/file-upload";
import UploadThing from "@/components/uploading-thing";

interface OfferFormData {
  startDate: string;
  endDate?: string;
  stipend?: string;
  file: File | null;
}

interface OfferFormErrors {
  startDate?: string;
  endDate?: string;
  file?: string;
}

interface OfferModalProps {
  onClose: () => void;
  offerFormOpen: boolean;
  onCreate: (data: OfferFormData) => void; // <-- accept OfferFormData
}

export default function OfferModal({
  onClose,
  offerFormOpen,
  onCreate,
}: OfferModalProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    stipend: "",
  });
  const [errors, setErrors] = useState<OfferFormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OfferFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = (file: File | null) => {
    const newErrors: OfferFormErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!file) {
      newErrors.file = "Offer letter is required";
    }

    if (
      formData.endDate &&
      formData.startDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm(uploadedFile)) {
      onCreate({ ...formData, file: uploadedFile });
      // console.log("Form submitted", { ...formData, file: uploadedFile });
    }
  };

  return (
    <Modal open={offerFormOpen} onClose={onClose}>
      <div className="rounded-2xl mx-auto shadow-lg bg-white px-6 py-5 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Send Placement Offer
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition"
            aria-label="Close modal"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Dates */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <label
                className="font-medium mb-1 text-sm text-gray-700"
                htmlFor="startDate"
              >
                Start Date <span className="text-red-500">*</span>
              </label>
              <Input
                id="startDate"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className={errors.startDate ? "border-red-500" : ""}
                required
              />
              {errors.startDate && (
                <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label
                className="font-medium mb-1 text-sm text-gray-700"
                htmlFor="endDate"
              >
                End Date{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <Input
                id="endDate"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Stipend */}
          <div className="flex flex-col">
            <label
              className="font-medium mb-1 text-sm text-gray-700"
              htmlFor="stipend"
            >
              Stipend <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <Input
              id="stipend"
              type="text"
              name="stipend"
              value={formData.stipend}
              onChange={handleInputChange}
              placeholder="e.g. ₦150,000"
            />
          </div>

          {/* Upload */}
          <UploadThing
            onChange={(file, error) => {
              setUploadedFile(file);
              if (error) {
                setErrors((prev) => ({ ...prev, file: error }));
              }
            }}
          />
          {errors.file && (
            <p className="text-xs text-red-500 mt-1">{errors.file}</p>
          )}

          {/* Submit Button */}
          <Button
            className="w-full text-white font-medium mt-2 py-3"
            type="submit"
          >
            Send Offer
          </Button>

          {/* <FileUpload /> */}
        </form>
      </div>
    </Modal>
  );
}
