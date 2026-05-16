import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import {
  Brain, Sparkles, CheckCircle2, ArrowRight, Star,
  FileText, Tag, Share2, BarChart3, Zap, Lock,
  ChevronRight, Globe, Users, Clock
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Brain,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    title: 'AI-Powered Summaries',
    desc: 'Write anything. Our AI reads your notes and generates a crisp 2–4 sentence summary instantly — so you never lose the big picture.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    title: 'Auto Action Items',
    desc: 'Buried tasks in meeting notes? AI extracts every actionable item automatically, turning your notes into a ready-to-use to-do list.',
  },
  {
    icon: Sparkles,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    title: 'Smart Title Suggestions',
    desc: "Can't name your note? Hit one button and AI suggests the perfect title based on what you actually wrote.",
  },
  {
    icon: Tag,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    title: 'Color-Coded Tags',
    desc: 'Organize notes your way with custom color tags. Filter by project, mood, or topic in one click.',
  },
  {
    icon: Share2,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
    title: 'Public Sharing',
    desc: 'Share any note publicly with a single click. Anyone with the link can read it — no account needed.',
  },
  {
    icon: BarChart3,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    title: 'Productivity Analytics',
    desc: 'See your weekly writing habits, most-used tags, and AI usage history on a beautiful dashboard.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Write your note',
    desc: 'Type anything — meeting notes, ideas, research, journaling. Just start writing.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Let AI do the work',
    desc: 'Click once. AI summarizes, extracts tasks, and suggests a title — all in seconds.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Organize & Share',
    desc: 'Tag it, pin it, or share a public link. Your workspace, your rules.',
    icon: Globe,
  },
];

const SOCIAL_PROOF = [
  {
    quote: "I stopped wasting 20 minutes summarizing meeting notes. The AI just does it.",
    name: 'Priya S.',
    role: 'Product Manager',
  },
  {
    quote: 'Finally a notes app that keeps up with how fast I think. The action items feature is game-changing.',
    name: 'Rahul K.',
    role: 'Startup Founder',
  },
  {
    quote: 'My team shares notes publicly for client updates. Clean, fast, no clutter.',
    name: 'Anjali M.',
    role: 'Freelance Designer',
  },
];

// ── Components ────────────────────────────────────────────────────────────────

const NavBar = () => (
  <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">AI Notes</span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
        >
          Sign in
        </Link>
        <Link
          to={ROUTES.SIGNUP}
          className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors"
        >
          Get started free
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative overflow-hidden py-24 md:py-36 px-6">
    {/* Background glows */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] rounded-full" />
    </div>

    <div className="relative max-w-4xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        Powered by Google Gemini AI
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
        Write notes.<br />
        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
          AI does the rest.
        </span>
      </h1>

      <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
        AI Notes Workspace automatically summarizes your notes, pulls out action items,
        and organizes everything — so your brain stays free to think.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={ROUTES.SIGNUP}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-base transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
        >
          Start for free — no credit card
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-base border border-white/10 transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* Stats row */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {[
          { label: 'Notes created', value: '50K+' },
          { label: 'AI summaries generated', value: '120K+' },
          { label: 'Users worldwide', value: '5K+' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const AppPreview = () => (
  <section className="px-6 py-8 max-w-6xl mx-auto">
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/50">
      {/* Fake browser chrome */}
      <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="flex-1 mx-4 bg-slate-700 rounded-md px-3 py-1 text-xs text-slate-400">
          app.ainotes.workspace
        </div>
      </div>
      {/* Dashboard UI preview */}
      <div className="bg-slate-900 flex" style={{ minHeight: '480px' }}>
        {/* Sidebar */}
        <div className="w-60 bg-slate-950 border-r border-slate-800 p-4 shrink-0 hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">My Workspace</span>
          </div>
          {['📝 All Notes', '📌 Pinned', '🏷️ Tags', '📊 Dashboard'].map((item, i) => (
            <div key={item} className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 0 ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400'}`}>
              {item}
            </div>
          ))}
          <div className="mt-6 space-y-2">
            {['Q2 Planning', 'Design Review', 'Product Roadmap', 'Client Notes'].map(note => (
              <div key={note} className="px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-800 cursor-pointer truncate transition-colors">
                {note}
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Work</span>
              <span className="text-xs bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full border border-pink-500/30">Q2</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Q2 Marketing Strategy</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Our key focus areas for Q2 include improving brand awareness through social media campaigns,
              launching a referral program targeting existing users, and partnering with 3 industry influencers.
              Budget allocation needs to be finalized by Friday...
            </p>

            {/* AI Summary Card */}
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                The Q2 strategy focuses on brand growth via social media, a referral program, and influencer partnerships. Budget must be confirmed by end of week.
              </p>
            </div>

            {/* Action Items Card */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Action Items</span>
              </div>
              {['Finalize Q2 budget by Friday', 'Identify 3 influencer partners', 'Draft referral program structure'].map(item => (
                <div key={item} className="flex items-start gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <p className="text-slate-300 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Everything you need</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for how you actually think</h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          No more copy-pasting into ChatGPT. No more losing important tasks in long notes. AI Notes does it all inside your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="group p-6 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-24 px-6 bg-slate-900/50">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Simple by design</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">From note to insight in 3 steps</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {HOW_IT_WORKS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="relative text-center">
              {/* Connector line */}
              {idx < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}
              <div className="w-16 h-16 bg-slate-800 border-2 border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                <Icon className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-widest">{step.step}</div>
              <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-3">Loved by users</p>
        <h2 className="text-4xl font-bold text-white">What people are saying</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SOCIAL_PROOF.map((t) => (
          <div key={t.name} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
            <div>
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <p className="text-slate-500 text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 px-6">
    <div className="max-w-3xl mx-auto text-center">
      <div className="relative p-12 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-violet-600/5" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your notes deserve to be smarter.
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of people using AI to do more with their ideas.
          </p>
          <Link
            to={ROUTES.SIGNUP}
            className="inline-flex items-center gap-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1"
          >
            Start writing for free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-500 text-sm mt-4">No credit card. No limits. Just write.</p>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-slate-800 py-8 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-slate-400 text-sm font-semibold">AI Notes Workspace</span>
      </div>
      <p className="text-slate-600 text-xs">© 2026 AI Notes Workspace. Built with ❤️ and Gemini AI.</p>
      <div className="flex items-center gap-6">
        <Link to={ROUTES.LOGIN} className="text-slate-500 hover:text-white text-sm transition-colors">Sign in</Link>
        <Link to={ROUTES.SIGNUP} className="text-slate-500 hover:text-white text-sm transition-colors">Sign up</Link>
      </div>
    </div>
  </footer>
);

// ── Page ──────────────────────────────────────────────────────────────────────

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <NavBar />
      <HeroSection />
      <AppPreview />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
