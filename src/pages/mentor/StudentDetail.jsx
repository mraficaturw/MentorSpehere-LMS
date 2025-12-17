import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  BookOpen, 
  TrendingUp,
  AlertTriangle,
  Activity,
  Brain,
  MessageSquare,
  Play,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import mentorAPI from '@/api/mentor';
import { formatDuration, getRelativeTime } from '@/utils/formatDate';
import { toast } from 'sonner';

const StudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [interventionMessage, setInterventionMessage] = useState('');
  const [interventionType, setInterventionType] = useState('reminder');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const data = await mentorAPI.getStudentDetail(id);
        setStudent(data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleCreateIntervention = async () => {
    try {
      await mentorAPI.createIntervention({
        studentId: parseInt(id),
        studentName: student.name,
        mentorId: 4,
        type: interventionType,
        message: interventionMessage,
      });
      toast.success('Intervensi berhasil dibuat!');
      setShowInterventionModal(false);
      setInterventionMessage('');
    } catch (error) {
      toast.error('Gagal membuat intervensi');
    }
  };

  const getRiskLevel = (score) => {
    if (score <= 30) return { label: 'Rendah', variant: 'success', color: 'text-success' };
    if (score <= 60) return { label: 'Sedang', variant: 'warning', color: 'text-warning' };
    return { label: 'Tinggi', variant: 'destructive', color: 'text-destructive' };
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading) return <PageLoader />;

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Siswa tidak ditemukan</h2>
          <Link to="/mentor/dashboard">
            <Button>Kembali ke Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const riskInfo = getRiskLevel(student.riskScore);

  const performanceData = [
    { subject: 'Quiz', value: student.performanceMetrics?.averageQuizScore || 0 },
    { subject: 'Completion', value: student.performanceMetrics?.completionRate || 0 },
    { subject: 'Engagement', value: student.performanceMetrics?.engagementScore || 0 },
    { subject: 'Consistency', value: student.performanceMetrics?.consistencyScore || 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          {/* Back Button */}
          <Link to="/mentor/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>

          {/* Student Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                {student.avatar ? (
                  <img src={student.avatar} alt={student.name} className="h-16 w-16 rounded-full" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                <p className="text-muted-foreground">{student.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={riskInfo.variant}>Risk Score: {student.riskScore}</Badge>
                  <Badge variant="secondary">Last Active: {getRelativeTime(student.lastActive)}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowInterventionModal(true)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Buat Intervensi
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Belajar</p>
                    <p className="text-xl font-bold">{formatDuration(student.totalStudyTime || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <BookOpen className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modul Selesai</p>
                    <p className="text-xl font-bold">{student.completedModules || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <TrendingUp className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Progress</p>
                    <p className="text-xl font-bold">{student.progress || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${riskInfo.variant === 'success' ? 'bg-success/10' : riskInfo.variant === 'warning' ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                    <AlertTriangle className={`h-5 w-5 ${riskInfo.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Level</p>
                    <p className={`text-xl font-bold ${riskInfo.color}`}>{riskInfo.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Aktivitas Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={student.weeklyActivity || []}>
                      <defs>
                        <linearGradient id="colorStudent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="studyTime" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#colorStudent)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Radar */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Aktivitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {student.activityLog?.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'video' ? 'bg-primary/10 text-primary' :
                        activity.type === 'reading' ? 'bg-info/10 text-info' :
                        'bg-success/10 text-success'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDuration(activity.duration)} • {getRelativeTime(activity.date)}
                        </p>
                      </div>
                      {activity.score && (
                        <Badge variant="success" size="sm">Skor: {activity.score}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {student.aiInsights?.daily?.summary}
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Risk Explanation</h4>
                    <p className="text-sm text-muted-foreground">
                      {student.aiInsights?.riskAssessment?.explanation}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Rekomendasi Intervensi</h4>
                    <ul className="space-y-2">
                      {student.aiInsights?.riskAssessment?.recommendations?.map((rec, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intervention History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Riwayat Intervensi</CardTitle>
            </CardHeader>
            <CardContent>
              {student.interventionHistory?.length > 0 ? (
                <div className="space-y-4">
                  {student.interventionHistory.map((intervention) => (
                    <div key={intervention.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="capitalize">{intervention.type}</Badge>
                        <Badge variant={intervention.status === 'sent' ? 'success' : 'warning'}>
                          {intervention.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{intervention.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {getRelativeTime(intervention.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada riwayat intervensi
                </p>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Intervention Modal */}
      <Modal
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        title="Buat Intervensi"
        description="Kirim pesan atau pengingat kepada siswa"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowInterventionModal(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateIntervention} disabled={!interventionMessage.trim()}>
              Kirim Intervensi
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tipe Intervensi</label>
            <div className="grid grid-cols-3 gap-2">
              {['reminder', 'meeting', 'resource'].map((type) => (
                <button
                  key={type}
                  onClick={() => setInterventionType(type)}
                  className={`p-3 rounded-lg border text-sm capitalize transition-colors ${
                    interventionType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Pesan</label>
            <textarea
              className="w-full h-32 px-3 py-2 rounded-lg border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Tulis pesan untuk siswa..."
              value={interventionMessage}
              onChange={(e) => setInterventionMessage(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDetail;
