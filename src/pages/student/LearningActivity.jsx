import { useState, useEffect } from 'react';
import { Play, FileText, HelpCircle, Clock, TrendingUp, Calendar } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Loader';
import useAuthStore from '@/store/authStore';
import studentAPI from '@/api/student';
import { formatDuration, getRelativeTime, formatDate } from '@/utils/formatDate';

const LearningActivity = () => {
  const [activityData, setActivityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await studentAPI.getActivity(user?.id);
        setActivityData(data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [user?.id]);

  if (isLoading) return <PageLoader />;

  const pieData = [
    { name: 'Video', value: activityData?.breakdown?.video || 0, color: 'hsl(var(--primary))' },
    { name: 'Reading', value: activityData?.breakdown?.reading || 0, color: 'hsl(var(--info))' },
    { name: 'Quiz', value: activityData?.breakdown?.quiz || 0, color: 'hsl(var(--success))' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'video': return 'bg-primary/10 text-primary';
      case 'reading': return 'bg-info/10 text-info';
      case 'quiz': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <PageHeader 
            title="Learning Activity"
            description="Pantau dan analisis aktivitas belajar Anda"
          />

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Waktu Belajar</p>
                    <p className="text-2xl font-bold">{formatDuration(activityData?.totalTime || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-success/10">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Aktivitas</p>
                    <p className="text-2xl font-bold">{activityData?.activities?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-warning/10">
                    <Calendar className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
                    <p className="text-2xl font-bold">{formatDuration(Math.round((activityData?.totalTime || 0) / 7))}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Aktivitas Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData?.weeklyData || []}>
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
                      <Bar 
                        dataKey="studyTime" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Activity Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Breakdown Aktivitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value) => [`${formatDuration(value)}`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{formatDuration(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Log */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Log Aktivitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData?.activities?.map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2.5 rounded-lg ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(activity.date)} • {formatDuration(activity.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.score && (
                        <Badge variant="success">Skor: {activity.score}%</Badge>
                      )}
                      <Badge variant="secondary" className="capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default LearningActivity;
