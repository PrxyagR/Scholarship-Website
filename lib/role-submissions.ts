import type { User } from '@supabase/supabase-js';
import {
  opportunities,
  supportedProvinces,
  supportedStudyFocuses,
  type DeadlineInfo,
  type Opportunity,
  type OpportunityCost,
  type OpportunityFormat,
  type LocationMode,
  type OrganizerCountry,
  type StudyFocus,
} from '@/app/data/opportunities';
import { createAdminClient } from '@/lib/supabase/admin';

export const ROLE_SUBMISSIONS_KEY = 'maplepath_role_submissions';
export const MAX_ROLE_SUBMISSIONS_PER_USER = 20;

export type RoleSubmissionStatus = 'pending' | 'approved' | 'rejected';

export type RoleSubmission = {
  id: string;
  title: string;
  provider: string;
  summary: string;
  eligibility: string;
  grades: number[];
  studyFocus: StudyFocus[];
  province: string;
  city: string;
  locationMode: LocationMode;
  locationLabel: string;
  deadline: DeadlineInfo;
  applyUrl: string;
  cost: OpportunityCost;
  format: OpportunityFormat;
  organizerCountry: OrganizerCountry;
  travelRequired: boolean;
  submittedAt: string;
  reviewedAt?: string;
  status: RoleSubmissionStatus;
};

export type AdminRoleSubmission = RoleSubmission & {
  submitterUserId: string;
  submitterEmail: string;
};

function isStatus(value: unknown): value is RoleSubmissionStatus {
  return value === 'pending' || value === 'approved' || value === 'rejected';
}

function isDeadlineKind(value: unknown): value is DeadlineInfo['kind'] {
  return value === 'date' || value === 'rolling' || value === 'cycle';
}

function isLocationMode(value: unknown): value is LocationMode {
  return value === 'Canada' || value === 'Online' || value === 'Worldwide';
}

function isCost(value: unknown): value is OpportunityCost {
  return value === 'Free' || value === 'Paid' || value === 'Varies';
}

function isFormat(value: unknown): value is OpportunityFormat {
  return value === 'Online' || value === 'In person' || value === 'Hybrid';
}

function isOrganizerCountry(value: unknown): value is OrganizerCountry {
  return value === 'Canada' || value === 'United States' || value === 'International';
}

function readText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export function parseRoleSubmission(value: unknown): RoleSubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const deadlineValue = raw.deadline;
  if (!deadlineValue || typeof deadlineValue !== 'object' || Array.isArray(deadlineValue)) return null;
  const deadline = deadlineValue as Record<string, unknown>;
  const grades = Array.isArray(raw.grades)
    ? Array.from(new Set(raw.grades.map(Number).filter((grade) => Number.isInteger(grade) && grade >= 9 && grade <= 12)))
    : [];
  const studyFocus = Array.isArray(raw.studyFocus)
    ? Array.from(new Set(raw.studyFocus.filter((focus): focus is StudyFocus => supportedStudyFocuses.includes(focus as StudyFocus))))
    : [];

  const parsed: RoleSubmission = {
    id: readText(raw.id, 120),
    title: readText(raw.title, 120),
    provider: readText(raw.provider, 120),
    summary: readText(raw.summary, 600),
    eligibility: readText(raw.eligibility, 800),
    grades,
    studyFocus,
    province: readText(raw.province, 80),
    city: readText(raw.city, 100),
    locationMode: raw.locationMode as LocationMode,
    locationLabel: readText(raw.locationLabel, 160),
    deadline: {
      kind: deadline.kind as DeadlineInfo['kind'],
      date: readText(deadline.date, 20) || undefined,
      label: readText(deadline.label, 160),
    },
    applyUrl: readText(raw.applyUrl, 500),
    cost: raw.cost as OpportunityCost,
    format: raw.format as OpportunityFormat,
    organizerCountry: raw.organizerCountry as OrganizerCountry,
    travelRequired: Boolean(raw.travelRequired),
    submittedAt: readText(raw.submittedAt, 40),
    reviewedAt: readText(raw.reviewedAt, 40) || undefined,
    status: raw.status as RoleSubmissionStatus,
  };

  if (
    !parsed.id ||
    !parsed.title ||
    !parsed.provider ||
    !parsed.summary ||
    !parsed.eligibility ||
    !parsed.grades.length ||
    !parsed.studyFocus.length ||
    !supportedProvinces.includes(parsed.province as (typeof supportedProvinces)[number]) ||
    !parsed.city ||
    !isLocationMode(parsed.locationMode) ||
    !parsed.locationLabel ||
    !isDeadlineKind(parsed.deadline.kind) ||
    !parsed.deadline.label ||
    !/^https:\/\//i.test(parsed.applyUrl) ||
    !isCost(parsed.cost) ||
    !isFormat(parsed.format) ||
    !isOrganizerCountry(parsed.organizerCountry) ||
    !parsed.submittedAt ||
    !isStatus(parsed.status)
  ) {
    return null;
  }

  if (parsed.deadline.kind === 'date' && !parsed.deadline.date) return null;
  return parsed;
}

