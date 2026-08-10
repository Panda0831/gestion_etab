import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'uuid-1',
    etablissementId: 'uuid-eb',
    email: 'jean@example.com',
    motDePasse: '$2a$10$hashedpassword',
    nom: 'Dupont',
    prenom: 'Jean',
    telephone: null,
    role: 'PROFESSEUR',
    actif: true,
    derniereConnexion: null,
    createdAt: new Date(),
  };

  const prisma = {
    utilisateur: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it("devrait refuser si l'email existe déjà dans l'établissement", async () => {
      prisma.utilisateur.findUnique.mockResolvedValue(mockUser);
      const dto: RegisterDto = {
        etablissementId: 'uuid-eb',
        email: 'jean@example.com',
        motDePasse: 'secret123',
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'PROFESSEUR',
      };
      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('devrait créer un utilisateur avec un mot de passe haché', async () => {
      prisma.utilisateur.findUnique.mockResolvedValue(null);
      let createdPassword = '';
      prisma.utilisateur.create.mockImplementation(
        ({ data }: { data: { motDePasse: string } }) => {
          createdPassword = data.motDePasse;
          return Promise.resolve({ ...mockUser, motDePasse: createdPassword });
        },
      );
      const dto: RegisterDto = {
        etablissementId: 'uuid-eb',
        email: 'jean@example.com',
        motDePasse: 'secret123',
        nom: 'Dupont',
        prenom: 'Jean',
        role: 'PROFESSEUR',
      };
      const result = await service.register(dto);
      expect(createdPassword).not.toBe('secret123');
      expect(createdPassword).toContain('$2');
      expect(result.accessToken).toBe('jwt-token');
      expect(result.utilisateur).not.toHaveProperty('motDePasse');
    });
  });

  describe('login', () => {
    it('devrait rejeter des identifiants invalides', async () => {
      prisma.utilisateur.findFirst.mockResolvedValue(null);
      const dto: LoginDto = { email: 'jean@example.com', motDePasse: 'wrong' };
      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('devrait retourner un token si les identifiants sont valides', async () => {
      const hash = bcrypt.hashSync('secret123', 4);
      const validUser = { ...mockUser, motDePasse: hash };
      prisma.utilisateur.findFirst.mockResolvedValue(validUser);
      prisma.utilisateur.update.mockResolvedValue(validUser);

      const dto: LoginDto = {
        email: 'jean@example.com',
        motDePasse: 'secret123',
      };
      const result = await service.login(dto);
      expect(result.accessToken).toBe('jwt-token');
      expect(result.utilisateur).not.toHaveProperty('motDePasse');
      expect(prisma.utilisateur.update).toHaveBeenCalled();
    });
  });

  describe('profile', () => {
    it("devrait retourner l'utilisateur sans mot de passe", async () => {
      prisma.utilisateur.findUnique.mockResolvedValue(mockUser);
      const result = await service.profile('uuid-1');
      expect(result).not.toHaveProperty('motDePasse');
      expect(result.id).toBe('uuid-1');
    });

    it("devrait lever une exception si l'utilisateur n'existe pas", async () => {
      prisma.utilisateur.findUnique.mockResolvedValue(null);
      await expect(service.profile('uuid-inconnu')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
