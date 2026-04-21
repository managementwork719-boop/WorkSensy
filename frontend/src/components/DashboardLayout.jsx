import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // Dynamic Title Logic
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/sales/month/')) {
      const monthId = path.split('/').pop();
      const [year, monthNum] = monthId.split('-');
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[parseInt(monthNum) - 1]} Overview`;
    }
    if (path === '/leads') return 'Leads Management';
    if (path === '/team') return 'Team Tracking';
    if (path === '/clients') return 'Client Base';
    if (path === '/settings') return 'Account Settings';
    if (path === '/dashboard') return 'Sales Overview';
    return 'Dashboard';
  };

  return (
    <div className="flex bg-[#fdfdff] min-h-screen font-inter">
      {/* Fixed Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 flex flex-col ${isCollapsed ? 'ml-20' : 'ml-64'} relative background-container`}>
        
        {/* Premium Organic Liquid Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" 
          style={{ zIndex: 0, left: isCollapsed ? '80px' : '256px' }}>
          
          {/* Subtle Base Tint */}
          <div className="absolute inset-0 bg-[#f8f9ff]/50" />

          {/* Top-Left Organic Glow - More Vibrant */}
          <div style={{
            position: 'absolute',
            top: '-5%',
            left: '5%',
            width: '80vw',
            height: '70vh',
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.08) 40%, transparent 70%)',
            filter: 'blur(80px)',
            transform: 'rotate(-10deg)',
          }} />

          {/* Center-Right Dynamic Blob */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: '60vw',
            height: '60vh',
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.12) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 80%)',
            filter: 'blur(100px)',
          }} />

          {/* Floating Organic Waves (SVG) - Mid-Screen Position for Visibility */}
          <div className="absolute top-[5%] left-0 w-full h-[90vh] opacity-[0.95]" style={{ filter: 'blur(45px)' }}>
            <svg viewBox="0 0 1440 800" className="absolute top-0 w-[200%] h-full transform translate-x-[-10%] opacity-60">
              <path 
                fill="#cbd5e1" 
                d="M0,320L48,304C96,288,192,256,288,261.3C384,267,480,309,576,325.3C672,341,768,331,864,293.3C960,256,1056,192,1152,181.3C1248,171,1344,213,1392,234.7L1440,256L1440,800L1392,800C1344,800,1248,800,1152,800C1056,800,960,800,864,800C768,800,672,800,576,800C480,800,384,800,288,800C192,800,96,800,48,800L0,800Z"
              ></path>
            </svg>
            <svg viewBox="0 0 1440 800" className="absolute top-[10%] w-[180%] h-full transform translate-x-[-15%] opacity-50">
              <path 
                fill="#ddd6fe" 
                d="M0,480L60,469.3C120,459,240,437,360,453.3C480,469,600,523,720,533.3C840,544,960,512,1080,480C1200,448,1320,416,1380,400L1440,384L1440,800L1380,800C1320,800,1200,800,1080,800C960,800,840,800,720,800C600,800,480,800,360,800C240,800,120,800,60,800L0,800Z"
              ></path>
            </svg>
          </div>

          {/* Subtle Dynamic Mesh */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
            opacity: 0.7
          }} />
        </div>

        {/* Dynamic Page Content */}
        <main className="p-8 relative z-10 flex-1">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
