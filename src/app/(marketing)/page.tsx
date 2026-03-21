import Link from "next/link";
import { RevealProvider, RevealDiv } from "@/components/marketing/reveal-div";
import { LaptopMockup } from "@/components/marketing/laptop-mockup";
import { StatCard } from "@/components/marketing/stat-card";
import { PricingSection } from "@/components/marketing/pricing-section";
import { SignupSection } from "@/components/marketing/signup-section";

/* ── Marquee topics ── */
const topics = [
  "Narrative Writing", "Academic Vocabulary", "Reading Comprehension",
  "Speaking & Listening", "Grammar in Context", "Text Structures",
  "Argumentative Writing", "Poetry & Figurative Language", "Close Reading",
  "Collaborative Discussions", "Research Skills", "Media Literacy",
];

/* ── Core Feature Cards ── */
const coreFeatures = [
  {
    title: "Fresh Resources Every Month",
    description: "On the 1st of every month, new lesson plans land in your inbox. Reading passages, writing activities, speaking tasks, and more. No hunting through clunky websites.",
    emoji: "\uD83D\uDCEC",
    iconBg: "bg-pink/20",
  },
  {
    title: "Scope & Sequence Included",
    description: "No more guessing what to teach next. Higher-tier plans come with a full year of intentional, standards-aligned lessons mapped out day by day.",
    emoji: "\uD83D\uDCCB",
    iconBg: "bg-[#A78BFA]/35",
  },
  {
    title: "Filter & Find in Seconds",
    description: "Search by season, proficiency level, skill type, or unit theme. Everything is tagged and organized so the right lesson is always a click away.",
    emoji: "\uD83D\uDD0D",
    iconBg: "bg-gold/40",
  },
  {
    title: "Your Year, Your Way",
    description: "Customize your teaching calendar based on your students' needs. Mix thematic and foundational units, and we'll generate a plan that fits your schedule.",
    emoji: "\uD83D\uDCC5",
    iconBg: "bg-[#A8E6CF]/40",
  },
];

/* ── Pathway tags ── */
const thematicTags = ["Travel Project", "About Me", "World Cup", "Back to School", "Fall", "Winter", "Spring"];
const foundationalTags = ["Around the House", "Grocery & Money", "Family", "Community", "Health", "School Life"];

/* ── Testimonials ── */
const testimonials = [
  { quote: "Curly Girl ELD has completely transformed my planning. I used to spend my entire Sunday prepping. Now I spend 20 minutes customizing and I'm done.", name: "Maria G.", role: "7th Grade ELD, California", color: "bg-blush" },
  { quote: "The differentiation built into every lesson is incredible. My newcomer students and my bridging students can both access the same content.", name: "James T.", role: "8th Grade ELD, Texas", color: "bg-teal" },
  { quote: "I recommended Curly Girl to my entire department. We all use it now and our ELD block has never been more consistent or effective.", name: "Sandra L.", role: "6th Grade ELD, Arizona", color: "bg-gold" },
];

