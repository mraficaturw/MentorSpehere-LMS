package handlers

import (
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type CourseHandler struct {
	courseService *services.CourseService
}

func NewCourseHandler() *CourseHandler {
	return &CourseHandler{
		courseService: services.NewCourseService(),
	}
}

func (h *CourseHandler) GetAll(c *fiber.Ctx) error {
	courses := h.courseService.GetAll()
	return utils.SendSuccess(c, courses)
}

func (h *CourseHandler) GetByID(c *fiber.Ctx) error {
	courseID := c.Params("id")

	course := h.courseService.GetByID(courseID)
	if course == nil {
		return utils.SendNotFound(c, "Course tidak ditemukan")
	}

	return utils.SendSuccess(c, course)
}

func (h *CourseHandler) GetModules(c *fiber.Ctx) error {
	courseID := c.Params("id")

	modules := h.courseService.GetModules(courseID)
	if modules == nil {
		return utils.SendNotFound(c, "Course tidak ditemukan")
	}

	return utils.SendSuccess(c, modules)
}

func (h *CourseHandler) UpdateModuleStatus(c *fiber.Ctx) error {
	courseID := c.Params("id")
	moduleID := c.Params("moduleId")

	var req struct {
		Status string `json:"status"`
		Score  *int   `json:"score,omitempty"`
	}
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	return utils.SendSuccess(c, fiber.Map{
		"success":  true,
		"courseId": courseID,
		"moduleId": moduleID,
		"status":   req.Status,
	})
}

func (h *CourseHandler) GetQuizSummary(c *fiber.Ctx) error {
	courseID := c.Params("id")

	summary := h.courseService.GetQuizSummary(courseID)
	if summary == nil {
		return utils.SendNotFound(c, "Course tidak ditemukan")
	}

	return utils.SendSuccess(c, summary)
}
