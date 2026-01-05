import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
  // defaultValidationErrorsShape: "flattened",
  handleServerError(e) {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
