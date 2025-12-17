package router

import (
	"mentorsphere-api/internal/config"
	"mentorsphere-api/internal/handlers"
	"mentorsphere-api/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, cfg *config.Config) {
	api := app.Group("/api")

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(cfg)
	userHandler := handlers.NewUserHandler()
	courseHandler := handlers.NewCourseHandler()
	studentHandler := handlers.NewStudentHandler()
	mentorHandler := handlers.NewMentorHandler()
	reflectionHandler := handlers.NewReflectionHandler()

	// Auth routes (public)
	auth := api.Group("/auth")
	auth.Post("/login", authHandler.Login)
	auth.Post("/register", authHandler.Register)
	auth.Post("/logout", authHandler.Logout)
	auth.Get("/me", middleware.AuthMiddleware(cfg), authHandler.GetCurrentUser)

	// User routes (protected)
	user := api.Group("/user", middleware.AuthMiddleware(cfg))
	user.Get("/profile", userHandler.GetProfile)
	user.Put("/profile", userHandler.UpdateProfile)
	user.Put("/avatar", userHandler.UpdateAvatar)
	user.Get("/settings", userHandler.GetSettings)
	user.Put("/settings/:section", userHandler.UpdateSettings)
	user.Put("/password", userHandler.ChangePassword)
	user.Delete("/", userHandler.DeleteAccount)

	// Course routes (protected)
	courses := api.Group("/courses", middleware.AuthMiddleware(cfg))
	courses.Get("/", courseHandler.GetAll)
	courses.Get("/:id", courseHandler.GetByID)
	courses.Get("/:id/modules", courseHandler.GetModules)
	courses.Put("/:id/modules/:moduleId", courseHandler.UpdateModuleStatus)
	courses.Get("/:id/quiz-summary", courseHandler.GetQuizSummary)

	// Student routes (protected, student role)
	student := api.Group("/student", middleware.AuthMiddleware(cfg))
	student.Get("/dashboard", studentHandler.GetDashboard)
	student.Get("/courses", studentHandler.GetCourses)
	student.Get("/activity", studentHandler.GetActivity)

	// Mentor routes (protected, mentor role)
	mentor := api.Group("/mentor", middleware.AuthMiddleware(cfg))
	mentor.Get("/dashboard", mentorHandler.GetDashboard)
	mentor.Get("/students", mentorHandler.GetStudents)
	mentor.Get("/students/:id", mentorHandler.GetStudentDetail)
	mentor.Post("/interventions", mentorHandler.CreateIntervention)
	mentor.Get("/interventions", mentorHandler.GetInterventions)
	mentor.Put("/interventions/:id", mentorHandler.UpdateInterventionStatus)
	mentor.Get("/notifications", mentorHandler.GetNotifications)
	mentor.Put("/notifications/:id/read", mentorHandler.MarkNotificationRead)

	// Reflection routes (protected)
	reflections := api.Group("/reflections", middleware.AuthMiddleware(cfg))
	reflections.Get("/", reflectionHandler.GetReflection)
	reflections.Post("/generate", reflectionHandler.GenerateReflection)
	reflections.Get("/daily", reflectionHandler.GetDailyReflection)
	reflections.Get("/weekly", reflectionHandler.GetWeeklyInsight)
	reflections.Get("/learning-path", reflectionHandler.GetLearningPath)
	reflections.Get("/risk-assessment", reflectionHandler.GetRiskAssessment)
}
