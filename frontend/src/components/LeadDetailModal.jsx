import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Target, 
  IndianRupee, 
  Clock, 
  Calendar,
  Briefcase,
  Layers,
  MessageSquare,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, color = "text-slate-600" }) => (
  <div className="flex items-start gap-4 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-slate-400" />
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
      <p className={`text-xs font-bold truncate ${color}`}>{value || 'N/A'}</p>
    </div>
  </div>
);

const LeadDetailModal = ({ lead, onClose }) => {
  if (!lead) return null;

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        
        {/* Premium Header */}
        <div className="relative h-32 bg-slate-900 overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10 backdrop-blur-md"
          >
            <X size={18} />
          </button>

          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end gap-5 translate-y-8">
            <div className="w-20 h-20 rounded-[28px] bg-white p-1 border-4 border-slate-900 shadow-xl overflow-hidden shrink-0">
              <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-indigo-500 to-brand-primary flex items-center justify-center text-white">
                <User size={36} />
              </div>
            </div>
            <div className="mb-10">
              <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">{lead.name}</h2>
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {lead.leadId || 'Direct Inquiry'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Contact Intelligence</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <InfoRow icon={Phone} label="Contact Number" value={lead.phone} color="text-slate-900" />
                  <InfoRow icon={Mail} label="Email Address" value={lead.email} />
                  <InfoRow icon={MapPin} label="Client Location" value={lead.location || lead.address} />
                  <InfoRow icon={Target} label="Lead Source" value={lead.source} />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Engagement Metrics</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <InfoRow icon={Calendar} label="Date Created" value={formatDate(lead.date || lead.createdAt)} />
                  <InfoRow icon={Clock} label="Next Follow Up" value={formatDate(lead.nextFollowUp)} color={lead.nextFollowUp ? "text-amber-600" : "text-slate-600"} />
                  {lead.deadline && <InfoRow icon={AlertCircle} label="Project Deadline" value={formatDate(lead.deadline)} color="text-rose-600" />}
                </div>
              </div>
            </div>

            {/* Financial & Project Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Project Particulars</h3>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden">
                  <InfoRow icon={Briefcase} label="Requirement" value={lead.workType || lead.requirement} color="text-slate-900" />
                  <InfoRow icon={Layers} label="Pipeline State" value={lead.status} />
                  <InfoRow icon={ShieldCheck} label="Handled By" value={lead.convertedBy || 'Pending Assignment'} color="text-indigo-600" />
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Financial Outlook</h3>
                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Total Value</p>
                    <IndianRupee size={16} className="text-white/50" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tight mb-4">₹{(lead.totalAmount || lead.budget || 0).toLocaleString()}</h4>
                  
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-indigo-200 uppercase tracking-widest">Received</span>
                      <span className="text-white">₹{(lead.advanceAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-indigo-200 uppercase tracking-widest">Pending Balance</span>
                      <span className="text-rose-300">₹{((lead.totalAmount || lead.budget || 0) - (lead.advanceAmount || 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Remarks Section */}
          <div className="mt-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Internal Remarks</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="flex gap-3">
                <div className="shrink-0 p-2 bg-white rounded-lg border border-slate-200">
                  <MessageSquare size={14} className="text-slate-400" />
                </div>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">
                  {lead.remarks || 'No specific remarks documented for this lead.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
          >
            Close View
          </button>
          <a 
            href={`tel:${lead.phone}`}
            className="flex-1 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 text-center"
          >
            Connect Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
