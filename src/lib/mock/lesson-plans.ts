// Shared mock lesson plan data used across Calendar, My Plans, and Library tabs.
// When real DB/API data is wired up, remove this file and update the imports.

export interface MockLessonPlan {
  id: string;
  title: string;
  description: string | null;
  gradeLevel: string;
  topic: string;
  languageSkill: string;
  tags: string[];
  // Calendar scheduling
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  // Library / My Plans
  googleDriveUrl: string | null;
  copiedAt: string | null; // ISO datetime — null = not yet copied (Library only), non-null = copied (My Plans)
}

export const MOCK_LESSON_PLANS: MockLessonPlan[] = [
  {
    id: "1",
    startDate: "2026-03-02",
    endDate: "2026-03-04",
    title: "Animal Habitats",
    description: "Explore where different animals live and why, building habitat vocabulary through interactive activities.",
    gradeLevel: "K-2",
    topic: "Animals",
    languageSkill: "Vocabulary",
    tags: ["habitats", "science", "nature"],
    googleDriveUrl: null,
    copiedAt: "2026-02-28T10:30:00Z",
  },
  {
    id: "2",
    startDate: "2026-03-02",
    endDate: "2026-03-06",
    title: "Weather Words",
    description: "Learn weather-related vocabulary through songs, flashcards, and daily weather reporting.",
    gradeLevel: "K-2",
    topic: "Weather",
    languageSkill: "Vocabulary",
    tags: ["weather", "seasons", "daily routines"],
    googleDriveUrl: null,
    copiedAt: "2026-03-01T14:00:00Z",
  },
  {
    id: "3",
    startDate: "2026-03-09",
    endDate: "2026-03-11",
    title: "Community Helpers",
    description: "Practice speaking about community roles — firefighters, doctors, teachers — with role-play prompts.",
    gradeLevel: "3-5",
    topic: "Community",
    languageSkill: "Speaking",
    tags: ["community", "careers", "role-play"],
    googleDriveUrl: null,
    copiedAt: null,
  },
  {
    id: "4",
    startDate: "2026-03-10",
    endDate: "2026-03-13",
    title: "Ocean Life",
    description: "Guided reading passages about ocean creatures with comprehension questions.",
    gradeLevel: "K-2",
    topic: "Animals",
    languageSkill: "Reading",
    tags: ["ocean", "sea creatures", "reading comprehension"],
    googleDriveUrl: null,
    copiedAt: "2026-03-05T09:15:00Z",
  },
  {
    id: "5",
    startDate: "2026-03-16",
    endDate: "2026-03-20",
    title: "Plant Life Cycle",
    description: "Write about the stages of plant growth using sequencing words (first, next, then, finally).",
    gradeLevel: "3-5",
    topic: "Science",
    languageSkill: "Writing",
    tags: ["plants", "sequencing", "science journal"],
    googleDriveUrl: null,
    copiedAt: null,
  },
  {
    id: "6",
    startDate: "2026-03-16",
    endDate: "2026-03-18",
    title: "My Family",
    description: "Students share about their families using sentence frames and family vocabulary.",
    gradeLevel: "K-2",
    topic: "Family",
    languageSkill: "Speaking",
    tags: ["family", "sentence frames", "sharing"],
    googleDriveUrl: null,
    copiedAt: "2026-03-10T16:45:00Z",
  },
  {
    id: "7",
    startDate: "2026-03-18",
    endDate: "2026-03-20",
    title: "Shapes Around Us",
    description: "Identify and name 2D and 3D shapes found in everyday life.",
    gradeLevel: "K-2",
    topic: "Math",
    languageSkill: "Vocabulary",
    tags: ["shapes", "geometry", "math vocabulary"],
    googleDriveUrl: null,
    copiedAt: null,
  },
  {
    id: "8",
    startDate: "2026-03-19",
    endDate: "2026-03-20",
    title: "Healthy Foods",
    description: "Read about food groups and nutrition, then sort foods into categories.",
    gradeLevel: "3-5",
    topic: "Health",
    languageSkill: "Reading",
    tags: ["nutrition", "food groups", "health"],
    googleDriveUrl: null,
    copiedAt: "2026-03-12T11:00:00Z",
  },
  {
    id: "9",
    startDate: "2026-03-23",
    endDate: "2026-03-25",
    title: "Spring Vocabulary",
    description: "Seasonal vocabulary with picture cards, matching games, and sentence building.",
    gradeLevel: "K-2",
    topic: "Seasons",
    languageSkill: "Vocabulary",
    tags: ["spring", "seasons", "picture cards"],
    googleDriveUrl: null,
    copiedAt: null,
  },
  {
    id: "10",
    startDate: "2026-03-30",
    endDate: "2026-04-01",
    title: "Story Retelling",
    description: "Retell familiar stories using beginning, middle, and end structure.",
    gradeLevel: "3-5",
    topic: "Literacy",
    languageSkill: "Speaking",
    tags: ["retelling", "narrative", "story structure"],
    googleDriveUrl: null,
    copiedAt: "2026-03-15T08:30:00Z",
  },
  {
    id: "11",
    startDate: "2026-04-01",
    endDate: "2026-04-03",
    title: "Earth Day",
    description: "Write about ways to help the Earth using persuasive language.",
    gradeLevel: "K-2",
    topic: "Science",
    languageSkill: "Writing",
    tags: ["earth day", "environment", "persuasive writing"],
    googleDriveUrl: null,
    copiedAt: null,
  },
  {
    id: "12",
    startDate: "2026-04-06",
    endDate: "2026-04-08",
    title: "Transportation",
    description: "Learn vocabulary for different types of transportation and compare them.",
    gradeLevel: "K-2",
    topic: "Community",
    languageSkill: "Vocabulary",
    tags: ["transportation", "vehicles", "comparing"],
    googleDriveUrl: null,
    copiedAt: "2026-03-18T13:20:00Z",
  },
];

