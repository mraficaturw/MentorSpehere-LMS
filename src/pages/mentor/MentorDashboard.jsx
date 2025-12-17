import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Activity,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import mentorAPI from '@/api/mentor';

const MentorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await mentorAPI.getDashboard(1);
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading) return <PageLoader />;

  const stats = [
    { 
      label: 'Total Siswa', 
      value: dashboard?.stats?.totalStudents || 0, 
      icon: Users, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    { 
      label: 'Siswa Aktif', 
      value: dashboard?.stats?.activeStudents || 0, 
      icon: Activity, 
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    { 
      label: 'Perlu Perhatian', 
      value: dashboard?.stats?.studentsAtRisk || 0, 
      icon: AlertTriangle, 
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    { 
      label: 'Intervensi Minggu Ini', 
      value: dashboard?.stats?.interventionsThisWeek || 0, 
      icon: CheckCircle2, 
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return <ArrowUpRight className="h-4 w-4 text-success" />;
    if (trend === 'declining') return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return null;
  };

  const getRiskColor = (score) => {
    if (score <= 30) return 'bg-success';
    if (score <= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <PageHeader 
            title="Mentor Dashboard"
            description="Pantau dan kelola progress siswa Anda"
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
            {/* Global Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Aktivitas Global Siswa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard?.globalActivity || []}>
                      <defs>
                        <linearGradient id="colorGlobal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                      />
                      <Area 
                        type="monotone" 
                        dataKey="studyTime" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorGlobal)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribusi Risiko</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboard?.riskDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {dashboard?.riskDistribution?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {dashboard?.riskDistribution?.map((item) => (
                    <div key={item.level} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.level}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count} siswa</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Students at Risk */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Siswa Perlu Perhatian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.studentsAtRisk?.slice(0, 5).map((student) => (
                    <Link 
                      key={student.id} 
                      to={`/mentor/students/${student.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="font-medium text-muted-foreground">
                            {student.name?.charAt(0)}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${getRiskColor(student.riskScore)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{student.name}</p>
                          {getTrendIcon(student.trend)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Progress: {student.progress}% • Risk: {student.riskScore}
                        </p>
                      </div>
                      <Badge variant={student.riskScore >= 60 ? 'destructive' : 'warning'}>
                        {student.riskScore >= 60 ? 'Kritis' : 'Perhatian'}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboard?.notifications?.map((notif) => (
                    <div 
                      key={notif.id}
                      className={`p-4 rounded-lg border ${notif.read ? 'bg-card' : 'bg-muted/50'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          notif.type === 'danger' ? 'bg-destructive/10 text-destructive' :
                          notif.type === 'warning' ? 'bg-warning/10 text-warning' :
                          notif.type === 'success' ? 'bg-success/10 text-success' :
                          'bg-info/10 text-info'
                        }`}>
                          {notif.type === 'danger' ? <AlertTriangle className="h-4 w-4" /> :
                           notif.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> :
                           <Bell className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-sm text-muted-foreground">{notif.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MentorDashboard;
