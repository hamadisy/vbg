I want to create a web app for an organisation called CSVVDH with the following requirements.
Do you have any questions or improvement suggestions?

# Project Overview

A **responsive web application** for reporting and tracking **Gender-Based Violence (in french VBG: violence basées sur le genre)** cases.

The target users are community focal points (community relays), who need to report cases as simply and quickly as possible. The application's purpose is limited to **case reporting, referral, and monitoring**.

---

# Main Modules

## 1. Authentication

### Connection

- Username & Password
- Password reset via email (reset link, expiring token)

### Data Privacy & Access Control

- Role-based access control
- Community Relay: Can only access their own cases
- Regional Director: Can access all cases within their assigned region
- Institutional User: Can view all cases (read-only), view statistics, and acknowledge individual cases
- Administrator: Can access all cases

---

## 2. New Case

Step-by-step reporting process

1. Type of violence (large pictograms)
2. Location
3. Date & Time
4. Victim's situation
5. Measures taken
6. Referral structure
7. Save

---

## 3. Case Management

- List of authorized cases
- Filters
- Search
- Case details
- Status updates
- Follow-up history
- Audit log (records who viewed/created/updated a case, and when)

---

## 4. Automatic Notifications

When a case is submitted:

- The case immediately appears on the dashboard
- Automatic SMS notification is sent to configured recipients
- Recipients can be configured based on region or other criteria

---

## 5. Dashboard

### General Statistics

- Total number of cases
- Cases by region and type of violence
- Cases by type of violence

### Pictograms

A key usability feature. Users primarily select the type of violence by clicking on large illustrations or pictograms.
The interface should remain intuitive for users with limited literacy.

---

# Multilingual Support

Texts should be managed through an internationalization (i18n) system (translation keys, no hardcoded language list), allowing additional languages to be added later without code changes.
Initial languages:

- French (Default)
- Arabic
- Pulaar
- Wolof
- Soninké
- English (for administrators/technical partners)

---

# User Roles

## Community Relay

- Login
- Create a new case
- View own cases
- Edit own cases (allowed once status reaches Acknowledged; locked once Closed)
- View case status
- Access own dashboard / statistics (own cases only)

---

## Regional Director

- View all cases within their region
- Update case status
- Add follow-up comments
- Access regional dashboard

---

## Institutional User

- Login
- View all cases (all regions, read-only)
- Access global dashboard / statistics
- Acknowledge individual cases (status: New → Acknowledged)

---

## Administrator

- View all cases
- Manage users
- Manage regions
- Manage violence categories
- Manage referral structures
- Access global dashboard
- Configure notification type and recipients (in MVP only SMS. Later WhatsApp & Mail)

---

# Data Model

## User

- Full Name
- Username
- Password
- Phone number
- Mail
- Role
- Region
- Language

---

## Case

- ID
- Created by
- Creation Date & Time
- Last Update Date & Time
- Location
- Type of violence
- Description
- Victim (see Victim sub-model)
- Measures taken
- Referral structure
- Status (see Case Status)
- Follow-up history (see Follow-up Entry)

---

## Case Status

- New
- Acknowledged
- InProcess
- Closed

---

## Follow-up Entry

Each entry in a Case's follow-up history. Distinct from Case Status (system workflow stage): Outcome is the qualitative result recorded by whoever is following up.

- Author (User)
- Timestamp
- Comment
- Outcome (Community resolution / Referred to justice / Case in process / Other)

---

## Victim

Linked 1:1 to Case. Identity kept minimal to protect the survivor.

### Identity

- Victim ID (system generated)
- Alias / Initials (optional, no full legal name stored by default)
- Age range (<12, 12-17, 18-25, 26-40, 41-60, 60+)
- Sex (Female / Male / Other)
- Contact phone (optional, only if victim consents to follow-up)

### Situation

