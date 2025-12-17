import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Trophy,
  TrendingUp,
  Play,
  FileText,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import useAuthStore from '@/store/authStore';
import studentAPI from '@/api/student';
import { formatDuration, getRelativeTime } from '@/utils/formatDate';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await studentAPI.getDashboard();
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [user?.id]);

  if (isLoading) return <PageLoader />;

  const stats = [
    {
      label: 'Total Waktu Belajar',
      value: formatDuration(dashboard?.user?.totalStudyTime || 0),
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Modul Selesai',
      value: dashboard?.user?.completedModules || 0,
      icon: Trophy,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Course Aktif',
      value: dashboard?.user?.enrolledCourses || 0,
      icon: BookOpen,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Progress Rata-rata',
      value: `${dashboard?.user?.averageProgress || 0}%`,
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <PageHeader
            title={`Selamat datang, ${user?.name?.split(' ')[0]}! 👋`}
            description="Pantau progress belajar Anda dan dapatkan insight dari AI"
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Aktivitas Belajar Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard?.weeklyActivity || []}>
                      <defs>
                        <linearGradient id="colorStudyTime" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`${value} menit`, 'Waktu Belajar']}
                      />
                      <Area
                        type="monotone"
                        dataKey="studyTime"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorStudyTime)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Insight Card */}
            <Card className="gradient-primary text-primary-foreground">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">{dashboard?.aiInsight?.title}</span>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">
                  {dashboard?.aiInsight?.message}
                </p>
                <Link to="/student/reflection">
                  <Button
                    variant="secondary"
                    className="mt-6 w-full bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                  >
                    Lihat Detail Insight
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Aktivitas Terbaru</CardTitle>
                <Link to="/student/activity">
                  <Button variant="ghost" size="sm">
                    Lihat Semua
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.recentActivity?.slice(0, 4).map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${activity.type === 'video' ? 'bg-primary/10 text-primary' :
                          activity.type === 'reading' ? 'bg-info/10 text-info' :
                            'bg-success/10 text-success'
                        }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(activity.duration)} • {getRelativeTime(activity.date)}
                        </p>
                      </div>
                      {activity.score && (
                        <Badge variant="success">Skor: {activity.score}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-warning" />
                  Deadline Mendatang
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.upcomingDeadlines?.map((deadline) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                    >
                      <div>
                        <p className="font-medium">{deadline.title}</p>
                        <p className="text-sm text-muted-foreground">{deadline.course}</p>
                      </div>
                      <Badge variant="warning">
                        {new Date(deadline.dueDate).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </Badge>
                    </div>
                  ))}
                  {(!dashboard?.upcomingDeadlines || dashboard.upcomingDeadlines.length === 0) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Tidak ada deadline mendatang</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
