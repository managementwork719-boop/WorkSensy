import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Users, 
  Search, 
  IndianRupee, 
  Phone,
  Mail,
  X,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  Edit2,
  Trash2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const EditClientModal = ({ client, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: client.name,
    phone: client.phone,
    email: client.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.patch(`/clients/${client._id}`, formData);
      onUpdate();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2 text-indigo-600">
            <Edit2 size={18} />
            <h2 className="text-sm font-bold text-slate-900">Edit Client Details</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={16}/></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
            <input 
              type="text" required value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mobile Number</label>
            <input 
              type="text" required value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs font-semibold"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
            <input 
              type="email" value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs font-semibold"
              placeholder="client@example.com"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-bold uppercase tracking-[0.15em] text-[10px] rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ClientProfileModal = ({ clientId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) fetchProfile();
  }, [clientId]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/clients/profile/${clientId}`);
      setData(res.data.data);
    } catch (err) {
      console.error('Failed to fetch client profile');
    } finally {
      setLoading(false);
    }
  };

  if (!clientId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <Users size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{data?.client?.name || 'Loading...'}</h2>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Unified Client Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all"><X size={20}/></button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-12"><div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-500 p-5 rounded-2xl text-white shadow-xl shadow-emerald-200/50">
                  <TrendingUp className="mb-4 opacity-80" size={18} />
                  <h3 className="text-xl font-black">₹{data.leads.filter(l => l.status === 'converted').reduce((acc, curr) => acc + (curr.budget || 0), 0).toLocaleString()}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-100 mt-1">Total Lifetime Value</p>
                </div>
                <div className="bg-indigo-500 p-5 rounded-2xl text-white shadow-xl shadow-indigo-200/50">
                  <CheckCircle2 className="mb-4 opacity-80" size={18} />
                  <h3 className="text-xl font-black">{data.leads.filter(l => l.status === 'converted').length}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-100 mt-1">Completed Works</p>
                </div>
                <div className="bg-amber-500 p-5 rounded-2xl text-white shadow-xl shadow-amber-200/50">
                  <Clock className="mb-4 opacity-80" size={18} />
                  <h3 className="text-xl font-black">{data.leads.filter(l => l.status !== 'converted').length}</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-100 mt-1">Pending Requests</p>
                </div>
              </div>

              {/* Work Timeline */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Target size={14} className="text-indigo-500" /> Automatic Work History
                </h3>
                
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 pb-4">
                  {data.leads.map((work, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                        work.status === 'converted' ? 'bg-emerald-500' : work.status === 'follow-up' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}>
                        {work.status === 'converted' ? <CheckCircle2 size={10} className="text-white"/> : <Clock size={10} className="text-white"/>}
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(work.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <h4 className="text-[13px] font-bold text-slate-900 mt-0.5">{work.requirement || 'Standard Service'}</h4>
                          </div>
                          <div className="text-right">
                            <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                              work.status === 'converted' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {work.status}
                            </div>
                            <div className="text-[11px] font-bold text-slate-900 mt-1">₹{work.budget?.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-200/50">
                           <div className="flex items-center gap-1.5 text-slate-500">
                             <TrendingUp size={12} />
                             <span className="text-[10px] font-medium uppercase tracking-tight">Handled By: <span className="text-slate-900 font-bold">{work.convertedBy || 'Sales Team'}</span></span>
                           </div>
                           <div className="flex items-center gap-1.5 text-slate-500">
                             <ExternalLink size={12} />
                             <span className="text-[10px] font-medium uppercase tracking-tight">Source: <span className="text-slate-900 font-bold">{work.source}</span></span>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get('/clients/all');
      setClients(res.data.data.clients);
    } catch (err) {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
       const res = await API.post('/clients/sync');
       alert(res.data.message);
       fetchClients();
    } catch (err) {
       alert('Sync failed');
    } finally {
       setSyncing(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this client? Associated work history will be unlinked.')) return;
    
    try {
      await API.delete(`/clients/${id}`);
      fetchClients();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Unified Clients</h1>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">Cross-Work History & Retention Tracking</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
             onClick={handleSync}
             disabled={syncing}
             className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-sm flex items-center gap-2 group"
             title="Link legacy leads to client profiles"
          >
             <RefreshCw size={16} className={`${syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
             <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Sync History</span>
          </button>
          <div className="relative flex-1 sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text"
              placeholder="Search by name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50 outline-none text-xs font-semibold transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white h-32 rounded-2xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <div 
                key={client._id}
                onClick={() => setSelectedClientId(client._id)}
                className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden h-fit"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-12 -mt-12 transition-all group-hover:bg-indigo-100/50"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                      <Users size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                         client.totalWorks > 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {client.totalWorks > 1 ? 'REPEAT' : 'NEW'}
                       </span>
                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingClient(client); }}
                            className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors border border-indigo-100/50"
                          >
                             <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, client._id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100/50"
                          >
                             <Trash2 size={12} />
                          </button>
                       </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{client.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={10} className="text-slate-400" />
                    <span className="text-[11px] font-medium text-slate-500">{client.phone}</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Works</span>
                      <span className="text-sm font-black text-slate-900">{client.totalWorks || 0}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifetime Value</span>
                      <span className="text-sm font-black text-emerald-600">₹{client.totalRevenue?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 mx-auto max-w-xl">
              <Users size={48} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-sm font-bold text-slate-900">No clients found</h3>
              <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest">Try adjusting your search criteria</p>
            </div>
          )}
        </>
      )}

      {selectedClientId && !editingClient && (
        <ClientProfileModal 
          clientId={selectedClientId} 
          onClose={() => setSelectedClientId(null)} 
        />
      )}

      {editingClient && (
        <EditClientModal 
          client={editingClient} 
          onClose={() => setEditingClient(null)} 
          onUpdate={fetchClients} 
        />
      )}
    </div>
  );
};

export default Clients;
