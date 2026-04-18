import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Fixed Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-60'}`}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
               title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             >
               <Menu size={20} />
             </button>
             <h2 className="text-gray-500 font-medium transition-opacity duration-300">
               {isCollapsed ? '' : 'Overview'}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer transition-colors">
              <span className="text-xs font-bold">🔔</span>
            </div>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center gap-2">
               <span className="text-sm font-semibold text-gray-700">Premium Support</span>
               <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
