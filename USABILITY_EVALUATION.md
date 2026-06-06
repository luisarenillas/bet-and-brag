# Usability Evaluation – Bet & Brag

## 1. Getestete Version

Lokaler Entwicklungsstand (`npm run dev`, `http://localhost:5173`) zum Zeitpunkt der Evaluation.  
Getestete Routen: Dashboard (`/`), Spieltag (`/matches`), Tipp-Abgabe (`/tip/[id]`), Rangliste (`/leaderboard`), Turnierbaum (`/bracket`).

---

## 2. Ziele der Evaluation

| # | Fragestellung |
|---|---------------|
| F1 | Finden Nutzer intuitiv den Weg, um einen Tipp auf ein WM-Spiel abzugeben? |
| F2 | Ist das Gems-System (Einsatz, Gewinn, Verlust) ohne Erklärung verständlich? |
| F3 | Ist die Navigation zwischen den Hauptbereichen der App selbsterklärend? |
| F4 | Verstehen Nutzer den Live-Simulations-Modus und seine Auswirkung auf die Rangliste? |

---

## 3. Vorgehen

- **Methode:** Moderierter Usability Test, szenario-basiert, Think-Aloud-Methode
- **Setting:** On-site, Smartphone (iOS, Safari) und Laptop (Chrome)
- **Testleitung:** Luis (Projektinhaber)
- **Beobachtung:** Verbale Reaktionen, Navigationsfluss, Abbrüche
- **Protokoll:** Feedback Grid pro Testperson, anschliessend gemeinsame Issue Map
- **Dauer:** ca. 10 Minuten pro Person

---

## 4. Stichprobe

| Person | Code | Alter | Technologie-Affinität | Sporterfahrung |
|--------|------|-------|-----------------------|----------------|
| Enis   | TP1  | 24    | Hoch (tägl. Smartphone-Nutzer) | Fussball-Fan, verfolgt WM aktiv |
| Drin   | TP2  | 24    | Mittel (Gelegenheits-App-Nutzer) | Gelegentlicher Fussball-Zuschauer |

---

## 5. Testaufgaben / Szenarien

### Ausgangslage

> Du bist neu in der App registriert. Die WM 2026 startet in wenigen Tagen. Deine Freundesgruppe wettet gegeneinander — wer am Ende die meisten Football Gems hat, gewinnt die Runde.

---

### Aufgabe 1 — Ersten Tipp abgeben

> Du möchtest auf das Eröffnungsspiel der WM tippen. Schau dich in der App um, finde das passende Spiel und gib deinen Tipp für das Ergebnis ab.

**Erfolgskriterium:** Testperson navigiert zum Tipp-Formular, gibt ein Ergebnis ein und speichert erfolgreich.

---

### Aufgabe 2 — Gems-System verstehen

> Nach deinem Tipp: Schau nach, wie viele Football Gems du noch hast und erkläre, was passiert, wenn dein Tipp richtig ist.

**Erfolgskriterium:** Testperson findet den Gems-Kontostand und beschreibt korrekt (Volltreffer = +30, Tendenz = +20, falsch = −10).

---

### Aufgabe 3 — Rangliste prüfen

> Du willst sehen, ob du gerade in der Führung bist oder ob dich jemand überholt hat. Finde heraus, auf welchem Rang du stehst.

**Erfolgskriterium:** Testperson navigiert zur Rangliste und identifiziert die eigene Position.

---

### Aufgabe 4 — Spielsimulation starten

> Das erste Spiel ist vorbei! Starte die Auswertung eines Spiels und schau, was mit deinen Gems passiert.

**Erfolgskriterium:** Testperson findet den Simulations-Button auf dem Dashboard und triggert eine Simulation.

---

## 6. Beobachtungen – Feedback Grids

### Testperson 1 – Enis (TP1)

**Datum:** 03.06.2026 | **Prototyp-Version:** v1.0 (lokaler Dev-Stand)

