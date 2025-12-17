// Fake Users
export const mockUsers = [
  {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@student.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    enrolledCourses: [1, 2, 3],
    totalStudyTime: 1240,
    completedModules: 15,
    riskScore: 25,
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    email: 'siti@student.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    enrolledCourses: [1, 2],
    totalStudyTime: 890,
    completedModules: 10,
    riskScore: 45,
  },
  {
    id: 3,
    name: 'Ahmad Wijaya',
    email: 'ahmad@student.com',
    password: 'password123',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    enrolledCourses: [2, 3],
    totalStudyTime: 450,
    completedModules: 5,
    riskScore: 72,
  },
  {
    id: 4,
    name: 'Dr. Hendra Kusuma',
    email: 'hendra@mentor.com',
    password: 'password123',
    role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    assignedStudents: [1, 2, 3],
  },
  {
    id: 5,
    name: 'Prof. Maria Tan',
    email: 'maria@mentor.com',
    password: 'password123',
    role: 'mentor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    assignedStudents: [1, 2],
  },
];

// Fake Courses
export const mockCourses = [
  {
    id: 1,
    title: 'Dasar-Dasar Machine Learning',
    description: 'Pelajari fundamental machine learning dari konsep hingga implementasi praktis dengan Python.',
    instructor: 'Dr. Hendra Kusuma',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    duration: '12 minggu',
    totalModules: 24,
    completedModules: 18,
    progress: 75,
    category: 'Data Science',
    level: 'Beginner',
    modules: [
      { id: 1, title: 'Pengenalan Machine Learning', duration: 45, status: 'completed', type: 'video' },
      { id: 2, title: 'Supervised vs Unsupervised Learning', duration: 60, status: 'completed', type: 'video' },
      { id: 3, title: 'Linear Regression', duration: 90, status: 'completed', type: 'reading' },
      { id: 4, title: 'Quiz: Konsep Dasar', duration: 30, status: 'completed', type: 'quiz', score: 85 },
      { id: 5, title: 'Decision Trees', duration: 75, status: 'in-progress', type: 'video' },
      { id: 6, title: 'Random Forest', duration: 60, status: 'locked', type: 'video' },
    ],
  },
  {
    id: 2,
    title: 'Web Development dengan React',
    description: 'Kuasai React.js untuk membangun aplikasi web modern yang interaktif dan responsif.',
    instructor: 'Prof. Maria Tan',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    duration: '10 minggu',
    totalModules: 20,
    completedModules: 8,
    progress: 40,
    category: 'Web Development',
    level: 'Intermediate',
    modules: [
      { id: 1, title: 'Pengenalan React', duration: 45, status: 'completed', type: 'video' },
      { id: 2, title: 'JSX dan Components', duration: 60, status: 'completed', type: 'video' },
      { id: 3, title: 'State dan Props', duration: 90, status: 'completed', type: 'reading' },
      { id: 4, title: 'Quiz: React Basics', duration: 30, status: 'completed', type: 'quiz', score: 92 },
      { id: 5, title: 'Hooks: useState & useEffect', duration: 75, status: 'in-progress', type: 'video' },
    ],
  },
  {
    id: 3,
    title: 'Data Analysis dengan Python',
    description: 'Pelajari teknik analisis data menggunakan Python, Pandas, dan visualisasi data.',
    instructor: 'Dr. Hendra Kusuma',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    duration: '8 minggu',
    totalModules: 16,
    completedModules: 4,
    progress: 25,
    category: 'Data Science',
    level: 'Beginner',
    modules: [
      { id: 1, title: 'Pengenalan Python untuk Data', duration: 60, status: 'completed', type: 'video' },
      { id: 2, title: 'NumPy Fundamentals', duration: 75, status: 'completed', type: 'video' },
      { id: 3, title: 'Pandas DataFrame', duration: 90, status: 'in-progress', type: 'reading' },
      { id: 4, title: 'Data Visualization', duration: 60, status: 'locked', type: 'video' },
    ],
  },
];