- Relationship to perpetrator (Family member, Intimate partner, Acquaintance, Stranger, Authority figure, Other)
- Perpetrator known to victim (Yes/No)
- Cohabiting with perpetrator (Yes/No)
- Vulnerability factors (multi-select: Minor, Disability, Pregnant, Displaced/Refugee, Other)
- Immediate safety risk (Low/Medium/High)

---

## Violence Categories

Master data (multilingual), managed by Administrator (initial seed list below, editable/extendable without code changes)

- Physical violence
- Sexual violence
- Psychological / verbal violence
- Economic violence
- Denial of access to land or economic resources
- Denial of children's access to education (due to lack of civil registration)
- Confiscation of children's civil status documents (family conflict / divorce)
- Child abandonment / refusal of paternal care
- Refusal of divorce or other family coercion
- Female Genital Mutilation (FGM)
- Sexual harassment (workplace / school)
- Other

---

## Regions

- Region
- Municipality
- Village (optional)

Initial seed data (3 regions, each with their communes):

- **Nouakchott**: Nord, Est, Sud
- **Brakna**: Boghé, Dar el Avia, Dar el Barka, o Birom, Bababé, El Vorh, Aéré Mbar, Aleg, Bouhdida
- **Gorgol**: Kaédi, Djéwol, Belinabé Talhaya

---

## Referral Structures

Master data, per region. Each entry has a Type plus a specific named contact so notifications can be routed correctly.

- Type: Police / Gendarmerie / Social Services / Health Center
- Name (specific organization or contact, e.g. "MASEF - Regional Representative", "Medicus Mundi", "CSVVDH Regional Social Worker")
- Region (link to Regions)
- Contact phone / email (used for notification routing)

---

## Audit Log

- ID
- User (who performed the action)
- Action (Create, View, Update, StatusChange, Delete)
- Entity type (Case, User, etc.)
- Entity ID
- Timestamp
- Details (optional, e.g. old value → new value)

---

# Data Retention Policy

- Admin-configurable retention period, in minutes, counted from the moment a case reaches "Closed"
- After the retention period elapses, case and victim data is automatically deleted (or anonymized)
- Default: no auto-deletion until an Admin sets a value (0/empty = keep indefinitely)

---

# Technology Stack

- Repository: https://github.com/hamadisy/vbg
- Build Pipeline: Github Actions
- Environments: Dev & Prod using Docker
- Frontend: React, TypeScript
  - Responsive Web App (Desktop, Tablet, and Smartphone compatible)
  - Use Material UI & TailwindCss for styling
  - use i18n files for different languages
  - RTL layout support for Arabic (MUI stylis-plugin-rtl + Tailwind logical properties)
  - Logo & Favicon of organisation "CSVVDH" creating the app in folder ../img: csvvdh-logo.png & csvvdh-favicon.PNG
  - examples of pictograms to use for violance types in folger ../img: violence-types.png
  - Colors: Green, Yellow, White
- Backend: NestJS + TypeORM + REST + OpenAPI
  - use Repository Pattern to easily change DB Type later
  - use Boundary, Control, Entity structure code
  - prepare many notification providers (in this MVP version only SMS. Later Whatsapp)
  - SMS provider: Vonage (Nexmo) — pay-as-you-go, no monthly minimum, alphanumeric sender ID avoids number-rental cost, simple REST/Node SDK, testable from any location incl. Germany/France; verify Mauritania (+222) rate & deliverability during pilot, fallback: MessageBird
- Database: SQLLite (because max 500 Users and 20 new cases per day)
- Auth: JWT, Username & Password
- Hosting:
  - Strato VPS
  - Domain: https://vbg.hsy-stems.com
  - Nginx
  - Docker Compose
  - Daily cron job backing up the SQLite DB file (to a separate volume/off-box storage)

---

# Out of Scope for this MVP Version

- No offline support
- No photo uploads
- No GPS location
- No data export
- No native mobile application
- No Kubernetes or cloud infrastructure is required for the initial version.
- No native Android/iOS application
- No offline functionality
- Statistics Future enhancements:
  - Cases by date range
  - Cases by status
  - Monthly trends
