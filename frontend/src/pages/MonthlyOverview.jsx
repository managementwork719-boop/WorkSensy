import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  IndianRupee,
  MoreVertical,
  Plus,
  BarChart3,
  Phone,
  Mail,
  Search,
  MessageSquare,
  Calendar,
  Edit2,
  Trash2,
  ExternalLink,
  Target,
  AlertTriangle,
  Clock,
  UserPlus,
  MapPin,
  X,
  NotebookPen,
  Wallet
} from 'lucide-react';
import LeadConversationModal from '../components/LeadConversationModal';
import PaymentHistoryModal from '../components/PaymentHistoryModal';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: 'bg-red-100 text-red-600 border-red-200',
    normal: 'bg-amber-100 text-amber-600 border-amber-200',
    low: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${styles[priority]}`}>
      {priority}
    </span>
  );
};

const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const isOverdue = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today && !isToday(dateString);
};

const OverviewCard = ({ title, value, icon: Icon, color = 'bg-brand-primary' }) => (
  <div className={`${color} p-4 rounded-xl text-white shadow-sm flex items-center justify-between`}>
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">{title}</p>
      <h3 className="text-lg font-bold">{value}</h3>
    </div>
    <div className="p-2 bg-white/20 rounded-lg">
      <Icon size={16} />
    </div>
  </div>
);

const MonthlyOverview = () => {
  const { monthId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('origin');
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [editModalData, setEditModalData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState(null);

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
    fetchMonthDetails();
    fetchTeamMembers();
  }, [monthId]);

  const fetchTeamMembers = async () => {
    try {
      const res = await API.get('/users/company-users');
      setTeamMembers(res.data.data.users || []);
    } catch (err) {
      console.error('Failed to fetch team members', err);
    }
  };

  const fetchMonthDetails = async () => {
    try {
      const res = await API.get(`/sales/monthly-overview?month=${monthId}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch monthly details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async (id, updateData) => {
    try {
      await API.patch(`/sales/lead/${id}`, updateData);
      fetchMonthDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await API.delete(`/sales/lead/${id}`);
      fetchMonthDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFullEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await API.patch(`/sales/lead/${editModalData._id}`, editModalData);
      setEditModalData(null);
      fetchMonthDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Full update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true);
    try {
      // Pass the current monthId to ensure lead is added to THIS month view
      await API.post('/sales/create-manual', { ...manualForm, month: monthId });
      setShowManual(false);
      setManualForm({
        leadId: '', name: '', phone: '', source: '', 
        campaign: '', requirement: '', budget: '', location: ''
      });
      fetchMonthDetails(); // Refresh list to show new lead
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setManualLoading(false);
    }
  };

  const toggleLeadSelection = (id) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
       <div className="w-8 h-8 border-3 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
    </div>
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const [year, monthNum] = monthId.split('-');
  const monthName = months[parseInt(monthNum) - 1];

  // Helper for filtered leads
  const searchFilter = (l) => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (
      l.name?.toLowerCase().includes(lowerQ) || 
      l.phone?.includes(lowerQ) || 
      l.source?.toLowerCase().includes(lowerQ)
    );
  };
  const filteredLeads = data?.leads?.filter(l => l.status === activeTab && searchFilter(l)) || [];

  // Member lists for dropdowns
  const allMembers = teamMembers.map(m => m.name);
  const salesMembers = teamMembers.filter(m => ['sales-team'].includes(m.role)).map(m => m.name);

  // Weekly Chart Data (Mocking week distribution if not available in DB)
  const chartData = [
    { name: 'Week 1', revenue: Math.round(data?.stats?.revenue * 0.2) },
    { name: 'Week 2', revenue: Math.round(data?.stats?.revenue * 0.35) },
    { name: 'Week 3', revenue: Math.round(data?.stats?.revenue * 0.25) },
    { name: 'Week 4', revenue: Math.round(data?.stats?.revenue * 0.2) },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/leads')}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-brand-primary hover:border-brand-primary transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{monthName} Overview</h1>
            <p className="text-slate-500 text-[11px] font-medium mt-0.5 uppercase tracking-widest">Monthly Lead Performance Analysis</p>
          </div>
        </div>
        <button 
          onClick={() => setShowManual(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} />
          <span>Add Lead</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'sales-manager' || user?.role === 'sales-team') && (
          <OverviewCard title="Revenue" value={`₹${data?.stats?.revenue?.toLocaleString() || 0}`} icon={IndianRupee} />
        )}
        <OverviewCard title="Leads" value={data?.stats?.count || 0} icon={Users} color="bg-indigo-500" />
        <OverviewCard title="Converted" value={data?.stats?.converted || 0} icon={CheckCircle2} color="bg-emerald-500" />
        {(user?.role === 'admin' || user?.role === 'super-admin' || user?.role === 'sales-manager' || user?.role === 'sales-team') && (
          <>
            <OverviewCard title="Received" value={`₹${data?.stats?.received?.toLocaleString() || 0}`} icon={Wallet} color="bg-cyan-600" />
            <OverviewCard title="Profit" value={`₹${data?.stats?.profit?.toLocaleString() || 0}`} icon={TrendingUp} color="bg-slate-900" />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Table Section */}
        <div className="lg:col-span-12 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden min-h-[400px]">
           {/* Tabs */}
           <div className="flex gap-2 p-3 bg-slate-50/50 border-b border-slate-100">
             {['origin', 'follow-up', 'converted'].map(tab => (
               <button
                 key={tab}
                 onClick={() => { setActiveTab(tab); setSelectedLeads([]); }}
                 className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                   activeTab === tab 
                   ? 'bg-brand-primary text-white shadow-md shadow-brand-shadow' 
                   : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                 }`}
               >
                 {tab.replace('-', ' ')}
               </button>
             ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-white border-b-4  shadow-sm">
                    {activeTab === 'origin' && (
                       <>
                         <th className="px-5 py-4 ">Lead ID</th>
                         <th className="px-4 py-4">Name</th>
                         <th className="px-4 py-4">Phone</th>
                         <th className="px-4 py-4">Source</th>
                         <th className="px-4 py-4">Requirement</th>
                         <th className="px-4 py-4">Budget</th>
                         <th className="px-4 py-4 min-w-[120px]">Handled By</th>
                         <th className="px-4 py-4">Status</th>
                         <th className="px-4 py-4 text-right">Actions</th>
                       </>
                    )}
                    {activeTab === 'follow-up' && (
                       <>
                         <th className="px-4 py-4 w-12">S.No</th>
                         <th className="px-4 py-4">Name</th>
                         <th className="px-4 py-4">Phone</th>
                         <th className="px-4 py-4">Source</th>
                         <th className="px-4 py-4">Location</th>
                         <th className="px-4 py-4">Date</th>
                         <th className="px-4 py-4">Priority</th>
                         <th className="px-4 py-4">Work</th>
                         <th className="px-4 py-4 whitespace-nowrap">Next Follow</th>
                         <th className="px-4 py-4">Status</th>
                         <th className="px-4 py-4 min-w-[120px]">Handled By</th>
                         <th className="px-4 py-4">Amount</th>
                         <th className="px-4 py-4">Remarks</th>
                         <th className="px-4 py-4 text-right">Actions</th>
                       </>
                    )}
                    {activeTab === 'converted' && (
                       <>
                         <th className="px-4 py-4 w-12">S.No</th>
                         <th className="px-4 py-4">Client</th>
                         <th className="px-4 py-4">Phone</th>
                         <th className="px-4 py-4">Work</th>
                         <th className="px-4 py-4">Source</th>
                         <th className="px-4 py-4">Converted</th>
                         <th className="px-4 py-4">Assigned To</th>
                         <th className="px-4 py-4">Date</th>
                         <th className="px-4 py-4 text-center">Total </th>
                         <th className="px-4 py-4 text-center">Advance </th>
                         <th className="px-4 py-4 text-center bg-red-500/10 text-red-200">Pending </th>
                         <th className="px-4 py-4">Payment</th>
                         <th className="px-4 py-4">Status</th>
                         <th className="px-4 py-4">Deadline</th>
                         <th className="px-4 py-4">Remarks</th>
                         <th className="px-4 py-4 text-right">Actions</th>
                       </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredLeads.map((lead, idx) => {
                    const isSelected = selectedLeads.includes(lead._id);
                    return (
                    <tr 
                      key={lead._id} 
                      onClick={(e) => {
                        if (['SELECT', 'INPUT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName) || e.target.closest('a')) return;
                        toggleLeadSelection(lead._id);
                      }}
                      className={`group transition-all duration-200 cursor-pointer border-l-4 ${isSelected ? 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100' : 'hover:bg-slate-50 border-transparent'}`}
                    >
                      {activeTab === 'origin' && (
                        <>
                          <td className="px-4 py-4 text-[11px] font-bold text-slate-400">{lead.leadId}</td>
                          <td className="px-4 py-4 text-[13px] font-bold text-slate-900">{lead.name}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-600 font-medium whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{lead.phone || '--'}</span>
                              {lead.phone && (
                                <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 transition-colors">
                                  <MessageSquare size={13} strokeWidth={2.5} />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.source}</td>
                          <td className="px-4 py-4 text-[12px] text-slate-500 font-medium truncate max-w-[150px]">{lead.requirement}</td>
                          <td className="px-4 py-4 text-[12px] font-bold text-slate-900">₹{lead.budget?.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <select 
                              value={lead.convertedBy || ''}
                              onChange={(e) => handleUpdateLead(lead._id, { convertedBy: e.target.value })}
                              className="bg-transparent border border-transparent hover:border-slate-200 text-[11px] font-bold text-brand-primary rounded focus:ring-0 cursor-pointer p-0.5 w-24 truncate"
                            >
                              <option value="">Sales Owner</option>
                              {salesMembers.map(name => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <select 
                                value={lead.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  const updates = { status: newStatus };
                                  if (newStatus === 'follow-up' && !lead.nextFollowUp) {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    updates.nextFollowUp = tomorrow;
                                  }
                                  handleUpdateLead(lead._id, updates);
                                }}
                                className="bg-slate-50 border-none text-[10px] font-bold uppercase tracking-widest text-brand-primary rounded-lg focus:ring-0 cursor-pointer p-1"
                              >
                                <option value="origin">Origin</option>
                                <option value="follow-up">Follow-up</option>
                                <option value="converted">Converted</option>
                              </select>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedLeadForNote(lead); }}
                                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                                title="Conversation Notes"
                              >
                                <NotebookPen size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                      {activeTab === 'follow-up' && (
                         <>
                           <td className="px-4 py-4 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                           <td className="px-4 py-4 text-[13px] font-bold text-slate-900">{lead.name}</td>
                           <td className="px-4 py-4 text-[12px] text-slate-600 font-medium whitespace-nowrap">
                             <div className="flex items-center gap-2">
                               <span>{lead.phone || '--'}</span>
                               {lead.phone && (
                                 <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 transition-colors">
                                   <MessageSquare size={13} strokeWidth={2.5} />
                                 </a>
                               )}
                             </div>
                           </td>
                           <td className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.source || '-'}</td>
                           <td className="px-4 py-4 text-[12px] text-slate-600 font-medium">{lead.location || 'City'}</td>
                           <td className="px-4 py-4 text-[12px] text-slate-600 font-medium">{new Date(lead.date).toLocaleDateString('en-GB')}</td>
                           <td className="px-4 py-4">
                              <select 
                                value={lead.priority}
                                onChange={(e) => handleUpdateLead(lead._id, { priority: e.target.value })}
                                className={`text-[8px] font-bold  tracking-widest border-none rounded-lg focus:ring-0 p-1 cursor-pointer w-full
                                  ${lead.priority === 'high' ? 'bg-red-100 text-red-600' : lead.priority === 'normal' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}
                              >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                              </select>
                           </td>
                           <td className="px-4 py-4 text-[12px] text-slate-500 font-medium max-w-[120px] truncate">{lead.workType || lead.requirement}</td>
                           <td className="px-4 py-4 text-[11px] font-bold">
                              <div className={`${isOverdue(lead.nextFollowUp) ? 'bg-red-100 text-red-700 hover:bg-red-200' : isToday(lead.nextFollowUp) ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'} rounded-lg px-2 py-1 inline-block text-[10px] font-bold relative transition-colors cursor-pointer`}>
                                {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Set Date'}
                                <input 
                                  type="date"
                                  className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
                                  value={lead.nextFollowUp ? new Date(lead.nextFollowUp).toISOString().split('T')[0] : ''}
                                  onChange={(e) => handleUpdateLead(lead._id, { nextFollowUp: e.target.value })}
                                />
                              </div>
                           </td>
                           <td className="px-4 py-4">
                             <div className="flex items-center gap-2">
                               <select 
                                 value={lead.status}
                                 onChange={(e) => {
                                   const newStatus = e.target.value;
                                   const updates = { status: newStatus };
                                   if (newStatus === 'follow-up' && !lead.nextFollowUp) {
                                     const tomorrow = new Date();
                                     tomorrow.setDate(tomorrow.getDate() + 1);
                                     updates.nextFollowUp = tomorrow;
                                   }
                                   handleUpdateLead(lead._id, updates);
                                 }}
                                 className={`border border-transparent text-[10px] font-bold uppercase tracking-widest rounded-lg focus:ring-0 cursor-pointer px-2 py-1.5 transition-colors text-center shadow-sm
                                   ${lead.status === 'converted' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-white text-slate-600 hover:bg-slate-50 shadow-slate-200/50'}`}
                               >
                                 <option value="origin">Origin</option>
                                 <option value="follow-up">Follow-up</option>
                                 <option value="converted">Converted</option>
                               </select>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setSelectedLeadForNote(lead); }}
                                 className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                                 title="Conversation Notes"
                               >
                                 <NotebookPen size={14} />
                               </button>
                             </div>
                           </td>
                           <td className="px-4 py-4 text-[11px] font-bold text-brand-primary text-left">
                             <select 
                               value={lead.convertedBy || ''}
                               onChange={(e) => handleUpdateLead(lead._id, { convertedBy: e.target.value })}
                               className="bg-transparent border border-transparent hover:border-slate-200 text-[11px] font-bold rounded focus:ring-0 cursor-pointer p-0.5 w-24 truncate"
                             >
                               <option value="">Sales Owner</option>
                               {salesMembers.map(name => (
                                 <option key={name} value={name}>{name}</option>
                               ))}
                             </select>
                           </td>
                           <td className="px-4 py-4 text-[12px] font-bold text-slate-900">{lead.totalAmount || lead.budget || 0}</td>
                           <td className="px-4 py-4">
                              <textarea
                                defaultValue={lead.remarks || ''}
                                onBlur={(e) => {
                                  if (e.target.value !== lead.remarks) handleUpdateLead(lead._id, { remarks: e.target.value });
                                }}
                                className="bg-white border border-slate-200 text-[11px] font-medium rounded-lg px-2 py-1 focus:ring-1 focus:ring-brand-primary w-32 h-[34px] resize-none shadow-sm"
                                placeholder="Remarks..."
                              />
                           </td>
                         </>
                      )}

                      {activeTab === 'converted' && (
                         <>
                           <td className="px-4 py-4 text-[11px] font-bold text-slate-400">{idx + 1}</td>
                           <td className="px-4 py-4 text-[13px] font-bold text-slate-900">{lead.name}</td>
                           <td className="px-4 py-4 text-[12px] text-slate-600 font-medium whitespace-nowrap">
                             <div className="flex items-center gap-2">
                               <span>{lead.phone || '--'}</span>
                               {lead.phone && (
                                 <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-emerald-600 transition-colors">
                                   <MessageSquare size={13} strokeWidth={2.5} />
                                 </a>
                               )}
                             </div>
                           </td>
                           <td className="px-4 py-4 text-[12px] text-slate-500 font-medium max-w-[120px] truncate">{lead.workType || lead.requirement || 'Work...'}</td>
                           <td className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{lead.source || '-'}</td>
                           <td className="px-4 py-4 text-[11px] font-bold text-slate-600">{lead.convertedBy || 'Sales Staff'}</td>
                           <td className="px-4 py-4">
                             <select 
                               value={lead.assignedTo || ''}
                               onChange={(e) => handleUpdateLead(lead._id, { assignedTo: e.target.value })}
                               className="bg-transparent border border-transparent hover:border-slate-200 text-[11px] font-bold text-slate-700 focus:ring-0 p-0.5 w-28 cursor-pointer rounded truncate"
                             >
                               <option value="">Assign To...</option>
                               {allMembers.map(name => (
                                 <option key={name} value={name}>{name}</option>
                               ))}
                             </select>
                           </td>
                           <td className="px-4 py-4 text-[12px] text-slate-600 font-medium">{new Date(lead.date).toLocaleDateString('en-GB')}</td>
                           <td className="px-4 py-4 text-center">
                              <input 
                                type="number" 
                                defaultValue={lead.totalAmount || lead.budget || 0}
                                onBlur={(e) => handleUpdateLead(lead._id, { totalAmount: parseFloat(e.target.value) })}
                                className="w-16 bg-transparent border border-transparent hover:border-slate-200 text-[12px] font-bold focus:ring-0 p-0 text-center text-slate-900 rounded transition-all"
                              />
                           </td>
                           <td className="px-4 py-4 text-center">
                               <div className="flex items-center justify-center gap-1.5">
                                 <span className="text-[12px] font-extrabold text-emerald-600">
                                   ₹{(lead.advanceAmount || 0).toLocaleString()}
                                 </span>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setSelectedLeadForPayment(lead); }}
                                   className="p-1 hover:bg-emerald-50 text-emerald-600 rounded transition-all"
                                   title="Add/View Installments (Kist)"
                                 >
                                    <Wallet size={12} />
                                 </button>
                               </div>
                            </td>
                           <td className="px-4 py-4 bg-red-50 text-[12px] font-bold text-red-600 text-center transition-colors">
                              {(lead.totalAmount || lead.budget || 0) - (lead.advanceAmount || 0)}
                           </td>
                           <td className="px-4 py-4">
                              <select 
                                value={lead.paymentStatus}
                                onChange={(e) => handleUpdateLead(lead._id, { paymentStatus: e.target.value })}
                                className={`text-[10px] font-bold uppercase tracking-widest rounded-lg px-2 py-1.5 border border-transparent focus:ring-0 cursor-pointer shadow-sm
                                  ${lead.paymentStatus === 'received' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                              >
                                <option value="pending">Pending</option>
                                <option value="partial">Partial</option>
                                <option value="received">Received</option>
                              </select>
                           </td>
                           <td className="px-4 py-4">
                              <select 
                                value={lead.deliveryStatus}
                                onChange={(e) => handleUpdateLead(lead._id, { deliveryStatus: e.target.value })}
                                className={`text-[10px] font-bold uppercase tracking-widest rounded-lg px-2 py-1.5 border border-transparent focus:ring-0 cursor-pointer shadow-sm
                                  ${lead.deliveryStatus === 'completed' ? 'bg-emerald-100 text-emerald-700' : lead.deliveryStatus === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}
                              >
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                           </td>
                           <td className="px-4 py-4 text-[11px] font-bold text-slate-500">
                              <div className="relative inline-block whitespace-nowrap">
                               {lead.deadline ? new Date(lead.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Set Date'}
                               <input 
                                 type="date"
                                 className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer"
                                 value={lead.deadline ? new Date(lead.deadline).toISOString().split('T')[0] : ''}
                                 onChange={(e) => handleUpdateLead(lead._id, { deadline: e.target.value })}
                               />
                              </div>
                           </td>
                           <td className="px-4 py-4 text-[11px] font-bold text-slate-500">
                             <input 
                               type="text"
                               defaultValue={lead.remarks || ''}
                               placeholder="Client satisfied..."
                               onBlur={(e) => {
                                 if (e.target.value !== lead.remarks) handleUpdateLead(lead._id, { remarks: e.target.value });
                               }}
                               className="bg-transparent border-none text-[11px] font-medium text-slate-700 focus:ring-0 p-0 w-24 placeholder:text-slate-400"
                             />
                           </td>
                         </>
                      )}

                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setEditModalData(lead);
                             }}
                             className="p-1.5 hover:bg-slate-200 hover:text-brand-primary rounded-lg transition-all"
                           >
                              <Edit2 size={14} />
                           </button>
                           <a href={`tel:${lead.phone}`} className="p-1.5 hover:bg-emerald-100 hover:text-emerald-600 rounded-lg transition-all"><Phone size={14} /></a>
                           <a href={`https://wa.me/91${lead.phone?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-green-100 hover:text-green-600 rounded-lg transition-all"><MessageSquare size={14} /></a>
                           
                           <a href={`mailto:?subject=Lead Info&body=${lead.name}`} className="p-1.5 hover:bg-brand-primary/10 hover:text-brand-primary rounded-lg transition-all"><Mail size={14} /></a>
                           {user?.role !== 'sales-team' && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); deleteLead(lead._id); }}
                               className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                               title="Delete Lead"
                             >
                               <Trash2 size={14} />
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                   );
                  })}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan="10" className="py-20 text-center font-bold text-slate-300 text-sm">No data available for this pipeline stage.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
        </div>

        {/* Weekly Chart */}
        <div className="lg:col-span-12 bg-white p-6 rounded-xl border border-slate-200/60 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Weekly Revenue Distribution</h4>
              <BarChart3 size={16} className="text-brand-primary" />
           </div>
           
           <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ 
                          borderRadius: '12px', 
                          border: 'none', 
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          zIndex: 50
                       }}
                    />
                    <Bar 
                       dataKey="revenue" 
                       fill="var(--primary-base)" 
                       radius={[6, 6, 0, 0]} 
                       barSize={40}
                       className="transition-all duration-300 hover:opacity-80"
                    />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
      {/* Manual Entry Modal */}
      {showManual && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                <div className="flex items-center gap-1.5 text-brand-primary">
                   <UserPlus size={18} />
                   <h2 className="text-sm font-bold text-slate-900 tracking-tight">Manual Lead Registration ({monthName} {year})</h2>
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
                           type="text" value={manualForm.leadId}
                           onChange={(e) => setManualForm({...manualForm, leadId: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="L-301 (Optional)"
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
                           type="text" required value={manualForm.phone}
                           onChange={(e) => setManualForm({...manualForm, phone: e.target.value})}
                           className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                           placeholder="9876543210"
                         />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Traffic Source</label>
                      <div className="relative">
                         <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
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
                         <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
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
                  <span>{manualLoading ? 'Registering...' : 'Finalize Manual Add'}</span>
                </button>
             </form>
          </div>
        </div>
      )}

       {/* Edit Entry Modal */}
       {editModalData && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                 <div className="flex items-center gap-1.5 text-brand-primary">
                    <Edit2 size={18} />
                    <h2 className="text-sm font-bold text-slate-900 tracking-tight">Edit Lead Information</h2>
                 </div>
                 <button onClick={() => setEditModalData(null)} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={16}/></button>
              </div>

              <form onSubmit={handleFullEditSubmit} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Reference ID</label>
                       <input 
                         type="text" value={editModalData.leadId || ''}
                         onChange={(e) => setEditModalData({...editModalData, leadId: e.target.value})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Lead Name</label>
                       <input 
                         type="text" required value={editModalData.name || ''}
                         onChange={(e) => setEditModalData({...editModalData, name: e.target.value})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Contact Phone</label>
                       <input 
                         type="text" required value={editModalData.phone || ''}
                         onChange={(e) => setEditModalData({...editModalData, phone: e.target.value})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Traffic Source</label>
                       <input 
                         type="text" value={editModalData.source || ''}
                         onChange={(e) => setEditModalData({...editModalData, source: e.target.value})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Requirement Details</label>
                    <textarea 
                      rows="2" value={editModalData.requirement || editModalData.workType || ''}
                      onChange={(e) => setEditModalData({...editModalData, requirement: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold resize-none"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Estimated Budget / Value</label>
                       <input 
                         type="number" value={editModalData.budget || editModalData.totalAmount || 0}
                         onChange={(e) => setEditModalData({...editModalData, budget: parseFloat(e.target.value) || 0})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-0.5">Physical Location</label>
                       <input 
                         type="text" value={editModalData.location || ''}
                         onChange={(e) => setEditModalData({...editModalData, location: e.target.value})}
                         className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-shadow outline-none text-xs font-semibold"
                       />
                    </div>
                 </div>

                 <button 
                   type="submit" disabled={editLoading}
                   className="w-full py-3 mt-2 bg-brand-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-brand-hover shadow-lg shadow-brand-shadow transition-all flex items-center justify-center gap-2"
                 >
                   {editLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   ) : <Edit2 size={14}/>}
                   <span>{editLoading ? 'Saving...' : 'Save Lead Data'}</span>
                 </button>
              </form>
           </div>
         </div>
       )}

      {selectedLeadForNote && (
        <LeadConversationModal 
          lead={selectedLeadForNote} 
          onClose={() => setSelectedLeadForNote(null)} 
          onNoteAdded={fetchMonthDetails}
        />
      )}

      {selectedLeadForPayment && (
        <PaymentHistoryModal 
          lead={selectedLeadForPayment} 
          onClose={() => setSelectedLeadForPayment(null)} 
          onPaymentAdded={fetchMonthDetails}
        />
      )}
    </div>
  );
};

export default MonthlyOverview;
