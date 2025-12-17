package models

type Notification struct {
	ID      string `json:"id" firestore:"id"`
	UserID  string `json:"userId" firestore:"userId"`
	Type    string `json:"type" firestore:"type"`
	Title   string `json:"title" firestore:"title"`
	Message string `json:"message" firestore:"message"`
	Time    string `json:"time" firestore:"time"`
	Read    bool   `json:"read" firestore:"read"`
}

type MentorStats struct {
	TotalStudents        int     `json:"totalStudents"`
	ActiveStudents       int     `json:"activeStudents"`
	AverageProgress      float64 `json:"averageProgress"`
	StudentsAtRisk       int     `json:"studentsAtRisk"`
	InterventionsThisWeek int    `json:"interventionsThisWeek"`
	CompletionRate       float64 `json:"completionRate"`
}

type StudentRiskData struct {
	ID         string `json:"id" firestore:"id"`
	Name       string `json:"name" firestore:"name"`
	RiskScore  int    `json:"riskScore" firestore:"riskScore"`
	LastActive string `json:"lastActive" firestore:"lastActive"`
	Progress   int    `json:"progress" firestore:"progress"`
	Trend      string `json:"trend" firestore:"trend"`
}

type RiskDistribution struct {
	Level string `json:"level"`
	Count int    `json:"count"`
	Color string `json:"color"`
}

type MentorDashboard struct {
	Stats              MentorStats        `json:"stats"`
	StudentsAtRisk     []StudentRiskData  `json:"studentsAtRisk"`
	RecentInterventions []Intervention    `json:"recentInterventions"`
	Notifications      []Notification     `json:"notifications"`
	GlobalActivity     []WeeklyActivity   `json:"globalActivity"`
	RiskDistribution   []RiskDistribution `json:"riskDistribution"`
}

type StudentDetail struct {
	StudentRiskData
	User               User             `json:"user"`
	ActivityLog        []ActivityLog    `json:"activityLog"`
	WeeklyActivity     []WeeklyActivity `json:"weeklyActivity"`
	AIInsights         Reflection       `json:"aiInsights"`
	InterventionHistory []Intervention  `json:"interventionHistory"`
	PerformanceMetrics PerformanceMetrics `json:"performanceMetrics"`
}

type PerformanceMetrics struct {
	AverageQuizScore  float64 `json:"averageQuizScore"`
	CompletionRate    float64 `json:"completionRate"`
	EngagementScore   float64 `json:"engagementScore"`
	ConsistencyScore  float64 `json:"consistencyScore"`
}