| ✅ Was hat gut funktioniert / gefallen? | ❌ Was hat nicht funktioniert / gestört? |
|----------------------------------------|------------------------------------------|
| Dashboard-Countdown wurde sofort verstanden und als cool empfunden | Der „▶ Starten"-Button für die Simulation war beim ersten Durchgang übersehen — wurde nicht als «Spielende simulieren» interpretiert |
| Bottom-Navigation war sofort klar, Icons gut gewählt | Auf der Tipp-Abgabe-Seite war unklar, dass der Einsatz fix bei 10 Gems liegt — TP1 suchte nach einem Slider zum Anpassen |
| Neon-grüne Buttons gut sichtbar, klarer Call-to-Action | Nach dem Speichern eines Tipps: Weiterleitung zur Rangliste war überraschend — TP1 erwartete, zurück zur Spieltag-Seite zu gelangen |
| Rangliste mit Zonen (Final-Zone / Gurken-Zone) wurde als «lustig und motivierend» bezeichnet | |

| 💡 Was hat gefehlt? | ❓ Was war unklar? |
|---------------------|-------------------|
| Möglichkeit, Einsatz selbst zu wählen (z.B. 5–50 Gems) | Was bedeutet «Football Gems» genau — Punkte oder eine Art Währung? |
| Push-Benachrichtigung oder Badge wenn ein Spiel ausgewertet wurde | Unterschied zwischen «Tipp speichern» und «Simulation starten» war nicht auf Anhieb ersichtlich |
| Profilbild / Avatar anpassbar machen | Was passiert mit Gems, wenn man auf 0 fällt? |

**Gesamteindruck TP1:** „Sieht professionell aus, macht Spass. Ich würde das wirklich mit Kollegen nutzen."

---

### Testperson 2 – Drin (TP2)

**Datum:** 03.06.2026 | **Prototyp-Version:** v1.0 (lokaler Dev-Stand)

| ✅ Was hat gut funktioniert / gefallen? | ❌ Was hat nicht funktioniert / gestört? |
|----------------------------------------|------------------------------------------|
| Eröffnungsspiel-Card auf dem Dashboard mit direktem «Tipp abgeben»-Button sehr intuitiv | Bottom-Navigation-Label «Bracket» wurde nicht sofort verstanden — TP2 fragte «was ist das?» |
| Score-Eingabe mit + / − Buttons als angenehm und präzise empfunden | Beim ersten Öffnen der App: Gems-Badge oben rechts (💎 100) wurde ignoriert — Bedeutung erst auf Nachfrage klar |
| Leaderboard-Hierarchie (Rang 1–3 goldfarben) auf einen Blick lesbar | Auf der Matches-Seite: Filter-Tab «Live» ist ausgegraut / leer — TP2 klickte mehrfach und war irritiert |
| Turnierbaum-Gruppenphase-Tab übersichtlich strukturiert | Fehlende Rückmeldung nach Simulation, wenn kein Tipp auf das simulierte Spiel gesetzt war |

| 💡 Was hat gefehlt? | ❓ Was war unklar? |
|---------------------|-------------------|
| Direkte Erklärung der Spielregeln beim ersten App-Start (Onboarding) | Warum leuchtet der Trend-Pfeil rot/grün — bezogen auf was genau? |
| Möglichkeit, Tipp nach Abgabe nochmals zu sehen ohne zur Matches-Seite zu navigieren | «Gurken-Zone» — Begriff war erstmal unklar, nach Erklärung aber sehr lustig |
| Suchfunktion oder Filtermöglichkeit für Spiele nach Datum | Kann man mehrere Spiele pro Tag tippen? |

**Gesamteindruck TP2:** „Cooles Design, dunkel und sportlich. Der Einstieg ist etwas verwirrend, aber nach zwei Minuten ist alles klar."

---

## 7. Issue Map

