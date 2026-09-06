/**
 * Team management example: typed models and deterministic fixtures.
 *
 * Colocated with the owning flow. Dates are fixed UTC ISO strings, IDs are
 * stable, display names vary in length, and avatar fallbacks use local
 * initials (no remote images). No random or current-time defaults anywhere.
 */

export type MemberRole = 'Admin' | 'Member' | 'Viewer';
export type MemberStatus = 'Active' | 'Invited' | 'Suspended';

export type StatusFilter = 'All' | MemberStatus;
export type RoleFilter = 'All' | MemberRole;

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: MemberRole;
  readonly status: MemberStatus;
  /** Fixed UTC ISO join date — never derived from the current time. */
  readonly joinedAtIso: string;
}

/** Fixed page size so filtering and pagination stay deterministic. */
export const TEAM_PAGE_SIZE = 3;

export const STATUS_FILTERS: readonly StatusFilter[] = ['All', 'Active', 'Invited', 'Suspended'];
export const ROLE_FILTERS: readonly RoleFilter[] = ['All', 'Admin', 'Member', 'Viewer'];

/** Assignable roles for the invite and role-change dialogs. */
export const MEMBER_ROLES: readonly MemberRole[] = ['Admin', 'Member', 'Viewer'];

/** Fixed UTC ISO join date stamped on invited members — never "now". */
export const INVITED_MEMBER_JOINED_AT_ISO = '2026-03-01T09:00:00.000Z';

export const EXAMPLE_MEMBERS: readonly TeamMember[] = [
  {
    id: 'member-ada-okafor',
    name: 'Ada Okafor',
    email: 'ada.okafor@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAtIso: '2025-06-02T09:00:00.000Z',
  },
  {
    id: 'member-bo-lindqvist',
    name: 'Bo Lindqvist',
    email: 'bo.lindqvist@example.com',
    role: 'Member',
    status: 'Active',
    joinedAtIso: '2025-09-18T14:30:00.000Z',
  },
  {
    id: 'member-catarina-m-reyes-almeida',
    name: 'Catarina M. Reyes Almeida',
    email: 'catarina.reyes.almeida@example.com',
    role: 'Member',
    status: 'Invited',
    joinedAtIso: '2026-01-07T17:45:00.000Z',
  },
  {
    id: 'member-dev-patel',
    name: 'Dev Patel',
    email: 'dev.patel@example.com',
    role: 'Viewer',
    status: 'Suspended',
    joinedAtIso: '2025-03-11T08:15:00.000Z',
  },
  {
    id: 'member-elsa-moreau',
    name: 'Elsa Moreau',
    email: 'elsa.moreau@example.com',
    role: 'Member',
    status: 'Active',
    joinedAtIso: '2025-11-24T10:00:00.000Z',
  },
  {
    id: 'member-finn-osei',
    name: 'Finn Osei',
    email: 'finn.osei@example.com',
    role: 'Viewer',
    status: 'Invited',
    joinedAtIso: '2026-02-14T09:30:00.000Z',
  },
  {
    id: 'member-grace-nguyen-halvorsen',
    name: 'Grace Nguyen Halvorsen',
    email: 'grace.nguyen.halvorsen@example.com',
    role: 'Member',
    status: 'Active',
    joinedAtIso: '2025-04-29T16:20:00.000Z',
  },
  {
    id: 'member-hugo-stein',
    name: 'Hugo Stein',
    email: 'hugo.stein@example.com',
    role: 'Admin',
    status: 'Suspended',
    joinedAtIso: '2025-08-05T12:00:00.000Z',
  },
];

/** Local avatar fallback: initials derived from the display name. */
export function memberInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Deterministic member filtering: status/role equality plus a
 * case-insensitive name/email substring match. Pure so specs can assert the
 * exact visible set for any filter combination.
 */
export function filterMembers(
  members: readonly TeamMember[],
  query: string,
  status: StatusFilter,
  role: RoleFilter,
): TeamMember[] {
  const needle = query.trim().toLowerCase();
  return members.filter(
    (member) =>
      (status === 'All' || member.status === status) &&
      (role === 'All' || member.role === role) &&
      (needle === '' || member.name.toLowerCase().includes(needle) || member.email.toLowerCase().includes(needle)),
  );
}

/** Deterministic member id derived from the invited name. */
export function slugifyMemberId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `member-${slug || 'teammate'}`;
}
