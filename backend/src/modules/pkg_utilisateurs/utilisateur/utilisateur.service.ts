import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UtilisateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUtilisateurDto: CreateUtilisateurDto) {
    const hashedPassword = await bcrypt.hash(
      createUtilisateurDto.motDePasse,
      SALT_ROUNDS,
    );
    const user = await this.prisma.utilisateur.create({
      data: {
        ...createUtilisateurDto,
        motDePasse: hashedPassword,
      },
    });
    return this.sanitize(user);
  }

  async findAll() {
    const users = await this.prisma.utilisateur.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        etablissement: {
          select: { id: true, nom: true, type: true },
        },
      },
    });
    return users.map((user) => this.sanitize(user));
  }

  async findOne(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: {
        etablissement: true,
        eleve: true,
        parent: true,
      },
    });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return this.sanitize(utilisateur);
  }

  async update(id: string, updateUtilisateurDto: UpdateUtilisateurDto) {
    await this.findOne(id);
    const data = { ...updateUtilisateurDto };
    if (data.motDePasse) {
      data.motDePasse = await bcrypt.hash(data.motDePasse, SALT_ROUNDS);
    }
    const user = await this.prisma.utilisateur.update({
      where: { id },
      data,
    });
    return this.sanitize(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.utilisateur.delete({
      where: { id },
    });
  }

  private sanitize<T extends { motDePasse?: string }>(user: T) {
    const safeUser = { ...user };
    delete safeUser.motDePasse;
    return safeUser;
  }
}
