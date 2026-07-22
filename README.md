# Club Dynasty v23.0

Komplett React/Vite-prosjekt for StackBlitz. Kildekoden ligger direkte i
repoet, slik at prosjektet starter uten utpakking eller installasjonsskript.

## Nytt i v23

- Valgbar startkapital: 75 000, 150 000 eller 250 000. Standard er 150 000.
- Førstesesonglagringer som startet med 15 000 får en kontrollert engangsreparasjon.
- Ny fane for kommunal støtte under økonomi.
- Kommunalt etableringstilskudd på 25 000–75 000 for små klubber.
- Anleggs- og aktivitetstilskudd med 20–50 % kommunal dekning og krav til egenandel.
- Anleggsmidler holdes utenfor fri kontantbeholdning og refunderes først når et godkjent prosjekt startes.
- Kommunalt lån på 50 000–200 000 med 6 % rente, 72 ukers løpetid og tvungne ukentlige avdrag.
- Søknader bruker klubbverdi, gjeld, omdømme, styretillit, ungdomsarbeid og egenandel.
- Svar kommer etter 2–6 spilluker og kan bli godkjent, delvis godkjent, avslått eller kreve dokumentasjon.
- Maks én søknad per støtteordning per sesong, ventetid etter avslag og etableringstilskudd kun én gang.
- Bredere sidemeny, blå aktiv bakgrunn med hvit tekst og skjulte hurtigtasttall.
- Utvidet norsk/engelsk konsistens i navigasjon, økonomi, oppsett og støtteordningene.
- Kommunal støtte, startkapital og tilsagn følger autosave, backup og manuelle lagringsplasser.

## Eksisterende hovedinnhold

- Reparert førstesesongøkonomi med balansert startlønn, grunnsponsor og Rookie League-andel.
- Dynamisk samlet lånetak basert på inntekter, klubbverdi, omdømme, styretillit og eksisterende gjeld.
- Kassekreditt, driftslån og nødlån med tydelige vilkår, avdrag og løpetid.
- Fire ukers kontantprognose med kontantbuffer, sesongprognose og gjeldstrekk.
- Lokalradio, TV-kamper og medieavtaler med fast betaling pluss CPM.
- Ekte kampdag med fire quarters, pause, hastighetsvalg og taktiske beslutninger.
- Spillerstatistikk, priser, rekorder, klubblegender og levende ligasenter.
- Tydelig sluttspillhub og auto-manager som stopper før postseason.
- Sponsorvedlikehold, offseason-fornyelser, karrieretempo og klubblisenskrav.

## Start spillet

```bash
npm install
npm run dev
```

## Bygg

```bash
npm run build
```

## Test

```bash
npm test
```

v22- og eldre lagringer migreres automatisk. v23-laget reparerer startkapitalen
én gang og lagrer kommunale søknader separat, samtidig som dataene legges inn i
autosave, backup og manuelle lagringsplasser.
