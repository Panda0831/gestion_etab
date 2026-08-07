BACKEND
    Installer le CLI NestJS (global)
        npm install -g @nestjs/cli
        nest --version

    Creer le projet
        nest new backend

    Lancer 
        cd backend
        npm run start:dev

    Creation des modules 
        nest g resource nom_module


    nest g resource modules/pkg_utilisateurs/Utilisateur
    nest g resource modules/pkg_utilisateurs/Parent
    nest g resource modules/pkg_utilisateurs/Eleve
    nest g resource modules/pkg_utilisateurs/Pointage

    nest g resource modules/pkg_structure_scolaire/Etablissement
    nest g resource modules/pkg_structure_scolaire/Niveau
    nest g resource modules/pkg_structure_scolaire/Classe
    nest g resource modules/pkg_structure_scolaire/Matiere
    nest g resource modules/pkg_structure_scolaire/ProfesseurMatiere
    nest g resource modules/pkg_structure_scolaire/EmploiDuTemps

    nest g resource modules/pkg_pedagogie/Cours
    nest g resource modules/pkg_pedagogie/CoursMedia
    nest g resource modules/pkg_pedagogie/Evaluation
    nest g resource modules/pkg_pedagogie/Note
    nest g resource modules/pkg_pedagogie/Bulletin
    nest g resource modules/pkg_pedagogie/BulletinDetail
    nest g resource modules/pkg_pedagogie/ParametreNotation

    nest g resource modules/pkg_communication/Communication 
    nest g resource modules/pkg_communication/Discussion 
    nest g resource modules/pkg_communication/DiscussionMembre
    nest g resource modules/pkg_communication/Message
    nest g resource modules/pkg_communication/Fourniture 

    nest g resource modules/pkg_clubs_evenements/ClubEvenement
    nest g resource modules/pkg_clubs_evenements/Activite
    nest g resource modules/pkg_clubs_evenements/ClubEvenementMembre
    nest g resource modules/pkg_clubs_evenements/ClubEvenementOrganisateur

    nest g resource modules/pkg_paiement/TransactionFinanciere

    nest g resource modules/pkg_persistence/AuditLog

    nest g resource modules/pkg_integration_externe/API_MVola
    nest g resource modules/pkg_integration_externe/API_Orange_Money
    nest g resource modules/pkg_integration_externe/Service_Email
    nest g resource modules/pkg_integration_externe/Service_MinIO_S3

    Creation du module Prisma dans nestJS
        nest g module prisma
        nest g service prisma