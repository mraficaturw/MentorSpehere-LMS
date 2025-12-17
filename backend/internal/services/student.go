package services

import (
	"time"

	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"
)

var mockActivityLogs = []models.ActivityLog{
	{ID: "1", UserID: "1", Type: "video", Title: "Menonton: Decision Trees", Duration: 45, Date: time.Now().Add(-24 * time.Hour), CourseID: "1"},
	{ID: "2", UserID: "1", Type: "reading", Title: "Membaca: Linear Regression Notes", Duration: 30, Date: time.Now().Add(-23 * time.Hour), CourseID: "1"},
	{ID: "3", UserID: "1", Type: "quiz", Title: "Quiz: Konsep Dasar ML", Duration: 25, Date: time.Now().Add(-48 * time.Hour), CourseID: "1", Score: intPtr(85)},
	{ID: "4", UserID: "1", Type: "video", Title: "Menonton: Hooks useState", Duration: 60, Date: time.Now().Add(-72 * time.Hour), CourseID: "2"},
	{ID: "5", UserID: "1", Type: "reading", Title: "Membaca: React Documentation", Duration: 45, Date: time.Now().Add(-96 * time.Hour), CourseID: "2"},
	{ID: "6", UserID: "1", Type: "video", Title: "Menonton: Pandas DataFrame", Duration: 55, Date: time.Now().Add(-120 * time.Hour), CourseID: "3"},
	{ID: "7", UserID: "1", Type: "quiz", Title: "Quiz: React Basics", Duration: 20, Date: time.Now().Add(-144 * time.Hour), CourseID: "2", Score: intPtr(92)},
}

var mockWeeklyActivity = []models.WeeklyActivity{
	{Day: "Sen", StudyTime: 120, Activities: 5},
	{Day: "Sel", StudyTime: 90, Activities: 4},
	{Day: "Rab", StudyTime: 150, Activities: 6},
	{Day: "Kam", StudyTime: 60, Activities: 3},
	{Day: "Jum", StudyTime: 180, Activities: 7},
	{Day: "Sab", StudyTime: 45, Activities: 2},
	{Day: "Min", StudyTime: 30, Activities: 1},
}

type StudentService struct {
	courseService *CourseService
	activityRepo  *repository.ActivityRepository
}

func NewStudentService() *StudentService {
	return &StudentService{
		courseService: NewCourseService(),
		activityRepo:  repository.NewActivityRepository(),
	}
}

type StudentDashboard struct {
	User              StudentDashboardUser    `json:"user"`
	RecentActivity    []models.ActivityLog    `json:"recentActivity"`
	WeeklyActivity    []models.WeeklyActivity `json:"weeklyActivity"`
	AIInsight         AIInsight               `json:"aiInsight"`
	UpcomingDeadlines []Deadline              `json:"upcomingDeadlines"`
}

type StudentDashboardUser struct {
	Name             string `json:"name"`
	Avatar           string `json:"avatar"`
	TotalStudyTime   int    `json:"totalStudyTime"`
	CompletedModules int    `json:"completedModules"`
	EnrolledCourses  int    `json:"enrolledCourses"`
	AverageProgress  int    `json:"averageProgress"`
}

type AIInsight struct {
	Title   string `json:"title"`
	Message string `json:"message"`
	Type    string `json:"type"`
}

type Deadline struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Course  string `json:"course"`
	DueDate string `json:"dueDate"`
}

func (s *StudentService) GetDashboard(userID string) (*StudentDashboard, error) {
	authService := NewAuthService()
	user, err := authService.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	// Get enrolled courses
	enrolledCourses := s.courseService.GetUserCourses(userID)

	totalProgress := 0
	for _, course := range enrolledCourses {
		totalProgress += course.Progress
	}
	avgProgress := 0
	if len(enrolledCourses) > 0 {
		avgProgress = totalProgress / len(enrolledCourses)
	}

	// Get recent activities
	recentActivity := s.getRecentActivity(userID, 5)

	// Get weekly activity
	weeklyActivity := s.getWeeklyActivity(userID)

	return &StudentDashboard{
		User: StudentDashboardUser{
			Name:             user.Name,
			Avatar:           user.Avatar,
			TotalStudyTime:   user.TotalStudyTime,
			CompletedModules: user.CompletedModules,
			EnrolledCourses:  len(enrolledCourses),
			AverageProgress:  avgProgress,
		},
		RecentActivity: recentActivity,
		WeeklyActivity: weeklyActivity,
		AIInsight: AIInsight{
			Title:   "Insight Hari Ini",
			Message: "Produktivitas Anda meningkat 15% dibanding minggu lalu. Pertahankan momentum dengan fokus pada modul Decision Trees hari ini.",
			Type:    "positive",
		},
		UpcomingDeadlines: []Deadline{
			{ID: "1", Title: "Quiz: Decision Trees", Course: "Machine Learning", DueDate: time.Now().Add(72 * time.Hour).Format("2006-01-02")},
			{ID: "2", Title: "Project: React App", Course: "Web Development", DueDate: time.Now().Add(120 * time.Hour).Format("2006-01-02")},
		},
	}, nil
}

func (s *StudentService) getRecentActivity(userID string, limit int) []models.ActivityLog {
	// Try Firestore first
	if s.activityRepo.IsFirestoreAvailable() {
		activities, err := s.activityRepo.FindByUserID(userID, limit)
		if err == nil && len(activities) > 0 {
			return activities
		}
	}

	// Fallback to mock data
	var userActivities []models.ActivityLog
	for _, activity := range mockActivityLogs {
		if activity.UserID == userID || activity.UserID == "1" {
			userActivities = append(userActivities, activity)
			if len(userActivities) >= limit {
				break
			}
		}
	}
	return userActivities
}

func (s *StudentService) getWeeklyActivity(userID string) []models.WeeklyActivity {
	// Try Firestore first
	if s.activityRepo.IsFirestoreAvailable() {
		weekly, err := s.activityRepo.GetWeeklyActivity(userID)
		if err == nil && len(weekly) > 0 {
			return weekly
		}
	}

	// Fallback to mock data
	return mockWeeklyActivity
}

func (s *StudentService) GetActivity(userID string) (*models.ActivityResponse, error) {
	userActivities := s.getRecentActivity(userID, 20)

	breakdown := models.ActivityBreakdown{}
	for _, activity := range userActivities {
		switch activity.Type {
		case "video":
			breakdown.Video += activity.Duration
		case "reading":
			breakdown.Reading += activity.Duration
		case "quiz":
			breakdown.Quiz += activity.Duration
		}
	}

	return &models.ActivityResponse{
		Activities: userActivities,
		WeeklyData: s.getWeeklyActivity(userID),
		Breakdown:  breakdown,
		TotalTime:  breakdown.Video + breakdown.Reading + breakdown.Quiz,
	}, nil
}

func (s *StudentService) GetCourses(userID string) []models.Course {
	return s.courseService.GetUserCourses(userID)
}
