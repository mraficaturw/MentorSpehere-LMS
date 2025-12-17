package models

type Course struct {
	ID               string   `json:"id" firestore:"id"`
	Title            string   `json:"title" firestore:"title"`
	Description      string   `json:"description" firestore:"description"`
	Instructor       string   `json:"instructor" firestore:"instructor"`
	Thumbnail        string   `json:"thumbnail" firestore:"thumbnail"`
	Duration         string   `json:"duration" firestore:"duration"`
	TotalModules     int      `json:"totalModules" firestore:"totalModules"`
	CompletedModules int      `json:"completedModules" firestore:"completedModules"`
	Progress         int      `json:"progress" firestore:"progress"`
	Category         string   `json:"category" firestore:"category"`
	Level            string   `json:"level" firestore:"level"`
	Modules          []Module `json:"modules" firestore:"modules"`
}

type Module struct {
	ID       int    `json:"id" firestore:"id"`
	Title    string `json:"title" firestore:"title"`
	Duration int    `json:"duration" firestore:"duration"`
	Type     string `json:"type" firestore:"type"`
	Status   string `json:"status" firestore:"status"`
	Score    *int   `json:"score,omitempty" firestore:"score,omitempty"`
}

type QuizSummary struct {
	TotalQuizzes     int       `json:"totalQuizzes"`
	CompletedQuizzes int       `json:"completedQuizzes"`
	AverageScore     float64   `json:"averageScore"`
	Quizzes          []QuizDTO `json:"quizzes"`
}

type QuizDTO struct {
	ID       int    `json:"id"`
	Title    string `json:"title"`
	Duration int    `json:"duration"`
	Type     string `json:"type"`
	Status   string `json:"status"`
	Score    *int   `json:"score,omitempty"`
	Passed   bool   `json:"passed"`
}

type UpdateModuleStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=locked in-progress completed"`
	Score  *int   `json:"score,omitempty"`
}
