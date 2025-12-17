package services

import (
	"fmt"
	"time"

	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"
)

var mockStudentRiskData = []models.StudentRiskData{
	{ID: "1", Name: "Budi Santoso", RiskScore: 25, LastActive: time.Now().Format("2006-01-02"), Progress: 75, Trend: "improving"},
	{ID: "2", Name: "Siti Rahayu", RiskScore: 45, LastActive: time.Now().Add(-24 * time.Hour).Format("2006-01-02"), Progress: 40, Trend: "stable"},
	{ID: "3", Name: "Ahmad Wijaya", RiskScore: 72, LastActive: time.Now().Add(-120 * time.Hour).Format("2006-01-02"), Progress: 25, Trend: "declining"},
	{ID: "4", Name: "Dewi Lestari", RiskScore: 15, LastActive: time.Now().Format("2006-01-02"), Progress: 90, Trend: "improving"},
	{ID: "5", Name: "Eko Prasetyo", RiskScore: 58, LastActive: time.Now().Add(-72 * time.Hour).Format("2006-01-02"), Progress: 35, Trend: "declining"},
	{ID: "6", Name: "Fitri Handayani", RiskScore: 30, LastActive: time.Now().Format("2006-01-02"), Progress: 65, Trend: "stable"},
}

var mockInterventions = []models.Intervention{
	{
		ID:          "1",
		StudentID:   "3",
		StudentName: "Ahmad Wijaya",
		MentorID:    "4",
		Type:        "reminder",
		Message:     "Ahmad, saya perhatikan aktivitas belajar Anda menurun minggu ini. Apakah ada kendala yang bisa saya bantu?",
		Status:      "sent",
		CreatedAt:   time.Now().Add(-24 * time.Hour),
	},
	{
		ID:            "2",
		StudentID:     "2",
		StudentName:   "Siti Rahayu",
		MentorID:      "4",
		Type:          "meeting",
		Message:       "Mari kita jadwalkan sesi konsultasi untuk membahas progress Anda pada modul Machine Learning.",
		Status:        "scheduled",
		CreatedAt:     time.Now().Add(-48 * time.Hour),
		ScheduledDate: timePtr(time.Now().Add(24 * time.Hour)),
	},
	{
		ID:          "3",
		StudentID:   "5",
		StudentName: "Eko Prasetyo",
		MentorID:    "4",
		Type:        "resource",
		Message:     "Saya lampirkan materi tambahan untuk membantu pemahaman Anda tentang Decision Trees.",
		Status:      "sent",
		CreatedAt:   time.Now().Add(-72 * time.Hour),
		Attachments: []string{"decision_trees_guide.pdf"},
	},
}

var mockNotifications = []models.Notification{
	{ID: "1", Type: "danger", Title: "Danger Zone", Message: "Ahmad Wijaya tidak aktif selama 5 hari", Time: "2 jam lalu", Read: false},
	{ID: "2", Type: "warning", Title: "Perlu Perhatian", Message: "Eko Prasetyo menunjukkan penurunan performa", Time: "5 jam lalu", Read: false},
	{ID: "3", Type: "info", Title: "Pencapaian Baru", Message: "Dewi Lestari menyelesaikan course Machine Learning", Time: "1 hari lalu", Read: true},
	{ID: "4", Type: "success", Title: "Intervensi Berhasil", Message: "Siti Rahayu kembali aktif setelah reminder", Time: "2 hari lalu", Read: true},
}

func timePtr(t time.Time) *time.Time {
	return &t
}

type MentorService struct {
	userRepo         *repository.UserRepository
	interventionRepo *repository.InterventionRepository
	notificationRepo *repository.NotificationRepository
}

func NewMentorService() *MentorService {
	return &MentorService{
		userRepo:         repository.NewUserRepository(),
		interventionRepo: repository.NewInterventionRepository(),
		notificationRepo: repository.NewNotificationRepository(),
	}
}

func (s *MentorService) GetDashboard(mentorID string) *models.MentorDashboard {
	// Filter students at risk
	var studentsAtRisk []models.StudentRiskData
	for _, student := range mockStudentRiskData {
		if student.RiskScore >= 50 {
			studentsAtRisk = append(studentsAtRisk, student)
		}
	}

	// Global activity (aggregated)
	var globalActivity []models.WeeklyActivity
	for _, w := range mockWeeklyActivity {
		globalActivity = append(globalActivity, models.WeeklyActivity{
			Day:        w.Day,
			StudyTime:  w.StudyTime * 3,
			Activities: w.Activities * 5,
		})
	}

	// Get recent interventions
	recentInterventions := s.getRecentInterventions(mentorID, 3)

	// Get notifications
	notifications := s.getNotifications(mentorID)

	return &models.MentorDashboard{
		Stats: models.MentorStats{
			TotalStudents:         25,
			ActiveStudents:        22,
			AverageProgress:       62,
			StudentsAtRisk:        4,
			InterventionsThisWeek: 7,
			CompletionRate:        78,
		},
		StudentsAtRisk:      studentsAtRisk,
		RecentInterventions: recentInterventions,
		Notifications:       notifications,
		GlobalActivity:      globalActivity,
		RiskDistribution: []models.RiskDistribution{
			{Level: "Low", Count: 15, Color: "hsl(var(--success))"},
			{Level: "Medium", Count: 6, Color: "hsl(var(--warning))"},
			{Level: "High", Count: 4, Color: "hsl(var(--destructive))"},
		},
	}
}

