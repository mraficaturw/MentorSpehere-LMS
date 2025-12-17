package config

import "os"

type Config struct {
	Port                    string
	JWTSecret               string
	FirebaseCredentialsPath string
	AllowedOrigins          string
	Environment             string
}

func Load() *Config {
	return &Config{
		Port:                    getEnv("PORT", "3001"),
		JWTSecret:               getEnv("JWT_SECRET", "mentorsphere-secret-key-change-in-production"),
		FirebaseCredentialsPath: getEnv("FIREBASE_CREDENTIALS_PATH", ""),
		AllowedOrigins:          getEnv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000"),
		Environment:             getEnv("ENVIRONMENT", "development"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