export function getUserRoleSubmissions(user: User | null | undefined) {
  const raw = user?.app_metadata?.[ROLE_SUBMISSIONS_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.map(parseRoleSubmission).filter((submission): submission is RoleSubmission => Boolean(submission));
}

export function roleSubmissionToOpportunity(
  submission: RoleSubmission,
  submitterUserId: string,
): Opportunity {
  return {
    id: `submitted-role-${submitterUserId}-${submission.id}`,
    title: submission.title,
    provider: submission.provider,
    type: 'Youth role',
    summary: submission.summary,
    eligibility: submission.eligibility,
    grades: submission.grades,
    studyFocus: submission.studyFocus,
    province: submission.province,
    city: submission.city,
    locationMode: submission.locationMode,
    locationLabel: submission.locationLabel,
    deadline: submission.deadline,
    applyUrl: submission.applyUrl,
    lastVerified: (submission.reviewedAt ?? submission.submittedAt).slice(0, 10),
    cost: submission.cost,
    format: submission.format,
    organizerCountry: submission.organizerCountry,
    travelRequired: submission.travelRequired,
  };
}

async function listAuthUsers() {
  const adminClient = createAdminClient();
  if (!adminClient) return [];

  const users: User[] = [];
  let page = 1;
  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
    page += 1;
  }
  return users;
}

export async function getPublishedRoleOpportunities() {
  try {
    const users = await listAuthUsers();
    return users.flatMap((user) =>
      getUserRoleSubmissions(user)
        .filter((submission) => submission.status === 'approved')
        .map((submission) => roleSubmissionToOpportunity(submission, user.id)),
    );
  } catch {
    return [];
  }
}

export async function listAdminRoleSubmissions(status?: RoleSubmissionStatus) {
  try {
    const users = await listAuthUsers();
    return users.flatMap((user) =>
      getUserRoleSubmissions(user)
        .filter((submission) => !status || submission.status === status)
        .map((submission) => ({
          ...submission,
          submitterUserId: user.id,
          submitterEmail: user.email ?? 'Unknown account',
        })),
    );
  } catch {
    return [];
  }
}

export async function updateRoleSubmissionStatus(
  submitterUserId: string,
  submissionId: string,
  status: Exclude<RoleSubmissionStatus, 'pending'>,
) {
  const adminClient = createAdminClient();
  if (!adminClient) return { ok: false as const, error: 'setup' };

  const { data, error } = await adminClient.auth.admin.getUserById(submitterUserId);
  if (error || !data.user) return { ok: false as const, error: 'not_found' };

  const submissions = getUserRoleSubmissions(data.user);
  const found = submissions.some((submission) => submission.id === submissionId);
  if (!found) return { ok: false as const, error: 'not_found' };

  const updated = submissions.map((submission) =>
    submission.id === submissionId
      ? { ...submission, status, reviewedAt: new Date().toISOString() }
      : submission,
  );
  const update = await adminClient.auth.admin.updateUserById(submitterUserId, {
    user_metadata: { [ROLE_SUBMISSIONS_KEY]: updated },
  });
  if (update.error) return { ok: false as const, error: 'update_failed' };
  return { ok: true as const };
}

export function submissionCountForUser(user: User | null | undefined) {
  return getUserRoleSubmissions(user).length;
}

export { opportunities };