func (s *MentorService) getRecentInterventions(mentorID string, limit int) []models.Intervention {
	// Try Firestore first
	if s.interventionRepo.IsFirestoreAvailable() {
		interventions, err := s.interventionRepo.FindByMentorID(mentorID)
		if err == nil && len(interventions) > 0 {
			if len(interventions) > limit {
				return interventions[:limit]
			}
			return interventions
		}
	}

	// Fallback to mock data
	if len(mockInterventions) > limit {
		return mockInterventions[:limit]
	}
	return mockInterventions
}

func (s *MentorService) getNotifications(mentorID string) []models.Notification {
	// Try Firestore first
	if s.notificationRepo.IsFirestoreAvailable() {
		notifications, err := s.notificationRepo.FindByUserID(mentorID)
		if err == nil && len(notifications) > 0 {
			return notifications
		}
	}

	// Fallback to mock data
	return mockNotifications
}

func (s *MentorService) GetStudents(mentorID string) []models.StudentRiskData {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		students, err := s.userRepo.GetStudentsByMentor(mentorID)
		if err == nil && len(students) > 0 {
			var riskData []models.StudentRiskData
			for _, student := range students {
				riskData = append(riskData, models.StudentRiskData{
					ID:         student.ID,
					Name:       student.Name,
					RiskScore:  student.RiskScore,
					LastActive: student.JoinedDate.Format("2006-01-02"),
					Progress:   student.CompletedModules * 100 / 20, // Estimate
					Trend:      "stable",
				})
			}
			return riskData
		}
	}

	// Fallback to mock data
	return mockStudentRiskData
}

func (s *MentorService) GetStudentDetail(studentID string) (*models.StudentDetail, error) {
	var student *models.StudentRiskData
	for _, s := range mockStudentRiskData {
		if s.ID == studentID {
			student = &s
			break
		}
	}

	if student == nil {
		return nil, fmt.Errorf("student not found")
	}

	authService := NewAuthService()
	user, _ := authService.GetUserByID(studentID)
	if user == nil {
		user = &models.User{
			ID:     studentID,
			Name:   student.Name,
			Avatar: fmt.Sprintf("https://api.dicebear.com/7.x/avataaars/svg?seed=%s", student.Name),
		}
	}

	interventionHistory := s.getStudentInterventions(studentID)

	reflectionService := NewReflectionService()

	return &models.StudentDetail{
		StudentRiskData:     *student,
		User:                *user,
		ActivityLog:         mockActivityLogs[:5],
		WeeklyActivity:      mockWeeklyActivity,
		AIInsights:          *reflectionService.GetReflection(studentID),
		InterventionHistory: interventionHistory,
		PerformanceMetrics: models.PerformanceMetrics{
			AverageQuizScore: 82,
			CompletionRate:   float64(student.Progress),
			EngagementScore:  75,
			ConsistencyScore: 68,
		},
	}, nil
}

func (s *MentorService) getStudentInterventions(studentID string) []models.Intervention {
	// Try Firestore first
	if s.interventionRepo.IsFirestoreAvailable() {
		interventions, err := s.interventionRepo.FindByStudentID(studentID)
		if err == nil {
			return interventions
		}
	}

	// Fallback to mock data
	var interventionHistory []models.Intervention
	for _, i := range mockInterventions {
		if i.StudentID == studentID {
			interventionHistory = append(interventionHistory, i)
		}
	}
	return interventionHistory
}

func (s *MentorService) CreateIntervention(mentorID string, req models.CreateInterventionRequest) (*models.Intervention, error) {
	intervention := &models.Intervention{
		StudentID:     req.StudentID,
		StudentName:   req.StudentName,
		MentorID:      mentorID,
		Type:          req.Type,
		Message:       req.Message,
		Status:        "sent",
		CreatedAt:     time.Now(),
		ScheduledDate: req.ScheduledDate,
		Attachments:   req.Attachments,
	}

	// Try Firestore first
	if s.interventionRepo.IsFirestoreAvailable() {
		if err := s.interventionRepo.Create(intervention); err == nil {
			return intervention, nil
		}
	}

	// Fallback to mock data
	intervention.ID = fmt.Sprintf("%d", len(mockInterventions)+1)
	mockInterventions = append(mockInterventions, *intervention)
	return intervention, nil
}

func (s *MentorService) GetInterventions(mentorID string) []models.Intervention {
	// Try Firestore first
	if s.interventionRepo.IsFirestoreAvailable() {
		interventions, err := s.interventionRepo.FindByMentorID(mentorID)
		if err == nil {
			return interventions
		}
	}

	// Fallback to mock data
	return mockInterventions
}

func (s *MentorService) UpdateInterventionStatus(interventionID string, req models.UpdateInterventionRequest) error {
	// Try Firestore first
	if s.interventionRepo.IsFirestoreAvailable() {
		if err := s.interventionRepo.UpdateStatus(interventionID, req.Status, req.Response); err == nil {
			return nil
		}
	}

	// Fallback to mock data
	for i := range mockInterventions {
		if mockInterventions[i].ID == interventionID {
			mockInterventions[i].Status = req.Status
			if req.Response != nil {
				mockInterventions[i].Response = req.Response
			}
			return nil
		}
	}
	return fmt.Errorf("intervention not found")
}

func (s *MentorService) GetNotifications(mentorID string) []models.Notification {
	return s.getNotifications(mentorID)
}

func (s *MentorService) MarkNotificationRead(notificationID string) error {
	// Try Firestore first
	if s.notificationRepo.IsFirestoreAvailable() {
		if err := s.notificationRepo.MarkAsRead(notificationID); err == nil {
			return nil
		}
	}

	// Fallback to mock data
	for i := range mockNotifications {
		if mockNotifications[i].ID == notificationID {
			mockNotifications[i].Read = true
			return nil
		}
	}
	return fmt.Errorf("notification not found")
}
