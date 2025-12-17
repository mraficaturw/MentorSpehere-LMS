import { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Target,
  Lightbulb,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import useReflectionStore from '@/store/reflectionStore';
import reflectionAPI from '@/api/reflection';
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

const ReflectionAI = () => {
  const { user } = useAuthStore();
  const {
    dailyReflection,
    weeklyInsight,
    learningPath,
    riskScore,
    setAllReflections,
    isGenerating,
    generateReflection,
  } = useReflectionStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const data = await reflectionAPI.getReflection();
        setAllReflections(data);
      } catch (error) {
        console.error('Error fetching reflections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReflections();
  }, [user?.id, setAllReflections]);

  const handleGenerateReflection = async () => {
    try {
      await generateReflection(() => reflectionAPI.generateReflection());
      toast.success('AI Reflection berhasil di-generate!');
    } catch (error) {
      toast.error('Gagal generate AI Reflection');
    }
  };

  const getRiskLevel = (score) => {
    if (score <= 30) return { label: 'Rendah', variant: 'success', color: 'text-success' };
    if (score <= 60) return { label: 'Sedang', variant: 'warning', color: 'text-warning' };
    return { label: 'Tinggi', variant: 'destructive', color: 'text-destructive' };
  };

  if (isLoading) return <PageLoader />;

  const riskInfo = getRiskLevel(riskScore?.score || 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <PageHeader
            title="AI Reflection"
            description="Personalized learning insight powered by AI"
            actions={
              <Button onClick={handleGenerateReflection} isLoading={isGenerating}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Generate Ulang
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Reflection */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Daily Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {dailyReflection?.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <h4 className="font-medium text-success flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4" />
                      Kelebihan
                    </h4>
                    <ul className="space-y-2">
                      {dailyReflection?.strengths?.map((strength, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                    <h4 className="font-medium text-warning flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4" />
                      Perlu Ditingkatkan
                    </h4>
                    <ul className="space-y-2">
                      {dailyReflection?.improvements?.map((improvement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Risk Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-5xl font-bold ${riskInfo.color}`}>
                    {riskScore?.score || 0}
                  </div>
                  <Badge variant={riskInfo.variant} className="mt-2">
                    Risiko {riskInfo.label}
                  </Badge>
                </div>

                {/* Risk Factors */}
                <div className="space-y-3">
                  {riskScore?.factors?.map((factor, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{factor.name}</span>
                        <span className="font-medium">{factor.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${factor.status === 'excellent' ? 'bg-success' :
                              factor.status === 'good' ? 'bg-primary' :
                                factor.status === 'moderate' ? 'bg-warning' :
                                  'bg-destructive'
                            }`}
                          style={{ width: `${factor.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why This Score */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-info" />
                Mengapa Skor Ini?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                {riskScore?.explanation}
              </p>

              <h4 className="font-medium mb-4">Rekomendasi Langkah Perbaikan:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {riskScore?.recommendations?.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-sm">Langkah {index + 1}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Weekly Insight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Weekly Learning Insight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Minggu Ini</p>
                    <p className="text-2xl font-bold">{weeklyInsight?.totalStudyTime || 0} menit</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
                    <p className="text-2xl font-bold">{weeklyInsight?.averageDaily || 0} menit</p>
                  </div>
                </div>

                <h4 className="font-medium mb-3">Insights</h4>
                <ul className="space-y-2">
                  {weeklyInsight?.insights?.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      {insight}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 rounded-lg gradient-primary text-primary-foreground">
                  <h4 className="font-medium mb-2">Rekomendasi</h4>
                  <p className="text-sm opacity-90">{weeklyInsight?.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Personalized Learning Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress Fase</span>
                    <span className="font-medium">{learningPath?.progress || 0}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary rounded-full"
                      style={{ width: `${learningPath?.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fase: <span className="font-medium text-foreground">{learningPath?.currentPhase}</span>
                  </p>
                </div>

                <div className="p-4 rounded-lg border mb-6">
                  <p className="text-sm text-muted-foreground">Milestone Berikutnya</p>
                  <p className="font-medium">{learningPath?.nextMilestone}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimasi selesai: {learningPath?.estimatedCompletion}
                  </p>
                </div>

                <h4 className="font-medium mb-3">Topik yang Disarankan</h4>
                <div className="space-y-3">
                  {learningPath?.suggestedTopics?.map((topic, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{topic.title}</span>
                        <Badge
                          variant={topic.priority === 'high' ? 'destructive' : 'secondary'}
                          size="sm"
                        >
                          {topic.priority === 'high' ? 'Prioritas' : 'Opsional'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{topic.reason}</p>
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

export default ReflectionAI;
