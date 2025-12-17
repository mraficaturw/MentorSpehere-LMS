package repository

import (
	"fmt"

	"mentorsphere-api/internal/models"
)

// CourseRepository handles course data access
type CourseRepository struct {
	*BaseRepository
	collectionName string
}

// NewCourseRepository creates a new course repository
func NewCourseRepository() *CourseRepository {
	return &CourseRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "courses",
	}
}

// FindAll returns all courses
func (r *CourseRepository) FindAll() ([]models.Course, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).Documents(r.GetContext())
	defer iter.Stop()

	var courses []models.Course
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var course models.Course
		if err := doc.DataTo(&course); err != nil {
			continue
		}
		course.ID = doc.Ref.ID
		courses = append(courses, course)
	}

	return courses, nil
}

// FindByID finds a course by ID
func (r *CourseRepository) FindByID(id string) (*models.Course, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	doc, err := r.GetCollection(r.collectionName).Doc(id).Get(r.GetContext())
	if err != nil {
		return nil, fmt.Errorf("course not found: %w", err)
	}

	var course models.Course
	if err := doc.DataTo(&course); err != nil {
		return nil, fmt.Errorf("failed to parse course: %w", err)
	}
	course.ID = doc.Ref.ID

	return &course, nil
}

// FindByUserID finds courses enrolled by a user
func (r *CourseRepository) FindByUserID(userID string, userRepo *UserRepository) ([]models.Course, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	user, err := userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}

	var courses []models.Course
	for _, courseID := range user.EnrolledCourses {
		course, err := r.FindByID(courseID)
		if err == nil {
			courses = append(courses, *course)
		}
	}

	return courses, nil
}

// Create creates a new course
func (r *CourseRepository) Create(course *models.Course) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	docRef := r.GetCollection(r.collectionName).NewDoc()
	course.ID = docRef.ID

	_, err := docRef.Set(r.GetContext(), course)
	if err != nil {
		return fmt.Errorf("failed to create course: %w", err)
	}

	return nil
}

// Update updates an existing course
func (r *CourseRepository) Update(course *models.Course) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(course.ID).Set(r.GetContext(), course)
	if err != nil {
		return fmt.Errorf("failed to update course: %w", err)
	}

	return nil
}

// UpdateModuleStatus updates a module's status and score
func (r *CourseRepository) UpdateModuleStatus(courseID string, moduleID int, status string, score *int) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	course, err := r.FindByID(courseID)
	if err != nil {
		return err
	}

	// Find and update the module
	for i, module := range course.Modules {
		if module.ID == moduleID {
			course.Modules[i].Status = status
			if score != nil {
				course.Modules[i].Score = score
			}
			break
		}
	}

	return r.Update(course)
}
