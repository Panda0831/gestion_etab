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

INSERT INTO cours (id, professeur_id, classe_id, matiere_id, titre, contenu, type)
VALUES (
  uuid_generate_v4(),
  (SELECT id FROM utilisateur WHERE role = 'PROFESSEUR' LIMIT 1),
  (SELECT id FROM classe WHERE nom = 'Terminale A' LIMIT 1),
  (SELECT id FROM matiere WHERE code = 'FR' LIMIT 1),
  'Les verbes irréguliers',
  'Un verbe irrégulier est un verbe dont la conjugaison ne suit pas les règles générales...',
  'COURS'
);

INSERT INTO cours_media (id, cours_id, nom_fichier, type, url)
SELECT gen_random_uuid(), c.id, v.nom_fichier, v.type::type_media, v.url
FROM cours c
CROSS JOIN (VALUES
  ('schema.png',    'IMAGE', 'https://picsum.photos/600/300'),
  ('demo.mp4',      'VIDEO', 'https://www.w3schools.com/html/mov_bbb.mp4'),
  ('lecon.mp3',     'AUDIO', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
  ('exercices.pdf', 'PDF',   'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf')
) AS v(nom_fichier, type, url)
WHERE c.titre = 'Les fractions';