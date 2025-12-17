package repository

import (
	"fmt"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/models"
)

// NotificationRepository handles notification data access
type NotificationRepository struct {
	*BaseRepository
	collectionName string
}

// NewNotificationRepository creates a new notification repository
func NewNotificationRepository() *NotificationRepository {
	return &NotificationRepository{
		BaseRepository: NewBaseRepository(),
		collectionName: "notifications",
	}
}

// FindByUserID finds notifications for a user
func (r *NotificationRepository) FindByUserID(userID string) ([]models.Notification, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).
		Where("userId", "==", userID).
		OrderBy("createdAt", firestore.Desc).
		Documents(r.GetContext())
	defer iter.Stop()

	var notifications []models.Notification
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var notification models.Notification
		if err := doc.DataTo(&notification); err != nil {
			continue
		}
		notification.ID = doc.Ref.ID
		notifications = append(notifications, notification)
	}

	return notifications, nil
}

// FindUnread finds unread notifications for a user
func (r *NotificationRepository) FindUnread(userID string) ([]models.Notification, error) {
	if !r.IsFirestoreAvailable() {
		return nil, fmt.Errorf("firestore not available")
	}

	iter := r.GetCollection(r.collectionName).
		Where("userId", "==", userID).
		Where("read", "==", false).
		OrderBy("createdAt", firestore.Desc).
		Documents(r.GetContext())
	defer iter.Stop()

	var notifications []models.Notification
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}

		var notification models.Notification
		if err := doc.DataTo(&notification); err != nil {
			continue
		}
		notification.ID = doc.Ref.ID
		notifications = append(notifications, notification)
	}

	return notifications, nil
}

// Create creates a new notification
func (r *NotificationRepository) Create(notification *models.Notification) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	docRef := r.GetCollection(r.collectionName).NewDoc()
	notification.ID = docRef.ID

	_, err := docRef.Set(r.GetContext(), notification)
	if err != nil {
		return fmt.Errorf("failed to create notification: %w", err)
	}

	return nil
}

// MarkAsRead marks a notification as read
func (r *NotificationRepository) MarkAsRead(id string) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	_, err := r.GetCollection(r.collectionName).Doc(id).Update(r.GetContext(), []firestore.Update{
		{Path: "read", Value: true},
	})
	if err != nil {
		return fmt.Errorf("failed to mark notification as read: %w", err)
	}

	return nil
}

// MarkAllAsRead marks all notifications as read for a user
func (r *NotificationRepository) MarkAllAsRead(userID string) error {
	if !r.IsFirestoreAvailable() {
		return fmt.Errorf("firestore not available")
	}

	// Get all unread notifications
	unread, err := r.FindUnread(userID)
	if err != nil {
		return err
	}

	// Mark each as read
	for _, notification := range unread {
		if err := r.MarkAsRead(notification.ID); err != nil {
			return err
		}
	}

	return nil
}
