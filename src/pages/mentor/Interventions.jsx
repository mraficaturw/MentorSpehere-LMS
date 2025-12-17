import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Send,
  Calendar,
  FileText,
  Filter,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Loader';
import mentorAPI from '@/api/mentor';
import { getRelativeTime, formatDateTime } from '@/utils/formatDate';
import { toast } from 'sonner';

const Interventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newIntervention, setNewIntervention] = useState({
    studentId: '',
    type: 'reminder',
    message: '',
  });

  useEffect(() => {
    const fetchInterventions = async () => {
      try {
        const data = await mentorAPI.getInterventions(1);
        setInterventions(data);
      } catch (error) {
        console.error('Error fetching interventions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterventions();
  }, []);

  const handleCreateIntervention = async () => {
    if (!newIntervention.message.trim()) {
      toast.error('Pesan tidak boleh kosong');
      return;
    }

    try {
      const created = await mentorAPI.createIntervention({
        ...newIntervention,
        mentorId: 1,
      });
      setInterventions([created, ...interventions]);
      setShowNewModal(false);
      setNewIntervention({ studentId: '', type: 'reminder', message: '' });
      toast.success('Intervensi berhasil dibuat!');
    } catch (error) {
      toast.error('Gagal membuat intervensi');
    }
  };

  const filteredInterventions = interventions.filter((i) => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reminder': return <Send className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'resource': return <FileText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'reminder': return 'bg-primary/10 text-primary';
      case 'meeting': return 'bg-warning/10 text-warning';
      case 'resource': return 'bg-info/10 text-info';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return <Badge variant="success" dot>Terkirim</Badge>;
      case 'scheduled':
        return <Badge variant="warning" dot>Terjadwal</Badge>;
      case 'pending':
        return <Badge variant="secondary" dot>Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) return <PageLoader />;

  const stats = {
    total: interventions.length,
    sent: interventions.filter((i) => i.status === 'sent').length,
    scheduled: interventions.filter((i) => i.status === 'scheduled').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Navbar />
        <main className="p-6">
          <PageHeader 
            title="Interventions"
            description="Kelola dan pantau intervensi untuk siswa"
            actions={
              <Button onClick={() => setShowNewModal(true)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Buat Intervensi
              </Button>
            }
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Intervensi</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terkirim</p>
                    <p className="text-2xl font-bold">{stats.sent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Clock className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Terjadwal</p>
                    <p className="text-2xl font-bold">{stats.scheduled}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {['all', 'sent', 'scheduled', 'pending'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(status)}
              >
                {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Interventions List */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Intervensi</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInterventions.length > 0 ? (
                <div className="space-y-4">
                  {filteredInterventions.map((intervention) => (
                    <div 
                      key={intervention.id}
                      className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg ${getTypeColor(intervention.type)}`}>
                          {getTypeIcon(intervention.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Link 
                                to={`/mentor/students/${intervention.studentId}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {intervention.studentName}
                              </Link>
                              <Badge variant="secondary" className="capitalize">{intervention.type}</Badge>
                            </div>
                            {getStatusBadge(intervention.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {intervention.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getRelativeTime(intervention.createdAt)}
                            </span>
                            {intervention.scheduledDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateTime(intervention.scheduledDate)}
                              </span>
                            )}
                            {intervention.attachments && (
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {intervention.attachments.length} lampiran
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Tidak ada intervensi</h3>
                  <p className="text-muted-foreground mb-4">
                    {filter === 'all' 
                      ? 'Belum ada intervensi yang dibuat' 
                      : `Tidak ada intervensi dengan status "${filter}"`}
                  </p>
                  <Button onClick={() => setShowNewModal(true)}>
                    Buat Intervensi Pertama
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* New Intervention Modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Buat Intervensi Baru"
        description="Kirim intervensi kepada siswa yang membutuhkan perhatian"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowNewModal(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateIntervention}>
              <Send className="h-4 w-4 mr-2" />
              Kirim Intervensi
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Siswa</label>
            <select
              className="w-full h-10 px-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={newIntervention.studentId}
              onChange={(e) => setNewIntervention({ ...newIntervention, studentId: e.target.value })}
            >
              <option value="">Pilih siswa...</option>
              <option value="1">Budi Santoso</option>
              <option value="2">Siti Rahayu</option>
              <option value="3">Ahmad Wijaya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipe Intervensi</label>
            <div className="grid grid-cols-3 gap-2">
              {['reminder', 'meeting', 'resource'].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewIntervention({ ...newIntervention, type })}
                  className={`p-3 rounded-lg border text-sm capitalize transition-colors ${
                    newIntervention.type === type
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
              value={newIntervention.message}
              onChange={(e) => setNewIntervention({ ...newIntervention, message: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Interventions;
