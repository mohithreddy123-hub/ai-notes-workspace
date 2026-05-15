import { useDashboardStats } from '../../hooks/useAnalytics';
import { Skeleton } from '../../components/ui/Feedback';
import { 
  FileText, Sparkles, Tags, Activity, ArrowUpRight, 
  Clock, Database, BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatDistanceToNow, parseISO } from 'date-fns';

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {subtitle && (
      <div className="mt-4 flex items-center text-sm">
        <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
        <span className="text-emerald-500 font-medium">{subtitle}</span>
        <span className="text-slate-400 ml-2">this week</span>
      </div>
    )}
  </div>
);

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-3">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</p>
        <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
          {payload[0].value} {payload[0].name === 'notes_created' ? 'Notes' : 'Requests'}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
          Failed to load dashboard statistics.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
            Productivity Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track your note-taking habits and AI usage insights.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Notes" 
            value={stats.total_notes} 
            subtitle={`+${stats.notes_this_week}`}
            icon={FileText} 
            colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          />
          <StatCard 
            title="AI Generations" 
            value={stats.ai_stats.total_requests} 
            icon={Sparkles} 
            colorClass="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
          />
          <StatCard 
            title="Tokens Used" 
            value={(stats.ai_stats.tokens_used_this_week || 0).toLocaleString()} 
            icon={Database} 
            colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          />
          <StatCard 
            title="Active Tags" 
            value={stats.most_used_tags.length} 
            icon={Tags} 
            colorClass="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
          />
        </div>

        {/* Main Charts & Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activity Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Note Creation Activity (Last 7 Days)
              </h2>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weekly_activity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getMonth()+1}/${d.getDate()}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="notes_created" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorNotes)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recently Edited Notes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-brand-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recently Edited
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4">
              {stats.recently_edited.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-10">
                  No recent notes found.
                </p>
              ) : (
                stats.recently_edited.map(note => (
                  <div key={note.id} className="group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer">
                    <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-1">
                      {note.title || 'Untitled Note'}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(parseISO(note.updated_at), { addSuffix: true })}
                      </span>
                      {note.word_count > 0 && (
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          {note.word_count}w
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Usage Breakdown (Future expansion space) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mt-2">
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-2">
                 <BrainCircuit className="w-5 h-5 text-brand-500" />
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                   Top Tags Distribution
                 </h2>
               </div>
             </div>
             
             {stats.most_used_tags.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
                  You haven't used any tags yet.
                </p>
             ) : (
               <div className="flex flex-wrap gap-3">
                 {stats.most_used_tags.map(tag => (
                   <div key={tag.id} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                     <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                     <div>
                       <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{tag.name}</p>
                       <p className="text-xs text-slate-500">{tag.notes_count} notes</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
