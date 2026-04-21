import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeadConversationModal from '../components/LeadConversationModal';
import SalesAnalytics from '../components/SalesAnalytics';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Percent,
  Upload,
  X,
  FileSpreadsheet,
  AlertCircle,
  BarChart3,
  UserPlus,
  Mail,
  Phone,
  Target,
  MapPin,
  Layers,
  Coins,
  Plus,
  NotebookPen,
  Wallet,
  User,
  Bell,
  ChevronRight,
  TrendingDown,
  Activity,
  Flame,
  AlertTriangle,
  Clock,
  Search
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Skeleton, StatSkeleton, HeaderSkeleton, TableRowSkeleton, AnalyticsSkeleton, PulseSkeleton } from '../components/Skeleton';


const StatCard = React.memo(({ title, value, icon: Icon }) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 flex flex-col gap-3 shadow-[0_4px_25px_rgba(0,0,0,0.03)] h-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" 
      style={{background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.2) 100%)'}}>
      <Icon size={18} className="text-violet-600" />
    </div>
    <div>
      <h3 className="text-[20px] font-black text-slate-900 tracking-tight leading-none">{value}</h3>
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400 mt-2">{title}</p>
    </div>
  </div>
));

const FeaturedMetricCard = React.memo(({ value, subLabel }) => (
  <div className="bg-[#1a1f3a] rounded-2xl p-7 relative overflow-hidden flex flex-col justify-between h-full shadow-xl" style={{background: 'linear-gradient(135deg, #1e2a5e 0%, #2d1b69 50%, #1a1035 100%)'}}>
    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
    <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16" />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-8">
        <div className="w-10 h-10 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20 shadow-sm">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          18 MONTHS DATA
        </span>
      </div>
      <h2 className="text-4xl font-black text-white tracking-tighter mb-1 leading-none">{value}</h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{subLabel}</p>
    </div>
    <div className="relative z-10 mt-10 flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer group">
      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">View Detailed Analytics →</span>
    </div>
  </div>
));

const TeamPulseItem = React.memo(({ member, onClick }) => (
  <div 
    onClick={() => onClick(member)}
    className="px-5 py-4 hover:bg-slate-50 flex items-center justify-between group cursor-pointer border-b border-slate-100 last:border-0"
  >
    <div className="flex items-center gap-3.5">
      <div className="relative shrink-0">
        <img src={member.profilePic} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
        <p className="text-[11px] text-slate-400 font-medium">{member.email}</p>
      </div>
    </div>
    <div className="text-right shrink-0">
      <div className="flex items-center gap-1.5 justify-end mb-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Active Now</span>
      </div>
      <p className="text-[10px] font-semibold text-violet-500 group-hover:underline">View Pipeline →</p>
    </div>
  </div>
));

const LeaderboardItem = ({ name, value, percentage }) => (
  <div className="bg-[#1e1b4b]/40 border border-white/5 rounded-xl p-3.5 mb-3 last:mb-0 shadow-sm group hover:bg-[#1e1b4b]/60 transition-all">
    <div className="flex justify-between items-center mb-2.5">
      <span className="text-[11px] font-black text-white/90 uppercase tracking-widest">{name}</span>
      <span className="text-[11px] font-extrabold text-white">₹{value.toLocaleString()}</span>
    </div>
    <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
      <div 
        className="absolute inset-y-0 left-0 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)]" 
        style={{ 
          width: `${Math.max(percentage, 5)}%`,
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
        }} 
      />
    </div>
  </div>
);

const MonthCard = ({ month, data, onClick, user }) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const [year, monthNum] = month.split('-');
  const monthName = months[parseInt(monthNum) - 1];

  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">{monthName}</h4>
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-wider">
            {user?.role === 'sales-team' ? 'My Revenue' : 'Revenue'}
          </span>
          <span className="text-slate-900">₹{data?.revenue?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-emerald-500 uppercase tracking-wider">
            {user?.role === 'sales-team' ? 'My Received' : 'Received'}
          </span>
          <span className="text-emerald-600">₹{data?.received?.toLocaleString() || 0}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-wider">Available Leads</span>
          <span className="text-slate-900">{data?.available || 0}</span>
        </div>
        <div className="flex justify-between text-[11px] font-bold">
          <span className="text-slate-400 uppercase tracking-wider">
            {user?.role === 'sales-team' ? 'My Converted' : 'Converted'}
          </span>
          <span className="text-slate-900">{data?.converted || 0}</span>
        </div>
      </div>
    </div>
  );
};

