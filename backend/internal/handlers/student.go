package handlers

import (
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type StudentHandler struct {
	studentService *services.StudentService
}

func NewStudentHandler() *StudentHandler {
	return &StudentHandler{
		studentService: services.NewStudentService(),
	}
}

func (h *StudentHandler) GetDashboard(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	dashboard, err := h.studentService.GetDashboard(userID)
	if err != nil {
		return utils.SendInternalError(c, err.Error())
	}

	return utils.SendSuccess(c, dashboard)
}

func (h *StudentHandler) GetCourses(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	courses := h.studentService.GetCourses(userID)
	return utils.SendSuccess(c, courses)
}

func (h *StudentHandler) GetActivity(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	activity, err := h.studentService.GetActivity(userID)
	if err != nil {
		return utils.SendInternalError(c, err.Error())
	}

	return utils.SendSuccess(c, activity)
}
