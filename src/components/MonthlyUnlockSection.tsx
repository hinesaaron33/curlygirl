"use client";

import { useState } from "react";

interface Lesson {
  title: string;
  tags: string[];
  price: string;
  bundle?: boolean;
  includedIn?: string;
}

interface MonthData {
  num: string;
  month: string;
  theme: string;
  value: string;
  lessons: Lesson[];
}

interface TierData {
  label: string;
  lessonsPerMonth: number;
  avgValue: string;
  yearTotal: string;
  quarterlyCredit: string;
  yearlyCredit: string;
  months: MonthData[];
}

const TIERS: Record<string, TierData> = {
  starter: {
    label: "Starter",
    lessonsPerMonth: 2,
    avgValue: "~$14",
    yearTotal: "~$143",
    quarterlyCredit: "$5",
    yearlyCredit: "$20",
    months: [
      {
        num: "01", month: "August", theme: "Survival & Belonging", value: "$13.98",
        lessons: [
          { title: "ESL Newcomer Back to School Survival Phrases — First Week Unit", tags: ["Speaking", "Survival"], price: "$6.99" },
          { title: "ESL All About Me — Identity & Belonging Unit for ELL Newcomers", tags: ["Writing", "Identity"], price: "$6.99" },
        ],
      },
      {
        num: "02", month: "September", theme: "Listening & Phonics Foundation", value: "$14.98",
        lessons: [
          { title: "ESL ELL Newcomer Phonics — Letter Sounds & Word Families", tags: ["Phonics", "Literacy"], price: "$7.99" },
          { title: "ESL Listening Comprehension Bundle — Newcomer ELL Activities", tags: ["Bundle", "Listening"], price: "$6.99" },
        ],
      },
      {
        num: "03", month: "October", theme: "Seasonal Language & Vocabulary", value: "$13.98",
        lessons: [
          { title: "ESL Halloween Activities for ELL Newcomers — Vocabulary & Speaking", tags: ["Seasonal", "Vocabulary"], price: "$4.99" },
          { title: "ESL ELL Academic Vocabulary Instruction Unit — Tier 2 Words", tags: ["Bundle", "Academic"], price: "$8.99" },
        ],
      },
      {
        num: "04", month: "November", theme: "Present Tense & Daily Life", value: "$13.98",
        lessons: [
          { title: "ESL Simple Present Tense Unit — ELL Newcomer Grammar Practice", tags: ["Grammar", "Speaking"], price: "$6.99" },
          { title: "ESL Present Progressive Unit — ELL Newcomer Actions & Routines", tags: ["Grammar", "Writing"], price: "$6.99" },
        ],
      },
      {
        num: "05", month: "December", theme: "Cultural Awareness & Community", value: "$13.98",
        lessons: [
          { title: "ESL Winter Holidays Around the World — ELL Cultural Unit", tags: ["Seasonal", "Cultural"], price: "$6.99" },
          { title: "ESL ELL Newcomer Reading Comprehension — Non-Fiction Passages", tags: ["Bundle", "Reading"], price: "$6.99" },
        ],
      },
      {
        num: "06", month: "January", theme: "Past Tense & Personal Narrative", value: "$14.98",
        lessons: [
          { title: "ESL Simple Past Tense Unit — ELL Newcomer Grammar & Storytelling", tags: ["Grammar", "Speaking"], price: "$6.99" },
          { title: "ESL Personal Narrative Writing Unit — ELL Newcomers (My Story)", tags: ["Writing", "Identity"], price: "$7.99" },
        ],
      },
      {
        num: "07", month: "February", theme: "Black History Month & Civil Rights", value: "$14.98",
        lessons: [
          { title: "ESL Black History Month Activities — ELL Newcomers Reading & Discussion", tags: ["Seasonal", "Cultural"], price: "$6.99" },
          { title: "ESL ELL Opinion Writing Unit — Sentence Frames & Scaffolded Practice", tags: ["Bundle", "Writing"], price: "$7.99" },
        ],
      },
      {
        num: "08", month: "March", theme: "Speaking & ACCESS Prep", value: "$13.98",
        lessons: [
          { title: "ESL ELL Newcomer Speaking Practice — Conversation Starters & Discussion", tags: ["Speaking", "Academic"], price: "$6.99" },
          { title: "ACCESS Test Prep for ELL Newcomers — Speaking & Writing Practice", tags: ["Bundle", "Test Prep"], price: "$6.99" },
        ],
      },
      {
        num: "09", month: "April", theme: "Science Content Language", value: "$13.98",
        lessons: [
          { title: "ESL ELL Earth Day Activities — Newcomer Science Vocabulary & Writing", tags: ["Seasonal", "Science"], price: "$4.99" },
          { title: "ESL ELL Content-Area Vocabulary — Science & Social Studies Academic Language", tags: ["Bundle", "Academic"], price: "$8.99" },
        ],
      },
      {
        num: "10", month: "May", theme: "Future Tense & End of Year", value: "$14.98",
        lessons: [
          { title: "ESL Future Tense Unit — ELL Newcomer Goals, Plans & Dreams", tags: ["Grammar", "Speaking"], price: "$6.99" },
          { title: "ESL End of Year Reflection — ELL Portfolio & Celebration Activity", tags: ["Writing", "Identity"], price: "$7.99" },
        ],
      },
      {
        num: "11", month: "June / July", theme: "Summer School Planning", value: "$13.98",
        lessons: [
          { title: "ESL Summer School Starter Kit — ELL Newcomer Review & Practice", tags: ["Bundle", "Review"], price: "$6.99" },
          { title: "ESL Summer Plans Project — Vocabulary, Writing & Speaking Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        ],
      },
    ],
  },
  essential: {
    label: "Essential",
    lessonsPerMonth: 4,
    avgValue: "~$28",
    yearTotal: "~$280",
    quarterlyCredit: "$10",
    yearlyCredit: "$40",
    months: [
      {
        num: "01", month: "August", theme: "Survival, Belonging & Classroom Routines", value: "$27.96",
        lessons: [
          { title: "ESL Newcomer Back to School Survival Phrases — First Week Unit", tags: ["Speaking", "Survival"], price: "$6.99" },
          { title: "ESL All About Me — Identity & Belonging Unit for ELL Newcomers", tags: ["Writing", "Identity"], price: "$6.99" },
          { title: "ESL Classroom Routines & Directions — Newcomer Vocabulary Unit", tags: ["Vocabulary", "Routines"], price: "$6.99" },
          { title: "ESL Getting to Know You — Newcomer Icebreaker Speaking Activities", tags: ["Speaking", "Community"], price: "$6.99" },
        ],
      },
      {
        num: "02", month: "September", theme: "Phonics, Listening & Early Reading", value: "$28.96",
        lessons: [
          { title: "ESL ELL Newcomer Phonics — Letter Sounds & Word Families", tags: ["Phonics", "Literacy"], price: "$7.99" },
          { title: "ESL Listening Comprehension Bundle — Newcomer ELL Activities", tags: ["Bundle", "Listening"], price: "$6.99" },
          { title: "ESL Sight Words & High-Frequency Words — ELL Newcomer Practice", tags: ["Reading", "Vocabulary"], price: "$6.99" },
          { title: "ESL Guided Reading for Newcomers — Leveled Passages & Questions", tags: ["Reading", "Comprehension"], price: "$6.99" },
        ],
      },
      {
        num: "03", month: "October", theme: "Seasonal Vocabulary & Academic Language", value: "$27.96",
        lessons: [
          { title: "ESL Halloween Activities for ELL Newcomers — Vocabulary & Speaking", tags: ["Seasonal", "Vocabulary"], price: "$4.99" },
          { title: "ESL ELL Academic Vocabulary Instruction Unit — Tier 2 Words", tags: ["Bundle", "Academic"], price: "$8.99" },
          { title: "ESL Fall Vocabulary & Writing — Seasonal Language Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
          { title: "ESL Context Clues & Word Meaning — ELL Reading Strategies", tags: ["Reading", "Vocabulary"], price: "$6.99" },
        ],
      },
      {
        num: "04", month: "November", theme: "Grammar Foundations & Daily Life", value: "$27.96",
        lessons: [
          { title: "ESL Simple Present Tense Unit — ELL Newcomer Grammar Practice", tags: ["Grammar", "Speaking"], price: "$6.99" },
          { title: "ESL Present Progressive Unit — ELL Newcomer Actions & Routines", tags: ["Grammar", "Writing"], price: "$6.99" },
          { title: "ESL Daily Routines & Time — ELL Newcomer Life Skills Unit", tags: ["Vocabulary", "Life Skills"], price: "$6.99" },
          { title: "ESL Thanksgiving & Gratitude — Cultural Vocabulary & Writing", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        ],
      },
      { num: "05", month: "December", theme: "Cultural Awareness & Reading", value: "$27.96", lessons: [
        { title: "ESL Winter Holidays Around the World — ELL Cultural Unit", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        { title: "ESL ELL Newcomer Reading Comprehension — Non-Fiction Passages", tags: ["Bundle", "Reading"], price: "$6.99" },
        { title: "ESL Compare & Contrast — ELL Writing with Graphic Organizers", tags: ["Writing", "Academic"], price: "$6.99" },
        { title: "ESL Winter Vocabulary & Sentence Building — Newcomer Activities", tags: ["Vocabulary", "Seasonal"], price: "$6.99" },
      ]},
      { num: "06", month: "January", theme: "Past Tense & Narrative Writing", value: "$28.96", lessons: [
        { title: "ESL Simple Past Tense Unit — ELL Newcomer Grammar & Storytelling", tags: ["Grammar", "Speaking"], price: "$6.99" },
        { title: "ESL Personal Narrative Writing Unit — ELL Newcomers (My Story)", tags: ["Writing", "Identity"], price: "$7.99" },
        { title: "ESL Irregular Past Tense Verbs — ELL Practice & Activities", tags: ["Grammar", "Vocabulary"], price: "$6.99" },
        { title: "ESL New Year Goals & Resolutions — ELL Writing & Speaking", tags: ["Writing", "Speaking"], price: "$6.99" },
      ]},
      { num: "07", month: "February", theme: "History, Culture & Opinion Writing", value: "$28.96", lessons: [
        { title: "ESL Black History Month Activities — ELL Newcomers Reading & Discussion", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        { title: "ESL ELL Opinion Writing Unit — Sentence Frames & Scaffolded Practice", tags: ["Bundle", "Writing"], price: "$7.99" },
        { title: "ESL Valentines Day Vocabulary & Card Writing — ELL Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        { title: "ESL Fact vs Opinion — ELL Critical Thinking & Reading", tags: ["Reading", "Academic"], price: "$6.99" },
      ]},
      { num: "08", month: "March", theme: "Speaking, Test Prep & Research", value: "$27.96", lessons: [
        { title: "ESL ELL Newcomer Speaking Practice — Conversation Starters & Discussion", tags: ["Speaking", "Academic"], price: "$6.99" },
        { title: "ACCESS Test Prep for ELL Newcomers — Speaking & Writing Practice", tags: ["Bundle", "Test Prep"], price: "$6.99" },
        { title: "ESL Research Skills for ELLs — Note-Taking & Source Evaluation", tags: ["Academic", "Writing"], price: "$6.99" },
        { title: "ESL Spring Vocabulary & Descriptive Writing — Newcomer Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
      ]},
      { num: "09", month: "April", theme: "Science Language & Content Vocabulary", value: "$27.96", lessons: [
        { title: "ESL ELL Earth Day Activities — Newcomer Science Vocabulary & Writing", tags: ["Seasonal", "Science"], price: "$4.99" },
        { title: "ESL ELL Content-Area Vocabulary — Science & Social Studies Academic Language", tags: ["Bundle", "Academic"], price: "$8.99" },
        { title: "ESL Cause & Effect — ELL Reading & Writing with Graphic Organizers", tags: ["Reading", "Academic"], price: "$6.99" },
        { title: "ESL Science Lab Vocabulary — ELL Newcomer STEM Language", tags: ["Science", "Vocabulary"], price: "$6.99" },
      ]},
      { num: "10", month: "May", theme: "Future Tense & End of Year", value: "$28.96", lessons: [
        { title: "ESL Future Tense Unit — ELL Newcomer Goals, Plans & Dreams", tags: ["Grammar", "Speaking"], price: "$6.99" },
        { title: "ESL End of Year Reflection — ELL Portfolio & Self-Assessment", tags: ["Writing", "Identity"], price: "$7.99" },
        { title: "ESL Summer Reading List & Book Talks — ELL Discussion Activities", tags: ["Reading", "Speaking"], price: "$6.99" },
        { title: "ESL End of Year Awards & Certificates — ELL Celebration Kit", tags: ["Community", "Seasonal"], price: "$6.99" },
      ]},
      { num: "11", month: "June / July", theme: "Summer School Planning", value: "$27.96", lessons: [
        { title: "ESL Summer School Starter Kit — ELL Newcomer Review & Practice", tags: ["Bundle", "Review"], price: "$6.99" },
        { title: "ESL Summer Plans Project — Vocabulary, Writing & Speaking Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        { title: "ESL Summer Reading Comprehension — ELL Leveled Passages", tags: ["Reading", "Comprehension"], price: "$6.99" },
        { title: "ESL Summer Vocabulary & Journal Writing — ELL Daily Practice", tags: ["Writing", "Vocabulary"], price: "$6.99" },
      ]},
    ],
  },
  proPlus: {
    label: "Professional Plus",
    lessonsPerMonth: 6,
    avgValue: "~$42",
    yearTotal: "~$420",
    quarterlyCredit: "$20",
    yearlyCredit: "$80",
    months: [
      {
        num: "01", month: "August", theme: "Complete Back to School Launch", value: "$41.94",
        lessons: [
          { title: "ESL Newcomer Back to School Survival Phrases — First Week Unit", tags: ["Speaking", "Survival"], price: "$6.99" },
          { title: "ESL All About Me — Identity & Belonging Unit for ELL Newcomers", tags: ["Writing", "Identity"], price: "$6.99" },
          { title: "ESL Classroom Routines & Directions — Newcomer Vocabulary Unit", tags: ["Vocabulary", "Routines"], price: "$6.99" },
          { title: "ESL Getting to Know You — Newcomer Icebreaker Speaking Activities", tags: ["Speaking", "Community"], price: "$6.99" },
          { title: "ESL School Vocabulary & Navigation — Building Map & Campus Tour", tags: ["Vocabulary", "Life Skills"], price: "$6.99" },
          { title: "ESL Parent Communication Templates — Newcomer Family Welcome Kit", tags: ["Bundle", "Community"], price: "$6.99" },
        ],
      },
      {
        num: "02", month: "September", theme: "Literacy Foundations & Assessment", value: "$43.94",
        lessons: [
          { title: "ESL ELL Newcomer Phonics — Letter Sounds & Word Families", tags: ["Phonics", "Literacy"], price: "$7.99" },
          { title: "ESL Listening Comprehension Bundle — Newcomer ELL Activities", tags: ["Bundle", "Listening"], price: "$6.99" },
          { title: "ESL Sight Words & High-Frequency Words — ELL Newcomer Practice", tags: ["Reading", "Vocabulary"], price: "$6.99" },
          { title: "ESL Guided Reading for Newcomers — Leveled Passages & Questions", tags: ["Reading", "Comprehension"], price: "$6.99" },
          { title: "ESL Initial Assessment & Placement Kit — ELL Newcomer Screening", tags: ["Assessment", "Academic"], price: "$7.99" },
          { title: "ESL Alphabet & Letter Formation — ELL Newcomer Handwriting Practice", tags: ["Literacy", "Writing"], price: "$6.99" },
        ],
      },
      {
        num: "03", month: "October", theme: "Vocabulary Deep Dive & Seasonal Projects", value: "$41.94",
        lessons: [
          { title: "ESL Halloween Activities for ELL Newcomers — Vocabulary & Speaking", tags: ["Seasonal", "Vocabulary"], price: "$4.99" },
          { title: "ESL ELL Academic Vocabulary Instruction Unit — Tier 2 Words", tags: ["Bundle", "Academic"], price: "$8.99" },
          { title: "ESL Fall Vocabulary & Writing — Seasonal Language Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
          { title: "ESL Context Clues & Word Meaning — ELL Reading Strategies", tags: ["Reading", "Vocabulary"], price: "$6.99" },
          { title: "ESL Dictionary & Reference Skills — ELL Research Foundations", tags: ["Academic", "Vocabulary"], price: "$6.99" },
          { title: "ESL Dia de los Muertos — Cultural Celebration & Writing Unit", tags: ["Cultural", "Writing"], price: "$6.99" },
        ],
      },
      { num: "04", month: "November", theme: "Grammar Mastery & Life Skills", value: "$41.94", lessons: [
        { title: "ESL Simple Present Tense Unit — ELL Newcomer Grammar Practice", tags: ["Grammar", "Speaking"], price: "$6.99" },
        { title: "ESL Present Progressive Unit — ELL Newcomer Actions & Routines", tags: ["Grammar", "Writing"], price: "$6.99" },
        { title: "ESL Daily Routines & Time — ELL Newcomer Life Skills Unit", tags: ["Vocabulary", "Life Skills"], price: "$6.99" },
        { title: "ESL Thanksgiving & Gratitude — Cultural Vocabulary & Writing", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        { title: "ESL Subject-Verb Agreement — ELL Grammar Practice & Games", tags: ["Grammar", "Academic"], price: "$6.99" },
        { title: "ESL Food & Nutrition Vocabulary — ELL Health & Life Skills", tags: ["Vocabulary", "Life Skills"], price: "$6.99" },
      ]},
      { num: "05", month: "December", theme: "Culture, Reading & Writing Workshop", value: "$41.94", lessons: [
        { title: "ESL Winter Holidays Around the World — ELL Cultural Unit", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        { title: "ESL ELL Newcomer Reading Comprehension — Non-Fiction Passages", tags: ["Bundle", "Reading"], price: "$6.99" },
        { title: "ESL Compare & Contrast — ELL Writing with Graphic Organizers", tags: ["Writing", "Academic"], price: "$6.99" },
        { title: "ESL Winter Vocabulary & Sentence Building — Newcomer Activities", tags: ["Vocabulary", "Seasonal"], price: "$6.99" },
        { title: "ESL Letter Writing — Friendly & Formal Letters for ELL Newcomers", tags: ["Writing", "Life Skills"], price: "$6.99" },
        { title: "ESL Holiday Traditions Presentation Project — ELL Speaking & Culture", tags: ["Speaking", "Cultural"], price: "$6.99" },
      ]},
      { num: "06", month: "January", theme: "Past Tense, Narrative & Goal Setting", value: "$43.94", lessons: [
        { title: "ESL Simple Past Tense Unit — ELL Newcomer Grammar & Storytelling", tags: ["Grammar", "Speaking"], price: "$6.99" },
        { title: "ESL Personal Narrative Writing Unit — ELL Newcomers (My Story)", tags: ["Writing", "Identity"], price: "$7.99" },
        { title: "ESL Irregular Past Tense Verbs — ELL Practice & Activities", tags: ["Grammar", "Vocabulary"], price: "$6.99" },
        { title: "ESL New Year Goals & Resolutions — ELL Writing & Speaking", tags: ["Writing", "Speaking"], price: "$6.99" },
        { title: "ESL Biography Reading & Writing — ELL Non-Fiction Unit", tags: ["Reading", "Writing"], price: "$7.99" },
        { title: "ESL Sequencing & Transition Words — ELL Narrative Writing Skills", tags: ["Writing", "Academic"], price: "$6.99" },
      ]},
      { num: "07", month: "February", theme: "History, Opinion & Persuasion", value: "$43.94", lessons: [
        { title: "ESL Black History Month Activities — ELL Newcomers Reading & Discussion", tags: ["Seasonal", "Cultural"], price: "$6.99" },
        { title: "ESL ELL Opinion Writing Unit — Sentence Frames & Scaffolded Practice", tags: ["Bundle", "Writing"], price: "$7.99" },
        { title: "ESL Valentines Day Vocabulary & Card Writing — ELL Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        { title: "ESL Fact vs Opinion — ELL Critical Thinking & Reading", tags: ["Reading", "Academic"], price: "$6.99" },
        { title: "ESL Persuasive Writing — ELL Argument & Evidence Building", tags: ["Writing", "Academic"], price: "$7.99" },
        { title: "ESL Famous Leaders & Changemakers — ELL Reading & Discussion", tags: ["Reading", "Cultural"], price: "$6.99" },
      ]},
      { num: "08", month: "March", theme: "Speaking, Test Prep & Research Skills", value: "$41.94", lessons: [
        { title: "ESL ELL Newcomer Speaking Practice — Conversation Starters & Discussion", tags: ["Speaking", "Academic"], price: "$6.99" },
        { title: "ACCESS Test Prep for ELL Newcomers — Speaking & Writing Practice", tags: ["Bundle", "Test Prep"], price: "$6.99" },
        { title: "ESL Research Skills for ELLs — Note-Taking & Source Evaluation", tags: ["Academic", "Writing"], price: "$6.99" },
        { title: "ESL Spring Vocabulary & Descriptive Writing — Newcomer Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        { title: "ESL Presentation Skills — ELL Public Speaking & Slide Design", tags: ["Speaking", "Academic"], price: "$6.99" },
        { title: "ESL Debate & Discussion — ELL Structured Academic Conversations", tags: ["Speaking", "Academic"], price: "$6.99" },
      ]},
      { num: "09", month: "April", theme: "STEM Language & Cross-Curricular", value: "$41.94", lessons: [
        { title: "ESL ELL Earth Day Activities — Newcomer Science Vocabulary & Writing", tags: ["Seasonal", "Science"], price: "$4.99" },
        { title: "ESL ELL Content-Area Vocabulary — Science & Social Studies Academic Language", tags: ["Bundle", "Academic"], price: "$8.99" },
        { title: "ESL Cause & Effect — ELL Reading & Writing with Graphic Organizers", tags: ["Reading", "Academic"], price: "$6.99" },
        { title: "ESL Science Lab Vocabulary — ELL Newcomer STEM Language", tags: ["Science", "Vocabulary"], price: "$6.99" },
        { title: "ESL Math Word Problems — ELL Language & Problem Solving", tags: ["Math", "Academic"], price: "$6.99" },
        { title: "ESL Community & Environment Project — ELL Service Learning", tags: ["Writing", "Community"], price: "$6.99" },
      ]},
      { num: "10", month: "May", theme: "Future Tense, Portfolios & Celebration", value: "$43.94", lessons: [
        { title: "ESL Future Tense Unit — ELL Newcomer Goals, Plans & Dreams", tags: ["Grammar", "Speaking"], price: "$6.99" },
        { title: "ESL End of Year Reflection — ELL Portfolio & Self-Assessment", tags: ["Writing", "Identity"], price: "$7.99" },
        { title: "ESL Summer Reading List & Book Talks — ELL Discussion Activities", tags: ["Reading", "Speaking"], price: "$6.99" },
        { title: "ESL Student Portfolio Showcase — Year-End Presentation Project", tags: ["Speaking", "Academic"], price: "$7.99" },
        { title: "ESL Goodbye & Thank You — End of Year Letters & Memory Book", tags: ["Writing", "Community"], price: "$6.99" },
        { title: "ESL End of Year Awards & Certificates — ELL Celebration Kit", tags: ["Community", "Seasonal"], price: "$6.99" },
      ]},
      { num: "11", month: "June / July", theme: "Summer School Planning", value: "$43.94", lessons: [
        { title: "ESL Summer School Starter Kit — ELL Newcomer Review & Practice", tags: ["Bundle", "Review"], price: "$6.99" },
        { title: "ESL Summer Plans Project — Vocabulary, Writing & Speaking Activities", tags: ["Seasonal", "Writing"], price: "$6.99" },
        { title: "ESL Summer Reading Comprehension — ELL Leveled Passages", tags: ["Reading", "Comprehension"], price: "$6.99" },
        { title: "ESL Summer Vocabulary & Journal Writing — ELL Daily Practice", tags: ["Writing", "Vocabulary"], price: "$6.99" },
        { title: "ESL Summer School Grammar Review — ELL Tenses & Structures", tags: ["Grammar", "Review"], price: "$7.99" },
        { title: "ESL Summer Bridge Activities — ELL Transition to Next Grade", tags: ["Academic", "Bundle"], price: "$8.99" },
      ]},
    ],
  },
};

const TIER_KEYS = ["starter", "essential", "proPlus"] as const;

function Tag({ label, isBundle }: { label: string; isBundle: boolean }) {
  return (
    <span className={`inline-block text-sm px-2.5 py-0.5 rounded-full font-medium ${isBundle ? "bg-amber-100 text-amber-800" : "bg-white/60 text-ink/65 border border-ink/15"}`}>
      {label}
    </span>
  );
}

function getLessonTierLabel(tierKey: string, lessonIndex: number): string | null {
  if (tierKey === "starter") return null;
  if (tierKey === "essential") {
    return lessonIndex < 2 ? "Included in Starter" : null;
  }
  // proPlus
  if (lessonIndex < 2) return "Included in Starter";
  if (lessonIndex < 4) return "Included in Essential";
  return "Pro+ Exclusive";
}

function MonthRow({ data, isOpen, onToggle, tierKey }: { data: MonthData; isOpen: boolean; onToggle: () => void; tierKey: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/20 backdrop-blur-sm mb-3 transition-all duration-200">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-white/10 transition-colors">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-pink text-white text-base font-semibold flex items-center justify-center">
          {data.num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-base leading-tight">{data.month}</p>
          <p className="text-ink/65 text-sm mt-0.5">{data.theme}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm text-ink/65 mb-0.5">TPT value</p>
          <p className="text-base font-bold text-ink">{data.value}</p>
        </div>
        <svg className={`flex-shrink-0 w-4 h-4 text-ink/50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-white/30 divide-y divide-white/20">
          {data.lessons.map((lesson, i) => (
            <div key={i} className="flex items-start gap-3 px-6 py-3.5">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-pink mt-2.5" />
              <div className="flex-1 min-w-0">
                <p className="text-base text-ink leading-snug">{lesson.title}</p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {lesson.tags.map((tag) => <Tag key={tag} label={tag} isBundle={tag === "Bundle"} />)}
                </div>
              </div>
              <span className="flex-shrink-0 text-base font-semibold text-ink mt-0.5">{lesson.price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MonthlyUnlockSection() {
  const [activeTier, setActiveTier] = useState<typeof TIER_KEYS[number]>("starter");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const tier = TIERS[activeTier];
  const visibleMonths = showAll ? tier.months : tier.months.slice(0, 4);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  function switchTier(key: typeof TIER_KEYS[number]) {
    setActiveTier(key);
    setOpenIndex(0);
    setShowAll(false);
  }

  return (
    <section id="whats-included" className="py-20 px-4 bg-base-dark/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/40 border border-white/60 rounded-full px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold tracking-widest text-pink uppercase">What You Get</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4 font-[family-name:var(--font-playfair)]">
            Your year,{" "}
            <em className="text-pink">delivered.</em>
          </h2>
          <p className="text-ink/55 text-lg max-w-xl mx-auto leading-relaxed font-[family-name:var(--font-playfair)]">
            Every month, curated lesson plans unlock in your library. Each one classroom-tested and standards-aligned.
            {activeTier === "starter" && " Here\u2019s exactly what\u2019s coming your way."}
            {activeTier === "essential" && " Plus, swap any plan from 2-3 curated alternatives each month."}
            {activeTier === "proPlus" && " Plus, swap any plan for anything in the full library."}
          </p>
        </div>

        {/* Tier tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/30 p-1 backdrop-blur-sm">
            {TIER_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => switchTier(key)}
                className={`rounded-full px-6 py-2.5 text-base font-semibold transition-all ${
                  activeTier === key
                    ? "bg-pink text-white shadow-md"
                    : "text-ink/70 hover:text-ink"
                }`}
              >
                {TIERS[key].label}
                <span className="ml-1.5 text-sm opacity-70">({TIERS[key].lessonsPerMonth}/mo)</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { num: String(tier.lessonsPerMonth), label: "lessons per month" },
            { num: tier.avgValue, label: "avg TPT value / mo" },
            { num: tier.quarterlyCredit, label: "quarterly store credit" },
            { num: tier.yearTotal, label: "year-1 total TPT value" },
          ].map(({ num, label }) => (
            <div key={label} className="rounded-2xl bg-white/30 border border-white/50 backdrop-blur-sm px-5 py-5 text-center">
              <p className="text-4xl font-bold text-ink font-[family-name:var(--font-playfair)]">{num}</p>
              <p className="text-sm text-ink/75 mt-1.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Welcome credit callout */}
        <div className="mx-auto max-w-2xl rounded-2xl bg-gold border border-gold-dark px-8 py-4 flex items-center justify-center gap-5 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#1a7a50] text-white flex items-center justify-center text-2xl">🎁</div>
          <div>
            <p className="text-lg font-semibold text-ink">{tier.quarterlyCredit} quarterly credit or {tier.yearlyCredit} upfront with yearly purchase</p>
            <p className="text-base text-ink/80 mt-0.5">Go yearly and get {tier.yearlyCredit} on Day 1 to spend on any lesson or bundle.</p>
          </div>
        </div>

        {/* Month accordion */}
        <div>
          {visibleMonths.map((month, i) => (
            <MonthRow key={`${activeTier}-${i}`} data={month} isOpen={openIndex === i} onToggle={() => toggle(i)} tierKey={activeTier} />
          ))}
        </div>

        {!showAll ? (
          <button onClick={() => setShowAll(true)} className="w-full mt-2 py-3 rounded-2xl border border-white/50 bg-white/20 text-base font-medium text-ink/70 hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
            Show all 11 months
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        ) : (
          <button onClick={() => { setShowAll(false); setOpenIndex(0); }} className="w-full mt-2 py-3 rounded-2xl border border-white/50 bg-white/20 text-base font-medium text-ink/70 hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
            Collapse
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        )}

        <div className="text-center mt-10">
          <p className="text-ink/70 mb-4 text-base">All of this is included in every plan — starting at $9.99/month.</p>
          <a href="#pricing" className="inline-flex items-center gap-2 bg-pink text-white font-semibold px-8 py-3.5 rounded-full hover:bg-pink-dark transition-colors text-base">
            See Plans & Pricing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </section>
  );
}
