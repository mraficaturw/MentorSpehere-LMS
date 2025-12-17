package handlers

import (
	"mentorsphere-api/internal/config"
	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService *services.AuthService
	cfg         *config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		authService: services.NewAuthService(),
		cfg:         cfg,
	}
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req models.LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	if req.Email == "" || req.Password == "" {
		return utils.SendBadRequest(c, "Email and password are required")
	}

	user, err := h.authService.Login(req.Email, req.Password)
	if err != nil {
		return utils.SendUnauthorized(c, "Email atau password salah")
	}

	token, err := utils.GenerateToken(user.ID, user.Email, user.Role, h.cfg)
	if err != nil {
		return utils.SendInternalError(c, "Failed to generate token")
	}

	return utils.SendSuccess(c, fiber.Map{
		"user":  user,
		"token": token,
	})
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var req models.RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		return utils.SendBadRequest(c, "Name, email, and password are required")
	}

	if req.Role == "" {
		req.Role = "student"
	}

	user, err := h.authService.Register(req)
	if err != nil {
		return utils.SendBadRequest(c, err.Error())
	}

	token, err := utils.GenerateToken(user.ID, user.Email, user.Role, h.cfg)
	if err != nil {
		return utils.SendInternalError(c, "Failed to generate token")
	}

	return utils.SendSuccessWithMessage(c, "Registration successful", fiber.Map{
		"user":  user,
		"token": token,
	})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	return utils.SendSuccess(c, fiber.Map{
		"success": true,
	})
}

func (h *AuthHandler) GetCurrentUser(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	user, err := h.authService.GetUserByID(userID)
	if err != nil {
		return utils.SendNotFound(c, "User tidak ditemukan")
	}

	return utils.SendSuccess(c, user)
}
