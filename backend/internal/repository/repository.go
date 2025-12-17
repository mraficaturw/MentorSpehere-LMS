package repository

import (
	"context"

	"cloud.google.com/go/firestore"
	"mentorsphere-api/internal/database"
)

// BaseRepository provides common Firestore operations
type BaseRepository struct {
	client *firestore.Client
	ctx    context.Context
}

// NewBaseRepository creates a new base repository
func NewBaseRepository() *BaseRepository {
	return &BaseRepository{
		client: database.GetFirestore(),
		ctx:    database.GetContext(),
	}
}

// GetCollection returns a collection reference
func (r *BaseRepository) GetCollection(name string) *firestore.CollectionRef {
	if r.client == nil {
		return nil
	}
	return r.client.Collection(name)
}

// IsFirestoreAvailable checks if Firestore is connected
func (r *BaseRepository) IsFirestoreAvailable() bool {
	return r.client != nil
}

// GetContext returns the context
func (r *BaseRepository) GetContext() context.Context {
	return r.ctx
}
