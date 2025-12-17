import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Lock, 
  Clock,
  BookOpen,
  Trophy,
  Sparkles,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import coursesAPI from '@/api/courses';
import { formatDuration } from '@/utils/formatDate';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quizSummary, setQuizSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const [courseData, quizData] = await Promise.all([
          coursesAPI.getById(id),
          coursesAPI.getQuizSummary(id),
        ]);
        setCourse(courseData);
        setQuizSummary(quizData);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleGenerateReflection = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('AI Reflection berhasil dibuat!');
    } catch (error) {
      toast.error('Gagal membuat AI Reflection');
    } finally {
      setIsGenerating(false);
    }
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case 'video': return Play;
      case 'reading': return FileText;
      case 'quiz': return HelpCircle;
      default: return BookOpen;
    }
  };

  const getStatusBadge = (status, score) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" dot>Selesai {score && `(${score}%)`}</Badge>;
      case 'in-progress':
        return <Badge variant="warning" dot>Sedang Dipelajari</Badge>;
      case 'locked':
        return <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" /> Terkunci</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) return <PageLoader />;

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course tidak ditemukan</h2>
          <Link to="/student/courses">
            <Button>Kembali ke Daftar Course</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          {/* Back Button */}
          <Link to="/student/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Course
          </Link>

          {/* Course Header */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <div className="absolute inset-0">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-sidebar/95 to-sidebar/70" />
            </div>
            <div className="relative p-8 text-sidebar-foreground">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-sidebar-foreground/20 text-sidebar-foreground border-0">
                  {course.category}
                </Badge>
                <Badge className="bg-sidebar-foreground/20 text-sidebar-foreground border-0">
                  {course.level}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-sidebar-foreground/80 max-w-2xl mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {course.totalModules} Modul
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  {course.completedModules}/{course.totalModules} Selesai
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="h-3 bg-sidebar-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sidebar-foreground rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modules List */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Modul</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.modules?.map((module, index) => {
                    const Icon = getModuleIcon(module.type);
                    const isLocked = module.status === 'locked';

                    return (
                      <div 
                        key={module.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                          isLocked 
                            ? 'bg-muted/30 opacity-60 cursor-not-allowed' 
                            : 'hover:bg-muted/50 cursor-pointer'
                        }`}
                      >
                        <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${
                          module.status === 'completed' ? 'bg-success/10 text-success' :
                          module.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {module.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h4 className="font-medium truncate">{module.title}</h4>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="capitalize">{module.type}</span>
                            <span>•</span>
                            <span>{formatDuration(module.duration)}</span>
                          </div>
                        </div>

                        {getStatusBadge(module.status, module.score)}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quiz Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Ringkasan Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Quiz</span>
                      <span className="font-medium">{quizSummary?.totalQuizzes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Selesai</span>
                      <span className="font-medium">{quizSummary?.completedQuizzes || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rata-rata Skor</span>
                      <Badge variant={quizSummary?.averageScore >= 70 ? 'success' : 'warning'}>
                        {Math.round(quizSummary?.averageScore || 0)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Reflection Button */}
              <Card className="gradient-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">AI Reflection</span>
                  </div>
                  <p className="text-sm opacity-90 mb-4">
                    Generate personalized learning insight berdasarkan progress Anda di course ini.
                  </p>
                  <Button 
                    variant="secondary"
                    fullWidth
                    onClick={handleGenerateReflection}
                    isLoading={isGenerating}
                    className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate AI Reflection
                  </Button>
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {course.instructor?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Course Instructor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
