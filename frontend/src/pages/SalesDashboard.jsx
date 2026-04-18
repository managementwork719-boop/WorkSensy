import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeadConversationModal from '../components/LeadConversationModal';
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
  NotebookPen
} from 'lucide-react';

const StatCard = ({ title, value, subValue, icon: Icon, color = 'bg-brand-primary' }) => (
  <div className={`${color} p-4 rounded-xl text-white shadow-lg shadow-brand-shadow transition-all duration-300`}>
    <div className="flex justify-between items-start mb-2">
      <div className="p-1.5 bg-white/20 rounded-lg">
        <Icon size={18} />
      </div>
    </div>
    <div className="space-y-0.5">
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{title}</p>
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
  const { user } = useAuth();
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
  
  // Manual Entry State
  const [showManual, setShowManual] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualForm, setManualForm] = useState({
    leadId: '',
    name: '',
    phone: '',
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
    }
  }, [selectedYear]);

  const fetchTeam = async () => {
    setTeamLoading(true);
    try {
      const res = await API.get('/sales/team-stats');
      setTeam(res.data.data.teamStats);
    } catch (err) {
      console.error('Failed to fetch sales team');
    } finally {
      setTeamLoading(false);
    }
  };

  const handleMemberClick = async (member) => {
    setSelectedMember(member);
    setMemberLeadsLoading(true);
    try {
      const res = await API.get(`/sales/member-leads/${member.name}`);
      setMemberLeads(res.data.data);
    } catch (err) {
      console.error('Failed to fetch member leads');
    } finally {
      setMemberLeadsLoading(false);
    }
  };

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
        leadId: '', name: '', phone: '', source: '', 
        campaign: '', requirement: '', budget: '', location: ''
      });
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setManualLoading(false);
    }
  };

  if (loading) return (
     <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-brand-primary/10 text-brand-primary rounded-lg">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
               {mode === 'dashboard' ? `Welcome back, ${user?.name?.split(' ')[0]}` : 'Sales Leads Management'}
            </h1>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5 uppercase tracking-widest">
               {mode === 'dashboard' ? 'Sales Analytics & Team Tracking Dashboard' : 'Grow & Manage Your Pipeline Data'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-700 focus:outline-none cursor-pointer"
            >
              {(() => {
                const years = [];
                const startYear = stats?.registrationYear || new Date().getFullYear();
                const endYear = new Date().getFullYear() + 1;
                for (let y = startYear; y <= endYear; y++) {
                  years.push(y.toString());
                }
                return years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ));
              })()}
            </select>
          </div>
        {mode === 'leads' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowManual(true)}
              className="bg-white border border-slate-200 text-slate-600 hover:text-brand-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 active:scale-95"
            >
              <UserPlus size={16} />
              <span>Manual Entry</span>
            </button>
            <button 
              onClick={() => setShowUpload(true)}
              className="bg-brand-primary hover:bg-brand-hover text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand-shadow flex items-center gap-2 active:scale-95"
            >
              <Upload size={16} />
              <span>+ Excel Import</span>
            </button>
          </div>
        )}
      </div>
    </div>

      {/* KPI Cards */}
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={user?.role === 'sales-team' ? "My Revenue" : "Total Revenue"} 
          value={`₹${stats?.total?.revenue?.toLocaleString() || 0}`} 
          icon={TrendingUp} 
        />
        <StatCard 
          title={user?.role === 'sales-team' ? "My Received" : "Total Received"} 
          value={`₹${stats?.total?.received?.toLocaleString() || 0}`} 
          icon={Coins} 
          color="bg-cyan-600"
        />
        <StatCard 
          title={user?.role === 'sales-team' ? "My Leads" : "Total Leads"} 
          value={stats?.total?.leads || 0} 
          icon={Users} 
          color="bg-indigo-600"
        />
        <StatCard 
          title={user?.role === 'sales-team' ? "My Converted" : "Converted"} 
          value={stats?.total?.converted || 0} 
          icon={CheckCircle2} 
          color="bg-emerald-600"
        />
      </div>

      {/* Sales Team & Performance Tracking */}
      {mode === 'dashboard' && user?.role !== 'sales-team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
           {/* Team List */}
           <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-2 text-indigo-600">
                    <Users size={18} />
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Sales Team Pulse</h2>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{team.length} Active Members</span>
              </div>
              
              <div className="divide-y divide-slate-50">
                 {teamLoading ? (
                    <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"/></div>
                 ) : team.map((member, i) => (
                    <div 
                       key={member._id} 
                       onClick={() => handleMemberClick(member)}
                       className="p-4 hover:bg-slate-50/80 transition-all flex items-center justify-between group cursor-pointer"
                    >
                       <div className="flex items-center gap-4">
                          <img src={member.profilePic} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm group-hover:scale-105 transition-transform" />
                          <div>
                             <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                             <p className="text-[10px] text-slate-400 font-medium">{member.email}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">Active Now</span>
                          </div>
                          <p className="text-[10px] font-bold text-indigo-600 mt-1 hover:underline">View Pipeline →</p>
                       </div>
                    </div>
                 ))}
                 {!teamLoading && team.length === 0 && (
                    <div className="p-12 text-center">
                       <Users size={32} className="mx-auto text-slate-200 mb-3" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No team members assigned</p>
                       <button onClick={() => navigate('/team')} className="mt-4 text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Invite Team Members</button>
                    </div>
                 )}
              </div>
           </div>

           {/* Mini Performance Insight */}
           <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#0f172a] rounded-xl p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-16 -mt-16"></div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-slate-400 italic">Leaderboard</h3>
                  
                  <div className="space-y-4 relative z-10">
                     {(() => {
                        const topEarners = [...team].sort((a,b) => (b.stats?.totalRevenue||0) - (a.stats?.totalRevenue||0)).slice(0,5);
                        const maxRev = Math.max(...topEarners.map(m => m.stats?.totalRevenue || 1), 1);
                        return topEarners.map((member, i) => (
                           <div key={i} className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-end">
                                 <span className="text-[10px] font-bold text-slate-300 uppercase truncate pr-4">{member.name}</span>
                                 <span className="text-[11px] font-bold text-emerald-400">₹{member.stats?.totalRevenue?.toLocaleString()}</span>
                              </div>
                              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${Math.max(((member.stats?.totalRevenue || 0) / maxRev) * 100, 5)}%` }} />
                              </div>
                           </div>
                        ));
                     })()}
                     {team.length === 0 && <p className="text-[10px] text-slate-500 italic text-center py-4">Assign members to track productivity</p>}
                  </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                     <Target size={16} className="text-indigo-600" />
                     <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">Current Velocity</h4>
                  </div>
                  <div className="flex items-baseline gap-2">
                     <span className="text-2xl font-bold text-slate-900">84%</span>
                     <span className="text-emerald-500 text-[10px] font-bold">+2.4%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 leading-relaxed">
                     Team is operating at high efficiency. Current conversion momentum is positive.
                  </p>
              </div>
           </div>
        </div>
      )}

      {/* Monthly Breakdown */}
      {mode === 'leads' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {stats?.months?.map((m) => (
            <MonthCard 
              key={m._id} 
              month={m._id} 
              data={m} 
              user={user}
              onClick={() => navigate(`/sales/month/${m._id}`)}
            />
          ))}
          {stats?.months?.length === 0 && (
             <div className="col-span-full py-16 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                <FileSpreadsheet size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-sm">No sales data found. Upload an Excel sheet to begin.</p>
             </div>
          )}
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
                <button onClick={() => setShowUpload(false)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={16}/></button>
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
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
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
