// lib/safe-action.ts
import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { isAxiosError } from "axios";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    // Axios error from your API
    if (isAxiosError(e)) {
      // prefer API-provided message shapes
      const msg =
        e.response?.data?.message ??
        e.response?.data?.error?.message ??
        e.message;

      return msg || DEFAULT_SERVER_ERROR_MESSAGE;
    }

    // Any other error
    if (e instanceof Error) return e.message;
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
