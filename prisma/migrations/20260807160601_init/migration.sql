-- CreateEnum
CREATE TYPE "type_etablissement" AS ENUM ('ECOLE', 'COLLEGE', 'LYCEE', 'UNIVERSITE');

-- CreateEnum
CREATE TYPE "role_utilisateur" AS ENUM ('DIRECTEUR', 'SECRETAIRE', 'COMPTABLE', 'PROFESSEUR', 'ELEVE', 'PARENT');

-- CreateEnum
CREATE TYPE "sexe" AS ENUM ('M', 'F');

-- CreateEnum
CREATE TYPE "statut_inscription" AS ENUM ('INSCRIT', 'NON_INSCRIT', 'EN_ATTENTE');

-- CreateEnum
CREATE TYPE "statut_pointage" AS ENUM ('PRESENT', 'ABSENT', 'RETARD');

-- CreateEnum
CREATE TYPE "jour_semaine" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI');

-- CreateEnum
CREATE TYPE "type_cours" AS ENUM ('COURS', 'TD', 'TP');

-- CreateEnum
CREATE TYPE "type_media" AS ENUM ('VIDEO', 'PDF', 'IMAGE', 'AUDIO');

-- CreateEnum
CREATE TYPE "type_evaluation" AS ENUM ('DEVOIR', 'EXAMEN', 'RATTRAPAGE', 'TP', 'CONTROLE');

-- CreateEnum
CREATE TYPE "periode" AS ENUM ('BIMESTRE', 'TRIMESTRE', 'SEMESTRE', 'ANNUEL');

-- CreateEnum
CREATE TYPE "mode_notation" AS ENUM ('CREATIF', 'DEFAUT');

-- CreateEnum
CREATE TYPE "type_transaction" AS ENUM ('ECOLAGE', 'DROIT_INSCRIPTION', 'REINSCRIPTION', 'FOURNITURE', 'AUTRE');

-- CreateEnum
CREATE TYPE "mode_paiement" AS ENUM ('MOBILE_MONEY', 'BANQUE', 'ESPECE');

-- CreateEnum
CREATE TYPE "statut_paiement" AS ENUM ('PAYE', 'EN_ATTENTE', 'ANNULE');

