import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import {
  LayoutDashboard,
  BookOpen,
  Activity,
  Brain,
  Users,
  AlertTriangle,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { useState } from 'react';

const studentMenuItems = [
  { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/student/courses', label: 'Courses', icon: BookOpen },
  { path: '/student/activity', label: 'Learning Activity', icon: Activity },
  { path: '/student/reflection', label: 'AI Reflection', icon: Brain },
];

const mentorMenuItems = [
  { path: '/mentor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/mentor/students/1', label: 'Student Details', icon: Users },
  { path: '/mentor/interventions', label: 'Interventions', icon: MessageSquare },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { role } = useAuthStore();

  const menuItems = role === 'mentor' ? mentorMenuItems : studentMenuItems;

  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!isCollapsed && (
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">MentorSphere</span>
          </Link>
        )}
        {isCollapsed && (
          <GraduationCap className="h-8 w-8 text-sidebar-primary mx-auto" />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/student/dashboard' && item.path !== '/mentor/dashboard' && location.pathname.startsWith(item.path.split('/').slice(0, -1).join('/')));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive 
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-foreground shadow-sm hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      {/* Role Badge */}
      <div className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2">
            <div className={cn(
              'h-2 w-2 rounded-full',
              role === 'mentor' ? 'bg-warning' : 'bg-success'
            )} />
            <span className="text-xs font-medium capitalize text-sidebar-accent-foreground">
              {role === 'mentor' ? 'Mentor Mode' : 'Student Mode'}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
