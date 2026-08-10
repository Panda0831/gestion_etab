import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Utilisateur } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existing = await this.prisma.utilisateur.findUnique({
      where: {
        etablissementId_email: {
          etablissementId: registerDto.etablissementId,
          email: registerDto.email,
        },
      },
    });
    if (existing) {
      throw new ConflictException('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await bcrypt.hash(
      registerDto.motDePasse,
      SALT_ROUNDS,
    );

    const user = await this.prisma.utilisateur.create({
      data: {
        etablissementId: registerDto.etablissementId,
        email: registerDto.email,
        motDePasse: hashedPassword,
        nom: registerDto.nom,
        prenom: registerDto.prenom,
        telephone: registerDto.telephone,
        role: registerDto.role,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.findByCredentials(loginDto);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }
    return this.buildAuthResponse(user);
  }

  async issueToken(loginDto: LoginDto) {
    const user = await this.findByCredentials(loginDto);
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }
    const payload = this.buildPayload(user);
    const accessToken = await this.jwtService.signAsync(payload);
    const decoded = await this.jwtService.verifyAsync<{ exp?: number }>(
      accessToken,
    );
    const expiresIn = decoded.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : undefined;
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  async profile(userId: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: userId },
      include: {
        etablissement: { select: { id: true, nom: true, type: true } },
        eleve: true,
        parent: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    return this.sanitize(user);
  }

  private async findByCredentials(
    loginDto: LoginDto,
  ): Promise<Utilisateur | null> {
    const user = loginDto.etablissementId
      ? await this.prisma.utilisateur.findUnique({
          where: {
            etablissementId_email: {
              etablissementId: loginDto.etablissementId,
              email: loginDto.email,
            },
          },
        })
      : await this.prisma.utilisateur.findFirst({
          where: { email: loginDto.email },
        });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(loginDto.motDePasse, user.motDePasse);
    if (!valid) {
      return null;
    }

    await this.prisma.utilisateur.update({
      where: { id: user.id },
      data: { derniereConnexion: new Date() },
    });

    return user;
  }

  private buildPayload(user: Utilisateur) {
    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      etablissementId: user.etablissementId,
    };
  }

  private async buildAuthResponse(user: Utilisateur) {
    return {
      accessToken: await this.jwtService.signAsync(this.buildPayload(user)),
      utilisateur: this.sanitize(user),
    };
  }

  private sanitize(user: Utilisateur) {
    const { motDePasse: _motDePasse, ...safeUser } = user;
    void _motDePasse;
    return safeUser;
  }
}
