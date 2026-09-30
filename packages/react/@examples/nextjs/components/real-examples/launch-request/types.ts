/** Domain types for the Launch Request example. */

/** React Hook Form values for the launch request form. */
export type LaunchRequestValues = {
  /** Overview */
  projectName: string;
  summary: string;
  /** Schedule: valid YYYY-MM-DD calendar date, or null when cleared; never a UTC instant. */
  launchDate: string | null;
  rolloutWindow: string;
  /** Ownership */
  ownerEmail: string;
  teams: string[];
  /** Approval */
  confirmed: boolean;
};

/** Status of the current form values relative to the submitted revision. */
export type RequestStatus = 'draft' | 'submitted' | 'unsaved';
