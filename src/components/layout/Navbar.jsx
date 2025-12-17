import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Search, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import useAuthStore from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, logout } = useAuthStore();

  const notifications = [
    { id: 1, title: 'Quiz baru tersedia', message: 'Machine Learning - Decision Trees', time: '5 menit lalu', unread: true },
    { id: 2, title: 'Pengingat belajar', message: 'Anda belum belajar hari ini', time: '1 jam lalu', unread: true },
    { id: 3, title: 'Achievement!', message: 'Selamat! Anda menyelesaikan 10 modul', time: '2 hari lalu', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-6">
      {/* Search */}
      <div className="hidden md:block w-96">
        <Input
          placeholder="Cari course, modul, atau materi..."
          leftIcon={<Search className="h-4 w-4" />}
          className="bg-background"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-card shadow-lg z-50 animate-slide-up">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notifikasi</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors',
                        notif.unread && 'bg-primary/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        )}
                        <div className={cn(!notif.unread && 'ml-5')}>
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <Button variant="ghost" size="sm" fullWidth>
                    Lihat Semua Notifikasi
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={user?.name}
              className="h-8 w-8 rounded-full bg-muted"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Student'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-card shadow-lg z-50 animate-slide-up">
                <div className="p-4 border-b">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
