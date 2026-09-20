import type { User } from '@supabase/supabase-js';
import {
  supportedStudyFocuses,
  type Opportunity,
  type StudyFocus,
} from '@/app/data/opportunities';
import type { StudentProfile } from '@/lib/student-tools';

export const ROADMAP_KEY = 'maplepath_roadmap';

export type RoadmapGoal = 'explore' | 'build' | 'compete' | 'serve';
export type RoadmapFormat = 'mostly online' | 'mostly in person' | 'a mix of both';
export type RoadmapTime = '1–2 hours' | '3–5 hours' | '5+ hours';

export type RoadmapAnswers = {
  goal: RoadmapGoal;
  format: RoadmapFormat;
  time: RoadmapTime;
  focuses: StudyFocus[];
};

export type RoadmapStep = {
  number: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
};

export const roadmapGoalOptions: Array<{ value: RoadmapGoal; label: string; description: string }> = [
  { value: 'explore', label: 'Explore a field', description: 'Try a few low-pressure ways to learn what fits.' },
  { value: 'build', label: 'Build a project', description: 'Turn an idea or class interest into something tangible.' },
  { value: 'compete', label: 'Compete or earn recognition', description: 'Find challenges, contests, or awards with a clear finish line.' },
  { value: 'serve', label: 'Make an impact', description: 'Look for community, youth leadership, or service roles.' },
];

export const roadmapFormatOptions: RoadmapFormat[] = ['mostly online', 'mostly in person', 'a mix of both'];
export const roadmapTimeOptions: RoadmapTime[] = ['1–2 hours', '3–5 hours', '5+ hours'];

const emptyRoadmap: RoadmapAnswers = {
  goal: 'explore',
  format: 'a mix of both',
  time: '3–5 hours',
  focuses: [],
};

function isGoal(value: unknown): value is RoadmapGoal {
  return value === 'explore' || value === 'build' || value === 'compete' || value === 'serve';
}

function isFormat(value: unknown): value is RoadmapFormat {
  return roadmapFormatOptions.includes(value as RoadmapFormat);
}

function isTime(value: unknown): value is RoadmapTime {
  return roadmapTimeOptions.includes(value as RoadmapTime);
}

function isFocus(value: unknown): value is StudyFocus {
  return typeof value === 'string' && supportedStudyFocuses.includes(value as StudyFocus);
}

function scoreRoadmapOpportunity(opportunity: Opportunity, answers: RoadmapAnswers) {
  let score = 0;
  const type = opportunity.type;
  const format = opportunity.format ?? (opportunity.locationMode === 'Online' ? 'Online' : 'In person');

  if (answers.focuses.length) {
    if (answers.focuses.some((focus) => opportunity.studyFocus.includes(focus))) score += 6;
    if (opportunity.studyFocus.includes('Any field')) score += 2;
  }

  if (answers.format === 'mostly online' && format === 'Online') score += 3;
  if (answers.format === 'mostly in person' && format === 'In person') score += 3;
  if (answers.format === 'a mix of both' && format === 'Hybrid') score += 3;

  if (answers.goal === 'compete' && type === 'Competition') score += 6;
  if (answers.goal === 'build' && ['Program', 'Competition', 'Internship'].includes(type)) score += 3;
  if (answers.goal === 'serve' && ['Youth role', 'Program', 'Internship'].includes(type)) score += 6;
  if (answers.goal === 'explore' && ['Program', 'Internship'].includes(type)) score += 3;

  return score;
}

export function parseRoadmapAnswers(value: unknown): RoadmapAnswers | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const raw = value as Record<string, unknown>;
  if (!isGoal(raw.goal) || !isFormat(raw.format) || !isTime(raw.time) || !Array.isArray(raw.focuses)) {
    return null;
  }

  const focuses = Array.from(new Set(raw.focuses.filter(isFocus))).slice(0, 3);
  return { goal: raw.goal, format: raw.format, time: raw.time, focuses };
}

export function getRoadmapAnswers(user: User | null | undefined) {
  return parseRoadmapAnswers(user?.user_metadata?.[ROADMAP_KEY]) ?? { ...emptyRoadmap, focuses: [] };
}

export function buildRoadmapSteps(
  answers: RoadmapAnswers,
  profile: StudentProfile,
  savedCount: number,
  recommendations: Opportunity[],
): RoadmapStep[] {
  const focusLabel = answers.focuses.length ? answers.focuses.join(', ') : profile.focuses.join(', ');
  const firstFocus = focusLabel || 'a field you want to explore';
  const firstRecommendation = [...recommendations]
    .sort((a, b) => scoreRoadmapOpportunity(b, answers) - scoreRoadmapOpportunity(a, answers))[0];
  const goalBody =
    answers.goal === 'build'
      ? `Choose one ${firstFocus} project you can finish in a few weeks. Start with a small output: a prototype, article, experiment, design, or community plan.`
      : answers.goal === 'compete'
        ? `Shortlist one contest with a clear deadline and write down the deliverable. Your ${answers.time} weekly window is enough to make steady progress.`
        : answers.goal === 'serve'
          ? `Look for a youth role or community program connected to ${firstFocus}. Ask what the role actually involves before committing.`
          : `Start with one approachable listing connected to ${firstFocus}, then use the official page to learn what the day-to-day experience is like.`;

  return [
    {
      number: '01',
      title: 'Set your direction',
      body: profile.grade
        ? `You are planning from Grade ${profile.grade}${profile.province ? ` in ${profile.province}` : ''}. Keep your first choice connected to ${firstFocus}.`
        : `Complete your student profile so MaplePath can narrow choices for ${firstFocus}.`,
      href: '/dashboard',
      linkLabel: profile.grade ? 'Review profile' : 'Complete profile',
    },
    {
      number: '02',
      title: 'Pick one realistic next step',
      body: goalBody,
      href: firstRecommendation ? `/opportunities/${firstRecommendation.id}` : '/opportunities',
      linkLabel: firstRecommendation ? 'View a suggested listing' : 'Explore listings',
    },
    {
      number: '03',
      title: 'Build a shortlist',
      body: savedCount
        ? `You have ${savedCount} saved ${savedCount === 1 ? 'opportunity' : 'opportunities'}. Keep two or three options so one changing deadline does not stop your plan.`
        : 'Save two or three options with different deadlines. Compare the eligibility notes before you commit to one.',
      href: savedCount ? '/saved' : '/opportunities',
      linkLabel: savedCount ? 'Open saved list' : 'Find options to save',
    },
    {
      number: '04',
      title: 'Track the finish line',
      body: 'Move your saved opportunity into your dashboard, add a private note, and calendar the official deadline. Always submit through the organizer.',
      href: '/dashboard',
      linkLabel: 'Open application tracker',
    },
  ];
}
