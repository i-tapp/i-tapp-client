"use client";
import { useState } from "react";
import Input from "@/components/input";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { FileUpIcon, X, FileText, Trash2 } from "lucide-react";

export default function OfferModal({
  onClose,
  offerFormOpen,
  onCreate,
}: {
  onClose: () => void;
  offerFormOpen: boolean;
  onCreate: () => void;
}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    salary: "",
  });
  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          file: "Please upload a PDF or DOCX file",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          file: "File size must be less than 5MB",
        }));
        return;
      }

      setUploadedFile(file);
      setErrors((prev) => ({ ...prev, file: null }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!uploadedFile) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onCreate({ ...formData, file: uploadedFile });
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

          {/* Salary */}
          <div className="flex flex-col">
            <label
              className="font-medium mb-1 text-sm text-gray-700"
              htmlFor="salary"
            >
              Stipend/Salary{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <Input
              id="salary"
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="e.g. ₦150,000"
            />
          </div>

          {/* Upload */}
          <div className="flex flex-col w-full">
            <label
              className="font-medium mb-1 text-sm text-gray-700"
              htmlFor="file-upload"
            >
              Upload Offer Letter <span className="text-red-500">*</span>
            </label>

            {!uploadedFile ? (
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
                  className={`mb-2 ${
                    errors.file ? "text-red-400" : "text-gray-400"
                  }`}
                  size={40}
                />
                <p
                  className={` "text-gray-600"
                   font-medium`}
                >
                  Click to upload file
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  PDF, DOCX up to 5MB
                </p>
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
                    <p className="text-sm font-medium text-gray-800">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
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

            {errors.file && (
              <p className="text-xs text-red-500 mt-1">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            className="w-full text-white font-medium mt-2 py-3"
            type="submit"
          >
            Send Offer
          </Button>
        </form>
      </div>
    </Modal>
  );
}
