import { useState, useEffect } from 'react';
import {
    Settings as SettingsIcon,
    User,
    Bell,
    Palette,
    Shield,
    GraduationCap,
    Moon,
    Sun,
    Globe,
    Mail,
    Smartphone,
    Clock,
    Eye,
    BarChart3,
    Lock,
    Trash2,
    Save,
    Check,
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Loader';
import useAuthStore from '@/store/authStore';
import userAPI from '@/api/user';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Settings = () => {
    const { user } = useAuthStore();
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('account');
    const [isSaving, setIsSaving] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await userAPI.getSettings();
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
                toast.error('Gagal memuat pengaturan');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [user?.id]);

    const handleToggle = async (section, key) => {
        const newValue = !settings[section][key];
        setSettings({
            ...settings,
            [section]: { ...settings[section], [key]: newValue }
        });

        try {
            await userAPI.updateSettings(section, { [key]: newValue });
            toast.success('Pengaturan berhasil disimpan');
        } catch (error) {
            // Revert on error
            setSettings({
                ...settings,
                [section]: { ...settings[section], [key]: !newValue }
            });
            toast.error('Gagal menyimpan pengaturan');
        }
    };

    const handleSelect = async (section, key, value) => {
        const oldValue = settings[section][key];
        setSettings({
            ...settings,
            [section]: { ...settings[section], [key]: value }
        });

        try {
            await userAPI.updateSettings(section, { [key]: value });
            toast.success('Pengaturan berhasil disimpan');
        } catch (error) {
            setSettings({
                ...settings,
                [section]: { ...settings[section], [key]: oldValue }
            });
            toast.error('Gagal menyimpan pengaturan');
        }
    };

    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Password baru tidak cocok');
            return;
        }
        if (passwordForm.newPassword.length < 8) {
            toast.error('Password minimal 8 karakter');
            return;
        }

        setIsSaving(true);
        try {
            await userAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
            toast.success('Password berhasil diubah');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'account', label: 'Akun', icon: User },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'appearance', label: 'Tampilan', icon: Palette },
        { id: 'privacy', label: 'Privasi', icon: Shield },
        { id: 'learning', label: 'Pembelajaran', icon: GraduationCap },
    ];

    if (isLoading) return <PageLoader />;

    const ToggleSwitch = ({ checked, onChange }) => (
        <button
            onClick={onChange}
            className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                checked ? 'bg-primary' : 'bg-muted'
            )}
        >
            <span
                className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    checked ? 'translate-x-6' : 'translate-x-1'
                )}
            />
        </button>
    );

    const SettingRow = ({ icon: Icon, title, description, children }) => (
        <div className="flex items-center justify-between py-4 border-b last:border-b-0">
            <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="ml-64 min-h-screen">
                <Navbar />
                <main className="p-6">
                    <PageHeader
                        title="Pengaturan"
                        description="Kelola preferensi akun dan aplikasi Anda"
                    />

                    <div className="flex gap-6">
                        {/* Sidebar Tabs */}
                        <Card className="w-64 h-fit sticky top-24">
                            <CardContent className="p-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                            activeTab === tab.id
                                                ? 'bg-primary text-primary-foreground'
                                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Settings Content */}
                        <div className="flex-1">
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informasi Akun</CardTitle>
                                            <CardDescription>Kelola informasi dasar akun Anda</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    label="Email"
                                                    value={user?.email || 'user@example.com'}
                                                    leftIcon={<Mail className="h-4 w-4" />}
                                                    disabled
                                                />
                                                <Input
                                                    label="Role"
                                                    value={user?.role || 'student'}
                                                    disabled
                                                    className="capitalize"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ubah Password</CardTitle>
                                            <CardDescription>Perbarui password akun Anda untuk keamanan</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <Input
                                                type="password"
                                                label="Password Saat Ini"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                leftIcon={<Lock className="h-4 w-4" />}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="password"
                                                    label="Password Baru"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                />
                                                <Input
                                                    type="password"
                                                    label="Konfirmasi Password"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                            <Button onClick={handleChangePassword} isLoading={isSaving}>
                                                <Save className="h-4 w-4 mr-2" />
                                                Ubah Password
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-destructive/50">
                                        <CardHeader>
                                            <CardTitle className="text-destructive">Zona Bahaya</CardTitle>
                                            <CardDescription>Tindakan yang tidak dapat dibatalkan</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button variant="destructive">
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Hapus Akun
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preferensi Notifikasi</CardTitle>
                                        <CardDescription>Pilih notifikasi yang ingin Anda terima</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SettingRow
                                            icon={Mail}
                                            title="Notifikasi Email"
                                            description="Terima notifikasi melalui email"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.notifications?.email}
                                                onChange={() => handleToggle('notifications', 'email')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={Smartphone}
                                            title="Push Notification"
                                            description="Terima notifikasi push di browser"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.notifications?.push}
                                                onChange={() => handleToggle('notifications', 'push')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={Clock}
                                            title="Pengingat Belajar"
                                            description="Ingatkan saya untuk belajar setiap hari"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.notifications?.studyReminder}
                                                onChange={() => handleToggle('notifications', 'studyReminder')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={BarChart3}
                                            title="Laporan Mingguan"
                                            description="Terima ringkasan aktivitas mingguan"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.notifications?.weeklyReport}
                                                onChange={() => handleToggle('notifications', 'weeklyReport')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={User}
                                            title="Pesan Mentor"
                                            description="Notifikasi pesan dari mentor"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.notifications?.mentorMessages}
                                                onChange={() => handleToggle('notifications', 'mentorMessages')}
                                            />
                                        </SettingRow>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Tampilan</CardTitle>
                                        <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="font-medium mb-3">Tema</p>
                                                <div className="flex gap-3">
                                                    {[
                                                        { value: 'light', label: 'Terang', icon: Sun },
                                                        { value: 'dark', label: 'Gelap', icon: Moon },
                                                        { value: 'system', label: 'Sistem', icon: SettingsIcon },
                                                    ].map((theme) => (
                                                        <button
                                                            key={theme.value}
                                                            onClick={() => handleSelect('appearance', 'theme', theme.value)}
                                                            className={cn(
                                                                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors min-w-24',
                                                                settings?.appearance?.theme === theme.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border hover:border-primary/50'
                                                            )}
                                                        >
                                                            <theme.icon className="h-6 w-6" />
                                                            <span className="text-sm font-medium">{theme.label}</span>
                                                            {settings?.appearance?.theme === theme.value && (
                                                                <Check className="h-4 w-4 text-primary" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <p className="font-medium mb-3">Bahasa</p>
                                                <div className="flex gap-3">
                                                    {[
                                                        { value: 'id', label: '🇮🇩 Indonesia' },
                                                        { value: 'en', label: '🇺🇸 English' },
                                                    ].map((lang) => (
                                                        <button
                                                            key={lang.value}
                                                            onClick={() => handleSelect('appearance', 'language', lang.value)}
                                                            className={cn(
                                                                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors',
                                                                settings?.appearance?.language === lang.value
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border hover:border-primary/50'
                                                            )}
                                                        >
                                                            <span className="text-sm font-medium">{lang.label}</span>
                                                            {settings?.appearance?.language === lang.value && (
                                                                <Check className="h-4 w-4 text-primary" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Privasi</CardTitle>
                                        <CardDescription>Kontrol siapa yang dapat melihat informasi Anda</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SettingRow
                                            icon={Eye}
                                            title="Visibilitas Profil"
                                            description="Izinkan orang lain melihat profil Anda"
                                        >
                                            <select
                                                value={settings?.privacy?.profileVisibility}
                                                onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value="public">Publik</option>
                                                <option value="friends">Teman</option>
                                                <option value="private">Privat</option>
                                            </select>
                                        </SettingRow>
                                        <SettingRow
                                            icon={BarChart3}
                                            title="Tampilkan Aktivitas"
                                            description="Tampilkan aktivitas belajar di profil"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.privacy?.showActivity}
                                                onChange={() => handleToggle('privacy', 'showActivity')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={BarChart3}
                                            title="Tampilkan Progress"
                                            description="Tampilkan progress kursus di profil"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.privacy?.showProgress}
                                                onChange={() => handleToggle('privacy', 'showProgress')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={Shield}
                                            title="Izinkan Analytics"
                                            description="Bantu kami meningkatkan layanan dengan data anonim"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.privacy?.allowAnalytics}
                                                onChange={() => handleToggle('privacy', 'allowAnalytics')}
                                            />
                                        </SettingRow>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Learning Tab */}
                            {activeTab === 'learning' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Preferensi Pembelajaran</CardTitle>
                                        <CardDescription>Sesuaikan pengalaman belajar Anda</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <SettingRow
                                            icon={Clock}
                                            title="Target Harian"
                                            description="Target waktu belajar per hari"
                                        >
                                            <select
                                                value={settings?.learning?.dailyGoal}
                                                onChange={(e) => handleSelect('learning', 'dailyGoal', parseInt(e.target.value))}
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            >
                                                <option value={30}>30 menit</option>
                                                <option value={60}>1 jam</option>
                                                <option value={90}>1.5 jam</option>
                                                <option value={120}>2 jam</option>
                                            </select>
                                        </SettingRow>
                                        <SettingRow
                                            icon={Bell}
                                            title="Waktu Pengingat"
                                            description="Waktu pengingat belajar harian"
                                        >
                                            <input
                                                type="time"
                                                value={settings?.learning?.reminderTime}
                                                onChange={(e) => handleSelect('learning', 'reminderTime', e.target.value)}
                                                className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={GraduationCap}
                                            title="Autoplay Video"
                                            description="Putar video berikutnya secara otomatis"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.learning?.autoplayVideos}
                                                onChange={() => handleToggle('learning', 'autoplayVideos')}
                                            />
                                        </SettingRow>
                                        <SettingRow
                                            icon={Globe}
                                            title="Subtitle"
                                            description="Tampilkan subtitle pada video"
                                        >
                                            <ToggleSwitch
                                                checked={settings?.learning?.subtitles}
                                                onChange={() => handleToggle('learning', 'subtitles')}
                                            />
                                        </SettingRow>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
