import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Edit3, Image as ImageIcon, BarChart2, ListChecks,
  Upload, CreditCard, Bookmark, LogOut
} from 'lucide-react';
import { useAuth } from '../../context';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition
      ${active ? "bg-emerald-700/20 text-white" : "text-slate-200 hover:bg-white/10"}`}
  >
    {Icon && <Icon className="h-4 w-4" />}
    <span className="truncate">{label}</span>
  </button>
);

const ProfileSidebar = ({ open = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`lg:sticky lg:top-20 self-start ${open ? "block" : "hidden lg:block"}`}>
      <div className="bg-slate-900 rounded-2xl p-3 text-slate-100">
        <div className="px-3 py-3 text-xs uppercase tracking-wider text-slate-400">
          Menu
        </div>
        <div className="space-y-1">
          <SidebarItem
            icon={Home}
            label="My MarriagePaper"
            active={location.pathname === '/dashboard'}
            onClick={() => navigate('/dashboard')}
          />
          <SidebarItem
            icon={ListChecks}
            label="My Proposals Tracker"
            active={location.pathname === '/proposals'}
            onClick={() => navigate('/proposals')}
          />
          <SidebarItem
            icon={Edit3}
            label="Edit My Ad"
            active={location.pathname === '/edit-profile'}
            onClick={() => navigate('/edit-profile')}
          />
          <SidebarItem
            icon={ImageIcon}
            label="Additional Photo"
            active={location.pathname === '/photos'}
            onClick={() => navigate('/photos')}
          />
          <SidebarItem
            icon={BarChart2}
            label="AD Circulation Report"
            active={location.pathname === '/circulation-report'}
            onClick={() => navigate('/circulation-report')}
          />
          <SidebarItem
            icon={CreditCard}
            label="My CCP Tracker"
            active={location.pathname === '/ccp-tracker'}
            onClick={() => navigate('/ccp-tracker')}
          />
          <SidebarItem
            icon={Upload}
            label="My Photo Request Tracker"
            active={location.pathname === '/photo-request-tracker'}
            onClick={() => navigate('/photo-request-tracker')}
          />
          <SidebarItem
            icon={CreditCard}
            label="My Payments History"
            active={location.pathname === '/payments-history'}
            onClick={() => navigate('/payments-history')}
          />
          <SidebarItem
            icon={Bookmark}
            label="My Bookmarks"
            active={location.pathname === '/bookmarks'}
            onClick={() => navigate('/bookmarks')}
          />
          <SidebarItem
            icon={LogOut}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
