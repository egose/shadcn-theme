/** Domain types for the Launch Request example. */

/** React Hook Form values for the launch request form. */
export type LaunchRequestValues = {
  /** Overview */
  projectName: string;
  summary: string;
  /** Schedule */
  launchDate: Date | undefined;
  rolloutWindow: string;
  /** Ownership */
  ownerEmail: string;
  teams: string[];
  /** Approval */
  confirmed: boolean;
};

/** Lifecycle status of the launch request itself. */
export type RequestStatus = 'draft' | 'submitted';

/** Explicit simulated outcome for the save request (deterministic). */
export type SimulatedOutcomeChoice = 'success' | 'failure';
