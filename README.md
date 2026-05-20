# Projektdokumentation – Bet & Brag

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)

---

## 1. Ausgangslage

- **Problem:** In Freundesgruppen (Fussballclub, Gym, Arbeitsumfeld) werden Sportergebnisse regelmässig informell gewettet. Bestehende Plattformen sind entweder mit echtem Geld verknüpft, was rechtliche Graubereiche erzeugt, oder sie sind zu komplex und mit Werbung überladen für kleine Privatgruppen. Eine einfache, soziale und rechtlich unbedenkliche Lösung fehlt.
- **Ziele:** Entwicklung einer webbasierten App, in der eine geschlossene Gruppe Tipps für Fussballspiele abgeben kann. Statt echtem Geld wird eine Fantasiewährung («Brag-Points») eingesetzt. Im Vordergrund steht der soziale Wettbewerb und das «Bragging Right» – das Recht zum Angeben.
- **Primäre Zielgruppe:** Sportbegeisterte Freunde und Teamkollegen im Alter von 18–35 Jahren, die regelmässig Fussball schauen und sich untereinander messen wollen.

---

## 2. Lösungsidee

- **Kernfunktionalität:**
  - **Tipp abgeben (Hauptworkflow):** Nutzer wählt ein Spiel aus, gibt ein Resultat ein und speichert es in der Datenbank.
  - **Rangliste ansehen:** Dynamische Tabelle mit Punktestand, Spieltagssieger und Trend-Indikatoren (↑ ↓).
  - **Spieltag-Übersicht:** Alle Spiele der Woche auf einen Blick, mit Status (Offen / Live / Beendet).
- **Abgrenzung:** Kein echtes Geld, keine externe API-Anbindung für Live-Ergebnisse (Daten werden manuell gepflegt). Kein Login-System – Nutzer geben ihren Namen direkt bei der Tipp-Abgabe ein.

---

## 3. Vorgehen & Artefakte

### 3.1 Understand & Define

**Problemräume:**
Bestehende Tipp-Plattformen sind für private Gruppen zu komplex oder auf kommerzielles Glücksspiel ausgelegt. Es fehlt eine minimalistische Lösung für den rein sozialen Wettbewerb.

**Nutzer / Bedürfnisse / Kontext:**
- Nutzer sind Fussballfans in privaten Gruppen (Freunde, Arbeitskollegen, Vereinsmitglieder).
- Bedürfnis: Schnelle Tipp-Abgabe (< 10 Sekunden), sofortiger Überblick über die Rangliste.
- Kontext: Mobil, spontan, kurz vor oder während Spieltagen.

**How Might We (HMW):**
- HMW… eine Tipp-App gestalten, die durch eine Fantasiewährung denselben Nervenkitzel wie echte Einsätze bietet, ohne die Risiken von Glücksspiel?
- HMW… die Rangliste so visualisieren, dass der soziale Status («König der Woche») maximal hervorgehoben wird?
- HMW… die Tippabgabe so einfach gestalten, dass sie in weniger als 10 Sekunden abgeschlossen ist?

**Wesentliche Erkenntnisse:**
- Die Echtgeld-Problematik ist ein reales Hindernis – eine Fantasiewährung löst dies elegant.
- Nutzer wollen nicht nur Punkte sammeln, sondern auch den direkten Vergleich mit Freunden sehen.
- Mobile-First ist entscheidend, da die Nutzung meistens unterwegs stattfindet.

---

### 3.2 Sketch

**Variantenüberblick (Crazy 8s – Feature: Rangliste):**

Im Rahmen der Crazy 8s Methode wurden 8 verschiedene Varianten für die Ranglisten-Visualisierung erarbeitet:

1. Klassische Tabelle mit Rang, Name und Punkten
2. «Champions League»-Zonen (grün / gelb / rot)
3. **Man of the Matchday** – Spieltagssieger wird prominent hervorgehoben *(ausgewählt)*
4. Live-Trend-Indikatoren mit Pfeilen (↑ ↓) *(ausgewählt)*
5. Team-Wappen / Logo je Nutzer
6. Fortschrittsbalken auf einer «Rennstrecke»
7. Head-to-Head Vergleich *(als optionale Erweiterung)*
8. Fussball-Ränge statt Zahlen (z.B. «Kreisliga» bis «Weltklasse»)

