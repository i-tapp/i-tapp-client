export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  WITHDRAWN = "withdrawn",
  IN_REVIEW = "in_review",
  INTERVIEWING = "interviewing",
  APPROVED = "approved",

  NEW_APPLICANT = "new_applicant",
  // INTERVIEW_SCHEDULED = "interview_scheduled",
}

export enum OpportunityStatus {
  OPEN = "open",
  CLOSED = "closed",
  DRAFT = "draft",
  //   PAUSED = "paused",
  //   FILLED = "filled",
  //   EXPIRED = "expired",
  //   REVIEW = "review", // when admin needs to approve
}

export enum OpportunityMode {
  REMOTE = "remote",
  ONSITE = "on_site",
  HYBRID = "hybrid",
  FLEXIBLE = "flexible",
}

export enum OpportunityType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  INTERNSHIP = "internship",
  CONTRACT = "contract",
  FREELANCE = "freelance",
}

export enum OpportunityLevel {
  ENTRY = "entry",
  MID = "mid",
  SENIOR = "senior",
  LEAD = "lead",
  DIRECTOR = "director",
  EXECUTIVE = "executive",
}

export enum CompanyStatus {
  PENDING = "pending", // signed up, docs not reviewed
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  SUSPENDED = "suspended", // previously approved, later disabled
}