| Issue | Beschreibung | TP1 | TP2 | Schritt | Schweregrad (0–4) | Priorität |
|-------|-------------|-----|-----|---------|-------------------|-----------|
| I-01 | Simulations-Button nicht als «Spiel auswerten» erkannt | ✓ | – | Dashboard | **2** | Mittel |
| I-02 | Fixer Gems-Einsatz (10) nicht sofort erkennbar, Slider erwartet | ✓ | – | Tipp-Abgabe | **2** | Mittel |
| I-03 | Nach Tipp-Speichern: Redirect zur Rangliste unerwartet | ✓ | – | Tipp-Abgabe | **1** | Tief |
| I-04 | «Bracket»-Label in Bottom-Nav unverständlich | – | ✓ | Navigation | **2** | Mittel |
| I-05 | Gems-Badge wird initial ignoriert / Bedeutung unklar | – | ✓ | Allgemein | **3** | Hoch |
| I-06 | «Live»-Tab leer, keine Erklärung → Verwirrung | – | ✓ | Spieltag | **2** | Mittel |
| I-07 | Kein Onboarding / Erklärung der Spielregeln beim Start | ✓ | ✓ | Start | **3** | Hoch |
| I-08 | Trend-Indikator (↑↓) ohne Kontexterklärung | – | ✓ | Rangliste | **1** | Tief |
| I-09 | Keine Rückmeldung nach Simulation ohne eigenen Tipp | – | ✓ | Dashboard | **2** | Mittel |
| I-10 | «Gurken-Zone» Begriff nicht selbsterklärend | – | ✓ | Rangliste | **1** | Tief |

### Schweregrad-Legende
`0` Kein Problem · `1` Kosmetisch · `2` Klein (niedrige Prio) · `3` Gross (hohe Prio) · `4` Katastrophal

---

## 8. Zusammenfassung der Resultate

Beide Testpersonen fanden die App optisch ansprechend und das Grundkonzept (Tipps abgeben, Gems verdienen, Rangliste) schnell verständlich. Die grössten Hürden lagen beim **ersten Kontakt mit dem Gems-System** (I-05, I-07): ohne kurze Erklärung war der Zweck der Währung nicht sofort klar. Der **Simulations-Button** (I-01) wurde nicht intuitiv mit «Spielende auswerten» assoziiert — die Beschriftung «▶ Starten» ist zu generisch. Das **Live-Tab** (I-06) erzeugte Verwirrung durch seine leere Ansicht. Positiv hervorgehoben wurden Countdown, neongrüne CTAs, Score-Eingabe mit ±-Buttons und das humorvolle Zonen-System der Rangliste.

---

## 9. Abgeleitete Verbesserungen (priorisiert)

| Prio | Issue | Massnahme |
|------|-------|-----------|
| 🔴 Hoch | I-07 | **Onboarding-Overlay** beim ersten App-Start: kurze Erklärung der Gems-Regeln (3 Screens oder Tooltip-Tour) |
| 🔴 Hoch | I-05 | Gems-Badge mit kurzem Label ergänzen: «💎 100 Gems» → Tooltip/Tap öffnet Mini-Erklärung |
| 🟡 Mittel | I-01 | Simulations-Button umbenennen: «▶ Starten» → «⚽ Spiel simulieren & auswerten» |
| 🟡 Mittel | I-04 | Bottom-Nav-Label ändern: «Bracket» → «Baum» oder «K.o.-Phase» |
| 🟡 Mittel | I-06 | Live-Tab: Platzhalter mit Erklärung anzeigen: «Keine Live-Spiele gerade – simuliere ein Spiel auf dem Dashboard!» |
| 🟡 Mittel | I-02 | Einsatz-Bereich: visuell klarer als fixe Regel darstellen, oder variabler Einsatz (5/10/20 Gems) einbauen |
| 🟡 Mittel | I-09 | Nach Simulation ohne eigenen Tipp: Overlay mit Hinweis «Du hattest keinen Tipp – tippe jetzt auf das nächste Spiel!» |
| 🟢 Tief | I-03 | Nach Tipp-Speichern: Option «Zurück zum Spieltag» oder «Zur Rangliste» anbieten statt Auto-Redirect |
| 🟢 Tief | I-08 | Trend-Indikator: Tooltip «↑ seit letzter Simulation» hinzufügen |
| 🟢 Tief | I-10 | «Gurken-Zone» mit kleinem Emoji-Hint versehen: 🥒 — oder im Leaderboard kurz erklären |
