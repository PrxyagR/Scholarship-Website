'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Access & Cost',
    question: 'Is MaplePath really 100% free for Canadian students?',
    answer:
      'Yes, entirely free with no paywalls, locked tiers, or sponsored placement bias. We built MaplePath so every student across Canada—from Vancouver to St. John’s and the northern territories—has equal, friction-free access to merit awards, research programs, and youth councils regardless of their school budget or zip code.',
  },
  {
    category: 'Verification',
    question: 'How do you verify legitimacy and deadlines?',
    answer:
      'Every listing in our directory is hand-audited with direct links to official institutional websites (.ca, .gc.ca, university portals, registered charities, and reputable research institutes). We actively weed out essay scraping mills, pay-to-play contests, and expired portals. Each card displays a clear "Verified" badge and date stamp.',
  },
  {
    category: 'Younger Grades',
    question: 'Are there realistic opportunities for Grade 9 and Grade 10 students?',
    answer:
      'Absolutely! While major university entrance scholarships target Grade 12, top summer programs (like Shad Canada, Kirkness Science, and Deep River), hackathons, national math competitions, and municipal youth advisory councils are specifically designed for Grade 9 and 10 students. Starting in junior grades builds the extracurricular foundation that makes senior applications stand out.',
  },
  {
    category: 'Student Tools',
    question: 'How do the Roadmap and Calendar export features work?',
    answer:
      'When you bookmark an opportunity, it automatically populates your Student Dashboard. From there, you can drag and drop roles into your personalized high-school Roadmap, record private draft notes, update submission statuses (Saved → Drafting → Submitted → Won), and click "Export to Calendar" to download an .ics file that syncs with Apple Calendar, Google Calendar, or Outlook.',
  },
  {
    category: 'Submissions',
    question: 'Can student-led clubs and nonprofits list their opportunities?',
    answer:
      'Yes! We welcome youth non-profits, student clubs, and Canadian university labs to submit roles via our "Submit a Role" portal. Each submission is reviewed by our editorial team to ensure student safety, legitimate mentorship, and compliance with Canadian youth labor guidelines before being published.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <div className="w-full divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-sm">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="group transition-colors">
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left focus:outline-none focus-visible:bg-[var(--surface-sunken)]"
            >
              <div className="flex flex-col gap-1 pr-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--spruce-primary)]">
                  {faq.category}
                </span>
                <span className="font-serif text-base sm:text-lg font-bold text-[var(--ink-strong)] group-hover:text-[var(--maple-primary)] transition-colors">
                  {faq.question}
                </span>
              </div>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--ink-muted)] transition-all duration-200 ${
                  isOpen ? 'rotate-180 bg-[var(--spruce-primary)] text-white border-transparent' : 'group-hover:border-[var(--spruce-light)]'
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base leading-relaxed text-[var(--ink-body)] animate-fadeIn">
                <p className="border-t border-[var(--border-subtle)]/60 pt-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
