package models

import "time"

type Intervention struct {
	ID            string     `json:"id" firestore:"id"`
	StudentID     string     `json:"studentId" firestore:"studentId"`
	StudentName   string     `json:"studentName" firestore:"studentName"`
	MentorID      string     `json:"mentorId" firestore:"mentorId"`
	Type          string     `json:"type" firestore:"type"`
	Message       string     `json:"message" firestore:"message"`
	Status        string     `json:"status" firestore:"status"`
	CreatedAt     time.Time  `json:"createdAt" firestore:"createdAt"`
	Response      *string    `json:"response,omitempty" firestore:"response,omitempty"`
	ScheduledDate *time.Time `json:"scheduledDate,omitempty" firestore:"scheduledDate,omitempty"`
	Attachments   []string   `json:"attachments,omitempty" firestore:"attachments,omitempty"`
}

type CreateInterventionRequest struct {
	StudentID     string     `json:"studentId" validate:"required"`
	StudentName   string     `json:"studentName" validate:"required"`
	Type          string     `json:"type" validate:"required,oneof=reminder meeting resource"`
	Message       string     `json:"message" validate:"required"`
	ScheduledDate *time.Time `json:"scheduledDate,omitempty"`
	Attachments   []string   `json:"attachments,omitempty"`
}

type UpdateInterventionRequest struct {
	Status   string  `json:"status" validate:"required,oneof=sent scheduled completed cancelled"`
	Response *string `json:"response,omitempty"`
}
