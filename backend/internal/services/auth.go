package services

import (
	"fmt"
	"time"

	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

// Mock data for development (used as fallback when Firebase is not configured)
var mockUsers = []models.User{
	{
		ID:               "1",
		Name:             "Budi Santoso",
		Email:            "budi@student.com",
		Password:         hashPassword("password123"),
		Role:             "student",
		Avatar:           "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
		EnrolledCourses:  []string{"1", "2", "3"},
		TotalStudyTime:   1240,
		CompletedModules: 15,
		RiskScore:        25,
		JoinedDate:       time.Now().AddDate(0, -6, 0),
	},
	{
		ID:               "2",
		Name:             "Siti Rahayu",
		Email:            "siti@student.com",
		Password:         hashPassword("password123"),
		Role:             "student",
		Avatar:           "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
		EnrolledCourses:  []string{"1", "2"},
		TotalStudyTime:   890,
		CompletedModules: 10,
		RiskScore:        45,
		JoinedDate:       time.Now().AddDate(0, -4, 0),
	},
	{
		ID:               "3",
		Name:             "Ahmad Wijaya",
		Email:            "ahmad@student.com",
		Password:         hashPassword("password123"),
		Role:             "student",
		Avatar:           "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
		EnrolledCourses:  []string{"2", "3"},
		TotalStudyTime:   450,
		CompletedModules: 5,
		RiskScore:        72,
		JoinedDate:       time.Now().AddDate(0, -2, 0),
	},
	{
		ID:               "4",
		Name:             "Dr. Hendra Kusuma",
		Email:            "hendra@mentor.com",
		Password:         hashPassword("password123"),
		Role:             "mentor",
		Avatar:           "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra",
		AssignedStudents: []string{"1", "2", "3"},
		JoinedDate:       time.Now().AddDate(-1, 0, 0),
	},
	{
		ID:               "5",
		Name:             "Prof. Maria Tan",
		Email:            "maria@mentor.com",
		Password:         hashPassword("password123"),
		Role:             "mentor",
		Avatar:           "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
		AssignedStudents: []string{"1", "2"},
		JoinedDate:       time.Now().AddDate(-2, 0, 0),
	},
}

var userSettings = make(map[string]models.UserSettings)

func init() {
	// Initialize default settings for each user
	for _, user := range mockUsers {
		userSettings[user.ID] = models.UserSettings{
			UserID: user.ID,
			Notifications: models.NotificationSettings{
				Email:          true,
				Push:           true,
				StudyReminder:  true,
				WeeklyReport:   true,
				MentorMessages: true,
				CourseUpdates:  false,
				Promotions:     false,
			},
			Appearance: models.AppearanceSettings{
				Theme:    "system",
				Language: "id",
				FontSize: "medium",
			},
			Privacy: models.PrivacySettings{
				ProfileVisibility: "public",
				ShowActivity:      true,
				ShowProgress:      true,
				AllowAnalytics:    true,
			},
			Learning: models.LearningSettings{
				DailyGoal:      60,
				ReminderTime:   "08:00",
				AutoplayVideos: true,
				Subtitles:      true,
			},
		}
	}
}

func hashPassword(password string) string {
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(hash)
}

type AuthService struct {
	userRepo     *repository.UserRepository
	settingsRepo *repository.SettingsRepository
}

func NewAuthService() *AuthService {
	return &AuthService{
		userRepo:     repository.NewUserRepository(),
		settingsRepo: repository.NewSettingsRepository(),
	}
}

func (s *AuthService) Login(email, password string) (*models.User, error) {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		user, err := s.userRepo.FindByEmail(email)
		if err == nil {
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err == nil {
				return user, nil
			}
			return nil, fmt.Errorf("invalid password")
		}
	}

	// Fallback to mock data
	for _, user := range mockUsers {
		if user.Email == email {
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err == nil {
				return &user, nil
			}
			return nil, fmt.Errorf("invalid password")
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (s *AuthService) Register(req models.RegisterRequest) (*models.User, error) {
	// Check if email exists in Firestore
	if s.userRepo.IsFirestoreAvailable() {
		existingUser, _ := s.userRepo.FindByEmail(req.Email)
		if existingUser != nil {
			return nil, fmt.Errorf("email already registered")
		}
	} else {
		// Check in mock data
		for _, user := range mockUsers {
			if user.Email == req.Email {
				return nil, fmt.Errorf("email already registered")
			}
		}
	}

	newUser := models.User{
		Name:             req.Name,
		Email:            req.Email,
		Password:         hashPassword(req.Password),
		Role:             req.Role,
		Avatar:           fmt.Sprintf("https://api.dicebear.com/7.x/avataaars/svg?seed=%s", req.Name),
		EnrolledCourses:  []string{},
		TotalStudyTime:   0,
		CompletedModules: 0,
		RiskScore:        50,
		JoinedDate:       time.Now(),
	}

	// Try to save to Firestore
	if s.userRepo.IsFirestoreAvailable() {
		if err := s.userRepo.Create(&newUser); err != nil {
			return nil, fmt.Errorf("failed to create user: %w", err)
		}
		// Create default settings
		s.settingsRepo.CreateDefault(newUser.ID)
	} else {
		// Fallback to mock data
		newUser.ID = fmt.Sprintf("%d", len(mockUsers)+1)
		mockUsers = append(mockUsers, newUser)

		// Create default settings in memory
		userSettings[newUser.ID] = models.UserSettings{
			UserID: newUser.ID,
			Notifications: models.NotificationSettings{
				Email:          true,
				Push:           true,
				StudyReminder:  true,
				WeeklyReport:   true,
				MentorMessages: true,
			},
			Appearance: models.AppearanceSettings{
				Theme:    "system",
				Language: "id",
				FontSize: "medium",
			},
			Privacy: models.PrivacySettings{
				ProfileVisibility: "public",
				ShowActivity:      true,
				ShowProgress:      true,
				AllowAnalytics:    true,
			},
			Learning: models.LearningSettings{
				DailyGoal:      60,
				ReminderTime:   "08:00",
				AutoplayVideos: true,
				Subtitles:      true,
			},
		}
	}

	return &newUser, nil
}

func (s *AuthService) GetUserByID(userID string) (*models.User, error) {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		user, err := s.userRepo.FindByID(userID)
		if err == nil {
			return user, nil
		}
	}

	// Fallback to mock data
	for _, user := range mockUsers {
		if user.ID == userID {
			return &user, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func GetMockUsers() []models.User {
	return mockUsers
}

func GetUserSettings(userID string) *models.UserSettings {
	if settings, ok := userSettings[userID]; ok {
		return &settings
	}
	return nil
}

func UpdateUserSettings(userID, section string, data map[string]interface{}) (*models.UserSettings, error) {
	settings, ok := userSettings[userID]
	if !ok {
		return nil, fmt.Errorf("settings not found")
	}

	// Update based on section (simplified)
	userSettings[userID] = settings
	return &settings, nil
}
