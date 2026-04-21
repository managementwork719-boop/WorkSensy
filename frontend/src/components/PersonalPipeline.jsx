import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Target, 
  Phone, 
  Mail, 
  CheckCircle2, 
  MessageSquare,
  History,
  TrendingUp,
  Layers,
  NotebookPen,
  Wallet
} from 'lucide-react';
import LeadConversationModal from './LeadConversationModal';
import PaymentHistoryModal from './PaymentHistoryModal';

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

const PersonalPipeline = () => {
  const [activeTab, setActiveTab] = useState('follow-up');
  const [data, setData] = useState({ followUp: [], converted: [] });
  const [loading, setLoading] = useState(true);
  const [selectedLeadForNote, setSelectedLeadForNote] = useState(null);
  const [selectedLeadForPayment, setSelectedLeadForPayment] = useState(null);

  useEffect(() => {
    fetchMyLeads();
  }, []);

  const fetchMyLeads = async () => {
    try {
      const res = await API.get('/sales/my-leads');
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch assigned leads');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickConvert = async (leadId) => {
    if (!window.confirm('Mark this lead as Converted?')) return;
    try {
      await API.patch(`/sales/lead/${leadId}`, { status: 'converted' });
      fetchMyLeads();
    } catch (err) {
      alert('Failed to convert lead');
    }
  };

  const currentLeads = activeTab === 'follow-up' ? data.followUp : data.converted;

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Tab Header */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-lg transition-colors ${activeTab === 'follow-up' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {activeTab === 'follow-up' ? <Target size={18} /> : <CheckCircle2 size={18} />}
           </div>
           <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                {activeTab === 'follow-up' ? 'My Follow-up Pipeline' : 'My Converted Deals'}
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {activeTab === 'follow-up' ? 'High Priority Leads Needing Action' : 'Record of Successfully Closed Assignments'}
              </p>
           </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto">
           <button 
             onClick={() => setActiveTab('follow-up')}
             className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
               activeTab === 'follow-up' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             Follow-ups
           </button>
           <button 
             onClick={() => setActiveTab('converted')}
             className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
               activeTab === 'converted' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
             }`}
           >
             Converted
           </button>
        </div>
      </div>

      {/* Stats Quick View (Contextual) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
         <div className="bg-white p-3 text-center">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Active</p>
            <p className="text-base font-bold text-slate-900">{data.followUp.length}</p>
         </div>
         <div className="bg-white p-3 text-center border-l-px">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Overdue</p>
            <p className="text-base font-bold text-red-500">
               {data.followUp.filter(l => isOverdue(l.nextFollowUp)).length + 
                data.converted.filter(l => isOverdue(l.deadline) && l.deliveryStatus !== 'completed').length}
            </p>
         </div>
         <div className="bg-white p-3 text-center border-l-px">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Success</p>
            <p className="text-base font-bold text-emerald-500">{data.converted.length}</p>
         </div>
         <div className="bg-white p-3 text-center border-l-px">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Revenue</p>
            <p className="text-base font-bold text-brand-primary">₹{data.converted.reduce((acc, l) => acc + (l.totalAmount || l.budget || 0), 0).toLocaleString()}</p>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
              <th className="px-6 py-4">Lead ID</th>
              <th className="px-6 py-4">Client Detail</th>
              <th className="px-6 py-4">Requirement</th>
              <th className="px-6 py-4">{activeTab === 'follow-up' ? 'Follow-up Date' : 'Assigned To'}</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
               <tr>
                  <td colSpan="5" className="py-16 text-center">
                     <div className="flex flex-col items-center gap-3">
                        <div className="w-6 h-6 border-2 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                        <span className="text-slate-300 font-bold text-[10px] uppercase tracking-widest">Synchronizing Pipeline...</span>
                     </div>
                  </td>
               </tr>
            ) : currentLeads.length === 0 ? (
               <tr>
                  <td colSpan="5" className="py-20 text-center">
                     <div className="flex flex-col items-center gap-2 opacity-20">
                        {activeTab === 'follow-up' ? <History size={40} /> : <TrendingUp size={40} />}
                        <p className="font-bold text-xs uppercase tracking-widest">No Record Available</p>
                     </div>
                  </td>
               </tr>
            ) : (
              currentLeads.map((lead) => {
                const isItemOverdue = (activeTab === 'converted' && isOverdue(lead.deadline) && lead.deliveryStatus !== 'completed') || 
                                     (activeTab === 'follow-up' && isOverdue(lead.nextFollowUp));
                return (
                <tr 
                  key={lead._id} 
                  className={`group hover:bg-slate-50/80 transition-all border-l-4 
                    ${isItemOverdue ? 'bg-red-100 border-red-500 animate-pulse-slow' : activeTab === 'follow-up' ? 'hover:border-amber-500' : 'hover:border-emerald-500'}`}
                >
                  <td className="px-6 py-4">
                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border transition-colors ${
                       activeTab === 'follow-up' 
                       ? 'bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-white' 
                       : 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-white'
                     }`}>
                        {lead.leadId}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-[13px] font-bold text-slate-900 leading-tight">{lead.name}</div>
                     <div className="flex flex-col gap-0.5 mt-1">
                        <div className="flex items-center gap-1.5">
                           <Phone size={10} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-600 tracking-tight">{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lead.location || 'Local'}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span className="text-[9px] font-bold text-slate-400 italic">#{lead.source || 'Direct'}</span>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-[11px] text-slate-600 font-bold max-w-[180px] truncate">{lead.requirement || lead.workType || '-'}</div>
                     {activeTab === 'converted' && (
                       <div className="text-[10px] font-bold text-emerald-600 tracking-tight mt-0.5">Deal Closed at ₹{(lead.totalAmount || lead.budget || 0).toLocaleString()}</div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                      {activeTab === 'follow-up' ? (
                         <div className={`${isOverdue(lead.nextFollowUp) ? 'text-red-600 bg-red-50' : isToday(lead.nextFollowUp) ? 'text-amber-600 bg-amber-50' : 'text-slate-600 bg-slate-100'} px-2.5 py-1 rounded-lg inline-block text-[10px] font-bold uppercase tracking-wider border border-transparent group-hover:border-current transition-all`}>
                            {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Set Date'}
                         </div>
                      ) : (
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                               <div className={`${isItemOverdue ? 'text-rose-600 bg-rose-100 animate-pulse' : 'text-emerald-700 bg-emerald-50'} font-bold text-[11px] uppercase tracking-tight px-2 py-0.5 rounded`}>
                                 {lead.assignedTo || 'Unassigned'}
                               </div>
                               {isItemOverdue && <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Critical</span>}
                            </div>
                            <div className="text-[9px] text-slate-400 font-medium">Closed on {new Date(lead.updatedAt).toLocaleDateString()}</div>
                         </div>
                      )}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {activeTab === 'follow-up' && (
                          <button 
                            onClick={() => handleQuickConvert(lead._id)}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all shadow-sm"
                            title="Mark as Converted"
                          >
                             <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedLeadForNote(lead); }}
                          className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm"
                          title="Lead Credentials / Notes"
                        >
                           <NotebookPen size={14} />
                        </button>
                        {activeTab === 'converted' && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedLeadForPayment(lead); }}
                             className="p-2 bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white rounded-lg transition-all shadow-sm"
                             title="Payment Installments"
                           >
                              <Wallet size={14} />
                           </button>
                        )}
                        <a 
                          href={`https://wa.me/91${lead.phone?.replace(/\D/g, '')}`} 
                          target="_blank" 
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-brand-primary hover:text-white rounded-lg transition-all shadow-sm"
                          title="Message Client"
                        >
                           <MessageSquare size={14} />
                        </a>
                        <a 
                          href={`tel:${lead.phone}`} 
                          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white rounded-lg transition-all shadow-sm"
                          title="Call Client"
                        >
                           <Phone size={14} />
                        </a>
                     </div>
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      {selectedLeadForNote && (
         <LeadConversationModal 
           lead={selectedLeadForNote} 
           onClose={() => setSelectedLeadForNote(null)} 
           onNoteAdded={fetchMyLeads}
         />
      )}

      {selectedLeadForPayment && (
         <PaymentHistoryModal 
           lead={selectedLeadForPayment} 
           onClose={() => setSelectedLeadForPayment(null)} 
           onPaymentAdded={fetchMyLeads}
         />
      )}
    </div>
  );
};

export default PersonalPipeline;
