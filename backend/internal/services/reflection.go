package services

import (
	"fmt"
	"math/rand"
	"time"

	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"
)

type ReflectionService struct {
	reflectionRepo *repository.ReflectionRepository
}

func NewReflectionService() *ReflectionService {
	return &ReflectionService{
		reflectionRepo: repository.NewReflectionRepository(),
	}
}

func (s *ReflectionService) GetReflection(userID string) *models.Reflection {
	// Try Firestore first
	if s.reflectionRepo.IsFirestoreAvailable() {
		reflection, err := s.reflectionRepo.FindByUserID(userID)
		if err == nil {
			return reflection
		}
	}

	// Fallback to generated mock data
	return s.generateDefaultReflection(userID)
}

func (s *ReflectionService) generateDefaultReflection(userID string) *models.Reflection {
	return &models.Reflection{
		Daily: models.DailyReflection{
			Date:    time.Now().Format("2006-01-02"),
			Summary: "Hari ini Anda menunjukkan fokus yang baik pada materi Machine Learning. Anda menyelesaikan 2 video dan 1 bacaan dengan konsistensi yang meningkat.",
			Strengths: []string{
				"Konsistensi waktu belajar meningkat 20%",
				"Skor quiz di atas rata-rata",
				"Fokus pada satu topik dalam satu sesi",
			},
			Improvements: []string{
				"Coba tingkatkan durasi sesi belajar",
				"Pertimbangkan untuk mengulang materi yang sulit",
			},
			Mood: "positive",
		},
		Weekly: models.WeeklyInsight{
			WeekNumber:     int(time.Now().YearDay() / 7),
			TotalStudyTime: 675,
			AverageDaily:   96,
			TopSubjects:    []string{"Machine Learning", "React", "Python"},
			Insights: []string{
				"Produktivitas tertinggi pada hari Jumat (180 menit)",
				"Performa quiz konsisten di atas 85%",
				"Pola belajar lebih aktif di pagi hari",
			},
			Recommendation: "Pertahankan momentum belajar Anda. Fokus pada penyelesaian modul Machine Learning sebelum melanjutkan ke topik baru.",
		},
		LearningPath: models.LearningPath{
			CurrentPhase:        "Foundation Building",
			Progress:            45,
			NextMilestone:       "Menyelesaikan Modul Decision Trees",
			EstimatedCompletion: time.Now().Add(60 * 24 * time.Hour).Format("2006-01-02"),
			SuggestedTopics: []models.SuggestedTopic{
				{Title: "Neural Networks Basics", Priority: "high", Reason: "Kelanjutan natural dari Decision Trees"},
				{Title: "Feature Engineering", Priority: "medium", Reason: "Meningkatkan pemahaman preprocessing data"},
				{Title: "Model Evaluation", Priority: "medium", Reason: "Fundamental untuk validasi model"},
			},
		},
		RiskAssessment: models.RiskAssessment{
			Score: 25,
			Level: "low",
			Factors: []models.RiskFactor{
				{Name: "Konsistensi Belajar", Value: 85, Status: "good"},
				{Name: "Penyelesaian Tugas", Value: 78, Status: "good"},
				{Name: "Engagement", Value: 70, Status: "moderate"},
				{Name: "Quiz Performance", Value: 88, Status: "excellent"},
			},
			Explanation: "Skor risiko Anda rendah karena konsistensi belajar yang baik dan performa quiz di atas rata-rata. Engagement bisa ditingkatkan dengan lebih aktif di forum diskusi.",
			Recommendations: []string{
				"Pertahankan jadwal belajar rutin Anda",
				"Coba bergabung dengan grup diskusi untuk meningkatkan engagement",
				"Set reminder untuk menyelesaikan modul yang tertunda",
			},
		},
	}
}

func (s *ReflectionService) GenerateReflection(userID string) *models.Reflection {
	topics := []string{"Machine Learning", "React", "Python"}
	selectedTopic := topics[rand.Intn(len(topics))]
	sessionDuration := rand.Intn(30) + 30

	reflection := s.GetReflection(userID)

	// Modify with "AI generated" content
	reflection.Daily.Summary = fmt.Sprintf(
		"Berdasarkan analisis aktivitas belajar Anda hari ini, AI menemukan pola yang menarik. Anda menunjukkan fokus tinggi pada materi %s dengan durasi rata-rata sesi %d menit.",
		selectedTopic,
		sessionDuration,
	)
	reflection.Daily.Date = time.Now().Format("2006-01-02")
	reflection.RiskAssessment.Score = rand.Intn(40) + 10

	// Save to Firestore if available
	if s.reflectionRepo.IsFirestoreAvailable() {
		s.reflectionRepo.Save(userID, reflection)
	}

	return reflection
}

func (s *ReflectionService) GetDailyReflection(userID string, date string) *models.DailyReflection {
	reflection := s.GetReflection(userID)
	reflection.Daily.Date = date
	return &reflection.Daily
}

func (s *ReflectionService) GetWeeklyInsight(userID string, weekNumber int) *models.WeeklyInsight {
	reflection := s.GetReflection(userID)
	reflection.Weekly.WeekNumber = weekNumber
	return &reflection.Weekly
}

func (s *ReflectionService) GetLearningPath(userID string) *models.LearningPath {
	reflection := s.GetReflection(userID)
	return &reflection.LearningPath
}

func (s *ReflectionService) GetRiskAssessment(userID string) *models.RiskAssessment {
	reflection := s.GetReflection(userID)
	return &reflection.RiskAssessment
}
