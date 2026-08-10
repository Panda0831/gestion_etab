import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../prisma/prisma.service';

process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres123@localhost:5432/gestion_etab?schema=public';

interface AuthResponseBody {
  accessToken: string;
  utilisateur?: { email: string };
  email?: string;
}

const toBody = (res: { body: unknown }): AuthResponseBody =>
  res.body as AuthResponseBody;

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let etablissementId: string;
  const email = `e2e-${Date.now()}@example.com`;
  const motDePasse = 'secret123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    const etablissement = await prisma.etablissement.findFirst();
    if (!etablissement) {
      throw new Error(
        'Aucun établissement en base : impossible de tester auth',
      );
    }
    etablissementId = etablissement.id;
  });

  afterAll(async () => {
    await prisma.utilisateur.deleteMany({ where: { email } });
    await app.close();
  });

  it('POST /auth/register -> 201 avec token, sans motDePasse', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        etablissementId,
        email,
        motDePasse,
        nom: 'Test',
        prenom: 'E2E',
        role: 'PROFESSEUR',
      })
      .expect(201);

    const body = toBody(res);
    expect(body.accessToken).toBeDefined();
    expect(body.utilisateur?.email).toBe(email);
    expect(body.utilisateur).not.toHaveProperty('motDePasse');
  });

  it('POST /auth/register -> 409 si email déjà utilisé', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        etablissementId,
        email,
        motDePasse,
        nom: 'Test',
        prenom: 'E2E',
        role: 'PROFESSEUR',
      })
      .expect(409);
  });

  it('POST /auth/login -> 401 si mauvais mot de passe', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, motDePasse: 'mauvais-mdp' })
      .expect(401);
  });

  it('POST /auth/login -> token + profil', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, motDePasse })
      .expect(201);

    const body = toBody(res);
    expect(body.accessToken).toBeDefined();
    expect(body.utilisateur?.email).toBe(email);
    expect(body.utilisateur).not.toHaveProperty('motDePasse');
  });

  it('GET /auth/profile -> 200 avec un token valide', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, motDePasse });

    const loginBody = toBody(login);
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);

    const profileBody = toBody(res);
    expect(profileBody.email).toBe(email);
    expect(profileBody).not.toHaveProperty('motDePasse');
  });

  it('GET /auth/profile -> 401 sans token', async () => {
    await request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  it('GET /auth/profile -> 401 avec un token invalide', async () => {
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer token-invalide')
      .expect(401);
  });

  it('route protégée /etablissement -> 401 sans token', async () => {
    await request(app.getHttpServer()).get('/etablissement').expect(401);
  });
});
