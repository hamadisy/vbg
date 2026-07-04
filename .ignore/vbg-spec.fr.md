# Présentation de la version initiale de l´application VBG

Une **application web responsive** permettant le signalement et le suivi des cas de **Violences Basées sur le Genre (VBG)**.
Les principaux utilisateurs sont les **relais communautaires**, qui doivent pouvoir déclarer un cas de manière simple et rapide. L'application est destinée uniquement au **signalement, au référencement et au suivi** des cas.
Application Web Responsive (Compatible Desktop, Tablette et Smartphone)

---

# Modules principaux

## 1. Authentification

### Connections

- Username
- Password
- Gestion des accès selon les rôles

### Protection des données

- Relais communautaire: Accès uniquement à ses propres cas
- Direction Régionale: Accès à tous les cas de sa région
- Administrateur: Accès à l'ensemble des cas

---

## 2. Nouveau cas

Saisie du dossier étape par étape :

1. Type de violence (grands pictogrammes)
2. Lieu
3. Date & Heure
4. Situation de la victime
5. Mesures prises
6. Structure de référencement
7. Enregistrer

---

## 3. Gestion des cas

- Liste des cas autorisés
- Filtres
- Recherche
- Consultation des détails
- Mise à jour du statut
- Historique du suivi

---

## 4. Notifications automatiques

Lorsqu'un cas est enregistré :

- Le cas apparaît immédiatement dans le tableau de bord.
- Une notification automatique est envoyée par SMS et/ou WhatsApp aux destinataires configurés.
- Les destinataires peuvent être définis selon la région ou toute autre configuration.

---

## 5. Tableau de bord

### Statistiques générales

- Nombre total de cas
- Cas par région
- Cas par type de violence

### Pictogrammes

Élément essentiel de l'expérience utilisateur.
Les utilisatrices sélectionneront principalement le type de violence à l'aide de grandes illustrations ou pictogrammes.
L'interface devra rester simple et intuitive afin de faciliter son utilisation par des personnes ayant un faible niveau d'alphabétisation.

---

# Gestion des langues

Langues prévues pour la première version :

- Français
- Arabe

Tous les textes de l'application seront gérés via un système d'internationalisation (i18n) afin de permettre l'ajout d'autres langues ultérieurement.

---

# Rôles des utilisateurs

## Relais communautaire

- Connexion
- Créer un nouveau cas
- Consulter ses propres cas
- Modifier ses propres cas (optionnel jusqu'au début du traitement)
- Consulter le statut du dossier

---

## Direction Régionale

- Consulter tous les cas de sa région
- Mettre à jour le statut d'un cas
- Ajouter des commentaires de suivi
- Accéder au tableau de bord régional

---

## Administrateur

- Consulter tous les cas
- Gérer les utilisateurs
- Gérer les régions
- Gérer les types de violence
- Gérer les structures de référencement
- Accéder au tableau de bord global
- Configurer les destinataires des notifications SMS / WhatsApp

---

# Modèle de données

## User

- Name
- Username
- Password
- Role
- Region
- Language

---

## Case

- ID
- Created by
- Date & Time
- Location
- Type of violence
- Description
- Victim's situation
- Measures taken
- Referral structure
- Status
- Follow-up history

---

## Violence Categories

Données de référence (multilingues)

Exemples :

- Physical violence
- Sexual violence
- Psychological violence
- Economic violence
- Female Genital Mutilation (FGM)
- Sexual harassment
- Other

---

## Regions

- Region
- Municipality
- Village (optional)

---

## Referral Structures

- Police
- Gendarmerie
- Social Services
- Health Center

---

# Proposition technique (optional)

- Repository: Github
- Frontend: React
- Backend: NestJS
- Base de données: PostgreSQL
- Authentification: JWT, Username & Password
- Hebergement:
  - Serveur VPS Linux à faible coût (ex. Hetzner)
  - Nginx
  - Domain name at: namecheap.com

---

# Hors périmètre du MVP

- Pas de fonctionnement hors ligne (Offline)
- Pas de téléchargement de photos
- Pas de géolocalisation GPS
- Pas d'export des données
- Pas d'application mobile native
- Aucune application mobile native (Android/iOS)
- Aucune fonctionnalité hors ligne (Offline)
- Aucune infrastructure Kubernetes ou Cloud n'est nécessaire pour la première version.
- Évolutions futures statistiques:
  - Cas par période
  - Cas par statut
  - Évolution mensuelle

---