// Fake Activity Logs
export const mockActivityLogs = [
  { id: 1, userId: 1, type: 'video', title: 'Menonton: Decision Trees', duration: 45, date: '2024-01-15T10:30:00', courseId: 1 },
  { id: 2, userId: 1, type: 'reading', title: 'Membaca: Linear Regression Notes', duration: 30, date: '2024-01-15T11:30:00', courseId: 1 },
  { id: 3, userId: 1, type: 'quiz', title: 'Quiz: Konsep Dasar ML', duration: 25, date: '2024-01-14T14:00:00', courseId: 1, score: 85 },
  { id: 4, userId: 1, type: 'video', title: 'Menonton: Hooks useState', duration: 60, date: '2024-01-14T09:00:00', courseId: 2 },
  { id: 5, userId: 1, type: 'reading', title: 'Membaca: React Documentation', duration: 45, date: '2024-01-13T16:00:00', courseId: 2 },
  { id: 6, userId: 1, type: 'video', title: 'Menonton: Pandas DataFrame', duration: 55, date: '2024-01-13T10:00:00', courseId: 3 },
  { id: 7, userId: 1, type: 'quiz', title: 'Quiz: React Basics', duration: 20, date: '2024-01-12T15:30:00', courseId: 2, score: 92 },
];

// Weekly Activity Data for Charts
export const mockWeeklyActivity = [
  { day: 'Sen', studyTime: 120, activities: 5 },
  { day: 'Sel', studyTime: 90, activities: 4 },
  { day: 'Rab', studyTime: 150, activities: 6 },
  { day: 'Kam', studyTime: 60, activities: 3 },
  { day: 'Jum', studyTime: 180, activities: 7 },
  { day: 'Sab', studyTime: 45, activities: 2 },
  { day: 'Min', studyTime: 30, activities: 1 },
];

// AI Generated Reflections
export const mockReflections = {
  daily: {
    date: '2024-01-15',
    summary: 'Hari ini Anda menunjukkan fokus yang baik pada materi Machine Learning. Anda menyelesaikan 2 video dan 1 bacaan dengan konsistensi yang meningkat.',
    strengths: ['Konsistensi waktu belajar meningkat 20%', 'Skor quiz di atas rata-rata', 'Fokus pada satu topik dalam satu sesi'],
    improvements: ['Coba tingkatkan durasi sesi belajar', 'Pertimbangkan untuk mengulang materi yang sulit'],
    mood: 'positive',
  },
  weekly: {
    weekNumber: 3,
    totalStudyTime: 675,
    averageDaily: 96,
    topSubjects: ['Machine Learning', 'React', 'Python'],
    insights: [
      'Produktivitas tertinggi pada hari Jumat (180 menit)',
      'Performa quiz konsisten di atas 85%',
      'Pola belajar lebih aktif di pagi hari',
    ],
    recommendation: 'Pertahankan momentum belajar Anda. Fokus pada penyelesaian modul Machine Learning sebelum melanjutkan ke topik baru.',
  },
  learningPath: {
    currentPhase: 'Foundation Building',
    progress: 45,
    nextMilestone: 'Menyelesaikan Modul Decision Trees',
    estimatedCompletion: '2024-02-15',
    suggestedTopics: [
      { title: 'Neural Networks Basics', priority: 'high', reason: 'Kelanjutan natural dari Decision Trees' },
      { title: 'Feature Engineering', priority: 'medium', reason: 'Meningkatkan pemahaman preprocessing data' },
      { title: 'Model Evaluation', priority: 'medium', reason: 'Fundamental untuk validasi model' },
    ],
  },
  riskAssessment: {
    score: 25,
    level: 'low',
    factors: [
      { name: 'Konsistensi Belajar', value: 85, status: 'good' },
      { name: 'Penyelesaian Tugas', value: 78, status: 'good' },
      { name: 'Engagement', value: 70, status: 'moderate' },
      { name: 'Quiz Performance', value: 88, status: 'excellent' },
    ],
    explanation: 'Skor risiko Anda rendah karena konsistensi belajar yang baik dan performa quiz di atas rata-rata. Engagement bisa ditingkatkan dengan lebih aktif di forum diskusi.',
    recommendations: [
      'Pertahankan jadwal belajar rutin Anda',
      'Coba bergabung dengan grup diskusi untuk meningkatkan engagement',
      'Set reminder untuk menyelesaikan modul yang tertunda',
    ],
  },
};