/* ── Star icon ── */
function Star() {
  return (
    <svg className="h-3.5 w-3.5 text-gold-dark" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <RevealProvider>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-base-light via-base to-base-dark">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-pink/[0.08] blur-[120px]" />
          <div className="absolute -right-20 top-1/3 h-[400px] w-[400px] rounded-full bg-white/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blush/[0.15] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-28 sm:pb-28 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 xl:gap-20">
            {/* Left column — text, CTAs, trust row */}
            <div>
              <div className="lg:animate-fade-in-up mb-8 h-1 w-16 rounded-full bg-gradient-to-r from-pink to-blush" />

              <p className="lg:animate-fade-in-up lg:delay-100 mb-6 inline-block whitespace-nowrap rounded-full bg-white px-4 py-1 text-lg font-semibold tracking-[0.1em] text-pink uppercase">
                Lesson Plans&ensp;For&ensp;Multilingual&ensp;Learners
              </p>

              <h1 className="lg:animate-fade-in-up lg:delay-200 max-w-3xl font-[family-name:var(--font-playfair)] text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-5xl xl:text-6xl">
                We make lesson planning
                <br />
                <em className="text-pink">
                  {"effortless.".split("").map((char, i) => (
                    <span
                      key={i}
                      className="animate-bounce-letter"
                      style={{ animationDelay: `${0.5 + i * 0.08}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </em>
              </h1>

              <p className="lg:animate-fade-in-up lg:delay-300 mt-8 max-w-xl text-lg leading-relaxed text-slate">
                Classroom tested and expertly crafted, standard-aligned ELD lesson plans specifically designed for secondary educators. This is your one stop shop for engaging and inclusive resources for multilingual learners.
              </p>

              <p className="lg:animate-fade-in-up lg:delay-350 mt-4 max-w-xl text-lg leading-relaxed text-slate">
                Flexible plans starting at $9.99/month. Every plan includes a curated lesson bundle plus monthly credits to unlock additional resources.
              </p>

              <div className="lg:animate-fade-in-up lg:delay-400 mt-10 flex flex-wrap items-center gap-4">
                <Link href="/#pricing" className="group inline-flex items-center gap-2 rounded-full border-2 border-gold bg-pink px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-pink/25 transition-all duration-300 hover:bg-white hover:text-pink hover:border-pink hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105">
                  GET STARTED
                  <span className="relative h-5 w-5">
                    <svg className="absolute inset-0 h-5 w-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                    <svg className="absolute inset-0 h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
                <Link href="#features" className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-white/30 px-8 py-3.5 text-base font-semibold text-ink/70 lg:backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-white/50 hover:text-ink hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-gold/20">
                  Shop Lessons
                  <span className="relative h-5 w-5">
                    <svg className="absolute inset-0 h-5 w-5 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                    <svg className="absolute inset-0 h-5 w-5 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              </div>

              {/* Trust row */}
              <div className="lg:animate-fade-in-up lg:delay-500 mt-14 flex flex-wrap items-center gap-6">
                <div className="flex -space-x-2.5">
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-teal shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-pink shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-gold shadow-md" />
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-blush shadow-md" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink/80">Trusted by 2500+ Educators</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} />)}</div>
                    <span className="text-xs text-ink/40">4.9/5 average rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column — laptop mockup */}
            <div className="relative mt-16 lg:mt-0">
              <div className="lg:animate-fade-in-up lg:delay-500">
                <LaptopMockup />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-ink/[0.08]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4 px-4 py-8 sm:px-6 lg:px-8">
            <StatCard countTo={700} label="Reviews" delay={500} bounce href="#testimonials" hoverLabel="READ REVIEWS" />
            <StatCard value={<>225<span className="text-4xl font-bold align-middle">+</span></>} label="Lesson Plans" />
            <StatCard countTo={2500} label="Educators Served" delay={1500} bounce />
            <StatCard value="9" label="Countries Reached" />
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <section className="overflow-hidden border-b border-ink/[0.06] bg-base-dark/50 py-6">
        <div className="flex whitespace-nowrap">
          <div className="animate-marquee flex items-center gap-10 pr-10">
            {[...topics, ...topics].map((t, i) => (
              <span key={i} className="flex items-center gap-10">
                <span className="text-sm font-medium text-ink/25">{t}</span>
                <span className="text-pink/40">&#9671;</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-20 right-[10%] h-[300px] w-[300px] rounded-full bg-white/15 blur-[100px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <RevealDiv><p className="inline-block rounded-full bg-white px-4 py-1 text-lg font-semibold tracking-[0.2em] text-pink uppercase">Our Story</p></RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight text-slate sm:text-4xl lg:text-[2.75rem]">
                Born from 15 Years of<br />&quot;There&apos;s Nothing Out There for My Students&quot;
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate">
                Here&apos;s the truth about ELD teaching: you get handed a roster of newcomers from 12 different countries, zero curriculum, and a &quot;good luck.&quot; I know because I lived it for 15 years. Curly Girl ELD exists so no teacher has to build their entire program from a blank Google Doc ever again. Every unit is thematic, standards aligned, and built from what actually works with secondary multilingual learners, not what looks good in a textbook.
              </p>
              <div className="mt-8">
                <Link href="/#pricing" className="group inline-flex items-center gap-2 rounded-full border-2 border-gold bg-pink px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink/25 transition-all duration-300 hover:bg-white hover:text-pink hover:border-pink hover:shadow-2xl hover:shadow-pink/40 hover:-translate-y-1 hover:scale-105">
                  GET STARTED
                  <span className="relative h-4 w-4">
                    <svg className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:opacity-0 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                    <svg className="absolute inset-0 h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </span>
                </Link>
              </div>
            </RevealDiv>
            <RevealDiv delay="delay-300">
              <ul className="mt-10 space-y-4">
                {["New plans added every month", "Created by certified ELD specialists", "Aligned to WIDA and state ELD standards", "Tested in real secondary classrooms"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink">
                      <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span className="text-sm text-slate">{item}</span>
                  </li>
                ))}
              </ul>
            </RevealDiv>
          </div>

          {/* Lesson card preview */}
          <RevealDiv delay="delay-200">
            <div className="rounded-2xl border border-white/40 bg-white/30 p-8 shadow-xl shadow-ink/[0.06] lg:backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-teal" />
                <span className="text-xs font-semibold tracking-wider text-teal-dark uppercase">Sample Lesson Plan</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-ink/[0.06] bg-white/60 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-pink/15 px-2.5 py-0.5 text-[11px] font-semibold text-pink-dark">Writing</span>
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <svg key={i} className="h-3 w-3 text-gold-dark" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}</div>
                  </div>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-lg font-semibold text-ink">Narrative Writing for ELLs</h3>
                  <p className="mt-1 text-xs text-ink/40">Grade 6–8 &bull; 45 min &bull; ELD Standards Aligned</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Vocabulary scaffolding", "Story structure", "Peer review"].map(tag => (
                      <span key={tag} className="rounded-md bg-base/40 px-2 py-0.5 text-[11px] text-ink/50">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-ink/[0.06] bg-white/40 p-5 opacity-60 shadow-sm">
                  <span className="rounded-full bg-teal/15 px-2.5 py-0.5 text-[11px] font-semibold text-teal-dark">Vocabulary</span>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-semibold text-ink/80">Science Vocabulary Building</h3>
                  <p className="mt-1 text-xs text-ink/30">Grade 7 &bull; 30 min</p>
                </div>
                <div className="rounded-xl border border-ink/[0.06] bg-white/30 p-5 opacity-35 shadow-sm">
                  <span className="rounded-full bg-blush/30 px-2.5 py-0.5 text-[11px] font-semibold text-pink-dark">Reading</span>
                  <h3 className="mt-3 font-[family-name:var(--font-playfair)] text-base font-semibold text-ink/60">Reading Comprehension Strategies</h3>
                  <p className="mt-1 text-xs text-ink/20">Grade 6–8 &bull; 50 min</p>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative overflow-hidden bg-base-dark py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute -bottom-20 left-[20%] h-[350px] w-[350px] rounded-full bg-pink/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ── 1. Membership Intro Header ── */}
          <div className="text-center">
            <RevealDiv>
              <span className="inline-block rounded-full bg-pink px-6 py-2 text-sm font-bold tracking-[0.2em] text-white uppercase">
                Introducing
              </span>
            </RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mx-auto mt-6 max-w-3xl font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
                The Curly Girl ELD{" "}
                <em className="text-pink drop-shadow-[0_1px_2px_rgba(240,108,155,0.3)]">Membership</em>
              </h2>
            </RevealDiv>
            <RevealDiv delay="delay-200">
              <p className="mx-auto mt-5 max-w-xl font-[family-name:var(--font-playfair)] text-[19px] leading-relaxed text-ink/70">
                Everything you need to teach ELD with confidence &mdash; delivered fresh to your inbox every month, so you can stop planning from scratch and start teaching what works.
              </p>
            </RevealDiv>
          </div>

          {/* ── 2. Core Feature Cards (2x2) ── */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
            {coreFeatures.map((f, i) => (
              <RevealDiv key={f.title} delay={`delay-${(i + 1) * 100}`}>
                <div className="h-full rounded-2xl border border-white/40 bg-white/30 p-9 shadow-sm lg:backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lg hover:shadow-pink/[0.08]">
                  <div className={`flex h-[48px] w-[48px] items-center justify-center rounded-xl ${f.iconBg}`}>
                    <span className="text-[22px]">{f.emoji}</span>
                  </div>
                  <h3 className="mt-5 text-[24px] font-bold text-ink">{f.title}</h3>
                  <p className="mt-3 text-[18px] leading-snug text-ink/65">{f.description}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TWO PATHWAYS ═══ */}
      <section className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealDiv>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Two Pathways, One Goal
              </h2>
            </RevealDiv>
            <RevealDiv delay="delay-100">
              <p className="mx-auto mt-4 max-w-xl text-base text-ink/55">
                Choose the curriculum track that fits your classroom &mdash; or mix and match both.
              </p>
            </RevealDiv>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pathway A */}
            <RevealDiv delay="delay-200">
              <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg shadow-ink/[0.06]">
                <div className="h-1.5 bg-pink" />
                <div className="p-8 sm:p-10">
                  <span className="inline-block rounded-full bg-pink/15 px-4 py-1.5 text-xs font-extrabold tracking-[0.15em] text-pink uppercase">
                    Pathway A
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-[1.85rem] font-bold leading-tight text-ink">
                    Thematic &amp; Seasonal Units
                  </h3>
                  <p className="mt-4 font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink/70">
                    Engaging, high-interest projects tied to seasons and real-world topics that get students talking, writing, and collaborating.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {thematicTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-pink-light bg-pink/[0.05] px-4 py-1.5 text-sm text-ink/65">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealDiv>

            {/* Pathway B */}
            <RevealDiv delay="delay-300">
              <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg shadow-ink/[0.06]">
                <div className="h-1.5 bg-gold" />
                <div className="p-8 sm:p-10">
                  <span className="inline-block rounded-full bg-gold/25 px-4 py-1.5 text-xs font-extrabold tracking-[0.15em] text-[#9A7B2D] uppercase">
                    Pathway B
                  </span>
                  <h3 className="mt-5 font-[family-name:var(--font-playfair)] text-[1.85rem] font-bold leading-tight text-ink">
                    Foundational ESL Units
                  </h3>
                  <p className="mt-4 font-[family-name:var(--font-playfair)] text-lg leading-relaxed text-ink/70">
                    Traditional, high-frequency life-skills topics that build the vocabulary and language structures newcomers need every day.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-2.5">
                    {foundationalTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-gold-light bg-gold/[0.05] px-4 py-1.5 text-sm text-ink/65">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ═══ QUIZ CTA ═══ */}
      <section className="relative overflow-hidden bg-base-dark py-20 sm:py-28">
        <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <RevealDiv>
            <div className="rounded-3xl bg-white px-10 py-14 text-center shadow-xl sm:px-16">
              <span className="text-4xl">{"\uD83C\uDFAF"}</span>
              <h2 className="mt-5 font-[family-name:var(--font-playfair)] text-3xl font-bold text-ink sm:text-[2.25rem]">
                Not Sure Which Plan Is Right for You?
              </h2>
              <p className="mx-auto mt-5 max-w-lg font-[family-name:var(--font-playfair)] text-[17px] leading-relaxed text-ink/55">
                Answer a few quick questions about your classroom, your district&apos;s resources, and what support you need &mdash; and we&apos;ll match you with your perfect plan.
              </p>
              <Link
                href="/quiz"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink px-10 py-4 text-[17px] font-semibold text-white shadow-lg shadow-pink/20 transition-all duration-300 hover:bg-pink-dark hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink/30"
              >
                Find Your Best Fit ✨
              </Link>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ═══ MONTHLY CREDITS ═══ */}
      <section className="relative overflow-hidden bg-base py-20 sm:py-28">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            {/* Left — white card with gold circle */}
            <RevealDiv>
              <div className="flex justify-center">
                <div className="rounded-2xl bg-white px-16 py-12 text-center shadow-lg shadow-ink/[0.06]">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light shadow-md shadow-gold/20">
                    <p className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-ink">$</p>
                  </div>
                  <p className="mt-5 text-[17px] text-ink/65">Every month you get</p>
                  <p className="mt-1.5 font-[family-name:var(--font-playfair)] text-[28px] font-bold text-ink">Store Credit</p>
                  <p className="mt-1.5 text-[17px] text-ink/55">to spend on any lesson plan</p>
                </div>
              </div>
            </RevealDiv>

            {/* Right — text */}
            <RevealDiv delay="delay-200">
              <div>
                <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold tracking-tight text-ink sm:text-[2.75rem]">
                  Credits That Add Up
                </h2>
                <p className="mt-5 font-[family-name:var(--font-playfair)] text-[19px] leading-snug text-ink/75">
                  Every month, your membership earns you <strong className="text-ink/90">store credit</strong> to spend on any individual lesson plan in the Curly Girl shop.
                </p>
                <p className="mt-3 font-[family-name:var(--font-playfair)] text-[19px] leading-snug text-ink/75">
                  Save them up for a big unit, or grab something you need right now. Either way, your subscription keeps paying for itself.
                </p>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <PricingSection />

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials" className="relative overflow-hidden bg-base py-28 sm:py-36">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <RevealDiv><p className="inline-block rounded-full bg-white px-4 py-1 text-lg font-semibold tracking-[0.2em] text-pink uppercase">Testimonials</p></RevealDiv>
            <RevealDiv delay="delay-100">
              <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight text-ink sm:text-4xl">Loved by educators everywhere</h2>
            </RevealDiv>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <RevealDiv key={t.name} delay={`delay-${(i + 1) * 100}`}>
                <div className="h-full rounded-2xl border border-white/40 bg-white/30 p-7 shadow-sm lg:backdrop-blur-sm">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(j => <Star key={j} />)}</div>
                  <p className="mt-5 text-sm leading-relaxed text-ink/55 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full ${t.color} shadow-sm`} />
                    <div>
                      <p className="text-sm font-semibold text-ink/80">{t.name}</p>
                      <p className="text-xs text-ink/35">{t.role}</p>
                    </div>
                  </div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SIGNUP ═══ */}
      <SignupSection />
    </RevealProvider>
  );
}
