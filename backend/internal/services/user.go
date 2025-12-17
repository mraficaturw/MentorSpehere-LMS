package services

import (
	"fmt"

	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	authService  *AuthService
	userRepo     *repository.UserRepository
	settingsRepo *repository.SettingsRepository
}

func NewUserService() *UserService {
	return &UserService{
		authService:  NewAuthService(),
		userRepo:     repository.NewUserRepository(),
		settingsRepo: repository.NewSettingsRepository(),
	}
}

type ProfileResponse struct {
	models.User
	Stats          models.UserStats     `json:"stats"`
	Badges         []models.Badge       `json:"badges"`
	RecentActivity []models.ActivityLog `json:"recentActivity"`
}

func (s *UserService) GetProfile(userID string) (*ProfileResponse, error) {
	user, err := s.authService.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	return &ProfileResponse{
		User: *user,
		Stats: models.UserStats{
			TotalStudyTime:   user.TotalStudyTime,
			ModulesCompleted: user.CompletedModules,
			CoursesEnrolled:  len(user.EnrolledCourses),
			Certificates:     3,
			Badges:           12,
			Streak:           15,
		},
		Badges: []models.Badge{
			{ID: 1, Name: "Early Bird", Icon: "🌅", Description: "Belajar sebelum jam 6 pagi"},
			{ID: 2, Name: "Consistent Learner", Icon: "🔥", Description: "Streak 7 hari berturut-turut"},
			{ID: 3, Name: "Quiz Master", Icon: "🏆", Description: "Skor 100% di 5 quiz"},
			{ID: 4, Name: "Fast Learner", Icon: "⚡", Description: "Selesaikan 10 modul dalam sehari"},
		},
		RecentActivity: mockActivityLogs[:3],
	}, nil
}

func (s *UserService) UpdateProfile(userID string, req models.UpdateProfileRequest) (*models.User, error) {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		user, err := s.userRepo.FindByID(userID)
		if err == nil {
			if req.Name != "" {
				user.Name = req.Name
			}
			if req.Bio != "" {
				user.Bio = req.Bio
			}
			if req.Location != "" {
				user.Location = req.Location
			}
			if req.Phone != "" {
				user.Phone = req.Phone
			}
			if req.University != "" {
				user.University = req.University
			}
			if err := s.userRepo.Update(user); err != nil {
				return nil, err
			}
			return user, nil
		}
	}

	// Fallback to mock data
	users := GetMockUsers()
	for i := range users {
		if users[i].ID == userID {
			if req.Name != "" {
				users[i].Name = req.Name
			}
			if req.Bio != "" {
				users[i].Bio = req.Bio
			}
			if req.Location != "" {
				users[i].Location = req.Location
			}
			if req.Phone != "" {
				users[i].Phone = req.Phone
			}
			if req.University != "" {
				users[i].University = req.University
			}
			return &users[i], nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (s *UserService) UpdateAvatar(userID string, avatarURL string) (*models.User, error) {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		err := s.userRepo.UpdateFields(userID, map[string]interface{}{
			"avatar": avatarURL,
		})
		if err == nil {
			return s.userRepo.FindByID(userID)
		}
	}

	// Fallback to mock data
	users := GetMockUsers()
	for i := range users {
		if users[i].ID == userID {
			users[i].Avatar = avatarURL
			return &users[i], nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (s *UserService) GetSettings(userID string) (*models.UserSettings, error) {
	// Try Firestore first
	if s.settingsRepo.IsFirestoreAvailable() {
		settings, err := s.settingsRepo.FindByUserID(userID)
		if err == nil {
			return settings, nil
		}
		// If not found, create default
		if settings == nil {
			return s.settingsRepo.CreateDefault(userID)
		}
	}

	// Fallback to mock data
	settings := GetUserSettings(userID)
	if settings == nil {
		return nil, fmt.Errorf("settings not found")
	}
	return settings, nil
}

func (s *UserService) UpdateSettings(userID, section string, data map[string]interface{}) (*models.UserSettings, error) {
	// Try Firestore first
	if s.settingsRepo.IsFirestoreAvailable() {
		err := s.settingsRepo.UpdateSection(userID, section, data)
		if err == nil {
			return s.settingsRepo.FindByUserID(userID)
		}
	}

	// Fallback to mock data
	return UpdateUserSettings(userID, section, data)
}

func (s *UserService) ChangePassword(userID string, req models.ChangePasswordRequest) error {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		user, err := s.userRepo.FindByID(userID)
		if err == nil {
			// Verify current password
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.CurrentPassword)); err != nil {
				return fmt.Errorf("current password is incorrect")
			}

			// Hash new password
			hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			return s.userRepo.UpdateFields(userID, map[string]interface{}{
				"password": string(hash),
			})
		}
	}

	// Fallback to mock data
	users := GetMockUsers()
	for i := range users {
		if users[i].ID == userID {
			// Verify current password
			if err := bcrypt.CompareHashAndPassword([]byte(users[i].Password), []byte(req.CurrentPassword)); err != nil {
				return fmt.Errorf("current password is incorrect")
			}

			// Hash new password
			hash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
			if err != nil {
				return err
			}
			users[i].Password = string(hash)
			return nil
		}
	}
	return fmt.Errorf("user not found")
}

func (s *UserService) DeleteAccount(userID, password string) error {
	// Try Firestore first
	if s.userRepo.IsFirestoreAvailable() {
		user, err := s.userRepo.FindByID(userID)
		if err == nil {
			// Verify password
			if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
				return fmt.Errorf("password is incorrect")
			}
			return s.userRepo.Delete(userID)
		}
	}

	// Fallback to mock data
	users := GetMockUsers()
	for i := range users {
		if users[i].ID == userID {
			// Verify password
			if err := bcrypt.CompareHashAndPassword([]byte(users[i].Password), []byte(password)); err != nil {
				return fmt.Errorf("password is incorrect")
			}
			// In real implementation, delete from database
			return nil
		}
	}
	return fmt.Errorf("user not found")
}