**Peer-Feedback:**
Das Feedback aus der Kleingruppenrunde zeigte, dass die rein statische Tabelle (Variante 1) zu wenig Dynamik und Motivation erzeugt. Die Kombination aus Spieltagssieger-Hervorhebung und Live-Trends erhielt die meisten Punkte beim Dot-Voting.

---

### 3.3 Decide

**Gewählte Variante & Begründung:**
Kombination aus **Spieltagssieger (Man of the Matchday)** und **Live-Trend-Indikatoren**, mit optionaler Head-to-Head-Ansicht. Diese Kombination erfüllt das Kernbedürfnis «Bragging Rights» am stärksten: Der Spieltagssieger gibt jede Woche eine neue Chance auf Ruhm, die Trend-Pfeile erzeugen Dynamik während der laufenden Spiele.

**End-to-End-Ablauf (Hauptworkflow):**
1. Nutzer öffnet App → landet auf **Dashboard** (Home)
2. Klick auf «Tipp abgeben» oder Navigation zu **Spieltag**
3. Nutzer wählt ein offenes Spiel aus der **Spieltag-Übersicht**
4. Auf der **Tipp-Abgabe-Seite**: Resultat eingeben, Name angeben, «Speichern» klicken
5. Weiterleitung zur **Rangliste** → Nutzer sieht seine aktuelle Position und die Trend-Pfeile

**Mockup:**
Erstellt in Figma. Die vier Hauptscreens sind:
- **Dashboard:** Man of the Matchday, Ranglisten-Vorschau (Top 3), nächstes Spiel
- **Spieltag-Übersicht:** Liste aller Spiele mit Status (Offen / Live / Beendet)
- **Tipp-Abgabe:** Team-Logos, Eingabefelder für Tore, Brag-Points Einsatz, Speichern-Button
- **Rangliste:** Vollständige Tabelle mit Trend-Pfeilen, CL-Zonen, Spieltagssieger oben

---

### 3.4 Prototype

#### 3.4.1 Entwurf (Design)

**Informationsarchitektur:**

```
/ (Dashboard)
├── /spieltag (Spieltag-Übersicht)
│   └── /spieltag/[id] (Tipp-Abgabe für ein Spiel)
└── /rangliste (Rangliste)
```

Navigation via **Bottom Navigation Bar** (mobil-optimiert) mit drei Punkten: Home, Spieltag, Rangliste.

