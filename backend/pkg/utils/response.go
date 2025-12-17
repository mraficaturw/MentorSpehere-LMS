package utils

import "github.com/gofiber/fiber/v2"

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SendSuccess(c *fiber.Ctx, data interface{}) error {
	return c.JSON(Response{
		Success: true,
		Data:    data,
	})
}

func SendSuccessWithMessage(c *fiber.Ctx, message string, data interface{}) error {
	return c.JSON(Response{
		Success: true,
		Message: message,
		Data:    data,
	})
}

func SendError(c *fiber.Ctx, status int, message string) error {
	return c.Status(status).JSON(Response{
		Success: false,
		Error:   message,
	})
}

func SendBadRequest(c *fiber.Ctx, message string) error {
	return SendError(c, fiber.StatusBadRequest, message)
}

func SendUnauthorized(c *fiber.Ctx, message string) error {
	return SendError(c, fiber.StatusUnauthorized, message)
}

func SendNotFound(c *fiber.Ctx, message string) error {
	return SendError(c, fiber.StatusNotFound, message)
}

func SendInternalError(c *fiber.Ctx, message string) error {
	return SendError(c, fiber.StatusInternalServerError, message)
}
