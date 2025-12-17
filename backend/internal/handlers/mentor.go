package handlers

import (
	"mentorsphere-api/internal/models"
	"mentorsphere-api/internal/services"
	"mentorsphere-api/pkg/utils"

	"github.com/gofiber/fiber/v2"
)

type MentorHandler struct {
	mentorService *services.MentorService
}

func NewMentorHandler() *MentorHandler {
	return &MentorHandler{
		mentorService: services.NewMentorService(),
	}
}

func (h *MentorHandler) GetDashboard(c *fiber.Ctx) error {
	mentorID := c.Locals("userId").(string)

	dashboard := h.mentorService.GetDashboard(mentorID)
	return utils.SendSuccess(c, dashboard)
}

func (h *MentorHandler) GetStudents(c *fiber.Ctx) error {
	mentorID := c.Locals("userId").(string)

	students := h.mentorService.GetStudents(mentorID)
	return utils.SendSuccess(c, students)
}

func (h *MentorHandler) GetStudentDetail(c *fiber.Ctx) error {
	studentID := c.Params("id")

	detail, err := h.mentorService.GetStudentDetail(studentID)
	if err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, detail)
}

func (h *MentorHandler) CreateIntervention(c *fiber.Ctx) error {
	mentorID := c.Locals("userId").(string)

	var req models.CreateInterventionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	intervention, err := h.mentorService.CreateIntervention(mentorID, req)
	if err != nil {
		return utils.SendInternalError(c, err.Error())
	}

	return utils.SendSuccessWithMessage(c, "Intervention created", intervention)
}

func (h *MentorHandler) GetInterventions(c *fiber.Ctx) error {
	mentorID := c.Locals("userId").(string)

	interventions := h.mentorService.GetInterventions(mentorID)
	return utils.SendSuccess(c, interventions)
}

func (h *MentorHandler) UpdateInterventionStatus(c *fiber.Ctx) error {
	interventionID := c.Params("id")

	var req models.UpdateInterventionRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.SendBadRequest(c, "Invalid request body")
	}

	if err := h.mentorService.UpdateInterventionStatus(interventionID, req); err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, fiber.Map{
		"success":        true,
		"interventionId": interventionID,
		"status":         req.Status,
	})
}

func (h *MentorHandler) GetNotifications(c *fiber.Ctx) error {
	mentorID := c.Locals("userId").(string)

	notifications := h.mentorService.GetNotifications(mentorID)
	return utils.SendSuccess(c, notifications)
}

func (h *MentorHandler) MarkNotificationRead(c *fiber.Ctx) error {
	notificationID := c.Params("id")

	if err := h.mentorService.MarkNotificationRead(notificationID); err != nil {
		return utils.SendNotFound(c, err.Error())
	}

	return utils.SendSuccess(c, fiber.Map{
		"success":        true,
		"notificationId": notificationID,
	})
}
