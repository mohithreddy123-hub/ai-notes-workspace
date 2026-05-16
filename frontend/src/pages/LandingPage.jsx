import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import {
  Brain, Sparkles, CheckCircle2, ArrowRight, Star,
  FileText, Tag, Share2, BarChart3, Globe, Clock
} from 'lucide-react';

// ── Spotlight Card — shiny hover glow effect ────────────────────────────────
const SpotlightCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setPos(p => ({ ...p, opacity: 0 }));
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Spotlight glow that follows cursor */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.15), transparent 70%)`,
        }}
      />
      {children}
    </div>
  );
};

// ── Data ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    color: 'text-brand-600',
    bg: 'bg-brand-50',
    title: 'AI-Powered Summaries',
    desc: 'Write anything. AI reads your notes and generates a crisp summary instantly — so you never lose the big picture.',
  },
  {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Auto Action Items',
    desc: 'Buried tasks in meeting notes? AI extracts every actionable item, turning your notes into a ready to-do list.',
  },
  {
    icon: Sparkles,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Smart Title Suggestions',
    desc: "Can't name your note? Hit one button and AI suggests the perfect title based on what you actually wrote.",
  },
  {
    icon: Tag,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    title: 'Color-Coded Tags',
    desc: 'Organize notes with custom color tags. Filter by project, mood, or topic in one click.',
  },
  {
    icon: Share2,
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    title: 'Public Sharing',
    desc: 'Share any note publicly with a single click. Anyone with the link can read it — no account needed.',
  },
  {
    icon: BarChart3,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    title: 'Productivity Analytics',
    desc: 'See your weekly writing habits, most-used tags, and AI usage history on a beautiful dashboard.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Write your note', desc: 'Type anything — meeting notes, ideas, research, or journaling. Just start writing.', icon: FileText },
  { step: '02', title: 'Let AI do the work', desc: 'Click once. AI summarizes, extracts tasks, and suggests a title — all in seconds.', icon: Brain },
  { step: '03', title: 'Organize & Share', desc: 'Tag it, pin it, or share a public link. Your workspace, your rules.', icon: Globe },
];

const TESTIMONIALS = [
  { quote: "I stopped wasting 20 minutes summarizing meeting notes. The AI just does it.", name: 'Priya S.', role: 'Product Manager' },
  { quote: 'Finally a notes app that keeps up with how fast I think. The action items feature is game-changing.', name: 'Rahul K.', role: 'Startup Founder' },
  { quote: 'My team shares notes publicly for client updates. Clean, fast, no clutter.', name: 'Anjali M.', role: 'Freelance Designer' },
];

// ── NavBar ────────────────────────────────────────────────────────────────────
const NavBar = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
    <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/30">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-slate-900 font-display font-bold text-lg tracking-tight">MindNotes</span>
      </div>
      <div className="flex items-center gap-2">
        <Link to={ROUTES.LOGIN} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          Sign in
        </Link>
        <Link to={ROUTES.SIGNUP} className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2 rounded-lg transition-all shadow-sm shadow-brand-500/30 hover:shadow-brand-500/40">
          Get started free →
        </Link>
      </div>
    </div>
  </nav>
);

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroSection = () => (
  <section className="relative overflow-hidden py-28 md:py-40 px-6 bg-surface-light">
    {/* Background glow blobs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

    <div className="relative max-w-4xl mx-auto text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
        <Sparkles className="w-3.5 h-3.5" />
        Powered by Google Groq AI
      </div>

      <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 leading-tight mb-6 tracking-tight">
        Write notes.<br />
        <span className="bg-gradient-to-r from-brand-600 via-violet-500 to-pink-500 bg-clip-text text-transparent">
          AI does the rest.
        </span>
      </h1>

      <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
        MindNotes automatically summarizes your notes, pulls out action items,
        and organizes everything — so your brain stays free to think.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={ROUTES.SIGNUP}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-base transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5"
        >
          Start for free — no credit card
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl text-base border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
        >
          Sign in
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-10 md:gap-20">
        {[
          { label: 'Notes created', value: '50K+' },
          { label: 'AI summaries generated', value: '120K+' },
          { label: 'Happy users', value: '5K+' },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-display font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── App Preview ───────────────────────────────────────────────────────────────
const AppPreview = () => (
  <section className="px-6 py-6 max-w-6xl mx-auto">
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/80">
      {/* Browser chrome */}
      <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4 bg-white border border-slate-200 rounded-md px-3 py-0.5 text-xs text-slate-400 text-center">
          app.ainotes.workspace
        </div>
      </div>
      {/* App UI */}
      <div className="bg-white flex" style={{ minHeight: '440px' }}>
        {/* Sidebar */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 p-4 shrink-0 hidden md:block">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-800 font-semibold text-sm">My Workspace</span>
          </div>
          {['📝 All Notes', '📌 Pinned', '🏷️ Tags', '📊 Dashboard'].map((item, i) => (
            <div key={item} className={`px-3 py-2 rounded-lg text-sm mb-1 ${i === 0 ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              {item}
            </div>
          ))}
          <div className="mt-4 space-y-1">
            {['Q2 Planning', 'Design Review', 'Product Roadmap', 'Client Notes'].map(note => (
              <div key={note} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 truncate">
                {note}
              </div>
            ))}
          </div>
        </div>
        {/* Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">Work</span>
              <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full border border-pink-200">Q2</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">Q2 Marketing Strategy</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Our key focus areas for Q2 include improving brand awareness through social media campaigns,
              launching a referral program targeting existing users, and partnering with 3 industry influencers.
              Budget allocation needs to be finalized by Friday...
            </p>
            {/* AI Summary */}
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-3.5 h-3.5 text-brand-600" />
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">AI Summary</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Q2 strategy focuses on brand growth via social, a referral program, and influencer partnerships. Budget confirmed by end of week.
              </p>
            </div>
            {/* Action Items */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Action Items</span>
              </div>
              {['Finalize Q2 budget by Friday', 'Identify 3 influencer partners', 'Draft referral program structure'].map(item => (
                <div key={item} className="flex items-start gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <p className="text-slate-600 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ── Features ──────────────────────────────────────────────────────────────────
const FeaturesSection = () => (
  <section className="py-24 px-6 bg-slate-50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-3">Everything you need</p>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">Built for how you actually think</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          No more copy-pasting into ChatGPT. MindNotes does it all inside your workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <SpotlightCard
              key={f.title}
              className="p-6 bg-white border border-slate-200 hover:border-brand-300 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-brand-100 hover:-translate-y-1 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-slate-900 font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  </section>
);

// ── How It Works ──────────────────────────────────────────────────────────────
const HowItWorksSection = () => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-3">Simple by design</p>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">From note to insight in 3 steps</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {HOW_IT_WORKS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div key={step.step} className="relative text-center">
              {idx < HOW_IT_WORKS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-slate-200 to-transparent" />
              )}
              <div className="w-16 h-16 bg-brand-50 border-2 border-brand-200 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10">
                <Icon className="w-7 h-7 text-brand-600" />
              </div>
              <div className="text-xs font-bold text-brand-500 mb-2 uppercase tracking-widest">{step.step}</div>
              <h3 className="text-slate-900 font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ── Testimonials ──────────────────────────────────────────────────────────────
const TestimonialsSection = () => (
  <section className="py-24 px-6 bg-slate-50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <p className="text-brand-600 text-sm font-semibold uppercase tracking-wider mb-3">Loved by users</p>
        <h2 className="text-4xl font-display font-bold text-slate-900">What people are saying</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <SpotlightCard
            key={t.name}
            className="p-6 bg-white border border-slate-200 hover:border-brand-200 rounded-2xl hover:shadow-md hover:shadow-brand-100 transition-all duration-300"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.quote}"</p>
            <div>
              <p className="text-slate-900 font-semibold text-sm">{t.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{t.role}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA ───────────────────────────────────────────────────────────────────────
const CTASection = () => (
  <section className="py-24 px-6 bg-white">
    <div className="max-w-3xl mx-auto text-center">
      <div className="relative p-12 bg-gradient-to-br from-brand-600 to-violet-600 rounded-3xl overflow-hidden shadow-xl shadow-brand-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Your notes deserve<br />to be smarter.
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Join thousands of people using AI to do more with their ideas.
          </p>
          <Link
            to={ROUTES.SIGNUP}
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-brand-700 hover:bg-brand-50 font-bold rounded-xl text-base transition-all shadow-xl hover:-translate-y-0.5"
          >
            Start writing for free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-brand-200 text-sm mt-4">No credit card. No limits. Just write.</p>
        </div>
      </div>
    </div>
  </section>
);

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-50 py-8 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-slate-600 text-sm font-semibold">MindNotes</span>
      </div>
      <p className="text-slate-400 text-xs">© 2026 MindNotes. Built with ❤️ and Groq AI.</p>
      <div className="flex items-center gap-6">
        <Link to={ROUTES.LOGIN} className="text-slate-400 hover:text-slate-700 text-sm transition-colors">Sign in</Link>
        <Link to={ROUTES.SIGNUP} className="text-slate-400 hover:text-slate-700 text-sm transition-colors">Sign up</Link>
      </div>
    </div>
  </footer>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const LandingPage = () => (
  <div className="min-h-screen bg-surface-light font-sans">
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

export default LandingPage;

