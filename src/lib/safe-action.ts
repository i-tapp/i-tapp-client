import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { ServerActionError } from "./server-action-error";

export const actionClient = createSafeActionClient({
  handleServerError(e: any) {
    if (e instanceof Error) {
      return e.message;
    }
    console.error("Unexpected server error:", e);
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
