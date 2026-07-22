# Club Dynasty v21.0

Komplett React/Vite-prosjekt for StackBlitz. Kildekoden ligger direkte i
repoet, slik at prosjektet starter uten utpakking eller installasjonsskript.

## Hovedinnhold
- Ekte kampdag med fire quarters, pause, 1x/2x/4x hastighet og valg ved halftime og i sluttminuttene.
- Navngitte scoringer, turnovers og forsvarsspill, lagstatistikk og komplett kampboks.
- Sesong- og karrierestatistikk for spillerne, statistikkledere, priser, rekorder og klubblegender.
- Levende ligasenter med klikkbare motstandere, AI-overganger, draftnyheter og tydeligere rivaloppgjør.
- Hurtigsim og øyeblikkelig simulering er fortsatt tilgjengelig ved siden av den nye direktekampen.
- Før-sesongens sluttspillvisning viser ikke lenger en falsk seed.
- Offseason viser nå supporterendringen for hele sesongen.
- Tydelig sluttspillhub med topp 4, topp 6 og topp 8 etter liganivå.
- Auto-manager stopper alltid før sluttspill og ignorerer rutinemøter i styret.
- Sponsorvedlikehold: Av, Vedlikehold eller Optimaliser.
- Sponsorfornyelser kan behandles direkte i offseason.
- Lengre sponsoravtaler målt i sesonger og faste opplåsingskrav.
- Karrieretempo: rask, standard eller lang.
- Klubblisenskrav før opprykk.
- Ny kamprapport med resultat og konsekvens først.
- Ny innstillingsside med egne faner og hovedknapp for mute.
- Fame oppdateres og sesonghistorikken lagrer sluttspill, priser og utvikling.
- Økonomisk sen-spillvekst komprimeres.
- Tabell før første kamp viser ingen falsk rangering.

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

v20- og eldre lagringer migreres automatisk. Eksisterende spillere får et
kompatibelt karriereregister, og detaljert statistikk bygges videre fra v21.
