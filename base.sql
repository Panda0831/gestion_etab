`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE type_etablissement AS ENUM ('ECOLE', 'COLLEGE', 'LYCEE', 'UNIVERSITE');
CREATE TYPE role_utilisateur AS ENUM ('DIRECTEUR', 'SECRETAIRE', 'COMPTABLE', 'PROFESSEUR', 'ELEVE', 'PARENT');
CREATE TYPE sexe AS ENUM ('M', 'F');
CREATE TYPE statut_inscription AS ENUM ('INSCRIT', 'NON_INSCRIT', 'EN_ATTENTE');
CREATE TYPE statut_pointage AS ENUM ('PRESENT', 'ABSENT', 'RETARD');
CREATE TYPE jour_semaine AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI');
CREATE TYPE type_cours AS ENUM ('COURS', 'TD', 'TP');
CREATE TYPE type_media AS ENUM ('VIDEO', 'PDF', 'IMAGE', 'AUDIO');
CREATE TYPE type_evaluation AS ENUM ('DEVOIR', 'EXAMEN', 'RATTRAPAGE', 'TP', 'CONTROLE');
CREATE TYPE periode AS ENUM ('BIMESTRE', 'TRIMESTRE', 'SEMESTRE', 'ANNUEL');
CREATE TYPE mode_notation AS ENUM ('CREATIF', 'DEFAUT');
CREATE TYPE type_transaction AS ENUM ('ECOLAGE', 'DROIT_INSCRIPTION', 'REINSCRIPTION', 'FOURNITURE', 'AUTRE');
CREATE TYPE mode_paiement AS ENUM ('MOBILE_MONEY', 'BANQUE', 'ESPECE');
CREATE TYPE statut_paiement AS ENUM ('PAYE', 'EN_ATTENTE', 'ANNULE');
CREATE TYPE type_communication AS ENUM ('ANNONCE', 'NOTIFICATION');
CREATE TYPE sous_type_communication AS ENUM (
    'ADMISSION_BREVET', 'ADMISSION_TEST', 'ADMISSION_DOSSIER',
    'FOURNITURES', 'EMPLOI_DU_TEMPS', 'TARIFS', 'GENERALE',
    'RESULTAT', 'ABSENCE', 'PAIEMENT', 'NOUVEAU_COURS', 'CHANGEMENT_PLANNING'
);
CREATE TYPE type_discussion AS ENUM ('CLASSE', 'CLUB', 'EVENEMENT', 'GENERAL');
CREATE TYPE type_activite AS ENUM ('CLUB', 'EVENEMENT');
CREATE TYPE statut_evenement AS ENUM ('EN_PREPARATION', 'VALIDE', 'ANNULE');
CREATE TYPE role_membre AS ENUM ('MEMBRE', 'BUREAU');

CREATE TABLE etablissement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    logo VARCHAR(500),
    type type_etablissement NOT NULL,
    tarifs JSONB DEFAULT '{}',
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE utilisateur (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    role role_utilisateur NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    derniere_connexion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(etablissement_id, email)
);

CREATE TABLE parent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL UNIQUE REFERENCES utilisateur(id) ON DELETE CASCADE,
    profession VARCHAR(100)
);

CREATE TABLE eleve (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID NOT NULL UNIQUE REFERENCES utilisateur(id) ON DELETE CASCADE,
    classe_id UUID,
    parent_id UUID REFERENCES parent(id) ON DELETE SET NULL,
    matricule VARCHAR(50) NOT NULL,
    date_naissance DATE,
    lieu_naissance VARCHAR(255),
    sexe sexe,
    statut_inscription statut_inscription DEFAULT 'EN_ATTENTE'
);

CREATE TABLE pointage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professeur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    date_pointage DATE NOT NULL,
    heure_arrivee TIME,
    heure_depart TIME,
    statut statut_pointage DEFAULT 'PRESENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE niveau (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    cycle VARCHAR(50),
    ordre INTEGER,
    UNIQUE(etablissement_id, nom)
);

CREATE TABLE classe (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niveau_id UUID NOT NULL REFERENCES niveau(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    annee_scolaire VARCHAR(20) NOT NULL,
    effectif INTEGER DEFAULT 0
);

ALTER TABLE eleve ADD CONSTRAINT fk_eleve_classe
    FOREIGN KEY (classe_id) REFERENCES classe(id) ON DELETE SET NULL;

CREATE TABLE matiere (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    coefficient DECIMAL(4,2) DEFAULT 1.00,
    UNIQUE(etablissement_id, code)
);

CREATE TABLE professeur_matiere (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professeur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    matiere_id UUID NOT NULL REFERENCES matiere(id) ON DELETE CASCADE,
    UNIQUE(professeur_id, matiere_id)
);

CREATE TABLE emploi_du_temps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classe(id) ON DELETE CASCADE,
    matiere_id UUID NOT NULL REFERENCES matiere(id) ON DELETE CASCADE,
    professeur_id UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
    jour jour_semaine NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    salle VARCHAR(50)
);



CREATE TABLE fourniture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niveau_id UUID NOT NULL REFERENCES niveau(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    quantite INTEGER DEFAULT 1,
    description TEXT
);



CREATE TABLE cours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professeur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classe(id) ON DELETE CASCADE,
    matiere_id UUID NOT NULL REFERENCES matiere(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT,
    type type_cours DEFAULT 'COURS',
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cours_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cours_id UUID NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    nom_fichier VARCHAR(255) NOT NULL,
    type type_media NOT NULL,
    url VARCHAR(500) NOT NULL,
    taille BIGINT
);

CREATE TABLE evaluation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matiere_id UUID NOT NULL REFERENCES matiere(id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES classe(id) ON DELETE CASCADE,
    professeur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    type type_evaluation NOT NULL,
    coefficient DECIMAL(4,2) DEFAULT 1.00,
    periode periode NOT NULL,
    numero_periode INTEGER NOT NULL,
    date_evaluation TIMESTAMP NOT NULL
);

CREATE TABLE note (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_id UUID NOT NULL REFERENCES evaluation(id) ON DELETE CASCADE,
    eleve_id UUID NOT NULL REFERENCES eleve(id) ON DELETE CASCADE,
    valeur DECIMAL(5,2) NOT NULL CHECK (valeur >= 0 AND valeur <= 20),
    appreciation VARCHAR(500),
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saisie_par UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
    UNIQUE(evaluation_id, eleve_id)
);

CREATE TABLE bulletin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eleve_id UUID NOT NULL REFERENCES eleve(id) ON DELETE CASCADE,
    periode periode NOT NULL,
    numero_periode INTEGER NOT NULL,
    annee_scolaire VARCHAR(20) NOT NULL,
    moyenne_generale DECIMAL(5,2),
    rang INTEGER,
    mention VARCHAR(50),
    date_generation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fichier_pdf VARCHAR(500),
    UNIQUE(eleve_id, periode, numero_periode, annee_scolaire)
);

CREATE TABLE bulletin_detail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bulletin_id UUID NOT NULL REFERENCES bulletin(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES note(id) ON DELETE CASCADE,
    moyenne_matiere DECIMAL(5,2),
    coefficient DECIMAL(4,2),
    UNIQUE(bulletin_id, note_id)
);



CREATE TABLE transaction_financiere (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eleve_id UUID NOT NULL REFERENCES eleve(id) ON DELETE CASCADE,
    type type_transaction NOT NULL,
    montant DECIMAL(12,2) NOT NULL CHECK (montant > 0),
    mode mode_paiement NOT NULL,
    reference_transaction VARCHAR(100),
    statut statut_paiement DEFAULT 'EN_ATTENTE',
    date_paiement TIMESTAMP,
    date_validation TIMESTAMP,
    valide_par UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
    fichier_facture_pdf VARCHAR(500),
    annee_scolaire_reinscription VARCHAR(20)
);

CREATE TABLE parametre_notation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL UNIQUE REFERENCES etablissement(id) ON DELETE CASCADE,
    type_etablissement type_etablissement NOT NULL,
    mode mode_notation DEFAULT 'DEFAUT',
    regle_calcul JSONB DEFAULT '{}',
    seuil_rattrapage DECIMAL(5,2) DEFAULT 10.00
);



CREATE TABLE communication (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    type type_communication NOT NULL,
    sous_type sous_type_communication DEFAULT 'GENERALE',
    titre VARCHAR(255) NOT NULL,
    contenu TEXT,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    publie_par UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
    visible_public BOOLEAN DEFAULT FALSE,
    destinataire_id UUID REFERENCES utilisateur(id) ON DELETE CASCADE,
    lu BOOLEAN DEFAULT FALSE
);

CREATE TABLE discussion (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    type type_discussion NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discussion_membre (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussion(id) ON DELETE CASCADE,
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    date_join TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(discussion_id, utilisateur_id)
);

CREATE TABLE message (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussion(id) ON DELETE CASCADE,
    expediteur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fichier_joint VARCHAR(500)
);



CREATE TABLE club_evenement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    etablissement_id UUID NOT NULL REFERENCES etablissement(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    type type_activite NOT NULL,
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    lieu VARCHAR(255),
    statut statut_evenement DEFAULT 'EN_PREPARATION',
    budget_estime DECIMAL(12,2),
    responsable_id UUID REFERENCES utilisateur(id) ON DELETE SET NULL
);

CREATE TABLE activite (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_evenement_id UUID NOT NULL REFERENCES club_evenement(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    date_activite TIMESTAMP NOT NULL,
    lieu VARCHAR(255)
);

CREATE TABLE club_evenement_membre (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_evenement_id UUID NOT NULL REFERENCES club_evenement(id) ON DELETE CASCADE,
    eleve_id UUID NOT NULL REFERENCES eleve(id) ON DELETE CASCADE,
    role role_membre DEFAULT 'MEMBRE',
    date_adhesion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(club_evenement_id, eleve_id)
);

CREATE TABLE club_evenement_organisateur (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_evenement_id UUID NOT NULL REFERENCES club_evenement(id) ON DELETE CASCADE,
    utilisateur_id UUID NOT NULL REFERENCES utilisateur(id) ON DELETE CASCADE,
    role VARCHAR(100),
    UNIQUE(club_evenement_id, utilisateur_id)
);



CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilisateur_id UUID REFERENCES utilisateur(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entite VARCHAR(50) NOT NULL,
    entite_id UUID,
    ancienne_valeur JSONB,
    nouvelle_valeur JSONB,
    ip_adresse VARCHAR(45),
    date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 -- INDEXES
CREATE INDEX idx_utilisateur_etablissement ON utilisateur(etablissement_id);
CREATE INDEX idx_utilisateur_role ON utilisateur(role);
CREATE INDEX idx_eleve_classe ON eleve(classe_id);
CREATE INDEX idx_eleve_parent ON eleve(parent_id);
CREATE INDEX idx_note_eleve ON note(eleve_id);
CREATE INDEX idx_note_evaluation ON note(evaluation_id);
CREATE INDEX idx_bulletin_eleve ON bulletin(eleve_id);
CREATE INDEX idx_transaction_eleve ON transaction_financiere(eleve_id);
CREATE INDEX idx_transaction_statut ON transaction_financiere(statut);
CREATE INDEX idx_communication_destinataire ON communication(destinataire_id);
CREATE INDEX idx_communication_visible ON communication(visible_public, etablissement_id);
CREATE INDEX idx_message_discussion ON message(discussion_id);
CREATE INDEX idx_activite_club ON activite(club_evenement_id);
CREATE INDEX idx_audit_log_entite ON audit_log(entite, entite_id);
CREATE INDEX idx_audit_log_date ON audit_log(date_action);

 -- VUE
CREATE VIEW vue_eleve_complet AS
SELECT
    e.id AS eleve_id,
    u.nom, u.prenom, u.email,
    e.matricule,
    c.nom AS classe_nom,
    n.nom AS niveau_nom,
    p.id AS parent_id,
    pu.nom AS parent_nom, pu.prenom AS parent_prenom
FROM eleve e
JOIN utilisateur u ON e.utilisateur_id = u.id
LEFT JOIN classe c ON e.classe_id = c.id
LEFT JOIN niveau n ON c.niveau_id = n.id
LEFT JOIN parent p ON e.parent_id = p.id
LEFT JOIN utilisateur pu ON p.utilisateur_id = pu.id;