-- CreateEnum
CREATE TYPE "type_communication" AS ENUM ('ANNONCE', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "sous_type_communication" AS ENUM ('ADMISSION_BREVET', 'ADMISSION_TEST', 'ADMISSION_DOSSIER', 'FOURNITURES', 'EMPLOI_DU_TEMPS', 'TARIFS', 'GENERALE', 'RESULTAT', 'ABSENCE', 'PAIEMENT', 'NOUVEAU_COURS', 'CHANGEMENT_PLANNING');

-- CreateEnum
CREATE TYPE "type_discussion" AS ENUM ('CLASSE', 'CLUB', 'EVENEMENT', 'GENERAL');

-- CreateEnum
CREATE TYPE "type_activite" AS ENUM ('CLUB', 'EVENEMENT');

-- CreateEnum
CREATE TYPE "statut_evenement" AS ENUM ('EN_PREPARATION', 'VALIDE', 'ANNULE');

-- CreateEnum
CREATE TYPE "role_membre" AS ENUM ('MEMBRE', 'BUREAU');

-- CreateTable
CREATE TABLE "etablissement" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "adresse" TEXT,
    "telephone" VARCHAR(20),
    "email" VARCHAR(255),
    "logo" VARCHAR(500),
    "type" "type_etablissement" NOT NULL,
    "tarifs" JSONB DEFAULT '{}',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "etablissement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "utilisateur" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(20),
    "role" "role_utilisateur" NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "derniere_connexion" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "profession" VARCHAR(100),

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eleve" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "classe_id" UUID,
    "parent_id" UUID,
    "matricule" VARCHAR(50) NOT NULL,
    "date_naissance" DATE,
    "lieu_naissance" VARCHAR(255),
    "sexe" "sexe",
    "statut_inscription" "statut_inscription" NOT NULL DEFAULT 'EN_ATTENTE',

    CONSTRAINT "eleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pointage" (
    "id" UUID NOT NULL,
    "professeur_id" UUID NOT NULL,
    "date_pointage" DATE NOT NULL,
    "heure_arrivee" TIME,
    "heure_depart" TIME,
    "statut" "statut_pointage" NOT NULL DEFAULT 'PRESENT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pointage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "niveau" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "cycle" VARCHAR(50),
    "ordre" INTEGER,

    CONSTRAINT "niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classe" (
    "id" UUID NOT NULL,
    "niveau_id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "annee_scolaire" VARCHAR(20) NOT NULL,
    "effectif" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matiere" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "coefficient" DECIMAL(4,2) NOT NULL DEFAULT 1.00,

    CONSTRAINT "matiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professeur_matiere" (
    "id" UUID NOT NULL,
    "professeur_id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,

    CONSTRAINT "professeur_matiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emploi_du_temps" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "classe_id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,
    "professeur_id" UUID,
    "jour" "jour_semaine" NOT NULL,
    "heure_debut" TIME NOT NULL,
    "heure_fin" TIME NOT NULL,
    "salle" VARCHAR(50),

    CONSTRAINT "emploi_du_temps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fourniture" (
    "id" UUID NOT NULL,
    "niveau_id" UUID NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,

    CONSTRAINT "fourniture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cours" (
    "id" UUID NOT NULL,
    "professeur_id" UUID NOT NULL,
    "classe_id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "contenu" TEXT,
    "type" "type_cours" NOT NULL DEFAULT 'COURS',
    "date_publication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cours_media" (
    "id" UUID NOT NULL,
    "cours_id" UUID NOT NULL,
    "nom_fichier" VARCHAR(255) NOT NULL,
    "type" "type_media" NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "taille" BIGINT,

    CONSTRAINT "cours_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation" (
    "id" UUID NOT NULL,
    "matiere_id" UUID NOT NULL,
    "classe_id" UUID NOT NULL,
    "professeur_id" UUID NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "type" "type_evaluation" NOT NULL,
    "coefficient" DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    "periode" "periode" NOT NULL,
    "numero_periode" INTEGER NOT NULL,
    "date_evaluation" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" UUID NOT NULL,
    "evaluation_id" UUID NOT NULL,
    "eleve_id" UUID NOT NULL,
    "valeur" DECIMAL(5,2) NOT NULL,
    "appreciation" VARCHAR(500),
    "date_saisie" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saisie_par" UUID,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulletin" (
    "id" UUID NOT NULL,
    "eleve_id" UUID NOT NULL,
    "periode" "periode" NOT NULL,
    "numero_periode" INTEGER NOT NULL,
    "annee_scolaire" VARCHAR(20) NOT NULL,
    "moyenne_generale" DECIMAL(5,2),
    "rang" INTEGER,
    "mention" VARCHAR(50),
    "date_generation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fichier_pdf" VARCHAR(500),

    CONSTRAINT "bulletin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bulletin_detail" (
    "id" UUID NOT NULL,
    "bulletin_id" UUID NOT NULL,
    "note_id" UUID NOT NULL,
    "moyenne_matiere" DECIMAL(5,2),
    "coefficient" DECIMAL(4,2),

    CONSTRAINT "bulletin_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_financiere" (
    "id" UUID NOT NULL,
    "eleve_id" UUID NOT NULL,
    "type" "type_transaction" NOT NULL,
    "montant" DECIMAL(12,2) NOT NULL,
    "mode" "mode_paiement" NOT NULL,
    "reference_transaction" VARCHAR(100),
    "statut" "statut_paiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "date_paiement" TIMESTAMP(3),
    "date_validation" TIMESTAMP(3),
    "valide_par" UUID,
    "fichier_facture_pdf" VARCHAR(500),
    "annee_scolaire_reinscription" VARCHAR(20),

    CONSTRAINT "transaction_financiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametre_notation" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "type_etablissement" "type_etablissement" NOT NULL,
    "mode" "mode_notation" NOT NULL DEFAULT 'DEFAUT',
    "regle_calcul" JSONB DEFAULT '{}',
    "seuil_rattrapage" DECIMAL(5,2) DEFAULT 10.00,

    CONSTRAINT "parametre_notation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "type" "type_communication" NOT NULL,
    "sous_type" "sous_type_communication" NOT NULL DEFAULT 'GENERALE',
    "titre" VARCHAR(255) NOT NULL,
    "contenu" TEXT,
    "date_publication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publie_par" UUID,
    "visible_public" BOOLEAN NOT NULL DEFAULT false,
    "destinataire_id" UUID,
    "lu" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion" (
    "id" UUID NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "type" "type_discussion" NOT NULL,
    "reference_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_membre" (
    "id" UUID NOT NULL,
    "discussion_id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "date_join" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "discussion_id" UUID NOT NULL,
    "expediteur_id" UUID NOT NULL,
    "contenu" TEXT NOT NULL,
    "date_envoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fichier_joint" VARCHAR(500),

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_evenement" (
    "id" UUID NOT NULL,
    "etablissement_id" UUID NOT NULL,
    "nom" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "type_activite" NOT NULL,
    "date_debut" TIMESTAMP(3),
    "date_fin" TIMESTAMP(3),
    "lieu" VARCHAR(255),
    "statut" "statut_evenement" NOT NULL DEFAULT 'EN_PREPARATION',
    "budget_estime" DECIMAL(12,2),
    "responsable_id" UUID,

    CONSTRAINT "club_evenement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activite" (
    "id" UUID NOT NULL,
    "club_evenement_id" UUID NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "date_activite" TIMESTAMP(3) NOT NULL,
    "lieu" VARCHAR(255),

    CONSTRAINT "activite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_evenement_membre" (
    "id" UUID NOT NULL,
    "club_evenement_id" UUID NOT NULL,
    "eleve_id" UUID NOT NULL,
    "role" "role_membre" NOT NULL DEFAULT 'MEMBRE',
    "date_adhesion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_evenement_membre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_evenement_organisateur" (
    "id" UUID NOT NULL,
    "club_evenement_id" UUID NOT NULL,
    "utilisateur_id" UUID NOT NULL,
    "role" VARCHAR(100),

    CONSTRAINT "club_evenement_organisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "utilisateur_id" UUID,
    "action" VARCHAR(100) NOT NULL,
    "entite" VARCHAR(50) NOT NULL,
    "entite_id" UUID,
    "ancienne_valeur" JSONB,
    "nouvelle_valeur" JSONB,
    "ip_adresse" VARCHAR(45),
    "date_action" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "etablissement_email_key" ON "etablissement"("email");

-- CreateIndex
CREATE INDEX "idx_utilisateur_etablissement" ON "utilisateur"("etablissement_id");

-- CreateIndex
CREATE INDEX "idx_utilisateur_role" ON "utilisateur"("role");

-- CreateIndex
CREATE UNIQUE INDEX "utilisateur_etablissement_id_email_key" ON "utilisateur"("etablissement_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "parent_utilisateur_id_key" ON "parent"("utilisateur_id");

-- CreateIndex
CREATE UNIQUE INDEX "eleve_utilisateur_id_key" ON "eleve"("utilisateur_id");

-- CreateIndex
CREATE INDEX "idx_eleve_classe" ON "eleve"("classe_id");

-- CreateIndex
CREATE INDEX "idx_eleve_parent" ON "eleve"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "niveau_etablissement_id_nom_key" ON "niveau"("etablissement_id", "nom");

-- CreateIndex
CREATE UNIQUE INDEX "matiere_etablissement_id_code_key" ON "matiere"("etablissement_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "professeur_matiere_professeur_id_matiere_id_key" ON "professeur_matiere"("professeur_id", "matiere_id");

-- CreateIndex
CREATE INDEX "idx_note_eleve" ON "note"("eleve_id");

-- CreateIndex
CREATE INDEX "idx_note_evaluation" ON "note"("evaluation_id");

-- CreateIndex
CREATE UNIQUE INDEX "note_evaluation_id_eleve_id_key" ON "note"("evaluation_id", "eleve_id");

-- CreateIndex
CREATE INDEX "idx_bulletin_eleve" ON "bulletin"("eleve_id");

-- CreateIndex
CREATE UNIQUE INDEX "bulletin_eleve_id_periode_numero_periode_annee_scolaire_key" ON "bulletin"("eleve_id", "periode", "numero_periode", "annee_scolaire");

-- CreateIndex
CREATE UNIQUE INDEX "bulletin_detail_bulletin_id_note_id_key" ON "bulletin_detail"("bulletin_id", "note_id");

-- CreateIndex
CREATE INDEX "idx_transaction_eleve" ON "transaction_financiere"("eleve_id");

-- CreateIndex
CREATE INDEX "idx_transaction_statut" ON "transaction_financiere"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "parametre_notation_etablissement_id_key" ON "parametre_notation"("etablissement_id");

-- CreateIndex
CREATE INDEX "idx_communication_destinataire" ON "communication"("destinataire_id");

-- CreateIndex
CREATE INDEX "idx_communication_visible" ON "communication"("visible_public", "etablissement_id");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_membre_discussion_id_utilisateur_id_key" ON "discussion_membre"("discussion_id", "utilisateur_id");

-- CreateIndex
CREATE INDEX "idx_message_discussion" ON "message"("discussion_id");

-- CreateIndex
CREATE INDEX "idx_activite_club" ON "activite"("club_evenement_id");

-- CreateIndex
CREATE UNIQUE INDEX "club_evenement_membre_club_evenement_id_eleve_id_key" ON "club_evenement_membre"("club_evenement_id", "eleve_id");

-- CreateIndex
CREATE UNIQUE INDEX "club_evenement_organisateur_club_evenement_id_utilisateur_i_key" ON "club_evenement_organisateur"("club_evenement_id", "utilisateur_id");

-- CreateIndex
CREATE INDEX "idx_audit_log_entite" ON "audit_log"("entite", "entite_id");

-- CreateIndex
CREATE INDEX "idx_audit_log_date" ON "audit_log"("date_action");

-- AddForeignKey
ALTER TABLE "utilisateur" ADD CONSTRAINT "utilisateur_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eleve" ADD CONSTRAINT "eleve_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pointage" ADD CONSTRAINT "pointage_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "niveau" ADD CONSTRAINT "niveau_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classe" ADD CONSTRAINT "classe_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "niveau"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matiere" ADD CONSTRAINT "matiere_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professeur_matiere" ADD CONSTRAINT "professeur_matiere_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professeur_matiere" ADD CONSTRAINT "professeur_matiere_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_du_temps" ADD CONSTRAINT "emploi_du_temps_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_du_temps" ADD CONSTRAINT "emploi_du_temps_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_du_temps" ADD CONSTRAINT "emploi_du_temps_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emploi_du_temps" ADD CONSTRAINT "emploi_du_temps_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fourniture" ADD CONSTRAINT "fourniture_niveau_id_fkey" FOREIGN KEY ("niveau_id") REFERENCES "niveau"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours_media" ADD CONSTRAINT "cours_media_cours_id_fkey" FOREIGN KEY ("cours_id") REFERENCES "cours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_matiere_id_fkey" FOREIGN KEY ("matiere_id") REFERENCES "matiere"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation" ADD CONSTRAINT "evaluation_professeur_id_fkey" FOREIGN KEY ("professeur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_saisie_par_fkey" FOREIGN KEY ("saisie_par") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin" ADD CONSTRAINT "bulletin_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin_detail" ADD CONSTRAINT "bulletin_detail_bulletin_id_fkey" FOREIGN KEY ("bulletin_id") REFERENCES "bulletin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulletin_detail" ADD CONSTRAINT "bulletin_detail_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_financiere" ADD CONSTRAINT "transaction_financiere_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_financiere" ADD CONSTRAINT "transaction_financiere_valide_par_fkey" FOREIGN KEY ("valide_par") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parametre_notation" ADD CONSTRAINT "parametre_notation_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication" ADD CONSTRAINT "communication_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication" ADD CONSTRAINT "communication_publie_par_fkey" FOREIGN KEY ("publie_par") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication" ADD CONSTRAINT "communication_destinataire_id_fkey" FOREIGN KEY ("destinataire_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_membre" ADD CONSTRAINT "discussion_membre_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discussion_membre" ADD CONSTRAINT "discussion_membre_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_discussion_id_fkey" FOREIGN KEY ("discussion_id") REFERENCES "discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_expediteur_id_fkey" FOREIGN KEY ("expediteur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement" ADD CONSTRAINT "club_evenement_etablissement_id_fkey" FOREIGN KEY ("etablissement_id") REFERENCES "etablissement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement" ADD CONSTRAINT "club_evenement_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activite" ADD CONSTRAINT "activite_club_evenement_id_fkey" FOREIGN KEY ("club_evenement_id") REFERENCES "club_evenement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement_membre" ADD CONSTRAINT "club_evenement_membre_club_evenement_id_fkey" FOREIGN KEY ("club_evenement_id") REFERENCES "club_evenement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement_membre" ADD CONSTRAINT "club_evenement_membre_eleve_id_fkey" FOREIGN KEY ("eleve_id") REFERENCES "eleve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement_organisateur" ADD CONSTRAINT "club_evenement_organisateur_club_evenement_id_fkey" FOREIGN KEY ("club_evenement_id") REFERENCES "club_evenement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_evenement_organisateur" ADD CONSTRAINT "club_evenement_organisateur_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_utilisateur_id_fkey" FOREIGN KEY ("utilisateur_id") REFERENCES "utilisateur"("id") ON DELETE SET NULL ON UPDATE CASCADE;
