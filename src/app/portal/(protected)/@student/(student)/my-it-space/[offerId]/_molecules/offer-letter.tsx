import React, { useState } from "react";
import {
  Download,
  FileText,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadOfferLetterSection = ({
  offerDetails,
  offerLetterUrl = offerDetails?.letterUrl,
  companyName = "TechBridge Innovations",
  offerDate = "2025-03-15",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);

    // Simulate download delay
    setTimeout(() => {
      // In real implementation, trigger actual download
      if (offerLetterUrl) {
        window.open(
          `http://localhost:3000/offer-letters/${offerLetterUrl}`,
          "_blank"
        );
      } else {
        console.log("Download offer letter");
      }
      setIsDownloading(false);
    }, 1500);
  };

  const handlePreview = () => {
    if (offerLetterUrl) {
      window.open(
        `http://localhost:3000/offer-letters/${offerLetterUrl}`,
        "_blank"
      );
    } else {
      console.log("Preview offer letter");
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-blue-50 p-2 rounded-lg">
          <FileText size={24} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Offer Letter</h3>
          <p className="text-xs text-gray-600">
            Your official placement offer from {companyName}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center px-4 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isDownloading ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={18} className="mr-2" />
              Download Offer Letter
            </>
          )}
        </Button>

        <Button
          onClick={handlePreview}
          variant={"outline"}
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all"
        >
          <ExternalLink size={18} className="mr-2" />
          Preview in Browser
        </Button>
      </div>

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Please review and sign the offer letter before your start date
      </p>
    </section>
  );
};

export default DownloadOfferLetterSection;