**User Interface Design:**
- Dunkles Farbschema (#0f172a Hintergrund, #4ade80 Akzentfarbe grün)
- Mobile-First Layout (max. 480px Breite, zentriert)
- Emoji-basierte Team-Logos als Platzhalter
- Klare Statusanzeigen: blau (Offen), rot blinkend (Live), grün (Beendet)

**Designentscheidungen:**
- **Dunkles Theme:** Passt zum sportlichen, gamifizierten Charakter der App; wirkt moderner als ein helles Design.
- **Bottom Navigation:** Daumen-freundlich auf dem Smartphone; die drei Hauptbereiche sind immer einen Tap entfernt.
- **Grüne Akzentfarbe:** Assoziiert mit Fussballrasen und Erfolg.

#### 3.4.2 Umsetzung (Technik)

- **Technologie-Stack:** SvelteKit 2.x (TypeScript), MongoDB (via offizieller Node.js Driver), adapter-netlify
- **Tooling:** VS Code, GitHub Copilot, MongoDB Atlas, Netlify
- **Struktur & Komponenten:**
  - `Nav.svelte` – Bottom Navigation Bar
  - `MatchCard.svelte` – Wiederverwendbare Spielkarte mit Status, Logos, Tipp-Button
  - `+page.server.ts` je Route für Server-Side-Rendering und DB-Abfragen
  - `src/lib/db.ts` – MongoDB Verbindung (Singleton-Pattern)
  - `src/lib/points.ts` – Punkteberechnung (3 Punkte exaktes Resultat, 1 Punkt korrekte Tendenz)
- **Daten & Schnittstellen:**
  - MongoDB Collections: `matches`, `tips`
  - API-Routen: `/api/tips` (POST/PUT), `/api/results` (PATCH für Admin)
  - Seed-Script (`seed.mjs`) für initiale Testdaten
- **Deployment:** [https://bet-and-brag.netlify.app](https://bet-and-brag.netlify.app)
- **Besondere Entscheidungen:** Kein Auth-System bewusst weggelassen, um den Mindestumfang zu fokussieren. Nutzername wird direkt bei der Tipp-Abgabe eingegeben.

---

### 3.5 Validate

**URL der getesteten Version:** [https://bet-and-brag.netlify.app](https://bet-and-brag.netlify.app)

---

**Ziele der Evaluation:**
1. Können Nutzer ohne Anleitung einen Tipp für ein Fussballspiel abgeben? (Hauptworkflow)
2. Ist die Rangliste verständlich und motivierend genug, um weiterzumachen?
3. Verstehen Nutzer sofort, was «Brag-Points» sind?
4. Ist die Navigation zwischen den drei Bereichen intuitiv?

---

**Vorgehen:** Moderiert, on-site. Testleiterin/Testleiter liest Szenarien mündlich vor und beobachtet, ohne einzugreifen. Testperson denkt laut. Feedback-Grid wird während dem Test ausgefüllt. Post-Test-Interview im Anschluss.

---

**Stichprobe:** 2 Testpersonen

| | Testperson 1 | Testperson 2 |
|---|---|---|
| **Name/Code** | Enis (TP-01) | Drin (TP-02) |
| **Profil** | Mann, 25 J., Fussball-Fan, tippt regelmässig bei Freunden | Mann, 24 J., wenig Erfahrung mit Tipp-Apps, spielt Padel |
| **Gerät** | Smartphone (iPhone) | Notebook (Chrome) |
| **Datum** | 20.05.2026 | 20.05.2026 |

---

**Aufgaben / Szenarien:**

---

> **Ausgangslage**
>
> *Sie sind Teil einer Freundesgruppe, die regelmässig Fussball schaut. Ihr Freund hat euch einen Link zu einer neuen App geschickt: https://bet-and-brag.netlify.app. Er meint, damit könnt ihr künftig eure Fussball-Tipps verwalten und sehen, wer von euch am besten tippt.*

**Aufgabe 1:**
*Sie möchten herausfinden, welche Spiele dieses Wochenende anstehen und ob einer eurer Freunde bereits getippt hat.*

**Aufgabe 2:**
*Sie möchten für das Spiel FCZ gegen FC Basel eine Einschätzung abgeben. Sie gehen davon aus, dass der FCZ mit 2:1 gewinnt.*

**Aufgabe 3:**
*Sie haben Ihren Tipp abgegeben und möchten wissen, auf welchem Platz Sie im Vergleich zu Ihren Freunden aktuell stehen.*

---

**Kennzahlen & Beobachtungen:**

| | **Aufgabe 1** (Spielübersicht) | **Aufgabe 2** (Tipp abgeben) | **Aufgabe 3** (Rangliste) |
|---|---|---|---|
| **Enis (TP-01)** | Findet Spieltag-Tab sofort via Bottom Nav (8 Sek.) ✅ | Gibt Tipp korrekt ein, zögert kurz bei Namensfeld («Muss ich mich anmelden?») ✅ | Findet Rangliste sofort, versteht Trend-Pfeile ✅ |
| **Drin (TP-02)** | Sucht zuerst auf der Startseite, findet Spieltag erst im zweiten Versuch (22 Sek.) ⚠️ | Gibt falsche Werte ein (vertauscht Heim/Auswärts), korrigiert sich selbst ⚠️ | Versteht «Man of the Matchday» nicht sofort, fragt nach ⚠️ |

**Feedback Grid – Enis (TP-01):**

| 😊 Was hat gut funktioniert / gefallen | 😞 Was hat nicht funktioniert / gestört |
|---|---|
| Navigation war sofort klar | Kein Hinweis, was «Brag-Points» bedeuten |
| Design wirkt modern und sportlich | Kein Feedback nach dem Speichern des Tipps |
| Trend-Pfeile in der Rangliste motivieren | Unklar, ob Tipp gespeichert wurde |

| 💡 Neue Ideen / Anforderungen | ❓ Was war unklar |
|---|---|
| Push-Notification wenn Freund tippt | Was passiert wenn Anpfiff? Kann ich noch ändern? |
| Emoji-Reaktionen auf Tipps | Bedeutung von «Man of the Matchday» unklar |

**Feedback Grid – Drin (TP-02):**

| 😊 Was hat gut funktioniert / gefallen | 😞 Was hat nicht funktioniert / gestört |
|---|---|
| Konzept ist sofort verständlich und lustig | Heim/Auswärts Felder nicht klar beschriftet |
| Spieltagsübersicht übersichtlich | Kein Bestätigungs-Feedback nach Tipp-Abgabe |
| Dunkles Design gefällt | Dashboard zeigt «Noch keine Tipps» – wirkt leer |

| 💡 Neue Ideen / Anforderungen | ❓ Was war unklar |
|---|---|
| Filter nach Liga oder Datum | Ist «Brag-Points» dasselbe wie Punkte? |
| Möglichkeit, alten Tipp zu löschen | Wie kommt man von Rangliste zurück zum Dashboard? |

---

**Issue Map:**

| | **Spieltag finden** | **Tipp abgeben** | **Rangliste lesen** |
|---|---|---|---|
| **Enis (TP-01)** | – | Kein Speicher-Feedback (Schweregrad: **3**) | «Man of the Matchday» unklar (Schweregrad: **2**) |
| **Drin (TP-02)** | Nav-Tab nicht sofort gefunden (Schweregrad: **2**) | Heim/Auswärts vertauscht (Schweregrad: **3**) | «Brag-Points» ≠ Punkte unklar (Schweregrad: **2**) |

**Schweregrad-Skala:** 0 = Kein Problem | 1 = Kosmetisch | 2 = Kleine Priorität | 3 = Hohe Priorität | 4 = Katastrophe

---

**Zusammenfassung der Resultate:**

Das Grundkonzept von «Bet & Brag» wurde von beiden Testpersonen sofort verstanden und als motivierend empfunden. Der Hauptworkflow (Tipp abgeben) konnte von TP-01 ohne Probleme abgeschlossen werden, TP-02 hatte leichte Schwierigkeiten mit der Heim/Auswärts-Beschriftung. Das grösste, von beiden Testpersonen geteilte Problem ist das fehlende Feedback nach der Tipp-Abgabe: Es ist unklar, ob der Tipp erfolgreich gespeichert wurde. Zudem war der Begriff «Man of the Matchday» ohne Kontext für neue Nutzer nicht sofort verständlich.

---

**Abgeleitete Verbesserungen (priorisiert):**

| Priorität | Issue | Massnahme |
|---|---|---|
| **Hoch (3)** | Kein visuelles Feedback nach Tipp-Abgabe | Erfolgs-Toast/Meldung einbauen: «Tipp gespeichert!» |
| **Hoch (3)** | Heim/Auswärts-Felder unklar beschriftet | Labels «Heim» und «Auswärts» direkt über den Eingabefeldern anzeigen |
| **Mittel (2)** | «Man of the Matchday» unklar für neue Nutzer | Kurze Erklärung als Subtitle hinzufügen: «Bester Tipper dieses Spieltags» |
| **Mittel (2)** | Spieltag-Navigation nicht sofort gefunden (TP-02) | Icon der Bottom Nav mit kurzem Text-Label ergänzen (bereits vorhanden, evtl. prominenter) |
| **Tief (1)** | Leeres Dashboard wirkt unmotivierend | Platzhalter-Text verbessern: «Sei der Erste, der tippt!» |

---

## 4. Erweiterungen

### 4.1 Fantasiewährung «Brag-Points»
- **Beschreibung & Nutzen:** Anstatt nur Punkte zu vergeben, startet jeder Nutzer mit einem Guthaben von 100 Brag-Points. Richtige Tipps erhöhen das Guthaben, falsche reduzieren es nicht (um Frustration zu vermeiden). Das Guthaben ist die primäre Kenngrösse in der Rangliste.
- **Wo umgesetzt:** Punktelogik in `src/lib/points.ts`, Anzeige in allen Ranglisten-Komponenten.
- **Aus Evaluation abgeleitet?:** Teilweise – TP-01 und TP-02 fragten nach der Bedeutung von «Brag-Points», was zeigt, dass das Konzept stärker kommuniziert werden muss.

### 4.2 Spieltagssieger (Man of the Matchday)
- **Beschreibung & Nutzen:** Hervorhebung der Person mit den meisten Punkten am aktuellen Spieltag auf dem Dashboard. Erzeugt kurzfristige Motivation auch bei Rückstand in der Gesamttabelle.
- **Wo umgesetzt:** `+page.server.ts` (Dashboard), Berechnung über alle Tips des aktuellen Spieltags.
- **Aus Evaluation abgeleitet?:** Ja – Feedback zeigte, dass der Begriff «Man of the Matchday» eine kurze Erläuterung benötigt (Issue, Priorität 2).

---

## 5. Projektorganisation

- **Repository:** [https://github.com/luisarenillas/bet-and-brag](https://github.com/luisarenillas/bet-and-brag)
- **Struktur:**
  ```
  src/
  ├── lib/
  │   ├── components/   (Nav, MatchCard)
  │   ├── db.ts         (MongoDB-Verbindung)
  │   ├── points.ts     (Punkteberechnung)
  │   └── types.ts      (TypeScript-Interfaces)
  └── routes/
      ├── +page.svelte          (Dashboard)
      ├── spieltag/             (Spieltag-Übersicht + Tipp-Abgabe)
      ├── rangliste/            (Rangliste)
      └── api/                  (REST-Endpunkte)
  ```
- **Commit-Praxis:** Sprechende Commits mit Prefix (z.B. `Fix:`, `Add:`, `Refactor:`).

---

## 6. KI-Deklaration

### 6.1 KI-Tools
- **Eingesetzte Tools:** Claude (Anthropic, claude-sonnet-4), GitHub Copilot
- **Zweck & Umfang:**
  - **Claude:** Unterstützung bei der gesamten Projektplanung (Ideenfindung, Crazy 8s, Evaluation), Erstellung der Dokumentation, Code-Gerüst für SvelteKit-Routen, MongoDB-Integration und Komponenten.
  - **GitHub Copilot:** Code-Vervollständigung während der Entwicklung im VS Code.
  - Grosse Teile des Codes (Routing, DB-Anbindung, Komponenten) wurden mit KI-Unterstützung erstellt und anschliessend manuell überprüft und angepasst.
- **Eigene Leistung:** Projektidee, Entscheidung für Fussball-Tippspiel mit Fantasiewährung, Auswahl der Designvariante aus den Crazy 8s, finale Kontrolle und Debugging aller KI-generierten Inhalte.

### 6.2 Prompt-Vorgehen
Die KI wurde primär als Sparringpartner für die Ideenfindung und als Code-Assistent eingesetzt. Bei der Dokumentation wurden zuerst eigene Überlegungen formuliert, dann mit KI ausgearbeitet. Beim Code wurden Anforderungen als Kontext beschrieben (z.B. «Erstelle eine SvelteKit-Route die Matches aus MongoDB lädt und als Karten anzeigt»), die Ausgabe wurde kontrolliert und bei Bedarf korrigiert.

### 6.3 Reflexion
KI hat den Entwicklungsprozess deutlich beschleunigt, insbesondere bei Boilerplate-Code und Dokumentation. Die grösste Herausforderung war das Debugging von Deployment-Problemen (Netlify/MongoDB), bei dem KI hilfreiche Hypothesen lieferte, aber nicht immer die korrekte Lösung auf Anhieb kannte. Qualitätssicherung erfolgte durch manuelle Tests und schrittweises Vorgehen.

---

## 7. Anhang

- **Seed-Script:** `seed.mjs` im Root-Verzeichnis – befüllt die MongoDB mit Testdaten (4 Spiele)
- **Testskript / Szenarien:** Siehe Kapitel 3.5
- **Deployment:** [https://bet-and-brag.netlify.app](https://bet-and-brag.netlify.app)
- **GitHub Repository:** [https://github.com/luisarenillas/bet-and-brag](https://github.com/luisarenillas/bet-and-brag)