const SalesDashboard = ({ mode = 'dashboard' }) => {
  const { user, fetchTeamStats } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberLeads, setMemberLeads] = useState({ followUp: [], converted: [], monthlyStats: [] });
  const [memberLeadsLoading, setMemberLeadsLoading] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [overdueProjects, setOverdueProjects] = useState([]);
  const [overdueLoading, setOverdueLoading] = useState(false);
  
  // Manual Entry State
  const [showManual, setShowManual] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualForm, setManualForm] = useState({
    leadId: '',
    name: '',
    phone: '',
    email: '',
    source: '',
    campaign: '',
    requirement: '',
    budget: '',
    location: ''
  });


  useEffect(() => {
    fetchStats();
    if (user?.role !== 'sales-team') {
      fetchTeam();
      fetchOverdueProjects();
    }
  }, [selectedYear]);

  const fetchTeam = async () => {
    setTeamLoading(true);
    try {
      const stats = await fetchTeamStats(selectedYear);
      setTeam(stats);
    } catch (err) {
      console.error('Failed to fetch sales team performance');
    } finally {
      setTeamLoading(false);
    }
  };

  const handleMemberClick = React.useCallback(async (member) => {
    setSelectedMember(member);
    setMemberLeadsLoading(true);
    try {
      const res = await API.get(`/sales/member-leads/${encodeURIComponent(member.name)}`);
      setMemberLeads(res.data.data);
    } catch (err) {
      console.error('Failed to fetch member leads');
    } finally {
      setMemberLeadsLoading(false);
    }
  }, []);

  const handleSearch = React.useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleMonthClick = React.useCallback((monthId) => {
    navigate(`/sales/month/${monthId}`);
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const res = await API.get(`/sales/dashboard?year=${selectedYear}`);
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch sales stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdueProjects = async () => {
    if (!['sales-manager', 'admin', 'super-admin'].includes(user?.role)) return;
    setOverdueLoading(true);
    try {
      const res = await API.get('/sales/overdue-projects');
      setOverdueProjects(res.data.data.overdueProjects);
    } catch (err) {
      console.error('Failed to fetch overdue projects');
    } finally {
      setOverdueLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post('/sales/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowUpload(false);
      setFile(null);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    try {
      await API.post('/sales/create-manual', manualForm);
      setShowManual(false);
      setManualForm({
        leadId: '', name: '', phone: '', email: '', source: '', 
        campaign: '', requirement: '', budget: '', location: ''
      });
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setManualLoading(false);
    }
  };

  const downloadSampleExcel = () => {
    const headers = [
      ['ID', 'Name', 'Phone', 'Email', 'Source', 'Campaign', 'Requirement', 'Budget', 'Location']
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers);
    
    // Set column widths
    const wscols = [
      {wch: 10}, {wch: 20}, {wch: 15}, {wch: 25}, {wch: 15}, {wch: 15}, {wch: 30}, {wch: 12}, {wch: 15}
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Sample Format");
    XLSX.writeFile(wb, "WorkSensy_Leads_Template.xlsx");
  };

  if (loading) return (
     <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-2">
           <Skeleton className="h-8 w-48 rounded-lg" />
           <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        
        <HeaderSkeleton>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => <StatSkeleton key={i} />)}
           </div>
        </HeaderSkeleton>
        
        <AnalyticsSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
           <PulseSkeleton />
           <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
              <Skeleton className="h-4 w-32" />
              {[1,2,3,4].map(i => <div key={i} className="flex justify-between items-center"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-10 w-1/4" /></div>)}
           </div>
           <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-full w-full" />
           </div>
        </div>
     </div>
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">

      {/* ─── HEADER CONTROLS (Title Badge + Year Selector) ─── */}
      <div className="flex items-center justify-between mb-2">
        <div className="inline-flex">
          <span className="px-4 py-1.5 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
            {mode === 'dashboard' ? 'Sales Overview' : 'Leads Repository'}
          </span>
        </div>

        <div className="bg-white/70 backdrop-blur-md border border-slate-200 shadow-sm px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Year</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
          >
            {(() => {
              const years = [];
              const startYear = 2024;
              const endYear = new Date().getFullYear() + 1;
              for (let y = startYear; y <= endYear; y++) years.push(y.toString());
              return years.map(y => <option key={y} value={y}>{y}</option>);
            })()}
          </select>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      {mode === 'dashboard' ? (
        <div className="space-y-5">

          {/* Row 1: Combined Header+KPI card (left) + Featured dark card (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

            {/* Unified Header title + All 5 KPI tiles in one frame */}
            <div className="lg:col-span-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-200/60 p-6 flex flex-col gap-6">
              {/* Header inside card */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg,#6366f1,#7c3aed)'}}>
                  <BarChart3 size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[22px] font-black text-slate-900 leading-tight tracking-tight">
                    Welcome back, {user?.name?.split(' ')[0]}
                  </h2>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.16em] mt-0.5">
                    Sales Analytics &amp; Team Tracking Dashboard
                  </p>
                </div>
              </div>

              {/* 5 KPI Tiles in one row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard 
                  title={user?.role === 'sales-team' ? "My Revenue" : "Total Revenue"} 
                  value={`₹${stats?.total?.revenue?.toLocaleString() || 0}`} 
                  icon={TrendingUp} 
                />
                <StatCard 
                  title={user?.role === 'sales-team' ? "My Received" : "Total Received"} 
                  value={`₹${stats?.total?.received?.toLocaleString() || 0}`} 
                  icon={Mail} 
                />
                <StatCard 
                  title={user?.role === 'sales-team' ? "My Leads" : "Total Leads"} 
                  value={stats?.total?.leads || 0} 
                  icon={Users} 
                />
                <StatCard 
                  title={user?.role === 'sales-team' ? "My Converted" : "Conversion Rate"} 
                  value={`${((stats?.total?.converted / (stats?.total?.leads || 1)) * 100).toFixed(1)}%`} 
                  icon={CheckCircle2} 
                />
                <div className="h-full">
                  <div className="bg-[#0f172a] rounded-2xl p-4 border border-slate-800 flex flex-col gap-3 shadow-xl h-full relative overflow-hidden group cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center relative z-10 border border-white/5">
                      <Flame size={16} className="text-orange-400" />
                    </div>
                    <div className="relative z-10 mt-auto">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">Growth Index</p>
                      <h3 className="text-lg font-black text-white tracking-tight leading-none">₹{stats?.total?.revenue?.toLocaleString() || 0}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Analytics Hub */}
          <SalesAnalytics stats={stats} user={user} />

          {/* Bottom Grid: Team Pulse + Leaderboard + Velocity (Manager only) */}
          {user?.role !== 'sales-team' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Sales Team Pulse */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-200/60 overflow-hidden flex flex-col h-full">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Sales Team Pulse</h3>
                  </div>
                </div>
                <div className="divide-y divide-slate-50 flex-1 overflow-auto">
                  {teamLoading ? (
                    <div className="p-12 flex justify-center">
                      <div className="w-6 h-6 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                  ) : team.length === 0 ? (
                    <div className="p-12 text-center h-full flex flex-col justify-center">
                      <Users size={28} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No team members</p>
                      <button onClick={() => navigate('/team')} className="mt-3 text-[10px] font-bold text-violet-500 uppercase tracking-widest hover:underline">Invite Members</button>
                    </div>
                  ) : (
                    team.map((member) => (
                      <TeamPulseItem key={member._id} member={member} onClick={handleMemberClick} />
                    ))
                  )}
                </div>
              </div>

              {/* Leaderboard */}
              <div className="rounded-2xl p-6 relative overflow-hidden flex flex-col h-full" style={{background: 'linear-gradient(135deg, #1e2a5e 0%, #2d1b69 50%, #1a1035 100%)'}}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl opacity-50" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 relative z-10">Leaderboard</h3>
                <div className="space-y-4 relative z-10 flex-1 overflow-auto">
                  {(() => {
                    const topEarners = [...team].sort((a,b) => (b.stats?.totalRevenue||0) - (a.stats?.totalRevenue||0));
                    const maxRev = Math.max(...topEarners.map(m => m.stats?.totalRevenue || 1), 1);
                    return topEarners.slice(0, 5).map((member) => (
                      <LeaderboardItem 
                        key={member._id} 
                        name={member.name} 
                        value={member.stats?.totalRevenue || 0} 
                        percentage={((member.stats?.totalRevenue || 0) / maxRev) * 100}
                      />
                    ));
                  })()}
                  {team.length === 0 && (
                    <p className="text-[10px] text-slate-500 italic text-center py-8">No data yet</p>
                  )}
                </div>
              </div>

              {/* Deadline Watch (Manager Only) */}
               {['sales-manager', 'admin', 'super-admin'].includes(user?.role) && (
                 <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border border-slate-200/60 overflow-hidden flex flex-col h-full">
                   <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/30">
                     <div className="flex items-center gap-2">
                       <AlertTriangle size={16} className="text-rose-500" />
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Deadline Alerts</h3>
                     </div>
                     {overdueProjects.length > 0 && (
                       <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                         {overdueProjects.length} CRITICAL
                       </span>
                     )}
                   </div>
                   <div className="divide-y divide-slate-50 flex-1 overflow-auto">
                     {overdueLoading ? (
                       <div className="p-12 flex justify-center">
                         <div className="w-6 h-6 border-2 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
                       </div>
                     ) : overdueProjects.length === 0 ? (
                       <div className="p-12 text-center h-full flex flex-col justify-center">
                         <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                           <CheckCircle2 size={20} />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                           Great Job! <br/> No Overdue Projects
                         </p>
                       </div>
                     ) : (
                       overdueProjects.map((project) => (
                         <div key={project._id} className="p-3.5 hover:bg-slate-50 transition-colors group relative">
                           <div className="flex justify-between items-start mb-1.5">
                             <div className="flex flex-col">
                               <span className="text-xs font-black text-slate-900 leading-none mb-1 group-hover:text-rose-600 transition-colors">
                                 {project.name}
                               </span>
                               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[150px]">
                                 {project.requirement || 'Project Work'}
                               </span>
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md uppercase tracking-widest">
                                 Overdue
                               </span>
                               <span className="text-[10px] text-slate-400 font-mono mt-1">
                                 {new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                               </span>
                             </div>
                           </div>
                           <div className="flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                             <div className="flex items-center gap-1.5">
                               <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center text-[8px] font-black">
                                 {project.convertedBy?.[0] || 'S'}
                               </div>
                               <span>{project.convertedBy}</span>
                             </div>
                             <div className="flex items-center gap-1">
                               <Clock size={10} className="text-slate-300" />
                               <span>Started: {new Date(project.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                             </div>
                           </div>
                         </div>
                       ))
                     )}
                   </div>
                   {overdueProjects.length > 0 && (
                     <div className="p-3 bg-slate-50/50 border-t border-slate-100">
                        <button className="w-full py-2 bg-white border border-slate-200 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white hover:text-rose-600 hover:border-rose-200 rounded-lg transition-all active:scale-95">
                          View All Alerts
                        </button>
                     </div>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Leads Controls Bar */}
          <div className="bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-50 rounded-xl flex items-center justify-center">
                <FileSpreadsheet size={15} className="text-violet-500" />
              </div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.15em]">Pipeline Manager</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
               onClick={() => setShowManual(true)}
               className="bg-white border border-slate-200 text-slate-600 hover:text-violet-600 hover:border-violet-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 active:scale-95"
              >
                <User size={15} />
                <span>Manual Lead</span>
              </button>
              <button 
               onClick={() => setShowUpload(true)}
               className="text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-lg" style={{background: 'linear-gradient(135deg, #6366f1, #7c3aed)'}}
              >
                <Plus size={15} />
                <span>Import Excel</span>
              </button>
            </div>
          </div>

          {/* Monthly Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats?.months?.map((m) => (
              <MonthCard 
                key={m._id} 
                month={m._id} 
                data={m} 
                user={user}
                onClick={() => navigate(`/sales/month/${m._id}`)}
              />
            ))}
            {(!stats?.months || stats?.months?.length === 0) && (
              <div className="col-span-full py-20 bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <FileSpreadsheet size={36} className="mb-3 opacity-20" />
                <p className="font-bold text-xs uppercase tracking-[0.2em]">No data found</p>
                <p className="text-[10px] mt-1 uppercase tracking-widest opacity-60">Upload an Excel sheet to begin</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2 text-brand-primary">
                   <FileSpreadsheet size={18} />
                   <h2 className="text-sm font-bold text-slate-900 tracking-tight">Import Leads from Excel</h2>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                     onClick={downloadSampleExcel}
                     className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1 border border-indigo-100"
                   >
                     <FileSpreadsheet size={12} />
                     <span>Download Sample</span>
                   </button>
                   <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={16}/></button>
                </div>
             </div>

             <div className="p-6">
                <form onSubmit={handleUpload} className="space-y-4">
                   <div 
                      className={`relative border-2 border-dashed rounded-xl p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                        dragActive ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                      }}
                      onClick={() => document.getElementById('file-upload').click()}
                   >
                      {file ? (
                        <div className="space-y-2">
                           <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                              <FileSpreadsheet size={24} />
                           </div>
                           <p className="text-xs font-bold text-slate-900">{file.name}</p>
                           <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[10px] text-red-500 font-bold uppercase underline">Remove</button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                           <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto opacity-50">
                              <Upload size={24} />
                           </div>
                           <p className="text-xs font-bold text-slate-400">Click or drag & drop Excel file here</p>
                           <p className="text-[10px] text-slate-300">Supports .xlsx, .xls, .csv</p>
                        </div>
                      )}
                      <input 
                        id="file-upload" 
                        type="file" 
                        hidden 
                        accept=".xlsx, .xls, .csv"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                   </div>

                   <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex gap-3 text-amber-700">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div className="text-[10px] font-medium leading-relaxed">
                         <span className="font-bold block uppercase tracking-wider mb-1">Upload Note</span>
                         Old data present in the file will be automatically skipped based on Lead ID. Only new leads for the current month will be processed.
                      </div>
                   </div>

                   <button 
                      type="submit"
                      disabled={!file || uploadLoading}
                      className="w-full py-3 bg-brand-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-hover shadow-lg shadow-brand-shadow disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                   >
                      {uploadLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : <Upload size={14} />}
                      <span>{uploadLoading ? 'Processing Data...' : 'Confirm Data Ingestion'}</span>
                   </button>
                </form>
             </div>
          </div>
        </div>
      )}
      {/* Manual Entry Modal */}
      {showManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-1.5 text-brand-primary">
                   <UserPlus size={18} />
                   <h2 className="text-sm font-bold text-slate-900 tracking-tight">Manual Lead Registration</h2>
                </div>
                <button onClick={() => setShowManual(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={16}/></button>
             </div>

             <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Reference ID</label>
                      <div className="relative">
                         <Target className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" required value={manualForm.leadId}
                           onChange={(e) => setManualForm({...manualForm, leadId: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="L-301"
                         />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Lead Name</label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" required value={manualForm.name}
                           onChange={(e) => setManualForm({...manualForm, name: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="John Doe"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="email" value={manualForm.email}
                           onChange={(e) => setManualForm({...manualForm, email: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="john@example.com"
                         />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Contact Phone</label>
                      <div className="relative">
                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" value={manualForm.phone}
                           onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="9876543210"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Traffic Source</label>
                      <div className="relative">
                         <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" value={manualForm.source}
                           onChange={(e) => setManualForm({...manualForm, source: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="Fb Ads, Website..."
                         />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Physical Location</label>
                      <div className="relative">
                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="text" value={manualForm.location}
                           onChange={(e) => setManualForm({...manualForm, location: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="Delhi, Mumbai..."
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Requirement Details</label>
                   <textarea 
                     rows="2" value={manualForm.requirement}
                     onChange={(e) => setManualForm({...manualForm, requirement: e.target.value})}
                     className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold resize-none"
                     placeholder="Looking for web development services..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Estimated Budget</label>
                      <div className="relative">
                         <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                         <input 
                           type="number" value={manualForm.budget}
                           onChange={(e) => setManualForm({...manualForm, budget: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="50000"
                         />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" disabled={manualLoading}
                  className="w-full py-3 mt-2 bg-brand-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-hover shadow-lg shadow-brand-shadow transition-all flex items-center justify-center gap-2"
                >
                  {manualLoading ? (
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : <Plus size={14}/>}
                  <span>{manualLoading ? 'Authorized Access...' : 'Finalize Manual Add'}</span>
                </button>
             </form>
          </div>
        </div>
      )}

            {/* Team Member Detail Modal */}
      {selectedMember && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
                  <div className="flex items-center gap-4">
                     <div className="relative">
                        <img src={selectedMember.profilePic} className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">{selectedMember.name}'s Pipeline Stats</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">{selectedMember.email}</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={24}/></button>
               </div>

               <div className="p-8 overflow-y-auto">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5 opacity-70">All-Time Performance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
                    <StatCard 
                      title="Generated Revenue" 
                      value={`₹${selectedMember?.stats?.totalRevenue?.toLocaleString() || 0}`} 
                      icon={TrendingUp} 
                      color="bg-[#e91e63]"
                    />
                    <StatCard 
                      title="Assigned Leads" 
                      value={selectedMember?.stats?.totalLeads || 0} 
                      icon={Target} 
                      color="bg-[#e91e63]"
                    />
                    <StatCard 
                      title="Successfully Closed" 
                      value={selectedMember?.stats?.converted || 0} 
                      icon={CheckCircle2} 
                      color="bg-[#e91e63]"
                    />
                    <StatCard 
                      title="Conversion Rate" 
                      value={`${selectedMember?.stats?.conversionRate || 0}%`} 
                      icon={Percent} 
                      color="bg-[#e91e63]"
                    />
                    <div className="bg-[#111827] p-5 rounded-2xl text-white shadow-xl shadow-slate-200/20 transition-all hover:scale-[1.02] duration-300 relative overflow-hidden group border border-white/5">
                       <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:scale-150 transition-all" />
                       <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-white/10 rounded-xl">
                             <Coins className="text-indigo-400" size={20} />
                          </div>
                          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none">Global Index</span>
                       </div>
                       <h3 className="text-2xl font-black tracking-tight">₹{memberLeads?.monthlyStats?.filter(m => m._id.startsWith('2026')).reduce((acc, curr) => acc + (curr.revenue || 0), 0).toLocaleString() || 0}</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-1.5 opacity-80">2026 Revenue</p>
                       <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                             {memberLeads?.monthlyStats?.filter(m => m._id.startsWith('2026')).length} Months Tracked
                          </span>
                       </div>
                    </div>
                  </div>

                  <div className="bg-pink-50/50 border border-pink-100/50 rounded-3xl p-8 flex items-start gap-6 mb-12 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={120} />
                     </div>
                     <div className="p-4 bg-white text-pink-500 rounded-2xl shadow-md border border-pink-50/50 shrink-0">
                        <TrendingUp size={24} />
                     </div>
                     <div className="relative z-10">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 opacity-80 mb-3 flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-pink-500" /> Performance Summary
                        </h4>
                        <p className="text-sm font-semibold text-slate-600 leading-relaxed max-w-3xl">
                           {selectedMember.name} has successfully converted <span className="text-pink-600 font-black decoration-pink-200 underline underline-offset-4">{selectedMember?.stats?.converted || 0}</span> out of <span className="text-slate-900 font-black">{selectedMember?.stats?.totalLeads || 0}</span> leads assigned to them. 
                           The total revenue generated by this member is <span className="text-slate-900 font-black">₹{selectedMember?.stats?.totalRevenue?.toLocaleString() || 0}</span>, maintaining a <span className="text-pink-600 font-black decoration-pink-200 underline underline-offset-4">{selectedMember?.stats?.conversionRate || 0}%</span> closing rate.
                        </p>
                     </div>
                  </div>

                  {/* Active vs Completed Work */}
                  {memberLeadsLoading ? (
                     <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-pink-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Syncing Pipeline Data</p>
                     </div>
                  ) : (
                     <div className="space-y-12">
                        {/* Currently Working On */}
                        <div>
                           <div className="flex items-center justify-between mb-5">
                              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
                                <Target size={16} className="text-amber-500" /> Currently Working On (Active Pipeline)
                              </h3>
                              <div className="h-[1px] flex-grow mx-6 bg-slate-100" />
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{memberLeads.followUp.length} Active Leads</span>
                           </div>
                           <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-50/50">
                                     <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                                        <th className="px-8 py-5">Lead / Client Identity</th>
                                        <th className="px-8 py-5">Engagement Status</th>
                                        <th className="px-8 py-5 text-right">Estimated Yield</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {memberLeads.followUp.length === 0 ? (
                                        <tr><td colSpan="3" className="px-8 py-12 text-center text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50/20">Zero Active Enquiries</td></tr>
                                     ) : memberLeads.followUp.map(lead => (
                                        <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                           <td className="px-8 py-5">
                                              <div className="text-[13px] font-black text-slate-900 group-hover:text-amber-600 transition-colors">{lead.name}</div>
                                              <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{lead.requirement || 'General Project Requirement'}</div>
                                           </td>
                                           <td className="px-8 py-5">
                                              <div className="flex items-center gap-3">
                                                 <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                                    {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString() : 'Awaiting Date'}
                                                 </span>
                                                 <button 
                                                   onClick={(e) => { e.stopPropagation(); setSelectedLeadForNote(lead); }}
                                                   className="p-2 hover:bg-amber-100 text-amber-600 rounded-xl transition-all shadow-sm bg-white border border-amber-50"
                                                   title="Communication History"
                                                 >
                                                   <NotebookPen size={14} />
                                                 </button>
                                               </div>
                                           </td>
                                           <td className="px-8 py-5 text-[13px] font-black text-slate-900 text-right">
                                              ₹{lead.budget?.toLocaleString() || 0}
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                        </div>

                        {/* Recently Completed */}
                        <div>
                           <div className="flex items-center justify-between mb-5">
                              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
                                <CheckCircle2 size={16} className="text-emerald-500" /> Recently Completed (Converted Deals)
                              </h3>
                              <div className="h-[1px] flex-grow mx-6 bg-slate-100" />
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{memberLeads.converted.length} Conversions</span>
                           </div>
                           <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-50/50">
                                     <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                                        <th className="px-8 py-5">Client Identity</th>
                                        <th className="px-8 py-5">Closure Timestamp</th>
                                        <th className="px-8 py-5 text-right">Net Revenue</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {memberLeads.converted.length === 0 ? (
                                        <tr><td colSpan="3" className="px-8 py-12 text-center text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50/20">No Realized Conversions</td></tr>
                                     ) : memberLeads.converted.map(lead => (
                                        <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                                           <td className="px-8 py-5">
                                              <div className="text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{lead.name}</div>
                                              <div className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">{lead.requirement || 'Project Fulfilled'}</div>
                                           </td>
                                           <td className="px-8 py-5 text-[11px] text-slate-500 font-black uppercase tracking-widest leading-none">
                                              {new Date(lead.updatedAt).toLocaleDateString()}
                                           </td>
                                           <td className="px-8 py-5 text-[14px] font-black text-emerald-600 text-right">
                                              ₹{(lead.totalAmount || lead.budget || 0).toLocaleString()}
                                           </td>
                                        </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {selectedLeadForNote && (
         <LeadConversationModal 
           lead={selectedLeadForNote} 
           onClose={() => setSelectedLeadForNote(null)} 
           onNoteAdded={() => handleMemberClick(selectedMember)}
         />
       )}
    </div>
  );
};

export default SalesDashboard;
