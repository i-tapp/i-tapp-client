import moment from "moment";

export type ApplyBlockReason = "closed" | "full" | "deadline";

export interface ApplyAvailability {
  canApply: boolean;
  reason: ApplyBlockReason | null;
  /** Short text for a disabled button. */
  buttonLabel: string;
  /** One-line explanation to show the person, or null when they can apply. */
  message: string | null;
}

type AvailabilitySource = {
  status?: string | null;
  maxApplicants?: number | string | null;
  totalApplications?: number | string | null;
  applicationDeadline?: string | null;
};

const CLOSED_STATUSES = ["closed", "draft", "expired", "filled", "archived"];

const OPEN: ApplyAvailability = {
  canApply: true,
  reason: null,
  buttonLabel: "Apply Now",
  message: null,
};

/**
 * The one rule for "can someone still apply to this opportunity?".
 *
 * Applying is blocked when ANY of these is true, whether or not the company
 * (or the backend) has actually flipped the opportunity to "closed":
 *   - its status is closed / draft
 *   - the applicant limit has been reached
 *   - the application deadline has passed (the deadline day itself stays open
 *     until 23:59 Nigeria time that day, matching the backend)
 *
 * This only controls the UI. The backend must enforce the same rules on the
 * apply endpoints, because anything the browser does can be bypassed.
 */
export function getApplyAvailability(
  opportunity: AvailabilitySource | null | undefined,
  now: moment.Moment = moment.utc(),
): ApplyAvailability {
  if (!opportunity) return OPEN;

  const status = String(opportunity.status ?? "").toLowerCase();
  if (CLOSED_STATUSES.includes(status)) {
    return {
      canApply: false,
      reason: "closed",
      buttonLabel: "Closed",
      message: "This opportunity is closed and no longer accepting applications.",
    };
  }

  // A limit of 0 / missing means "no limit".
  const max = Number(opportunity.maxApplicants);
  const total = Number(opportunity.totalApplications ?? 0);
  if (Number.isFinite(max) && max > 0 && total >= max) {
    return {
      canApply: false,
      reason: "full",
      buttonLabel: "Applications full",
      message: "All spots for this opportunity have been filled.",
    };
  }

  if (opportunity.applicationDeadline) {
    // Same cut-off as the backend: the deadline day stays open until
    // 23:59:59.999 Nigeria time (WAT, UTC+1). The stored value is midnight UTC
    // of the picked date, so shift one hour, take the end of that day, shift back.
    const deadline = moment.utc(opportunity.applicationDeadline);
    const cutoff = deadline.clone().add(1, "hour").endOf("day").subtract(1, "hour");
    if (deadline.isValid() && now.isAfter(cutoff)) {
      return {
        canApply: false,
        reason: "deadline",
        buttonLabel: "Deadline passed",
        message: "The application deadline for this opportunity has passed.",
      };
    }
  }

  return OPEN;
}
