package database

import (
	"context"
	"log"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var (
	FirestoreClient *firestore.Client
	ctx             = context.Background()
)

func InitFirebase(credentialsPath string) error {
	var app *firebase.App
	var err error

	if credentialsPath != "" {
		opt := option.WithCredentialsFile(credentialsPath)
		app, err = firebase.NewApp(ctx, nil, opt)
	} else {
		// Try to use default credentials (for development)
		app, err = firebase.NewApp(ctx, nil)
	}

	if err != nil {
		return err
	}

	FirestoreClient, err = app.Firestore(ctx)
	if err != nil {
		return err
	}

	log.Println("✅ Firebase Firestore initialized successfully")
	return nil
}

func GetFirestore() *firestore.Client {
	return FirestoreClient
}

func GetContext() context.Context {
	return ctx
}
