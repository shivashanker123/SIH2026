import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Calendar,
  BookOpen,
  BarChart3,
  Users,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Sparkles,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStudent } from '@/contexts/StudentContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userType: 'student' | 'admin';
}

const authorityLabels = {
  counsellor: 'Counsellor',
  district: 'District Authority',
  state: 'State Authority',
  national: 'National Authority',
} as const;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, userType }) => {
  const navigate = useNavigate();
  const { authorityRole } = useStudent();
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const studentItems = [
    { title: 'Personal Care', url: '/student-dashboard', icon: Heart },
    { title: 'Resources', url: '/student-dashboard/resources', icon: BookOpen },
    { title: 'Self-Care', url: '/student-dashboard/self-care', icon: Sparkles },
    { title: 'Check-ins', url: '/student-dashboard/journal', icon: Calendar },
    { title: 'My Compensation', url: '/student-dashboard/compensation', icon: Wallet },
    { title: 'Book Session', url: '/student-dashboard/booking', icon: Calendar },
  ];

  const dashboardHomeUrl = authorityRole ? `/dashboard/${authorityRole}` : '/admin-dashboard';
  const adminItems = [
    { title: 'Dashboard', url: dashboardHomeUrl, icon: Home },
    { title: 'Results & Alerts', url: '/admin-dashboard/results', icon: BarChart3 },
    { title: 'Victim Requests', url: '/admin-dashboard/requests', icon: Users },
  ];

  const items = userType === 'student' ? studentItems : adminItems;
  const userLabel = userType === 'student'
    ? 'Victim'
    : authorityRole
      ? authorityLabels[authorityRole]
      : 'Admin';

  const handleLogout = () => {
    navigate('/');
  };

  const handleEmergencyAlert = () => {
    setIsEmergencyOpen(false);
    toast.success('Alert sent to your district authority');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={cn(
        "fixed left-0 top-0 h-full bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl z-50 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 lg:w-16",
        "lg:relative lg:translate-x-0",
        !isOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8">
            {isOpen && (
              <h2 className="text-xl font-bold text-cyan-400">
                Haven
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="glass-card hover:scale-110 transition-all duration-300"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 space-y-2">
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 shadow-lg border border-cyan-500/30"
                    : "hover:bg-gray-700/30 text-gray-300 hover:text-cyan-400",
                  !isOpen && "lg:justify-center lg:px-2"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300 group-hover:scale-110",
                  !isOpen && "lg:w-6 lg:h-6"
                )} />
                {isOpen && (
                  <span className="ml-3 font-medium animate-fade-in">
                    {item.title}
                  </span>
                )}
                <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            {isOpen && (
              <div className="bg-gray-700/30 p-4 text-center animate-fade-in rounded-xl border border-gray-600/30">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-full mx-auto mb-2 flex items-center justify-center border border-cyan-500/30">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="font-medium text-sm text-gray-200">{userLabel} User</p>
                <p className="text-xs text-gray-400">Welcome back!</p>
              </div>
            )}

            <Dialog open={isEmergencyOpen} onOpenChange={setIsEmergencyOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  title="Emergency / I'm in danger"
                  className={cn(
                    "w-full justify-start text-red-300 border border-red-500/40 bg-red-500/10 hover:text-white hover:bg-red-600/30 transition-all duration-300",
                    !isOpen && "lg:justify-center lg:px-2"
                  )}
                >
                  <AlertTriangle className="w-5 h-5" />
                  {isOpen && <span className="ml-3 font-medium">Emergency / I'm in danger</span>}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-red-500/40 text-white">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-300">
                    <AlertTriangle className="w-5 h-5" />
                    Are you in immediate danger right now?
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    If you need urgent help, your district authority can be alerted now.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                  <Button variant="outline" onClick={() => setIsEmergencyOpen(false)}>
                    No, just checking in.
                  </Button>
                  <Button variant="destructive" onClick={handleEmergencyAlert}>
                    Yes — alert now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300",
                !isOpen && "lg:justify-center lg:px-2"
              )}
            >
              <LogOut className="w-5 h-5" />
              {isOpen && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
