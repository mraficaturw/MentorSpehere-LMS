package handlers

import (
	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userService *services.UserService
}

func NewUserHandler() *UserHandler {
	return &UserHandler{
		userService: services.NewUserService(),
	}
}

func (h *UserHandler) GetProfile(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	profile, err := h.userService.GetProfile(userID)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, profile)
}

func (h *UserHandler) UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	var req models.UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	user, err := h.userService.UpdateProfile(userID, req)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, user)
}

func (h *UserHandler) UpdateAvatar(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	var req struct {
		AvatarURL string `json:"avatarUrl"`
	}
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	user, err := h.userService.UpdateAvatar(userID, req.AvatarURL)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, user)
}

func (h *UserHandler) GetSettings(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	settings, err := h.userService.GetSettings(userID)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, settings)
}

func (h *UserHandler) UpdateSettings(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	section := c.Params("section")

	var data map[string]interface{}
	if err := c.BodyParser(&data); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	settings, err := h.userService.UpdateSettings(userID, section, data)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, settings)
}

func (h *UserHandler) ChangePassword(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	var req models.ChangePasswordRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	if err := h.userService.ChangePassword(userID, req); err != nil {
		return utils.SendBadRequest(c, err.Error())
	}

	return utils.SendSuccessWithMessage(c, "Password berhasil diubah", nil)
}

func (h *UserHandler) DeleteAccount(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	var req struct {
		Password string `json:"password"`
	}
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	if err := h.userService.DeleteAccount(userID, req.Password); err != nil {
		return utils.SendBadRequest(c, err.Error())
	}

	return utils.SendSuccessWithMessage(c, "Akun berhasil dihapus", nil)
}
