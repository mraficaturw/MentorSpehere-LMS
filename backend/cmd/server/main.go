package main

import (
	"log"

	"mentorsphere-api/internal/config"
	"mentorsphere-api/internal/database"
	"mentorsphere-api/internal/router"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize Firebase
	if err := database.InitFirebase(cfg.FirebaseCredentialsPath); err != nil {
		log.Printf("Warning: Firebase initialization failed: %v", err)
		log.Println("Running in mock mode...")
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "MentorSphere API v1.0",
		ErrorHandler: customErrorHandler,
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} - ${method} ${path} ${latency}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins:     cfg.AllowedOrigins,
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: true,
	}))

	// Setup routes
	router.SetupRoutes(app, cfg)

	// Health check
	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "healthy",
			"message": "MentorSphere API is running",
			"version": "1.0.0",
		})
	})

	// Start server
	port := cfg.Port
	if port == "" {
		port = "3001"
	}

	log.Printf("🚀 MentorSphere API starting on port %s", port)
	log.Printf("📚 API Documentation: http://localhost:%s/api/health", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func customErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError

	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"error":   err.Error(),
	})
}
