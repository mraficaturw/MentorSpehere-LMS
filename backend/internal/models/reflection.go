package models

type Reflection struct {
	Daily          DailyReflection  `json:"daily" firestore:"daily"`
	Weekly         WeeklyInsight    `json:"weekly" firestore:"weekly"`
	LearningPath   LearningPath     `json:"learningPath" firestore:"learningPath"`
	RiskAssessment RiskAssessment   `json:"riskAssessment" firestore:"riskAssessment"`
}

type DailyReflection struct {
	Date         string   `json:"date" firestore:"date"`
	Summary      string   `json:"summary" firestore:"summary"`
	Strengths    []string `json:"strengths" firestore:"strengths"`
	Improvements []string `json:"improvements" firestore:"improvements"`
	Mood         string   `json:"mood" firestore:"mood"`
}

type WeeklyInsight struct {
	WeekNumber     int      `json:"weekNumber" firestore:"weekNumber"`
	TotalStudyTime int      `json:"totalStudyTime" firestore:"totalStudyTime"`
	AverageDaily   int      `json:"averageDaily" firestore:"averageDaily"`
	TopSubjects    []string `json:"topSubjects" firestore:"topSubjects"`
	Insights       []string `json:"insights" firestore:"insights"`
	Recommendation string   `json:"recommendation" firestore:"recommendation"`
}

type LearningPath struct {
	CurrentPhase        string           `json:"currentPhase" firestore:"currentPhase"`
	Progress            int              `json:"progress" firestore:"progress"`
	NextMilestone       string           `json:"nextMilestone" firestore:"nextMilestone"`
	EstimatedCompletion string           `json:"estimatedCompletion" firestore:"estimatedCompletion"`
	SuggestedTopics     []SuggestedTopic `json:"suggestedTopics" firestore:"suggestedTopics"`
}

type SuggestedTopic struct {
	Title    string `json:"title" firestore:"title"`
	Priority string `json:"priority" firestore:"priority"`
	Reason   string `json:"reason" firestore:"reason"`
}

type RiskAssessment struct {
	Score           int              `json:"score" firestore:"score"`
	Level           string           `json:"level" firestore:"level"`
	Factors         []RiskFactor     `json:"factors" firestore:"factors"`
	Explanation     string           `json:"explanation" firestore:"explanation"`
	Recommendations []string         `json:"recommendations" firestore:"recommendations"`
}

type RiskFactor struct {
	Name   string `json:"name" firestore:"name"`
	Value  int    `json:"value" firestore:"value"`
	Status string `json:"status" firestore:"status"`
}
