import { describe, it, expect, vi, beforeEach } from "vitest";
import type { FastifyReply, FastifyRequest } from "fastify";

import { CreateUserController } from "../../../../src/modules/user/controllers/CreateUserController";
import { CreateUserUseCase } from "../../../../src/modules/user/usecases/CreateUserUseCase";
import type { CreateUserInputDto } from "../../../../src/modules/user/dtos/CreateUserInputDto";
import { ConflictError } from "../../../../src/shared/errors/ConflictError";

describe("CreateUserController", () => {
  let mockUseCase: CreateUserUseCase;
  let controller: CreateUserController;
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;

  beforeEach(() => {
    // Mock do UseCase
    mockUseCase = {
      execute: vi.fn(),
    } as unknown as CreateUserUseCase;

    controller = new CreateUserController(mockUseCase);

    // Mock request
    mockRequest = {
      body: {
        name: "João",
        email: "joao@email.com",
        password: "123456",
      } as CreateUserInputDto,
    } as FastifyRequest;

    // Mock reply
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;
  });

  it("deve retornar 201 e o usuário criado", async () => {
    const mockUser = {
      id: "123",
      name: "João",
      email: "joao@email.com",
      role: "USER",
    };

    (mockUseCase.execute as any).mockResolvedValue(mockUser);

    await controller.handle(mockRequest, mockReply);

    expect(mockUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith(mockUser);
  });

  it("deve lançar erro quando o UseCase lançar ConflictError", async () => {
    const conflictError = new ConflictError("Usuário já existe");
    (mockUseCase.execute as any).mockRejectedValue(conflictError);

    await expect(controller.handle(mockRequest, mockReply)).rejects.toThrow(
      ConflictError
    );
  });

  it("deve propagar erros inesperados", async () => {
    const unexpected = new Error("erro db");
    (mockUseCase.execute as any).mockRejectedValue(unexpected);

    await expect(controller.handle(mockRequest, mockReply)).rejects.toThrow(
      "erro db"
    );
  });
});
