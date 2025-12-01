import { mutate } from "@/lib/api";
import { actionClient } from "@/lib/safe-action";
// import z from "zod";
import { zfd } from "zod-form-data";

const inputSchema = zfd.formData({
  file: zfd.file(),
});

export const upload = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput }) => {
    const formData = new FormData();
    formData.append("file", parsedInput.file);
    try {
      const response = await mutate(`/file-upload/document`, formData, "POST");
      console.log("upload respone", response);
      return response;
    } catch (error) {
      console.error("Upload error:", error);
      return { success: false, message: "File upload failed" };
    }
  });
