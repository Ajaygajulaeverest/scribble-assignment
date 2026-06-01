import { z } from "zod";

const roomCodeSchema = z
  .string()
  .trim()
  .min(1, "Room code is required")
  .regex(/^[A-Za-z0-9]{4}$/, "Room code must be 4 letters or numbers")
  .transform((code) => code.toUpperCase());

const playerNameSchema = z
  .string({
    required_error: "Player name is required"
  })
  .trim()
  .min(1, "Player name is required");

export const createRoomSchema = z.object({
  playerName: playerNameSchema
});

export const joinRoomSchema = z.object({
  playerName: playerNameSchema
});

export const roomCodeParamsSchema = z.object({
  code: roomCodeSchema
});

export const roomViewerQuerySchema = z.object({
  participantId: z.string().optional()
});

export const startGameSchema = z.object({
  participantId: z.string().trim().min(1, "Participant id is required")
});

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
