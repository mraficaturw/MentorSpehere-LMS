package models

import "time"

type User struct {
	ID               string    `json:"id" firestore:"id"`
	Name             string    `json:"name" firestore:"name"`
	Email            string    `json:"email" firestore:"email"`
	Password         string    `json:"-" firestore:"password"`
	Role             string    `json:"role" firestore:"role"`
	Avatar           string    `json:"avatar" firestore:"avatar"`
	Bio              string    `json:"bio" firestore:"bio"`
	Location         string    `json:"location" firestore:"location"`
	Phone            string    `json:"phone" firestore:"phone"`
	University       string    `json:"university" firestore:"university"`
	JoinedDate       time.Time `json:"joinedDate" firestore:"joinedDate"`
	EnrolledCourses  []string  `json:"enrolledCourses" firestore:"enrolledCourses"`
	AssignedStudents []string  `json:"assignedStudents" firestore:"assignedStudents"`
	TotalStudyTime   int       `json:"totalStudyTime" firestore:"totalStudyTime"`
	CompletedModules int       `json:"completedModules" firestore:"completedModules"`
	RiskScore        int       `json:"riskScore" firestore:"riskScore"`
}

type UserStats struct {
	TotalStudyTime   int `json:"totalStudyTime"`
	ModulesCompleted int `json:"modulesCompleted"`
	CoursesEnrolled  int `json:"coursesEnrolled"`
	Certificates     int `json:"certificates"`
	Badges           int `json:"badges"`
	Streak           int `json:"streak"`
}

type Badge struct {
	ID          int    `json:"id" firestore:"id"`
	Name        string `json:"name" firestore:"name"`
	Icon        string `json:"icon" firestore:"icon"`
	Description string `json:"description" firestore:"description"`
}

type UserSettings struct {
	UserID        string               `json:"userId" firestore:"userId"`
	Notifications NotificationSettings `json:"notifications" firestore:"notifications"`
	Appearance    AppearanceSettings   `json:"appearance" firestore:"appearance"`
	Privacy       PrivacySettings      `json:"privacy" firestore:"privacy"`
	Learning      LearningSettings     `json:"learning" firestore:"learning"`
}

type NotificationSettings struct {
	Email          bool `json:"email" firestore:"email"`
	Push           bool `json:"push" firestore:"push"`
	StudyReminder  bool `json:"studyReminder" firestore:"studyReminder"`
	WeeklyReport   bool `json:"weeklyReport" firestore:"weeklyReport"`
	MentorMessages bool `json:"mentorMessages" firestore:"mentorMessages"`
	CourseUpdates  bool `json:"courseUpdates" firestore:"courseUpdates"`
	Promotions     bool `json:"promotions" firestore:"promotions"`
}

type AppearanceSettings struct {
	Theme    string `json:"theme" firestore:"theme"`
	Language string `json:"language" firestore:"language"`
	FontSize string `json:"fontSize" firestore:"fontSize"`
}

type PrivacySettings struct {
	ProfileVisibility string `json:"profileVisibility" firestore:"profileVisibility"`
	ShowActivity      bool   `json:"showActivity" firestore:"showActivity"`
	ShowProgress      bool   `json:"showProgress" firestore:"showProgress"`
	AllowAnalytics    bool   `json:"allowAnalytics" firestore:"allowAnalytics"`
}

type LearningSettings struct {
	DailyGoal      int    `json:"dailyGoal" firestore:"dailyGoal"`
	ReminderTime   string `json:"reminderTime" firestore:"reminderTime"`
	AutoplayVideos bool   `json:"autoplayVideos" firestore:"autoplayVideos"`
	Subtitles      bool   `json:"subtitles" firestore:"subtitles"`
}

type LoginRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
}

type RegisterRequest struct {
	Name     string `json:"name" validate:"required,min=2"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Role     string `json:"role" validate:"required,oneof=student mentor"`
}

type UpdateProfileRequest struct {
	Name       string `json:"name"`
	Bio        string `json:"bio"`
	Location   string `json:"location"`
	Phone      string `json:"phone"`
	University string `json:"university"`
}

type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" validate:"required"`
	NewPassword     string `json:"newPassword" validate:"required,min=6"`
}
