import { useState, useEffect } from 'react';
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Phone,
    GraduationCap,
    Clock,
    Trophy,
    BookOpen,
    Award,
    Flame,
    Edit3,
    Camera,
    Play,
    FileText,
    HelpCircle,
    X,
    Save,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card.jsx';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import useAuthStore from '@/store/authStore';
import userAPI from '@/api/user';
import { formatDuration, getRelativeTime } from '@/utils/formatDate';
import { toast } from 'sonner';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userAPI.getProfile();
                setProfile(data);
                setEditForm({
                    name: data.name,
                    bio: data.bio,
                    phone: data.phone,
                    location: data.location,
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Gagal memuat profil');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id]);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const updatedProfile = await userAPI.updateProfile(editForm);
            setProfile(updatedProfile);
            updateUser({ name: editForm.name });
            setIsEditing(false);
            toast.success('Profil berhasil disimpan');
        } catch (error) {
            toast.error('Gagal menyimpan profil');
        } finally {
            setIsSaving(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'video': return <Play className="h-4 w-4" />;
            case 'reading': return <FileText className="h-4 w-4" />;
            case 'quiz': return <HelpCircle className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    if (isLoading) return <PageLoader />;

    const stats = [
        { label: 'Waktu Belajar', value: formatDuration(profile?.stats?.totalStudyTime || 0), icon: Clock, color: 'text-primary' },
        { label: 'Modul Selesai', value: profile?.stats?.modulesCompleted || 0, icon: Trophy, color: 'text-success' },
        { label: 'Course Aktif', value: profile?.stats?.coursesEnrolled || 0, icon: BookOpen, color: 'text-warning' },
        { label: 'Sertifikat', value: profile?.stats?.certificates || 0, icon: Award, color: 'text-info' },
        { label: 'Badge', value: profile?.stats?.badges || 0, icon: Award, color: 'text-purple-500' },
        { label: 'Streak', value: `${profile?.stats?.streak || 0} hari`, icon: Flame, color: 'text-orange-500' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="ml-64 min-h-screen">
                <Navbar />
                <main className="p-6">
                    <PageHeader
                        title="Profil Saya"
                        description="Kelola informasi dan lihat statistik pembelajaran Anda"
                        actions={
                            !isEditing ? (
                                <Button onClick={() => setIsEditing(true)}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Edit Profil
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        <X className="h-4 w-4 mr-2" />
                                        Batal
                                    </Button>
                                    <Button onClick={handleSaveProfile} isLoading={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Simpan
                                    </Button>
                                </div>
                            )
                        }
                    />

                    {/* Profile Header Card */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row items-start gap-6">
                                {/* Avatar */}
                                <div className="relative group">
                                    <img
                                        src={profile?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                                        alt={profile?.name}
                                        className="h-32 w-32 rounded-full border-4 border-primary/20 bg-muted"
                                    />
                                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="h-8 w-8 text-white" />
                                    </button>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    {isEditing ? (
                                        <div className="space-y-4 max-w-md">
                                            <Input
                                                label="Nama Lengkap"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            />
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Bio</label>
                                                <textarea
                                                    value={editForm.bio}
                                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                    rows={3}
                                                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <Input
                                                label="No. Telepon"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                leftIcon={<Phone className="h-4 w-4" />}
                                            />
                                            <Input
                                                label="Lokasi"
                                                value={editForm.location}
                                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                leftIcon={<MapPin className="h-4 w-4" />}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-2xl font-bold">{profile?.name}</h2>
                                                <Badge variant={profile?.role === 'mentor' ? 'warning' : 'success'} className="capitalize">
                                                    {profile?.role}
                                                </Badge>
                                            </div>

                                            <p className="text-muted-foreground mb-4 max-w-2xl">
                                                {profile?.bio}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {profile?.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {profile?.phone}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {profile?.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-4 w-4" />
                                                    {profile?.university}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    Bergabung {new Date(profile?.joinedDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="pt-4 pb-4">
                                    <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Badges */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    Badge Terkumpul
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {profile?.badges?.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                                        >
                                            <span className="text-2xl">{badge.icon}</span>
                                            <div>
                                                <p className="font-medium text-sm">{badge.name}</p>
                                                <p className="text-xs text-muted-foreground">{badge.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-info" />
                                    Aktivitas Terbaru
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {profile?.recentActivity?.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
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
                                                    {getRelativeTime(activity.date)}
                                                    {activity.duration && ` • ${activity.duration} menit`}
                                                    {activity.score && ` • Skor: ${activity.score}`}
                                                </p>
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

export default Profile;
