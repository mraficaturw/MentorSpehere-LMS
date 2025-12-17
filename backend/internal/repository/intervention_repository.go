package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/models"
)

// InterventionRepository handles intervention data access
type InterventionRepository struct {
	*BaseRepository
	collectionName string
}

// NewInterventionRepository creates a new intervention repository
func NewInterventionRepository() *InterventionRepository {
	return &InterventionRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "interventions",
	}
}

// FindByID finds an intervention by ID
func (r *InterventionRepository) FindByID(id string) (*models.Intervention, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	doc, err := r.GetCollection(r.collectionName).Doc(id).Get(r.GetContext())
	if err != nil {
		return nil, fmt.Errorf("intervention not found: %w", err)
	}

	var intervention models.Intervention
	if err := doc.DataTo(&intervention); err != nil {
		return nil, fmt.Errorf("failed to parse intervention: %w", err)
	}
	intervention.ID = doc.Ref.ID

	return &intervention, nil
}

// FindByMentorID finds interventions by mentor
func (r *InterventionRepository) FindByMentorID(mentorID string) ([]models.Intervention, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).
		Where("mentorId", "==", mentorID).
		OrderBy("createdAt", firestore.Desc).
		Documents(r.GetContext())
	defer iter.Stop()

	var interventions []models.Intervention
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var intervention models.Intervention
		if err := doc.DataTo(&intervention); err != nil {
			continue
		}
		intervention.ID = doc.Ref.ID
		interventions = append(interventions, intervention)
	}

	return interventions, nil
}

// FindByStudentID finds interventions for a student
func (r *InterventionRepository) FindByStudentID(studentID string) ([]models.Intervention, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).
		Where("studentId", "==", studentID).
		OrderBy("createdAt", firestore.Desc).
		Documents(r.GetContext())
	defer iter.Stop()

	var interventions []models.Intervention
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var intervention models.Intervention
		if err := doc.DataTo(&intervention); err != nil {
			continue
		}
		intervention.ID = doc.Ref.ID
		interventions = append(interventions, intervention)
	}

	return interventions, nil
}

// Create creates a new intervention
func (r *InterventionRepository) Create(intervention *models.Intervention) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	docRef := r.GetCollection(r.collectionName).NewDoc()
	intervention.ID = docRef.ID

	_, err := docRef.Set(r.GetContext(), intervention)
	if err != nil {
		return fmt.Errorf("failed to create intervention: %w", err)
	}

	return nil
}

// UpdateStatus updates the status of an intervention
func (r *InterventionRepository) UpdateStatus(id string, status string, response *string) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	updates := []firestore.Update{
		{Path: "status", Value: status},
	}
	if response != nil {
		updates = append(updates, firestore.Update{Path: "response", Value: *response})
	}

	_, err := r.GetCollection(r.collectionName).Doc(id).Update(r.GetContext(), updates)
	if err != nil {
		return fmt.Errorf("failed to update intervention status: %w", err)
	}

	return nil
}
