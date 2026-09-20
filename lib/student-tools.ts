import type { User } from '@supabase/supabase-js';
import {
  opportunities,
  supportedProvinces,
  supportedStudyFocuses,
  type Opportunity,
  type StudyFocus,
} from '@/app/data/opportunities';
import { isSubmittedRoleId } from '@/lib/role-ids';

export const STUDENT_PROFILE_KEY = 'maplepath_student_profile';
export const APPLICATION_TRACKER_KEY = 'maplepath_application_tracker';

export type StudentProfile = {
  grade: number | null;
  province: string;
  focuses: StudyFocus[];
};

export type ApplicationStatus = 'Planning' | 'In progress' | 'Submitted';

export type ApplicationRecord = {
  status: ApplicationStatus;
  note: string;
  updatedAt: string;
};

export type ApplicationTracker = Record<string, ApplicationRecord>;

export const studentProvinceOptions: string[] = supportedProvinces.filter(
  (province) => !['National', 'Multiple provinces', 'Online / worldwide'].includes(province),
);

export const studentFocusOptions = supportedStudyFocuses.filter((focus) => focus !== 'Any field');

const gradeOptions = [9, 10, 11, 12];
const applicationStatuses: ApplicationStatus[] = ['Planning', 'In progress', 'Submitted'];

const emptyProfile: StudentProfile = {
  grade: null,
  province: '',
  focuses: [],
};

function isKnownOpportunityId(value: string) {
  return opportunities.some((opportunity) => opportunity.id === value) || isSubmittedRoleId(value);
}

function isStudyFocus(value: unknown): value is StudyFocus {
  return typeof value === 'string' && supportedStudyFocuses.includes(value as StudyFocus);
}

export function getStudentProfile(user: User | null | undefined): StudentProfile {
  const raw = user?.user_metadata?.[STUDENT_PROFILE_KEY];
  const parsed = parseStudentProfile(raw);
  return parsed ?? { ...emptyProfile, focuses: [] };
}

export function parseStudentProfile(value: unknown): StudentProfile | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const gradeValue = raw.grade === '' || raw.grade === null || raw.grade === undefined ? null : Number(raw.grade);
  const province = typeof raw.province === 'string' ? raw.province : '';
  const focuses = raw.focuses;

  if (gradeValue !== null && (!Number.isInteger(gradeValue) || !gradeOptions.includes(gradeValue))) {
    return null;
  }

  if (province && !studentProvinceOptions.includes(province)) return null;
  if (!Array.isArray(focuses) || focuses.some((focus) => !isStudyFocus(focus))) return null;

  return {
    grade: gradeValue,
    province,
    focuses: Array.from(new Set(focuses.filter(isStudyFocus))),
  };
}

export function getApplicationTracker(user: User | null | undefined): ApplicationTracker {
  const raw = user?.user_metadata?.[APPLICATION_TRACKER_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};

  const tracker: ApplicationTracker = {};
  for (const [opportunityId, value] of Object.entries(raw)) {
    if (!isKnownOpportunityId(opportunityId)) continue;
    const record = parseApplicationRecord(value);
    if (record) tracker[opportunityId] = record;
  }

  return tracker;
}

export function parseApplicationRecord(value: unknown): ApplicationRecord | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const status = raw.status;
  if (!isApplicationStatus(status)) return null;

  return {
    status,
    note: typeof raw.note === 'string' ? raw.note.slice(0, 500) : '',
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : '',
  };
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === 'string' && applicationStatuses.includes(value as ApplicationStatus);
}

export function isKnownStudentProvince(value: unknown): value is string {
  return typeof value === 'string' && studentProvinceOptions.includes(value);
}

export function getRecommendedOpportunities(profile: StudentProfile, savedIds: string[] = []) {
  const saved = new Set(savedIds);

  return opportunities
    .filter((opportunity) => !saved.has(opportunity.id))
    .map((opportunity) => ({ opportunity, score: scoreOpportunity(opportunity, profile) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.opportunity.deadline.date && b.opportunity.deadline.date) {
        return a.opportunity.deadline.date.localeCompare(b.opportunity.deadline.date);
      }
      if (a.opportunity.deadline.date) return -1;
      if (b.opportunity.deadline.date) return 1;
      return Number(Boolean(b.opportunity.featured)) - Number(Boolean(a.opportunity.featured));
    })
    .slice(0, 6)
    .map(({ opportunity }) => opportunity);
}

function scoreOpportunity(opportunity: Opportunity, profile: StudentProfile) {
  let score = opportunity.featured ? 1 : 0;
  const gradeMatch = profile.grade === null || opportunity.grades.includes(profile.grade);
  const provinceMatch =
    !profile.province ||
    opportunity.province === profile.province ||
    opportunity.province === 'National' ||
    opportunity.province === 'Multiple provinces' ||
    opportunity.locationMode !== 'Canada';
  const focusMatch =
    !profile.focuses.length ||
    opportunity.studyFocus.includes('Any field') ||
    profile.focuses.some((focus) => opportunity.studyFocus.includes(focus));

  if (gradeMatch) score += 4;
  if (provinceMatch) score += 3;
  if (focusMatch) score += 3;
  return score;
}
