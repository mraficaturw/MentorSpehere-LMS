package repository

import (
	"fmt"

	"mentorsphere-api/internal/models"
)

// ReflectionRepository handles reflection data access
type ReflectionRepository struct {
	*BaseRepository
	collectionName string
}

// NewReflectionRepository creates a new reflection repository
func NewReflectionRepository() *ReflectionRepository {
	return &ReflectionRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "reflections",
	}
}

// FindByUserID finds reflections for a user
func (r *ReflectionRepository) FindByUserID(userID string) (*models.Reflection, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	doc, err := r.GetCollection(r.collectionName).Doc(userID).Get(r.GetContext())
	if err != nil {
		return nil, fmt.Errorf("reflection not found: %w", err)
	}

	var reflection models.Reflection
	if err := doc.DataTo(&reflection); err != nil {
		return nil, fmt.Errorf("failed to parse reflection: %w", err)
	}

	return &reflection, nil
}

// Save saves a reflection for a user
func (r *ReflectionRepository) Save(userID string, reflection *models.Reflection) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(userID).Set(r.GetContext(), reflection)
	if err != nil {
		return fmt.Errorf("failed to save reflection: %w", err)
	}

	return nil
}

// UpdateDaily updates the daily reflection for a user
func (r *ReflectionRepository) UpdateDaily(userID string, daily *models.DailyReflection) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(userID).Set(r.GetContext(), map[string]interface{}{
		"daily": daily,
	})
	if err != nil {
		return fmt.Errorf("failed to update daily reflection: %w", err)
	}

	return nil
}
