package middleware

import (
	"strings"

	"mentorsphere-api/internal/config"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		
		if authHeader == "" {
			return utils.SendUnauthorized(c, "Authorization header required")
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return utils.SendUnauthorized(c, "Invalid authorization format")
		}

		token := parts[1]
		claims, err := utils.ValidateToken(token, cfg)
		if err != nil {
			return utils.SendUnauthorized(c, "Invalid or expired token")
		}

		// Store user info in context
		c.Locals("userId", claims.UserID)
		c.Locals("email", claims.Email)
		c.Locals("role", claims.Role)

		return c.Next()
	}
}

func RoleMiddleware(allowedRoles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		role := c.Locals("role").(string)
		
		for _, allowedRole := range allowedRoles {
			if role == allowedRole {
				return c.Next()
			}
		}

		return utils.SendError(c, fiber.StatusForbidden, "Access denied")
	}
}
