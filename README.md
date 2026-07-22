# Club Dynasty v22.1

Komplett React/Vite-prosjekt for StackBlitz. Kildekoden ligger direkte i
repoet, slik at prosjektet starter uten utpakking eller installasjonsskript.

## Hovedinnhold

- Reparert førstesesongøkonomi: en standardklubb tåler hele sesongen uten tvungent kriselån.
- Startlønn, grunnsponsor og Rookie League-andel er balansert rundt et lite ukentlig underskudd.
- Samme beregning brukes i kampoppgjøret og økonomiprognosen.
- Driftslån er tilgjengelig fra sesong 1, og kassekreditt kan økes innenfor én fasilitet og et absolutt lånetak.
- Spilleren velger minimum, anbefalt eller maksimalt lånebeløp og ser samlet tvungent trekk før godkjenning.
- Offseason kan godkjennes med en tydelig tapsadvarsel; en kunstig seksukers buffer låser ikke lenger karrieren.
- Eksisterende v22-lagringer i første sesong får automatisk lønns-, sponsor- og likviditetsreparasjon.
- Ny finansieringsside med samlet lånetak, kredittscore, tilgjengelig ramme og tydelige lånevilkår.
- Kassekreditt fra første sesong, ordinært driftslån og et dyrt nødlån ved reell krise.
- Automatisk ukentlig betaling av renter og avdrag, ekstra innbetaling og kontrollert gjeldsrestrukturering.
- Ingen stabling av samme lånetype, og stadiongjeld teller med i klubbens samlede låneramme.
- Lokalradio, enkeltkamper på TV og medieavtaler betaler fast sats pluss CPM basert på faktisk publikum.
- Fire ukers kontantprognose og tydelig skille mellom kontantbeholdning, driftsresultat og gjeldsbetaling.
- Bonusfrie kontraktsfornyelser og en styresanksjonert siste utvei hindrer økonomisk offseason-lås.
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

v22- og eldre lagringer migreres automatisk. Førstesesonglagringer fra v22 får
balansereparasjonen én gang. Eldre gjeld blir gjort om til en nedbetalingsplan,
mens spillerkarrierer og statistikk beholdes.
