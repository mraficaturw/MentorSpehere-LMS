package repository

import (
	"fmt"
	"time"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/models"
)

// ActivityRepository handles activity log data access
type ActivityRepository struct {
	*BaseRepository
	collectionName string
}

// NewActivityRepository creates a new activity repository
func NewActivityRepository() *ActivityRepository {
	return &ActivityRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "activities",
	}
}

// FindByUserID finds activities for a user
func (r *ActivityRepository) FindByUserID(userID string, limit int) ([]models.ActivityLog, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	query := r.GetCollection(r.collectionName).
		Where("userId", "==", userID).
		OrderBy("date", firestore.Desc)
	
	if limit > 0 {
		query = query.Limit(limit)
	}

	iter := query.Documents(r.GetContext())
	defer iter.Stop()

	var activities []models.ActivityLog
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var activity models.ActivityLog
		if err := doc.DataTo(&activity); err != nil {
			continue
		}
		activity.ID = doc.Ref.ID
		activities = append(activities, activity)
	}

	return activities, nil
}

// FindByDateRange finds activities within a date range
func (r *ActivityRepository) FindByDateRange(userID string, startDate, endDate time.Time) ([]models.ActivityLog, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).
		Where("userId", "==", userID).
		Where("date", ">=", startDate).
		Where("date", "<=", endDate).
		OrderBy("date", firestore.Desc).
		Documents(r.GetContext())
	defer iter.Stop()

	var activities []models.ActivityLog
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var activity models.ActivityLog
		if err := doc.DataTo(&activity); err != nil {
			continue
		}
		activity.ID = doc.Ref.ID
		activities = append(activities, activity)
	}

	return activities, nil
}

// Create creates a new activity log
func (r *ActivityRepository) Create(activity *models.ActivityLog) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	docRef := r.GetCollection(r.collectionName).NewDoc()
	activity.ID = docRef.ID

	_, err := docRef.Set(r.GetContext(), activity)
	if err != nil {
		return fmt.Errorf("failed to create activity: %w", err)
	}

	return nil
}

// GetWeeklyActivity calculates weekly activity for a user
func (r *ActivityRepository) GetWeeklyActivity(userID string) ([]models.WeeklyActivity, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	// Get activities from the last 7 days
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -7)

	activities, err := r.FindByDateRange(userID, startDate, endDate)
	if err != nil {
		return nil, err
	}

	// Group by day of week
	dayNames := []string{"Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"}
	weeklyData := make(map[int]*models.WeeklyActivity)
	
	for i := 0; i < 7; i++ {
		weeklyData[i] = &models.WeeklyActivity{
			Day:        dayNames[i],
			StudyTime:  0,
			Activities: 0,
		}
	}

	for _, activity := range activities {
		dayIndex := int(activity.Date.Weekday())
		weeklyData[dayIndex].StudyTime += activity.Duration
		weeklyData[dayIndex].Activities++
	}

	// Convert to slice starting from Monday
	result := make([]models.WeeklyActivity, 7)
	for i := 0; i < 7; i++ {
		// Reorder: Mon=0, Tue=1, ..., Sun=6
		sourceIndex := (i + 1) % 7
		result[i] = *weeklyData[sourceIndex]
	}

	return result, nil
}
