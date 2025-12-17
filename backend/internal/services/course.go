package services

import (
	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"
)

var mockCourses = []models.Course{
	{
		ID:               "1",
		Title:            "Dasar-Dasar Machine Learning",
		Description:      "Pelajari fundamental machine learning dari konsep hingga implementasi praktis dengan Python.",
		Instructor:       "Dr. Hendra Kusuma",
		Thumbnail:        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
		Duration:         "12 minggu",
		TotalModules:     24,
		CompletedModules: 18,
		Progress:         75,
		Category:         "Data Science",
		Level:            "Beginner",
		Modules: []models.Module{
			{ID: 1, Title: "Pengenalan Machine Learning", Duration: 45, Status: "completed", Type: "video"},
			{ID: 2, Title: "Supervised vs Unsupervised Learning", Duration: 60, Status: "completed", Type: "video"},
			{ID: 3, Title: "Linear Regression", Duration: 90, Status: "completed", Type: "reading"},
			{ID: 4, Title: "Quiz: Konsep Dasar", Duration: 30, Status: "completed", Type: "quiz", Score: intPtr(85)},
			{ID: 5, Title: "Decision Trees", Duration: 75, Status: "in-progress", Type: "video"},
			{ID: 6, Title: "Random Forest", Duration: 60, Status: "locked", Type: "video"},
		},
	},
	{
		ID:               "2",
		Title:            "Web Development dengan React",
		Description:      "Kuasai React.js untuk membangun aplikasi web modern yang interaktif dan responsif.",
		Instructor:       "Prof. Maria Tan",
		Thumbnail:        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
		Duration:         "10 minggu",
		TotalModules:     20,
		CompletedModules: 8,
		Progress:         40,
		Category:         "Web Development",
		Level:            "Intermediate",
		Modules: []models.Module{
			{ID: 1, Title: "Pengenalan React", Duration: 45, Status: "completed", Type: "video"},
			{ID: 2, Title: "JSX dan Components", Duration: 60, Status: "completed", Type: "video"},
			{ID: 3, Title: "State dan Props", Duration: 90, Status: "completed", Type: "reading"},
			{ID: 4, Title: "Quiz: React Basics", Duration: 30, Status: "completed", Type: "quiz", Score: intPtr(92)},
			{ID: 5, Title: "Hooks: useState & useEffect", Duration: 75, Status: "in-progress", Type: "video"},
		},
	},
	{
		ID:               "3",
		Title:            "Data Analysis dengan Python",
		Description:      "Pelajari teknik analisis data menggunakan Python, Pandas, dan visualisasi data.",
		Instructor:       "Dr. Hendra Kusuma",
		Thumbnail:        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
		Duration:         "8 minggu",
		TotalModules:     16,
		CompletedModules: 4,
		Progress:         25,
		Category:         "Data Science",
		Level:            "Beginner",
		Modules: []models.Module{
			{ID: 1, Title: "Pengenalan Python untuk Data", Duration: 60, Status: "completed", Type: "video"},
			{ID: 2, Title: "NumPy Fundamentals", Duration: 75, Status: "completed", Type: "video"},
			{ID: 3, Title: "Pandas DataFrame", Duration: 90, Status: "in-progress", Type: "reading"},
			{ID: 4, Title: "Data Visualization", Duration: 60, Status: "locked", Type: "video"},
		},
	},
}

func intPtr(i int) *int {
	return &i
}

type CourseService struct {
	courseRepo *repository.CourseRepository
	userRepo   *repository.UserRepository
}

func NewCourseService() *CourseService {
	return &CourseService{
		courseRepo: repository.NewCourseRepository(),
		userRepo:   repository.NewUserRepository(),
	}
}

func (s *CourseService) GetAll() []models.Course {
	// Try Firestore first
	if s.courseRepo.IsFirestoreAvailable() {
		courses, err := s.courseRepo.FindAll()
		if err == nil && len(courses) > 0 {
			return courses
		}
	}

	// Fallback to mock data
	return mockCourses
}

func (s *CourseService) GetByID(courseID string) *models.Course {
	// Try Firestore first
	if s.courseRepo.IsFirestoreAvailable() {
		course, err := s.courseRepo.FindByID(courseID)
		if err == nil {
			return course
		}
	}

	// Fallback to mock data
	for _, course := range mockCourses {
		if course.ID == courseID {
			return &course
		}
	}
	return nil
}

func (s *CourseService) GetModules(courseID string) []models.Module {
	course := s.GetByID(courseID)
	if course != nil {
		return course.Modules
	}
	return nil
}

func (s *CourseService) GetUserCourses(userID string) []models.Course {
	// Try Firestore first
	if s.courseRepo.IsFirestoreAvailable() && s.userRepo.IsFirestoreAvailable() {
		courses, err := s.courseRepo.FindByUserID(userID, s.userRepo)
		if err == nil {
			return courses
		}
	}

	// Fallback: get user's enrolled courses from mock data
	authService := NewAuthService()
	user, err := authService.GetUserByID(userID)
	if err != nil {
		return nil
	}

	var enrolledCourses []models.Course
	for _, course := range mockCourses {
		for _, enrolledID := range user.EnrolledCourses {
			if course.ID == enrolledID {
				enrolledCourses = append(enrolledCourses, course)
				break
			}
		}
	}
	return enrolledCourses
}

func (s *CourseService) GetQuizSummary(courseID string) *models.QuizSummary {
	course := s.GetByID(courseID)
	if course == nil {
		return nil
	}

	var quizzes []models.QuizDTO
	totalScore := 0
	scoredCount := 0

	for _, module := range course.Modules {
		if module.Type == "quiz" {
			passed := false
			if module.Score != nil {
				passed = *module.Score >= 70
				totalScore += *module.Score
				scoredCount++
			}
			quizzes = append(quizzes, models.QuizDTO{
				ID:       module.ID,
				Title:    module.Title,
				Duration: module.Duration,
				Type:     module.Type,
				Status:   module.Status,
				Score:    module.Score,
				Passed:   passed,
			})
		}
	}

	avgScore := float64(0)
	if scoredCount > 0 {
		avgScore = float64(totalScore) / float64(scoredCount)
	}

	completedQuizzes := 0
	for _, q := range quizzes {
		if q.Status == "completed" {
			completedQuizzes++
		}
	}

	return &models.QuizSummary{
		TotalQuizzes:     len(quizzes),
		CompletedQuizzes: completedQuizzes,
		AverageScore:     avgScore,
		Quizzes:          quizzes,
	}
}
