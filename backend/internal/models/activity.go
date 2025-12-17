package models

import "time"

type ActivityLog struct {
	ID       string    `json:"id" firestore:"id"`
	UserID   string    `json:"userId" firestore:"userId"`
	Type     string    `json:"type" firestore:"type"`
	Title    string    `json:"title" firestore:"title"`
	Duration int       `json:"duration" firestore:"duration"`
	Date     time.Time `json:"date" firestore:"date"`
	CourseID string    `json:"courseId" firestore:"courseId"`
	Score    *int      `json:"score,omitempty" firestore:"score,omitempty"`
}

type WeeklyActivity struct {
	Day        string `json:"day" firestore:"day"`
	StudyTime  int    `json:"studyTime" firestore:"studyTime"`
	Activities int    `json:"activities" firestore:"activities"`
}

type ActivityBreakdown struct {
	Video   int `json:"video"`
	Reading int `json:"reading"`
	Quiz    int `json:"quiz"`
}

type ActivityResponse struct {
	Activities  []ActivityLog     `json:"activities"`
	WeeklyData  []WeeklyActivity  `json:"weeklyData"`
	Breakdown   ActivityBreakdown `json:"breakdown"`
	TotalTime   int               `json:"totalTime"`
}
