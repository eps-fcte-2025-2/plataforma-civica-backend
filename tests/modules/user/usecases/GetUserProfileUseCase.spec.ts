import { describe, it, expect, vi } from 'vitest';
import { GetUserProfileUseCase } from '../../../../src/modules/user/usecases/GetUserProfileUseCase';
import { NotFoundError } from '../../../../src/shared/errors/NotFoundError';
import { UserFactory } from '../../../../tests/factories/UserFactory';
import type { IUserRepository } from '../../../../src/modules/user/repositories/IUserRepository';

describe('GetUserProfileUseCase', () => {
  it('deve retornar o usuário quando encontrado', async () => {
    const mockUser = UserFactory.createUserOutput();
    const mockUserRepository = UserFactory.createUserRepositoryMock() as IUserRepository;
    mockUserRepository.findById = vi.fn().mockResolvedValue(mockUser);
    
    const useCase = new GetUserProfileUseCase(mockUserRepository);

    const result = await useCase.execute('123');

    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockUser);
    expect(result.id).toBe('123');
    expect(result.role).toBe('ADMIN');
    expect(result.name).toBe('João Silva');
    expect(result.email).toBe('joao@email.com');
  });

  it('deve lançar NotFoundError quando usuário não for encontrado', async () => {
    const mockUserRepository = UserFactory.createUserRepositoryMock() as IUserRepository;
    mockUserRepository.findById = vi.fn().mockResolvedValue(null);
    
    const useCase = new GetUserProfileUseCase(mockUserRepository);

    await expect(useCase.execute('999'))
      .rejects
      .toThrow(NotFoundError);

    await expect(useCase.execute('999'))
      .rejects
      .toThrow('Usuário não encontrado');

    expect(mockUserRepository.findById).toHaveBeenCalledWith('999');
  });

  it('deve lançar erro quando o repositório lançar erro', async () => {
    // Arrange
    const mockUserRepository = UserFactory.createUserRepositoryMock() as IUserRepository;
    const repoError = new Error('Erro no banco de dados');
    mockUserRepository.findById = vi.fn().mockRejectedValue(repoError);
    
    const useCase = new GetUserProfileUseCase(mockUserRepository);

    await expect(useCase.execute('123'))
      .rejects
      .toThrow('Erro no banco de dados');

    expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
  });

  // Adicional: usuário com role diferente
  it('Adicional: deve retornar usuário com role MODERATOR', async () => {
    const mockUser = UserFactory.createUserOutput({ role: 'MODERATOR' });
    const mockUserRepository = UserFactory.createUserRepositoryMock() as IUserRepository;
    mockUserRepository.findById = vi.fn().mockResolvedValue(mockUser);
    
    const useCase = new GetUserProfileUseCase(mockUserRepository);

    const result = await useCase.execute('456');

    expect(result.role).toBe('MODERATOR');
    expect(mockUserRepository.findById).toHaveBeenCalledWith('456');
  });

  it('Adicional: deve retornar usuário com email customizado', async () => {
    const mockUser = UserFactory.createUserOutput({ 
      id: '789', 
      email: 'custom@email.com',
      name: 'Maria Santos' 
    });
    const mockUserRepository = UserFactory.createUserRepositoryMock() as IUserRepository;
    mockUserRepository.findById = vi.fn().mockResolvedValue(mockUser);
    
    const useCase = new GetUserProfileUseCase(mockUserRepository);

    const result = await useCase.execute('789');

    expect(result.id).toBe('789');
    expect(result.email).toBe('custom@email.com');
    expect(result.name).toBe('Maria Santos');
  });
});