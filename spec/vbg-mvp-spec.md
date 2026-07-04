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

### Data Privacy & Access Control

- Role-based access control
- Community Relay: Can only access their own cases
- Regional Director: Can access all cases within their assigned region
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

Texts should be managed through an internationalization (i18n) system, allowing additional languages to be added in the future.
Initial languages:

- French (Default)
- English
- Arabic

---

# User Roles

## Community Relay

- Login
- Create a new case
- View own cases
- Edit own cases (optional until processing begins)
- View case status

---

## Regional Director

- View all cases within their region
- Update case status
- Add follow-up comments
- Access regional dashboard

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
- Victim's situation
- Measures taken
- Referral structure
- Status
- Follow-up history

---

## Violence Categories

Master data (multilingual)

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

# Technology Stack

- Repository: https://github.com/hamadisy/vbg
- Build Pipeline: Github Actions
- Environments: Dev & Prod using Docker
- Frontend: React, TypeScript
  - Responsive Web App (Desktop, Tablet, and Smartphone compatible)
  - Use Material UI & TailwindCss for styling
  - use i18n files for different languages
  - Logo & Favicon of organisation "CSVVDH" creating the app in folder ../img: csvvdh-logo.png & csvvdh-favicon.PNG
  - examples of pictograms to use for violance types in folger ../img: violence-types.png
  - Colors: Green, Yellow, White
- Backend: NestJS + TypeORM + REST + OpenAPI
  - use Repository Pattern to easily change DB Type later
  - use Boundary, Control, Entity structure code
  - prepare many notification providers (in this MVP version only SMS. Later Whatsapp)
- Database: SQLLite (because max 500 Users and 20 new cases per day)
- Auth: JWT, Username & Password
- Hosting:
  - Strato VPS
  - Domain: https://vbg.hsy-stems.com
  - Nginx
  - Docker Compose

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
