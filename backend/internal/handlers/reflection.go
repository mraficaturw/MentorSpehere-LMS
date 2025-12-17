package handlers

import (
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type ReflectionHandler struct {
	reflectionService *services.ReflectionService
}

func NewReflectionHandler() *ReflectionHandler {
	return &ReflectionHandler{
		reflectionService: services.NewReflectionService(),
	}
}

func (h *ReflectionHandler) GetReflection(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	reflection := h.reflectionService.GetReflection(userID)
	return utils.SendSuccess(c, reflection)
}

func (h *ReflectionHandler) GenerateReflection(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	reflection := h.reflectionService.GenerateReflection(userID)
	return utils.SendSuccess(c, reflection)
}

func (h *ReflectionHandler) GetDailyReflection(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	date := c.Query("date", "")

	daily := h.reflectionService.GetDailyReflection(userID, date)
	return utils.SendSuccess(c, daily)
}

func (h *ReflectionHandler) GetWeeklyInsight(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)
	weekNumber := c.QueryInt("week", 1)

	weekly := h.reflectionService.GetWeeklyInsight(userID, weekNumber)
	return utils.SendSuccess(c, weekly)
}

func (h *ReflectionHandler) GetLearningPath(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	learningPath := h.reflectionService.GetLearningPath(userID)
	return utils.SendSuccess(c, learningPath)
}

func (h *ReflectionHandler) GetRiskAssessment(c *fiber.Ctx) error {
	userID := c.Locals("userId").(string)

	riskAssessment := h.reflectionService.GetRiskAssessment(userID)
	return utils.SendSuccess(c, riskAssessment)
}