// Mentor Dashboard Stats
export const mockMentorStats = {
  totalStudents: 25,
  activeStudents: 22,
  averageProgress: 62,
  studentsAtRisk: 4,
  interventionsThisWeek: 7,
  completionRate: 78,
};

// Student Risk Heatmap Data
export const mockStudentRiskData = [
  { id: 1, name: 'Budi Santoso', riskScore: 25, lastActive: '2024-01-15', progress: 75, trend: 'improving' },
  { id: 2, name: 'Siti Rahayu', riskScore: 45, lastActive: '2024-01-14', progress: 40, trend: 'stable' },
  { id: 3, name: 'Ahmad Wijaya', riskScore: 72, lastActive: '2024-01-10', progress: 25, trend: 'declining' },
  { id: 4, name: 'Dewi Lestari', riskScore: 15, lastActive: '2024-01-15', progress: 90, trend: 'improving' },
  { id: 5, name: 'Eko Prasetyo', riskScore: 58, lastActive: '2024-01-12', progress: 35, trend: 'declining' },
  { id: 6, name: 'Fitri Handayani', riskScore: 30, lastActive: '2024-01-15', progress: 65, trend: 'stable' },
];

// Interventions
export const mockInterventions = [
  {
    id: 1,
    studentId: 3,
    studentName: 'Ahmad Wijaya',
    mentorId: 4,
    type: 'reminder',
    message: 'Ahmad, saya perhatikan aktivitas belajar Anda menurun minggu ini. Apakah ada kendala yang bisa saya bantu?',
    status: 'sent',
    createdAt: '2024-01-14T10:00:00',
    response: null,
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Siti Rahayu',
    mentorId: 4,
    type: 'meeting',
    message: 'Mari kita jadwalkan sesi konsultasi untuk membahas progress Anda pada modul Machine Learning.',
    status: 'scheduled',
    createdAt: '2024-01-13T14:00:00',
    scheduledDate: '2024-01-16T10:00:00',
  },
  {
    id: 3,
    studentId: 5,
    studentName: 'Eko Prasetyo',
    mentorId: 4,
    type: 'resource',
    message: 'Saya lampirkan materi tambahan untuk membantu pemahaman Anda tentang Decision Trees.',
    status: 'sent',
    createdAt: '2024-01-12T09:00:00',
    attachments: ['decision_trees_guide.pdf'],
  },
];

// Notifications
export const mockNotifications = [
  { id: 1, type: 'danger', title: 'Danger Zone', message: 'Ahmad Wijaya tidak aktif selama 5 hari', time: '2 jam lalu', read: false },
  { id: 2, type: 'warning', title: 'Perlu Perhatian', message: 'Eko Prasetyo menunjukkan penurunan performa', time: '5 jam lalu', read: false },
  { id: 3, type: 'info', title: 'Pencapaian Baru', message: 'Dewi Lestari menyelesaikan course Machine Learning', time: '1 hari lalu', read: true },
  { id: 4, type: 'success', title: 'Intervensi Berhasil', message: 'Siti Rahayu kembali aktif setelah reminder', time: '2 hari lalu', read: true },
];

export default {
  mockUsers,
  mockCourses,
  mockActivityLogs,
  mockWeeklyActivity,
  mockReflections,
  mockMentorStats,
  mockStudentRiskData,
  mockInterventions,
  mockNotifications,
};
