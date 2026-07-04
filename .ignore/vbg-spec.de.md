# VBG Projektübersicht

Eine **responsive Web-App** zur Meldung und Nachverfolgung von Fällen geschlechtsspezifischer Gewalt (VBG).

Zielgruppe sind Community-Relais, die Fälle möglichst einfach erfassen. Die Anwendung dient ausschließlich der Meldung, Weiterleitung und dem Monitoring der Fälle.

---

# Plattform

- Responsive Web-App (Desktop, Tablet & Smartphone)

---

# Benutzerrollen

## Community-Relais

- Login
- Neuen Fall erfassen
- Eigene Fälle anzeigen
- Eigene Fälle bearbeiten (optional bis zur Bearbeitung)
- Status einsehen

---

## Regional Direction

- Alle Fälle der eigenen Region sehen
- Status aktualisieren
- Kommentare hinzufügen
- Dashboard der eigenen Region

---

## Administrator

- Alle Fälle sehen
- Benutzer verwalten
- Regionen verwalten
- Gewaltarten verwalten
- Referenzstellen verwalten
- Dashboard mit allen Statistiken
- Empfänger für SMS/WhatsApp konfigurieren

---

# Datenmodell

## Benutzer

- Name
- Benutzername
- Passwort
- Rolle
- Region
- Sprache

---

## Fall

- ID
- Ersteller
- Datum/Uhrzeit
- Ort
- Gewaltart
- Beschreibung
- Situation des Opfers
- Eingeleitete Maßnahmen
- Referenzstelle
- Status
- Verlauf / Follow-up

---

## Gewaltarten

Stammdaten (mehrsprachig)

Beispiele:

- Physische Gewalt
- Sexuelle Gewalt
- Psychische Gewalt
- Wirtschaftliche Gewalt
- FGM
- Belästigung
- Sonstige

---

## Regionen

- Region
- Gemeinde
- Dorf (optional)

---

## Referenzstellen

- Polizei
- Gendarmerie
- Sozialdienst
- Gesundheitszentrum

---

# Hauptmodule

## 1. Authentifizierung

- Benutzername
- Passwort
- Rollenbasierte Berechtigungen

---

## 2. Neuer Fall

Schrittweise Erfassung

1. Gewaltart (große Piktogramme)
2. Ort
3. Datum/Uhrzeit
4. Situation des Opfers
5. Maßnahmen
6. Referenzstelle
7. Speichern

---

## 3. Fallverwaltung

- Liste aller berechtigten Fälle
- Filter
- Suche
- Detailansicht
- Statusänderung
- Verlauf

---

## 4. Automatische Benachrichtigung

Beim Speichern eines Falls:

- Eintrag erscheint sofort im Dashboard
- Automatische SMS und/oder WhatsApp an konfigurierte Empfänger
- Empfänger abhängig von Region oder Konfiguration

---

## 5. Dashboard

### Allgemeine Kennzahlen

- Gesamtanzahl Fälle
- Fälle pro Region
- Fälle pro Gewaltart

---

# Mehrsprachigkeit

Vorerst

- Französisch
- Arabisch

Alle Texte über ein Internationalisierungssystem (i18n), damit später weitere Sprachen ergänzt werden können.

---

# Piktogramme

Sehr wichtig.

Die Auswahl der Gewaltart erfolgt hauptsächlich über große Illustrationen bzw. Piktogramme.

Die Anwendung soll auch für wenig alphabetisierte Nutzerinnen einfach bedienbar sein.

---

# Datenschutz

Community-Relais

- sehen nur eigene Fälle

Regional Direction

- sieht alle Fälle der eigenen Region

Administrator

- sieht alle Fälle

---

# Technischer Vorschlag

## Frontend

- React
- TypeScript
- Material UI

---

## Backend

- NestJS

---

## Datenbank

- PostgreSQL

---

## Authentifizierung

- JWT
- Passwort-Login

---

## Hosting

Für den MVP:

- Günstiger Linux-VPS (z. B. Hetzner)
- Docker Compose
- Nginx
- PostgreSQL

---

# Nicht Bestandteil des MVP

- Keine Offline-Unterstützung
- Keine Bilder
- Kein GPS
- Kein Datenexport
- Keine native Mobile-App
- Keine native Android/iOS-App
- Kein Kubernetes oder Cloud-Setup notwendig.
- Statistiken Erweiterungen:
  - Fälle nach Zeitraum
  - Fälle nach Status
  - Entwicklung pro Monat

---

# Geschätzter Entwicklungsaufwand (MVP)

| Modul                          |  Aufwand |
| ------------------------------ | -------: |
| Architektur & Setup            |     2 PT |
| Backend                        |  8–10 PT |
| Responsive Web-Frontend        | 12–15 PT |
| Dashboard                      |   4–5 PT |
| Adminbereich                   |   5–6 PT |
| Mehrsprachigkeit               |     2 PT |
| SMS-/WhatsApp-Benachrichtigung |   3–5 PT |
| Tests & Deployment             |   3–4 PT |

**Gesamt: ca. 39–49 Personentage.**

## Einschätzung

Das Projekt ist ein **klassisches CRUD-/Workflow-System** mit Dashboard und Benachrichtigungen. Es ist technisch gut beherrschbar und weist keine außergewöhnlich hohe Komplexität auf.

Der größte Unsicherheitsfaktor ist **nicht die Entwicklung**, sondern die Integration der SMS-/WhatsApp-Benachrichtigungen. Hier muss vorab geklärt werden, über welchen Anbieter (z. B. API-Dienst) Nachrichten versendet werden und ob WhatsApp Business genutzt werden soll. Sobald diese Entscheidung getroffen ist, ist der restliche Funktionsumfang gut planbar.
