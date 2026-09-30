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
  readonly joinedAtIso: string;
}

export interface InviteMemberResult {
  readonly name: string;
  readonly email: string;
  readonly role: MemberRole;
}

export interface InviteMemberContext {
  readonly emailExists: (email: string) => boolean;
}

export interface RoleChangeContext {
  readonly memberName: string;
  readonly currentRole: MemberRole;
}

export interface RoleChangeResult {
  readonly role: MemberRole;
}

export interface MemberOutcome {
  readonly message: string;
  readonly canUndo: boolean;
}

export interface BulkRoleRequest {
  readonly members: readonly TeamMember[];
  readonly role: MemberRole;
}

export type MemberOperation = 'invite' | 'role' | 'remove' | 'bulk-confirm' | 'bulk-save';