// ─── Shared constants ───────────────────────────────────────────────────────

export const TOPIC_COLORS: Record<string, string> = {
  Animals: "bg-[#84F1EC]/40 text-[#c4faf8]",
  Weather: "bg-indigo-500/40 text-indigo-100",
  Community: "bg-amber-500/40 text-amber-100",
  Science: "bg-emerald-500/40 text-emerald-100",
  Family: "bg-pink-500/40 text-pink-100",
  Math: "bg-violet-500/40 text-violet-100",
  Health: "bg-lime-500/40 text-lime-100",
  Seasons: "bg-orange-500/40 text-orange-100",
  Literacy: "bg-cyan-500/40 text-cyan-100",
};

export const TOPIC_BAR_COLORS: Record<string, string> = {
  Animals: "bg-[#84F1EC]/40 text-white border-[#84F1EC]/50",
  Weather: "bg-indigo-500/40 text-white border-indigo-400/50",
  Community: "bg-amber-500/40 text-white border-amber-400/50",
  Science: "bg-emerald-500/40 text-white border-emerald-400/50",
  Family: "bg-pink-500/40 text-white border-pink-400/50",
  Math: "bg-violet-500/40 text-white border-violet-400/50",
  Health: "bg-lime-500/40 text-white border-lime-400/50",
  Seasons: "bg-orange-500/40 text-white border-orange-400/50",
  Literacy: "bg-cyan-500/40 text-white border-cyan-400/50",
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── View helpers ───────────────────────────────────────────────────────────

/** Calendar view — just the scheduling fields */
export function getMockCalendarLessons() {
  return MOCK_LESSON_PLANS.map(({ id, title, gradeLevel, topic, languageSkill, startDate, endDate }) => ({
    id,
    title,
    gradeLevel,
    topic,
    languageSkill,
    startDate,
    endDate,
  }));
}

/** My Plans — only plans the user has "copied" */
export function getMockMyPlans() {
  return MOCK_LESSON_PLANS.filter((p) => p.copiedAt !== null);
}

/** Library — all plans */
export function getMockLibraryPlans() {
  return MOCK_LESSON_PLANS;
}
