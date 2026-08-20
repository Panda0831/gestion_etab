INSERT INTO utilisateur (
    etablissement_id,
    email,
    mot_de_passe,
    nom,
    prenom,
    telephone,
    role
)
VALUES (
    '27c53a32-14a3-4bf6-bf80-e84e503cde6d',
    'secretaire@ecole.com',
    'motdepasse',
    'Rakoto',
    'Marie',
    '0341234567',
    'SECRETAIRE'
);

-- A modifier dans la migration prisma
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE utilisateur
ALTER COLUMN id SET DEFAULT uuid_generate_v4();