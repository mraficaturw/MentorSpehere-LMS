package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/models"
)

// SettingsRepository handles user settings data access
type SettingsRepository struct {
	*BaseRepository
	collectionName string
}

// NewSettingsRepository creates a new settings repository
func NewSettingsRepository() *SettingsRepository {
	return &SettingsRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "user_settings",
	}
}

// FindByUserID finds settings for a user
func (r *SettingsRepository) FindByUserID(userID string) (*models.UserSettings, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	doc, err := r.GetCollection(r.collectionName).Doc(userID).Get(r.GetContext())
	if err != nil {
		return nil, fmt.Errorf("settings not found: %w", err)
	}

	var settings models.UserSettings
	if err := doc.DataTo(&settings); err != nil {
		return nil, fmt.Errorf("failed to parse settings: %w", err)
	}
	settings.UserID = userID

	return &settings, nil
}

// Create creates settings for a user
func (r *SettingsRepository) Create(settings *models.UserSettings) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(settings.UserID).Set(r.GetContext(), settings)
	if err != nil {
		return fmt.Errorf("failed to create settings: %w", err)
	}

	return nil
}

// Update updates settings for a user
func (r *SettingsRepository) Update(settings *models.UserSettings) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(settings.UserID).Set(r.GetContext(), settings)
	if err != nil {
		return fmt.Errorf("failed to update settings: %w", err)
	}

	return nil
}

// UpdateSection updates a specific section of settings
func (r *SettingsRepository) UpdateSection(userID, section string, data interface{}) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(userID).Update(r.GetContext(), []firestore.Update{
		{Path: section, Value: data},
	})
	if err != nil {
		return fmt.Errorf("failed to update settings section: %w", err)
	}

	return nil
}

// CreateDefault creates default settings for a new user
func (r *SettingsRepository) CreateDefault(userID string) (*models.UserSettings, error) {
	settings := &models.UserSettings{
		UserID: userID,
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

	if err := r.Create(settings); err != nil {
		return nil, err
	}

	return settings, nil
}
