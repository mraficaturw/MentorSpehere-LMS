package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/models"
)

// UserRepository handles user data access
type UserRepository struct {
	*BaseRepository
	collectionName string
}

// NewUserRepository creates a new user repository
func NewUserRepository() *UserRepository {
	return &UserRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "users",
	}
}

// FindByID finds a user by ID
func (r *UserRepository) FindByID(id string) (*models.User, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	doc, err := r.GetCollection(r.collectionName).Doc(id).Get(r.GetContext())
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	var user models.User
	if err := doc.DataTo(&user); err != nil {
		return nil, fmt.Errorf("failed to parse user: %w", err)
	}
	user.ID = doc.Ref.ID

	return &user, nil
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).Where("email", "==", email).Limit(1).Documents(r.GetContext())
	defer iter.Stop()

	doc, err := iter.Next()
	if err != nil {
		return nil, fmt.Errorf("user not found: %w", err)
	}

	var user models.User
	if err := doc.DataTo(&user); err != nil {
		return nil, fmt.Errorf("failed to parse user: %w", err)
	}
	user.ID = doc.Ref.ID

	return &user, nil
}

// Create creates a new user
func (r *UserRepository) Create(user *models.User) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	docRef := r.GetCollection(r.collectionName).NewDoc()
	user.ID = docRef.ID

	_, err := docRef.Set(r.GetContext(), user)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

// Update updates an existing user
func (r *UserRepository) Update(user *models.User) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(user.ID).Set(r.GetContext(), user)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}

// UpdateFields updates specific fields of a user
func (r *UserRepository) UpdateFields(id string, fields map[string]interface{}) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	var updates []firestore.Update
	for key, value := range fields {
		updates = append(updates, firestore.Update{Path: key, Value: value})
	}

	_, err := r.GetCollection(r.collectionName).Doc(id).Update(r.GetContext(), updates)
	if err != nil {
		return fmt.Errorf("failed to update user fields: %w", err)
	}

	return nil
}

// Delete deletes a user
func (r *UserRepository) Delete(id string) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(id).Delete(r.GetContext())
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}

// GetAllStudents returns all users with role "student"
func (r *UserRepository) GetAllStudents() ([]models.User, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).Where("role", "==", "student").Documents(r.GetContext())
	defer iter.Stop()

	var students []models.User
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var user models.User
		if err := doc.DataTo(&user); err != nil {
			continue
		}
		user.ID = doc.Ref.ID
		students = append(students, user)
	}

	return students, nil
}

// GetStudentsByMentor returns students assigned to a mentor
func (r *UserRepository) GetStudentsByMentor(mentorID string) ([]models.User, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	// First get the mentor to find assigned students
	mentor, err := r.FindByID(mentorID)
	if err != nil {
		return nil, err
	}

	var students []models.User
	for _, studentID := range mentor.AssignedStudents {
		student, err := r.FindByID(studentID)
		if err == nil {
			students = append(students, *student)
		}
	}

	return students, nil
}
