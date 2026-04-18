import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  LogOut, 
  LayoutDashboard, 
  Settings,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isCollapsed }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['super-admin', 'admin', 'sales-manager', 'sales-team', 'project-manager', 'project-team'] },
    { name: 'Leads', icon: TrendingUp, path: '/leads', roles: ['super-admin', 'admin', 'sales-manager', 'sales-team'] },
    { name: 'Projects', icon: Briefcase, path: '/projects', roles: ['super-admin', 'admin', 'project-manager', 'project-team'] },
    { name: 'Team', icon: Users, path: '/team', roles: ['super-admin', 'admin', 'sales-manager', 'project-manager'] },
    { name: 'Clients', icon: UserCheck, path: '/clients', roles: ['super-admin', 'admin', 'sales-manager', 'sales-team', 'project-manager'] },
    { name: 'Billing', icon: CreditCard, path: '/billing', roles: ['super-admin', 'admin', 'project-manager'] },
    { name: 'Companies', icon: ShieldAlert, path: '/companies', roles: ['super-admin'] },
    { name: 'Settings', icon: Settings, path: '/settings', roles: ['super-admin', 'admin', 'sales-manager', 'sales-team', 'project-manager', 'project-team'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-60'} bg-[#0f172a] h-screen flex flex-col text-white fixed left-0 top-0 shadow-xl z-50 transition-all duration-300`}>
      {/* Brand */}
      <div className={`p-5 border-b border-white/5 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-7 h-7 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-sm transition-colors duration-500 shrink-0">
          W
        </div>
        {!isCollapsed && <span className="text-lg font-bold tracking-tight animate-in fade-in duration-300">Work Management</span>}
      </div>
        {!isCollapsed && (
          <div className="px-5 mt-2">
            {!user?.companyId && user?.role === 'super-admin' && (
              <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold italic">
                Master Control
              </p>
            )}
            {user?.companyId && (
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold italic truncate">
                {user.companyId.name}
              </p>
            )}
          </div>
        )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-shadow' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`
              }
              title={isCollapsed ? item.name : ''}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
              {!isCollapsed && <span className="text-sm font-semibold truncate animate-in slide-in-from-left-2 duration-300">{item.name}</span>}
            </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className={`p-4 border-t border-white/5 bg-[#0a0f1d]/50 ${isCollapsed ? 'flex flex-col items-center gap-4' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 mb-4 px-1'}`}>
          <img 
            src={user?.profilePic} 
            alt="profile" 
            className="w-9 h-9 rounded-xl border-2 border-brand-primary/30 object-cover transition-all duration-500 shadow-sm shrink-0"
          />
          {!isCollapsed && (
            <div className="overflow-hidden animate-in fade-in duration-300">
              <p className="text-[13px] font-bold truncate leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-500 capitalize font-medium">{user?.role === 'user' ? 'Team Member' : user?.role.replace('-', ' ')}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`flex items-center justify-center gap-2 ${isCollapsed ? 'w-10 h-10 p-0 rounded-full' : 'w-full px-4 py-2 rounded-xl'} text-red-400 hover:bg-red-400/5 transition-all duration-300 text-xs font-bold border border-red-400/10 hover:border-red-400/20`}
          title="Logout System"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout System</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
