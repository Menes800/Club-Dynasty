import { Fragment as X, jsx as t, jsxs as a } from "react/jsx-runtime";
import {
  useEffect as Rt,
  useMemo as kt,
  useRef as ur,
  useState as ge,
} from "react";
import {
  applyMatchStatsToRoster,
  archiveRosterSeason,
  careerLeaders,
  createLegendFromPlayer,
  createMatchPlayerBox,
  finalizeMatchPlayerBox,
  formatStatValue,
  normalizeRosterLegacy,
  playerHeadlineStat,
  recordDefensivePlay,
  recordOffensiveTurnover,
  recordScoringPlay,
  seasonLeaders,
  selectSeasonAwards,
  startNewPlayerSeason,
  topMatchPerformers,
} from "./game/playerLegacy.js";
import {
  createOffseasonLeagueFeed,
  createWeeklyLeagueFeed,
  normalizeLeagueFeed,
  refreshAiTeamStories,
  weeklyTeamActivity,
} from "./game/leagueWorld.js";
import {
  addLoanFromQuote,
  addManualLoan,
  applyExtraDebtPayment,
  buildCashForecast,
  calculateBorrowingCapacity,
  getDebtSnapshot,
  getLoanDashboard,
  normalizeLoanBook,
  processWeeklyDebt,
  restructureDebtWithAdvance,
  sumLoanBalances,
} from "./game/financeEngine.js";
import {
  calculateMediaPayout,
  getBroadcastDeals,
  normalizeBroadcastDeal,
} from "./game/mediaEngine.js";
import "./App.css";
const Mn = "sports-empire-core-v22",
  nn = "sports-empire-core-v22-backup",
  Fa = [
    "sports-empire-core-v21",
    "sports-empire-core-v21-backup",
    "sports-empire-core-v20",
    "sports-empire-core-v20-backup",
    "sports-empire-core-v19",
    "sports-empire-core-v19-backup",
    "sports-empire-core-v18",
    "sports-empire-core-v17",
    "sports-empire-core-v16",
    "sports-empire-core-v15",
    "sports-empire-core-v14",
    "sports-empire-core-v13",
    "sports-empire-core-v12",
    "sports-empire-core-v11",
    "sports-empire-core-v10",
    "sports-empire-core-v9-1",
    "sports-empire-core-v9",
    "sports-empire-core-v8",
    "sports-empire-core-v7",
  ],
  Un = ["sports-empire-slot-1", "sports-empire-slot-2", "sports-empire-slot-3"],
  oe = 12,
  Je = 30,
  ve = 16,
  je = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K"],
  _a = [
    {
      id: "rentedPitch",
      name: "Leid enkeltbane",
      icon: "\u{1F331}",
      rank: 0,
      capacity: 750,
      weeklyRent: 320,
      moveCost: 0,
      minFans: 0,
      minProfile: 0,
      minLeague: 0,
      rights: [
        "Midlertidige kampdagstiltak",
        "Trenerteam og scouting",
        "Ingen permanente bygg",
      ],
      description:
        "Klubben leier treningstid og kampbane. Investeringer m\xE5 kunne tas med videre.",
    },
    {
      id: "rentedBase",
      name: "Leid klubbbase",
      icon: "\u{1F3E0}",
      rank: 1,
      capacity: 1400,
      weeklyRent: 920,
      moveCost: 18e3,
      minFans: 250,
      minProfile: 18,
      minLeague: 0,
      rights: [
        "Fast kontor og garderober",
        "Fysiorom og liten butikk",
        "Lokal partner og bedre drift",
      ],
      description:
        "Et fast hjem med kontor, garderober og mer treningstid, men uten full utbyggingsrett.",
    },
    {
      id: "longLease",
      name: "Langtidsleid idrettsanlegg",
      icon: "\u{1F3DF}\uFE0F",
      rank: 2,
      capacity: 3200,
      weeklyRent: 2150,
      moveCost: 52e3,
      minFans: 850,
      minProfile: 32,
      minLeague: 1,
      rights: [
        "Avtalte tribune- og sponsorflater",
        "Treningsrom og VIP-omr\xE5de",
        "Arenapartner tillatt",
      ],
      description:
        "En lang leieavtale gir rett til avtalte forbedringer. Permanente investeringer blir igjen ved utflytting.",
    },
    {
      id: "ownedCampus",
      name: "Eget klubbomr\xE5de",
      icon: "\u{1F3E2}",
      rank: 3,
      capacity: 5500,
      weeklyRent: 0,
      moveCost: 85e3,
      minFans: 2500,
      minProfile: 45,
      minLeague: 1,
      rights: [
        "Full bygge- og navnerett",
        "Stadion, akademi og prestasjonssenter",
        "Alle sponsorflater",
      ],
      description:
        "Klubben eier omr\xE5det og kan utvikle et komplett sports- og stadioncampus.",
    },
  ];
function Be(e) {
  return _a.find((s) => s.id === e);
}
function rt(e) {
  return Be(e.clubBase).rank;
}
function Yn(e, s) {
  const n = Be(s);
  return (
    n.rank > rt(e) &&
    e.fans >= n.minFans &&
    e.reputation >= n.minProfile &&
    e.leagueIndex >= n.minLeague
  );
}
const le = [
    {
      name: "Rookie League",
      logo: "\u{1F331}",
      basePower: 48,
      prize: 9e3,
      salaryCap: 17e3,
    },
    {
      name: "Town League",
      logo: "\u{1F3D8}\uFE0F",
      basePower: 60,
      prize: 22e3,
      salaryCap: 28e3,
    },
    {
      name: "National League",
      logo: "\u{1F3DF}\uFE0F",
      basePower: 72,
      prize: 55e3,
      salaryCap: 44e3,
    },
    {
      name: "Elite League",
      logo: "\u{1F451}",
      basePower: 84,
      prize: 13e4,
      salaryCap: 7e4,
    },
    {
      name: "World League",
      logo: "\u{1F30D}",
      basePower: 92,
      prize: 32e4,
      salaryCap: 11e4,
    },
  ],
  qa = [
    { min: 54, target: 62, max: 72 },
    { min: 64, target: 73, max: 82 },
    { min: 74, target: 83, max: 92 },
    { min: 83, target: 90, max: 96 },
    { min: 89, target: 95, max: 99 },
  ];
function an(e) {
  return qa[b(e, 0, qa.length - 1)];
}
function pr(e) {
  const s = e.power ?? 62,
    n = e.attack ?? s,
    r = e.defense ?? s,
    c = e.stamina ?? s,
    i = e.morale ?? 72,
    d = e.chemistry ?? 70;
  return n * 0.38 + r * 0.38 + c * 0.12 + i * 0.06 + d * 0.06;
}
function ct(e, s) {
  const n = an(s),
    r = e.attack ?? e.power ?? n.target,
    c = e.defense ?? e.power ?? n.target,
    i = e.stamina ?? e.power ?? n.target,
    d = pr(e),
    u = d >= n.min && d <= n.max,
    g = b(
      Math.round(u ? d : n.target + (d - le[s].basePower) * 0.18),
      n.min,
      n.max,
    ),
    k = b(r - d, -14, 14),
    y = b(c - d, -14, 14),
    f = b(i - d, -12, 12);
  let N = b(Math.round(g + k * 0.42), n.min - 5, n.max + 2),
    w = b(Math.round(g + y * 0.42), n.min - 5, n.max + 2),
    v = b(Math.round(g + f * 0.32), n.min - 5, n.max + 2);
  const $ = b(Math.round(e.morale ?? 72), 45, 94),
    D = b(Math.round(e.chemistry ?? 70), 45, 94),
    q = N * 0.38 + w * 0.38 + v * 0.12 + $ * 0.06 + D * 0.06,
    x = b(g - q, -7, 7);
  ((N = b(Math.round(N + x), n.min - 5, n.max + 2)),
    (w = b(Math.round(w + x), n.min - 5, n.max + 2)),
    (v = b(Math.round(v + x * 0.7), n.min - 5, n.max + 2)));
  const R = b(
    Math.round(N * 0.38 + w * 0.38 + v * 0.12 + $ * 0.06 + D * 0.06),
    n.min,
    n.max,
  );
  return {
    ...e,
    attack: N,
    defense: w,
    stamina: v,
    morale: $,
    chemistry: D,
    power: R,
    payroll: b(
      Math.round(e.payroll ?? le[s].salaryCap * 0.68),
      Math.round(le[s].salaryCap * 0.45),
      le[s].salaryCap,
    ),
  };
}
const Ke = {
    global: {
      label: "Global League",
      cities: [
        "Harbor City",
        "Westbridge",
        "Northport",
        "Redwood",
        "Lakeside",
        "Metro City",
        "Silver Bay",
        "Grand Valley",
      ],
      firstNames: [
        "Marcus",
        "Noah",
        "Leo",
        "Oliver",
        "Adam",
        "Theo",
        "Liam",
        "Ethan",
        "Mason",
        "Caleb",
        "Jordan",
        "Lucas",
        "Kai",
        "Mateo",
        "Daniel",
        "Sam",
      ],
      lastNames: [
        "Reed",
        "Stone",
        "Rivers",
        "Wolfe",
        "Green",
        "Rossi",
        "Carter",
        "Price",
        "Cole",
        "Brooks",
        "Silva",
        "Kim",
        "Patel",
        "Morgan",
        "Tanaka",
        "Bennett",
      ],
      teams: [
        ["Harbor City Hawks", "\u{1F985}"],
        ["Westbridge Wolves", "\u{1F43A}"],
        ["Northport Titans", "\u2694\uFE0F"],
        ["Redwood Rangers", "\u{1F332}"],
        ["Metro City Thunder", "\u26A1"],
        ["Lakeside Guardians", "\u{1F6E1}\uFE0F"],
        ["Silver Bay Sharks", "\u{1F988}"],
        ["Grand Valley Bulls", "\u{1F402}"],
        ["Ironwood Ravens", "\u{1F426}\u200D\u2B1B"],
        ["Coastal Kings", "\u{1F451}"],
        ["Summit Foxes", "\u{1F98A}"],
        ["Rivergate Tigers", "\u{1F42F}"],
      ],
    },
    northAmerica: {
      label: "North America",
      cities: [
        "Cedar Falls",
        "Ironwood",
        "Lakehurst",
        "Kingsport",
        "Westhaven",
        "Red Mesa",
        "Pinecrest",
        "Bayview",
      ],
      firstNames: [
        "Ethan",
        "Mason",
        "Caleb",
        "Jordan",
        "Tyler",
        "Dylan",
        "Cameron",
        "Logan",
        "Avery",
        "Jalen",
        "Micah",
        "Trevor",
      ],
      lastNames: [
        "Carter",
        "Brooks",
        "Bennett",
        "Hayes",
        "Walker",
        "Mitchell",
        "Parker",
        "Jackson",
        "Turner",
        "Collins",
        "Reed",
        "Price",
      ],
      teams: [
        ["Cedar Falls Cougars", "\u{1F406}"],
        ["Ironwood Ravens", "\u{1F426}\u200D\u2B1B"],
        ["Lakehurst Lightning", "\u26A1"],
        ["Kingsport Knights", "\u{1F6E1}\uFE0F"],
        ["Westhaven Wolves", "\u{1F43A}"],
        ["Red Mesa Mustangs", "\u{1F40E}"],
        ["Pinecrest Bears", "\u{1F43B}"],
        ["Bayview Sharks", "\u{1F988}"],
        ["Stonebridge Bulls", "\u{1F402}"],
        ["Capital Comets", "\u2604\uFE0F"],
        ["River City Raptors", "\u{1F996}"],
        ["Sunset Scorpions", "\u{1F982}"],
      ],
    },
    europe: {
      label: "Continental Europe",
      cities: [
        "Valemont",
        "Riverton",
        "Monteluce",
        "Eisenfeld",
        "Bellecour",
        "Costa Verde",
        "Novigrad",
        "Alpenstadt",
      ],
      firstNames: [
        "Luca",
        "Mateo",
        "Jonas",
        "Felix",
        "Nico",
        "Marco",
        "Daniel",
        "Hugo",
        "Leon",
        "Milan",
        "Emil",
        "Adrian",
      ],
      lastNames: [
        "Rossi",
        "Silva",
        "Weber",
        "Dubois",
        "Kovac",
        "Moretti",
        "Fischer",
        "Novak",
        "Martin",
        "Costa",
        "Bauer",
        "Ricci",
      ],
      teams: [
        ["Valemont Vipers", "\u{1F40D}"],
        ["Riverton Royals", "\u{1F451}"],
        ["Monteluce Lions", "\u{1F981}"],
        ["Eisenfeld Eagles", "\u{1F985}"],
        ["Bellecour Blues", "\u{1F537}"],
        ["Costa Verde Sharks", "\u{1F988}"],
        ["Novigrad Knights", "\u2694\uFE0F"],
        ["Alpenstadt Bears", "\u{1F43B}"],
        ["Danube Dragons", "\u{1F409}"],
        ["Rhine Ravens", "\u{1F426}\u200D\u2B1B"],
        ["Adriatic Wolves", "\u{1F43A}"],
        ["Central City Falcons", "\u{1F985}"],
      ],
    },
    ukIreland: {
      label: "UK & Ireland",
      cities: [
        "Ashford",
        "Kingsmere",
        "Northwick",
        "Glenhaven",
        "Westborough",
        "Redcastle",
        "Fairmont",
        "Eastport",
      ],
      firstNames: [
        "Oliver",
        "Harry",
        "Jack",
        "Leo",
        "Alfie",
        "Noah",
        "Finn",
        "Callum",
        "Rory",
        "Jamie",
        "Owen",
        "Theo",
      ],
      lastNames: [
        "Morgan",
        "Bennett",
        "Hughes",
        "Campbell",
        "Foster",
        "Clarke",
        "Walsh",
        "Murphy",
        "Taylor",
        "Davies",
        "Scott",
        "Reid",
      ],
      teams: [
        ["Ashford Arrows", "\u{1F3F9}"],
        ["Kingsmere Knights", "\u2694\uFE0F"],
        ["Northwick Wolves", "\u{1F43A}"],
        ["Glenhaven Giants", "\u{1F5FF}"],
        ["Westborough Wasps", "\u{1F41D}"],
        ["Redcastle Royals", "\u{1F451}"],
        ["Fairmont Falcons", "\u{1F985}"],
        ["Eastport Sharks", "\u{1F988}"],
        ["Highland Stags", "\u{1F98C}"],
        ["Thames Thunder", "\u26A1"],
        ["Celtic Ravens", "\u{1F426}\u200D\u2B1B"],
        ["Midland Bulls", "\u{1F402}"],
      ],
    },
    scandinavia: {
      label: "Scandinavia",
      cities: [
        "Nordhavn",
        "Frostvik",
        "Sundby",
        "Bergdal",
        "Skovholm",
        "Vinterby",
        "Havnesund",
        "Lindfjord",
      ],
      firstNames: [
        "Emil",
        "Noah",
        "Oliver",
        "Soren",
        "Lucas",
        "Aksel",
        "Mikkel",
        "Felix",
        "Elias",
        "Theo",
        "Viggo",
        "Anton",
      ],
      lastNames: [
        "Lind",
        "Berg",
        "Storm",
        "Dahl",
        "Lund",
        "Falk",
        "Nygaard",
        "Solvik",
        "Holm",
        "Vik",
        "Sander",
        "Molin",
      ],
      teams: [
        ["Nordhavn Ravens", "\u{1F426}\u200D\u2B1B"],
        ["Frostvik Wolves", "\u{1F43A}"],
        ["Sundby Storm", "\u26A1"],
        ["Bergdal Bears", "\u{1F43B}"],
        ["Skovholm Stags", "\u{1F98C}"],
        ["Vinterby Kings", "\u{1F451}"],
        ["Havnesund Sharks", "\u{1F988}"],
        ["Lindfjord Foxes", "\u{1F98A}"],
        ["Aurora Owls", "\u{1F989}"],
        ["Iron Fjord Bulls", "\u{1F402}"],
        ["Northern Guardians", "\u{1F6E1}\uFE0F"],
        ["Midnight Hawks", "\u{1F985}"],
      ],
    },
    asiaPacific: {
      label: "Asia-Pacific",
      cities: [
        "Sakura Bay",
        "Han River",
        "Jade Harbor",
        "Pacific Point",
        "Golden Coast",
        "Lotus City",
        "Skyline Bay",
        "Coral Ridge",
      ],
      firstNames: [
        "Kai",
        "Ren",
        "Haru",
        "Min",
        "Jin",
        "Arun",
        "Ravi",
        "Leo",
        "Noah",
        "Tao",
        "Kenji",
        "Ari",
      ],
      lastNames: [
        "Tanaka",
        "Kim",
        "Lee",
        "Patel",
        "Chen",
        "Sato",
        "Nguyen",
        "Singh",
        "Park",
        "Wong",
        "Ito",
        "Shah",
      ],
      teams: [
        ["Sakura Bay Samurai", "\u{1F5E1}\uFE0F"],
        ["Han River Tigers", "\u{1F42F}"],
        ["Jade Harbor Dragons", "\u{1F409}"],
        ["Pacific Point Waves", "\u{1F30A}"],
        ["Golden Coast Hawks", "\u{1F985}"],
        ["Lotus City Guardians", "\u{1F6E1}\uFE0F"],
        ["Skyline Bay Thunder", "\u26A1"],
        ["Coral Ridge Sharks", "\u{1F988}"],
        ["Emerald Phoenix", "\u{1F525}"],
        ["Sunrise Foxes", "\u{1F98A}"],
        ["Ocean City Orcas", "\u{1F40B}"],
        ["Mountain Moon Bears", "\u{1F43B}"],
      ],
    },
  },
  Va = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K"],
  mr = [
    "Leder",
    "Arbeidsjern",
    "Egoist",
    "Publikumsfavoritt",
    "Skadeutsatt",
    "Stortalent",
    "Veteran",
  ];
function fr(e) {
  return Ke[e].label;
}
function Tt(e, s, n) {
  return e === "en" ? n : s;
}
function Ea(e) {
  return Ke[e].teams;
}
const Lt = [
    {
      id: "balanced",
      name: "Balansert",
      emoji: "\u2696\uFE0F",
      description: "Trygt oppsett uten klare svakheter.",
      attack: 1,
      defense: 1,
      stamina: 1,
      injury: 1,
      fan: 1,
    },
    {
      id: "vertical",
      name: "Offensiv",
      emoji: "\u{1F680}",
      description: "St\xF8rre vinnersjanse, men h\xF8yere risiko og slitasje.",
      attack: 1.2,
      defense: 0.91,
      stamina: 1.12,
      injury: 1.18,
      fan: 1.13,
    },
    {
      id: "ground",
      name: "Kontrollert spill",
      emoji: "\u{1F3C3}",
      description: "Lavere risiko og jevnere kampbilde.",
      attack: 1.03,
      defense: 1.06,
      stamina: 0.9,
      injury: 0.9,
      fan: 0.96,
    },
    {
      id: "blitz",
      name: "Aggressiv blitz",
      emoji: "\u26A1",
      description: "Mer press, men rom bak forsvaret.",
      attack: 0.96,
      defense: 1.2,
      stamina: 1.13,
      injury: 1.16,
      fan: 1.08,
    },
    {
      id: "clock",
      name: "Defensiv",
      emoji: "\u{1F6E1}\uFE0F",
      description: "Lav risiko, sterkere forsvar og f\xE6rre angrep.",
      attack: 0.9,
      defense: 1.13,
      stamina: 0.84,
      injury: 0.82,
      fan: 0.88,
    },
    {
      id: "youth",
      name: "Utvikle unge",
      emoji: "\u2B50",
      description: "Unge spillere utvikler seg raskere.",
      attack: 0.94,
      defense: 0.94,
      stamina: 0.96,
      injury: 0.94,
      fan: 1.02,
    },
  ],
  Nn = [
    {
      id: "balanced",
      name: "Balansert uke",
      emoji: "\u2696\uFE0F",
      description: "Litt utvikling p\xE5 alt.",
    },
    {
      id: "attack",
      name: "Angrep",
      emoji: "\u{1F3C8}",
      description: "Mer attack, noe lavere condition.",
    },
    {
      id: "defense",
      name: "Forsvar",
      emoji: "\u{1F6E1}\uFE0F",
      description: "Mer defense, noe lavere condition.",
    },
    {
      id: "fitness",
      name: "Fysikk",
      emoji: "\u{1F4AA}",
      description: "Stamina og robusthet.",
    },
    {
      id: "chemistry",
      name: "Lagkjemi",
      emoji: "\u{1F91D}",
      description: "Bedre moral og samspill.",
    },
    {
      id: "recovery",
      name: "Restitusjon",
      emoji: "\u{1F33F}",
      description: "Condition og skadebehandling.",
    },
  ],
  zn = [
    {
      id: "seats",
      name: "Tribuner",
      emoji: "\u{1F3DF}\uFE0F",
      description: "Kapasitet og billettinntekter.",
      baseCost: 2200,
      scale: 1.52,
    },
    {
      id: "vip",
      name: "VIP-losjer",
      emoji: "\u{1F942}",
      description: "H\xF8yere inntekt per kamp.",
      baseCost: 4200,
      scale: 1.58,
    },
    {
      id: "food",
      name: "Mat og drikke",
      emoji: "\u{1F354}",
      description: "Mer salg p\xE5 kampdag.",
      baseCost: 1700,
      scale: 1.44,
    },
    {
      id: "merch",
      name: "Supporterbutikk",
      emoji: "\u{1F9E2}",
      description: "Drakter og supporterutstyr.",
      baseCost: 2400,
      scale: 1.47,
    },
    {
      id: "parking",
      name: "Parkering og transport",
      emoji: "\u{1F17F}\uFE0F",
      description: "Bedre oppm\xF8te og familietilbud.",
      baseCost: 2800,
      scale: 1.48,
    },
    {
      id: "lights",
      name: "Flomlys og skjerm",
      emoji: "\u{1F4A1}",
      description: "Bedre TV-verdi og atmosf\xE6re.",
      baseCost: 3500,
      scale: 1.52,
    },
    {
      id: "training",
      name: "Treningsanlegg",
      emoji: "\u{1F4AA}",
      description: "Raskere spillerutvikling.",
      baseCost: 3e3,
      scale: 1.5,
    },
    {
      id: "medical",
      name: "Medisinsk avdeling",
      emoji: "\u{1FA7A}",
      description: "Lavere skaderisiko og raskere retur.",
      baseCost: 2700,
      scale: 1.49,
    },
    {
      id: "academy",
      name: "Ungdomsakademi",
      emoji: "\u{1F393}",
      description: "Bedre draft og egne talenter.",
      baseCost: 4500,
      scale: 1.55,
    },
    {
      id: "scouting",
      name: "Scoutingnettverk",
      emoji: "\u{1F50E}",
      description: "Mer presise spillerdata.",
      baseCost: 2300,
      scale: 1.48,
    },
    {
      id: "media",
      name: "Merkevare og publikum",
      emoji: "\u{1F4E3}",
      description: "Supportere, synlighet og sponsorverdi.",
      baseCost: 2100,
      scale: 1.45,
    },
    {
      id: "museum",
      name: "Museum og fan zone",
      emoji: "\u{1F3DB}\uFE0F",
      description: "Lojalitet, historikk og klubbverdi.",
      baseCost: 5500,
      scale: 1.57,
    },
  ],
  sn = [
    {
      id: "headCoach",
      name: "Hovedtrener",
      emoji: "\u{1F9E0}",
      description: "Taktikk, utvikling og moral.",
      baseCost: 3500,
      salary: 760,
    },
    {
      id: "offensiveCoach",
      name: "Offensiv trener",
      emoji: "\u{1F3C8}",
      description: "Forbedrer angrep og QB-utvikling.",
      baseCost: 2600,
      salary: 520,
    },
    {
      id: "defensiveCoach",
      name: "Defensiv trener",
      emoji: "\u{1F6E1}\uFE0F",
      description: "Forbedrer forsvar og kjemi.",
      baseCost: 2600,
      salary: 520,
    },
    {
      id: "physio",
      name: "Fysio",
      emoji: "\u{1FA7A}",
      description: "Condition og skadeforebygging.",
      baseCost: 2200,
      salary: 430,
    },
    {
      id: "scout",
      name: "Sjefsscout",
      emoji: "\u{1F575}\uFE0F",
      description: "Bedre markeds- og draftinformasjon.",
      baseCost: 2400,
      salary: 470,
    },
    {
      id: "cfo",
      name: "CFO",
      emoji: "\u{1F4BC}",
      description: "Reduserer kostnader og \xF8ker styretillit.",
      baseCost: 3900,
      salary: 800,
    },
    {
      id: "marketing",
      name: "Markedssjef",
      emoji: "\u{1F4E3}",
      description: "Kampanjer, merkevare og sponsorinntekter.",
      baseCost: 2500,
      salary: 490,
    },
    {
      id: "commercialDirector",
      name: "Kommersiell leder",
      emoji: "\u{1F39F}\uFE0F",
      description: "Billettpriser, ettersp\xF8rsel og kampdagsinntekter.",
      baseCost: 4800,
      salary: 980,
    },
    {
      id: "sportingDirector",
      name: "Sportsdirekt\xF8r",
      emoji: "\u{1F4CB}",
      description: "Kontraktsplan, draftbehov og trygge troppsvalg.",
      baseCost: 5200,
      salary: 1050,
    },
    {
      id: "stadiumManager",
      name: "Stadionsjef",
      emoji: "\u{1F3DF}\uFE0F",
      description: "Vedlikehold, arrangementer og anleggsdrift.",
      baseCost: 4600,
      salary: 920,
    },
    {
      id: "mediaOfficer",
      name: "Kommunikasjonsansvarlig",
      emoji: "\u{1F4E8}",
      description: "H\xE5ndterer rutinesaker og klubbkommunikasjon.",
      baseCost: 3800,
      salary: 760,
    },
    {
      id: "medicalDirector",
      name: "Medisinsk leder",
      emoji: "\u2695\uFE0F",
      description: "Rehabilitering, belastningsstyring og returdato.",
      baseCost: 4400,
      salary: 880,
    },
  ],
  Cn = [
    {
      id: "ticketing",
      name: "Billett- og ettersp\xF8rselssystem",
      description: "Mer presis publikumsprognose og trygg automatisk prising.",
      baseCost: 7500,
    },
    {
      id: "financeSuite",
      name: "\xD8konomi- og rapporteringssystem",
      description: "Bedre sesongprognoser og lavere administrasjonskostnader.",
      baseCost: 9e3,
    },
    {
      id: "scoutingDb",
      name: "Scoutingdatabase",
      description: "Reduserer usikkerhet i marked og draft.",
      baseCost: 8500,
    },
    {
      id: "supporterCrm",
      name: "Supporter-CRM",
      description:
        "Skiller lojale fans, ettersp\xF8rsel og medierekkevidde tydeligere.",
      baseCost: 8e3,
    },
    {
      id: "performanceLab",
      name: "Prestasjonsanalyse",
      description:
        "Bedre kampplan, belastningsstyring og mindre tilfeldig formsvikt.",
      baseCost: 10500,
    },
    {
      id: "medicalAnalytics",
      name: "Medisinsk analyse",
      description: "Mer presise skaderapporter og raskere rehabilitering.",
      baseCost: 9500,
    },
  ],
  Wa = [
    {
      id: "trainingCenter",
      category: "Sportslig",
      icon: "\u{1F4AA}",
      names: [
        "Mobilt prestasjonsteam",
        "Fast treningssenter",
        "Elite performance campus",
      ],
      baseCost: 11e3,
      baseWeeks: 3,
      minClubLevel: 1,
      minBase: "rentedPitch",
      kind: "department",
      description:
        "Start med et mobilt trenerteam. Permanente treningsbygg krever bedre base og sterkere rettigheter.",
      benefits: [
        "Hovedtrener + mobilt treningsopplegg",
        "Offensiv og defensiv trener i fast treningssenter",
        "Prestasjonsanalyse og eliteutvikling",
      ],
    },
    {
      id: "medicalCenter",
      category: "Sportslig",
      icon: "\u{1FA7A}",
      names: [
        "Medisinsk st\xF8tteavtale",
        "Profesjonell helseavdeling",
        "Elite medisinsk senter",
      ],
      baseCost: 9500,
      baseWeeks: 3,
      minClubLevel: 1,
      minBase: "rentedPitch",
      kind: "department",
      description:
        "Start med innleid medisinsk st\xF8tte. Faste lokaler \xE5pnes f\xF8rst n\xE5r klubben har en egnet base.",
      benefits: [
        "Fysio og skadeforebygging",
        "Fast medisinsk leder og behandlingsrom",
        "Medisinsk analyse og raskere retur",
      ],
    },
    {
      id: "academyProgram",
      category: "Sportslig",
      icon: "\u{1F393}",
      names: [
        "Lokal talentplan",
        "Regionalt akademi",
        "Eliteakademi og scouting",
      ],
      baseCost: 13500,
      baseWeeks: 4,
      minClubLevel: 2,
      minBase: "rentedPitch",
      kind: "program",
      description:
        "Akademi, scouting og draftarbeid bygges som \xE9n avdeling.",
      benefits: [
        "Akademi + scoutingnettverk",
        "Sjefsscout og database",
        "Sportsdirekt\xF8r og bedre draft",
      ],
    },
    {
      id: "matchdayZone",
      category: "Kampdag",
      icon: "\u{1F39F}\uFE0F",
      names: [
        "Midlertidig supportersone",
        "Fast kampdagsomr\xE5de",
        "Premium fan experience",
      ],
      baseCost: 10500,
      baseWeeks: 3,
      minClubLevel: 1,
      minBase: "rentedPitch",
      kind: "program",
      description:
        "Start med flyttbare kampdagstiltak. Faste bygg krever arena- eller eiendomsrettigheter.",
      benefits: [
        "Mat og supporterbutikk",
        "VIP-omr\xE5de og fan zone",
        "St\xF8rre inntekt per hjemmekamp",
      ],
    },
    {
      id: "stadiumExpansion",
      category: "Kampdag",
      icon: "\u{1F3DF}\uFE0F",
      names: [
        "Lokal tribuneutvidelse",
        "Moderne stadionl\xF8ft",
        "Nasjonalt stadionprosjekt",
      ],
      baseCost: 17500,
      baseWeeks: 5,
      minClubLevel: 2,
      minBase: "longLease",
      kind: "building",
      description:
        "Kapasitet, transport og kampdagsinfrastruktur bygges i ett prosjekt.",
      benefits: [
        "Tribune og parkering",
        "Flomlys og ny kapasitet",
        "St\xF8rre arena og TV-verdi",
      ],
    },
    {
      id: "commercialHub",
      category: "Kommersielt",
      icon: "\u{1F91D}",
      names: [
        "Kommersiell grunnmur",
        "Sponsor- og salgsavdeling",
        "Nasjonal kommersiell enhet",
      ],
      baseCost: 12500,
      baseWeeks: 3,
      minClubLevel: 2,
      minBase: "rentedPitch",
      kind: "department",
      description: "Marked, sponsorarbeid og supporterdata organiseres samlet.",
      benefits: [
        "Markedssjef + merkevare",
        "Kommersiell leder + CRM",
        "St\xF8rre sponsorverdi og ettersp\xF8rsel",
      ],
    },
    {
      id: "analyticsCenter",
      category: "Organisasjon",
      icon: "\u{1F4CA}",
      names: [
        "Digital klubbdrift",
        "Integrert analysesenter",
        "Datadrevet toppklubb",
      ],
      baseCost: 14500,
      baseWeeks: 4,
      minClubLevel: 2,
      minBase: "rentedPitch",
      kind: "department",
      description:
        "\xD8konomi, scouting og prestasjonsdata samles i moderne systemer.",
      benefits: ["\xD8konomisystem", "Scoutingdatabase", "Prestasjonsanalyse"],
    },
    {
      id: "clubOffice",
      category: "Organisasjon",
      icon: "\u{1F3E2}",
      names: [
        "Lite klubbkontor",
        "Profesjonell administrasjon",
        "Full klubbledelse",
      ],
      baseCost: 15500,
      baseWeeks: 4,
      minClubLevel: 2,
      minBase: "rentedBase",
      kind: "building",
      description:
        "Ledelse, \xF8konomi og stadiondrift bygges som en organisasjon.",
      benefits: [
        "CFO og grunnkontroll",
        "Stadionsjef og sportsdirekt\xF8r",
        "Full administrasjon og bedre styring",
      ],
    },
  ];
function gr() {
  return {
    trainingCenter: 0,
    medicalCenter: 0,
    academyProgram: 0,
    matchdayZone: 0,
    commercialHub: 0,
    stadiumExpansion: 0,
    analyticsCenter: 0,
    clubOffice: 0,
  };
}
function br(e) {
  const { upgrades: s, staff: n, systemInvestments: r } = e,
    c = (i, d, u) => (u ? 3 : d ? 2 : i ? 1 : 0);
  return {
    trainingCenter: c(
      s.training > 0 || n.headCoach > 0,
      n.offensiveCoach > 0 || n.defensiveCoach > 0,
      r.performanceLab > 0 && n.headCoach > 1,
    ),
    medicalCenter: c(
      s.medical > 0 || n.physio > 0,
      n.medicalDirector > 0,
      r.medicalAnalytics > 0 && n.physio > 1,
    ),
    academyProgram: c(
      s.academy > 0 || s.scouting > 0 || n.scout > 0,
      r.scoutingDb > 0,
      n.sportingDirector > 0 && r.scoutingDb > 0,
    ),
    matchdayZone: c(
      s.food > 0 || s.merch > 0,
      s.vip > 0,
      s.museum > 0 || s.merch >= 3,
    ),
    stadiumExpansion: c(
      s.seats > 0 || s.parking > 0,
      s.lights > 0,
      s.seats >= 3 && s.vip > 0,
    ),
    commercialHub: c(
      s.media > 0 || n.marketing > 0,
      n.commercialDirector > 0 || r.supporterCrm > 0,
      n.marketing > 1 && r.supporterCrm > 0,
    ),
    analyticsCenter: c(
      r.financeSuite > 0,
      r.scoutingDb > 0,
      r.performanceLab > 0,
    ),
    clubOffice: c(
      n.cfo > 0,
      n.stadiumManager > 0 || n.sportingDirector > 0,
      n.cfo > 1 && n.mediaOfficer > 0,
    ),
  };
}
const hr = [
  {
    id: "firstWin",
    title: "F\xF8rste seier",
    icon: "\u{1F3C6}",
    text: "Vinn din f\xF8rste kamp.",
    cash: 400,
  },
  {
    id: "fans5000",
    title: "Byens lag",
    icon: "\u{1F4E3}",
    text: "N\xE5 5 000 supportere.",
    cash: 1500,
  },
  {
    id: "cash100k",
    title: "Solid drift",
    icon: "\u{1F4B0}",
    text: "Ha $100 000 p\xE5 konto.",
    cash: 1e3,
  },
  {
    id: "star",
    title: "Stjernesignering",
    icon: "\u2B50",
    text: "Signer en spiller med 82+ overall.",
    cash: 1200,
  },
  {
    id: "champion",
    title: "Mester",
    icon: "\u{1F451}",
    text: "Vinn en finale.",
    cash: 3500,
  },
  {
    id: "stadium",
    title: "Klubbomr\xE5de",
    icon: "\u{1F3DF}\uFE0F",
    text: "N\xE5 18 totale fasilitetsniv\xE5er.",
    cash: 2e3,
  },
  {
    id: "legend",
    title: "Klubblegende",
    icon: "\u{1F3DB}\uFE0F",
    text: "F\xE5 en spiller i Hall of Fame.",
    cash: 2500,
  },
  {
    id: "world",
    title: "Verdensklasse",
    icon: "\u{1F30D}",
    text: "N\xE5 World League.",
    cash: 6e3,
  },
];
function b(e, s, n) {
  return Math.max(s, Math.min(n, e));
}
function ee(e) {
  return e[Math.floor(Math.random() * e.length)];
}
function be(e) {
  return `${e}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
function h(e) {
  const s = e < 0 ? "-" : "",
    n = Math.abs(e);
  return n >= 1e6
    ? `${s}$${(n / 1e6).toFixed(2)}M`
    : n >= 1e3
      ? `${s}$${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1)}K`
      : `${s}$${Math.round(n)}`;
}
function kr(e) {
  const s = e.replace("#", ""),
    n =
      s.length === 3
        ? s
            .split("")
            .map((r) => r + r)
            .join("")
        : s.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(n.slice(0, 2), 16) || 0,
    g: parseInt(n.slice(2, 4), 16) || 0,
    b: parseInt(n.slice(4, 6), 16) || 0,
  };
}
function vr(e) {
  const { r: s, g: n, b: r } = kr(e),
    c = (0.2126 * s + 0.7152 * n + 0.0722 * r) / 255;
  if (c >= 0.28) return { color: e, text: c > 0.67 ? "#0f172a" : "#ffffff" };
  const i = (u) => Math.round(u + (255 - u) * 0.38);
  return {
    color: `#${[i(s), i(n), i(r)].map((u) => u.toString(16).padStart(2, "0")).join("")}`,
    text: "#ffffff",
  };
}
function Z(e) {
  return e >= 1e6
    ? `${(e / 1e6).toFixed(2)}M`
    : e >= 1e3
      ? `${(e / 1e3).toFixed(1)}K`
      : `${Math.round(e)}`;
}
function Ha() {
  return new Date().toISOString().slice(0, 10);
}
function yr() {
  return {
    clubName: "",
    managerName: "",
    city: "Harbor City",
    stadiumName: "",
    motto: "Build. Fight. Win.",
    supporterName: "The North End",
    logo: "\u{1F6E1}\uFE0F",
    primaryColor: "#3b82f6",
    secondaryColor: "#f4c542",
    rivalName: "Westbridge Wolves",
    difficulty: "manager",
    strategy: "business",
    managerRole: "owner",
    region: "global",
    language: "nb",
  };
}
const Jn = [
    { name: "Hawks", logo: "\u{1F985}" },
    { name: "Wolves", logo: "\u{1F43A}" },
    { name: "Thunder", logo: "\u26A1" },
    { name: "Titans", logo: "\u2694\uFE0F" },
    { name: "Guardians", logo: "\u{1F6E1}\uFE0F" },
    { name: "Ravens", logo: "\u{1F426}\u200D\u2B1B" },
    { name: "Sharks", logo: "\u{1F988}" },
    { name: "Bulls", logo: "\u{1F402}" },
    { name: "Foxes", logo: "\u{1F98A}" },
    { name: "Kings", logo: "\u{1F451}" },
    { name: "Bears", logo: "\u{1F43B}" },
    { name: "Dragons", logo: "\u{1F409}" },
  ],
  Ua = [
    ["#2563eb", "#f4c542"],
    ["#0f766e", "#f8fafc"],
    ["#7c3aed", "#22d3ee"],
    ["#dc2626", "#f8fafc"],
    ["#0f172a", "#f59e0b"],
    ["#0891b2", "#f8fafc"],
    ["#be123c", "#fbbf24"],
    ["#1d4ed8", "#fb7185"],
  ],
  Ya = [
    "Rise Together",
    "Built for More",
    "One Club. One City.",
    "Earn Every Yard",
    "Fear No Rival",
    "Stronger Every Week",
    "Our City. Our Team.",
    "Build. Fight. Win.",
  ],
  za = [
    "The North End",
    "The Storm Front",
    "The Loyal Guard",
    "The Blue Wall",
    "The Red Line",
    "The City Faithful",
    "The Iron Stand",
    "The Thunder Crew",
  ],
  Ja = ["Field", "Arena", "Park", "Stadium", "Bowl", "Ground"];
function Pn(e) {
  return e.replace(/\s+(City|Bay|Harbor|Point|Coast)$/i, "").trim() || e;
}
function Qn(e) {
  const s = Ke[e.region],
    n = ee(s.cities),
    r = ee(Jn),
    c = ee(Ua),
    i = ee(s.teams.filter(([d]) => !d.startsWith(n)));
  return {
    ...e,
    city: n,
    clubName: `${n} ${r.name}`,
    managerName: `${ee(s.firstNames)} ${ee(s.lastNames)}`,
    stadiumName: `${Pn(n)} ${ee(Ja)}`,
    motto: ee(Ya),
    supporterName: ee(za),
    logo: r.logo,
    primaryColor: c[0],
    secondaryColor: c[1],
    rivalName: i?.[0] ?? s.teams[0][0],
  };
}
function Sr(e, s) {
  const n = Ke[e.region];
  if (s === "colors") {
    const r = ee(Ua);
    return { ...e, primaryColor: r[0], secondaryColor: r[1] };
  }
  return s === "clubName"
    ? { ...e, clubName: `${e.city || ee(n.cities)} ${ee(Jn).name}` }
    : s === "managerName"
      ? { ...e, managerName: `${ee(n.firstNames)} ${ee(n.lastNames)}` }
      : s === "city"
        ? { ...e, city: ee(n.cities) }
        : s === "stadiumName"
          ? { ...e, stadiumName: `${Pn(e.city || ee(n.cities))} ${ee(Ja)}` }
          : s === "motto"
            ? { ...e, motto: ee(Ya) }
            : s === "supporterName"
              ? { ...e, supporterName: ee(za) }
              : s === "logo"
                ? { ...e, logo: ee(Jn).logo }
                : { ...e, rivalName: ee(n.teams)[0] };
}
function Zn(e) {
  const s = e.clubName.trim().split(/\s+/).filter(Boolean);
  return s.length
    ? s
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "SE";
}
function Xn({ profile: e, className: s = "" }) {
  return a("div", {
    className: `generated-crest ${s}`,
    "aria-label": `${e.clubName || "Klubb"} logo`,
    children: [t("span", { children: e.logo }), t("b", { children: Zn(e) })],
  });
}
function wr() {
  return {
    seats: 0,
    vip: 0,
    food: 0,
    merch: 0,
    parking: 0,
    lights: 0,
    training: 0,
    medical: 0,
    academy: 0,
    scouting: 0,
    media: 0,
    museum: 0,
  };
}
function Mr() {
  return {
    headCoach: 0,
    offensiveCoach: 0,
    defensiveCoach: 0,
    physio: 0,
    scout: 0,
    cfo: 0,
    marketing: 0,
    commercialDirector: 0,
    sportingDirector: 0,
    stadiumManager: 0,
    mediaOfficer: 0,
    medicalDirector: 0,
  };
}
function Nr() {
  return {
    ticketing: 0,
    financeSuite: 0,
    scoutingDb: 0,
    supporterCrm: 0,
    performanceLab: 0,
    medicalAnalytics: 0,
  };
}
function Qa() {
  return {
    summaryReviewed: !1,
    contractsResolved: !1,
    draftResolved: !1,
    rosterReady: !1,
    budgetApproved: !1,
    sponsorsReviewed: !1,
  };
}
function wt(e) {
  return e.roster.filter((s) => s.contractYears <= 0);
}
function Dt(e) {
  return je.every((s) =>
    e.roster.some((n) => n.position === s && n.injuryWeeks <= 0),
  );
}
function Za(e) {
  return e.roster.length >= ve && Dt(e) && se(e) <= Wt(e);
}
function Ce(e) {
  return e.phase !== "offseason"
    ? e
    : {
        ...e,
        offseasonChecklist: {
          ...e.offseasonChecklist,
          contractsResolved: wt(e).length === 0,
          draftResolved: e.draftPicks <= 0,
          rosterReady: Za(e),
        },
      };
}
function dt(e, s, n = !1, r) {
  const c = b(Math.round(s), 1, 4),
    i = r
      ? $n(r, e).midpoint
      : Math.max(e.salary, 220 + Math.max(0, H(e) - 42) * 18),
    d = n ? 1.04 : 1.08,
    u = 1 - (c - 1) * 0.035,
    g = 0.95 + (100 - e.morale) / 550,
    k = Math.max(180, Math.round(i * d * u * g)),
    y = n ? 1.45 + c * 0.22 : 1.8 + c * 0.28,
    f = Math.max(450, Math.round(k * y));
  return { years: c, salary: k, signingBonus: f };
}
function Xa(e, s) {
  const n = H(s),
    r = [180, 300, 520, 850, 1300][e.leagueIndex] ?? 180,
    c =
      s.potential === "S"
        ? 180
        : s.potential === "A"
          ? 100
          : s.potential === "B"
            ? 45
            : 0,
    i = Math.max(
      190,
      Math.round(r + Math.max(0, n - 45) * (8 + e.leagueIndex * 4) + c),
    ),
    d = Math.max(500, Math.round(i * 2.2));
  return { years: 4, salary: i, signingBonus: d };
}
function es(e) {
  return je
    .map((s) => {
      const n = e.roster.filter((d) => d.position === s),
        r = [...n].sort((d, u) => H(u) - H(d))[0],
        c = n.length,
        i =
          (c === 0 ? 120 : c === 1 ? 75 : 0) + Math.max(0, 66 - (r ? H(r) : 0));
      return { position: s, depth: c, bestOverall: r ? H(r) : 0, score: i };
    })
    .sort((s, n) => n.score - s.score);
}
function Cr(e, s) {
  const n = es(e).find((c) => c.position === s.position),
    r =
      s.potential === "S"
        ? 18
        : s.potential === "A"
          ? 11
          : s.potential === "B"
            ? 5
            : 0;
  return H(s) + r + (n?.score ?? 0) * 0.9;
}
function ea(e, s) {
  const n = H(s),
    r = e.roster
      .filter((f) => f.position === s.position)
      .sort((f, N) => H(N) - H(f)),
    c = r.findIndex((f) => f.id === s.id) + 1,
    i = (s.salary / Math.max(1, e.boardGoals.salaryCap)) * 100,
    d =
      s.age <= 24 && s.potential !== "C"
        ? 4
        : s.age <= 29 && n >= 58
          ? 3
          : n >= 52
            ? 2
            : 1,
    u = s.starter || c <= 2 || s.potential === "A" || s.potential === "S",
    g = u
      ? s.contractYears <= 1
        ? "Forny kontrakten"
        : "Behold i troppen"
      : "Vurder salg eller frigivelse",
    k = u
      ? `${s.name} er rangert som nummer ${c} p\xE5 ${s.position} og passer best p\xE5 en ${d}-\xE5rig avtale.`
      : `${s.name} er langt bak i posisjonskampen. Klubben kan frigj\xF8re l\xF8nnsrom uten \xE5 svekke starterne mye.`,
    y = [
      `OVR ${n} \xB7 nummer ${c} av ${r.length} p\xE5 ${s.position}`,
      `L\xF8nn ${h(s.salary)}/uke \xB7 ${i.toFixed(1)}% av salary cap`,
      `${s.age} \xE5r \xB7 potensial ${s.potential} \xB7 form ${s.condition}%`,
    ];
  return { title: g, summary: k, reasons: y, recommendedYears: d, keep: u };
}
function ta(e) {
  let s = [...e.roster],
    n = e.cash,
    r = se(e);
  const c = [],
    i = [],
    d = [],
    u = Math.min(5e3, Math.max(1e3, Math.round(e.cash * 0.12))),
    g = s
      .filter((f) => f.contractYears <= 0)
      .sort((f, N) => Number(N.starter) - Number(f.starter) || H(N) - H(f)),
    k = (f, N) => {
      const w = dt(f, N, !0, e),
        v = n - w.signingBonus < u,
        terms = v
          ? { ...w, salary: Math.round(w.salary * 1.12), signingBonus: 0 }
          : w,
        D = r - f.salary + terms.salary;
      return D > Wt({ ...e, cash: n })
        ? !1
        : ((s = s.map((player) =>
            player.id === f.id
              ? {
                  ...player,
                  contractYears: terms.years,
                  salary: terms.salary,
                  morale: b(player.morale + 7, 0, 100),
                }
              : player,
          )),
          (n -= terms.signingBonus),
          (r = D),
          c.push({
            name: f.name,
            years: terms.years,
            bonus: terms.signingBonus,
            deferred: v,
          }),
          !0);
    };
  for (const f of g) {
    const N = ea({ ...e, roster: s }, f),
      w = s.filter(($) => $.position === f.position).length <= 1;
    (N.keep || w || s.length <= ve) &&
      !k(f, w && !N.keep ? 1 : N.recommendedYears) &&
      d.push(f.name);
  }
  for (const f of g) {
    const N = s.find(($) => $.id === f.id);
    if (!N || N.contractYears > 0) continue;
    const w = s.filter(($) => $.id !== f.id);
    if (w.length >= ve && je.every(($) => w.some((D) => D.position === $))) {
      ((s = w), (r -= f.salary), i.push(f.name));
      const $ = d.indexOf(f.name);
      $ >= 0 && d.splice($, 1);
    } else !d.includes(f.name) && !k(f, 1) && d.push(f.name);
  }
  const y = c.reduce((f, N) => f + N.bonus, 0);
  return {
    roster: s,
    cash: n,
    renewed: c,
    released: i,
    blocked: d,
    projectedSalary: r,
    totalBonus: y,
  };
}
function It(e, s) {
  const r =
      e.roster
        .filter((i) => i.position === s.position)
        .sort((i, d) => H(d) - H(i))
        .findIndex((i) => i.id === s.id) + 1,
    c = [...e.roster]
      .sort((i, d) => H(d) - H(i))
      .slice(0, 4)
      .some((i) => i.id === s.id);
  return s.captain || (s.starter && c)
    ? "N\xF8kkelspiller"
    : s.starter
      ? "Starter"
      : s.age <= 23 && (s.potential === "A" || s.potential === "S")
        ? "Talent"
        : r <= 2
          ? "Rotasjon"
          : ea(e, s).keep
            ? "Reserve"
            : "B\xF8r frigis";
}
function ts(e) {
  const s = e.history[e.history.length - 1];
  if (!s) return e.leagueIndex;
  if (s.result === "Mester" && e.leagueIndex < le.length - 1)
    return e.leagueIndex + 1;
  const n = Number(s.result.match(/^(\d+)\./)?.[1] ?? 0),
    r = e.leagueTeams.length + 1;
  return n >= r && e.leagueIndex > 0 ? e.leagueIndex - 1 : e.leagueIndex;
}
function Gt(e) {
  const s = Ce(e).offseasonChecklist,
    n = se(e),
    r = me(e),
    c = pe(e, n, yt(e));
  return [
    s.summaryReviewed ? "" : "les sesongoppsummeringen",
    s.contractsResolved ? "" : "avgj\xF8r utl\xF8pende kontrakter",
    s.draftResolved ? "" : "bruk eller avslutt draftvalgene",
    s.sponsorsReviewed ? "" : "g\xE5 gjennom sponsoravtalene",
    e.roster.length < ve || !Dt(e)
      ? `registrer minst ${ve} spillere og dekk alle posisjoner`
      : "",
    n > e.boardGoals.salaryCap
      ? `reduser spillerl\xF8nnen under salary cap p\xE5 ${h(e.boardGoals.salaryCap)}`
      : "",
    n > r
      ? `reduser spillerl\xF8nnen til klubbens b\xE6rekraftige budsjett p\xE5 ca. ${h(r)}`
      : "",
    e.cash < 0
      ? "skaff positiv kontantbeholdning gjennom salg, sponsor eller krisel\xE5n"
      : "",
    ...(e.history[e.history.length - 1]?.result === "Mester" ? Pr(e) : []),
    c.profit < 0 && (c.runwayWeeks ?? 99) < 6
      ? "sikre minst 6 ukers kontantbuffer f\xF8r sesongstart"
      : "",
  ].filter(Boolean);
}
function rn(e) {
  const s = se(e),
    n = e.boardGoals.salaryCap;
  return {
    used: s,
    cap: n,
    space: n - s,
    percentage: b((s / Math.max(1, n)) * 100, 0, 140),
  };
}
function ns(e) {
  return e.settings.careerPace === "fast"
    ? 1.18
    : e.settings.careerPace === "long"
      ? 0.68
      : 1;
}
function na(e) {
  return e === 0 ? "top4" : e <= 2 ? "top6" : "top8";
}
function as(e) {
  return na(e) === "top4" ? 4 : na(e) === "top6" ? 6 : 8;
}
function Pr(e, s = e.leagueIndex + 1) {
  if (s <= e.leagueIndex || s >= le.length) return [];
  const n = [
    { fans: 250, profile: 15, base: 1, cash: 0, label: "fast klubbbase" },
    {
      fans: 850,
      profile: 32,
      base: 2,
      cash: 1e4,
      label: "langtidsleid anlegg",
    },
    {
      fans: 2500,
      profile: 52,
      base: 2,
      cash: 35e3,
      label: "profesjonell arena og reserve",
    },
    {
      fans: 8e3,
      profile: 72,
      base: 3,
      cash: 1e5,
      label: "eget klubbomr\xE5de",
    },
  ][s - 1];
  return n
    ? [
        e.fans < n.fans ? `n\xE5 ${Z(n.fans)} supportere` : "",
        e.reputation < n.profile ? `n\xE5 klubbprofil ${n.profile}` : "",
        rt(e) < n.base ? `skaff ${n.label}` : "",
        e.cash < n.cash ? `ha minst ${h(n.cash)} i reserve` : "",
      ].filter(Boolean)
    : [];
}
function aa(e) {
  return (
    e.boardTrust < 30 ||
    e.cash < -12e3 ||
    getDebtSnapshot(e).totalDebt > Math.max(15e4, e.clubValue * 0.7)
  );
}
function $r(e) {
  if (!e.boardMeeting || aa(e)) return e;
  const s =
      e.boardStrategy === "sporting"
        ? "transfer"
        : e.boardStrategy === "youth"
          ? "academy"
          : e.boardStrategy === "commercial"
            ? "commercial"
            : e.boardStrategy === "infrastructure"
              ? "stadium"
              : "reserve",
    n =
      e.boardMeeting.choices.find((c) => c.id === s) ??
      e.boardMeeting.choices[0];
  if (!n) return { ...e, boardMeeting: void 0 };
  let r = {
    ...e,
    boardMeeting: void 0,
    nextBoardMeetingWeek: Math.min(oe, e.week + 6),
  };
  return (
    n.id === "commercial" &&
      (r = {
        ...r,
        reputation: b(r.reputation + 1, 0, 100),
        sponsorOffers: ut(
          b(r.reputation + 1, 0, 100),
          r.leagueIndex,
          r.upgrades.media + r.staff.marketing,
          r.profile.region,
          r.fans,
          r.clubBase,
        ),
      }),
    n.id === "academy" &&
      (r = {
        ...r,
        cash: r.cash + 2500,
        reputation: b(r.reputation + 1, 0, 100),
      }),
    n.id === "stadium" && (r = { ...r, cash: r.cash + 3e3 }),
    n.id === "transfer" && (r = { ...r, cash: r.cash + 2500 }),
    n.id === "reserve" &&
      (() => {
        const c = addManualLoan(r, {
          id: be("board-bridge"),
          productId: "board",
          label: "Styrets overgangslån",
          cashAmount: 4e3,
          balance: 5e3,
          annualRate: 0.22,
          termWeeks: 18,
        });
        c.ok && (r = c.game);
      })(),
    n.id === "salary" &&
      (r = {
        ...r,
        boardGoals: {
          ...r.boardGoals,
          salaryCap: r.boardGoals.salaryCap + 1500,
        },
      }),
    A(r, [
      `\u{1F916} Assistenten h\xE5ndterte rutinem\xF8tet i styret: ${n.label}.`,
    ])
  );
}
function ss(e) {
  if (e.settings.sponsorAutomation === "off") return e;
  let s = e;
  const n = ["main", "kit", "boards", "stadium"],
    r = [];
  for (const c of n) {
    const i = _e(s, c);
    if (i && (i.seasonsLeft ?? 1) <= 0) {
      const d = ia(
          s,
          i,
          e.settings.sponsorAutomation === "optimize" ? "balanced" : "safe",
        ),
        u = {
          ...i,
          weeklyPay: d.weeklyPay,
          signingBonus: d.renewalBonus,
          seasons: d.extension,
          seasonsLeft: d.extension,
          weeks: d.extension * oe,
          weeksLeft: d.extension * oe,
          relationship: b((i.relationship ?? 60) + 3, 0, 100),
          seasonsTogether: (i.seasonsTogether ?? 0) + 1,
          renewalPending: !1,
          negotiated: !0,
        };
      ((s = ls(s, c, u)),
        (s = { ...s, cash: s.cash + d.renewalBonus }),
        r.push(
          `${we(c)} med ${i.name} ble fornyet i ${d.extension} sesong${d.extension === 1 ? "" : "er"}.`,
        ));
      continue;
    }
    if (!i && Xe(s, c)) {
      const d = s.sponsorOffers.filter(
        (u) =>
          u.slot === c &&
          s.reputation >= u.minReputation &&
          pe(s).expectedAttendance >= u.minAttendance,
      );
      if (d.length) {
        const u = [...d].sort((k, y) =>
            e.settings.sponsorAutomation === "optimize"
              ? y.weeklyPay - k.weeklyPay
              : y.supporterApproval +
                y.weeklyPay / 500 -
                (k.supporterApproval + k.weeklyPay / 500),
          )[0],
          g = {
            ...u,
            weeksLeft: u.seasons * oe,
            seasonsLeft: u.seasons,
            negotiated: !1,
            breachWeeks: 0,
            relationship: 58,
            seasonsTogether: 0,
            renewalPending: !1,
          };
        ((s = ls(s, c, g)),
          (s = {
            ...s,
            cash: s.cash + u.signingBonus,
            sponsorOffers: s.sponsorOffers.filter((k) => k.id !== u.id),
          }),
          r.push(`${we(c)} ble fylt med ${u.name}.`));
      }
    }
  }
  return (
    r.length &&
      (s = A(
        s,
        r.map((c) => `\u{1F91D} ${c}`),
      )),
    {
      ...s,
      offseasonChecklist: { ...s.offseasonChecklist, sponsorsReviewed: !0 },
    }
  );
}
function H(e) {
  const s = ["DL", "LB", "CB", "S"].includes(e.position),
    n = e.position === "OL",
    r = s
      ? e.defense * 0.58 + e.attack * 0.14 + e.stamina * 0.28
      : n
        ? e.attack * 0.34 + e.defense * 0.28 + e.stamina * 0.38
        : e.position === "K"
          ? e.attack * 0.68 + e.stamina * 0.24 + e.defense * 0.08
          : e.attack * 0.56 + e.defense * 0.16 + e.stamina * 0.28;
  return b(Math.round(r), 1, 99);
}
function rs(e) {
  return e.potential === "S"
    ? 1.34
    : e.potential === "A"
      ? 1.2
      : e.potential === "B"
        ? 1.08
        : 0.96;
}
function Fe(e, s) {
  const n = H(s),
    r =
      s.age <= 22
        ? 1.3
        : s.age <= 26
          ? 1.17
          : s.age <= 30
            ? 1
            : s.age <= 33
              ? 0.82
              : 0.63,
    c = 0.78 + s.condition / 310 + s.morale / 520,
    i = 0.72 + Math.min(4, Math.max(0, s.contractYears)) * 0.1,
    d = 0.72 + e.leagueIndex * 0.34,
    u = 0.92 + e.reputation / 360,
    g = 1 + s.careerAwards * 0.06,
    k = s.injuryWeeks > 0 ? 0.84 : s.personality === "Skadeutsatt" ? 0.9 : 1,
    y = Math.max(s.value, 1300 + n * n * 4.7),
    f = Math.round(y * rs(s) * r * c * i * d * u * g * k),
    N = b(
      0.22 -
        e.upgrades.scouting * 0.018 -
        e.staff.scout * 0.025 -
        e.systemInvestments.scoutingDb * 0.02,
      0.06,
      0.22,
    );
  return {
    low: Math.round(f * (1 - N)),
    high: Math.round(f * (1 + N)),
    midpoint: f,
  };
}
function $n(e, s) {
  const n = H(s),
    r =
      It(e, s) === "N\xF8kkelspiller"
        ? 1.18
        : s.starter
          ? 1.04
          : s.age <= 23
            ? 0.78
            : 0.88,
    c = [210, 390, 720, 1150, 1850][e.leagueIndex] ?? 210,
    i = Math.round(
      (c + Math.max(0, n - 42) * (18 + e.leagueIndex * 8)) * rs(s) * r,
    );
  return { low: Math.round(i * 0.88), high: Math.round(i * 1.12), midpoint: i };
}
function xn(e, s) {
  const n = $n(e, s).midpoint,
    r = s.salary / Math.max(1, n);
  return r <= 0.78
    ? { label: "Sv\xE6rt god avtale", className: "good" }
    : r <= 1.04
      ? { label: "Markedsriktig", className: "neutral" }
      : r <= 1.28
        ? { label: "Dyr avtale", className: "warning" }
        : { label: "Sv\xE6rt dyr", className: "danger" };
}
function xr(e, s) {
  const n = e.roster
      .filter((c) => c.position === s.position)
      .sort((c, i) => H(i) - H(c)),
    r = n.findIndex((c) => c.id === s.id);
  return s.captain || (s.starter && r === 0 && n.length <= 2)
    ? "Sv\xE6rt h\xF8y"
    : s.starter || r === 0
      ? "H\xF8y"
      : s.age <= 23 && ["A", "S"].includes(s.potential)
        ? "Utviklingsverdi"
        : n.length >= 3
          ? "Lav"
          : "Middels";
}
function Mt(e = 1, s) {
  const n = s?.region ?? "global",
    r = Ke[n],
    c = s?.position ?? ee(Va),
    i = 43 + e * 8 + Math.floor(Math.random() * 16),
    d = ["QB", "RB", "WR", "TE", "OL", "K"].includes(c) ? 8 : -3,
    u = ["DL", "LB", "CB", "S"].includes(c) ? 10 : c === "OL" ? 4 : -2,
    g = s?.age ?? 19 + Math.floor(Math.random() * 14),
    k = Math.random() + e * 0.07,
    y = k > 1.12 ? "S" : k > 0.82 ? "A" : k > 0.48 ? "B" : "C",
    f = g >= 31 ? "Veteran" : y === "S" ? "Stortalent" : ee(mr),
    N = b(i + d + Math.floor(Math.random() * 9 - 4), 25, 97),
    w = b(i + u + Math.floor(Math.random() * 9 - 4), 22, 97),
    v = b(i + Math.floor(Math.random() * 13 - 5), 28, 98),
    $ = Math.round((N + w + v) / 3);
  return {
    id: be("player"),
    name: `${ee(r.firstNames)} ${ee(r.lastNames)}`,
    position: c,
    attack: N,
    defense: w,
    stamina: v,
    potential: y,
    age: g,
    morale: 66 + Math.floor(Math.random() * 25),
    condition: 76 + Math.floor(Math.random() * 24),
    salary: Math.round(450 + $ * 19 + e * 210),
    value: Math.round(2e3 + $ * $ * 3.2 + e * 1500),
    contractYears: 1 + Math.floor(Math.random() * 3),
    injuryWeeks: 0,
    personality: f,
    chemistry: 55 + Math.floor(Math.random() * 35),
    starter: s?.starter ?? !1,
    captain: !1,
    revealed: s?.revealed ?? 100,
    hometown: ee(r.cities),
    careerGames: 0,
    careerAwards: 0,
    seasonStats: void 0,
    careerStats: void 0,
    seasonHistory: [],
    locked: !1,
  };
}
function os(e = "global") {
  const s = je.map((g) =>
      Mt(0, { position: g, starter: !0, revealed: 100, region: e }),
    ),
    n = je.map((g) =>
      Mt(0, { position: g, starter: !1, revealed: 100, region: e }),
    ),
    r = ["WR", "RB", "DL", "CB"].map((g) =>
      Mt(0, {
        position: g,
        starter: !1,
        revealed: 100,
        age: 19 + Math.floor(Math.random() * 4),
        region: e,
      }),
    ),
    c = [...s, ...n, ...r].map((g) => {
      const k = g.starter ? 0.25 : g.age <= 23 ? 0.13 : 0.17;
      return {
        ...g,
        salary: Math.max(120, Math.round(g.salary * k)),
        value: Math.max(1500, Math.round(g.value * 0.34)),
        contractYears: 2,
      };
    }),
    i = 5400,
    d = c.reduce((g, k) => g + k.salary, 0),
    u = d > 0 ? i / d : 1;
  return c.map((g) => ({
    ...g,
    salary: Math.max(110, Math.round(g.salary * u)),
  }));
}
function jr(e, s, n, r) {
  const c = Mt(Math.max(0, e - 1), {
      position: s,
      revealed: n,
      region: r,
      age: 22 + Math.floor(Math.random() * 10),
    }),
    i = 7 + Math.max(0, e - 1) * 2;
  return {
    ...c,
    attack: b(c.attack - i, 25, 90),
    defense: b(c.defense - i, 22, 90),
    stamina: b(c.stamina - Math.max(4, i - 2), 28, 92),
    potential: Math.random() < 0.18 ? "B" : "C",
    personality: c.age >= 29 ? "Veteran" : "Arbeidsjern",
    salary: Math.max(150, Math.round(180 + e * 90 + Math.random() * 150)),
    value: Math.max(1200, Math.round(c.value * 0.42)),
    contractYears: 0,
    starter: !1,
  };
}
function sa(e, s, n, r) {
  const c = [...e];
  for (const i of je)
    c.some((u) => u.position === i && H(u) <= 56 + s * 5) ||
      c.push(jr(s, i, n, r));
  return c;
}
function vt(e, s, n, r = "global") {
  const c = Math.max(1, e + Math.floor((s + n) / 3)),
    i = b(38 + s * 10 + n * 12, 35, 100),
    d = Array.from({ length: 12 }, (u, g) =>
      Mt(g < 3 ? c + 1 : c, { revealed: i, region: r }),
    );
  return sa(d, e, i, r);
}
function is(e, s, n, r = "global") {
  const c = Math.max(1, e + Math.floor((s + n) / 3));
  return Array.from({ length: 14 }, (i, d) =>
    Mt(d < 4 ? c + 1 : c, {
      age: 19 + Math.floor(Math.random() * 4),
      revealed: b(30 + n * 14 + s * 8, 30, 100),
      region: r,
    }),
  );
}
function ra(e, s, n = "global") {
  const r = le[e].basePower,
    c = an(e),
    i = Ke[n],
    d = [...i.teams].sort(() => Math.random() - 0.5).slice(0, 7);
  return (
    d.some(([u]) => u === s) || (d[0] = [s, "\u{1F525}"]),
    d.map(([u, g], k) => {
      const y = b(
          Math.round(
            c.target +
              (Math.random() - 0.5) * (c.max - c.min) * 0.75 +
              (k - 3) * 0.35,
          ),
          c.min,
          c.max,
        ),
        f = b(Math.round(y + (Math.random() - 0.5) * 9), c.min - 5, c.max + 2),
        N = b(Math.round(y + (Math.random() - 0.5) * 9), c.min - 5, c.max + 2),
        w = b(Math.round(y + (Math.random() - 0.5) * 7), c.min - 5, c.max + 2),
        v = 62 + Math.floor(Math.random() * 27),
        $ = 58 + Math.floor(Math.random() * 30);
      return ct(
        {
          id: be("team"),
          name: u,
          logo: g,
          power: y,
          wins: 0,
          losses: 0,
          attack: f,
          defense: N,
          stamina: w,
          morale: v,
          chemistry: $,
          mediaProfile: Math.round(35 + e * 14 + Math.random() * 32),
          pointsFor: 0,
          pointsAgainst: 0,
          form: [],
          budget: Math.round(3e4 + r * 2e3 * Math.random()),
          stadiumLevel: 1 + Math.floor(Math.random() * 5),
          coachName: `${ee(i.firstNames)} ${ee(i.lastNames)}`,
          strategy: ee(["youth", "spender", "balanced", "defensive", "draft"]),
          rosterValue: Math.round(
            11e4 + e * 18e4 + y * 2100 * (0.8 + Math.random() * 0.4),
          ),
          payroll: Math.round(le[e].salaryCap * (0.56 + Math.random() * 0.3)),
          transferActivity: "Bygger troppen",
        },
        e,
      );
    })
  );
}
function Br(e, s, n) {
  const r = Ke[n],
    c = an(s);
  return e.map((i) => {
    const d = ct(i, s),
      u = d.budget > 8e4 ? 1.5 : d.budget < 35e3 ? -1.5 : 0,
      g = (Math.random() - 0.5) * 6,
      k = (c.target - d.power) * 0.22,
      y = b(Math.round(u + g + k), -4, 4),
      f = Math.random() < 0.2,
      N = b(d.attack - d.defense, -12, 12),
      w = b(d.power + y, c.min, c.max),
      v = {
        ...d,
        attack: b(
          Math.round(w + N * 0.32 + (Math.random() - 0.5) * 2),
          c.min - 5,
          c.max + 2,
        ),
        defense: b(
          Math.round(w - N * 0.32 + (Math.random() - 0.5) * 2),
          c.min - 5,
          c.max + 2,
        ),
        stamina: b(
          Math.round(w + (Math.random() - 0.5) * 3),
          c.min - 5,
          c.max + 2,
        ),
        morale: b(d.morale + Math.round((Math.random() - 0.5) * 9), 45, 94),
        chemistry: b(
          d.chemistry + Math.round((Math.random() - 0.5) * 7),
          45,
          94,
        ),
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        form: [],
        mediaProfile: b(
          (d.mediaProfile ?? 50) + Math.round((Math.random() - 0.45) * 5),
          20,
          100,
        ),
        budget: Math.max(
          18e3,
          Math.round(d.budget * (0.88 + Math.random() * 0.28)),
        ),
        stadiumLevel: d.stadiumLevel + (Math.random() < 0.18 ? 1 : 0),
        coachName: f ? `${ee(r.firstNames)} ${ee(r.lastNames)}` : d.coachName,
        strategy:
          d.strategy ??
          ee(["youth", "spender", "balanced", "defensive", "draft"]),
        rosterValue: Math.max(
          6e4,
          Math.round(
            (d.rosterValue ?? 14e4) * (0.9 + Math.random() * 0.24) + y * 5e3,
          ),
        ),
        payroll: b(
          Math.round(
            (d.payroll ?? le[s].salaryCap * 0.68) *
              (0.94 + Math.random() * 0.14),
          ),
          Math.round(le[s].salaryCap * 0.48),
          le[s].salaryCap,
        ),
        transferActivity:
          y >= 3
            ? "Forsterket troppen"
            : y <= -2
              ? "Mistet n\xF8kkelspillere"
              : Math.random() < 0.45
                ? "Satser p\xE5 unge"
                : "Stabil offseason",
        worldProfile: {
          ...(d.worldProfile ?? {}),
          lastPowerChange: Math.round((w - d.power) * 10) / 10,
        },
      };
    return ct(v, s);
  });
}
function oa(e) {
  return Array.from({ length: oe }, (s, n) => ({
    week: n + 1,
    opponentId: e[n % e.length].id,
    home: n % 2 === 0 || Math.random() > 0.55,
    played: !1,
  }));
}
function Ar(e, s) {
  return { main: [0, 42], kit: [35, 58], boards: [50, 72], stadium: [65, 84] }[
    e
  ][s ? 1 : 0];
}
function Rr(e, s) {
  return e === "main"
    ? s
      ? 3
      : 2
    : e === "kit"
      ? s
        ? 2
        : 1
      : e === "boards"
        ? s
          ? 4
          : 2
        : s
          ? 6
          : 4;
}
function Ve(e) {
  return e.activeDevelopmentProjects?.length
    ? e.activeDevelopmentProjects
    : e.activeDevelopmentProject
      ? [e.activeDevelopmentProject]
      : [];
}
function on(e) {
  const s = b(rt(e) + 1, 1, 4),
    n = e.staff.stadiumManager >= 2 || e.staff.cfo >= 2 ? 1 : 0;
  return b(s + n, 1, 4);
}
function Ot(e) {
  return et(e).category;
}
function Kt(e) {
  return e.season * 20 + e.week;
}
function jn(e) {
  if (!e) return;
  const s = Math.max(
    0,
    (e.seasonsLeft ?? Math.max(1, Math.ceil((e.weeksLeft ?? e.weeks) / oe))) -
      1,
  );
  return { ...e, seasonsLeft: s, weeksLeft: s * oe, renewalPending: s === 0 };
}
function Bn(e) {
  if (e)
    return (e.seasonsLeft ?? 1) <= 0 ? void 0 : { ...e, renewalPending: !1 };
}
function ut(e, s, n, r = "global", c = 0, i = "rentedPitch") {
  const d = Be(i),
    u = Math.sqrt(Math.max(0, c)) * 28,
    g = 520 + s * 1450 + e * 24 + n * 240 + u + d.rank * 420,
    k = Ke[r].cities.map(Pn),
    y = {
      main: [
        { name: `${ee(k)} Community Bank`, category: "finance", approval: 3 },
        { name: `${ee(k)} Auto Group`, category: "local", approval: 2 },
        { name: "Northstar Logistics", category: "logistics", approval: 1 },
        { name: "Summit Systems", category: "tech", approval: 2 },
        { name: "BluePeak Finance", category: "finance", approval: -2 },
      ],
      kit: [
        { name: "Victory Athletic", category: "sportswear", approval: 4 },
        { name: "Apex Teamwear", category: "sportswear", approval: 3 },
        { name: "Northline Sports", category: "sportswear", approval: 2 },
        { name: "Forge Performance Gear", category: "sportswear", approval: 1 },
      ],
      boards: [
        { name: `${ee(k)} Grill`, category: "food", approval: 5 },
        { name: "CloudNine Media", category: "media", approval: 1 },
        { name: "Vertex Mobile", category: "tech", approval: 0 },
        { name: `${ee(k)} Insurance`, category: "local", approval: 2 },
      ],
      stadium: [
        { name: "Velocity Energy", category: "tech", approval: -2 },
        { name: "Summit Group", category: "finance", approval: 1 },
        {
          name: "Northstar Infrastructure",
          category: "logistics",
          approval: 2,
        },
      ],
    };
  return [
    { slot: "main", count: 2 },
    { slot: "kit", count: 2 },
    { slot: "boards", count: 1 },
    { slot: "stadium", count: 1 },
  ].flatMap(({ slot: N, count: w }) =>
    [...y[N]]
      .sort(() => Math.random() - 0.5)
      .slice(0, w)
      .map(($, D) => {
        const x = Math.round(
            g *
              (N === "stadium"
                ? 2.35
                : N === "main"
                  ? 1.45
                  : N === "kit"
                    ? 0.92
                    : 0.7) *
              (0.84 + D * 0.11),
          ),
          R = D > 0,
          E = Ar(N, R),
          T =
            N === "stadium"
              ? Math.max(1400, 2e3 + s * 1500)
              : N === "main"
                ? 55 + s * 220 + D * 120
                : N === "boards"
                  ? 220 + s * 260
                  : N === "kit" && D > 0
                    ? 120 + s * 180
                    : 0,
          Y = Rr(N, D > 0),
          ae = oe * Y;
        return {
          id: be("sponsor"),
          name: $.name,
          slot: N,
          category: $.category,
          weeklyPay: x,
          signingBonus: Math.round(x * (N === "stadium" ? 2.5 : 1.2)),
          winBonus: Math.round(x * (N === "main" ? 1.4 : 0.45)),
          playoffBonus: Math.round(x * (N === "main" ? 4.5 : 1.8)),
          titleBonus: Math.round(x * (N === "stadium" ? 12 : 8)),
          weeks: ae,
          seasons: Y,
          minReputation: E,
          minAttendance: T,
          fanEffect: 0,
          supporterApproval: $.approval,
          description:
            N === "stadium"
              ? "Navnerettigheter fra en stor, langsiktig partner."
              : N === "kit"
                ? "Sportsmerke som leverer drakter og klubbkolleksjon."
                : N === "boards"
                  ? "Reklamepartner for stadionflater og digital eksponering."
                  : "Klubbens viktigste kommersielle partner.",
          requirement:
            T > 0
              ? `Forventet publikum minst ${Z(T)}`
              : `Klubbprofil minst ${E}`,
        };
      }),
  );
}
function we(e) {
  return e === "main"
    ? "Hovedsponsor"
    : e === "kit"
      ? "Lokal partner"
      : e === "boards"
        ? "Arenapartner"
        : "Stadionnavn";
}
function _e(e, s) {
  return s === "main"
    ? e.activeSponsor
    : s === "kit"
      ? e.equipmentSponsor
      : s === "boards"
        ? e.boardsSponsor
        : e.stadiumSponsor;
}
function ls(e, s, n) {
  return s === "main"
    ? { ...e, activeSponsor: n }
    : s === "kit"
      ? { ...e, equipmentSponsor: n }
      : s === "boards"
        ? { ...e, boardsSponsor: n }
        : { ...e, stadiumSponsor: n };
}
function Le(e) {
  return [
    e.activeSponsor,
    e.equipmentSponsor,
    e.boardsSponsor,
    e.stadiumSponsor,
  ].filter(Boolean);
}
function ia(e, s, n) {
  const r = s.relationship ?? 60,
    c = 1 + e.reputation / 220 + e.leagueIndex * 0.11 + Math.sqrt(e.fans) / 170,
    i = Math.round(s.weeklyPay * b(c, 1.05, 1.7)),
    d =
      n === "accept" || n === "safe"
        ? {
            label: "Trygg fornyelse",
            multiplier: 0.96,
            chance: 0.94,
            bonus: 1.15,
            relationRisk: "Lav",
          }
        : n === "balanced"
          ? {
              label: "Markedsverdi",
              multiplier: 1.08,
              chance: 0.68,
              bonus: 1.35,
              relationRisk: "Moderat",
            }
          : {
              label: "Ambisi\xF8st krav",
              multiplier: 1.22,
              chance: 0.4,
              bonus: 1.55,
              relationRisk: "H\xF8y",
            },
    u =
      e.staff.commercialDirector * 0.05 +
      e.staff.marketing * 0.025 +
      e.staff.cfo * 0.02,
    g = b(
      d.chance + r / 500 + u - (e.profile.difficulty === "hardcore" ? 0.08 : 0),
      0.18,
      0.97,
    ),
    k = Math.round(i * d.multiplier),
    y = b(
      (s.slot === "stadium"
        ? 4
        : s.slot === "boards"
          ? 3
          : s.slot === "main"
            ? 2
            : 1) +
        (r >= 78 ? 1 : 0) +
        (n === "safe" ? 1 : n === "aggressive" ? -1 : 0),
      1,
      6,
    ),
    f = Math.round(k * d.bonus);
  return {
    ...d,
    chance: Math.round(g * 100),
    weeklyPay: k,
    extension: y,
    renewalBonus: f,
    totalValue: k * oe * y + f,
  };
}
function ln(e) {
  return e.stadiumSponsor
    ? `${e.stadiumSponsor.name} Arena`
    : e.profile.stadiumName;
}
function Xe(e, s) {
  return s === "main"
    ? !0
    : s === "kit"
      ? e.reputation >= 35 || rt(e) >= 1
      : s === "boards"
        ? rt(e) >= 2 && (e.fans >= 850 || e.leagueIndex >= 2)
        : rt(e) >= 3 && e.reputation >= 65;
}
function la(e) {
  return e === "main"
    ? "Hovedsponsor er alltid tilgjengelig."
    : e === "kit"
      ? "Krever klubbprofil 35 eller leid klubbbase."
      : e === "boards"
        ? "Krever langtidsleid anlegg og 850 supportere, eller National League."
        : "Krever eget klubbomr\xE5de og klubbprofil 65.";
}
function ca(e) {
  return {
    id: be("sponsor"),
    name: `${Pn(e.city)} Community Partner`,
    slot: "main",
    category: "local",
    weeklyPay: 900,
    signingBonus: 0,
    winBonus: 160,
    playoffBonus: 750,
    titleBonus: 1800,
    weeks: 24,
    seasons: 2,
    weeksLeft: 24,
    seasonsLeft: 2,
    minReputation: 0,
    minAttendance: 0,
    fanEffect: 1,
    supporterApproval: 1,
    description:
      "En enkel grunnavtale som gir den nye klubben et realistisk \xF8konomisk fundament.",
    requirement: "Bygg lokal supporterbase og fullf\xF8r sesongen",
    negotiated: !1,
    breachWeeks: 0,
    relationship: 68,
    seasonsTogether: 0,
  };
}
function An(e, s) {
  if (!e?.name) return;
  const n = e.weeklyPay ?? 0;
  return {
    id: e.id ?? be("sponsor"),
    name: e.name,
    slot: e.slot ?? s,
    category: e.category ?? "local",
    weeklyPay: n,
    signingBonus: e.signingBonus ?? Math.round(n * 2),
    winBonus: e.winBonus ?? Math.round(n * 1.2),
    playoffBonus: e.playoffBonus ?? Math.round(n * 3),
    titleBonus: e.titleBonus ?? Math.round(n * 7),
    weeks: e.weeks ?? e.weeksLeft ?? oe,
    seasons:
      e.seasons ?? Math.max(1, Math.ceil((e.weeks ?? e.weeksLeft ?? oe) / oe)),
    weeksLeft: e.weeksLeft ?? e.weeks ?? oe,
    seasonsLeft:
      e.seasonsLeft ??
      Math.max(1, Math.ceil((e.weeksLeft ?? e.weeks ?? oe) / oe)),
    minReputation: e.minReputation ?? 0,
    minAttendance: e.minAttendance ?? 0,
    fanEffect: e.fanEffect ?? 0,
    supporterApproval: e.supporterApproval ?? 0,
    description: e.description ?? "Migrert sponsoravtale.",
    requirement: e.requirement ?? "Eksisterende avtale",
    negotiated: e.negotiated ?? !1,
    breachWeeks: e.breachWeeks ?? 0,
    relationship: e.relationship ?? 60,
    seasonsTogether: e.seasonsTogether ?? 0,
    renewalPending: e.renewalPending ?? !1,
  };
}
function Ft(e, s, n, r = 47) {
  const c = [8, 30, 90, 260, 700][s] ?? 8,
    i = 1.14 + Math.min(0.08, e * 0.008),
    d = Math.round(r * i + c),
    u = 4 + Math.min(3, s) + (n === "trophies" ? 1 : n === "survival" ? -1 : 0);
  return {
    wins: b(u, 3, 9),
    fans: Math.max(r + 5, d),
    cash: Math.round(18e3 + s * 35e3 + e * 3e3),
    salaryCap: le[s].salaryCap,
    youngStarts: n === "youth" ? 4 : 3,
    stadiumLevels: Math.round(5 + s * 3 + Math.min(5, e)),
  };
}
function cs(e, s = 47) {
  const n = Math.max(4, Math.round(s * 0.06)),
    r = [
      { id: "wins", title: "Vinn 2 kamper", target: 2, reward: 900 + e * 100 },
      {
        id: "fans",
        title: `F\xE5 ${n} nye supportere`,
        target: n,
        reward: 750 + e * 90,
      },
      {
        id: "profit",
        title: "Tjen $5K i overskudd",
        target: 5e3,
        reward: 1100 + e * 120,
      },
    ];
  return { ...ee(r), progress: 0, claimed: !1 };
}
function Rn() {
  const e = yr(),
    s = ra(0, e.rivalName, e.region);
  return {
    version: 22,
    phase: "setup",
    seasonStage: "regular",
    profile: e,
    cash: 15e3,
    debt: 0,
    loans: [],
    lastDebtPayment: void 0,
    rescueUsedSeason: 0,
    fans: 75,
    fanGroups: { loyal: 20, casual: 38, family: 14, vip: 3 },
    fanSatisfactionScore: 70,
    mediaReach: 110,
    demandMomentum: 0,
    reputation: 0,
    boardTrust: 76,
    boardStrategy: "financial",
    boardBudget: {
      players: 42,
      staff: 18,
      facilities: 16,
      commercial: 14,
      reserve: 10,
    },
    boardTrustAreas: { sporting: 72, financial: 78, culture: 74 },
    nextBoardMeetingWeek: 6,
    trophies: 0,
    famePoints: 0,
    clubValue: 25e3,
    season: 1,
    seasonStartFans: 75,
    seasonStartCash: 15e3,
    week: 1,
    wins: 0,
    losses: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    leagueIndex: 0,
    selectedTactic: "balanced",
    trainingPlan: "balanced",
    pricing: { ticket: 8, merch: 22, food: 6 },
    upgrades: wr(),
    staff: Mr(),
    systemInvestments: Nr(),
    completedProjects: gr(),
    activeDevelopmentProject: void 0,
    activeDevelopmentProjects: [],
    clubBase: "rentedPitch",
    stadiumOwnership: "rented",
    stadiumLoan: 0,
    roster: normalizeRosterLegacy(os(e.region), 1, 0),
    freeAgents: vt(0, 0, 0, e.region),
    draftProspects: [],
    draftPicks: 0,
    transferOffers: [],
    transferOfferCooldownUntil: 0,
    playerOfferCooldowns: {},
    leagueTeams: s,
    playoffBracket: void 0,
    offseasonChecklist: {
      summaryReviewed: !1,
      contractsResolved: !0,
      draftResolved: !0,
      rosterReady: !0,
      budgetApproved: !1,
      sponsorsReviewed: !0,
    },
    schedule: oa(s),
    sponsorOffers: ut(0, 0, 0, e.region, 75, "rentedPitch"),
    activeSponsor: ca(e),
    sponsorHistory: ["Grunnpartner ved klubbstiftelsen"],
    sponsorLedger: [],
    tvDeal: normalizeBroadcastDeal({ id: "none" }, 0),
    mediaLedger: [],
    boardGoals: Ft(1, 0, e.strategy, 75),
    boardPromises: [],
    boardDecisionHistory: [],
    boardRequestsUsed: [],
    decisionHistory: [],
    completedAchievements: [],
    weeklyChallenge: cs(1, 75),
    inbox: [
      "\u{1F44B} Velkommen. Du starter med en liten amat\xF8rklubb, en leid bane og nesten ingen penger.",
    ],
    news: ["\u{1F4F0} Lokalpressen har registrert at en ny klubb er stiftet."],
    leagueFeed: [],
    history: [],
    legends: [],
    playerAwardHistory: [],
    rivalryRecord: { wins: 0, losses: 0, lastResult: "" },
    financialHistory: [],
    records: {
      biggestWin: 0,
      recordAttendance: 0,
      mostCash: 15e3,
      bestWinStreak: 0,
      currentWinStreak: 0,
      highestValue: 25e3,
    },
    settings: {
      sound: !0,
      music: !0,
      musicVolume: 22,
      sfxVolume: 45,
      compactMode: !1,
      reducedMotion: !1,
      largeText: !1,
      autosave: !0,
      theme: "light",
      assistance: "easy",
      autoRest: !0,
      autoBenchInjured: !0,
      autoLineup: !0,
      responsibility: "assisted",
      assistantApprovalLimit: 1e3,
      ticketStrategy: "balanced",
      autoMedia: !1,
      autoRehab: !0,
      maxTicketChange: 10,
      sponsorAutomation: "maintenance",
      careerPace: "standard",
      autoStopPlayoffs: !0,
      autoStopCriticalBoard: !0,
    },
    lastSeen: Date.now(),
    claimedMissions: [],
    weekStep: 0,
  };
}
const Tr = {
    training: {
      name: "Trening",
      icon: "\u{1F4AA}",
      hint: "Vinn din f\xF8rste kamp.",
    },
    sponsors: {
      name: "Hovedsponsor",
      icon: "\u{1F91D}",
      hint: "Spill \xE9n kamp eller n\xE5 100 supportere.",
    },
    market: {
      name: "Spillermarked",
      icon: "\u{1F50E}",
      hint: "Fullf\xF8r 3 kamper.",
    },
    merch: {
      name: "Supporterbutikk",
      icon: "\u{1F9E2}",
      hint: "N\xE5 250 supportere.",
    },
    draft: {
      name: "Draft",
      icon: "\u{1F393}",
      hint: "Fullf\xF8r f\xF8rste sesong.",
    },
    board: {
      name: "Avansert styre",
      icon: "\u{1F4BC}",
      hint: "N\xE5 1 000 supportere eller rykk opp.",
    },
    stadium: {
      name: "Arena- og eiendomsrettigheter",
      icon: "\u{1F3DF}\uFE0F",
      hint: "N\xE5 850 supportere, klubbprofil 32 og rykk opp.",
    },
    tv: {
      name: "TV-avtaler",
      icon: "\u{1F4FA}",
      hint: "N\xE5 5 000 supportere.",
    },
    investors: {
      name: "Investorer og eierskap",
      icon: "\u{1F48E}",
      hint: "N\xE5 Global Franchise.",
    },
  },
  Tn = [
    {
      id: "captain",
      title: "Velg en kaptein",
      text: "Gi \xE9n spiller ansvar for garderoben.",
      reward: 200,
    },
    {
      id: "lineup",
      title: "Fyll startoppstillingen",
      text: "Ha \xE9n frisk starter i alle 10 posisjoner.",
      reward: 300,
    },
    {
      id: "firstMatch",
      title: "Spill klubbens f\xF8rste kamp",
      text: "Ta klubben ut p\xE5 banen.",
      reward: 350,
    },
    {
      id: "firstWin",
      title: "Vinn den f\xF8rste kampen",
      text: "Skap det f\xF8rste store \xF8yeblikket.",
      reward: 500,
    },
    {
      id: "fans100",
      title: "N\xE5 100 supportere",
      text: "Bygg klubbens f\xF8rste supporterbase.",
      reward: 450,
    },
  ];
function Nt(e) {
  return e.wins + e.losses;
}
function qe(e) {
  return e.leagueIndex >= 4 || e.fans >= 25e3 || e.clubValue >= 5e6
    ? 5
    : e.leagueIndex >= 2 || e.fans >= 5e3 || e.clubValue >= 1e6
      ? 4
      : e.leagueIndex >= 1 || e.fans >= 1e3
        ? 3
        : e.fans >= 100 || Nt(e) >= 3
          ? 2
          : 1;
}
function ds(e) {
  const s = qe(e);
  return {
    level: s,
    ...[
      {
        name: "Lokal klubb",
        icon: "\u{1F331}",
        text: "Leid bane, enkel drift og lokale spillere.",
        next: 100,
      },
      {
        name: "Semiprofesjonell klubb",
        icon: "\u{1F3D8}\uFE0F",
        text: "F\xF8rste sponsor, marked og en liten organisasjon.",
        next: 1e3,
      },
      {
        name: "Profesjonell klubb",
        icon: "\u{1F3DF}\uFE0F",
        text: "St\xF8rre avdelinger, langtidsleie og mulighet for arena- og sponsorflater.",
        next: 5e3,
      },
      {
        name: "Nasjonal toppklubb",
        icon: "\u{1F451}",
        text: "TV, stjerner og nasjonal oppmerksomhet.",
        next: 25e3,
      },
      {
        name: "Global storklubb",
        icon: "\u{1F30D}",
        text: "Internasjonale supportere, investorer og klubbimperium.",
        next: 25e3,
      },
    ][s - 1],
  };
}
function _t(e, s) {
  return s === "training"
    ? !0
    : s === "sponsors"
      ? e.fans >= 100 || Nt(e) >= 1
      : s === "market"
        ? Nt(e) >= 3
        : s === "merch"
          ? e.fans >= 250
          : s === "draft"
            ? e.season > 1 || e.phase === "offseason"
            : s === "board"
              ? !0
              : s === "stadium"
                ? rt(e) >= 2
                : s === "tv"
                  ? e.fans >= 5e3
                  : qe(e) >= 5;
}
function Ln(e) {
  return e.fans >= 1e3 || e.leagueIndex >= 1;
}
function us(e, s) {
  return s === "captain"
    ? e.roster.some((n) => n.captain)
    : s === "lineup"
      ? pn(e).length >= je.length
      : s === "firstMatch"
        ? Nt(e) >= 1
        : s === "firstWin"
          ? e.wins >= 1
          : s === "fans100"
            ? e.fans >= 100
            : !1;
}
function ps(e, s, n) {
  const r = H(e);
  if (s === "rested") return e.condition * 1.25 + r * 0.55;
  if (s === "chemistry") return e.chemistry * 1.1 + e.morale * 0.45 + r * 0.55;
  if (s === "youth")
    return (
      (35 - Math.min(e.age, 35)) * 3 +
      r * 0.7 +
      (e.potential === "S" ? 24 : e.potential === "A" ? 14 : 0)
    );
  if (s === "cheap") return r * 1.15 - e.salary / 120;
  if (s === "opponent") {
    const i = Qe(n).power > Ne(n).overall;
    return (
      r +
      e.condition * 0.25 +
      e.chemistry * 0.15 +
      (i && ["LB", "CB"].includes(e.position)
        ? e.defense * 0.28
        : e.attack * 0.18)
    );
  }
  return r + e.condition * 0.2 + e.morale * 0.12 + e.chemistry * 0.1;
}
function qt(e, s) {
  let n = e.roster.map((i) => ({
    ...i,
    starter: i.locked && i.injuryWeeks <= 0 ? i.starter : !1,
  }));
  for (const i of je) {
    if (
      n.find(
        (g) => g.position === i && g.locked && g.starter && g.injuryWeeks <= 0,
      )
    )
      continue;
    const u = n
      .filter(
        (g) =>
          g.position === i && g.injuryWeeks <= 0 && (!g.locked || g.starter),
      )
      .sort((g, k) => ps(k, s, e) - ps(g, s, e))[0];
    u &&
      (n = n.map((g) =>
        g.position === i ? { ...g, starter: g.id === u.id } : g,
      ));
  }
  const c =
    n.find((i) => i.captain && i.starter && i.injuryWeeks <= 0) ??
    n
      .filter((i) => i.starter && i.injuryWeeks <= 0)
      .sort((i, d) => {
        const u = (g) =>
          H(g) +
          g.morale * 0.28 +
          g.chemistry * 0.22 +
          (g.personality === "Leder" ? 24 : 0) +
          (g.personality === "Veteran" ? 8 : 0);
        return u(d) - u(i);
      })[0];
  return (c && (n = n.map((i) => ({ ...i, captain: i.id === c.id }))), n);
}
function cn(e) {
  return [
    {
      icon: "\u{1F5D3}\uFE0F",
      title: "Planlegg uken",
      text: "Velg treningsfokus og se anbefalingene.",
    },
    {
      icon: "\u{1F4AA}",
      title: "Treningsdag",
      text: "Laget forbereder seg etter valgt plan.",
    },
    {
      icon: "\u{1F9E2}",
      title: "Laguttak",
      text: "Velg oppstilling og kampplan.",
    },
    {
      icon: "\u{1F3C8}",
      title: "Kampdag",
      text: "Alt er klart for neste kamp.",
    },
  ][b(e, 0, 3)];
}
function da(e) {
  return e.profile.difficulty === "casual"
    ? { income: 1.22, opponent: 0.92, injury: 0.72, trust: 1.2 }
    : e.profile.difficulty === "hardcore"
      ? { income: 0.88, opponent: 1.1, injury: 1.3, trust: 0.82 }
      : { income: 1, opponent: 1, injury: 1, trust: 1 };
}
function dn(e) {
  const s = Rn(),
    n = {
      ...s.profile,
      ...(e.profile ?? {}),
      region: e.profile?.region ?? "global",
      language: e.profile?.language ?? "nb",
    };
  let r = (e.roster ?? s.roster).map((g) => ({ ...g, locked: g.locked ?? !1 }));
  const c = [];
  for (const g of je) {
    const k = r.filter((y) => y.position === g).length;
    for (let y = k; y < 2; y += 1) {
      const f = Mt(Math.max(0, (e.leagueIndex ?? 0) - 1), {
        position: g,
        starter: k === 0 && y === 0,
        revealed: 100,
        region: n.region,
      });
      c.push({
        ...f,
        salary: Math.max(110, Math.round(f.salary * 0.13)),
        value: Math.max(800, Math.round(f.value * 0.22)),
        contractYears: 2,
      });
    }
  }
  if (((r = [...r, ...c].slice(0, Je)), (e.version ?? 0) < 12)) {
    const g = e.leagueIndex ?? 0;
    r = r.map((k) => {
      if (!(k.age <= 23 && k.contractYears === 4 && k.salary > 650)) return k;
      const f = Math.max(110, Math.round(95 + g * 62 + H(k) * 1.15));
      return { ...k, salary: f };
    });
  }
  if ((e.version ?? 0) < 17) {
    const g = le[b(e.leagueIndex ?? 0, 0, le.length - 1)].salaryCap * 0.58,
      k = r.reduce((y, f) => y + f.salary, 0);
    if (k > 0 && k < g * 0.78) {
      const y = b(g / k, 1, 3.6);
      r = r.map((f) => ({
        ...f,
        salary: Math.max(180, Math.round(f.salary * y)),
        value: Math.max(f.value, Math.round(f.value * Math.sqrt(y) * 1.25)),
      }));
    }
  }
  r = normalizeRosterLegacy(
    r,
    e.season ?? 1,
    Number(e.wins ?? 0) + Number(e.losses ?? 0),
  );
  let i = e.leagueTeams ?? s.leagueTeams;
  if ((e.version ?? 0) < 7 && i.length) {
    const g = Ea(n.region);
    ((i = i.map((k, y) => ({
      ...k,
      name: g[y % g.length][0],
      logo: g[y % g.length][1],
      coachName: `${ee(Ke[n.region].firstNames)} ${ee(Ke[n.region].lastNames)}`,
    }))),
      i[0] && (n.rivalName = i[0].name));
  }
  const d = b(e.leagueIndex ?? 0, 0, le.length - 1);
  i = i.map((g) =>
    ct(
      {
        ...g,
        strategy:
          g.strategy ??
          ee(["youth", "spender", "balanced", "defensive", "draft"]),
        rosterValue:
          g.rosterValue ??
          Math.round(12e4 + d * 175e3 + (g.power ?? le[d].basePower) * 1900),
        payroll: g.payroll ?? Math.round(le[d].salaryCap * 0.68),
        transferActivity: g.transferActivity ?? "Bygger troppen",
        mediaProfile:
          g.mediaProfile ??
          b(35 + d * 14 + Math.round(Math.random() * 25), 20, 100),
      },
      d,
    ),
  );
  const migratedLoans = normalizeLoanBook(
    e.loans,
    e.debt,
    e.season ?? 1,
  );
  let u = {
    ...s,
    ...e,
    version: 22,
    loans: migratedLoans,
    debt: sumLoanBalances(migratedLoans),
    lastDebtPayment: e.lastDebtPayment,
    rescueUsedSeason: e.rescueUsedSeason ?? 0,
    profile: n,
    upgrades: { ...s.upgrades, ...(e.upgrades ?? {}) },
    staff: { ...s.staff, ...(e.staff ?? {}) },
    systemInvestments: {
      ...s.systemInvestments,
      ...(e.systemInvestments ?? {}),
    },
    completedProjects: {
      ...s.completedProjects,
      ...(e.completedProjects ?? {}),
    },
    activeDevelopmentProject: void 0,
    activeDevelopmentProjects: e.activeDevelopmentProjects?.length
      ? e.activeDevelopmentProjects
      : e.activeDevelopmentProject
        ? [e.activeDevelopmentProject]
        : [],
    clubBase:
      e.clubBase ??
      (e.stadiumOwnership === "owned" || e.stadiumOwnership === "custom"
        ? "ownedCampus"
        : (e.fans ?? 0) >= 900
          ? "longLease"
          : (e.fans ?? 0) >= 250
            ? "rentedBase"
            : "rentedPitch"),
    pricing: { ...s.pricing, ...(e.pricing ?? {}) },
    fanGroups: { ...s.fanGroups, ...(e.fanGroups ?? {}) },
    fanSatisfactionScore:
      e.fanSatisfactionScore ??
      mt({ ...s, ...e, fanGroups: { ...s.fanGroups, ...(e.fanGroups ?? {}) } }),
    mediaReach:
      e.mediaReach ??
      Math.max(
        85,
        Math.round((e.fans ?? s.fans) * 1.8 + (e.reputation ?? 0) * 35),
      ),
    demandMomentum: e.demandMomentum ?? 0,
    stadiumOwnership: e.stadiumOwnership ?? "rented",
    stadiumLoan: e.stadiumLoan ?? 0,
    boardStrategy:
      e.boardStrategy ??
      (n.strategy === "trophies"
        ? "sporting"
        : n.strategy === "youth"
          ? "youth"
          : n.strategy === "business"
            ? "commercial"
            : "financial"),
    boardBudget: { ...s.boardBudget, ...(e.boardBudget ?? {}) },
    boardTrustAreas: { ...s.boardTrustAreas, ...(e.boardTrustAreas ?? {}) },
    nextBoardMeetingWeek: e.nextBoardMeetingWeek ?? 6,
    settings: { ...s.settings, ...(e.settings ?? {}) },
    records: { ...s.records, ...(e.records ?? {}) },
    roster: r,
    seasonStartFans: e.seasonStartFans ?? e.fans ?? s.fans,
    seasonStartCash: e.seasonStartCash ?? e.cash ?? s.cash,
    leagueFeed: normalizeLeagueFeed(e.leagueFeed),
    playerAwardHistory: Array.isArray(e.playerAwardHistory)
      ? e.playerAwardHistory.slice(-40)
      : [],
    rivalryRecord: {
      ...s.rivalryRecord,
      ...(e.rivalryRecord ?? {}),
    },
    transferOffers: (e.transferOffers ?? []).slice(0, 1),
    transferOfferCooldownUntil: e.transferOfferCooldownUntil ?? 0,
    playerOfferCooldowns: e.playerOfferCooldowns ?? {},
    leagueTeams: i,
    freeAgents: sa(
      e.freeAgents?.length
        ? e.freeAgents
        : vt(
            e.leagueIndex ?? 0,
            (e.upgrades?.scouting ?? 0) +
              (e.systemInvestments?.scoutingDb ?? 0),
            (e.staff?.scout ?? 0) + (e.staff?.sportingDirector ?? 0),
            n.region,
          ),
      e.leagueIndex ?? 0,
      b(
        38 +
          ((e.upgrades?.scouting ?? 0) +
            (e.systemInvestments?.scoutingDb ?? 0)) *
            10 +
          ((e.staff?.scout ?? 0) + (e.staff?.sportingDirector ?? 0)) * 12,
        35,
        100,
      ),
      n.region,
    ),
    draftProspects: e.draftProspects ?? [],
    offseasonChecklist: { ...Qa(), ...(e.offseasonChecklist ?? {}) },
    claimedMissions: e.claimedMissions ?? [],
    sponsorOffers: ut(
      e.reputation ?? 0,
      e.leagueIndex ?? 0,
      (e.upgrades?.media ?? 0) + (e.staff?.marketing ?? 0),
      n.region,
      e.fans ?? s.fans,
      e.clubBase ?? "rentedPitch",
    ),
    sponsorHistory: e.sponsorHistory ?? [],
    sponsorLedger: e.sponsorLedger ?? [],
    tvDeal: normalizeBroadcastDeal(e.tvDeal, d),
    mediaLedger: Array.isArray(e.mediaLedger) ? e.mediaLedger.slice(0, 80) : [],
    activeSponsor: An(e.activeSponsor, "main"),
    equipmentSponsor: An(e.equipmentSponsor, "kit"),
    boardsSponsor: An(e.boardsSponsor, "boards"),
    stadiumSponsor: An(e.stadiumSponsor, "stadium"),
    boardPromises: e.boardPromises ?? [],
    boardDecisionHistory: e.boardDecisionHistory ?? [],
    boardRequestsUsed: e.boardRequestsUsed ?? [],
    decisionHistory: e.decisionHistory ?? [],
    activeDecision: e.activeDecision
      ? {
          ...e.activeDecision,
          category:
            e.activeDecision.category ??
            (e.activeDecision.kind === "pressLoss"
              ? "press"
              : e.activeDecision.kind === "ticketProtest" ||
                  e.activeDecision.kind === "party"
                ? "supporters"
                : e.activeDecision.kind === "contractDemand"
                  ? "players"
                  : e.activeDecision.kind === "sponsorConflict"
                    ? "sponsors"
                    : "operations"),
        }
      : void 0,
    weekStep: e.weekStep ?? 0,
  };
  if ((e.version ?? 0) < 17.1) {
    const g = se(u),
      k = [0.33, 0.4, 0.47, 0.54, 0.6][u.leagueIndex] ?? 0.33,
      y = u.boardGoals.salaryCap * k;
    if (g > y * 1.12) {
      const f = y / g;
      ((u.roster = u.roster.map((N) => ({
        ...N,
        salary: Math.max(110, Math.round(N.salary * f)),
      }))),
        (u.inbox = [
          `\u2696\uFE0F v17.1 korrigerte ligal\xF8nningene fra ${h(g)} til ${h(se(u))}/uke.`,
          ...u.inbox,
        ]));
    }
    if (
      (!u.activeSponsor &&
        u.leagueIndex === 0 &&
        u.season <= 2 &&
        ((u.activeSponsor = ca(u.profile)),
        (u.sponsorHistory = [
          "Grunnpartner lagt til i v17.1",
          ...u.sponsorHistory,
        ])),
      u.cash < 5e3 && u.season <= 2)
    ) {
      const f = Math.max(0, 1e4 - u.cash);
      f > 0 &&
        ((u.cash += f),
        (u.debt += Math.round(f * 1.12)),
        (u.inbox = [
          `\u{1F3E6} Automatisk overgangsl\xE5n: ${h(f)} i likviditet, ${h(Math.round(f * 1.12))} lagt til gjeld.`,
          ...u.inbox,
        ]));
    }
  }
  if ((e.version ?? 0) < 17.3) {
    const g = u.freeAgents.length;
    ((u.freeAgents = sa(
      u.freeAgents,
      u.leagueIndex,
      b(
        38 +
          (u.upgrades.scouting + u.systemInvestments.scoutingDb) * 10 +
          (u.staff.scout + u.staff.sportingDirector) * 12,
        35,
        100,
      ),
      u.profile.region,
    )),
      u.freeAgents.length > g &&
        (u.inbox = [
          "\u{1F9F0} Markedet fikk rimelige breddealternativer for alle posisjoner i v17.3.",
          ...u.inbox,
        ]));
  }
  if (
    (e.completedProjects || (u = { ...u, completedProjects: br(u) }),
    u.phase === "offseason" &&
      u.draftPicks > 0 &&
      u.draftProspects.length === 0 &&
      (u.draftProspects = is(
        u.leagueIndex,
        u.upgrades.academy + u.systemInvestments.scoutingDb,
        u.staff.scout + u.staff.sportingDirector,
        u.profile.region,
      )),
    u.boardGoals.fans > Math.max(u.fans * 1.75, u.fans + 200) &&
      (u = {
        ...u,
        boardGoals: {
          ...u.boardGoals,
          fans: Ft(u.season, u.leagueIndex, u.profile.strategy, u.fans).fans,
        },
      }),
    (e.version ?? 0) < 19 &&
      ((u.sponsorOffers = ut(
        u.reputation,
        u.leagueIndex,
        u.upgrades.media + u.staff.marketing,
        u.profile.region,
        u.fans,
        u.clubBase,
      )),
      (u.inbox = [
        "\u{1F9ED} v19 reparerte sponsorgrenser, prosjektkapasitet og langsiktig karrierebalanse.",
        ...u.inbox,
      ])),
    (e.version ?? 0) < 19.1)
  ) {
    const g = an(u.leagueIndex);
    ((u.leagueTeams = u.leagueTeams.map((k) => ct(k, u.leagueIndex))),
      (u.inbox = [
        `\u{1F6E0}\uFE0F v19.1 normaliserte AI-lagene i ${le[u.leagueIndex].name} til ${g.min}\u2013${g.max} OVR. Gamle superlag er reparert.`,
        ...u.inbox,
      ]));
  }
  return (
    (e.version ?? 0) < 20 &&
      ((u.settings = {
        ...u.settings,
        sponsorAutomation: u.settings.sponsorAutomation ?? "maintenance",
        careerPace: u.settings.careerPace ?? "standard",
        autoStopPlayoffs: u.settings.autoStopPlayoffs ?? !0,
        autoStopCriticalBoard: u.settings.autoStopCriticalBoard ?? !0,
      }),
      (u.famePoints = Math.max(
        u.famePoints ?? 0,
        Math.round(
          (u.trophies ?? 0) * 9 +
            (u.leagueIndex ?? 0) * 7 +
            Math.min(35, (u.history?.length ?? 0) * 1.5),
        ),
      )),
      (u.inbox = [
        "\u{1F3C1} v20 la til tydelig postseason, karrieretempo, sponsorvedlikehold og reparert Fame.",
        ...u.inbox,
      ])),
    (e.version ?? 0) < 21 &&
      ((u.roster = normalizeRosterLegacy(
        u.roster,
        u.season,
        Number(u.wins ?? 0) + Number(u.losses ?? 0),
      )),
      (u.seasonStartFans = u.seasonStartFans ?? u.fans),
      (u.seasonStartCash = u.seasonStartCash ?? u.cash),
      (u.leagueFeed = normalizeLeagueFeed(u.leagueFeed)),
      (u.inbox = [
        "\u{1F3C8} v21 aktiverte ekte kampdag, spillerstatistikk, karrierehistorikk og levende ligarivaler.",
        ...u.inbox,
      ])),
    (e.version ?? 0) < 22 &&
      ((u.loans = normalizeLoanBook([], u.debt, u.season)),
      (u.debt = sumLoanBalances(u.loans)),
      (u.tvDeal = normalizeBroadcastDeal(u.tvDeal, u.leagueIndex)),
      (u.mediaLedger = Array.isArray(u.mediaLedger)
        ? u.mediaLedger.slice(0, 80)
        : []),
      (u.inbox = [
        "\u{1F3E6} v22 la til lånetak, tvungne avdrag, likviditetsprognose og mediebetaling med fastbeløp + CPM.",
        ...u.inbox,
      ])),
    (u = Ce(u)),
    u
  );
}
function ms() {
  try {
    const e =
      localStorage.getItem(Mn) ??
      Fa.map((c) => localStorage.getItem(c)).find(Boolean) ??
      null;
    if (!e) return Rn();
    const s = JSON.parse(e),
      n = dn(s),
      r = b((Date.now() - (n.lastSeen || Date.now())) / 36e5, 0, 8);
    if (n.phase !== "setup" && r > 0.08) {
      const c =
          18 +
          qe(n) * 10 +
          n.upgrades.merch * 60 +
          n.upgrades.media * 55 +
          n.fans * 0.01 +
          Le(n).reduce((d, u) => d + u.weeklyPay, 0) / 80,
        i = Math.round(c * r * 3.4);
      ((n.cash += i),
        (n.offlineSummary = `Du var borte i ${r.toFixed(1)} timer og klubben tjente ${h(i)} fra butikk, media og sponsorer.`));
    }
    return ((n.lastSeen = Date.now()), n);
  } catch {
    return Rn();
  }
}
function et(e) {
  return Wa.find((s) => s.id === e);
}
function Dn(e, s) {
  const n = et(s),
    r = e.completedProjects[s];
  return Math.round(n.baseCost * Math.pow(1.62, r));
}
function ua(e, s) {
  return et(s).baseWeeks + e.completedProjects[s];
}
function fs(e, s) {
  const n = e.completedProjects[s];
  return s === "stadiumExpansion"
    ? n >= 2
      ? "ownedCampus"
      : "longLease"
    : s === "matchdayZone"
      ? n === 0
        ? "rentedPitch"
        : n === 1
          ? "longLease"
          : "ownedCampus"
      : s === "trainingCenter" ||
          s === "medicalCenter" ||
          s === "academyProgram"
        ? n === 0
          ? "rentedPitch"
          : n === 1
            ? "rentedBase"
            : "ownedCampus"
        : s === "commercialHub" || s === "analyticsCenter"
          ? n === 0
            ? "rentedPitch"
            : n === 1
              ? "rentedBase"
              : "longLease"
          : s === "clubOffice"
            ? n === 0
              ? "rentedBase"
              : n === 1
                ? "longLease"
                : "ownedCampus"
            : et(s).minBase;
}
function pa(e, s) {
  const n = fs(e, s);
  return rt(e) < Be(n).rank
    ? { ok: !1, reason: `Krever ${Be(n).name.toLowerCase()}` }
    : { ok: !0, reason: "" };
}
function ma(e, s, n = 5) {
  return { ...e, [s]: Math.min(n, e[s] + 1) };
}
function gs(e, s, n) {
  let r = {
    ...e,
    upgrades: { ...e.upgrades },
    staff: { ...e.staff },
    systemInvestments: { ...e.systemInvestments },
  };
  const c = (u) => {
      r.upgrades = ma(r.upgrades, u, 5);
    },
    i = (u) => {
      r.staff = ma(r.staff, u, 3);
    },
    d = (u) => {
      r.systemInvestments = ma(r.systemInvestments, u, 3);
    };
  return (
    s === "trainingCenter" &&
      (c("training"),
      n === 0
        ? i("headCoach")
        : n === 1
          ? (i("offensiveCoach"), i("defensiveCoach"))
          : (i("headCoach"), d("performanceLab"))),
    s === "medicalCenter" &&
      (c("medical"),
      n === 0
        ? i("physio")
        : n === 1
          ? i("medicalDirector")
          : (i("physio"), d("medicalAnalytics"))),
    s === "academyProgram" &&
      (c("academy"),
      c("scouting"),
      n === 0 ? i("scout") : n === 1 ? d("scoutingDb") : i("sportingDirector")),
    s === "matchdayZone" &&
      (c("food"), c("merch"), n >= 1 && c("vip"), n >= 2 && c("museum")),
    s === "stadiumExpansion" &&
      (c("seats"), c("parking"), n >= 1 && c("lights"), n >= 2 && c("vip")),
    s === "commercialHub" &&
      (c("media"),
      n === 0
        ? i("marketing")
        : n === 1
          ? (i("commercialDirector"), d("supporterCrm"))
          : (i("marketing"), d("ticketing"))),
    s === "analyticsCenter" &&
      d(n === 0 ? "financeSuite" : n === 1 ? "scoutingDb" : "performanceLab"),
    s === "clubOffice" &&
      (n === 0
        ? i("cfo")
        : n === 1
          ? (i("stadiumManager"), i("sportingDirector"))
          : (i("cfo"), i("mediaOfficer"))),
    r
  );
}
function bs(e, s) {
  const n = e.completedProjects[s],
    r = gs(e, s, n),
    c = yt(e) + In(e),
    i = yt(r) + In(r);
  return { weeklyDelta: Math.max(0, i - c), after: r };
}
function hs(e) {
  const s = Ve(e);
  if (!s.length) return { game: e, message: "" };
  let n = e;
  const r = [],
    c = [];
  for (const i of s) {
    if (i.weeksLeft > 1) {
      (r.push({ ...i, weeksLeft: i.weeksLeft - 1 }),
        c.push(`${et(i.id).names[i.stage]}: ${i.weeksLeft - 1} uke(r) igjen.`));
      continue;
    }
    const d = et(i.id);
    ((n = gs(n, i.id, i.stage)),
      (n = {
        ...n,
        completedProjects: {
          ...n.completedProjects,
          [i.id]: Math.min(3, i.stage + 1),
        },
      }),
      c.push(
        `${d.icon} ${d.names[i.stage]} er ferdig. ${d.benefits[i.stage]}.`,
      ));
  }
  return (
    (n = {
      ...n,
      activeDevelopmentProject: void 0,
      activeDevelopmentProjects: r,
    }),
    { game: n, message: c.join(" ") }
  );
}
function pt(e) {
  const s =
      e.potential === "S"
        ? 20
        : e.potential === "A"
          ? 13
          : e.potential === "B"
            ? 6
            : 0,
    n = Math.max(0, 24 - e.age) * 1.4,
    r = Math.max(-6, 8 - e.salary / 120);
  return H(e) * 1.35 + s + n + r;
}
function ks(e, s) {
  const n = Cr(e, s);
  return pt(s) * 0.64 + n * 0.36;
}
function vs(e, s) {
  const n = e.roster.filter((c) => c.position === s.position);
  if (!n.length) return `Du mangler ${s.position} helt`;
  const r = Math.max(...n.map(H));
  return n.length === 1
    ? `Bare \xE9n ${s.position} i troppen`
    : r < 58 + e.leagueIndex * 7
      ? `Svakeste lagdel er ${s.position}`
      : `Gir bedre dybde p\xE5 ${s.position}`;
}
function A(e, s) {
  return { ...e, inbox: [...s, ...e.inbox].slice(0, 10) };
}
function Lr(e, s) {
  return { ...e, news: [...s, ...e.news].slice(0, 16) };
}
function fa(e) {
  return e === "youth"
    ? "Ungdomssatsing"
    : e === "spender"
      ? "Kj\xF8per etablerte stjerner"
      : e === "defensive"
        ? "Defensiv og stabil"
        : e === "draft"
          ? "Draft og utvikling"
          : "Balansert klubbdrift";
}
function ys(e, s) {
  return (
    e.leagueTeams
      .filter((r) => r.budget >= Math.max(1e3, Fe(e, s).midpoint * 0.45))
      .map((r) => {
        const c =
            r.strategy === "spender"
              ? 18
              : r.strategy === "youth" && s.age <= 23
                ? 16
                : r.strategy === "defensive" &&
                    ["DL", "LB", "CB", "S"].includes(s.position)
                  ? 12
                  : r.strategy === "draft" && s.age <= 24
                    ? 10
                    : 4,
          i = Math.max(0, H(s) - r.power) * 0.8;
        return { team: r, score: c + i + Math.random() * 8 };
      })
      .sort((r, c) => c.score - r.score)[0]?.team ?? e.leagueTeams[0]
  );
}
function Ss(e) {
  const s = Kt(e);
  if (
    e.phase !== "club" ||
    e.seasonStage !== "regular" ||
    e.roster.length <= ve ||
    e.transferOffers.length >= 1 ||
    s < e.transferOfferCooldownUntil
  )
    return;
  const n = e.roster
    .filter(
      (g) =>
        g.contractYears > 0 &&
        !g.locked &&
        s >= (e.playerOfferCooldowns[g.id] ?? 0) &&
        (g.starter || ["A", "S"].includes(g.potential)),
    )
    .sort((g, k) => Fe(e, k).midpoint - Fe(e, g).midpoint);
  if (!n.length) return;
  const r = ee(n.slice(0, Math.min(8, n.length))),
    c = ys(e, r);
  if (!c || (c.budget ?? 0) < Fe(e, r).low * 0.55) return;
  const i = Fe(e, r),
    d =
      c.strategy === "spender"
        ? 1.18
        : c.strategy === "youth" && r.age <= 23
          ? 1.14
          : 1,
    u = Math.round(i.midpoint * d * (0.86 + Math.random() * 0.3));
  return {
    id: be("transfer"),
    playerId: r.id,
    clubId: c.id,
    clubName: c.name,
    amount: u,
    expiresWeek: Math.min(oe, e.week + 2),
    countered: !1,
  };
}
function ws(e, s) {
  const n = zn.find((r) => r.id === e);
  return Math.round(n.baseCost * Math.pow(n.scale, s));
}
function ga(e, s) {
  const n = sn.find((r) => r.id === e);
  return Math.round(n.baseCost * Math.pow(1.7, s));
}
function Ct(e) {
  return Object.values(e.upgrades).reduce((s, n) => s + n, 0);
}
function un(e) {
  const s = Be(e.clubBase).capacity,
    n = rt(e) >= 2 ? 1 : 0.28;
  return Math.round(
    s +
      e.upgrades.seats * 950 * n +
      e.upgrades.parking * 180 +
      e.upgrades.vip * 80,
  );
}
function se(e) {
  return e.roster.reduce((s, n) => s + n.salary, 0);
}
function yt(e) {
  return sn.reduce((s, n) => s + n.salary * e.staff[n.id], 0);
}
function In(e) {
  const s =
      e.stadiumOwnership === "rented"
        ? 0.42
        : e.stadiumOwnership === "custom"
          ? 1.08
          : 0.88,
    n = (qe(e) < 3 ? 120 + Ct(e) * 90 : 650 + Ct(e) * 230 + un(e) * 0.12) * s,
    r = Math.min(
      0.32,
      e.staff.cfo * 0.035 +
        e.staff.stadiumManager * 0.045 +
        e.systemInvestments.financeSuite * 0.018,
    ),
    c =
      e.leagueIndex * e.leagueIndex * 1100 +
      rt(e) * 900 +
      Math.max(0, e.fans - 5e3) * 0.22;
  return Math.round(n * (1 - r) + Be(e.clubBase).weeklyRent + c);
}
function mt(e) {
  const s =
      Math.max(0, e.pricing.ticket - (18 + e.leagueIndex * 5)) * 0.55 +
      Math.max(0, e.pricing.food - 15) * 0.35,
    n =
      e.upgrades.parking * 0.8 +
      e.upgrades.food * 0.6 +
      e.upgrades.museum * 1.2 +
      e.upgrades.seats * 0.35,
    r = b((e.wins - e.losses) * 0.65, -7, 7);
  return b((e.fanSatisfactionScore ?? 67) + n + r - s, 12, 98);
}
function Dr(e, s = mt(e)) {
  const n = Le(e).length * 0.55,
    r =
      e.staff.marketing * 0.85 +
      e.systemInvestments.supporterCrm * 1.35 +
      e.upgrades.museum * 0.75 +
      e.upgrades.media * 0.55,
    c = Math.log1p(Math.max(0, e.mediaReach)) * 0.42,
    i = Math.max(0, s - 58) * 0.11,
    d = 0.8 + e.leagueIndex * 1.2,
    u =
      Math.max(-1.5, (e.boardBudget.commercial - 12) * 0.18) +
      (e.boardStrategy === "commercial"
        ? 2.4
        : e.boardStrategy === "infrastructure"
          ? 0.8
          : 0),
    g = n + r + c + i + d + u;
  return e.fans < 500
    ? b(Math.round(g), 2, 12)
    : e.fans < 2e3
      ? b(Math.round(g + e.fans * 0.0035), 5, 28)
      : e.fans < 1e4
        ? b(Math.round(g + e.fans * 0.0018), 10, 75)
        : b(
            Math.round(g + e.fans * 65e-5),
            18,
            Math.max(80, Math.round(e.fans * 0.006)),
          );
}
function Ir(e, s, n, r, c, i, d) {
  const u = b(
    e.upgrades.museum * 0.07 +
      e.systemInvestments.supporterCrm * 0.11 +
      e.staff.marketing * 0.04,
    0,
    0.68,
  );
  if (s) {
    const N = Math.round(n * 3) + r + (c ? 3 : 0) + (i ? 4 : 0);
    return e.fans < 500
      ? b(4 + N, 4, 15)
      : e.fans < 2e3
        ? b(Math.round(e.fans * 0.006) + N, 6, 38)
        : e.fans < 1e4
          ? b(Math.round(e.fans * 0.0035) + N, 12, 95)
          : b(
              Math.round(e.fans * (0.0014 + n * 7e-4)) + N,
              20,
              Math.max(120, Math.round(e.fans * 0.006)),
            );
  }
  const g = r >= 2 || n > 0.62,
    k = d < 38 ? 1 : 0,
    y = (g ? 2 : Math.random() < 0.7 ? 0 : 1) + k + (c ? 1 : 0) + (i ? 1 : 0),
    f = Math.round(y * (1 - u));
  return e.fans < 500
    ? -b(f, 0, 3)
    : e.fans < 2e3
      ? -b(f + (g ? Math.round(e.fans * 0.001) : 0), 0, 8)
      : e.fans < 1e4
        ? -b(f + (g ? Math.round(e.fans * 7e-4) : 0), 0, 25)
        : -b(
            f + (g ? Math.round(e.fans * 35e-5) : 0),
            0,
            Math.max(40, Math.round(e.fans * 0.002)),
          );
}
function ba(e, s) {
  const n = Cn.find((r) => r.id === e);
  return Math.round(n.baseCost * Math.pow(1.75, s));
}
function Gn(e) {
  return {
    attack: e.attack ?? e.power,
    defense: e.defense ?? e.power,
    stamina: e.stamina ?? e.power,
    morale: e.morale ?? 72,
    chemistry: e.chemistry ?? 70,
    overall: e.power,
  };
}
function ha(e, s, n = !0) {
  const r = Ne(e),
    c = Gn(s),
    i = (r.overall - c.overall) * 0.82,
    d =
      (r.attack - c.defense) * 0.2 +
      (r.defense - c.attack) * 0.2 +
      (r.stamina - c.stamina) * 0.08,
    u = n ? 3.4 + e.upgrades.lights * 0.12 : -1.8,
    g = e.schedule
      .filter((w) => w.played)
      .slice(-4)
      .reduce(
        (w, v) => w + ((v.ourScore ?? 0) > (v.opponentScore ?? 0) ? 1 : -1),
        0,
      ),
    k = s.form.slice(-4).reduce((w, v) => w + (v === "W" ? 1 : -1), 0),
    y = b((g - k) * 0.7, -3.5, 3.5),
    f =
      e.profile.difficulty === "casual"
        ? 2.4
        : e.profile.difficulty === "hardcore"
          ? -2.4
          : 0,
    N = 1 / (1 + Math.exp(-(i + d + u + y + f) / 9.5));
  return b(N, 0.04, 0.96);
}
function Ms(e) {
  return e >= 0.72
    ? "Klar favoritt"
    : e >= 0.58
      ? "Liten favoritt"
      : e > 0.42
        ? "Jevn kamp"
        : e > 0.28
          ? "Liten underdog"
          : "Klar underdog";
}
function Gr(e) {
  const s = Math.abs(e.scoreMargin ?? 0);
  return e.won
    ? s >= 18
      ? "Klar seier"
      : s >= 8
        ? "Solid seier"
        : (e.winProbability ?? 0.5) < 0.42
          ? "Sterk overraskelse"
          : "Knepen seier"
    : s >= 18
      ? "Klart tap"
      : s >= 8
        ? "Fortjent tap"
        : (e.winProbability ?? 0.5) > 0.58
          ? "Skuffende tap"
          : "Knepent tap";
}
function Ns(e, s = Qe(e)) {
  const n = 9 + e.leagueIndex * 7 + qe(e) * 2.2,
    r = e.fans / Math.max(250, un(e)),
    c = ((s.mediaProfile ?? 50) - 50) / 13,
    i = b((e.wins - e.losses) * 0.7, -4, 6),
    d =
      s.name === e.profile.rivalName ? 5 : e.seasonStage !== "regular" ? 7 : 0,
    u = e.systemInvestments.ticketing * 0.6 + e.staff.commercialDirector * 0.45;
  return b(
    Math.round(n + Math.log1p(Math.max(0, r)) * 7 + c + i + d + u),
    6,
    95,
  );
}
function Vt(e, s = Qe(e)) {
  if (
    e.settings.ticketStrategy === "manual" ||
    (e.staff.commercialDirector <= 0 && e.systemInvestments.ticketing <= 0)
  )
    return e.pricing.ticket;
  const n = Ns(e, s),
    r =
      e.settings.ticketStrategy === "full"
        ? n * 0.86
        : e.settings.ticketStrategy === "revenue"
          ? n * 1.14
          : n,
    c = Math.max(
      1,
      Math.round(e.pricing.ticket * (e.settings.maxTicketChange / 100)),
    );
  return b(Math.round(r), e.pricing.ticket - c, e.pricing.ticket + c);
}
function On(e, s, n, r = "Klart", c = e.pricing.ticket) {
  const i = n ? un(e) : Math.round(2e3 + s.stadiumLevel * 2200),
    d = mt(e) / 100,
    u = b(0.82 + (e.wins - e.losses) * 0.035, 0.58, 1.28),
    g = b(0.72 + (s.mediaProfile ?? 50) / 105, 0.75, 1.68),
    k = s.name === e.profile.rivalName ? 1.28 : 1,
    y = e.seasonStage !== "regular" ? 1.45 : 1,
    f =
      r === "Perfekt"
        ? 1.09
        : r === "Sn\xF8"
          ? 0.73
          : r === "Regn"
            ? 0.84
            : r === "Vind"
              ? 0.92
              : 1,
    N = Math.max(6, Ns(e, s)),
    w = b(
      1.12 -
        Math.max(-0.2, c / N - 1) * (0.62 - e.staff.commercialDirector * 0.025),
      0.42,
      1.18,
    ),
    v = 1 + Math.log1p(Math.max(0, e.mediaReach)) / 42,
    $ =
      1 +
      e.upgrades.parking * 0.035 +
      e.upgrades.museum * 0.025 +
      e.systemInvestments.supporterCrm * 0.025,
    D = 1 + b(e.demandMomentum, -20, 25) / 100,
    q = n
      ? Math.max(55, e.fans * 0.78)
      : Math.max(420, i * 0.24 + (s.mediaProfile ?? 50) * 11 + s.power * 5),
    x = n ? 1 : b(0.82 + s.morale / 260 + s.chemistry / 320, 0.92, 1.42),
    R = Math.max(40, Math.round(q * d * u * g * k * y * f * w * v * $ * D * x)),
    E = Math.min(i, R),
    T = E / Math.max(1, i);
  return {
    capacity: i,
    demand: R,
    attendance: E,
    occupancy: T,
    waitlist: Math.max(0, R - i),
    unsold: Math.max(0, i - E),
    ticketPrice: c,
  };
}
function Cs(e, s, n, r) {
  return calculateMediaPayout(e, s, n, r);
}
function Ps(e) {
  const s = un(e),
    n = Math.round(13e4 + s * 54 + Ct(e) * 8e3 + e.leagueIndex * 175e3),
    r = Math.round(n * 0.22),
    c = n - r,
    i = Math.round(c / 120);
  return { price: n, deposit: r, loan: c, weeklyPayment: i };
}
function pn(e) {
  return e.roster.filter((s) => s.starter && s.injuryWeeks <= 0);
}
function ka(e) {
  const s = pn(e);
  return je.every((n) => s.some((r) => r.position === n));
}
function Ne(e) {
  const s = pn(e),
    n =
      s.length >= je.length
        ? s
        : e.roster
            .filter((f) => f.injuryWeeks <= 0)
            .sort((f, N) => H(N) - H(f))
            .slice(0, je.length),
    r = n.reduce((f, N) => f + N.attack, 0) / Math.max(1, n.length),
    c = n.reduce((f, N) => f + N.defense, 0) / Math.max(1, n.length),
    i =
      n.reduce((f, N) => f + N.stamina * (N.condition / 100), 0) /
      Math.max(1, n.length),
    d = n.reduce((f, N) => f + N.morale, 0) / Math.max(1, n.length),
    u = n.reduce((f, N) => f + N.chemistry, 0) / Math.max(1, n.length),
    g =
      e.staff.headCoach * 2.4 +
      e.staff.offensiveCoach * 1.8 +
      e.staff.defensiveCoach * 1.8,
    k = e.upgrades.training * 1.6 + e.famePoints * 2,
    y = b(r * 0.32 + c * 0.32 + i * 0.16 + d * 0.08 + u * 0.08 + g + k, 1, 99);
  return {
    attack: b(r, 1, 99),
    defense: b(c, 1, 99),
    stamina: b(i, 1, 99),
    morale: d,
    chemistry: u,
    overall: y,
  };
}
function Qe(e) {
  if (
    e.seasonStage === "quarterfinal" ||
    e.seasonStage === "semifinal" ||
    e.seasonStage === "final"
  ) {
    const n = e.schedule.find((r) => r.playoff === e.seasonStage && !r.played);
    if (n)
      return (
        e.leagueTeams.find((r) => r.id === n.opponentId) ?? e.leagueTeams[0]
      );
  }
  const s = e.schedule.find((n) => n.week === e.week && !n.played);
  return e.leagueTeams.find((n) => n.id === s?.opponentId) ?? e.leagueTeams[0];
}
function mn(e) {
  return e.seasonStage === "quarterfinal" ||
    e.seasonStage === "semifinal" ||
    e.seasonStage === "final"
    ? e.schedule.find((s) => s.playoff === e.seasonStage && !s.played)
    : e.schedule.find((s) => s.week === e.week && !s.played);
}
function ft(e) {
  const s = Ne(e);
  return [
    {
      id: "user",
      name: e.profile.clubName || "Din klubb",
      logo: e.profile.logo,
      power: s.overall,
      attack: s.attack,
      defense: s.defense,
      stamina: s.stamina,
      morale: s.morale,
      chemistry: s.chemistry,
      mediaProfile: Math.max(20, Math.round(e.mediaReach / 10)),
      wins: e.wins,
      losses: e.losses,
      pointsFor: e.pointsFor,
      pointsAgainst: e.pointsAgainst,
      form: e.schedule
        .filter((r) => r.played)
        .slice(-5)
        .map((r) => ((r.ourScore ?? 0) > (r.opponentScore ?? 0) ? "W" : "L")),
      budget: e.cash,
      stadiumLevel: e.upgrades.seats,
      coachName: e.profile.managerName,
    },
    ...e.leagueTeams,
  ].sort(
    (r, c) =>
      c.wins - r.wins ||
      c.pointsFor - c.pointsAgainst - (r.pointsFor - r.pointsAgainst),
  );
}
function Or(e, s) {
  const n = ft(e),
    r = n.find((u) => u.id === "user");
  if (!r || s <= 1) return "Plasseringen ble avgjort av antall seire.";
  const c = n[s - 2];
  if (!c) return "Plasseringen ble avgjort av antall seire.";
  if (c.wins !== r.wins)
    return `${c.name} endte foran med ${c.wins} seire mot klubbens ${r.wins}.`;
  const i = r.pointsFor - r.pointsAgainst,
    d = c.pointsFor - c.pointsAgainst;
  return `Lik seiersrekord. ${c.name} endte foran p\xE5 poengforskjell (${d >= 0 ? "+" : ""}${d} mot ${i >= 0 ? "+" : ""}${i}).`;
}
function Kr(e) {
  if (e.seasonStage === "final") return 50;
  if (e.seasonStage === "semifinal") return 34;
  if (e.seasonStage === "quarterfinal") return 22;
  if (e.seasonStage === "complete")
    return e.playoffBracket?.qualified ? 100 : 0;
  const s = Nt(e);
  if (s === 0) return 50;
  const r = ft(e).findIndex((y) => y.id === "user") + 1,
    c = (e.wins / Math.max(1, s)) * 100,
    i = b(76 - (r - 1) * 7, 8, 92),
    d =
      e.leagueTeams.reduce((y, f) => y + f.power, 0) /
      Math.max(1, e.leagueTeams.length),
    u = b(50 + (Ne(e).overall - d) * 1.6, 12, 88),
    g = c * 0.48 + i * 0.34 + u * 0.18,
    k = b(s / 8, 0.12, 1);
  return b(50 * (1 - k) + g * k, 4, 98);
}
function $s(e, s) {
  const n = Qe(e),
    r = mn(e),
    c = s === "live" ? 40 : s === "highlights" ? 24 : s === "fast" ? 12 : 16,
    i = ee(["Klart", "Klart", "Perfekt", "Regn", "Vind", "Sn\xF8"]),
    d = r?.home ?? !0,
    u = d ? Vt(e, n) : e.pricing.ticket,
    g = On(e, n, d, i, u),
    k = Ne(e),
    y = Gn(n),
    f = ha(e, n, d);
  return {
    mode: s,
    totalTicks: c,
    ticksLeft: c,
    homeScore: 0,
    awayScore: 0,
    possession: Math.random() > 0.5 ? "home" : "away",
    momentum: d ? 7 : -2,
    weather: i,
    opponentId: n.id,
    opponentName: n.name,
    opponentPower: n.power,
    home: d,
    tacticId: e.selectedTactic,
    halftimeTriggered: !1,
    lateDecisionTriggered: !1,
    decisionType: "halftime",
    eventLog: [
      `${d ? ln(e) : n.name} er klar.`,
      `V\xE6r: ${i}.`,
      `Forventet seierssjanse: ${Math.round(f * 100)}%.`,
    ],
    bigMoment: "Kampen er i gang!",
    injuries: [],
    playerBox: createMatchPlayerBox(e.roster),
    teamStats: {
      totalYards: 0,
      firstDowns: 0,
      turnovers: 0,
      defensiveStops: 0,
    },
    attendance: g.attendance,
    capacity: g.capacity,
    demand: g.demand,
    occupancy: g.occupancy,
    ticketPrice: u,
    winProbability: f,
    expectedUserWin: Math.random() < f,
    userAttack: k.attack,
    userDefense: k.defense,
    opponentAttack: y.attack,
    opponentDefense: y.defense,
  };
}
function Fr(e, s) {
  const n = Ne(e),
    r = Lt.find((y) => y.id === s.tacticId) ?? Lt[0],
    c = da(e);
  let i =
      n.attack * r.attack +
      e.staff.offensiveCoach * 1.35 +
      e.systemInvestments.performanceLab * 0.9,
    d =
      n.defense * r.defense +
      e.staff.defensiveCoach * 1.35 +
      e.systemInvestments.performanceLab * 0.9,
    u = n.stamina / r.stamina,
    g = s.opponentAttack * c.opponent,
    k = s.opponentDefense * c.opponent;
  return (
    s.weather === "Vind" && (i *= 0.95),
    s.weather === "Sn\xF8" && (u *= 0.92),
    s.weather === "Regn" && (i *= 0.965),
    s.home && ((i *= 1.025 + e.upgrades.lights * 0.002), (d *= 1.015)),
    s.halftimeChoice === "attack" && ((i *= 1.09), (d *= 0.98)),
    s.halftimeChoice === "defense" && ((d *= 1.09), (i *= 0.98)),
    s.halftimeChoice === "motivate" && ((i *= 1.035), (d *= 1.035)),
    s.halftimeChoice === "protect" && (u *= 1.12),
    s.lateChoice === "attack" && ((i *= 1.07), (d *= 0.97)),
    s.lateChoice === "defense" && ((d *= 1.07), (i *= 0.97)),
    s.lateChoice === "motivate" &&
      ((i *= 1.025 + Math.max(0, -s.momentum) * 0.0008),
      (d *= 1.025 + Math.max(0, -s.momentum) * 0.0008)),
    s.lateChoice === "protect" && (u *= 1.1),
    {
      attack: i,
      defense: d,
      stamina: u,
      opponentAttack: g,
      opponentDefense: k,
      injury: r.injury * c.injury,
    }
  );
}
function tt(e, s, n = !1) {
  return {
    ...e,
    eventLog: [s, ...e.eventLog].slice(0, 9),
    bigMoment: n ? s : e.bigMoment,
  };
}
function va(e, s) {
  let n = {
    ...s,
    ticksLeft: Math.max(0, s.ticksLeft - 1),
    playerBox: s.playerBox ?? createMatchPlayerBox(e.roster),
    teamStats: s.teamStats ?? {
      totalYards: 0,
      firstDowns: 0,
      turnovers: 0,
      defensiveStops: 0,
    },
  };
  const r = Fr(e, n),
    c = 1 - n.ticksLeft / n.totalTicks,
    i = n.possession === "home",
    d = r.attack - r.opponentDefense,
    u = r.defense - r.opponentAttack,
    g = n.expectedUserWin ? 0.08 : -0.08,
    k = (d + u) / 2 + n.momentum * 0.1,
    y = b(0.42 + Math.abs(k) / 260, 0.34, 0.72),
    f =
      e.upgrades.medical * 0.055 +
      e.staff.physio * 0.045 +
      e.staff.medicalDirector * 0.055 +
      e.systemInvestments.medicalAnalytics * 0.045;
  const Nn =
    n.halftimeChoice === "protect" || n.lateChoice === "protect" ? 0.56 : 1;
  if (Math.random() < 0.014 * r.injury * (1 - b(f, 0, 0.72)) * Nn) {
    const N = pn(e),
      w = N.length ? ee(N) : void 0;
    if (w && !n.injuries.includes(w.id)) {
      const v = e.roster
          .filter(
            (D) =>
              D.position === w.position &&
              D.id !== w.id &&
              D.injuryWeeks <= 0 &&
              !D.starter,
          )
          .sort((D, q) => H(q) - H(D))[0],
        $ = v ? Math.max(0, H(w) - H(v)) : 8;
      ((n.injuries = [...n.injuries, w.id]),
        (n = tt(
          n,
          v
            ? `${w.name} m\xE5 ut med skade. ${v.name} kommer inn p\xE5 ${w.position}. Lagstyrke \u2212${$}.`
            : `${w.name} m\xE5 ut med skade. Ingen naturlig reserve er tilgjengelig p\xE5 ${w.position}.`,
          !0,
        )),
        (n.userAttack = Math.max(20, n.userAttack - $ * 0.22)),
        (n.userDefense = Math.max(20, n.userDefense - $ * 0.22)),
        (n.momentum = b(n.momentum - 6 - Math.min(8, $), -100, 100)));
    }
  }
  if (Math.random() < y)
    if (i) {
      const N = b(
        0.31 + d / 115 + n.winProbability * 0.16 + g + c * 0.025,
        0.055,
        0.88,
      );
      if (Math.random() < N) {
        const w = Math.random() < b(0.3 - d / 220, 0.12, 0.42),
          v = w ? 3 : 7,
          $ = recordScoringPlay(
            n.playerBox,
            e.roster,
            w ? "fieldGoal" : "touchdown",
          ),
          D = w
            ? 18 + Math.floor(Math.random() * 35)
            : 22 + Math.floor(Math.random() * 48);
        ((n.homeScore += v),
          (n.playerBox = $.box),
          (n.teamStats = {
            ...n.teamStats,
            totalYards: n.teamStats.totalYards + D,
            firstDowns: n.teamStats.firstDowns + (w ? 1 : 2),
          }),
          (n.momentum = b(n.momentum + (w ? 6 : 13), -100, 100)),
          (n = tt(n, $.text, !0)),
          (n.possession = "away"));
      } else
        Math.random() < b(0.18 - d / 380, 0.06, 0.31)
          ? (() => {
              const N = recordOffensiveTurnover(n.playerBox, e.roster);
              ((n.playerBox = N.box),
                (n.teamStats = {
                  ...n.teamStats,
                  turnovers: n.teamStats.turnovers + 1,
                }),
                (n.possession = "away"),
                (n.momentum = b(n.momentum - 10, -100, 100)),
                (n = tt(n, N.text, !0)));
            })()
          : ((n.teamStats = {
              ...n.teamStats,
              totalYards:
                n.teamStats.totalYards + 5 + Math.floor(Math.random() * 12),
              firstDowns:
                n.teamStats.firstDowns + (Math.random() < 0.58 ? 1 : 0),
            }),
            (n.momentum = b(n.momentum + (d >= 0 ? 4 : 1), -100, 100)),
            (n = tt(
              n,
              d >= 0
                ? "Angrepet flytter kjedene."
                : "Motstanderen presser frem en vanskelig tredje down.",
            )),
            Math.random() < 0.52 && (n.possession = "away"));
    } else {
      const N = b(
        0.39 + u / 112 + n.winProbability * 0.13 + g - n.momentum * 0.0015,
        0.08,
        0.93,
      );
      if (Math.random() < N)
        (() => {
          const w = recordDefensivePlay(n.playerBox, e.roster);
          ((n.playerBox = w.box),
            (n.teamStats = {
              ...n.teamStats,
              defensiveStops: n.teamStats.defensiveStops + 1,
            }),
            (n.possession = "home"),
            (n.momentum = b(n.momentum + 9, -100, 100)),
            (n = tt(n, w.text, !0)));
        })();
      else {
        const w = Math.random() < b(0.28 + u / 260, 0.12, 0.38),
          v = w ? 3 : 7;
        ((n.awayScore += v),
          (n.momentum = b(n.momentum - (w ? 6 : 13), -100, 100)),
          (n = tt(
            n,
            w
              ? `${n.opponentName} scorer field goal.`
              : `Touchdown til ${n.opponentName}.`,
            !0,
          )),
          (n.possession = "home"));
      }
    }
  else
    ((n.teamStats = i
      ? {
          ...n.teamStats,
          totalYards:
            n.teamStats.totalYards + 2 + Math.floor(Math.random() * 8),
        }
      : n.teamStats),
      (n.momentum = b(n.momentum + (k > 0 ? 1.5 : -1.5), -100, 100)),
      (n = tt(
        n,
        i
          ? "Angrepet bygger et kontrollert drive."
          : "Motstanderen bruker tid p\xE5 klokken.",
      )),
      Math.random() < 0.4 && (n.possession = i ? "away" : "home"));
  if (n.ticksLeft === 0) {
    n.homeScore === n.awayScore &&
      (Math.random() < n.winProbability
        ? ((n.homeScore += 3),
          (n = tt(n, `${e.profile.clubName} avgj\xF8r i overtime.`, !0)))
        : ((n.awayScore += 3),
          (n = tt(n, `${n.opponentName} avgj\xF8r i overtime.`, !0))));
    const N = n.homeScore > n.awayScore;
    n.expectedUserWin !== N &&
      Math.random() < 0.78 &&
      (n.expectedUserWin
        ? ((n.homeScore = Math.max(
            n.homeScore,
            n.awayScore + (Math.random() < 0.72 ? 7 : 3),
          )),
          (n = tt(
            n,
            `${e.profile.clubName} avgj\xF8r sent etter \xE5 ha kontrollert matchupen.`,
            !0,
          )))
        : ((n.awayScore = Math.max(
            n.awayScore,
            n.homeScore + (Math.random() < 0.72 ? 7 : 3),
          )),
          (n = tt(
            n,
            `${n.opponentName} straffer feilene og avgj\xF8r sent.`,
            !0,
          ))));
  }
  return n;
}
function _r(e, s, n) {
  const r = an(n);
  return e.map((c) => {
    const i = ct(c, n);
    if (i.id === s) return i;
    const d = r.min + Math.random() * (r.max - r.min),
      u = Math.random() < b(0.5 + (i.power - d) / 85, 0.2, 0.8),
      g = 10 + Math.floor(Math.random() * 28) + (u ? 7 : 0),
      k = 10 + Math.floor(Math.random() * 28) + (u ? 0 : 7),
      y = b(
        i.morale + (u ? 2 : -2) + Math.round((Math.random() - 0.5) * 2),
        45,
        94,
      ),
      f = b(i.chemistry + (u ? 0.5 : -0.2), 45, 94);
    return ct(
      {
        ...i,
        morale: y,
        chemistry: f,
        wins: i.wins + (u ? 1 : 0),
        losses: i.losses + (u ? 0 : 1),
        pointsFor: i.pointsFor + g,
        pointsAgainst: i.pointsAgainst + k,
        form: [...i.form, u ? "W" : "L"].slice(-5),
        mediaProfile: b(i.mediaProfile + (u ? 1 : -0.3), 20, 100),
        budget: Math.max(
          15e3,
          Math.round(
            i.budget + (u ? 2400 : -900) + (Math.random() - 0.5) * 3e3,
          ),
        ),
      },
      n,
    );
  });
}
function qr(e) {
  const s = e.trainingPlan,
    n = e.staff.headCoach;
  return e.roster.map((r) => {
    const c =
        r.potential === "S"
          ? 0.16
          : r.potential === "A"
            ? 0.1
            : r.potential === "B"
              ? 0.05
              : 0,
      i = r.age <= 23 ? 0.12 + e.upgrades.academy * 0.025 : 0,
      d = 0.18 + n * 0.05 + e.upgrades.training * 0.035 + c + i;
    let u = r.attack,
      g = r.defense,
      k = r.stamina,
      y = r.morale,
      f = r.chemistry,
      N = r.condition;
    (s === "attack" && Math.random() < d && (u = b(u + 1, 20, 99)),
      s === "defense" && Math.random() < d && (g = b(g + 1, 20, 99)),
      s === "fitness" && Math.random() < d && (k = b(k + 1, 20, 99)),
      s === "balanced" &&
        (Math.random() < d * 0.55 && (u = b(u + 1, 20, 99)),
        Math.random() < d * 0.55 && (g = b(g + 1, 20, 99))),
      s === "chemistry" &&
        ((f = b(f + 4 + n, 10, 100)), (y = b(y + 3, 10, 100))),
      s === "recovery"
        ? (N = b(N + 18 + e.staff.physio * 4 + e.upgrades.medical * 3, 10, 100))
        : (N = b(
            N - (s === "fitness" ? 9 : 5) + e.staff.physio * 1.5,
            10,
            100,
          )));
    const w = e.settings.autoRehab
        ? e.staff.medicalDirector + e.systemInvestments.medicalAnalytics
        : 0,
      v =
        r.injuryWeeks > 0 && w > 0 && Math.random() < Math.min(0.65, w * 0.09)
          ? 1
          : 0;
    return {
      ...r,
      attack: u,
      defense: g,
      stamina: k,
      morale: y,
      chemistry: f,
      condition: b(N + (r.injuryWeeks > 0 ? w * 0.7 : 0), 10, 100),
      injuryWeeks: Math.max(0, r.injuryWeeks - (s === "recovery" ? 2 : 1) - v),
    };
  });
}
function Vr(e, s, n, r) {
  return {
    ...e,
    wins: e.wins + (s ? 0 : 1),
    losses: e.losses + (s ? 1 : 0),
    pointsFor: e.pointsFor + r,
    pointsAgainst: e.pointsAgainst + n,
    form: [...e.form, s ? "L" : "W"].slice(-5),
  };
}
function Er(e) {
  if (e.activeDecision) return e.activeDecision;
  if (
    e.phase !== "club" ||
    e.seasonStage !== "regular" ||
    e.week <= 1 ||
    e.week >= oe
  )
    return;
  const n = e.settings.autoMedia && e.staff.mediaOfficer > 0 ? 0.06 : 0.18;
  if (Math.random() > n) return;
  const r = ee(e.roster),
    c = new Set((e.decisionHistory ?? []).slice(0, 5)),
    i = ["party", "contractDemand"];
  (c.has("ticketProtest") || i.push("ticketProtest"),
    e.lastReport &&
      !e.lastReport.won &&
      !c.has("pressLoss") &&
      i.push("pressLoss", "pressLoss"),
    e.activeSponsor && !c.has("sponsorConflict") && i.push("sponsorConflict"),
    _t(e, "stadium") && !c.has("stadiumFault") && i.push("stadiumFault"));
  const d = ee(i.length ? i : ["contractDemand"]);
  if (d === "party")
    return {
      id: be("decision"),
      kind: d,
      category: "players",
      title: "Disiplin\xE6rsak i spillergruppen",
      text: `${r.name} ble observert ute sent f\xF8r neste kamp. Hvordan f\xF8lger klubben opp?`,
      playerId: r.id,
      choices: [
        {
          id: "warn",
          label: "Intern advarsel",
          detail: "Bedre disiplin og kjemi, men spilleren mister litt moral.",
        },
        {
          id: "protect",
          label: "Beskytt spilleren offentlig",
          detail: "Laget liker lojaliteten, styret blir mer skeptisk.",
        },
        {
          id: "bench",
          label: "Benk spilleren",
          detail: "Tydelig reaksjon med sportslig konsekvens.",
        },
      ],
    };
  if (d === "ticketProtest") {
    const u = !!(
      e.lastReport &&
      !e.lastReport.won &&
      e.lastReport.scoreLine.match(/(\d+)–(\d+)/) &&
      Math.abs(
        Number(e.lastReport.scoreLine.match(/(\d+)–(\d+)/)?.[1]) -
          Number(e.lastReport.scoreLine.match(/(\d+)–(\d+)/)?.[2]),
      ) >= 14
    );
    return {
      id: be("decision"),
      kind: d,
      category: "supporters",
      title: u
        ? "Supporterne krever svar etter stortapet"
        : "Supportergruppen ber om m\xF8te",
      text: u
        ? `${e.profile.supporterName} krever en tydelig reaksjon etter ${e.lastReport?.scoreLine}.`
        : `${e.profile.supporterName} mener billettprisene og kampdagstilbudet ikke st\xE5r i stil med klubbens utvikling.`,
      choices: u
        ? [
            {
              id: "own",
              label: "M\xF8t dem og ta ansvar",
              detail:
                "Stor positiv effekt p\xE5 tillit, liten risiko mot styret.",
            },
            {
              id: "fanDay",
              label: "Gi rabatt p\xE5 neste hjemmekamp",
              detail:
                "Koster penger, men l\xF8fter ettersp\xF8rsel og tilfredshet.",
            },
            {
              id: "changes",
              label: "Lov sportslige endringer",
              detail: "Gir h\xE5p n\xE5, men \xF8ker presset p\xE5 neste kamp.",
            },
          ]
        : [
            {
              id: "lower",
              label: "Juster prisene",
              detail:
                "Lavere pris og h\xF8yere ettersp\xF8rsel de neste kampene.",
            },
            {
              id: "fanDay",
              label: "Invester i supporterdag",
              detail: "Koster penger, men styrker tilfredshet og lojalitet.",
            },
            {
              id: "ignore",
              label: "Avvis kravet",
              detail: "Ingen kostnad, men svakere tillit og ettersp\xF8rsel.",
            },
          ],
    };
  }
  return d === "pressLoss"
    ? {
        id: be("decision"),
        kind: d,
        category: "press",
        title: "Pressekonferanse etter nederlaget",
        text: `Journalist: \xABDere tapte ${e.lastReport?.scoreLine ?? "klart"}. Har du fortsatt kontroll over laget?\xBB`,
        choices: [
          {
            id: "own",
            label: "\xABJeg tar ansvaret\xBB",
            detail: "Laget respekterer deg. Styret forventer en reaksjon.",
          },
          {
            id: "players",
            label: "\xABSpillerne leverte ikke\xBB",
            detail: "Styret liker tydeligheten, men garderoben reagerer.",
          },
          {
            id: "officials",
            label: "\xABKampen ble avgjort av ytre forhold\xBB",
            detail: "Kan samle supporterne, men svekker omd\xF8mmet.",
          },
        ],
      }
    : d === "contractDemand"
      ? {
          id: be("decision"),
          kind: d,
          category: "players",
          title: "Spillerens representant ber om m\xF8te",
          text: `${r.name} \xF8nsker en tydeligere rolle og ny kontrakt.`,
          playerId: r.id,
          choices: [
            {
              id: "renew",
              label: "\xC5pne kontraktsforhandling",
              detail: "Lengre avtale, h\xF8yere l\xF8nn og bedre moral.",
            },
            {
              id: "deny",
              label: "Avsl\xE5 n\xE5",
              detail: "Sparer penger, men spilleren blir misforn\xF8yd.",
            },
            {
              id: "sell",
              label: "Gj\xF8r spilleren tilgjengelig",
              detail: "Gir overgangsinntekt, men reduserer dybden.",
            },
          ],
        }
      : d === "sponsorConflict"
        ? {
            id: be("decision"),
            kind: d,
            category: "sponsors",
            title: "Sponsor ber om endret eksponering",
            text: "Hovedsponsoren vil ha mer synlighet p\xE5 stadion og i mediearbeidet.",
            choices: [
              {
                id: "accept",
                label: "Godta mot betaling",
                detail: "Mer penger, men litt svakere supporterprofil.",
              },
              {
                id: "negotiate",
                label: "Forhandle om balanse",
                detail: "Usikkert resultat basert p\xE5 organisasjonen din.",
              },
              {
                id: "refuse",
                label: "Avsl\xE5 kravet",
                detail: "Styrker omd\xF8mmet, men kj\xF8ler sponsorforholdet.",
              },
            ],
          }
        : {
            id: be("decision"),
            kind: d,
            category: "operations",
            title: "Driftsavvik p\xE5 stadion",
            text: "Flomlys og str\xF8mforsyning trenger tiltak f\xF8r neste hjemmekamp.",
            choices: [
              {
                id: "repair",
                label: "Full reparasjon",
                detail: "H\xF8y kostnad, lav risiko og bedre styretillit.",
              },
              {
                id: "patch",
                label: "Midlertidig utbedring",
                detail: "Billigere, men kan gi nytt avvik.",
              },
              {
                id: "delay",
                label: "Utsett tiltaket",
                detail: "Sparer penger n\xE5, men skader tillit og omd\xF8mme.",
              },
            ],
          };
}
function Kn(e) {
  return e === "press"
    ? "Presse"
    : e === "supporters"
      ? "Supportere"
      : e === "board"
        ? "Styre"
        : e === "players"
          ? "Spillere"
          : e === "operations"
            ? "Drift"
            : "Sponsorer";
}
function xs(e) {
  return e.category === "press"
    ? "Svar pressen"
    : e.category === "supporters"
      ? "M\xF8t supporterne"
      : e.category === "operations"
        ? "Behandle avvik"
        : e.category === "sponsors"
          ? "Behandle sponsor"
          : "Ta avgj\xF8relse";
}
function ya(e) {
  const s = [
      {
        id: "transfer",
        label: "Sportslig satsing",
        detail:
          "+$4K i kontrollert spillerbudsjett. Styret forventer sluttspilljakt.",
      },
      {
        id: "stadium",
        label: "Kampdagsl\xF8ft",
        detail: "$6K i tilskudd til neste kampdags- eller stadionprosjekt.",
      },
      {
        id: "academy",
        label: "Akademiplan",
        detail: "$5K i talenttilskudd, bedre scouting og sterkere omd\xF8mme.",
      },
      {
        id: "commercial",
        label: "Kommersiell vekst",
        detail: "Nye sponsortilbud og et lite l\xF8ft i klubbprofil.",
      },
      {
        id: "salary",
        label: "H\xF8yere l\xF8nnsramme",
        detail: "+$3.5K i ukentlig salary cap denne sesongen.",
      },
      {
        id: "reserve",
        label: "Likviditetsl\xE5n",
        detail: "+$8K n\xE5, men tilbakebetales som klubbgjeld.",
      },
    ],
    n = new Set(
      e.boardDecisionHistory
        .filter(
          (u) =>
            u.season === e.season &&
            u.result === "Godkjent" &&
            e.week - u.week < 8,
        )
        .map((u) => u.title),
    ),
    r = s.filter((u) => !n.has(u.label)),
    c =
      e.week <= 1
        ? "Sesong\xE5pning og mandat"
        : e.week >= oe
          ? "Sesongevaluering"
          : e.boardTrust < 35
            ? "Ekstraordin\xE6rt krisem\xF8te"
            : "Midtveisevaluering",
    i =
      e.boardStrategy === "sporting"
        ? "transfer"
        : e.boardStrategy === "youth"
          ? "academy"
          : e.boardStrategy === "commercial"
            ? "commercial"
            : e.boardStrategy === "infrastructure"
              ? "stadium"
              : "reserve",
    d = [...r].sort((u, g) => +(g.id === i) - +(u.id === i)).slice(0, 4);
  return {
    title: `${c} \u2013 sesong ${e.season}`,
    text:
      e.week <= 1
        ? `Styret skal vedta hovedprioritering for sesongen. Gjeldende mandat er \xAB${so(e.boardStrategy)}\xBB.`
        : e.boardTrust < 35
          ? "Styret krever en konkret plan for \xE5 stabilisere klubben. Valget vil p\xE5virke jobbsikkerheten din."
          : "Styret vurderer resultat, \xF8konomi og klubbkultur. Velg ett tiltak med tydelig konsekvens.",
    choices: d.length >= 3 ? d : s.slice(0, 4),
  };
}
const Wr = {
    transferBudget: {
      title: "Ekstra spillerbudsjett",
      detail: "Be styret finansiere en sportslig forsterkning.",
      benefit: "+$5K kontrollert spillerbudsjett",
    },
    salaryCap: {
      title: "\xD8kt l\xF8nnsramme",
      detail: "Be om mer handlingsrom til kontrakter og signeringer.",
      benefit: "+$4K salary cap",
    },
    stadiumGrant: {
      title: "Anleggstilskudd",
      detail: "Be styret prioritere publikums- og kampdagsinntekter.",
      benefit: "+1 tribuneniv\xE5",
    },
    goalRelief: {
      title: "Juster sesongm\xE5let",
      detail: "Be om ett lavere seierskrav mot redusert tillit.",
      benefit: "-1 krav til seire",
    },
  },
  Hr = {
    playoffs: {
      title: "Jeg leverer sluttspillniv\xE5",
      detail: "N\xE5 styrets seiersm\xE5l innen sesongen avsluttes.",
      reward: 3e3,
      penalty: 9,
    },
    profit: {
      title: "Klubben g\xE5r i pluss",
      detail: "Lever positivt driftsresultat denne sesongen.",
      reward: 2500,
      penalty: 8,
    },
    youth: {
      title: "Unge spillere f\xE5r ansvar",
      detail:
        "Ha minst tre startere p\xE5 23 \xE5r eller yngre ved sesongslutt.",
      reward: 2e3,
      penalty: 6,
    },
    fans: {
      title: "Vi bygger supporterbasen",
      detail: "Lever tydelig, realistisk supportervekst denne sesongen.",
      reward: 1800,
      penalty: 6,
    },
  };
function Sa(e, s) {
  const n = Hr[s],
    r =
      s === "playoffs"
        ? e.boardGoals.wins
        : s === "profit"
          ? 0
          : s === "youth"
            ? 3
            : e.fans + Math.max(25, Math.round(e.fans * 0.22));
  return {
    id: be("board-promise"),
    kind: s,
    title: n.title,
    detail: n.detail,
    target: r,
    deadlineSeason: e.season,
    rewardCash: n.reward,
    penaltyTrust: n.penalty,
    status: "active",
  };
}
function Ur(e, s) {
  if (s.kind === "playoffs")
    return {
      current: e.wins,
      target: s.target,
      label: `${e.wins}/${s.target} seire`,
    };
  if (s.kind === "profit") {
    const n = e.financialHistory
      .filter((r) => r.label.startsWith(`S${s.deadlineSeason} `))
      .reduce((r, c) => r + c.profit, 0);
    return { current: n, target: 0, label: `${n >= 0 ? "+" : ""}${h(n)}` };
  }
  if (s.kind === "youth") {
    const n = e.roster.filter((r) => r.starter && r.age <= 23).length;
    return {
      current: n,
      target: s.target,
      label: `${n}/${s.target} unge startere`,
    };
  }
  return {
    current: e.fans,
    target: s.target,
    label: `${Z(e.fans)}/${Z(s.target)} supportere`,
  };
}
function Yr(e, s) {
  const n = Ur(e, s);
  return s.kind === "profit" ? n.current >= 0 : n.current >= n.target;
}
function zr(e) {
  let s = e.cash,
    n = e.boardTrust;
  const r = [],
    c = [...e.boardDecisionHistory],
    i = e.boardPromises.map((d) =>
      d.status !== "active" || d.deadlineSeason !== e.season
        ? d
        : Yr(e, d)
          ? ((s += d.rewardCash),
            (n = b(n + 3, 0, 100)),
            r.push(
              `Styrel\xF8ftet \xAB${d.title}\xBB ble innfridd. +${h(d.rewardCash)}.`,
            ),
            c.unshift({
              id: be("board-record"),
              season: e.season,
              week: e.week,
              title: d.title,
              result: "L\xF8fte innfridd",
              detail: `Bonus ${h(d.rewardCash)} og \xF8kt tillit.`,
            }),
            { ...d, status: "met" })
          : ((n = b(n - d.penaltyTrust, 0, 100)),
            r.push(
              `Styrel\xF8ftet \xAB${d.title}\xBB ble brutt. -${d.penaltyTrust} tillit.`,
            ),
            c.unshift({
              id: be("board-record"),
              season: e.season,
              week: e.week,
              title: d.title,
              result: "L\xF8fte brutt",
              detail: `Styret trakk ${d.penaltyTrust} tillitspoeng.`,
            }),
            { ...d, status: "failed" }),
    );
  return {
    game: {
      ...e,
      cash: s,
      boardTrust: n,
      boardPromises: i,
      boardDecisionHistory: c.slice(0, 20),
    },
    messages: r,
  };
}
function Jr(e, s) {
  return s === "firstWin"
    ? e.wins > 0 || e.history.some((n) => !n.record.startsWith("0-"))
    : s === "fans5000"
      ? e.fans >= 5e3
      : s === "cash100k"
        ? e.cash >= 1e5
        : s === "star"
          ? e.roster.some((n) => H(n) >= 82)
          : s === "champion"
            ? e.trophies > 0
            : s === "stadium"
              ? Ct(e) >= 18
              : s === "legend"
                ? e.legends.length > 0
                : s === "world"
                  ? e.leagueIndex === le.length - 1
                  : !1;
}
function Qr(e) {
  let s = e;
  return (
    hr.forEach((n) => {
      !s.completedAchievements.includes(n.id) &&
        Jr(s, n.id) &&
        (s = A(
          {
            ...s,
            cash: s.cash + n.cash,
            completedAchievements: [...s.completedAchievements, n.id],
          },
          [`${n.icon} Achievement: ${n.title}. +${h(n.cash)}.`],
        ));
    }),
    s
  );
}
function Et(e) {
  const s = e.roster.reduce((r, c) => r + c.value, 0),
    n = Ct(e) * 18e3;
  return Math.max(
    0,
    Math.round(
      s +
        n +
        e.fans * 34 +
        e.reputation * 2200 +
        e.cash -
        getDebtSnapshot(e).totalDebt,
    ),
  );
}
function wa(e, s) {
  const n = e,
    r = s.homeScore > s.awayScore,
    c = da(n),
    i = mn(n),
    d = n.leagueTeams.find((K) => K.id === s.opponentId),
    u = s.home
      ? n.stadiumOwnership === "rented"
        ? 0.68
        : n.stadiumOwnership === "owned"
          ? 1
          : 1.06
      : 0.08,
    g = s.home ? (n.stadiumOwnership === "rented" ? 0.52 : 1) : 0.05;
  let k = Math.round(s.attendance * s.ticketPrice * u * c.income),
    y = Math.round(
      Math.min(s.attendance * 0.04, 70 + n.upgrades.vip * 130) *
        (82 + n.upgrades.vip * 27) *
        u *
        c.income,
    ),
    f = Math.round(
      s.attendance *
        (0.31 + n.upgrades.food * 0.07) *
        n.pricing.food *
        g *
        c.income,
    ),
    N = Math.round(
      s.attendance *
        (0.075 + n.upgrades.merch * 0.042) *
        n.pricing.merch *
        g *
        c.income,
    );
  const w = Le(n),
    v = w.reduce((K, ye) => K + ye.weeklyPay, 0),
    $ = r ? w.reduce((K, ye) => K + ye.winBonus, 0) : 0,
    D = r && i?.playoff ? w.reduce((K, ye) => K + ye.playoffBonus, 0) : 0,
    q =
      r && i?.playoff === "final"
        ? w.reduce((K, ye) => K + ye.titleBonus, 0)
        : 0,
    x = $ + D + q,
    R = w.map((K) => {
      const ye =
        (r ? K.winBonus : 0) +
        (r && i?.playoff ? K.playoffBonus : 0) +
        (r && i?.playoff === "final" ? K.titleBonus : 0);
      return {
        id: be("sponsor-ledger"),
        season: n.season,
        week: n.week,
        sponsorName: K.name,
        slot: K.slot,
        kind: "match",
        basePay: K.weeklyPay,
        bonus: ye,
        total: K.weeklyPay + ye,
        note: ye ? "Ukesbetaling og resultatbonus" : "Fast ukesbetaling",
      };
    }),
    E = Cs(n, d, i, r);
  let T = E.revenue;
  const Y = k + y + f + N,
    ae = [22e3, 48e3, 105e3, 21e4, 39e4][n.leagueIndex] ?? 22e3,
    B = 1 + Math.min(0.55, Math.log1p(Math.max(0, n.fans)) / 28),
    W = ae * B * (i?.playoff === "final" ? 1.7 : i?.playoff ? 1.3 : 1),
    L = Y > W ? W / Y : 1;
  ((k = Math.round(k * L)),
    (y = Math.round(y * L)),
    (f = Math.round(f * L)),
    (N = Math.round(N * L)));
  const U = se(n),
    G = yt(n),
    re = In(n),
    he = k + y + f + N,
    O =
      ([22e3, 48e3, 105e3, 21e4, 39e4][n.leagueIndex] ?? 22e3) *
      (1 + Math.min(0.55, Math.log1p(Math.max(0, n.fans)) / 28)),
    Q = he > O ? O / he : 1;
  ((k = Math.round(k * Q)),
    (y = Math.round(y * Q)),
    (f = Math.round(f * Q)),
    (N = Math.round(N * Q)));
  const De = processWeeklyDebt(n),
    Ae = Math.round(
      (qe(n) < 3 ? 180 : 700) + s.attendance * (qe(n) < 3 ? 0.2 : 0.35),
    ),
    Ge = k + y + f + N + v + x + T,
    $e = U + G + re + Ae + De.payment,
    xe = Ge - $e,
    He = d.name === n.profile.rivalName,
    P = s.homeScore - s.awayScore,
    V = s.winProbability,
    de = r ? 1 - V : V,
    te = Math.min(3, Math.floor(Math.abs(P) / 10)),
    Me = r ? Math.round(de * 4) : -Math.round(de * 5),
    nt = r ? 4 + te : -4 - te,
    Ht =
      s.occupancy >= 0.92
        ? 2
        : s.occupancy >= 0.7
          ? 1
          : s.occupancy < 0.2
            ? -1
            : 0,
    gt = He ? (r ? 3 : -3) : 0,
    Ue = i?.playoff ? (r ? 3 : -2) : 0,
    qn = b(
      Math.round(w.reduce((K, ye) => K + ye.supporterApproval, 0) / 10),
      -2,
      2,
    ),
    gn = n.fanSatisfactionScore ?? 67,
    Pt = b(
      nt + Me + gt + Ue + (xe >= 0 ? 1 : 0) - (s.occupancy < 0.25 ? 1 : 0),
      -9,
      8,
    ),
    Ut = b(gn + Pt, 10, 98),
    ke = Dr(n, Ut),
    Yt = Ir(n, r, de, te, He, !!i?.playoff, Ut),
    Ye = Math.round(
      Math.max(-Math.max(3, Math.round(n.fans * 0.003)), Yt + ke) * ns(n),
    ),
    bn = Math.abs(P) >= 21 ? 9 : Math.abs(P) >= 10 ? 5 : 2,
    F = Math.round(
      (r ? 8 : 3) +
        bn +
        (He ? 11 : 0) +
        (i?.playoff ? 18 : 0) +
        Math.log1p(E.audience) * 0.72 +
        E.reachGain,
    ),
    hn = b(
      Math.round(
        ((r ? 2 + n.leagueIndex : -1) + (i?.playoff && r ? 2 : 0)) * ns(n),
      ),
      -4,
      8,
    ),
    kn = Math.round(
      ((r ? 3 : -3) +
        (xe > 0 ? 1 : -1) +
        (Math.abs(P) >= 21 ? (r ? 1 : -2) : 0)) *
        c.trust,
    ),
    finalPlayerBox = finalizeMatchPlayerBox(
      s.playerBox ?? createMatchPlayerBox(n.roster),
      n.roster,
      s,
    ),
    matchLeaders = topMatchPerformers(finalPlayerBox, 5),
    matchMvpId = matchLeaders[0]?.playerId,
    Aa = n.staff.medicalDirector + n.systemInvestments.medicalAnalytics,
    preparedRoster = qr({
      ...n,
      roster: n.roster.map((K) => ({
        ...K,
        condition: b(
          K.condition -
            (K.starter ? 9 : 3) +
            (n.settings.autoRehab && K.injuryWeeks > 0 ? Aa : 0),
          10,
          100,
        ),
        morale: b(K.morale + (r ? 5 : -4) + (K.captain ? 1 : 0), 10, 100),
        chemistry: b(K.chemistry + (r ? 2 : 0), 10, 100),
        injuryWeeks: (s.injuries ?? []).includes(K.id)
          ? Math.max(K.injuryWeeks, 1 + Math.floor(Math.random() * 3))
          : K.injuryWeeks,
      })),
    }).map((K) => ({ ...K })),
    zt = applyMatchStatsToRoster(preparedRoster, finalPlayerBox, n.season, {
      won: r,
      playoff: Boolean(i?.playoff),
      mvpId: matchMvpId,
    }),
    St = zt.find((K) => K.id === matchMvpId) ?? zt[0];
  let Vn = _r(n.leagueTeams, d.id, n.leagueIndex).map((K) =>
    K.id === d.id ? Vr(K, r, s.homeScore, s.awayScore) : K,
  );
  Vn = Vn.map((K) =>
    Math.random() < 0.09
      ? {
          ...K,
          transferActivity: weeklyTeamActivity(K),
        }
      : K,
  );
  const leagueUpdates = createWeeklyLeagueFeed({
    teams: Vn,
    opponent: Vn.find((K) => K.id === d.id),
    rivalName: n.profile.rivalName,
    season: n.season,
    week: n.week,
  });
  const Ta = n.schedule.map((K) =>
      K === i ||
      (K.week === i?.week &&
        K.opponentId === i?.opponentId &&
        K.playoff === i?.playoff)
        ? {
            ...K,
            played: !0,
            ourScore: s.homeScore,
            opponentScore: s.awayScore,
          }
        : K,
    ),
    $t = (K) => {
      if (!K) return;
      const ye =
        n.reputation < K.minReputation ||
        (K.minAttendance > 0 && s.attendance < K.minAttendance);
      return {
        ...K,
        breachWeeks: ye
          ? (K.breachWeeks ?? 0) + 1
          : Math.max(0, (K.breachWeeks ?? 0) - 1),
      };
    },
    xt = $t(n.activeSponsor),
    Jt = $t(n.equipmentSponsor),
    Qt = $t(n.boardsSponsor),
    Zt = $t(n.stadiumSponsor),
    jt = (K) => (K && (K.breachWeeks ?? 0) < 3 ? K : void 0),
    vn = jt(xt),
    yn = jt(Jt),
    Xt = jt(Qt),
    en = jt(Zt),
    tn = r ? n.records.currentWinStreak + 1 : 0,
    Sn = [
      { label: "Organisk klubbvekst", value: ke },
      { label: r ? "Sportslig resultat" : "Sportslig tilbakeslag", value: Yt },
      { label: "Netto supporterendring", value: Ye },
    ].filter((K, ye) => K.value !== 0 && (ye < 2 || Ye !== ke + Yt)),
    En = {
      title: r ? "Seier!" : "Tap",
      scoreLine: `${n.profile.clubName} ${s.homeScore}\u2013${s.awayScore} ${s.opponentName}`,
      won: r,
      attendance: s.attendance,
      mvp: St?.name ?? "Ukjent",
      mvpTeam: n.profile.clubName,
      playerStats: matchLeaders,
      teamStats: s.teamStats,
      rivalry: He,
      finance: {
        tickets: k,
        vip: y,
        food: f,
        merch: N,
        sponsor: v,
        tv: T,
        sponsorBonus: x,
        salaries: U,
        staff: G,
        maintenance: re,
        matchOps: Ae,
        debtService: De.payment,
        loanInterest: De.interest,
        profit: xe,
      },
      fansChange: Ye,
      fanSatisfactionChange: Pt,
      mediaReachChange: F,
      reputationChange: hn,
      boardChange: kn,
      capacity: s.capacity,
      demand: s.demand,
      occupancy: s.occupancy,
      waitlist: Math.max(0, s.demand - s.capacity),
      home: s.home,
      tvAudience: E.audience,
      mediaPayout: { ...E, revenue: T },
      winProbability: s.winProbability,
      powerComparison: {
        ourPower: Math.round(Ne(n).overall),
        opponentPower: Math.round(d.power),
        ourAttack: Math.round(s.userAttack),
        ourDefense: Math.round(s.userDefense),
        opponentAttack: Math.round(s.opponentAttack),
        opponentDefense: Math.round(s.opponentDefense),
      },
      fanReasons: Sn,
      scoreMargin: P,
      matchSummary: r
        ? Math.abs(P) >= 18
          ? "Laget dominerte kampen, vant n\xF8kkelsituasjonene og bygget en klar ledelse."
          : Math.abs(P) >= 8
            ? "Laget var best over tid og gjorde seieren trygg med effektivt spill."
            : V < 0.42
              ? "Laget slo oddsen med bedre effektivitet i avgj\xF8rende situasjoner."
              : "Laget avgjorde en tett kamp ved \xE5 v\xE6re skarpest i de viktigste situasjonene."
        : Math.abs(P) >= 18
          ? "Motstanderen tok kontroll tidlig, og laget klarte aldri \xE5 komme tilbake i kampen."
          : Math.abs(P) >= 8
            ? "Motstanderen var tydelig bedre i n\xF8kkelsituasjonene og vant fortjent."
            : V > 0.58
              ? "Laget underpresterte i avgj\xF8rende situasjoner og tapte en kamp dere var favoritt i."
              : "Motstanderen var litt mer effektiv i en jevn kamp.",
      notes: [
        He
          ? r
            ? "Rivalen ble sl\xE5tt. Supporterne reagerer sterkt positivt."
            : "Rivaloppgj\xF8ret ble tapt og tilfredsheten faller."
          : "",
        (s.injuries ?? []).length
          ? `${s.injuries.length} spiller(e) ble skadet.`
          : "Ingen nye skader.",
        xe < 0 ? "Kampuken ga underskudd." : "Kampuken ga overskudd.",
      ].filter(Boolean),
    },
    Wn = {
      label: `S${n.season} U${n.week}`,
      income: Ge,
      expenses: $e,
      profit: xe,
    };
  let Oe = {
    ...n,
    phase: "report",
    match: s,
    lastReport: En,
    cash: n.cash + xe,
    loans: De.loans,
    debt: De.debt,
    stadiumLoan: De.stadiumLoan,
    lastDebtPayment: {
      season: n.season,
      week: n.week,
      total: De.payment,
      principal: De.principal,
      interest: De.interest,
    },
    fans: Math.max(25, n.fans + Ye),
    fanSatisfactionScore: Ut,
    mediaReach: Math.max(50, n.mediaReach + F),
    demandMomentum: b(n.demandMomentum + Pt * 0.75 + (r ? 3 : -4), -35, 35),
    fanGroups: {
      loyal: Math.max(0, n.fanGroups.loyal + Math.round(Ye * 0.35)),
      casual: Math.max(0, n.fanGroups.casual + Math.round(Ye * 0.34)),
      family: Math.max(0, n.fanGroups.family + Math.round(Ye * 0.21)),
      vip: Math.max(0, n.fanGroups.vip + Math.round(Ye * 0.1)),
    },
    reputation: b(n.reputation + hn, 0, 100),
    boardTrust: b(n.boardTrust + kn, 0, 100),
    wins: n.wins + (r ? 1 : 0),
    losses: n.losses + (r ? 0 : 1),
    pointsFor: n.pointsFor + s.homeScore,
    pointsAgainst: n.pointsAgainst + s.awayScore,
    roster: zt,
    leagueTeams: Vn,
    leagueFeed: [...leagueUpdates, ...(n.leagueFeed ?? [])].slice(0, 40),
    news: [
      ...leagueUpdates.map((K) => `\u{1F4F0} ${K.headline}: ${K.body}`),
      ...n.news,
    ].slice(0, 16),
    rivalryRecord: He
      ? {
          wins: Number(n.rivalryRecord?.wins ?? 0) + (r ? 1 : 0),
          losses: Number(n.rivalryRecord?.losses ?? 0) + (r ? 0 : 1),
          lastResult: `${s.homeScore}\u2013${s.awayScore} ${r ? "W" : "L"}`,
        }
      : n.rivalryRecord,
    schedule: Ta,
    activeSponsor: vn,
    equipmentSponsor: yn,
    boardsSponsor: Xt,
    stadiumSponsor: en,
    financialHistory: [...n.financialHistory, Wn].slice(-18),
    mediaLedger: [
      {
        id: be("media-ledger"),
        season: n.season,
        week: n.week,
        channel: E.channel,
        format: E.format,
        audience: E.audience,
        cpm: E.cpm,
        fixedFee: E.fixedFee,
        cpmRevenue: E.cpmRevenue,
        total: T,
      },
      ...(n.mediaLedger ?? []),
    ].slice(0, 80),
    sponsorLedger: [...R, ...n.sponsorLedger].slice(0, 80),
    weeklyChallenge: {
      ...n.weeklyChallenge,
      progress:
        n.weeklyChallenge.id === "wins"
          ? n.weeklyChallenge.progress + (r ? 1 : 0)
          : n.weeklyChallenge.id === "fans"
            ? n.weeklyChallenge.progress + Math.max(0, Ye)
            : n.weeklyChallenge.progress + Math.max(0, xe),
    },
    records: {
      ...n.records,
      biggestWin: Math.max(n.records.biggestWin, s.homeScore - s.awayScore),
      recordAttendance: Math.max(n.records.recordAttendance, s.attendance),
      mostCash: Math.max(n.records.mostCash, n.cash + xe),
      bestWinStreak: Math.max(n.records.bestWinStreak, tn),
      currentWinStreak: tn,
    },
  };
  ((Oe.clubValue = Et(Oe)),
    (Oe.records.highestValue = Math.max(Oe.records.highestValue, Oe.clubValue)),
    (Oe.activeDecision = Er(Oe)),
    (Oe = Lr(Oe, [
      r
        ? `${n.profile.clubName} slo ${d.name}.`
        : `${d.name} slo ${n.profile.clubName}.`,
      St ? `${St.name} ble kampens MVP.` : "",
      `${Z(E.audience)} fulgte kampen via ${E.format.toLowerCase()}.`,
      `${E.channel} betalte ${h(T)}: ${h(E.fixedFee)} fast + ${h(E.cpmRevenue)} fra ${E.cpm} CPM, pluss ligafordeling og eventuell resultatbonus.`,
    ])));
  const wn = [
    !vn && xt ? xt : void 0,
    !yn && Jt ? Jt : void 0,
    !Xt && Qt ? Qt : void 0,
    !en && Zt ? Zt : void 0,
  ].filter(Boolean);
  return (
    wn.length &&
      (Oe = A(
        Oe,
        wn.map((K) =>
          (K.breachWeeks ?? 0) >= 3
            ? `${we(K.slot)} med ${K.name} ble avsluttet etter tre uker med brudd p\xE5 avtalekrav.`
            : `${we(K.slot)} med ${K.name} er utl\xF8pt.`,
        ),
      )),
    Oe
  );
}
function js(e, s) {
  return { id: e.id, name: e.name, logo: e.logo, seed: s };
}
function Bs(e, s) {
  return s.id === "user"
    ? Ne(e).overall
    : (e.leagueTeams.find((n) => n.id === s.id)?.power ??
        le[e.leagueIndex].basePower);
}
function Ee(e, s, n) {
  const r = Bs(e, s) + 2.5,
    c = Bs(e, n),
    i = b((r - c) / 8, -5, 5);
  let d = 13 + Math.floor(Math.random() * 18) + Math.max(0, Math.round(i)),
    u = 13 + Math.floor(Math.random() * 18) + Math.max(0, Math.round(-i));
  return (
    d === u && (Math.random() < 0.54 ? (d += 3) : (u += 3)),
    { winnerId: d > u ? s.id : n.id, score: `${d}\u2013${u}` }
  );
}
function ot(e) {
  if (e?.winnerId) return e.winnerId === e.home.id ? e.home : e.away;
}
function As(e) {
  const s = ft(e),
    n = na(e.leagueIndex),
    r = as(e.leagueIndex),
    c = s.slice(0, r).map((i, d) => js(i, d + 1));
  return n === "top4"
    ? {
        format: n,
        qualified: c.some((i) => i.id === "user"),
        userSeed: c.find((i) => i.id === "user")?.seed,
        semifinalA: { home: c[0], away: c[3] },
        semifinalB: { home: c[1], away: c[2] },
      }
    : n === "top6"
      ? {
          format: n,
          qualified: c.some((i) => i.id === "user"),
          userSeed: c.find((i) => i.id === "user")?.seed,
          quarterfinalA: { home: c[2], away: c[5] },
          quarterfinalB: { home: c[3], away: c[4] },
        }
      : {
          format: n,
          qualified: c.some((i) => i.id === "user"),
          userSeed: c.find((i) => i.id === "user")?.seed,
          quarterfinalA: { home: c[0], away: c[7] },
          quarterfinalB: { home: c[3], away: c[4] },
          quarterfinalC: { home: c[1], away: c[6] },
          quarterfinalD: { home: c[2], away: c[5] },
        };
}
function Ma(e, s) {
  if (e.format !== "top6") return e;
  const n = s.slice(0, 6).map((i, d) => js(i, d + 1)),
    r = ot(e.quarterfinalA),
    c = ot(e.quarterfinalB);
  return !r || !c
    ? e
    : {
        ...e,
        semifinalA: { home: n[0], away: c },
        semifinalB: { home: n[1], away: r },
      };
}
function Rs(e) {
  if (e.format !== "top8") return e;
  const s = ot(e.quarterfinalA),
    n = ot(e.quarterfinalB),
    r = ot(e.quarterfinalC),
    c = ot(e.quarterfinalD);
  return !s || !n || !r || !c
    ? e
    : {
        ...e,
        semifinalA: {
          home: s.seed < n.seed ? s : n,
          away: s.seed < n.seed ? n : s,
        },
        semifinalB: {
          home: r.seed < c.seed ? r : c,
          away: r.seed < c.seed ? c : r,
        },
      };
}
function Na(e, s) {
  let n = JSON.parse(JSON.stringify(s));
  ((n.format === "top6" || n.format === "top8") &&
    (n.quarterfinalA &&
      !n.quarterfinalA.winnerId &&
      Object.assign(
        n.quarterfinalA,
        Ee(e, n.quarterfinalA.home, n.quarterfinalA.away),
      ),
    n.quarterfinalB &&
      !n.quarterfinalB.winnerId &&
      Object.assign(
        n.quarterfinalB,
        Ee(e, n.quarterfinalB.home, n.quarterfinalB.away),
      ),
    n.quarterfinalC &&
      !n.quarterfinalC.winnerId &&
      Object.assign(
        n.quarterfinalC,
        Ee(e, n.quarterfinalC.home, n.quarterfinalC.away),
      ),
    n.quarterfinalD &&
      !n.quarterfinalD.winnerId &&
      Object.assign(
        n.quarterfinalD,
        Ee(e, n.quarterfinalD.home, n.quarterfinalD.away),
      ),
    (n = n.format === "top6" ? Ma(n, ft(e)) : Rs(n))),
    n.semifinalA &&
      !n.semifinalA.winnerId &&
      Object.assign(n.semifinalA, Ee(e, n.semifinalA.home, n.semifinalA.away)),
    n.semifinalB &&
      !n.semifinalB.winnerId &&
      Object.assign(n.semifinalB, Ee(e, n.semifinalB.home, n.semifinalB.away)));
  const r = [ot(n.semifinalA), ot(n.semifinalB)].filter(Boolean);
  return (
    r.length === 2 && (n.final = n.final ?? { home: r[0], away: r[1] }),
    n.final &&
      !n.final.winnerId &&
      Object.assign(n.final, Ee(e, n.final.home, n.final.away)),
    n.final?.winnerId &&
      (n.championName =
        n.final.winnerId === n.final.home.id
          ? n.final.home.name
          : n.final.away.name),
    n
  );
}
function Ca(e, s, n) {
  const r = e.lastReport,
    c = r?.scoreLine.match(/(\d+)–(\d+)/)?.[0] ?? "",
    i = e.match?.opponentId,
    d = (g) =>
      g && (g.home.id === "user" || g.away.id === "user")
        ? { ...g, winnerId: r?.won ? "user" : i, score: c }
        : g;
  if (n === "quarterfinal")
    return {
      ...s,
      quarterfinalA: d(s.quarterfinalA),
      quarterfinalB: d(s.quarterfinalB),
      quarterfinalC: d(s.quarterfinalC),
      quarterfinalD: d(s.quarterfinalD),
    };
  if (n === "semifinal")
    return { ...s, semifinalA: d(s.semifinalA), semifinalB: d(s.semifinalB) };
  const u = d(s.final);
  return {
    ...s,
    final: u,
    championName: u?.winnerId
      ? u.winnerId === u.home.id
        ? u.home.name
        : u.away.name
      : s.championName,
  };
}
function Zr(e, s) {
  return (
    s === "quarterfinal"
      ? [e.quarterfinalA, e.quarterfinalB, e.quarterfinalC, e.quarterfinalD]
      : s === "semifinal"
        ? [e.semifinalA, e.semifinalB]
        : [e.final]
  ).find((r) => r && (r.home.id === "user" || r.away.id === "user"));
}
function fn(e, s, n, r) {
  const c = Zr(s, n);
  if (!c) return e;
  const i = c.home.id === "user" ? c.away : c.home;
  return A(
    {
      ...e,
      phase: "club",
      seasonStage: n,
      playoffBracket: s,
      weekStep: 3,
      schedule: [
        ...e.schedule,
        {
          week: r,
          opponentId: i.id,
          home: c.home.id === "user",
          played: !1,
          playoff: n,
        },
      ],
    },
    [
      n === "quarterfinal"
        ? `\u{1F525} Kvartfinale mot ${i.name}.`
        : n === "semifinal"
          ? `\u{1F3C6} Semifinale mot ${i.name}.`
          : `\u{1F451} Mesterskapsfinale mot ${i.name}.`,
    ],
  );
}
function Pa(e) {
  if (e.seasonStage === "regular" && e.week >= oe) {
    const s = ft(e),
      n = s.findIndex((i) => i.id === "user") + 1;
    let r = As(e);
    if (!r.qualified)
      return (
        (r = Na(e, r)),
        Fn(
          { ...e, seasonStage: "complete", playoffBracket: r },
          `Sesongen endte p\xE5 ${n}. plass. ${r.championName} vant sluttspillet.`,
        )
      );
    if (r.format === "top8") {
      for (const i of [
        r.quarterfinalA,
        r.quarterfinalB,
        r.quarterfinalC,
        r.quarterfinalD,
      ])
        i &&
          !i.winnerId &&
          i.home.id !== "user" &&
          i.away.id !== "user" &&
          Object.assign(i, Ee(e, i.home, i.away));
      return fn(e, r, "quarterfinal", 13);
    }
    if (r.format === "top6" && (r.userSeed ?? 9) >= 3) {
      const i =
        r.quarterfinalA &&
        (r.quarterfinalA.home.id === "user" ||
          r.quarterfinalA.away.id === "user")
          ? r.quarterfinalB
          : r.quarterfinalA;
      return (
        i && !i.winnerId && Object.assign(i, Ee(e, i.home, i.away)),
        fn(e, r, "quarterfinal", 13)
      );
    }
    r.format === "top6" &&
      (r.quarterfinalA &&
        !r.quarterfinalA.winnerId &&
        Object.assign(
          r.quarterfinalA,
          Ee(e, r.quarterfinalA.home, r.quarterfinalA.away),
        ),
      r.quarterfinalB &&
        !r.quarterfinalB.winnerId &&
        Object.assign(
          r.quarterfinalB,
          Ee(e, r.quarterfinalB.home, r.quarterfinalB.away),
        ),
      (r = Ma(r, s)));
    const c =
      r.semifinalA &&
      (r.semifinalA.home.id === "user" || r.semifinalA.away.id === "user")
        ? r.semifinalB
        : r.semifinalA;
    return (
      c && !c.winnerId && Object.assign(c, Ee(e, c.home, c.away)),
      fn(e, r, "semifinal", 13)
    );
  }
  if (e.seasonStage === "quarterfinal" && e.playoffBracket) {
    let s = Ca(e, e.playoffBracket, "quarterfinal");
    if (!e.lastReport?.won)
      return (
        (s = Na(e, s)),
        Fn(
          { ...e, seasonStage: "complete", playoffBracket: s },
          `Kvartfinaletap. ${s.championName} vant sluttspillet.`,
        )
      );
    s = s.format === "top8" ? Rs(s) : Ma(s, ft(e));
    const n =
      s.semifinalA &&
      (s.semifinalA.home.id === "user" || s.semifinalA.away.id === "user")
        ? s.semifinalB
        : s.semifinalA;
    return (
      n && !n.winnerId && Object.assign(n, Ee(e, n.home, n.away)),
      fn({ ...e, playoffBracket: s }, s, "semifinal", 14)
    );
  }
  if (e.seasonStage === "semifinal" && e.playoffBracket) {
    let s = Ca(e, e.playoffBracket, "semifinal");
    if (!e.lastReport?.won)
      return (
        (s = Na(e, s)),
        Fn(
          { ...e, seasonStage: "complete", playoffBracket: s },
          `Semifinaletap. ${s.championName} vant finalen.`,
        )
      );
    const n = [ot(s.semifinalA), ot(s.semifinalB)].filter(Boolean);
    return (
      (s = {
        ...s,
        final: {
          home: n.sort((r, c) => r.seed - c.seed)[0],
          away: n.sort((r, c) => r.seed - c.seed)[1],
        },
      }),
      fn({ ...e, playoffBracket: s }, s, "final", e.week + 1)
    );
  }
  if (e.seasonStage === "final" && e.playoffBracket) {
    const s = Ca(e, e.playoffBracket, "final"),
      n = e.lastReport?.won,
      r = n ? { ...e, trophies: e.trophies + 1 } : e;
    return Fn(
      { ...r, seasonStage: "complete", playoffBracket: s },
      n
        ? "\u{1F451} MESTER! Sesongpremier og TV-fordeling utbetales i oppsummeringen."
        : `${s.championName} vant finalen.`,
    );
  }
  return e;
}
function Xr(e, s, n) {
  const r = le[e.leagueIndex].prize,
    i = Math.round(
      r * (s === 1 ? 0.45 : s === 2 ? 0.3 : s === 3 ? 0.2 : s === 4 ? 0.1 : 0),
    ),
    d = !!e.playoffBracket?.qualified,
    u = !!(
      e.playoffBracket?.final &&
      (e.playoffBracket.final.home.id === "user" ||
        e.playoffBracket.final.away.id === "user")
    ),
    k = Math.round(r * (n ? 0.55 : u ? 0.28 : d ? 0.12 : 0)),
    y = Math.min(
      Math.round(r * 0.58),
      Math.round(
        r * (0.12 + e.leagueIndex * 0.025) +
          Math.log1p(Math.max(0, e.mediaReach)) * (220 + e.leagueIndex * 70) +
          Math.log1p(Math.max(0, e.fans)) * (95 + e.leagueIndex * 30),
      ),
    ),
    f = e.sponsorLedger
      .filter((x) => x.season === e.season)
      .reduce((x, R) => x + R.bonus, 0),
    N = n
      ? 0.32
      : s === 1
        ? 0.22
        : s === 2
          ? 0.16
          : s === 3
            ? 0.11
            : d
              ? 0.075
              : s <= 5
                ? 0.035
                : 0.01,
    w =
      1 +
      e.upgrades.museum * 0.045 +
      e.systemInvestments.supporterCrm * 0.065 +
      e.staff.marketing * 0.028,
    v = n
      ? 55 + e.leagueIndex * 40
      : s === 1
        ? 38 + e.leagueIndex * 28
        : s === 2
          ? 26 + e.leagueIndex * 20
          : s === 3
            ? 18 + e.leagueIndex * 14
            : d
              ? 12 + e.leagueIndex * 9
              : s <= 5
                ? 7
                : 2,
    $ = Math.max(v, Math.round(e.fans * N * w)),
    D = Math.round(
      (n ? 500 : s <= 3 ? 260 : d ? 140 : 60) * (1 + e.leagueIndex * 0.6) +
        e.mediaReach * (n ? 0.08 : 0.035),
    ),
    q = n ? 14 : s <= 3 ? 9 : d ? 5 : s <= 5 ? 2 : -2;
  return {
    placementPrize: i,
    playoffPrize: k,
    tvDistribution: y,
    sponsorBonuses: f,
    totalReward: i + k + y,
    fansAward: $,
    mediaAward: D,
    satisfactionBoost: q,
  };
}
function Fn(e, s) {
  const n = ft(e),
    r = e.playoffBracket?.userSeed ?? n.findIndex((G) => G.id === "user") + 1,
    c =
      e.playoffBracket?.championName ??
      (s.includes("MESTER") ? e.profile.clubName : "Ukjent"),
    i = c === e.profile.clubName,
    d = Xr(e, r, i),
    u = {
      ...e,
      cash: e.cash + d.totalReward,
      fans: e.fans + d.fansAward,
      mediaReach: e.mediaReach + d.mediaAward,
      fanSatisfactionScore: b(
        e.fanSatisfactionScore + d.satisfactionBoost,
        10,
        100,
      ),
      demandMomentum: b(
        e.demandMomentum + Math.max(0, d.satisfactionBoost),
        -35,
        35,
      ),
      fanGroups: {
        loyal: e.fanGroups.loyal + Math.round(d.fansAward * 0.42),
        casual: e.fanGroups.casual + Math.round(d.fansAward * 0.3),
        family: e.fanGroups.family + Math.round(d.fansAward * 0.2),
        vip: e.fanGroups.vip + Math.round(d.fansAward * 0.08),
      },
    },
    g = zr(u),
    k = g.game,
    y = k.financialHistory
      .filter((G) => G.label.startsWith(`S${k.season} `))
      .reduce((G, re) => G + re.profit, 0),
    f = selectSeasonAwards(k.roster),
    N = f.mvp,
    w = f.young,
    v = f.offense,
    $ = f.defense,
    seasonStatLeaders = seasonLeaders(k.roster).map((G) => ({
      key: G.key,
      label: G.label,
      playerId: G.player.id,
      playerName: G.player.name,
      value: Number(G.player.seasonStats?.[G.key] ?? 0),
    })),
    D = i ? k.lastReport?.mvp || N?.name : void 0,
    q = Math.max(
      1,
      Math.round(
        (i ? 14 : r <= 3 ? 7 : k.playoffBracket?.qualified ? 4 : 2) +
          k.leagueIndex * 3,
      ),
    ),
    x = k.playoffBracket
      ? [
          k.playoffBracket.final,
          k.playoffBracket.semifinalA,
          k.playoffBracket.semifinalB,
          k.playoffBracket.quarterfinalA,
          k.playoffBracket.quarterfinalB,
          k.playoffBracket.quarterfinalC,
          k.playoffBracket.quarterfinalD,
        ].find((G) => G && (G.home.id === "user" || G.away.id === "user"))
      : void 0,
    R = x ? (x.home.id === "user" ? x.away.name : x.home.name) : void 0,
    E = {
      season: k.season,
      league: le[k.leagueIndex].name,
      record: `${k.wins}-${k.losses}`,
      result: i ? "Mester" : `${r}. plass`,
      profit: y,
      bestPlayer: N?.name ?? "Ukjent",
      placementPrize: d.placementPrize,
      playoffPrize: d.playoffPrize,
      tvDistribution: d.tvDistribution,
      sponsorBonuses: d.sponsorBonuses,
      totalReward: d.totalReward,
      fansAward: d.fansAward,
      fansStart: k.seasonStartFans ?? k.fans - d.fansAward,
      fansChange: k.fans - (k.seasonStartFans ?? k.fans - d.fansAward),
      mediaAward: d.mediaAward,
      tiebreakReason: Or(k, r),
      seasonMvp: N?.name,
      youngPlayer: w?.name,
      offensivePlayer: v?.name,
      defensivePlayer: $?.name,
      playoffMvp: D,
      playoffSeed: k.playoffBracket?.userSeed,
      playoffFinish: i
        ? "Mester"
        : k.seasonStage === "complete" && k.playoffBracket?.qualified
          ? k.playoffBracket?.final && x === k.playoffBracket.final
            ? "Finale"
            : k.playoffBracket?.semifinalA || k.playoffBracket?.semifinalB
              ? "Semifinale"
              : "Kvartfinale"
          : "Ikke kvalifisert",
      playoffOpponent: R,
      finalScore: k.playoffBracket?.final?.score,
      fameAward: q,
      clubValueEnd: k.clubValue,
      fansEnd: k.fans,
      seasonStatLeaders,
    },
    awardIds = [N?.id, w?.id, v?.id, $?.id].filter(Boolean),
    T = archiveRosterSeason(
      k.roster.map((G) => ({
        ...G,
        seasonAwardCount:
          Number(G.seasonAwardCount ?? 0) +
          awardIds.filter((re) => re === G.id).length,
      })),
      k.season,
      le[k.leagueIndex].name,
    ).map((G) => ({ ...G, contractYears: G.contractYears - 1 })),
    Y = T.filter((G) => G.age >= 34 && Math.random() < 0.45),
    ae = Y.filter((G) => G.careerGames >= 8 || G.careerAwards >= 2).map((G) =>
      createLegendFromPlayer(
        G,
        H(G),
        Math.max(1, Math.round(G.careerGames / oe)),
      ),
    ),
    B = T.filter((G) => !Y.some((re) => re.id === G.id)),
    L = {
      ...{ ...k, famePoints: Math.min(999, (k.famePoints ?? 0) + q) },
      activeSponsor: jn(k.activeSponsor),
      equipmentSponsor: jn(k.equipmentSponsor),
      boardsSponsor: jn(k.boardsSponsor),
      stadiumSponsor: jn(k.stadiumSponsor),
    };
  let U = Ce({
    ...L,
    phase: "offseason",
    seasonStage: "complete",
    roster: B,
    draftProspects: is(
      k.leagueIndex,
      k.upgrades.academy + k.systemInvestments.scoutingDb,
      k.staff.scout + k.staff.sportingDirector,
      k.profile.region,
    ),
    draftPicks: 2 + (r >= 6 ? 1 : 0),
    history: [...k.history, E],
    legends: [...k.legends, ...ae],
    playerAwardHistory: [
      {
        season: k.season,
        league: le[k.leagueIndex].name,
        mvp: N?.name,
        young: w?.name,
        offense: v?.name,
        defense: $?.name,
        playoffMvp: D,
      },
      ...(k.playerAwardHistory ?? []),
    ].slice(0, 40),
    offseasonChecklist: Qa(),
  });
  return (
    (U = ss(U)),
    A(U, [
      s,
      `Sesongpriser: MVP ${N?.name ?? "Ukjent"}${w ? ` \xB7 \xC5rets unge ${w.name}` : ""}${D ? ` \xB7 Sluttspill-MVP ${D}` : ""}.`,
      `Fame: +${q} \xB7 Sesongpremier: ${h(d.totalReward)} \xB7 ${E.fansChange >= 0 ? "+" : ""}${E.fansChange} supportere gjennom hele sesongen \xB7 +${Z(d.mediaAward)} medierekkevidde.`,
      ...g.messages,
      `Sluttspillmester: ${c}.`,
      Y.length
        ? `${Y.map((G) => G.name).join(", ")} la opp.`
        : "Ingen spillere la opp denne offseason.",
    ])
  );
}
function $a(e) {
  if (e.phase !== "report") return e;
  if (e.seasonStage !== "regular" || e.week >= oe)
    return Pa({ ...e, phase: "club" });
  const s = e.week + 1,
    n =
      e.boardTrust < 28 ||
      e.cash < -12e3 ||
      getDebtSnapshot(e).totalDebt > Math.max(15e4, e.clubValue * 0.7),
    r = Ln(e) && s >= e.nextBoardMeetingWeek,
    c = !e.boardMeeting && (r || n) ? ya({ ...e, week: s }) : e.boardMeeting;
  let i = {
    ...e,
    phase: "club",
    week: s,
    weekStep: 0,
    match: void 0,
    lastReport: e.lastReport,
    boardMeeting: c,
    freeAgents:
      s % 2 === 0
        ? vt(
            e.leagueIndex,
            e.upgrades.scouting + e.systemInvestments.scoutingDb,
            e.staff.scout + e.staff.sportingDirector,
            e.profile.region,
          )
        : e.freeAgents,
    sponsorOffers:
      s % 2 === 0
        ? ut(
            e.reputation,
            e.leagueIndex,
            e.upgrades.media + e.staff.marketing,
            e.profile.region,
            e.fans,
            e.clubBase,
          )
        : e.sponsorOffers,
  };
  i = {
    ...i,
    transferOffers: i.transferOffers.filter((k) => k.expiresWeek >= s),
  };
  const u = s >= 3 && Math.random() < 0.11 ? Ss(i) : void 0;
  return (
    u &&
      (i = {
        ...i,
        transferOffers: [u],
        transferOfferCooldownUntil: Kt(i) + 5,
        playerOfferCooldowns: {
          ...i.playerOfferCooldowns,
          [u.playerId]: Kt(i) + 8,
        },
      }),
    (i = hs(i).game),
    i
  );
}
function eo(e) {
  const s = e.roster.filter((r) => r.condition < 55).length;
  let n = {
    ...e,
    trainingPlan: s >= 3 ? "recovery" : e.trainingPlan,
    weekStep: 3,
    activeDecision: e.activeDecision,
    roster: e.roster.map((r) =>
      e.settings.autoBenchInjured && r.injuryWeeks > 0
        ? { ...r, starter: !1 }
        : r,
    ),
  };
  return (
    (n = { ...n, roster: qt(n, "opponent") }),
    n.settings.ticketStrategy !== "manual" &&
      (n = { ...n, pricing: { ...n.pricing, ticket: Vt(n, Qe(n)) } }),
    n
  );
}
function Ts(e) {
  return e.phase === "offseason"
    ? "Sesongen er ferdig \u2013 offseason er klar."
    : e.seasonStage !== "regular" && e.settings.autoStopPlayoffs
      ? `Sluttspillet er klart: ${e.seasonStage === "quarterfinal" ? "kvartfinale" : e.seasonStage === "semifinal" ? "semifinale" : "finale"}.`
      : e.boardMeeting && e.settings.autoStopCriticalBoard && aa(e)
        ? "Styret har et kritisk vedtak som krever avgj\xF8relsen din."
        : e.activeDecision &&
            (e.activeDecision.category === "operations" ||
              e.activeDecision.category === "players")
          ? `${Kn(e.activeDecision.category)}: ${e.activeDecision.title}.`
          : e.transferOffers.find((n) => {
                const r = e.roster.find((c) => c.id === n.playerId);
                return r ? n.amount >= Fe(e, r).midpoint * 1.25 : !1;
              })
            ? "Et stort overgangsbud krever vurdering."
            : e.roster.some((n) => n.injuryWeeks >= 3)
              ? "En alvorlig skade krever oppf\xF8lging."
              : pe(e).profit < 0 && e.cash < Math.abs(pe(e).profit) * 4
                ? "\xD8konomien n\xE6rmer seg kritisk niv\xE5."
                : "";
}
function to(e, s) {
  const n = e.cash,
    r = e.fans,
    c = e.week;
  let i = e.phase === "report" ? $a(e) : e,
    d = 0,
    u = 0,
    g = 0;
  const k = [];
  let y = "";
  for (let f = 0; f < 24; f += 1) {
    if (i.phase === "offseason") {
      y = "Sesongen er ferdig \u2013 offseason er klar.";
      break;
    }
    if ((i.phase === "report" && (i = $a(i)), i.phase === "offseason")) {
      y = "Sesongen er ferdig \u2013 offseason er klar.";
      break;
    }
    if (i.phase !== "club") {
      y = "Autokj\xF8ring stoppet fordi klubben ikke er i vanlig sesongflyt.";
      break;
    }
    if (
      (i.boardMeeting && !aa(i) && (i = $r(i)),
      i.seasonStage !== "regular" && i.settings.autoStopPlayoffs)
    ) {
      y = `Sluttspillet er klart: ${i.seasonStage === "quarterfinal" ? "kvartfinale" : i.seasonStage === "semifinal" ? "semifinale" : "finale"}.`;
      break;
    }
    if (s === "event" && d > 0) {
      const D = Ts(i);
      if (D) {
        y = D;
        break;
      }
    }
    const N = eo(i);
    if (!ka(N)) {
      ((y = "Troppen mangler en frisk starter i \xE9n eller flere posisjoner."),
        (i = N));
      break;
    }
    let w = $s(N, "instant");
    for (; w.ticksLeft > 0; ) w = va(N, w);
    const v = wa(N, w),
      $ = !!v.lastReport?.won;
    if (
      ((d += 1),
      (u += $ ? 1 : 0),
      (g += $ ? 0 : 1),
      k.push(
        `Uke ${v.week}: ${v.lastReport?.scoreLine ?? "Resultat"} ${$ ? "W" : "L"}`,
      ),
      (i = v),
      s === "event")
    ) {
      const D = Ts(i);
      if (D) {
        y = D;
        break;
      }
    }
    if (i.seasonStage === "regular" && i.week >= oe) {
      if (((i = $a(i)), i.seasonStage !== "regular")) {
        y = `Grunnserien er ferdig. ${i.playoffBracket?.qualified ? `Du er seed #${i.playoffBracket.userSeed} og sluttspillet er klart.` : "Klubben gikk ikke videre til sluttspillet."}`;
        break;
      }
    } else if (i.seasonStage !== "regular") {
      y = "Sluttspillrunden krever et aktivt valg.";
      break;
    }
  }
  return (
    y ||
      (y =
        s === "event"
          ? "Neste viktige hendelse er ikke n\xE5dd enn\xE5."
          : s === "playoffs"
            ? "Autokj\xF8ringen n\xE5dde sluttspillet."
            : "Autokj\xF8ringen er fullf\xF8rt."),
    {
      game: A(i, [
        `\u{1F916} Auto-manager spilte ${d} kamp${d === 1 ? "" : "er"} (${u}-${g}). ${y}`,
      ]),
      report: {
        mode: s,
        games: d,
        wins: u,
        losses: g,
        cashChange: i.cash - n,
        fansChange: i.fans - r,
        startWeek: c,
        endWeek: i.week,
        stopReason: y,
        results: k.slice(-8),
      },
    }
  );
}
function no() {
  const [e, s] = ge(() => ms()),
    [n, r] = ge("hq"),
    [c, i] = ge("overview"),
    [d, u] = ge("all"),
    [g, k] = ge(1),
    [y, f] = ge(() => ms().profile),
    [N, w] = ge(""),
    [v, $] = ge(!0),
    [D, q] = ge(!1),
    [x, R] = ge(null),
    [E, T] = ge(null),
    [Y, ae] = ge(null),
    [B, W] = ge(!1),
    [L, U] = ge(null),
    [G, re] = ge(!1),
    [he, O] = ge(!!document.fullscreenElement),
    Q = ur({ musicNodes: [], musicStep: 0 }),
    De = kt(() => Ne(e), [e]),
    Ae = kt(() => Qe(e), [e]),
    Ge = kt(() => ft(e), [e]),
    $e = Ge.findIndex((o) => o.id === "user") + 1,
    xe = kt(() => se(e), [e]),
    He = kt(() => yt(e), [e]),
    P = kt(() => pe(e, xe, He), [e, xe, He]),
    DebtState = kt(() => getDebtSnapshot(e), [e]),
    V = kt(() => un(e), [e]),
    de = kt(() => mt(e), [e]),
    te = e.phase === "match" || e.phase === "halftime",
    Me = te,
    nt = mo(e),
    Ht = oo(e.boardTrust),
    gt = mn(e),
    Ue = e.profile.language;
  (Rt(() => {
    if (
      e.phase !== "match" ||
      !e.match ||
      e.match.mode === "instant" ||
      g === 0
    )
      return;
    const o = window.setInterval(
      () => {
        s((l) => {
          if (l.phase !== "match" || !l.match) return l;
          let m = l;
          for (let p = 0; p < g && !(m.phase !== "match" || !m.match); p += 1) {
            const S = va(m, m.match),
              M = Math.floor(S.totalTicks / 2);
            if (
              ["live", "highlights"].includes(S.mode) &&
              !S.halftimeTriggered &&
              S.ticksLeft === M
            ) {
              m = {
                ...m,
                phase: "halftime",
                match: {
                  ...S,
                  halftimeTriggered: !0,
                  decisionType: "halftime",
                  bigMoment: "\u23F8\uFE0F Pause \u2013 velg justering",
                },
              };
              break;
            }
            const C = Math.floor(S.totalTicks / 4);
            if (
              S.mode === "live" &&
              S.halftimeTriggered &&
              !S.lateDecisionTriggered &&
              S.ticksLeft === C
            ) {
              m = {
                ...m,
                phase: "halftime",
                match: {
                  ...S,
                  lateDecisionTriggered: !0,
                  decisionType: "late",
                  bigMoment:
                    "\u23F1\uFE0F Fjerde quarter \u2013 velg sluttplan",
                },
              };
              break;
            }
            if (S.ticksLeft <= 0) {
              m = wa(m, S);
              break;
            }
            m = { ...m, match: S };
          }
          return m;
        });
      },
      e.match.mode === "fast" ? 250 : e.match.mode === "highlights" ? 560 : 760,
    );
    return () => window.clearInterval(o);
  }, [e.phase, e.match?.mode, g]),
    Rt(() => {
      if (!e.settings.autosave) return;
      const o = localStorage.getItem(Mn);
      (o && localStorage.setItem(nn, o),
        localStorage.setItem(
          Mn,
          JSON.stringify({ ...e, lastSeen: Date.now() }),
        ));
    }, [e]),
    Rt(() => {
      (document.documentElement.classList.toggle(
        "large-text",
        e.settings.largeText,
      ),
        document.documentElement.classList.toggle(
          "reduced-motion",
          e.settings.reducedMotion,
        ),
        document.documentElement.classList.toggle(
          "compact-ui",
          e.settings.compactMode,
        ));
      const o =
          window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? !1,
        l =
          e.settings.theme === "system"
            ? o
              ? "dark"
              : "light"
            : e.settings.theme;
      document.documentElement.dataset.theme = l;
    }, [e.settings]),
    Rt(() => {
      if ((gn(), !e.settings.music)) return;
      const o = () => Pt();
      return (
        window.addEventListener("pointerdown", o, { once: !0 }),
        window.addEventListener("keydown", o, { once: !0 }),
        Q.current.context?.state === "running" && o(),
        () => {
          (window.removeEventListener("pointerdown", o),
            window.removeEventListener("keydown", o),
            gn());
        }
      );
    }, [e.settings.music, e.settings.musicVolume, e.phase, e.lastReport?.won]),
    Rt(() => {
      const o = () => O(!!document.fullscreenElement);
      return (
        document.addEventListener("fullscreenchange", o),
        () => document.removeEventListener("fullscreenchange", o)
      );
    }, []),
    Rt(() => {
      const o = (l) => {
        if (
          l.target?.matches('input, textarea, select, [contenteditable="true"]')
        )
          return;
        if (l.key === "?") {
          (l.preventDefault(), q(!0));
          return;
        }
        if (l.key === "Escape") {
          q(!1);
          return;
        }
        if (l.key.toLowerCase() === "f") {
          (l.preventDefault(), bn());
          return;
        }
        if (l.key.toLowerCase() === "s") {
          (l.preventDefault(), ke("settings"));
          return;
        }
        const S = { 1: "hq", 2: "team", 3: "stadium", 4: "season" }[l.key];
        S && (l.preventDefault(), ke(S));
      };
      return (
        window.addEventListener("keydown", o),
        () => window.removeEventListener("keydown", o)
      );
    }, [Me]));
  function qn() {
    try {
      if (Q.current.context) return Q.current.context;
      const o = window.AudioContext || window.webkitAudioContext;
      return o ? ((Q.current.context = new o()), Q.current.context) : void 0;
    } catch {
      return;
    }
  }
  function gn() {
    if (
      (Q.current.musicTimer && window.clearInterval(Q.current.musicTimer),
      (Q.current.musicTimer = void 0),
      Q.current.musicNodes.forEach((o) => {
        try {
          o.disconnect();
        } catch {}
      }),
      (Q.current.musicNodes = []),
      Q.current.musicGain)
    )
      try {
        Q.current.musicGain.disconnect();
      } catch {}
    Q.current.musicGain = void 0;
  }
  function Pt() {
    if (!e.settings.music || Q.current.musicTimer) return;
    const o = qn();
    if (!o) return;
    o.resume();
    const l = o.createGain(),
      m = o.createBiquadFilter(),
      p = o.createDynamicsCompressor();
    ((l.gain.value = Math.max(0.002, (e.settings.musicVolume / 100) * 0.085)),
      (m.type = "lowpass"),
      (m.frequency.value = e.phase === "match" ? 5600 : 4200),
      (m.Q.value = 0.7),
      (p.threshold.value = -22),
      (p.knee.value = 18),
      (p.ratio.value = 4),
      (p.attack.value = 0.01),
      (p.release.value = 0.28),
      l.connect(m),
      m.connect(p),
      p.connect(o.destination),
      (Q.current.musicGain = l),
      (Q.current.musicNodes = [m, p]));
    const S = (Se) => 440 * Math.pow(2, (Se - 69) / 12),
      M = (Se, ue, Ie, at, it = 0.02, lt = 0) => {
        const Te = o.currentTime,
          st = o.createOscillator(),
          At = o.createGain();
        ((st.type = at),
          (st.frequency.value = S(Se)),
          (st.detune.value = lt),
          At.gain.setValueAtTime(1e-4, Te),
          At.gain.exponentialRampToValueAtTime(Math.max(2e-4, Ie), Te + it),
          At.gain.setValueAtTime(
            Math.max(2e-4, Ie * 0.72),
            Te + Math.max(it + 0.01, ue * 0.55),
          ),
          At.gain.exponentialRampToValueAtTime(1e-4, Te + ue),
          st.connect(At),
          At.connect(l),
          st.start(Te),
          st.stop(Te + ue + 0.03));
      },
      C = () => {
        if (Q.current.noiseBuffer) return Q.current.noiseBuffer;
        const Se = o.createBuffer(
            1,
            Math.floor(o.sampleRate * 0.24),
            o.sampleRate,
          ),
          ue = Se.getChannelData(0);
        for (let Ie = 0; Ie < ue.length; Ie += 1)
          ue[Ie] = Math.random() * 2 - 1;
        return ((Q.current.noiseBuffer = Se), Se);
      },
      j = (Se, ue, Ie) => {
        const at = o.currentTime,
          it = o.createBufferSource(),
          lt = o.createBiquadFilter(),
          Te = o.createGain();
        ((it.buffer = C()),
          (lt.type = "highpass"),
          (lt.frequency.value = Ie),
          Te.gain.setValueAtTime(ue, at),
          Te.gain.exponentialRampToValueAtTime(1e-4, at + Se),
          it.connect(lt),
          lt.connect(Te),
          Te.connect(l),
          it.start(at),
          it.stop(at + Se));
      },
      I = () => {
        const Se = o.currentTime,
          ue = o.createOscillator(),
          Ie = o.createGain();
        ((ue.type = "sine"),
          ue.frequency.setValueAtTime(108, Se),
          ue.frequency.exponentialRampToValueAtTime(44, Se + 0.16),
          Ie.gain.setValueAtTime(0.16, Se),
          Ie.gain.exponentialRampToValueAtTime(1e-4, Se + 0.19),
          ue.connect(Ie),
          Ie.connect(l),
          ue.start(Se),
          ue.stop(Se + 0.2));
      },
      z = [
        [45, 48, 52],
        [41, 45, 48],
        [48, 52, 55],
        [43, 47, 50],
      ],
      ce = [
        [48, 52, 55],
        [43, 47, 50],
        [45, 48, 52],
        [41, 45, 48],
      ],
      ie = e.phase === "report" && e.lastReport?.won ? ce : z,
      J = e.phase === "match" || e.phase === "halftime",
      ze = 6e4 / (J ? 112 : e.phase === "report" ? 92 : 84) / 2,
      Bt = [2, void 0, 1, void 0, 2, 1, 0, void 0],
      ht = () => {
        const Se = Q.current.musicStep % 32,
          ue = Se % 8,
          Ie = Math.floor(Se / 8) % ie.length,
          at = ie[Ie],
          it = at[0];
        (ue === 0 &&
          at.forEach((Te, st) => {
            M(
              Te,
              (ze / 1e3) * 7.6,
              st === 0 ? 0.075 : 0.052,
              st === 1 ? "triangle" : "sine",
              0.2,
              st === 2 ? 4 : 0,
            );
          }),
          (ue === 0 || ue === 4) &&
            M(it - 12, (ze / 1e3) * 1.8, 0.115, "sine", 0.025),
          J && (ue === 0 || ue === 4) && I(),
          J && (ue === 2 || ue === 6) && j(0.12, 0.045, 1500),
          (J || ue % 2 === 0) && j(0.045, J ? 0.018 : 0.009, 5200));
        const lt = Bt[ue];
        if (lt !== void 0) {
          const Te = at[lt] + 12;
          (M(Te, (ze / 1e3) * 1.25, J ? 0.052 : 0.038, "triangle", 0.012),
            e.phase === "report" &&
              e.lastReport?.won &&
              ue === 0 &&
              M(Te + 12, (ze / 1e3) * 1.5, 0.025, "sine", 0.01));
        }
        Q.current.musicStep += 1;
      };
    (ht(), (Q.current.musicTimer = window.setInterval(ht, ze)));
  }
  function Ut(o = "click") {
    if (e.settings.sound)
      try {
        const l = qn();
        if (!l) return;
        l.resume();
        const m = l.createOscillator(),
          p = l.createGain();
        ((m.type = o === "bad" ? "sawtooth" : "sine"),
          m.frequency.setValueAtTime(
            o === "good" ? 620 : o === "bad" ? 175 : 360,
            l.currentTime,
          ),
          o === "good" &&
            m.frequency.exponentialRampToValueAtTime(860, l.currentTime + 0.11),
          p.gain.setValueAtTime(
            Math.max(0.008, (e.settings.sfxVolume / 100) * 0.075),
            l.currentTime,
          ),
          p.gain.exponentialRampToValueAtTime(
            1e-4,
            l.currentTime + (o === "good" ? 0.16 : 0.09),
          ),
          m.connect(p),
          p.connect(l.destination),
          m.start(),
          m.stop(l.currentTime + (o === "good" ? 0.17 : 0.1)),
          e.settings.music && Pt());
      } catch {}
  }
  function ke(o) {
    if (Me && o !== "hq" && o !== "settings") {
      r("hq");
      return;
    }
    r(o);
  }
  function Yt(o, l, m) {
    (o === "finance" && (i(l ?? "overview"), u(m ?? "all")), ke(o));
  }
  function Ye(o) {
    Yt(o.tab, o.financeSection, o.sponsorSlot);
  }
  async function bn() {
    try {
      document.fullscreenElement
        ? await document.exitFullscreen?.()
        : await document.documentElement.requestFullscreen?.();
    } catch {
      F((o) =>
        A(o, [
          "\u{1F5A5}\uFE0F Fullskjerm ble blokkert av nettleseren. Bruk nettleserens egen fullskjermknapp.",
        ]),
      );
    }
  }
  function F(o, l = "click") {
    (Ut(l), s((m) => Qr(o(m))));
  }
  function hn() {
    if (
      !y.clubName.trim() ||
      !y.managerName.trim() ||
      !y.stadiumName.trim() ||
      !y.city.trim()
    )
      return;
    const o = Ea(y.region),
      l = o.some(([p]) => p === y.rivalName) ? y.rivalName : o[0][0],
      m = {
        ...y,
        clubName: y.clubName.trim(),
        managerName: y.managerName.trim(),
        city: y.city.trim(),
        stadiumName: y.stadiumName.trim(),
        rivalName: l,
      };
    F((p) => {
      const S = ra(0, m.rivalName, m.region);
      return A(
        {
          ...p,
          profile: m,
          phase: "club",
          clubBase: "rentedPitch",
          transferOffers: [],
          transferOfferCooldownUntil: Kt(p) + 4,
          playerOfferCooldowns: {},
          roster: normalizeRosterLegacy(os(m.region), 1, 0),
          seasonStartFans: p.fans,
          seasonStartCash: p.cash,
          freeAgents: vt(0, 0, 0, m.region),
          leagueTeams: S,
          schedule: oa(S),
          boardGoals: Ft(1, 0, m.strategy, 75),
          sponsorOffers: ut(
            p.reputation,
            0,
            p.upgrades.media,
            m.region,
            p.fans,
            "rentedPitch",
          ),
          activeSponsor: ca(m),
          sponsorHistory: ["Grunnpartner ved klubbstiftelsen"],
          lastSeen: Date.now(),
        },
        [
          `\u{1F6E1}\uFE0F ${m.clubName} er stiftet i ${m.city}.`,
          `\u{1F30D} Region: ${fr(m.region)}.`,
          `\u{1F454} ${m.managerName} tar rollen som ${Ls(m.managerRole)}.`,
        ],
      );
    }, "good");
  }
  function kn(o) {
    if (te || e.phase === "report") {
      F((C) =>
        A(C, [
          "Utviklingsprosjekter kan ikke startes under kamp eller kamprapport.",
        ]),
      );
      return;
    }
    const l = Ve(e);
    if (l.length >= on(e)) {
      F((C) =>
        A(C, [
          `Prosjektkapasiteten er full (${l.length}/${on(C)}). Oppgrader klubbbase eller prosjektledelse.`,
        ]),
      );
      return;
    }
    if (l.some((C) => C.id === o || Ot(C.id) === Ot(o))) {
      F((C) =>
        A(C, ["Klubben har allerede et aktivt prosjekt i denne kategorien."]),
      );
      return;
    }
    const m = et(o),
      p = e.completedProjects[o];
    if (p >= 3) {
      F((C) => A(C, [`${m.names[2]} er allerede ferdig utviklet.`]));
      return;
    }
    if (qe(e) < m.minClubLevel) {
      F((C) => A(C, [`${m.names[p]} krever klubbniv\xE5 ${m.minClubLevel}.`]));
      return;
    }
    const S = pa(e, o);
    if (!S.ok) {
      F((C) => A(C, [`${m.names[p]} kan ikke startes: ${S.reason}.`]));
      return;
    }
    const M = Dn(e, o);
    if (e.cash < M) {
      F((C) =>
        A(C, [`Du mangler ${h(M - C.cash)} for \xE5 starte prosjektet.`]),
      );
      return;
    }
    R({ kind: "project", id: o });
  }
  function Aa(o) {
    F((l) => {
      if (l.phase !== "club" && l.phase !== "offseason")
        return A(l, [
          "\u{1F512} Fasiliteter er l\xE5st under kamp og rapport.",
        ]);
      const m = l.upgrades[o],
        p = ws(o, m);
      if (l.cash < p) return A(l, [`\u{1F4B8} Du mangler ${h(p - l.cash)}.`]);
      const S = zn.find((C) => C.id === o),
        M = { ...l, cash: l.cash - p, upgrades: { ...l.upgrades, [o]: m + 1 } };
      return A({ ...M, clubValue: Et(M) }, [
        `${S.emoji} ${S.name} oppgradert til niv\xE5 ${m + 1}.`,
      ]);
    }, "good");
  }
  function zt(o) {
    F((l) => {
      if (te) return A(l, ["\u{1F512} Ansatte kan ikke endres under kamp."]);
      const m = l.staff[o],
        p = ga(o, m);
      if (l.cash < p) return A(l, [`\u{1F4B8} Du mangler ${h(p - l.cash)}.`]);
      const S = sn.find((M) => M.id === o);
      return A({ ...l, cash: l.cash - p, staff: { ...l.staff, [o]: m + 1 } }, [
        `${S.emoji} ${S.name} er n\xE5 niv\xE5 ${m + 1}.`,
      ]);
    }, "good");
  }
  function Ra(o) {
    F((l) => {
      if (te) return A(l, ["Systeminvesteringer kan ikke endres under kamp."]);
      const m = l.systemInvestments[o];
      if (m >= 3) return A(l, ["Systemet er allerede p\xE5 maksniv\xE5."]);
      const p = ba(o, m);
      if (l.cash < p) return A(l, [`Du mangler ${h(p - l.cash)}.`]);
      const S = Cn.find((M) => M.id === o);
      return A(
        {
          ...l,
          cash: l.cash - p,
          systemInvestments: { ...l.systemInvestments, [o]: m + 1 },
        },
        [`${S.name} er oppgradert til niv\xE5 ${m + 1}.`],
      );
    }, "good");
  }
  function St(o) {
    if (te || e.phase === "report") {
      F((p) => A(p, ["Flytting m\xE5 behandles utenom kamp og kamprapport."]));
      return;
    }
    const l = Be(e.clubBase),
      m = Be(o);
    if (m.rank <= l.rank) {
      F((p) => A(p, ["Du kan ikke flytte bakover i denne playtesten."]));
      return;
    }
    if (!Yn(e, o)) {
      F((p) =>
        A(p, [
          `${m.name} krever ${Z(m.minFans)} supportere, klubbprofil ${m.minProfile} og ${le[m.minLeague].name}.`,
        ]),
      );
      return;
    }
    if (e.cash < m.moveCost) {
      F((p) =>
        A(p, [
          `Du mangler ${h(m.moveCost - p.cash)} til etablering og depositum.`,
        ]),
      );
      return;
    }
    R({ kind: "move", target: o });
  }
  function Vn() {
    const o = x;
    if (o) {
      if ((R(null), o.kind === "project")) {
        F((l) => {
          if (
            te ||
            l.phase === "report" ||
            Ve(l).length >= on(l) ||
            Ve(l).some((j) => j.id === o.id || Ot(j.id) === Ot(o.id))
          )
            return l;
          const m = et(o.id),
            p = l.completedProjects[o.id],
            S = pa(l, o.id),
            M = Dn(l, o.id);
          if (p >= 3 || qe(l) < m.minClubLevel || !S.ok || l.cash < M)
            return A(l, [
              "Prosjektet kunne ikke startes fordi situasjonen har endret seg.",
            ]);
          const C = ua(l, o.id);
          return A(
            {
              ...l,
              cash: l.cash - M,
              activeDevelopmentProject: void 0,
              activeDevelopmentProjects: [
                ...Ve(l),
                { id: o.id, stage: p, weeksLeft: C, totalWeeks: C },
              ],
            },
            [
              `${m.icon} ${m.names[p]} er startet. Forventet ferdig om ${C} uker.`,
            ],
          );
        }, "good");
        return;
      }
      F((l) => {
        if (te || l.phase === "report") return l;
        const m = Be(l.clubBase),
          p = Be(o.target);
        if (p.rank <= m.rank || !Yn(l, o.target) || l.cash < p.moveCost)
          return A(l, [
            "Flyttingen kunne ikke gjennomf\xF8res fordi situasjonen har endret seg.",
          ]);
        const S = o.target === "ownedCampus",
          M = S ? 18e4 : 0,
          j = calculateBorrowingCapacity(l, {
            income: pe(l).income,
            operatingProfit: pe(l).operatingProfit,
          });
        if (S && M > j.available)
          return A(l, [
            `Stadionlånet på ${h(M)} er over ledig samlet låneramme på ${h(j.available)}.`,
          ]);
        const C = {
            ...l,
            cash: l.cash - p.moveCost,
            clubBase: o.target,
            stadiumOwnership: S ? "custom" : "rented",
            stadiumLoan: S ? l.stadiumLoan + M : l.stadiumLoan,
            reputation: b(l.reputation + p.rank * 2, 0, 100),
          };
        return A(C, [
          `${p.icon} Klubben flyttet fra ${m.name} til ${p.name}. Nye sponsor- og prosjektmuligheter er \xE5pnet.`,
        ]);
      }, "good");
    }
  }
  function Ta(o) {
    F((l) => {
      if (te || l.phase === "report")
        return A(l, [
          "Stadionkj\xF8p m\xE5 behandles utenom kamp og kamprapport.",
        ]);
      if (l.stadiumOwnership !== "rented")
        return A(l, ["Klubben eier allerede stadionanlegget."]);
      const m = Ps(l),
        p = o === "custom",
        S = Math.round(m.deposit * (p ? 1.55 : 1)),
        M = Math.round(m.loan * (p ? 1.55 : 1)),
        j = calculateBorrowingCapacity(l, {
          income: pe(l).income,
          operatingProfit: pe(l).operatingProfit,
        });
      if (l.cash < S)
        return A(l, [
          `Egenkapitalkravet er ${h(S)}. Du mangler ${h(S - l.cash)}.`,
        ]);
      if (M > j.available)
        return A(l, [
          `Stadionlånet på ${h(M)} er over ledig samlet låneramme på ${h(j.available)}.`,
        ]);
      const C = {
        ...l,
        cash: l.cash - S,
        clubBase: "ownedCampus",
        stadiumOwnership: o,
        stadiumLoan: l.stadiumLoan + M,
        upgrades: p
          ? {
              ...l.upgrades,
              seats: Math.max(l.upgrades.seats + 1, 2),
              lights: Math.max(l.upgrades.lights, 1),
            }
          : l.upgrades,
        boardTrust: b(l.boardTrust + (p ? 2 : 1), 0, 100),
      };
      return A(C, [
        p
          ? `Bygging av eget stadion er finansiert. Egenkapital ${h(S)}, l\xE5n ${h(M)}.`
          : `${ln(l)} er kj\xF8pt. Egenkapital ${h(S)}, l\xE5n ${h(M)}.`,
      ]);
    }, "good");
  }
  function $t(o) {
    F((l) => {
      if (te) return A(l, ["\u{1F512} Laguttaket er l\xE5st under kamp."]);
      const m = l.roster.find((S) => S.id === o);
      if (!m || m.injuryWeeks > 0)
        return A(l, ["\u{1F691} Skadde spillere kan ikke starte."]);
      const p = l.roster.map((S) =>
        S.position === m.position ? { ...S, starter: S.id === o } : S,
      );
      return A({ ...l, roster: p }, [
        `\u2705 ${m.name} er n\xE5 starter p\xE5 ${m.position}.`,
      ]);
    });
  }
  function xt(o = "opponent") {
    F((l) => {
      if (te) return A(l, ["\u{1F512} Laguttaket er l\xE5st under kamp."]);
      const m = qt(l, o),
        p = m.find((M) => M.captain),
        S = {
          best: "beste tilgjengelige",
          opponent: "beste mot neste motstander",
          rested: "mest uthvilte",
          chemistry: "beste kjemi",
          youth: "utvikle unge",
          cheap: "lavest l\xF8nn",
        };
      return A({ ...l, roster: m }, [
        `\u2728 Assistenten valgte ${S[o]} lag${p ? ` og satte ${p.name} som kaptein` : ""}. L\xE5ste spillere ble beholdt.`,
      ]);
    }, "good");
  }
  function Jt(o) {
    F((l) => ({
      ...l,
      roster: l.roster.map((m) =>
        m.id === o ? { ...m, locked: !m.locked } : m,
      ),
    }));
  }
  function Qt() {
    F((o) => {
      if (te) return o;
      if (o.trainingPlan === "recovery" && o.weekStep >= 1)
        return A(o, [
          "\u{1F33F} Laget har allerede f\xE5tt restitusjon denne uken.",
        ]);
      const l = o.roster.map((m) => ({
        ...m,
        condition: b(m.condition + 14 + o.staff.physio * 2, 10, 100),
        morale: b(m.morale + 2, 0, 100),
        injuryWeeks: Math.max(0, m.injuryWeeks - (o.staff.physio > 0 ? 1 : 0)),
      }));
      return A(
        {
          ...o,
          roster: l,
          trainingPlan: "recovery",
          weekStep: Math.max(o.weekStep, 1),
        },
        ["\u{1F33F} Laget fikk en rolig restitusjons\xF8kt."],
      );
    }, "good");
  }
  function Zt(o) {
    F((l) => {
      const m = Tn.find((p) => p.id === o);
      return !m || l.claimedMissions.includes(o) || !us(l, o)
        ? l
        : A(
            {
              ...l,
              cash: l.cash + m.reward,
              claimedMissions: [...l.claimedMissions, o],
            },
            [`\u2705 Oppdrag fullf\xF8rt: ${m.title}. +${h(m.reward)}.`],
          );
    }, "good");
  }
  function jt() {
    if (e.weekStep >= 3) {
      Da("highlights");
      return;
    }
    F((o) => {
      const l = Math.min(3, o.weekStep + 1);
      let m = { ...o, weekStep: l };
      return (
        l === 2 &&
          o.settings.autoRest &&
          o.roster.filter((S) => S.condition < 50).length &&
          (m = {
            ...m,
            roster: m.roster.map((S) =>
              S.condition < 50
                ? { ...S, condition: b(S.condition + 12, 0, 100) }
                : S,
            ),
          }),
        l === 3 &&
          o.settings.autoLineup &&
          (m = { ...m, roster: qt(m, "opponent") }),
        A(m, [`${cn(l).icon} ${cn(l).title}.`])
      );
    });
  }
  function vn() {
    F((o) => {
      const l = o.roster.filter((S) => S.condition < 55).length,
        m = l >= 3 ? "recovery" : o.trainingPlan;
      let p = { ...o, trainingPlan: m, weekStep: 3 };
      return (
        (p = { ...p, roster: qt(p, "opponent") }),
        A(p, [
          `\u{1F916} Assistenten gjorde uken kampklar${l >= 3 ? " og valgte restitusjon" : ""}.`,
        ])
      );
    }, "good");
  }
  function yn(o) {
    F((l) => {
      if (te) return l;
      const m = l.roster.find((p) => p.id === o);
      return m
        ? A(
            {
              ...l,
              roster: l.roster.map((p) => ({ ...p, captain: p.id === o })),
            },
            [`\u{1F9E2} ${m.name} er valgt som kaptein.`],
          )
        : l;
    }, "good");
  }
  function Xt(o, l = 3) {
    F((m) => {
      const p = m.roster.find((z) => z.id === o);
      if (!p) return m;
      const S = dt(p, l, !0, m),
        M = m.cash < S.signingBonus,
        C = M
          ? { ...S, salary: Math.round(S.salary * 1.12), signingBonus: 0 }
          : S;
      if (p.contractYears > 0 && C.years <= p.contractYears)
        return A(m, [
          `Kontrakten til ${p.name} l\xF8per allerede i ${p.contractYears} \xE5r. Velg en lengre avtale.`,
        ]);
      const j = se(m) - p.salary + C.salary,
        I = Wt(m);
      if (j > I)
        return A(m, [
          `\u{1F6AB} Kontrakten g\xE5r ${h(j - I)} over klubbens tilgjengelige l\xF8nnsramme (${h(I)}/uke).`,
        ]);
      const z = m.roster.map((ce) =>
          ce.id === o
            ? {
                ...ce,
                contractYears: C.years,
                salary: C.salary,
                morale: b(ce.morale + (M ? 6 : 9), 0, 100),
              }
            : ce,
        ),
        ce = Ce({ ...m, cash: m.cash - C.signingBonus, roster: z });
      return A(ce, [
        M
          ? `\u270D\uFE0F ${p.name} fornyet uten signeringsbonus: ${C.years} \xE5r og ${h(C.salary)}/uke. Den høyere ukelønnen erstatter bonusen.`
          : `\u270D\uFE0F ${p.name} fornyet: ${C.years} \xE5r, ${h(C.salary)}/uke og ${h(C.signingBonus)} i bonus.`,
      ]);
    }, "good");
  }
  function en() {
    if (e.phase === "offseason") {
      ae("assistantPlan");
      return;
    }
    tn();
  }
  function tn() {
    F((o) => {
      if (te) return A(o, ["Assistenten kan ikke endre troppen under kamp."]);
      const l =
        o.phase === "offseason"
          ? ta(o)
          : {
              roster: o.roster,
              cash: o.cash,
              renewed: [],
              released: [],
              blocked: [],
              projectedSalary: se(o),
              totalBonus: 0,
            };
      let m = qt({ ...o, roster: l.roster }, "opponent");
      const p =
        m.find((C) => C.captain) ??
        [...m].sort((C, j) => {
          const I =
            H(C) +
            C.morale * 0.28 +
            C.chemistry * 0.22 +
            (C.personality === "Leder" ? 24 : 0);
          return (
            H(j) +
            j.morale * 0.28 +
            j.chemistry * 0.22 +
            (j.personality === "Leder" ? 24 : 0) -
            I
          );
        })[0];
      p && (m = m.map((C) => ({ ...C, captain: C.id === p.id })));
      const S = Ce({ ...o, roster: m, cash: l.cash }),
        M = [
          `Assistenten satte beste tilgjengelige oppstilling${p ? ` og valgte ${p.name} som kaptein` : ""}.`,
          l.renewed.length
            ? `Fornyet: ${l.renewed.map((C) => `${C.name} (${C.years} \xE5r${C.deferred ? ", bonusfri" : ""})`).join(", ")}.`
            : "Ingen spillere m\xE5tte fornyes automatisk.",
          l.released.length
            ? `Frigitt: ${l.released.join(", ")}.`
            : "Ingen spillere ble frigitt.",
          l.blocked.length
            ? `M\xE5 avgj\xF8res manuelt: ${l.blocked.join(", ")}.`
            : "Alle utl\xF8pte kontrakter er avklart.",
        ];
      return A(S, M);
    }, "good");
  }
  function Sn(o) {
    if (te) {
      F((M) => A(M, ["\u{1F512} Spillere kan ikke selges under kamp."]));
      return;
    }
    const l = e.roster.find((M) => M.id === o);
    if (!l) return;
    if (e.phase !== "offseason" && e.roster.length <= ve) {
      F((M) =>
        A(M, [
          `\u26A0\uFE0F I aktiv sesong m\xE5 du beholde minst ${ve} spillere. I offseason kan du g\xE5 under grensen mens du bygger troppen p\xE5 nytt.`,
        ]),
      );
      return;
    }
    const m = Fe(e, l),
      p = l.contractYears > 0 ? ys(e, l) : void 0,
      S =
        l.contractYears <= 0
          ? 0
          : Math.round(m.midpoint * (0.82 + e.staff.cfo * 0.025));
    T({ playerId: o, buyerId: p?.id, fee: S });
  }
  function En() {
    const o = E;
    o &&
      (T(null),
      F((l) => {
        if (te) return A(l, ["\u{1F512} Spillere kan ikke selges under kamp."]);
        const m = l.roster.find((J) => J.id === o.playerId);
        if (!m) return l;
        if (l.phase !== "offseason" && l.roster.length <= ve)
          return A(l, [
            `\u26A0\uFE0F I aktiv sesong m\xE5 du beholde minst ${ve} spillere.`,
          ]);
        const p = se(l),
          S = o.buyerId
            ? l.leagueTeams.find((J) => J.id === o.buyerId)
            : void 0,
          M = m.contractYears <= 0 ? 0 : o.fee,
          C = l.roster.filter((J) => J.id !== m.id),
          j = S
            ? l.leagueTeams.map((J) =>
                J.id === S.id
                  ? ct(
                      {
                        ...J,
                        budget: Math.max(0, J.budget - M),
                        rosterValue: (J.rosterValue ?? 0) + Fe(l, m).midpoint,
                        payroll: (J.payroll ?? 0) + m.salary,
                        attack:
                          J.attack + Math.max(0, (H(m) - J.power) * 0.025),
                        defense:
                          J.defense + Math.max(0, (H(m) - J.power) * 0.025),
                        transferActivity: `Kj\xF8pte ${m.name}`,
                      },
                      l.leagueIndex,
                    )
                  : J,
              )
            : l.leagueTeams;
        let I = {
          ...l,
          cash: l.cash + M,
          roster: C,
          leagueTeams: j,
          transferOffers: l.transferOffers.filter((J) => J.playerId !== m.id),
          news:
            M > 0 && S
              ? [`${S.name} kj\xF8pte ${m.name} for ${h(M)}.`, ...l.news].slice(
                  0,
                  16,
                )
              : l.news,
        };
        I = Ce({ ...I, clubValue: Et(I) });
        const z = se(I),
          ce =
            I.phase === "offseason" && I.roster.length < ve
              ? ` Troppen er n\xE5 ${I.roster.length}/${ve}; signer en erstatter f\xF8r sesongstart.`
              : "",
          ie =
            M > 0
              ? `\u{1F4BC} ${m.name} ble solgt${S ? ` til ${S.name}` : ""} for ${h(M)}. L\xF8nn ${h(p)} \u2192 ${h(z)}/uke.${ce}`
              : `\u{1F44B} ${m.name} ble frigitt. L\xF8nn ${h(p)} \u2192 ${h(z)}/uke.${ce}`;
        return A(I, [ie]);
      }, "good"));
  }
  function Wn(o) {
    F((l) => {
      const m = Math.max(350, 1e3 - l.staff.scout * 90);
      return l.cash < m
        ? A(l, [`\u{1F4B8} Scouting koster ${h(m)}.`])
        : {
            ...l,
            cash: l.cash - m,
            freeAgents: l.freeAgents.map((p) =>
              p.id === o
                ? {
                    ...p,
                    revealed: b(
                      p.revealed +
                        34 +
                        l.staff.scout * 8 +
                        l.staff.sportingDirector * 5 +
                        l.systemInvestments.scoutingDb * 7,
                      0,
                      100,
                    ),
                  }
                : p,
            ),
            draftProspects: l.draftProspects.map((p) =>
              p.id === o
                ? {
                    ...p,
                    revealed: b(
                      p.revealed +
                        34 +
                        l.staff.scout * 8 +
                        l.staff.sportingDirector * 5 +
                        l.systemInvestments.scoutingDb * 7,
                      0,
                      100,
                    ),
                  }
                : p,
            ),
          };
    });
  }
  function Oe() {
    F((o) => {
      const l = Math.max(
        800,
        2200 +
          o.leagueIndex * 900 -
          o.staff.scout * 130 -
          o.staff.sportingDirector * 90 -
          o.systemInvestments.scoutingDb * 120,
      );
      return o.cash < l
        ? A(o, [`\u{1F4B8} Ny scoutingrunde koster ${h(l)}.`])
        : A(
            {
              ...o,
              cash: o.cash - l,
              freeAgents: vt(
                o.leagueIndex,
                o.upgrades.scouting + o.systemInvestments.scoutingDb,
                o.staff.scout + o.staff.sportingDirector,
                o.profile.region,
              ),
            },
            [`\u{1F50E} Markedet er oppdatert for ${h(l)}.`],
          );
    });
  }
  function wn(o, l = 2) {
    F((m) => {
      if (te) return A(m, ["\u{1F512} Transfers er l\xE5st under kamp."]);
      const p = m.freeAgents.find((I) => I.id === o);
      if (!p) return m;
      if (m.roster.length >= Je)
        return A(m, [`\u{1F4CB} Troppen er full. Maks ${Je} spillere.`]);
      const S = dt(p, l, !1, m),
        M = m.phase === "offseason" && m.cash < S.signingBonus,
        C = M
          ? {
              ...S,
              salary: Math.round(S.salary * 1.16),
              signingBonus: 0,
            }
          : S;
      if (m.cash < C.signingBonus)
        return A(m, [
          `\u{1F4B8} Du mangler ${h(C.signingBonus - m.cash)} til signeringsbonusen.`,
        ]);
      const j = Wt(m);
      if (se(m) + C.salary > j)
        return A(m, [
          `\u{1F6AB} Signeringen g\xE5r ${h(se(m) + C.salary - j)} over klubbens tilgjengelige l\xF8nnsramme (${h(j)}/uke).`,
        ]);
      const I = {
        ...p,
        revealed: 100,
        morale: 78,
        chemistry: 52,
        contractYears: C.years,
        salary: C.salary,
        starter: !m.roster.some((I) => I.position === p.position && I.starter),
      };
      let z = {
        ...m,
        cash: m.cash - C.signingBonus,
        roster: [...m.roster, I],
        freeAgents: m.freeAgents.filter((I) => I.id !== o),
      };
      return (
        (z = Ce({ ...z, clubValue: Et(z) })),
        A(z, [
          M
            ? `\u270D\uFE0F ${p.name} signert uten bonus: ${C.years} år og ${h(C.salary)}/uke.`
            : `\u270D\uFE0F ${p.name} signert: ${C.years} \xE5r, ${h(C.salary)}/uke og ${h(C.signingBonus)} i bonus.`,
        ])
      );
    }, "good");
  }
  function K(o) {
    F((l) => {
      if (l.phase !== "offseason" || l.draftPicks <= 0) return l;
      const m = l.draftProspects.find((ne) => ne.id === o);
      if (!m || l.roster.length >= Je)
        return A(l, [
          "Troppen er full. Frigi eller selg en spiller f\xF8r du bruker draftvalget.",
        ]);
      const p = Xa(l, m);
      if (l.cash < p.signingBonus)
        return A(l, [
          `Du mangler ${h(p.signingBonus - l.cash)} til rookiebonusen.`,
        ]);
      const S = Wt(l);
      if (se(l) + p.salary > S)
        return A(l, [
          `Rookieavtalen g\xE5r ${h(se(l) + p.salary - S)} over klubbens tilgjengelige l\xF8nnsramme (${h(S)}/uke).`,
        ]);
      const M = {
          ...m,
          revealed: 100,
          salary: p.salary,
          value: Math.round(m.value * 1.15),
          contractYears: p.years,
          morale: 84,
          chemistry: 50,
          starter: !1,
        },
        C = l.draftProspects.filter((ne) => ne.id !== o),
        j = Math.min(C.length, l.draftPicks > 1 ? 3 : 2),
        I = [...C]
          .sort(
            (ne, ze) =>
              pt(ze) + Math.random() * 8 - (pt(ne) + Math.random() * 8),
          )
          .slice(0, j),
        z = new Set(I.map((ne) => ne.id)),
        ce = C.filter((ne) => !z.has(ne.id)),
        ie = Ce({
          ...l,
          cash: l.cash - p.signingBonus,
          roster: [...l.roster, M],
          draftProspects: ce,
          draftPicks: Math.max(0, l.draftPicks - 1),
        }),
        J = I.length
          ? `Andre klubber valgte ${I.map((ne) => `${ne.name} (${ne.position})`).join(", ")}.`
          : "";
      return A(
        ie,
        [
          `Draftet ${m.name} (${m.position}): 4 \xE5r, ${h(p.salary)}/uke og ${h(p.signingBonus)} i rookiebonus. ${ie.draftPicks} valg igjen.`,
          J,
        ].filter(Boolean),
      );
    }, "good");
  }
  function ye(o, l = "accept") {
    F((m) => {
      if (te) return m;
      const p = m.sponsorOffers.find((z) => z.id === o);
      if (!p) return m;
      if (!Xe(m, p.slot))
        return A(m, [
          `\u{1F512} ${we(p.slot)} l\xE5ses opp senere. ${la(p.slot)}.`,
        ]);
      if (_e(m, p.slot))
        return A(m, [
          `\u{1F91D} Du har allerede en aktiv avtale for ${we(p.slot).toLowerCase()}.`,
        ]);
      if (m.reputation < p.minReputation)
        return A(m, [
          `\u{1F512} Klubbprofil ${m.reputation}/${p.minReputation}. Du mangler ${p.minReputation - m.reputation} poeng for denne avtalen.`,
        ]);
      const S = pe(m).expectedAttendance;
      if (S < p.minAttendance)
        return A(m, [
          `\u{1F3DF}\uFE0F Sponsoren forventer minst ${Z(p.minAttendance)} tilskuere. Prognosen din er ${Z(S)}.`,
        ]);
      let M = {
          ...p,
          weeksLeft: p.weeks,
          seasonsLeft: p.seasons,
          negotiated: !1,
          breachWeeks: 0,
          relationship: 58,
          seasonsTogether: 0,
          renewalPending: !1,
        },
        C = "Standardtilbudet ble akseptert.";
      if (l !== "accept") {
        const z = p.negotiationAttempts ?? 0,
          ce =
            m.staff.cfo * 0.035 +
            m.staff.marketing * 0.03 +
            m.staff.commercialDirector * 0.045 +
            m.reputation / 500,
          ie =
            m.profile.difficulty === "hardcore"
              ? 0.08
              : m.profile.difficulty === "casual"
                ? -0.06
                : 0,
          J =
            l === "safe"
              ? {
                  label: "Trygt motbud",
                  chance: 0.82,
                  weekly: 1.05,
                  signing: 0.85,
                  win: 1.04,
                  withdraw: 0.18,
                }
              : l === "balanced"
                ? {
                    label: "Balansert motbud",
                    chance: 0.58,
                    weekly: 1.12,
                    signing: 0.95,
                    win: 1.12,
                    withdraw: 0.42,
                  }
                : {
                    label: "Aggressivt motbud",
                    chance: 0.32,
                    weekly: 1.23,
                    signing: 0.8,
                    win: 1.28,
                    withdraw: 0.72,
                  },
          ne = b(J.chance + ce - ie - z * 0.12, 0.15, 0.94);
        if (Math.random() > ne) {
          const ze = z >= 1 || Math.random() < J.withdraw,
            Bt = ze
              ? m.sponsorOffers.filter((ht) => ht.id !== o)
              : m.sponsorOffers.map((ht) =>
                  ht.id === o ? { ...ht, negotiationAttempts: z + 1 } : ht,
                );
          return A({ ...m, sponsorOffers: Bt }, [
            ze
              ? `\u274C ${p.name} trakk tilbudet etter at ${J.label.toLowerCase()} ble avvist.`
              : `\u{1F91D} ${p.name} avslo ${J.label.toLowerCase()}. Originaltilbudet st\xE5r, men neste forhandling blir vanskeligere.`,
          ]);
        }
        ((M = {
          ...M,
          weeklyPay: Math.round(p.weeklyPay * J.weekly),
          signingBonus: Math.round(p.signingBonus * J.signing),
          winBonus: Math.round(p.winBonus * J.win),
          playoffBonus: Math.round(p.playoffBonus * J.win),
          titleBonus: Math.round(p.titleBonus * J.win),
          negotiated: !0,
        }),
          (C = `${J.label} ble akseptert. Ukesbetalingen \xF8kte til ${h(M.weeklyPay)}.`));
      }
      const j = {
          ...m,
          cash: m.cash + M.signingBonus,
          offseasonChecklist:
            m.phase === "offseason"
              ? { ...m.offseasonChecklist, sponsorsReviewed: !0 }
              : m.offseasonChecklist,
          sponsorOffers: m.sponsorOffers.filter((z) => z.id !== o),
          fanSatisfactionScore: b(
            m.fanSatisfactionScore + M.supporterApproval * 0.35,
            0,
            100,
          ),
          mediaReach: Math.max(
            50,
            m.mediaReach + Math.max(0, M.fanEffect) * 18 + M.weeklyPay * 0.08,
          ),
          reputation: b(
            m.reputation + (M.supporterApproval >= 0 ? 1 : -1),
            0,
            100,
          ),
          sponsorHistory: [
            `${we(M.slot)}: ${M.name} \xB7 S${m.season}`,
            ...m.sponsorHistory,
          ].slice(0, 20),
          sponsorLedger: [
            {
              id: be("sponsor-ledger"),
              season: m.season,
              week: m.week,
              sponsorName: M.name,
              slot: M.slot,
              kind: "signing",
              basePay: 0,
              bonus: M.signingBonus,
              total: M.signingBonus,
              note: "Signeringsbonus",
            },
            ...m.sponsorLedger,
          ].slice(0, 80),
        },
        I =
          M.slot === "main"
            ? { ...j, activeSponsor: M }
            : M.slot === "kit"
              ? { ...j, equipmentSponsor: M }
              : M.slot === "boards"
                ? { ...j, boardsSponsor: M }
                : { ...j, stadiumSponsor: M };
      return A(I, [
        `\u{1F91D} ${we(M.slot)} signert med ${M.name}. ${C} Signeringsbonus: ${h(M.signingBonus)}.`,
      ]);
    }, "good");
  }
  function La(o, l = "safe") {
    F((m) => {
      if (te) return m;
      const p = _e(m, o);
      if (!p) return m;
      if (m.phase !== "offseason" || (p.seasonsLeft ?? 1) > 0)
        return A(m, [
          `${p.name} forhandler ordin\xE6r fornyelse i offseason n\xE5r avtalen er utl\xF8pt.`,
        ]);
      if ((p.breachWeeks ?? 0) >= 2 || (p.relationship ?? 60) < 28)
        return A(m, [
          `${p.name} avviser fornyelse fordi samarbeidet og avtalekravene ikke er gode nok.`,
        ]);
      const S = p.relationship ?? 60,
        M = ia(m, p, l);
      if (Math.random() > M.chance / 100) {
        const z = l === "aggressive" ? 16 : 8,
          ce =
            o === "main"
              ? { ...m, activeSponsor: void 0 }
              : o === "kit"
                ? { ...m, equipmentSponsor: void 0 }
                : o === "boards"
                  ? { ...m, boardsSponsor: void 0 }
                  : { ...m, stadiumSponsor: void 0 };
        return A(
          {
            ...ce,
            offseasonChecklist: {
              ...m.offseasonChecklist,
              sponsorsReviewed: !1,
            },
            sponsorHistory: [
              `Avsluttet ${we(o)}: ${p.name} \xB7 S${m.season}`,
              ...m.sponsorHistory,
            ].slice(0, 20),
          },
          [
            `${p.name} avslo ${M.label.toLowerCase()}. Den utl\xF8pte avtalen er avsluttet, og plassen er \xE5pen for en ny partner.`,
          ],
        );
      }
      const C = {
          ...p,
          weeklyPay: M.weeklyPay,
          signingBonus: M.renewalBonus,
          seasons: M.extension,
          seasonsLeft: M.extension,
          weeks: M.extension * oe,
          weeksLeft: M.extension * oe,
          negotiated: !0,
          breachWeeks: 0,
          relationship: b(S + 5, 0, 100),
          seasonsTogether: (p.seasonsTogether ?? 0) + 1,
          renewalPending: !1,
        },
        j = {
          ...m,
          cash: m.cash + M.renewalBonus,
          offseasonChecklist: { ...m.offseasonChecklist, sponsorsReviewed: !0 },
          sponsorHistory: [
            `Fornyet ${we(o)}: ${p.name} \xB7 S${m.season}`,
            ...m.sponsorHistory,
          ].slice(0, 20),
          sponsorLedger: [
            {
              id: be("sponsor-ledger"),
              season: m.season,
              week: m.week,
              sponsorName: p.name,
              slot: o,
              kind: "renewal",
              basePay: 0,
              bonus: M.renewalBonus,
              total: M.renewalBonus,
              note: `${M.label} \xB7 ${M.extension} sesong${M.extension === 1 ? "" : "er"}`,
            },
            ...m.sponsorLedger,
          ].slice(0, 80),
        },
        I =
          o === "main"
            ? { ...j, activeSponsor: C }
            : o === "kit"
              ? { ...j, equipmentSponsor: C }
              : o === "boards"
                ? { ...j, boardsSponsor: C }
                : { ...j, stadiumSponsor: C };
      return A(I, [
        `${p.name} godtok ${M.label.toLowerCase()}. Ny betaling ${h(M.weeklyPay)}/uke, ${M.extension} sesong${M.extension === 1 ? "" : "er"} og ${h(M.renewalBonus)} i lojalitetsbonus.`,
      ]);
    }, "good");
  }
  function Fs(o) {
    F((m) => {
      const p = getBroadcastDeals(m.leagueIndex).find((S) => S.id === o);
      if (!_t(m, "tv"))
        return A(m, [
          "\u{1F512} Egne TV-avtaler åpnes ved 5 000 supportere. Lokalradio og enkeltkamper betaler fortsatt fastbeløp + CPM.",
        ]);
      return !p || m.reputation < p.minReputation
        ? A(m, ["\u{1F512} Klubben er ikke stor nok for denne TV-avtalen."])
        : A(
            { ...m, tvDeal: p },
            [
              `\u{1F4FA} Ny medieavtale: ${p.name}. ${h(p.fixedFee)} fast per kamp + ${p.cpm} CPM.`,
            ],
          );
    }, "good");
  }
  function Io() {
    F((o) => {
      if (o.lastDailyClaim === Ha()) return o;
      const l = 1200 + o.season * 350 + o.leagueIndex * 1200,
        m = 20 + qe(o) * 12;
      return A(
        {
          ...o,
          cash: o.cash + l,
          mediaReach: o.mediaReach + m,
          lastDailyClaim: Ha(),
        },
        [`Daglig bel\xF8nning: ${h(l)} og +${m} medierekkevidde.`],
      );
    }, "good");
  }
  function _s() {
    F((o) => {
      const l = o.weeklyChallenge;
      return l.claimed || l.progress < l.target
        ? o
        : A(
            {
              ...o,
              cash: o.cash + l.reward,
              weeklyChallenge: { ...l, claimed: !0 },
            },
            [`\u{1F3AF} Utfordring fullf\xF8rt. +${h(l.reward)}.`],
          );
    }, "good");
  }
  function Da(o) {
    F((l) => {
      if (l.phase !== "club") return l;
      let m = l;
      if (
        (l.settings.autoBenchInjured &&
          (m = {
            ...m,
            roster: m.roster.map((M) =>
              M.injuryWeeks > 0 ? { ...M, starter: !1 } : M,
            ),
          }),
        l.settings.autoLineup &&
          !ka(m) &&
          (m = { ...m, roster: qt(m, "opponent") }),
        !ka(m))
      )
        return A(m, [
          `Du m\xE5 ha \xE9n frisk starter i alle ${je.length} posisjoner.`,
        ]);
      const p = Vt(m, Qe(m));
      m.settings.ticketStrategy !== "manual" &&
        (m = { ...m, pricing: { ...m.pricing, ticket: p } });
      const S = $s(m, o);
      if (o === "instant") {
        let M = S;
        for (; M.ticksLeft > 0; ) M = va(m, M);
        return wa(m, M);
      }
      return A({ ...m, phase: "match", match: S }, [
        `\u{1F512} Kamp startet i modusen ${Is(o)}. Klubbhandlinger er l\xE5st.`,
      ]);
    });
  }
  function qs(o) {
    F(
      (l) =>
        l.match
          ? {
              ...l,
              phase: "match",
              match: {
                ...l.match,
                ...(l.match.decisionType === "late"
                  ? { lateChoice: o }
                  : { halftimeChoice: o }),
                decisionType: void 0,
                bigMoment: ro(o),
              },
            }
          : l,
      "good",
    );
  }
  function Vs() {
    (F((o) => {
      if (o.phase !== "report") return o;
      if (o.seasonStage !== "regular") return Pa({ ...o, phase: "club" });
      if (o.week >= oe) return Pa({ ...o, phase: "club" });
      const l = o.week + 1,
        m =
          o.boardTrust < 28 ||
          o.cash < -12e3 ||
          getDebtSnapshot(o).totalDebt > Math.max(15e4, o.clubValue * 0.7),
        p = Ln(o) && l >= o.nextBoardMeetingWeek,
        S =
          !o.boardMeeting && (p || m) ? ya({ ...o, week: l }) : o.boardMeeting;
      let M = {
        ...o,
        phase: "club",
        week: l,
        weekStep: 0,
        match: void 0,
        lastReport: o.lastReport,
        boardMeeting: S,
        freeAgents:
          l % 2 === 0
            ? vt(
                o.leagueIndex,
                o.upgrades.scouting + o.systemInvestments.scoutingDb,
                o.staff.scout + o.staff.sportingDirector,
                o.profile.region,
              )
            : o.freeAgents,
        sponsorOffers:
          l % 2 === 0
            ? ut(
                o.reputation,
                o.leagueIndex,
                o.upgrades.media + o.staff.marketing,
                o.profile.region,
                o.fans,
                o.clubBase,
              )
            : o.sponsorOffers,
      };
      M = {
        ...M,
        transferOffers: M.transferOffers.filter((ce) => ce.expiresWeek >= l),
      };
      const j = l >= 3 && Math.random() < 0.11 ? Ss(M) : void 0;
      j &&
        (M = {
          ...M,
          transferOffers: [j],
          transferOfferCooldownUntil: Kt(M) + 5,
          playerOfferCooldowns: {
            ...M.playerOfferCooldowns,
            [j.playerId]: Kt(M) + 8,
          },
        });
      const I = hs(M);
      M = I.game;
      const z = [`\u{1F4C5} Uke ${l}/${oe}. Motstander: ${Qe(M).name}.`];
      if (j) {
        const ce = M.roster.find((ie) => ie.id === j.playerId);
        z.push(
          `${j.clubName} har sendt bud p\xE5 ${ce?.name ?? "en spiller"}: ${h(j.amount)}.`,
        );
      }
      if (l % 4 === 0) {
        const ce = ee(M.leagueTeams);
        z.push(
          `${ce.logo} ${ce.name}: ${ce.transferActivity ?? fa(ce.strategy)}.`,
        );
      }
      return (I.message && z.push(I.message), A(M, z));
    }),
      r("hq"));
  }
  function Es(o) {
    F((l) => {
      if (!l.boardMeeting) return l;
      const p = l.boardMeeting.choices.find((ie) => ie.id === o),
        S = Ln(l),
        M = S ? lo(l, o) : { votes: [], yes: 5 },
        C = {
          id: be("board-record"),
          season: l.season,
          week: l.week,
          title: p?.label ?? o,
        };
      if (S && M.yes < 3) {
        const ie = {
          ...C,
          result: "Avsl\xE5tt",
          detail: `${M.yes}/5 stemte for. Forslaget fikk ikke flertall.`,
        };
        return A(
          {
            ...l,
            boardMeeting: void 0,
            nextBoardMeetingWeek: Math.min(oe, l.week + 6),
            boardTrust: b(l.boardTrust - 1, 0, 100),
            boardDecisionHistory: [ie, ...l.boardDecisionHistory].slice(0, 20),
          },
          [`Styret avslo \xAB${p?.label ?? o}\xBB med ${M.yes}/5 stemmer.`],
        );
      }
      let j = {
          ...l,
          boardMeeting: void 0,
          nextBoardMeetingWeek: Math.min(oe, l.week + 6),
        },
        I = "";
      if (
        (o === "transfer" &&
          ((j = {
            ...j,
            cash: j.cash + 4e3,
            freeAgents: vt(
              j.leagueIndex + 1,
              j.upgrades.scouting + j.systemInvestments.scoutingDb,
              j.staff.scout + j.staff.sportingDirector,
              j.profile.region,
            ),
          }),
          j.boardPromises.some(
            (ie) => ie.status === "active" && ie.kind === "playoffs",
          ) ||
            (j = {
              ...j,
              boardPromises: [...j.boardPromises, Sa(j, "playoffs")],
            }),
          (I =
            "+$4K i spillerbudsjett og et aktivt l\xF8fte om sportslig fremgang.")),
        o === "stadium" &&
          ((j = {
            ...j,
            cash: j.cash + 6e3,
            boardTrust: b(j.boardTrust + 1, 0, 100),
          }),
          (I =
            "+$6K i tilskudd til et fremtidig kampdags- eller stadionprosjekt.")),
        o === "academy" &&
          ((j = {
            ...j,
            cash: j.cash + 5e3,
            reputation: b(j.reputation + 2, 0, 100),
            draftProspects: j.draftProspects.map((ie) => ({
              ...ie,
              revealed: b(ie.revealed + 10, 0, 100),
            })),
          }),
          (I = "+$5K i talenttilskudd, bedre scouting og +2 klubbprofil.")),
        o === "commercial")
      ) {
        const ie = b(j.reputation + 2, 0, 100);
        ((j = {
          ...j,
          reputation: ie,
          sponsorOffers: ut(
            ie,
            j.leagueIndex,
            j.upgrades.media + j.staff.marketing,
            j.profile.region,
            j.fans,
            j.clubBase,
          ),
        }),
          (I =
            "Sponsor\xADmarkedet er oppdatert og klubbprofilen \xF8kte med 2."));
      }
      (o === "salary" &&
        ((j = {
          ...j,
          boardGoals: {
            ...j.boardGoals,
            salaryCap: j.boardGoals.salaryCap + 3500,
          },
          boardTrust: b(j.boardTrust - 2, 0, 100),
        }),
        (I = "Salary cap \xF8kte med $3.5K, men styret forventer disiplin.")),
        o === "reserve" &&
          (() => {
            const ie = addManualLoan(j, {
              id: be("board-reserve"),
              productId: "board",
              label: "Styrets likviditetslån",
              cashAmount: 8e3,
              balance: 1e4,
              annualRate: 0.21,
              termWeeks: 24,
            });
            if (ie.ok) {
              ((j = {
                ...ie.game,
                boardTrust: b(ie.game.boardTrust - 1, 0, 100),
              }),
                (I =
                  "+$8K i likviditet. $10K gjeld betales automatisk ned over 24 kampuker."));
            } else I = `Lånet ble ikke opprettet: ${ie.reason}`;
          })());
      const z = S
          ? `${M.yes}/5 stemte for.`
          : "Grunnstyret godkjente prioriteringen.",
        ce = { ...C, result: "Godkjent", detail: `${z} ${I}` };
      return A(
        {
          ...j,
          boardDecisionHistory: [ce, ...j.boardDecisionHistory].slice(0, 20),
        },
        [`Styret godkjente \xAB${p?.label ?? o}\xBB. ${I}`],
      );
    }, "good");
  }
  function Go(o) {
    F((l) => {
      if (l.boardRequestsUsed.includes(o))
        return A(l, [
          "Denne styreforesp\xF8rselen er allerede brukt denne sesongen.",
        ]);
      const m = Wr[o],
        p = uo(l, o);
      let S = { ...l, boardRequestsUsed: [...l.boardRequestsUsed, o] },
        M = "Avsl\xE5tt",
        C = `${p.yes}/5 stemte for. Styret avslo foresp\xF8rselen.`;
      const j = (z) =>
        z.boardPromises.some(
          (ce) => ce.status === "active" && ce.kind === "playoffs",
        )
          ? z
          : { ...z, boardPromises: [...z.boardPromises, Sa(z, "playoffs")] };
      p.yes >= 3
        ? ((M = "Godkjent"),
          o === "transferBudget" &&
            ((S = j({
              ...S,
              cash: S.cash + 5e3,
              boardTrust: b(S.boardTrust - 1, 0, 100),
            })),
            (C = `${p.yes}/5 stemte for. +$5K i kontrollert spillerbudsjett og l\xF8fte om sluttspillniv\xE5.`)),
          o === "salaryCap" &&
            ((S = {
              ...S,
              boardGoals: {
                ...S.boardGoals,
                salaryCap: S.boardGoals.salaryCap + 4e3,
              },
              boardTrust: b(S.boardTrust - 2, 0, 100),
            }),
            (C = `${p.yes}/5 stemte for. Salary cap \xF8kte med $4K.`)),
          o === "stadiumGrant" &&
            ((S = {
              ...S,
              upgrades: { ...S.upgrades, seats: S.upgrades.seats + 1 },
              boardTrust: b(S.boardTrust - 1, 0, 100),
            }),
            (C = `${p.yes}/5 stemte for. Tribunen ble oppgradert.`)),
          o === "goalRelief" &&
            ((S = {
              ...S,
              boardGoals: {
                ...S.boardGoals,
                wins: Math.max(4, S.boardGoals.wins - 1),
              },
              boardTrust: b(S.boardTrust - 5, 0, 100),
            }),
            (C = `${p.yes}/5 stemte for. Seierskravet falt med \xE9n, men tilliten ble redusert.`)))
        : p.yes === 2 && l.boardTrust >= 45
          ? ((M = "Motforslag"),
            o === "transferBudget" &&
              ((S = j({
                ...S,
                cash: S.cash + 7500,
                boardTrust: b(S.boardTrust - 2, 0, 100),
              })),
              (C = "Styret tilbyr $7.5K mot et bindende sportslig l\xF8fte.")),
            o === "salaryCap" &&
              ((S = {
                ...S,
                boardGoals: {
                  ...S.boardGoals,
                  salaryCap: S.boardGoals.salaryCap + 2e3,
                },
                boardTrust: b(S.boardTrust - 2, 0, 100),
              }),
              (C = "Styret godkjente halv \xF8kning: +$2K salary cap.")),
            o === "stadiumGrant" &&
              ((S = {
                ...S,
                cash: S.cash + 6e3,
                boardTrust: b(S.boardTrust - 2, 0, 100),
              }),
              (C =
                "Styret gir $6K \xF8remerket klubbomr\xE5det i stedet for full oppgradering.")),
            o === "goalRelief" &&
              ((S = {
                ...S,
                boardGoals: {
                  ...S.boardGoals,
                  wins: Math.max(4, S.boardGoals.wins - 1),
                },
                boardTrust: b(S.boardTrust - 8, 0, 100),
              }),
              (C = "Kravet reduseres, men styret markerer sterk misn\xF8ye.")))
          : (S = { ...S, boardTrust: b(S.boardTrust - 1, 0, 100) });
      const I = {
        id: be("board-record"),
        season: l.season,
        week: l.week,
        title: m.title,
        result: M,
        detail: C,
      };
      return A(
        {
          ...S,
          boardDecisionHistory: [I, ...S.boardDecisionHistory].slice(0, 20),
        },
        [`${m.title}: ${M}. ${C}`],
      );
    }, "good");
  }
  function Oo(o) {
    F((l) => {
      const m = l.boardPromises.filter(
        (M) => M.status === "active" && M.deadlineSeason === l.season,
      );
      if (m.length >= 2)
        return A(l, [
          "Styret tillater maksimalt to aktive l\xF8fter samtidig.",
        ]);
      if (m.some((M) => M.kind === o))
        return A(l, ["Dette l\xF8ftet er allerede aktivt."]);
      const p = Sa(l, o),
        S = {
          id: be("board-record"),
          season: l.season,
          week: l.week,
          title: p.title,
          result: "Godkjent",
          detail: `L\xF8ftet er registrert. Bonus ${h(p.rewardCash)}, risiko -${p.penaltyTrust} tillit.`,
        };
      return A(
        {
          ...l,
          boardPromises: [...l.boardPromises, p],
          boardDecisionHistory: [S, ...l.boardDecisionHistory].slice(0, 20),
          boardTrust: b(l.boardTrust + 1, 0, 100),
        },
        [`Du lovet styret: \xAB${p.title}\xBB.`],
      );
    }, "good");
  }
  function Ws(o) {
    F((l) => {
      if (l.boardStrategy === o) return l;
      const m = _n[o],
        p = {
          id: be("board-record"),
          season: l.season,
          week: l.week,
          title: "Ny klubbstrategi",
          result: "Godkjent",
          detail: `Styret vedtok \xAB${m.label}\xBB. ${m.description}`,
        };
      return A(
        {
          ...l,
          boardStrategy: o,
          boardTrust: b(l.boardTrust - 1, 0, 100),
          boardDecisionHistory: [p, ...l.boardDecisionHistory].slice(0, 24),
        },
        [`Styret endret klubbstrategien til \xAB${m.label}\xBB.`],
      );
    }, "good");
  }
  function Ko(o) {
    F((l) => {
      const m = Object.values(o).reduce((ie, J) => ie + J, 0);
      if (m !== 100)
        return A(l, [`Budsjettet m\xE5 v\xE6re 100 %. Det er n\xE5 ${m} %.`]);
      const p = le[l.leagueIndex].salaryCap,
        S = Math.round(p * (0.86 + (o.players / 100) * 0.34)),
        M = Ds(l),
        C = b(
          M.financial + (o.reserve >= 10 ? 2 : -3) + (o.players > 50 ? -2 : 1),
          0,
          100,
        ),
        j = b(M.sporting + (o.players >= 38 ? 2 : -2), 0, 100),
        I = b(M.culture + (o.commercial + o.facilities >= 28 ? 2 : -1), 0, 100),
        z = Math.round((j + C + I) / 3),
        ce = {
          id: be("board-record"),
          season: l.season,
          week: l.week,
          title: `Sesongbudsjett S${l.season}`,
          result: "Godkjent",
          detail: `Spillere ${o.players}% \xB7 ansatte ${o.staff}% \xB7 anlegg ${o.facilities}% \xB7 kommersielt ${o.commercial}% \xB7 reserve ${o.reserve}%.`,
        };
      return A(
        {
          ...l,
          boardBudget: o,
          boardGoals: { ...l.boardGoals, salaryCap: S },
          boardTrustAreas: { sporting: j, financial: C, culture: I },
          boardTrust: b(Math.round((l.boardTrust + z) / 2), 0, 100),
          boardDecisionHistory: [ce, ...l.boardDecisionHistory].slice(0, 24),
        },
        [`Sesongbudsjettet er godkjent. Ny salary cap: ${h(S)}.`],
      );
    }, "good");
  }
  function Hs(o) {
    F((l) => {
      const m = l.activeDecision;
      if (!m) return l;
      let p = {
        ...l,
        activeDecision: void 0,
        decisionHistory: [m.kind, ...(l.decisionHistory ?? [])].slice(0, 12),
      };
      const S = m.playerId ? p.roster.find((C) => C.id === m.playerId) : void 0;
      let M = "Saken er behandlet.";
      if (
        (m.kind === "party" &&
          (o === "warn" &&
            S &&
            ((p.roster = p.roster.map((C) =>
              C.id === S.id
                ? {
                    ...C,
                    morale: b(C.morale - 5, 0, 100),
                    chemistry: b(C.chemistry + 3, 0, 100),
                  }
                : C,
            )),
            (M = "Spilleren fikk advarsel. Kjemien steg, men moralen falt.")),
          o === "protect" &&
            ((p.boardTrust = b(p.boardTrust - 2, 0, 100)),
            (p.roster = p.roster.map((C) => ({
              ...C,
              morale: b(C.morale + 2, 0, 100),
            }))),
            (M =
              "Laget satte pris p\xE5 st\xF8tten. Styret ble mer skeptisk.")),
          o === "bench" &&
            S &&
            ((p.roster = p.roster.map((C) =>
              C.id === S.id
                ? { ...C, starter: !1, morale: b(C.morale - 9, 0, 100) }
                : C,
            )),
            (M = `${S.name} ble benket og mistet moral.`))),
        m.kind === "ticketProtest")
      ) {
        if (
          (o === "lower" &&
            ((p.pricing = {
              ...p.pricing,
              ticket: Math.max(6, p.pricing.ticket - 3),
            }),
            (p.fanSatisfactionScore = b(p.fanSatisfactionScore + 6, 0, 100)),
            (p.demandMomentum = b(p.demandMomentum + 8, -25, 30)),
            (M =
              "Prisene ble justert. Tilfredshet og forventet ettersp\xF8rsel steg.")),
          o === "fanDay")
        ) {
          const C =
            p.fans < 250
              ? 8 +
                p.systemInvestments.supporterCrm * 3 +
                p.upgrades.museum * 2 +
                p.staff.marketing * 2
              : Math.max(
                  5,
                  Math.round(
                    p.fans *
                      (0.018 +
                        p.systemInvestments.supporterCrm * 0.004 +
                        p.upgrades.museum * 0.003),
                  ),
                );
          ((p.cash -= 3500),
            (p.fanSatisfactionScore = b(p.fanSatisfactionScore + 9, 0, 100)),
            (p.demandMomentum = b(p.demandMomentum + 14, -35, 35)),
            (p.fans += C),
            (p.mediaReach += Math.max(8, Math.round(C * 3.5))),
            (p.reputation = b(p.reputation + 2, 0, 100)),
            (M = `Supportertiltaket l\xF8ftet tilfredshet og ettersp\xF8rsel. ${C} nye lojale supportere ble med.`));
        }
        (o === "ignore" &&
          ((p.fanSatisfactionScore = b(p.fanSatisfactionScore - 9, 0, 100)),
          (p.demandMomentum = b(p.demandMomentum - 10, -25, 30)),
          (p.boardTrust = b(p.boardTrust - 1, 0, 100)),
          (M = "Supporterne f\xF8lte seg oversett. Ettersp\xF8rselen faller.")),
          o === "own" &&
            ((p.fanSatisfactionScore = b(p.fanSatisfactionScore + 7, 0, 100)),
            (p.boardTrust = b(p.boardTrust - 1, 0, 100)),
            (p.demandMomentum = b(p.demandMomentum + 5, -25, 30)),
            (M =
              "Supporterne verdsatte at du tok ansvar. Styret forventer rask forbedring.")),
          o === "changes" &&
            ((p.fanSatisfactionScore = b(p.fanSatisfactionScore + 4, 0, 100)),
            (p.boardTrust = b(p.boardTrust - 2, 0, 100)),
            (p.demandMomentum = b(p.demandMomentum + 3, -25, 30)),
            (M = "L\xF8ftet ga h\xE5p, men resultatpresset \xF8kte.")));
      }
      if (
        (m.kind === "pressLoss" &&
          (o === "own" &&
            ((p.boardTrust = b(p.boardTrust - 1, 0, 100)),
            (p.roster = p.roster.map((C) => ({
              ...C,
              morale: b(C.morale + 3, 0, 100),
            }))),
            (p.mediaReach += 12),
            (M =
              "Garderoben respekterte ansvaret. Styret forventer en reaksjon.")),
          o === "players" &&
            ((p.boardTrust = b(p.boardTrust + 2, 0, 100)),
            (p.roster = p.roster.map((C) => ({
              ...C,
              morale: b(C.morale - 4, 0, 100),
            }))),
            (p.mediaReach += 18),
            (M = "Styret likte tydeligheten, men lagmoralen falt.")),
          o === "officials" &&
            ((p.fanSatisfactionScore = b(p.fanSatisfactionScore + 2, 0, 100)),
            (p.mediaReach += 26),
            (p.reputation = b(p.reputation - 3, 0, 100)),
            (M = "Uttalelsen skapte oppmerksomhet, men omd\xF8mmet falt."))),
        m.kind === "contractDemand" && S)
      ) {
        if (o === "renew") {
          const C = dt(S, S.age <= 27 ? 3 : 2, !0, p);
          p.cash >= C.signingBonus &&
          se(p) - S.salary + C.salary <= p.boardGoals.salaryCap
            ? ((p.cash -= C.signingBonus),
              (p.roster = p.roster.map((j) =>
                j.id === S.id
                  ? {
                      ...j,
                      contractYears: C.years,
                      salary: C.salary,
                      morale: b(j.morale + 10, 0, 100),
                    }
                  : j,
              )),
              (M = `${S.name} signerte ${C.years} \xE5r til ${h(C.salary)}/uke.`))
            : ((p.roster = p.roster.map((j) =>
                j.id === S.id ? { ...j, morale: b(j.morale - 4, 0, 100) } : j,
              )),
              (M =
                "Klubben \xE5pnet samtaler, men manglet \xF8konomisk handlingsrom."));
        }
        if (
          (o === "deny" &&
            ((p.roster = p.roster.map((C) =>
              C.id === S.id ? { ...C, morale: b(C.morale - 13, 0, 100) } : C,
            )),
            (M = `${S.name} fikk avslag og moralen falt.`)),
          o === "sell")
        ) {
          const C = Math.round(Fe(p, S).midpoint * 0.82);
          ((p.cash += C),
            (p.roster = p.roster.filter((j) => j.id !== S.id)),
            (p.transferOffers = p.transferOffers.filter(
              (j) => j.playerId !== S.id,
            )),
            (p = Ce({ ...p, clubValue: Et(p) })),
            (M = `${S.name} ble solgt for ${h(C)}. Ny ukel\xF8nn: ${h(se(p))}.`));
        }
      }
      if (m.kind === "sponsorConflict") {
        if (
          (o === "accept" &&
            ((p.cash += 5e3),
            (p.fanSatisfactionScore = b(p.fanSatisfactionScore - 4, 0, 100)),
            (M = "Klubben tok betalingen. Supporterprofilen ble svekket.")),
          o === "negotiate")
        ) {
          const C =
              p.staff.commercialDirector +
              p.staff.marketing +
              p.systemInvestments.supporterCrm,
            j = Math.random() < b(0.42 + C * 0.08, 0.42, 0.86);
          ((p.cash += j ? 3500 : 0),
            (p.boardTrust = b(p.boardTrust + (j ? 2 : -2), 0, 100)),
            (M = j
              ? "Klubben fant en balansert l\xF8sning og fikk ekstra betaling."
              : "Forhandlingen mislyktes og styret ble mer skeptisk."));
        }
        o === "refuse" &&
          ((p.reputation = b(p.reputation + 3, 0, 100)),
          p.activeSponsor &&
            (p.activeSponsor = {
              ...p.activeSponsor,
              relationship: b((p.activeSponsor.relationship ?? 60) - 8, 0, 100),
            }),
          (M =
            "Klubben beskyttet identiteten, men sponsorforholdet ble kj\xF8ligere."));
      }
      return (
        m.kind === "stadiumFault" &&
          (o === "repair" &&
            ((p.cash -= 5500),
            (p.boardTrust = b(p.boardTrust + 2, 0, 100)),
            (M = "Avviket ble permanent lukket.")),
          o === "patch" &&
            ((p.cash -= 1800),
            Math.random() < 0.35 &&
              (p.upgrades = {
                ...p.upgrades,
                lights: Math.max(0, p.upgrades.lights - 1),
              }),
            (M =
              "Midlertidig utbedring gjennomf\xF8rt. Risikoen er ikke helt borte.")),
          o === "delay" &&
            ((p.boardTrust = b(p.boardTrust - 5, 0, 100)),
            (p.reputation = b(p.reputation - 2, 0, 100)),
            (M =
              "Tiltaket ble utsatt. Styret og publikum reagerte negativt."))),
        A(p, [`${Kn(m.category)}: ${M}`])
      );
    });
  }
  function Us(o, l) {
    F((m) => {
      const p = m.transferOffers.find((I) => I.id === o);
      if (!p) return m;
      const S = m.roster.find((I) => I.id === p.playerId);
      if (!S)
        return {
          ...m,
          transferOffers: m.transferOffers.filter((I) => I.id !== o),
        };
      if (l === "reject")
        return A(
          {
            ...m,
            transferOffers: m.transferOffers.filter((I) => I.id !== o),
            roster: m.roster.map((I) =>
              I.id === S.id ? { ...I, morale: b(I.morale + 1, 0, 100) } : I,
            ),
          },
          [`Du avslo budet fra ${p.clubName} p\xE5 ${S.name}.`],
        );
      if (l === "counter") {
        const I = Math.round(p.amount * 1.22),
          z = m.leagueTeams.find((J) => J.id === p.clubId),
          ce = b(
            0.5 +
              (z?.strategy === "spender" ? 0.2 : 0) -
              (p.countered ? 0.18 : 0),
            0.2,
            0.78,
          );
        if (Math.random() > ce)
          return A(
            {
              ...m,
              transferOffers: m.transferOffers.filter((J) => J.id !== o),
            },
            [`${p.clubName} avslo motkravet p\xE5 ${h(I)} og trakk seg.`],
          );
        const ie = { ...p, amount: I, countered: !0 };
        return A(
          {
            ...m,
            transferOffers: m.transferOffers.map((J) => (J.id === o ? ie : J)),
          },
          [
            `${p.clubName} godtok motkravet p\xE5 ${h(I)}. Du kan n\xE5 godta eller avsl\xE5 salget.`,
          ],
        );
      }
      if (m.roster.length <= ve)
        return A(m, [`Du m\xE5 beholde minst ${ve} spillere.`]);
      const M = m.leagueTeams.map((I) =>
          I.id === p.clubId
            ? ct(
                {
                  ...I,
                  rosterValue: (I.rosterValue ?? 0) + p.amount,
                  payroll: (I.payroll ?? 0) + S.salary,
                  attack: I.attack + Math.max(0, (H(S) - I.power) * 0.025),
                  defense: I.defense + Math.max(0, (H(S) - I.power) * 0.025),
                  transferActivity: `Kj\xF8pte ${S.name}`,
                },
                m.leagueIndex,
              )
            : I,
        ),
        C = se(m);
      let j = {
        ...m,
        cash: m.cash + p.amount,
        roster: m.roster.filter((I) => I.id !== S.id),
        transferOffers: m.transferOffers.filter((I) => I.playerId !== S.id),
        leagueTeams: M,
        news: [
          `${p.clubName} kj\xF8pte ${S.name} for ${h(p.amount)}.`,
          ...m.news,
        ].slice(0, 16),
      };
      return (
        (j = Ce({ ...j, clubValue: Et(j) })),
        A(j, [
          `${S.name} ble solgt til ${p.clubName} for ${h(p.amount)}. L\xF8nn ${h(C)} \u2192 ${h(se(j))}/uke.`,
        ])
      );
    }, "good");
  }
  function Ys(o = "credit") {
    F((l) => {
      const m = pe(l),
        p = getLoanDashboard(l, {
          income: m.income,
          expenses: m.expensesBeforeDebt,
          operatingProfit: m.operatingProfit,
        }),
        S = p.products.find((C) => C.id === o);
      if (!S?.eligible)
        return A(l, [
          `\u{1F512} ${S?.label ?? "Lånet"} kan ikke tas: ${S?.reason ?? "ikke tilgjengelig"}`,
        ]);
      const M = addLoanFromQuote(l, S, be("loan"));
      if (!M.ok) return A(l, [`\u{1F512} ${M.reason}`]);
      const C =
        o === "emergency"
          ? { ...M.game, boardTrust: b(M.game.boardTrust - 4, 0, 100) }
          : M.game;
      return A(C, [
        `\u{1F3E6} ${S.label}: ${h(S.amount)} utbetalt. Automatisk trekk ${h(S.weeklyPayment)}/uke i ${S.termWeeks} kampuker. Ledig låneramme etterpå: ${h(S.remainingAfter)}.`,
      ]);
    }, "good");
  }
  function zs(o = 1e4) {
    F((l) => {
      const m = applyExtraDebtPayment(l, o);
      return m.paid <= 0
        ? l
        : A(
            {
              ...m.game,
              boardTrust: b(m.game.boardTrust + 1, 0, 100),
            },
            [`\u{1F3E6} Ekstra nedbetaling: ${h(m.paid)}.`],
          );
    }, "good");
  }
  function takeOffseasonRescue() {
    F((o) => {
      const l = pe(o),
        m = getLoanDashboard(o, {
          income: l.income,
          expenses: l.expensesBeforeDebt,
          operatingProfit: l.operatingProfit,
        }),
        p = m.products.find((C) => C.id === "emergency");
      if (p?.eligible) {
        const C = addLoanFromQuote(o, p, be("rescue-loan"));
        return C.ok
          ? A(
              {
                ...C.game,
                boardTrust: b(C.game.boardTrust - 4, 0, 100),
              },
              [
                `\u{1F6DF} Styrets nødlån ga ${h(p.amount)}. ${h(p.weeklyPayment)} trekkes automatisk hver kampuke.`,
              ],
            )
          : A(o, [C.reason]);
      }
      const S =
        o.cash < 0 ||
        (l.profit < 0 && (l.runwayWeeks ?? 99) < 6) ||
        (o.history[o.history.length - 1]?.result === "Mester" &&
          Pr(o).some((C) => C.includes("reserve")));
      if (!S)
        return A(o, [
          "Styrets redningspakke er bare tilgjengelig ved reell likviditetsfare eller en økonomisk offseason-lås.",
        ]);
      if (o.rescueUsedSeason === o.season)
        return A(o, [
          "Styrets engangstilskudd er allerede brukt denne sesongen. Reduser kostnader eller selg en spiller.",
        ]);
      if (m.available >= 1e3) {
        const C = m.products.find((I) => I.eligible);
        if (C)
          return A(o, [
            `Klubben har fortsatt ${h(m.available)} i ledig låneramme. ${C.label} er tilgjengelig før styret vurderer restrukturering.`,
          ]);
        const j = Math.min(
            Math.floor(m.available / 1.08 / 500) * 500,
            Math.max(2500, Math.round(l.expensesBeforeDebt - o.cash)),
          ),
          I = restructureDebtWithAdvance(
            o,
            j,
            {
              income: l.income,
              expenses: l.expensesBeforeDebt,
              operatingProfit: l.operatingProfit,
            },
            be("restructure"),
          );
        if (I.ok)
          return A(
            {
              ...I.game,
              boardTrust: b(I.game.boardTrust - 7, 0, 100),
              rescueUsedSeason: o.season,
            },
            [
              `\u{1F6DF} Styret samlet aktive klubblån og ga ${h(I.amount)} ekstra likviditet. Ny restrukturert gjeld er ${h(I.loan.balance)} med ${h(I.loan.weeklyPayment)}/uke i tvungent trekk.`,
            ],
          );
      }
      const M = Math.min(
        12e3 + o.leagueIndex * 4e3,
        Math.max(2500, Math.round(l.expensesBeforeDebt - o.cash)),
      );
      return A(
        {
          ...o,
          cash: o.cash + M,
          boardTrust: b(o.boardTrust - 12, 0, 100),
          reputation: b(o.reputation - 2, 0, 100),
          rescueUsedSeason: o.season,
        },
        [
          `\u{1F6DF} Lånerammen var brukt opp. Styret skjøt inn ${h(M)} én gang mot -12 tillit og -2 klubbprofil. Dette er ikke ny gjeld.`,
        ],
      );
    }, "good");
  }
  function Js() {
    F(
      (o) =>
        Ce({
          ...o,
          offseasonChecklist: { ...o.offseasonChecklist, summaryReviewed: !0 },
        }),
      "good",
    );
  }
  function Qs() {
    F((o) => {
      if (o.phase !== "offseason") return o;
      const l = Le(o).filter((p) => (p.seasonsLeft ?? 1) <= 0),
        m = l.length
          ? `${l.length} utl\xF8pt${l.length === 1 ? " avtale er" : "e avtaler er"} gjennomg\xE5tt. De avsluttes ved sesongstart hvis de ikke fornyes.`
          : "Sponsorplanen for neste sesong er gjennomg\xE5tt.";
      return A(
        Ce({
          ...o,
          offseasonChecklist: { ...o.offseasonChecklist, sponsorsReviewed: !0 },
        }),
        [m],
      );
    }, "good");
  }
  function Zs() {
    F((o) => {
      if (o.phase !== "offseason") return o;
      const l = Gt(o);
      if (l.length)
        return A(o, [
          `Budsjettet kan ikke godkjennes enn\xE5. Du m\xE5 f\xF8rst ${l.join(", ")}.`,
        ]);
      const m = ts(o),
        p = Ft(o.season + 1, m, o.profile.strategy, o.fans),
        S = se(o);
      return S > p.salaryCap
        ? A(o, [
            `Troppen bruker ${h(S)}, men neste sesongs ramme er ${h(p.salaryCap)}. Reduser l\xF8nn f\xF8r godkjenning.`,
          ])
        : A(
            Ce({
              ...o,
              boardGoals: p,
              offseasonChecklist: {
                ...o.offseasonChecklist,
                budgetApproved: !0,
              },
            }),
            [
              `Budsjett og sesongm\xE5l er godkjent. Salary cap: ${h(p.salaryCap)}.`,
            ],
          );
    }, "good");
  }
  function Ia() {
    if (e.draftPicks > 0) {
      ae("skipDraft");
      return;
    }
    Ga();
  }
  function Ga() {
    F((o) => {
      if (o.phase !== "offseason") return o;
      const l = o.draftPicks;
      return A(Ce({ ...o, draftPicks: 0 }), [
        l
          ? `Draften ble avsluttet. ${l} valg ble gitt fra seg.`
          : "Draften er allerede fullf\xF8rt.",
      ]);
    });
  }
  function Xs() {
    const o = Ce(e);
    if (Object.values(o.offseasonChecklist).every(Boolean)) {
      ae("startSeason");
      return;
    }
    Oa();
  }
  function Oa() {
    (F((o) => {
      if (o.phase !== "offseason") return o;
      let l = Ce(o);
      l = ss(l);
      const m = [
        l.offseasonChecklist.summaryReviewed ? "" : "les sesongoppsummeringen",
        l.offseasonChecklist.contractsResolved
          ? ""
          : "avgj\xF8r utl\xF8pende kontrakter",
        l.offseasonChecklist.draftResolved
          ? ""
          : "bruk eller hopp over draftvalgene",
        l.offseasonChecklist.rosterReady
          ? ""
          : `ha minst ${ve} spillere og dekning i alle posisjoner`,
        l.offseasonChecklist.sponsorsReviewed
          ? ""
          : "g\xE5 gjennom sponsoravtalene",
        l.offseasonChecklist.budgetApproved
          ? ""
          : "godkjenn neste sesongs budsjett",
      ].filter(Boolean);
      if (m.length)
        return A(l, [`\u{1F512} F\xF8r ny sesong m\xE5 du ${m.join(", ")}.`]);
      const p = Gt(l);
      if (p.length)
        return A(
          {
            ...l,
            offseasonChecklist: { ...l.offseasonChecklist, budgetApproved: !1 },
          },
          [`\u{1F6AB} Ny sesong kan ikke startes f\xF8r du ${p.join(", ")}.`],
        );
      const S = ts(l),
        M = S > l.leagueIndex,
        C = S < l.leagueIndex,
        j = l.season + 1,
        I = startNewPlayerSeason(
          l.roster.map((ne) => ({
            ...ne,
            age: ne.age + 1,
            condition: b(ne.condition + 35, 45, 100),
            morale: b(ne.morale + 8, 20, 100),
            injuryWeeks: Math.max(0, ne.injuryWeeks - 1),
            attack: b(
              ne.attack - (ne.age >= 33 && Math.random() < 0.55 ? 1 : 0),
              20,
              99,
            ),
            defense: b(
              ne.defense - (ne.age >= 33 && Math.random() < 0.55 ? 1 : 0),
              20,
              99,
            ),
            stamina: b(
              ne.stamina -
                (ne.age >= 31 ? 1 + (Math.random() < 0.35 ? 1 : 0) : 0),
              20,
              99,
            ),
          })),
          j,
        ),
        z = refreshAiTeamStories(
          M || C
            ? ra(S, l.profile.rivalName, l.profile.region)
            : Br(l.leagueTeams, S, l.profile.region),
          j,
        ),
        ce = z.some((ne) => ne.name === l.profile.rivalName)
          ? l.profile.rivalName
          : (z[0]?.name ?? l.profile.rivalName),
        offseasonFeed = createOffseasonLeagueFeed(z, j, ce),
        ie = {
          ...l,
          version: 22,
          profile: { ...l.profile, rivalName: ce },
          phase: "club",
          seasonStage: "regular",
          season: j,
          seasonStartFans: l.fans,
          seasonStartCash: l.cash,
          week: 1,
          leagueIndex: S,
          wins: 0,
          losses: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          roster: I,
          leagueTeams: z,
          leagueFeed: [...offseasonFeed, ...(l.leagueFeed ?? [])].slice(0, 40),
          schedule: oa(z),
          playoffBracket: void 0,
          draftProspects: [],
          draftPicks: 0,
          transferOffers: [],
          boardGoals: Ft(j, S, l.profile.strategy, l.fans),
          tvDeal: normalizeBroadcastDeal(l.tvDeal, S),
          sponsorOffers: ut(
            l.reputation,
            S,
            l.upgrades.media + l.staff.marketing,
            l.profile.region,
            l.fans,
            l.clubBase,
          ),
          activeSponsor: Bn(l.activeSponsor),
          equipmentSponsor: Bn(l.equipmentSponsor),
          boardsSponsor: Bn(l.boardsSponsor),
          stadiumSponsor: Bn(l.stadiumSponsor),
          freeAgents: vt(
            S,
            l.upgrades.scouting + l.systemInvestments.scoutingDb,
            l.staff.scout + l.staff.sportingDirector,
            l.profile.region,
          ),
          weeklyChallenge: cs(j, l.fans),
          boardMeeting:
            l.fans >= 1e3 || S >= 1 || l.boardTrust < 30
              ? ya({
                  ...l,
                  season: j,
                  week: 1,
                  leagueIndex: S,
                  wins: 0,
                  losses: 0,
                  boardGoals: Ft(j, S, l.profile.strategy, l.fans),
                })
              : void 0,
          nextBoardMeetingWeek: 7,
          boardRequestsUsed: [],
          activeDecision: void 0,
          weekStep: 0,
          offseasonChecklist: {
            summaryReviewed: !1,
            contractsResolved: !0,
            draftResolved: !0,
            rosterReady: !0,
            budgetApproved: !1,
            sponsorsReviewed: !0,
          },
        },
        J = z
          .map((ne, ze) => {
            const Bt = l.leagueTeams[ze];
            return !Bt || M
              ? `${ne.name}: ${fa(ne.strategy)}`
              : ne.coachName !== Bt.coachName
                ? `${ne.name} ansatte ${ne.coachName}`
                : `${ne.name}: ${ne.transferActivity ?? fa(ne.strategy)}`;
          })
          .slice(0, 3);
      return A(ie, [
        M
          ? `${le[S].logo} Opprykk til ${le[S].name}!`
          : C
            ? `\u2B07\uFE0F Nedrykk til ${le[S].name}. Klubben m\xE5 bygge seg opp igjen.`
            : `\u{1F4C5} Sesong ${j} starter.`,
        `\u{1F4CB} Troppen er registrert med ${I.length} spillere og ${h(se(ie))} i cap-bruk.`,
        ...J.map((ne) => `\u{1F9E0} ${ne}.`),
      ]);
    }, "good"),
      r("hq"));
  }
  function er(o) {
    (localStorage.setItem(
      Un[o],
      JSON.stringify({ ...e, lastSeen: Date.now() }),
    ),
      F((l) => A(l, [`\u{1F4BE} Lagret i plass ${o + 1}.`]), "good"));
  }
  function tr(o) {
    const l = localStorage.getItem(Un[o]);
    if (l)
      try {
        const m = JSON.parse(l);
        (s(dn(m)), r("hq"));
      } catch {
        F((m) => A(m, ["\u26A0\uFE0F Kunne ikke laste lagringen."]), "bad");
      }
  }
  function nr() {
    if (!localStorage.getItem(nn)) {
      F((l) => A(l, ["Ingen tidligere autosave-backup er tilgjengelig."]));
      return;
    }
    ae("restoreBackup");
  }
  function ar() {
    const o = localStorage.getItem(nn);
    if (o)
      try {
        const l = JSON.parse(o);
        (s(dn(l)), r("hq"));
      } catch {
        F((l) => A(l, ["Backupen kunne ikke leses."]), "bad");
      }
  }
  function sr() {
    const o = dn({ ...e, lastSeen: Date.now() });
    (s(
      A(o, [
        "\u{1F9F0} Lagringen er kontrollert og reparert. Sponsorgrenser, AI-styrke, prosjektstatus og \xF8konomiske felt er normalisert.",
      ]),
    ),
      r("hq"));
  }
  function rr() {
    const o = btoa(
      unescape(
        encodeURIComponent(JSON.stringify({ ...e, lastSeen: Date.now() })),
      ),
    );
    (w(o), navigator.clipboard?.writeText(o).catch(() => {}));
  }
  function or() {
    try {
      const o = JSON.parse(decodeURIComponent(escape(atob(N.trim()))));
      (s(dn(o)), r("hq"));
    } catch {
      F((o) => A(o, ["\u26A0\uFE0F Ugyldig lagringskode."]), "bad");
    }
  }
  function ir() {
    ae("hardReset");
  }
  function lr() {
    (localStorage.removeItem(Mn),
      localStorage.removeItem(nn),
      Fa.forEach((l) => localStorage.removeItem(l)));
    const o = Rn();
    (s(o), f(o.profile), r("hq"));
  }
  function cr() {
    const o = Y;
    (ae(null),
      o === "assistantPlan" && tn(),
      o === "startSeason" && Oa(),
      o === "skipDraft" && Ga(),
      o === "restoreBackup" && ar(),
      o === "hardReset" && lr());
  }
  function Hn(o) {
    const l = to(e, o);
    (s(l.game), U(l.report), W(!1), r("hq"));
  }
  const Ka = vr(e.profile.primaryColor),
    dr = {
      "--club-primary": e.profile.primaryColor,
      "--club-secondary": e.profile.secondaryColor,
      "--club-accent": Ka.color,
      "--club-on-accent": Ka.text,
    },
    bt = x
      ? (() => {
          if (x.kind === "project") {
            const M = et(x.id),
              C = e.completedProjects[x.id],
              j = Dn(e, x.id),
              I = ua(e, x.id),
              z = bs(e, x.id);
            return {
              icon: M.icon,
              eyebrow:
                M.kind === "building"
                  ? "Byggeprosjekt"
                  : M.kind === "department"
                    ? "Ny avdeling"
                    : "Klubbprogram",
              title: M.names[C],
              description: M.benefits[C],
              confirmLabel:
                M.kind === "building"
                  ? "Start bygging"
                  : M.kind === "department"
                    ? "Etabler avdeling"
                    : "Start program",
              metrics: [
                ["Betal n\xE5", h(j)],
                [
                  M.kind === "building"
                    ? "Byggetid"
                    : M.kind === "department"
                      ? "Etablering"
                      : "Implementering",
                  `${I} uker`,
                ],
                ["Ny ukekostnad", `+${h(z.weeklyDelta)}`],
                [
                  "Ukesresultat etterp\xE5",
                  `${pe(z.after).profit >= 0 ? "+" : ""}${h(pe(z.after).profit)}`,
                ],
                ["Penger igjen", h(e.cash - j)],
              ],
            };
          }
          const o = Be(e.clubBase),
            l = Be(x.target),
            m = x.target === "ownedCampus",
            p = l.weeklyRent - o.weeklyRent,
            S = pe(e).profit - p;
          return {
            icon: l.icon,
            eyebrow: "Flytt klubbbase",
            title: l.name,
            description: l.description,
            confirmLabel: "Bekreft flytting",
            metrics: [
              [m ? "Egenkapital" : "Etablering og depositum", h(l.moveCost)],
              ["Ny leie og drift", `${h(l.weeklyRent)}/uke`],
              ["Endring i ukeskostnad", `${p >= 0 ? "+" : ""}${h(p)}`],
              ["Ukesresultat etterp\xE5", `${S >= 0 ? "+" : ""}${h(S)}`],
              ["Kapasitet", Z(l.capacity)],
              ["Penger igjen", h(e.cash - l.moveCost)],
              ...(m ? [["Nytt eiendomsl\xE5n", h(18e4)]] : []),
            ],
          };
        })()
      : null,
    Re = E
      ? (() => {
          const o = e.roster.find((p) => p.id === E.playerId);
          if (!o) return null;
          const l = E.buyerId
              ? e.leagueTeams.find((p) => p.id === E.buyerId)
              : void 0,
            m = se(e) - o.salary;
          return {
            player: o,
            buyer: l,
            payrollAfter: m,
            rosterAfter: e.roster.length - 1,
            belowMinimum: e.roster.length - 1 < ve,
          };
        })()
      : null;
  return e.phase === "setup"
    ? t(ho, { draft: y, setDraft: f, onComplete: hn })
    : a("div", {
        className: `pc-app-shell ${e.settings.compactMode ? "compact-density" : ""} ${G ? "sidebar-collapsed" : ""}`,
        style: dr,
        children: [
          a("aside", {
            className: "desktop-sidebar",
            "aria-label": "Club Dynasty navigasjon",
            children: [
              a("div", {
                className: "sidebar-club",
                children: [
                  t(Xn, { profile: e.profile, className: "sidebar-crest" }),
                  a("div", {
                    children: [
                      t("span", { children: "CLUB DYNASTY" }),
                      t("strong", { children: e.profile.clubName }),
                      a("small", {
                        children: [le[e.leagueIndex].name, " \xB7 S", e.season],
                      }),
                    ],
                  }),
                  t("button", {
                    className: "sidebar-collapse-button",
                    onClick: () => re((o) => !o),
                    title: G ? "Utvid meny" : "Komprimer meny",
                    children: G ? "\u203A" : "\u2039",
                  }),
                ],
              }),
              a("nav", {
                className: "sidebar-nav",
                children: [
                  t("p", { children: "Kommandosenter" }),
                  a("button", {
                    className: n === "hq" ? "active" : "",
                    onClick: () => ke("hq"),
                    children: [
                      t("span", { children: t(_, { name: "home" }) }),
                      t("b", { children: "Hjem" }),
                      e.phase === "report"
                        ? t("i", { className: "nav-alert", children: "!" })
                        : t("kbd", { children: "1" }),
                    ],
                  }),
                  t("p", { children: "Sportslig" }),
                  a("button", {
                    className: n === "team" ? "active" : "",
                    onClick: () => ke("team"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "team" }) }),
                      t("b", { children: "Spillerstall" }),
                      t("kbd", { children: "2" }),
                    ],
                  }),
                  a("button", {
                    className: n === "market" ? "active" : "",
                    onClick: () => _t(e, "market") && ke("market"),
                    disabled: Me || !_t(e, "market"),
                    children: [
                      t("span", { children: t(_, { name: "search" }) }),
                      t("b", { children: "Marked" }),
                      !_t(e, "market") && t("i", { children: "L\xC5ST" }),
                    ],
                  }),
                  t("p", { children: "Klubbdrift" }),
                  a("button", {
                    className: n === "stadium" ? "active" : "",
                    onClick: () => ke("stadium"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "building" }) }),
                      t("b", { children: "Klubbomr\xE5de" }),
                      t("kbd", { children: "3" }),
                    ],
                  }),
                  a("button", {
                    className: n === "finance" ? "active" : "",
                    onClick: () => {
                      (i("overview"), ke("finance"));
                    },
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "finance" }) }),
                      t("b", { children: "\xD8konomi" }),
                    ],
                  }),
                  a("button", {
                    className: n === "board" ? "active" : "",
                    onClick: () => ke("board"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "board" }) }),
                      t("b", { children: "Styre" }),
                    ],
                  }),
                  a("button", {
                    className: n === "media" ? "active" : "",
                    onClick: () => ke("media"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "mail" }) }),
                      t("b", { children: "Innboks" }),
                      e.activeDecision &&
                        t("i", { className: "nav-alert", children: "!" }),
                    ],
                  }),
                  t("p", { children: "Liga" }),
                  a("button", {
                    className: n === "season" ? "active" : "",
                    onClick: () => ke("season"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "season" }) }),
                      t("b", { children: "Sesong" }),
                      t("kbd", { children: "4" }),
                    ],
                  }),
                  a("button", {
                    className: n === "history" ? "active" : "",
                    onClick: () => ke("history"),
                    disabled: Me,
                    children: [
                      t("span", { children: t(_, { name: "history" }) }),
                      t("b", { children: "Historie" }),
                    ],
                  }),
                ],
              }),
              a("div", {
                className: "sidebar-footer",
                children: [
                  e.phase !== "offseason"
                    ? a("section", {
                        className: "sidebar-pulse",
                        children: [
                          t("small", { children: "NESTE KAMP" }),
                          a("strong", { children: [Ae.logo, " ", Ae.name] }),
                          a("span", {
                            children: [
                              gt?.home ? "Hjemme" : "Borte",
                              " \xB7 uke ",
                              e.week,
                            ],
                          }),
                        ],
                      })
                    : a("section", {
                        className: "sidebar-pulse offseason",
                        children: [
                          t("small", { children: "OFFSEASON" }),
                          t("strong", { children: "Bygg neste sesong" }),
                          t("span", {
                            children: "Kontrakter \xB7 sponsor \xB7 draft",
                          }),
                        ],
                      }),
                  a("button", {
                    className: n === "settings" ? "active" : "",
                    onClick: () => ke("settings"),
                    children: [
                      t("span", { children: t(_, { name: "settings" }) }),
                      t("b", { children: "Innstillinger" }),
                      t("kbd", { children: "S" }),
                    ],
                  }),
                  a("div", {
                    className: "browser-build",
                    children: [t("i", {}), " Club Dynasty \xB7 v22.0"],
                  }),
                ],
              }),
            ],
          }),
          a("main", {
            className: "pc-main",
            children: [
              a("header", {
                className: "pc-commandbar",
                children: [
                  a("div", {
                    className: "pc-breadcrumb",
                    children: [
                      t("span", {
                        children:
                          n === "hq" && e.phase === "match"
                            ? "LIVE KAMP"
                            : n === "hq" && e.phase === "halftime"
                              ? "PAUSE"
                              : n === "hq" && e.phase === "report"
                                ? "KAMPRAPPORT"
                                : n === "hq" && e.phase === "offseason"
                                  ? "OFFSEASON"
                                  : `SESONG ${e.season} \xB7 UKE ${e.week}`,
                      }),
                      t("strong", {
                        children:
                          n === "hq" && e.phase === "match"
                            ? "Live kamp"
                            : n === "hq" && e.phase === "halftime"
                              ? "Pausejustering"
                              : n === "hq" && e.phase === "report"
                                ? "Kamprapport"
                                : n === "hq"
                                  ? "Kommandosenter"
                                  : n === "team"
                                    ? "Spillerstall"
                                    : n === "market"
                                      ? "Spillermarked"
                                      : n === "stadium"
                                        ? "Klubbomr\xE5de"
                                        : n === "finance"
                                          ? "\xD8konomi"
                                          : n === "board"
                                            ? "Styre"
                                            : n === "media"
                                              ? "Innboks og saker"
                                              : n === "season"
                                                ? "Liga og terminliste"
                                                : n === "history"
                                                  ? "Klubbhistorie"
                                                  : "Innstillinger",
                      }),
                    ],
                  }),
                  a("div", {
                    className: "commandbar-actions",
                    children: [
                      a("span", {
                        className: "save-state",
                        children: [
                          "\u25CF ",
                          e.settings.autosave
                            ? "Autolagret"
                            : "Manuell lagring",
                        ],
                      }),
                      t("button", {
                        className: "command-icon",
                        onClick: () => void bn(),
                        title: "Fullskjerm",
                        children: he ? "\u2299" : "\u26F6",
                      }),
                    ],
                  }),
                ],
              }),
              e.offlineSummary &&
                a("section", {
                  className: "offline-banner pc-offline-banner",
                  children: [
                    t("span", { children: e.offlineSummary }),
                    t("button", {
                      onClick: () =>
                        s((o) => ({ ...o, offlineSummary: void 0 })),
                      children: "Lukk",
                    }),
                  ],
                }),
              a("section", {
                className: "desktop-kpi-strip",
                children: [
                  t(fe, {
                    label: Tt(Ue, "Penger", "Cash"),
                    value: h(e.cash),
                    detail: DebtState.totalDebt
                      ? `Gjeld ${h(DebtState.totalDebt)} · ${h(DebtState.weeklyPayment)}/uke`
                      : "Gjeldfri",
                    highlight: !0,
                  }),
                  t(fe, {
                    label: Tt(Ue, "Supportere", "Fans"),
                    value: Z(e.fans),
                    detail: `${Math.round(de)}% forn\xF8yde`,
                  }),
                  t(fe, {
                    label: Tt(Ue, "Overall", "Overall"),
                    value: Math.round(De.overall).toString(),
                    detail: `Kjemi ${Math.round(De.chemistry)}%`,
                  }),
                  t(fe, {
                    label: Tt(Ue, "Sesong", "Season"),
                    value: `${e.wins}-${e.losses}`,
                    detail:
                      e.wins + e.losses === 0
                        ? `Ikke rangert \xB7 uke ${e.week}`
                        : `${$e}. plass \xB7 uke ${e.week}`,
                  }),
                  t(fe, {
                    label: Tt(Ue, "Ukesresultat", "Weekly result"),
                    value: `${P.profit >= 0 ? "+" : ""}${h(P.profit)}`,
                    detail:
                      P.profit >= 0
                        ? "Forventet overskudd"
                        : P.runwayWeeks === null
                          ? "Forventet underskudd"
                          : `${P.runwayWeeks.toFixed(0)} trygge uker`,
                  }),
                  t(fe, {
                    label: Tt(Ue, "Klubbprofil", "Club profile"),
                    value: `${Math.round(e.reputation)}/100`,
                    detail: `${e.reputation >= 45 ? "Nasjonalt attraktiv" : e.reputation >= 25 ? "Regional profil" : "Lokal profil"} \xB7 sponsor- og spillerkrav`,
                  }),
                ],
              }),
              n === "finance" &&
                c === "sponsors" &&
                t(ko, {
                  compact: !1,
                  game: e,
                  onOpen: (o) => {
                    (u(o ?? "all"), i("sponsors"), ke("finance"));
                  },
                }),
              a("section", {
                className: `pc-workspace ${n === "settings" || n === "hq" ? "settings-workspace" : ""}`,
                children: [
                  t("div", {
                    className: "pc-content-panel",
                    children:
                      n === "settings"
                        ? t(Do, {
                            game: e,
                            onSettings: (o) =>
                              F((l) => ({ ...l, settings: o })),
                            onSave: er,
                            onLoad: tr,
                            onLoadBackup: nr,
                            onRepair: sr,
                            onExport: rr,
                            importText: N,
                            setImportText: w,
                            onImport: or,
                            onReset: ir,
                          })
                        : n === "hq" && e.phase === "match" && e.match
                          ? t(Mo, { game: e, speed: g, setSpeed: k })
                          : n === "hq" && e.phase === "halftime" && e.match
                            ? t(No, { game: e, onChoose: qs })
                            : n === "hq" && e.phase === "report" && e.lastReport
                              ? t(Co, { report: e.lastReport, onContinue: Vs })
                              : a(X, {
                                  children: [
                                    e.phase === "report" &&
                                      e.lastReport &&
                                      n !== "hq" &&
                                      a("section", {
                                        className: "pending-report-banner",
                                        children: [
                                          a("div", {
                                            children: [
                                              t("span", {
                                                children: e.lastReport.won
                                                  ? "\u{1F3C6}"
                                                  : "\u{1F4CB}",
                                              }),
                                              a("div", {
                                                children: [
                                                  t("small", {
                                                    children:
                                                      "KAMPRAPPORT KLAR",
                                                  }),
                                                  t("strong", {
                                                    children:
                                                      e.lastReport.scoreLine,
                                                  }),
                                                  t("p", {
                                                    children:
                                                      "Du kan bruke menyen fritt. Rapporten ligger fortsatt p\xE5 Hjem til du fortsetter klubbuken.",
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          t("button", {
                                            onClick: () => ke("hq"),
                                            children: "\xC5pne rapport \u2192",
                                          }),
                                        ],
                                      }),
                                    e.phase === "offseason" &&
                                      n === "hq" &&
                                      t(Po, {
                                        game: e,
                                        onStart: Xs,
                                        onReview: Js,
                                        onReviewSponsors: Qs,
                                        onApprove: Zs,
                                        onSkipDraft: Ia,
                                        onAssistantPlan: en,
                                        onRenew: Xt,
                                        onRenewSponsor: La,
                                        onSell: Sn,
                                        onTab: (o, l) => Yt(o, l),
                                      }),
                                    n === "hq" &&
                                      e.phase !== "offseason" &&
                                      t(vo, {
                                        game: e,
                                        opponent: Ae,
                                        nextGame: gt,
                                        recommendation: nt,
                                        onContinue: jt,
                                        onAutoPrepare: vn,
                                        onBestLineup: xt,
                                        onRest: Qt,
                                        onStart: Da,
                                        onTab: ke,
                                        onClaimMission: Zt,
                                        onClaimChallenge: _s,
                                        onTactic: (o) =>
                                          F((l) => ({
                                            ...l,
                                            selectedTactic: o,
                                          })),
                                        onTraining: (o) =>
                                          F((l) => ({ ...l, trainingPlan: o })),
                                        onAction: Ye,
                                        onAutoSeason: () => W(!0),
                                      }),
                                    n === "team" &&
                                      t($o, {
                                        game: e,
                                        onStarter: $t,
                                        onCaptain: yn,
                                        onRenew: Xt,
                                        onSell: Sn,
                                        onBestLineup: xt,
                                        onAssistantPlan: en,
                                        onToggleLock: Jt,
                                        onTransferOffer: Us,
                                        locked: te,
                                      }),
                                    n === "market" &&
                                      (_t(e, "market")
                                        ? t(xo, {
                                            game: e,
                                            onScout: Wn,
                                            onRefresh: Oe,
                                            onSign: wn,
                                            onDraft: K,
                                            onSkipDraft: Ia,
                                            locked: te,
                                          })
                                        : t(So, {
                                            game: e,
                                            feature: "market",
                                          })),
                                    n === "season" &&
                                      t(jo, { game: e, standings: Ge }),
                                    n === "stadium" &&
                                      t(wo, {
                                        game: e,
                                        capacity: V,
                                        onProject: kn,
                                        onMoveBase: St,
                                        onStaff: zt,
                                        onSystem: Ra,
                                        locked: te,
                                      }),
                                    n === "board" &&
                                      t(Bo, {
                                        game: e,
                                        mood: Ht,
                                        salary: xe,
                                        onMeeting: Es,
                                        onStrategy: Ws,
                                      }),
                                    n === "finance" &&
                                      t(Ao, {
                                        game: e,
                                        salary: xe,
                                        staffCost: He,
                                        section: c,
                                        setSection: i,
                                        slotFilter: d,
                                        setSlotFilter: u,
                                        onPricing: (o, l) =>
                                          F((m) => ({
                                            ...m,
                                            pricing: { ...m.pricing, [o]: l },
                                          })),
                                        onSponsor: ye,
                                        onRenew: La,
                                        onTv: Fs,
                                        onLoan: Ys,
                                        onPayDebt: zs,
                                        onRescue: takeOffseasonRescue,
                                        onNavigate: ke,
                                      }),
                                    n === "media" &&
                                      t(To, { game: e, onDecision: Hs }),
                                    n === "history" && t(Lo, { game: e }),
                                  ],
                                }),
                  }),
                  n !== "settings" &&
                    n !== "hq" &&
                    a("aside", {
                      className: "pc-right-rail compact-right-rail",
                      children: [
                        a("section", {
                          className: "next-action-panel",
                          children: [
                            a("div", {
                              className: "rail-heading",
                              children: [
                                t("span", { children: t(_, { name: "wand" }) }),
                                a("div", {
                                  children: [
                                    t("small", { children: "NESTE PRIORITET" }),
                                    t("strong", { children: nt.title }),
                                  ],
                                }),
                              ],
                            }),
                            t("p", { children: nt.text }),
                            a("button", {
                              onClick: () => Ye(nt),
                              children: [nt.action, " \u2192"],
                            }),
                          ],
                        }),
                        e.phase !== "offseason" &&
                          a("section", {
                            className: "rail-season-card compact-next-match",
                            children: [
                              t("span", { children: "NESTE KAMP" }),
                              a("strong", {
                                children: [Ae.logo, " ", Ae.name],
                              }),
                              a("small", {
                                children: [
                                  gt?.home ? "Hjemme" : "Borte",
                                  " \xB7 Overall ",
                                  Math.round(Gn(Ae).overall),
                                ],
                              }),
                              t("b", {
                                className: "matchup-category",
                                children: Ms(ha(e, Ae, gt?.home ?? !0)),
                              }),
                            ],
                          }),
                      ],
                    }),
                ],
              }),
            ],
          }),
          Y &&
            (() => {
              const o = ta(e),
                l = pe(e),
                p = {
                  assistantPlan: {
                    eyebrow: "Assistentplan",
                    title: "Gjennomf\xF8r kontraktsplan",
                    description:
                      "Assistenten beholder n\xF8kkelspillere og talenter, og frigir overfl\xF8dig bredde. Kontroller konsekvensene f\xF8r du godkjenner.",
                    confirm: "Gjennomf\xF8r planen",
                    metrics: [
                      ["Fornyes", `${o.renewed.length} spillere`],
                      ["Frigis", `${o.released.length} spillere`],
                      ["Signeringsbonuser", h(o.totalBonus)],
                      ["Ny spillerl\xF8nn", `${h(o.projectedSalary)}/uke`],
                      ["Penger etterp\xE5", h(e.cash - o.totalBonus)],
                      ["Klubbens budsjett", `${h(me(e))}/uke`],
                    ],
                  },
                  startSeason: {
                    eyebrow: "Sesongstart",
                    title: `Start sesong ${e.season + 1}`,
                    description:
                      "Alle obligatoriske steg er fullf\xF8rt. Dette registrerer troppen og \xE5pner den nye sesongen.",
                    confirm: "Start sesongen",
                    metrics: [
                      ["Tropp", `${e.roster.length}/${Je}`],
                      ["Spillerl\xF8nn", `${h(se(e))}/uke`],
                      ["L\xF8nnsbudsjett", `${h(me(e))}/uke`],
                      ["Liga-cap", `${h(e.boardGoals.salaryCap)}/uke`],
                      [
                        "Ukesresultat",
                        `${l.profit >= 0 ? "+" : ""}${h(l.profit)}`,
                      ],
                      ["Kontanter", h(e.cash)],
                    ],
                  },
                  skipDraft: {
                    eyebrow: "Draft",
                    title: "Avslutt draften",
                    description:
                      "Resterende valg gis fra deg og kan ikke hentes tilbake denne offseason.",
                    confirm: "Gi fra deg valgene",
                    danger: !0,
                    metrics: [
                      ["Valg som gis fra deg", `${e.draftPicks}`],
                      ["Tropp n\xE5", `${e.roster.length}/${Je}`],
                      ["Ledig cap", h(rn(e).space)],
                      ["Neste steg", "Troppskontroll"],
                    ],
                  },
                  restoreBackup: {
                    eyebrow: "Sikkerhetskopi",
                    title: "Gjenopprett forrige autosave",
                    description:
                      "N\xE5v\xE6rende tilstand erstattes med forrige lagrede versjon.",
                    confirm: "Gjenopprett backup",
                    danger: !0,
                    metrics: [
                      ["Handling", "Erstatt n\xE5v\xE6rende lagring"],
                      ["Etterp\xE5", "Spillet \xE5pnes p\xE5 Hjem"],
                    ],
                  },
                  hardReset: {
                    eyebrow: "Nullstill spill",
                    title: "Slett hele karrieren",
                    description:
                      "Alle lokale lagringer for denne karrieren slettes. Handlingen kan ikke angres.",
                    confirm: "Slett og start p\xE5 nytt",
                    danger: !0,
                    metrics: [
                      ["Klubb", e.profile.clubName],
                      ["Sesong", `${e.season}`],
                      ["Historikk", `${e.history.length} sesonger`],
                    ],
                  },
                }[Y];
              return t("div", {
                className: "game-confirm-backdrop",
                onMouseDown: () => ae(null),
                children: a("section", {
                  className: "game-confirm-modal v18-decision-modal",
                  onMouseDown: (S) => S.stopPropagation(),
                  role: "dialog",
                  "aria-modal": "true",
                  children: [
                    a("header", {
                      children: [
                        t("div", {
                          className: "game-confirm-icon",
                          children: t(_, {
                            name: p.danger ? "alert" : "check",
                          }),
                        }),
                        a("div", {
                          children: [
                            t("p", {
                              className: "eyebrow",
                              children: p.eyebrow,
                            }),
                            t("h2", { children: p.title }),
                          ],
                        }),
                        t("button", {
                          className: "drawer-close",
                          onClick: () => ae(null),
                          children: "\xD7",
                        }),
                      ],
                    }),
                    t("p", {
                      className: "game-confirm-description",
                      children: p.description,
                    }),
                    t("div", {
                      className: "game-confirm-metrics",
                      children: p.metrics.map(([S, M]) =>
                        a(
                          "div",
                          {
                            children: [
                              t("span", { children: S }),
                              t("strong", { children: M }),
                            ],
                          },
                          S,
                        ),
                      ),
                    }),
                    Y === "assistantPlan" &&
                      o.blocked.length > 0 &&
                      a("div", {
                        className: "game-confirm-warning",
                        children: [
                          t(_, { name: "alert" }),
                          a("span", {
                            children: [
                              "M\xE5 l\xF8ses manuelt: ",
                              o.blocked.join(", "),
                              ".",
                            ],
                          }),
                        ],
                      }),
                    a("footer", {
                      children: [
                        t("button", {
                          className: "soft-button",
                          onClick: () => ae(null),
                          children: "Tilbake",
                        }),
                        t("button", {
                          className: p.danger
                            ? "danger-button solid-danger"
                            : "primary-button",
                          onClick: cr,
                          children: p.confirm,
                        }),
                      ],
                    }),
                  ],
                }),
              });
            })(),
          B &&
            t("div", {
              className: "game-confirm-backdrop",
              onMouseDown: () => W(!1),
              children: a("section", {
                className: "game-confirm-modal auto-season-modal",
                onMouseDown: (o) => o.stopPropagation(),
                role: "dialog",
                "aria-modal": "true",
                children: [
                  a("header", {
                    children: [
                      t("div", {
                        className: "game-confirm-icon",
                        children: t(_, { name: "season" }),
                      }),
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "Auto-manager",
                          }),
                          t("h2", {
                            children: "Hvor langt skal assistenten kj\xF8re?",
                          }),
                        ],
                      }),
                      t("button", {
                        className: "drawer-close",
                        onClick: () => W(!1),
                        children: "\xD7",
                      }),
                    ],
                  }),
                  t("p", {
                    className: "game-confirm-description",
                    children:
                      "Assistenten bruker trygg trening, setter beste tilgjengelige lag og simulerer kampene. Store investeringer, spillersalg og nye signeringer gj\xF8res aldri automatisk.",
                  }),
                  a("div", {
                    className: "auto-season-options",
                    children: [
                      a("button", {
                        onClick: () => Hn("event"),
                        children: [
                          t(_, { name: "alert" }),
                          a("div", {
                            children: [
                              t("strong", {
                                children: "Til neste viktige hendelse",
                              }),
                              t("span", {
                                children:
                                  "Stopper ved skade, styresak, spillerbud, sponsorfornyelse eller \xF8konomisk risiko.",
                              }),
                            ],
                          }),
                          t("em", { children: "Anbefalt" }),
                        ],
                      }),
                      a("button", {
                        onClick: () => Hn("playoffs"),
                        children: [
                          t(_, { name: "season" }),
                          a("div", {
                            children: [
                              t("strong", {
                                children: "Kj\xF8r til sluttspill",
                              }),
                              t("span", {
                                children:
                                  "Simulerer resten av grunnserien og stopper f\xF8r f\xF8rste sluttspillkamp.",
                              }),
                            ],
                          }),
                        ],
                      }),
                      a("button", {
                        onClick: () => Hn("season"),
                        children: [
                          t(_, { name: "season" }),
                          a("div", {
                            children: [
                              t("strong", {
                                children: "Kj\xF8r ut grunnserien",
                              }),
                              t("span", {
                                children:
                                  "Stopper alltid f\xF8r f\xF8rste sluttspillkamp eller ved offseason.",
                              }),
                            ],
                          }),
                          t("em", { children: "Stopper ved postseason" }),
                        ],
                      }),
                    ],
                  }),
                  a("div", {
                    className: "game-confirm-warning",
                    children: [
                      t(_, { name: "alert" }),
                      t("span", {
                        children:
                          "Sponsorvedlikehold h\xE5ndterer trygge avtaler. Sluttspill og kritiske vedtak stopper alltid simuleringen. Bruk \xABneste viktige hendelse\xBB n\xE5r du vil beholde kontrollen.",
                      }),
                    ],
                  }),
                  t("footer", {
                    children: t("button", {
                      className: "soft-button",
                      onClick: () => W(!1),
                      children: "Avbryt",
                    }),
                  }),
                ],
              }),
            }),
          L &&
            t("div", {
              className: "game-confirm-backdrop",
              onMouseDown: () => U(null),
              children: a("section", {
                className: "game-confirm-modal auto-report-modal",
                onMouseDown: (o) => o.stopPropagation(),
                role: "dialog",
                "aria-modal": "true",
                children: [
                  a("header", {
                    children: [
                      t("div", {
                        className: "game-confirm-icon",
                        children: t(_, { name: "chart" }),
                      }),
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "Auto-manager fullf\xF8rt",
                          }),
                          a("h2", {
                            children: [
                              L.wins,
                              "-",
                              L.losses,
                              " p\xE5 ",
                              L.games,
                              " kamp",
                              L.games === 1 ? "" : "er",
                            ],
                          }),
                        ],
                      }),
                      t("button", {
                        className: "drawer-close",
                        onClick: () => U(null),
                        children: "\xD7",
                      }),
                    ],
                  }),
                  a("div", {
                    className: "auto-report-kpis",
                    children: [
                      a("div", {
                        children: [
                          t("span", { children: "Kontanter" }),
                          a("strong", {
                            className:
                              L.cashChange >= 0 ? "positive" : "negative",
                            children: [
                              L.cashChange >= 0 ? "+" : "",
                              h(L.cashChange),
                            ],
                          }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Supportere" }),
                          a("strong", {
                            className:
                              L.fansChange >= 0 ? "positive" : "negative",
                            children: [
                              L.fansChange >= 0 ? "+" : "",
                              Z(L.fansChange),
                            ],
                          }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Periode" }),
                          a("strong", {
                            children: [
                              "Uke ",
                              L.startWeek,
                              "\u2013",
                              L.endWeek,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("div", {
                    className: "auto-stop-reason",
                    children: [
                      t(_, { name: "target" }),
                      a("div", {
                        children: [
                          t("strong", { children: "Stoppet fordi" }),
                          t("span", { children: L.stopReason }),
                        ],
                      }),
                    ],
                  }),
                  t("div", {
                    className: "auto-results-list",
                    children: L.results.map((o) =>
                      t("span", { children: o }, o),
                    ),
                  }),
                  t("footer", {
                    children: t("button", {
                      className: "primary-button",
                      onClick: () => U(null),
                      children: "Fortsett herfra",
                    }),
                  }),
                ],
              }),
            }),
          x &&
            bt &&
            t("div", {
              className: "game-confirm-backdrop",
              onMouseDown: () => R(null),
              children: a("section", {
                className: "game-confirm-modal",
                onMouseDown: (o) => o.stopPropagation(),
                role: "dialog",
                "aria-modal": "true",
                "aria-label": bt.title,
                children: [
                  a("header", {
                    children: [
                      t("div", {
                        className: "game-confirm-icon",
                        children: bt.icon,
                      }),
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: bt.eyebrow,
                          }),
                          t("h2", { children: bt.title }),
                        ],
                      }),
                      t("button", {
                        className: "drawer-close",
                        onClick: () => R(null),
                        "aria-label": "Lukk",
                        children: "\xD7",
                      }),
                    ],
                  }),
                  t("p", {
                    className: "game-confirm-description",
                    children: bt.description,
                  }),
                  t("div", {
                    className: "game-confirm-metrics",
                    children: bt.metrics.map(([o, l]) =>
                      a(
                        "div",
                        {
                          children: [
                            t("span", { children: o }),
                            t("strong", { children: l }),
                          ],
                        },
                        o,
                      ),
                    ),
                  }),
                  a("div", {
                    className: "game-confirm-warning",
                    children: [
                      t(_, { name: "alert" }),
                      t("span", {
                        children:
                          "Kontroller l\xF8pende kostnader f\xF8r du bekrefter. Handlingen kan ikke angres direkte.",
                      }),
                    ],
                  }),
                  a("footer", {
                    children: [
                      t("button", {
                        className: "soft-button",
                        onClick: () => R(null),
                        children: "Avbryt",
                      }),
                      t("button", {
                        className: "primary-button",
                        onClick: Vn,
                        children: bt.confirmLabel,
                      }),
                    ],
                  }),
                ],
              }),
            }),
          E &&
            Re &&
            t("div", {
              className: "game-confirm-backdrop",
              onMouseDown: () => T(null),
              children: a("section", {
                className: "game-confirm-modal player-sale-confirm",
                onMouseDown: (o) => o.stopPropagation(),
                role: "dialog",
                "aria-modal": "true",
                "aria-label":
                  Re.player.contractYears <= 0
                    ? `Frigi ${Re.player.name}`
                    : `Selg ${Re.player.name}`,
                children: [
                  a("header", {
                    children: [
                      t("div", {
                        className: "game-confirm-icon",
                        children:
                          Re.player.contractYears <= 0
                            ? "\u{1F44B}"
                            : "\u{1F4BC}",
                      }),
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "Spiller\xF8konomi",
                          }),
                          t("h2", {
                            children:
                              Re.player.contractYears <= 0
                                ? `Frigi ${Re.player.name}`
                                : `Selg ${Re.player.name}`,
                          }),
                        ],
                      }),
                      t("button", {
                        className: "drawer-close",
                        onClick: () => T(null),
                        "aria-label": "Lukk",
                        children: "\xD7",
                      }),
                    ],
                  }),
                  t("p", {
                    className: "game-confirm-description",
                    children:
                      Re.player.contractYears <= 0
                        ? "Spilleren forlater klubben uten overgangssum."
                        : `${Re.buyer?.name ?? "En annen klubb"} tilbyr et hurtigsalg basert p\xE5 markedsverdien.`,
                  }),
                  a("div", {
                    className: "game-confirm-metrics",
                    children: [
                      a("div", {
                        children: [
                          t("span", { children: "Overgangssum" }),
                          t("strong", { children: h(E.fee) }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Spart l\xF8nn" }),
                          a("strong", {
                            children: ["\u2212", h(Re.player.salary), "/uke"],
                          }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Ny spillerl\xF8nn" }),
                          a("strong", {
                            children: [h(Re.payrollAfter), "/uke"],
                          }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Tropp etterp\xE5" }),
                          a("strong", { children: [Re.rosterAfter, "/", ve] }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Klubbens budsjett" }),
                          a("strong", { children: [h(me(e)), "/uke"] }),
                        ],
                      }),
                    ],
                  }),
                  a("div", {
                    className: `game-confirm-warning ${Re.belowMinimum ? "danger" : ""}`,
                    children: [
                      t(_, { name: "alert" }),
                      t("span", {
                        children: Re.belowMinimum
                          ? "Du kan g\xE5 under minimum i offseason, men m\xE5 ha minst 16 spillere og alle posisjoner dekket f\xF8r ny sesong."
                          : "Spilleren fjernes umiddelbart fra tropp, laguttak, l\xF8nn og aktive bud.",
                      }),
                    ],
                  }),
                  a("footer", {
                    children: [
                      t("button", {
                        className: "soft-button",
                        onClick: () => T(null),
                        children: "Avbryt",
                      }),
                      t("button", {
                        className: "danger-button",
                        onClick: En,
                        children:
                          Re.player.contractYears <= 0
                            ? "Bekreft frigivelse"
                            : "Bekreft salg",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          D &&
            t("div", {
              className: "shortcut-backdrop",
              onMouseDown: () => q(!1),
              children: a("section", {
                className: "shortcut-modal",
                onMouseDown: (o) => o.stopPropagation(),
                children: [
                  a("header", {
                    children: [
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "PC-kontroller",
                          }),
                          t("h2", { children: "Tastatursnarveier" }),
                        ],
                      }),
                      t("button", { onClick: () => q(!1), children: "\xD7" }),
                    ],
                  }),
                  a("div", {
                    children: [
                      a("span", {
                        children: [t("kbd", { children: "1" }), " Hjem"],
                      }),
                      a("span", {
                        children: [
                          t("kbd", { children: "2" }),
                          " Spillerstall",
                        ],
                      }),
                      a("span", {
                        children: [
                          t("kbd", { children: "3" }),
                          " Klubbomr\xE5de",
                        ],
                      }),
                      a("span", {
                        children: [t("kbd", { children: "4" }), " Liga"],
                      }),
                      a("span", {
                        children: [
                          t("kbd", { children: "S" }),
                          " Innstillinger",
                        ],
                      }),
                      a("span", {
                        children: [t("kbd", { children: "F" }), " Fullskjerm"],
                      }),
                      a("span", {
                        children: [
                          t("kbd", { children: "?" }),
                          " \xC5pne snarveier",
                        ],
                      }),
                      a("span", {
                        children: [
                          t("kbd", { children: "Esc" }),
                          " Lukk vindu",
                        ],
                      }),
                    ],
                  }),
                  t("p", {
                    children:
                      "Spillet kj\xF8rer fortsatt som vanlig i nettleseren. Fullskjerm gir den mest PC-lignende playtesten.",
                  }),
                ],
              }),
            }),
        ],
      });
}
function Ls(e) {
  return e === "owner"
    ? "eier og manager"
    : e === "generalManager"
      ? "daglig leder"
      : "hovedtrener";
}
function ao(e) {
  return e === "trophies"
    ? "Jakten p\xE5 trofeer"
    : e === "youth"
      ? "Utvikle talenter"
      : e === "business"
        ? "\xD8konomisk vekst"
        : "Redde klubben";
}
const _n = {
  sporting: {
    label: "Sportslig satsing",
    short: "Resultater f\xF8rst",
    description:
      "Mer handlingsrom til spillerstall og prestasjon, men mindre toleranse for svake resultater.",
    priority: "Sluttspill og troppskvalitet",
    risk: "H\xF8yere sportslig press",
  },
  financial: {
    label: "\xD8konomisk kontroll",
    short: "Bygg b\xE6rekraftig",
    description:
      "Styret prioriterer positiv drift, reserve og kontrollert l\xF8nnsvekst.",
    priority: "Likviditet og l\xF8nnsandel",
    risk: "Mindre spillerbudsjett",
  },
  youth: {
    label: "Utvikle unge",
    short: "Bygg fremtiden",
    description:
      "Akademi, draft og spilletid for unge spillere f\xE5r st\xF8rre verdi.",
    priority: "Unge startere og utvikling",
    risk: "Ustabile resultater",
  },
  commercial: {
    label: "Kommersiell vekst",
    short: "Fans og partnere",
    description: "Supporterbase, sponsorer og medierekkevidde prioriteres.",
    priority: "Klubbprofil og supportervekst",
    risk: "Krever investeringer",
  },
  infrastructure: {
    label: "Stadion og anlegg",
    short: "Bygg klubbomr\xE5det",
    description: "Styret prioriterer stadion, kampdag og langsiktig eierskap.",
    priority: "Kapasitet og fasiliteter",
    risk: "Gjeld og vedlikehold",
  },
};
function so(e) {
  return _n[e].label;
}
function Ds(e) {
  const s = Math.ceil(e.boardGoals.wins * Math.min(1, e.week / oe)),
    n = b(
      Math.round(
        52 + (e.wins - s) * 7 + (e.wins - e.losses) * 2.2 + e.trophies * 3,
      ),
      0,
      100,
    ),
    r = pe(e),
    c =
      (Math.max(0, se(e) - e.boardGoals.salaryCap) /
        Math.max(1, e.boardGoals.salaryCap)) *
      45,
    i = b(
      Math.round(
        58 +
          (r.seasonProfit >= 0 ? 14 : -12) +
          Math.min(15, (e.cash / Math.max(1, e.boardGoals.cash)) * 12) -
          c -
          getDebtSnapshot(e).totalDebt / 22e3,
      ),
      0,
      100,
    ),
    d = b(
      Math.round(
        45 +
          mt(e) * 0.42 +
          Math.min(15, (e.fans / Math.max(1, e.boardGoals.fans)) * 12) +
          Math.min(8, Le(e).length * 2) -
          (e.activeDecision ? 3 : 0),
      ),
      0,
      100,
    );
  return { sporting: n, financial: i, culture: d };
}
function Is(e) {
  return e === "live"
    ? "Direkte kamp"
    : e === "highlights"
      ? "Se h\xF8ydepunkter"
      : e === "fast"
        ? "Hurtigsimulering"
        : "\xD8yeblikkelig resultat";
}
function ro(e) {
  return e === "attack"
    ? "\u{1F525} Laget g\xE5r mer offensivt"
    : e === "defense"
      ? "\u{1F6E1}\uFE0F Laget beskytter bakrommet"
      : e === "motivate"
        ? "\u{1F4E3} Manageren fyrer opp garderoben"
        : "\u{1F33F} N\xF8kkelspillerne beskyttes";
}
function oo(e) {
  return e >= 80
    ? {
        label: "Trygg posisjon",
        className: "excellent",
        icon: "stable",
        text: "Styret st\xF8tter planen din og gir deg stort handlingsrom.",
      }
    : e >= 60
      ? {
          label: "Stabil st\xF8tte",
          className: "good",
          icon: "stable",
          text: "Flertallet st\xF8tter deg, men forventer fremdrift p\xE5 hovedm\xE5lene.",
        }
      : e >= 42
        ? {
            label: "Under vurdering",
            className: "watching",
            icon: "watch",
            text: "Styret f\xF8lger \xF8konomi og sportslige resultater tett.",
          }
        : e >= 22
          ? {
              label: "Krever forbedring",
              className: "warning",
              icon: "warning",
              text: "Du m\xE5 levere raskt for \xE5 beholde styrets tillit.",
            }
          : {
              label: "Fare for oppsigelse",
              className: "danger",
              icon: "danger",
              text: "Styret diskuterer om klubben trenger ny ledelse.",
            };
}
function Gs(e) {
  const s = b(
      100 -
        (Math.max(0, se(e) - e.boardGoals.salaryCap) /
          Math.max(1, e.boardGoals.salaryCap)) *
          180,
      0,
      100,
    ),
    n = b(38 + e.wins * 9 - e.losses * 5 + e.trophies * 10, 0, 100),
    r = b((Ct(e) / Math.max(1, e.boardGoals.stadiumLevels)) * 100, 0, 100),
    c = b((e.fans / Math.max(1, e.boardGoals.fans)) * 100, 0, 100),
    i = b(
      (e.cash / Math.max(1, e.boardGoals.cash)) * 100 -
        getDebtSnapshot(e).totalDebt / 1e3,
      0,
      100,
    ),
    d = b((c + e.reputation + Math.min(100, Le(e).length * 25)) / 3, 0, 100);
  return [
    {
      id: "chair",
      code: "ID",
      name: "Ingrid Dahl",
      role: "Styreleder",
      agenda: "Helhet, stabilitet og klubbens omd\xF8mme",
      influence: 3,
      score: (n + i + e.boardTrust) / 3,
      quote:
        n > 65
          ? "Retningen er tydelig. N\xE5 m\xE5 vi bevise at veksten er b\xE6rekraftig."
          : "Vi trenger en plan styret kan tro p\xE5 \u2013 ikke bare nye utgifter.",
    },
    {
      id: "finance",
      code: "MC",
      name: "Maya Chen",
      role: "\xD8konomiansvarlig",
      agenda: "Likviditet, l\xF8nn og risiko",
      influence: 2,
      score: (i + s) / 2,
      quote:
        s < 50
          ? "L\xF8nnskostnadene er h\xF8yere enn inntektsgrunnlaget t\xE5ler."
          : "Kostnadsniv\xE5et er under kontroll, men marginene er fortsatt sm\xE5.",
    },
    {
      id: "sport",
      code: "LG",
      name: "Leon Grant",
      role: "Sportslig representant",
      agenda: "Tropp, resultater og spillerutvikling",
      influence: 2,
      score: n,
      quote:
        e.wins >= e.losses
          ? "Troppen viser fremgang. Riktige forsterkninger kan l\xF8fte oss videre."
          : "Vi mangler kvalitet og tydelig ansvar i laget.",
    },
    {
      id: "commercial",
      code: "SV",
      name: "Sofia Vega",
      role: "Kommersiell representant",
      agenda: "Sponsorer, media og publikumsvekst",
      influence: 1,
      score: d,
      quote:
        d >= 65
          ? "Klubben har blitt et attraktivt produkt for partnerne."
          : "Vi selger ikke historien v\xE5r godt nok enn\xE5.",
    },
    {
      id: "supporter",
      code: "EB",
      name: "Elias Berg",
      role: "Supporterrepresentant",
      agenda: "Identitet, priser og tillit blant fans",
      influence: 1,
      score: (c + mt(e)) / 2,
      quote:
        mt(e) >= 65
          ? "Supporterne kjenner seg igjen i klubben."
          : "Folk f\xF8ler at klubben beveger seg bort fra dem.",
    },
  ];
}
function io(e, s, n) {
  const r =
    n.cash > n.boardGoals.cash * 0.55 && getDebtSnapshot(n).totalDebt < 2e4;
  return ((n.boardStrategy === "sporting" &&
    (s === "transfer" || s === "salary")) ||
    (n.boardStrategy === "financial" && s === "reserve") ||
    (n.boardStrategy === "youth" && s === "academy") ||
    (n.boardStrategy === "commercial" && s === "commercial") ||
    (n.boardStrategy === "infrastructure" && s === "stadium")) &&
    e.id !== "finance"
    ? !0
    : s === "transfer"
      ? e.id === "sport" ||
        (e.id === "chair" && n.wins < n.boardGoals.wins) ||
        (e.id === "supporter" && n.losses > n.wins) ||
        e.score >= 72
      : s === "stadium"
        ? e.id === "commercial" ||
          e.id === "supporter" ||
          (e.id === "chair" && n.fans >= 800) ||
          (e.id === "finance" && r)
        : s === "academy"
          ? e.id === "sport" ||
            e.id === "supporter" ||
            e.id === "chair" ||
            e.score >= 78
          : s === "commercial"
            ? e.id === "commercial" ||
              e.id === "finance" ||
              e.id === "chair" ||
              (e.id === "supporter" && n.fans < n.boardGoals.fans)
            : s === "salary"
              ? e.id === "sport" ||
                (e.id === "chair" && n.boardTrust >= 62) ||
                (e.id === "commercial" && Le(n).length >= 2) ||
                (e.id === "finance" &&
                  r &&
                  se(n) < n.boardGoals.salaryCap * 0.96)
              : e.id === "finance" || e.id === "chair" || e.score < 48;
}
function lo(e, s) {
  const n = Gs(e).map((r) => ({ member: r, yes: io(r, s, e) }));
  return { votes: n, yes: n.filter((r) => r.yes).length };
}
function co(e, s, n) {
  const r = pe(n);
  return ((n.boardStrategy === "sporting" &&
    (s === "transferBudget" || s === "salaryCap")) ||
    (n.boardStrategy === "infrastructure" && s === "stadiumGrant") ||
    (n.boardStrategy === "financial" && s === "goalRelief")) &&
    e.id !== "finance"
    ? !0
    : s === "transferBudget"
      ? e.id === "sport" ||
        (e.id === "chair" && n.boardTrust >= 55) ||
        (e.id === "supporter" && n.losses > n.wins) ||
        (e.id === "finance" && r.seasonProfit > 0)
      : s === "salaryCap"
        ? e.id === "sport" ||
          (e.id === "chair" && n.boardTrust >= 68) ||
          (e.id === "commercial" && Le(n).length >= 2) ||
          (e.id === "finance" && r.salaryShare < 60)
        : s === "stadiumGrant"
          ? e.id === "commercial" ||
            e.id === "supporter" ||
            (e.id === "chair" && n.fans >= 900) ||
            (e.id === "finance" && r.seasonProfit > 8e3)
          : e.id === "chair" ||
            e.id === "supporter" ||
            (e.id === "sport" && n.losses > n.wins + 1) ||
            (e.id === "finance" && r.profit < 0);
}
function uo(e, s) {
  const n = Gs(e).map((r) => ({ member: r, yes: co(r, s, e) }));
  return { votes: n, yes: n.filter((r) => r.yes).length };
}
function po(e) {
  const s = pe(e),
    n = e.wins >= Math.ceil((e.boardGoals.wins * e.week) / oe),
    r = s.seasonProfit >= 0 && se(e) <= e.boardGoals.salaryCap,
    c = e.fans >= e.boardGoals.fans * 0.65 || Le(e).length >= 2,
    i = e.stadiumLoan > Math.max(15e4, e.clubValue * 0.45),
    d = mt(e) < 48,
    u = [
      n && "sportslige resultater",
      r && "\xF8konomisk kontroll",
      c && "kommersiell utvikling",
      e.stadiumOwnership !== "rented" && !i && "stadionstrategien",
    ].filter(Boolean),
    g = [
      !n && "resultatene",
      !r && "\xF8konomien",
      !c && "publikums- og sponsorveksten",
      i && "stadiongjelden",
      d && "supportertilliten",
    ].filter(Boolean);
  return {
    headline: g.length
      ? `Styret st\xF8tter ${u.length ? u.join(" og ") : "grunnplanen"}, men er bekymret for ${g.join(" og ")}.`
      : "Styret er forn\xF8yd med b\xE5de resultater, \xF8konomi og klubbvekst.",
    sports: n,
    finance: r,
    commercial: c,
  };
}
function mo(e) {
  if (e.phase === "offseason") {
    const c = Ce(e).offseasonChecklist;
    if (!c.summaryReviewed)
      return {
        title: "Les sesongoppsummeringen",
        text: "Se hva sesongen ga klubben f\xF8r du g\xE5r videre.",
        action: "Fortsett offseason",
        tab: "hq",
      };
    if (!c.contractsResolved)
      return {
        title: "Avgj\xF8r kontraktene",
        text: `${wt(e).length} spiller(e) st\xE5r uten avtale.`,
        action: "\xC5pne kontrakter",
        tab: "team",
      };
    if (!c.draftResolved)
      return {
        title: "Bruk draftvalgene",
        text: `Du har ${e.draftPicks} valg igjen.`,
        action: "\xC5pne draftrommet",
        tab: "market",
      };
    if (!c.rosterReady) {
      if (e.roster.length < ve || !Dt(e))
        return {
          title: "Fullf\xF8r spillerstallen",
          text: `Troppen har ${e.roster.length}/${ve} spillere. Alle posisjoner m\xE5 v\xE6re dekket f\xF8r sesongstart.`,
          action: "Finn billige spillere",
          tab: "market",
        };
      const i = se(e) - Math.min(e.boardGoals.salaryCap, me(e));
      return {
        title: "Reduser spillerl\xF8nnen",
        text: `${h(Math.max(0, i))}/uke m\xE5 bort f\xF8r sesongstart.`,
        action: "Rydd l\xF8nnen",
        tab: "team",
      };
    }
    return c.sponsorsReviewed
      ? c.budgetApproved
        ? {
            title: `Start sesong ${e.season + 1}`,
            text: "Alle obligatoriske steg er ferdige.",
            action: "Start ny sesong",
            tab: "hq",
          }
        : {
            title: "Godkjenn budsjettet",
            text: "Kontroller rammen f\xF8r sesongen starter.",
            action: "Fortsett offseason",
            tab: "hq",
          }
      : {
          title: "G\xE5 gjennom sponsorene",
          text: "Forny eller avslutt utl\xF8pte avtaler f\xF8r du l\xE5ser neste sesongs budsjett.",
          action: "Fortsett offseason",
          tab: "hq",
        };
  }
  if (e.activeDecision)
    return {
      title: `${e.activeDecision.category === "players" && e.activeDecision.playerId ? (e.roster.find((i) => i.id === e.activeDecision?.playerId)?.name ?? "En spiller") : Kn(e.activeDecision.category)} krever svar`,
      text: e.activeDecision.title,
      action: xs(e.activeDecision),
      tab: "media",
    };
  const s = e.roster.filter((c) => c.starter && c.injuryWeeks > 0);
  if (s.length)
    return {
      title: "Juster laguttaket",
      text: `${s.length} starter(e) er skadet.`,
      action: "G\xE5 til laget",
      tab: "team",
    };
  if (se(e) > e.boardGoals.salaryCap)
    return {
      title: "L\xF8nnsrammen er overskredet",
      text: `${h(se(e) - e.boardGoals.salaryCap)} m\xE5 bort.`,
      action: "Rydd troppen",
      tab: "team",
    };
  if (se(e) > me(e))
    return {
      title: "Spillerl\xF8nnen er for h\xF8y",
      text: `${h(se(e) - me(e))} over klubbens b\xE6rekraftige budsjett.`,
      action: "Rydd troppen",
      tab: "team",
    };
  const n = pe(e),
    r = ["main", "kit", "boards", "stadium"].find(
      (c) =>
        Xe(e, c) &&
        !_e(e, c) &&
        e.sponsorOffers.some(
          (i) =>
            i.slot === c &&
            e.reputation >= i.minReputation &&
            n.expectedAttendance >= i.minAttendance,
        ),
    );
  if (r)
    return {
      title: `${we(r)} har tilbud`,
      text: "Du kan signere eller forhandle en avtale n\xE5.",
      action: "\xC5pne tilbudet",
      tab: "finance",
      financeSection: "sponsors",
      sponsorSlot: r,
    };
  if (!e.roster.some((c) => c.captain))
    return {
      title: "Velg kaptein",
      text: "Klubben trenger en tydelig leder.",
      action: "Velg i laget",
      tab: "team",
    };
  if (e.boardMeeting && e.boardTrust < 35)
    return {
      title: "Krisem\xF8te i styret",
      text: e.boardMeeting.title,
      action: "\xC5pne styret",
      tab: "board",
    };
  if (e.roster.some((c) => c.condition < 45))
    return {
      title: "Laget er slitent",
      text: "Restitusjon anbefales f\xF8r neste kamp.",
      action: "Sett treningsplan",
      tab: "hq",
    };
  if (Ve(e).length) {
    const c = Ve(e),
      i = c[0];
    return {
      title: `${c.length} utviklingsprosjekt${c.length === 1 ? "" : "er"} p\xE5g\xE5r`,
      text: `${et(i.id).names[i.stage]} \xB7 ${i.weeksLeft} uke(r) igjen.`,
      action: "Se klubbomr\xE5det",
      tab: "stadium",
    };
  }
  return {
    title: e.weekStep >= 3 ? "Kampen er klar" : cn(e.weekStep).title,
    text: e.weekStep >= 3 ? `${Qe(e).name} venter.` : cn(e.weekStep).text,
    action: e.weekStep >= 3 ? "Start kamp" : "Fortsett uken",
    tab: "hq",
  };
}
function _({ name: e, size: s = 18 }) {
  return t("svg", {
    ...{
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.9,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": !0,
    },
    children: {
      home: a(X, {
        children: [
          t("path", { d: "M3 11.5 12 4l9 7.5" }),
          t("path", { d: "M5.5 10.5V20h13v-9.5" }),
          t("path", { d: "M9.5 20v-6h5v6" }),
        ],
      }),
      team: a(X, {
        children: [
          t("circle", { cx: "9", cy: "8", r: "3" }),
          t("path", { d: "M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6" }),
          t("circle", { cx: "17", cy: "9", r: "2.2" }),
          t("path", { d: "M15.5 15c3.2.2 4.8 1.8 5 5" }),
        ],
      }),
      search: a(X, {
        children: [
          t("circle", { cx: "10.5", cy: "10.5", r: "6.5" }),
          t("path", { d: "m16 16 5 5" }),
        ],
      }),
      building: a(X, {
        children: [
          t("path", { d: "M4 21V7l8-4 8 4v14" }),
          t("path", {
            d: "M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M10 21v-4h4v4",
          }),
        ],
      }),
      finance: a(X, {
        children: [
          t("path", { d: "M4 19V8M10 19V4M16 19v-7M22 19H2" }),
          t("path", { d: "m3 6 5-3 5 4 7-5" }),
        ],
      }),
      board: a(X, {
        children: [
          t("rect", { x: "3", y: "4", width: "18", height: "16", rx: "2" }),
          t("path", { d: "M7 9h10M7 13h6M7 17h8" }),
        ],
      }),
      mail: a(X, {
        children: [
          t("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
          t("path", { d: "m4 7 8 6 8-6" }),
        ],
      }),
      season: a(X, {
        children: [
          t("path", { d: "M8 4h8l1 4c0 3-2.2 5-5 5S7 11 7 8l1-4Z" }),
          t("path", { d: "M12 13v4M8 21h8M9 17h6" }),
          t("path", { d: "M7 7H4c0 3 1.4 5 4 5M17 7h3c0 3-1.4 5-4 5" }),
        ],
      }),
      history: a(X, {
        children: [
          t("circle", { cx: "12", cy: "12", r: "9" }),
          t("path", { d: "M12 7v5l3 2M4 4v5h5" }),
        ],
      }),
      settings: a(X, {
        children: [
          t("circle", { cx: "12", cy: "12", r: "3" }),
          t("path", {
            d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1Z",
          }),
        ],
      }),
      calendar: a(X, {
        children: [
          t("rect", { x: "3", y: "5", width: "18", height: "16", rx: "2" }),
          t("path", { d: "M7 3v4M17 3v4M3 10h18" }),
        ],
      }),
      alert: a(X, {
        children: [
          t("path", { d: "M12 3 2.8 20h18.4L12 3Z" }),
          t("path", { d: "M12 9v5M12 17h.01" }),
        ],
      }),
      contract: a(X, {
        children: [
          t("path", { d: "M6 3h9l3 3v15H6z" }),
          t("path", { d: "M14 3v4h4M9 11h6M9 15h6" }),
        ],
      }),
      sponsor: a(X, {
        children: [
          t("path", { d: "M4 7h16v10H4z" }),
          t("path", { d: "M8 7V5h8v2M8 17v2h8v-2" }),
          t("path", { d: "M9 12h6" }),
        ],
      }),
      chart: t(X, {
        children: t("path", { d: "M4 20V10M10 20V4M16 20v-7M22 20H2" }),
      }),
      ticket: a(X, {
        children: [
          t("path", { d: "M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V7Z" }),
          t("path", { d: "M12 7v12" }),
        ],
      }),
      broadcast: a(X, {
        children: [
          t("rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
          t("path", { d: "m9 9 6 3-6 3V9Z" }),
        ],
      }),
      check: t("path", { d: "m5 12 4 4L19 6" }),
      clock: a(X, {
        children: [
          t("circle", { cx: "12", cy: "12", r: "9" }),
          t("path", { d: "M12 7v5l3 2" }),
        ],
      }),
      wand: t(X, {
        children: t("path", {
          d: "m4 20 11-11M14 4l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM5 10l.7-1.5L7 10l1.5.7L7 12l-.7 1.5L5.7 12 4 11l1-.7Z",
        }),
      }),
      leaf: a(X, {
        children: [
          t("path", { d: "M20 4C10 4 5 9 5 16c4 1 8 0 11-3 3-3 4-9 4-9Z" }),
          t("path", { d: "M4 20c3-5 7-8 12-10" }),
        ],
      }),
      target: a(X, {
        children: [
          t("circle", { cx: "12", cy: "12", r: "9" }),
          t("circle", { cx: "12", cy: "12", r: "5" }),
          t("circle", { cx: "12", cy: "12", r: "1" }),
        ],
      }),
      tactics: a(X, {
        children: [
          t("path", { d: "M4 6h16M4 12h16M4 18h16" }),
          t("circle", { cx: "8", cy: "6", r: "2" }),
          t("circle", { cx: "15", cy: "12", r: "2" }),
          t("circle", { cx: "10", cy: "18", r: "2" }),
        ],
      }),
    }[e],
  });
}
function pe(e, s = se(e), n = yt(e)) {
  const r = Qe(e),
    c = mn(e),
    i = da(e),
    d = e.schedule.filter((O) => !O.playoff),
    u = d.length ? d.filter((O) => O.home).length / d.length : 0.5,
    g = c ? (c.home ? 1 : 0) : b(u, 0.4, 0.6),
    k = (O) => {
      const Q = O ? Vt(e, r) : e.pricing.ticket,
        De = On(e, r, O, "Klart", Q),
        Ae = O
          ? e.stadiumOwnership === "rented"
            ? 0.68
            : e.stadiumOwnership === "owned"
              ? 1
              : 1.06
          : 0.08,
        Ge = O ? (e.stadiumOwnership === "rented" ? 0.52 : 1) : 0.05,
        $e = De.attendance,
        xe = Math.round($e * Q * Ae * i.income),
        He = Math.round(
          Math.min($e * 0.04, 70 + e.upgrades.vip * 130) *
            (82 + e.upgrades.vip * 27) *
            Ae *
            i.income,
        ),
        P = Math.round(
          $e * (0.31 + e.upgrades.food * 0.07) * e.pricing.food * Ge * i.income,
        ),
        V = Math.round(
          $e *
            (0.075 + e.upgrades.merch * 0.042) *
            e.pricing.merch *
            Ge *
            i.income,
        ),
        de = Math.max(
          1,
          Q * Ae + e.pricing.food * 0.2 * Ge + e.pricing.merch * 0.06 * Ge,
        );
      return {
        attendance: $e,
        ticketRevenue: xe,
        vipRevenue: He,
        foodRevenue: P,
        merchRevenue: V,
        perFanValue: de,
      };
    },
    y = k(!0),
    f = k(!1),
    N = (O, Q) => Math.round(O * g + Q * (1 - g)),
    w = N(y.attendance, f.attendance);
  let v = N(y.ticketRevenue, f.ticketRevenue),
    $ = N(y.vipRevenue, f.vipRevenue),
    D = N(y.foodRevenue, f.foodRevenue),
    q = N(y.merchRevenue, f.merchRevenue);
  const x = Math.max(1, y.perFanValue * g + f.perFanValue * (1 - g)),
    R = Le(e).reduce((O, Q) => O + Q.weeklyPay, 0);
  let E = Cs(e, r, c, !1).revenue;
  const T = getDebtSnapshot(e),
    Y =
      s +
      n +
      In(e) +
      Math.round((qe(e) < 3 ? 180 : 700) + w * (qe(e) < 3 ? 0.2 : 0.35)),
    ae = v + $ + D + q + R + E,
    B = ae - Y,
    W = B - T.weeklyPayment,
    L = W * Math.max(1, e.schedule.filter((O) => !O.played).length),
    U = W < 0 ? Math.max(0, e.cash / Math.max(1, Math.abs(W))) : null,
    G = ae > 0 ? (s / ae) * 100 : 100,
    re = ae > 0 ? (R / ae) * 100 : 0,
    he = Math.ceil(Math.max(0, Y - R - E) / x),
    O = Math.max(Y * 2, T.weeklyPayment * 4, 5e3);
  return {
    expectedAttendance: w,
    ticketRevenue: v,
    foodRevenue: D,
    merchRevenue: q,
    vipRevenue: $,
    sponsorRevenue: R,
    tvRevenue: E,
    income: ae,
    expensesBeforeDebt: Y,
    debtPayment: T.weeklyPayment,
    expenses: Y + T.weeklyPayment,
    operatingProfit: B,
    profit: W,
    remainingGames: e.schedule.filter((O) => !O.played).length,
    seasonProfit: L,
    runwayWeeks: U,
    salaryShare: G,
    sponsorDependency: re,
    breakEvenAttendance: he,
    recommendedReserve: Math.round(O),
    freeCash: Math.max(0, Math.round(e.cash - O)),
    cashForecast: buildCashForecast(e, W, 4),
  };
}
function me(e) {
  const s = pe(e, 0, yt(e)),
    n = e.boardGoals.salaryCap,
    r = n * ([0.55, 0.58, 0.61, 0.64, 0.67][e.leagueIndex] ?? 0.55),
    c = s.expenses * 12,
    i = Math.max(0, e.cash - c),
    d = Math.min(n * 0.28, i / 32),
    u = s.income * 0.88 + d,
    g = e.cash < 0 ? 0.86 : 1;
  return Math.round(b(u * g, r, n * 0.9));
}
function Wt(e) {
  return Math.min(e.boardGoals.salaryCap, me(e));
}
function fo(e) {
  const s = me(e),
    n = Math.max(0, se(e) - s);
  if (n <= 0) return;
  const r = e.roster
    .filter(
      (c) =>
        !c.captain &&
        e.roster.filter((i) => i.position === c.position).length > 1,
    )
    .map((c) => {
      const i = e.freeAgents
          .filter((u) => u.position === c.position)
          .map((u) => ({ agent: u, terms: dt(u, 1, !1, e) }))
          .sort((u, g) => u.terms.salary - g.terms.salary)[0],
        d = i ? c.salary - i.terms.salary : c.salary;
      return { player: c, replacement: i, saving: d };
    })
    .filter((c) => c.saving > 0)
    .sort((c, i) => i.saving - c.saving);
  return { over: n, option: r[0] };
}
function go(e) {
  const s = [],
    n = se(e),
    r = pe(e, n, yt(e));
  e.activeDecision &&
    s.push({
      id: "decision",
      priority: "high",
      title: e.activeDecision.title,
      detail: "Denne saken krever et konkret valg.",
      tab: "media",
      action: xs(e.activeDecision),
      icon: "alert",
    });
  const c = Le(e).find((k) => (k.breachWeeks ?? 0) > 0);
  c &&
    s.push({
      id: "sponsor-risk",
      priority: "high",
      title: `${c.name} er i risikosonen`,
      detail: `${c.breachWeeks ?? 0}/3 uker med brudd p\xE5 avtalen.`,
      tab: "finance",
      financeSection: "sponsors",
      sponsorSlot: c.slot,
      action: "Se avtalen",
      icon: "sponsor",
    });
  const i =
    e.phase === "offseason"
      ? Le(e).find((k) => (k.seasonsLeft ?? 1) <= 0)
      : void 0;
  i &&
    s.push({
      id: "sponsor-expiry",
      priority: "medium",
      title: `${we(i.slot)} m\xE5 fornyes`,
      detail: `${i.name} er utl\xF8pt og kan fornyes f\xF8r neste sesong.`,
      tab: "finance",
      financeSection: "sponsors",
      sponsorSlot: i.slot,
      action: "Forhandle",
      icon: "clock",
    });
  const d = ["main", "kit", "boards", "stadium"].find(
    (k) =>
      Xe(e, k) &&
      !_e(e, k) &&
      e.sponsorOffers.some(
        (y) =>
          y.slot === k &&
          e.reputation >= y.minReputation &&
          r.expectedAttendance >= y.minAttendance,
      ),
  );
  d &&
    s.push({
      id: `open-${d}`,
      priority: "medium",
      title: `${we(d)} har et tilbud klart`,
      detail: "Du oppfyller kravene og kan forhandle n\xE5.",
      tab: "finance",
      financeSection: "sponsors",
      sponsorSlot: d,
      action: "Se tilbud",
      icon: "sponsor",
    });
  const u =
    e.phase === "offseason"
      ? wt(e).length
      : e.week >= 10
        ? e.roster.filter((k) => k.contractYears <= 1).length
        : 0;
  (u &&
    s.push({
      id: "contracts",
      priority: "medium",
      title: `${u} kontrakt${u === 1 ? "" : "er"} m\xE5 planlegges`,
      detail: "Forny eller frigi f\xF8r ny sesong.",
      tab: "team",
      action: "\xC5pne kontrakter",
      icon: "contract",
    }),
    n > e.boardGoals.salaryCap &&
      s.push({
        id: "cap",
        priority: "high",
        title: "L\xF8nnsrammen er overskredet",
        detail: `${h(n - e.boardGoals.salaryCap)} over rammen.`,
        tab: "team",
        action: "Reduser l\xF8nn",
        icon: "alert",
      }),
    n <= e.boardGoals.salaryCap &&
      n > me(e) &&
      s.push({
        id: "salary-budget",
        priority: "high",
        title: "Spillerl\xF8nnen er ikke b\xE6rekraftig",
        detail: `${h(n - me(e))} over klubbens reelle l\xF8nnsbudsjett.`,
        tab: "team",
        action: "Rydd troppen",
        icon: "finance",
      }),
    r.runwayWeeks !== null &&
      r.runwayWeeks < 6 &&
      s.push({
        id: "runway",
        priority: "high",
        title: "Likviditeten er presset",
        detail: `Kontantene varer ca. ${r.runwayWeeks.toFixed(1)} uker.`,
        tab: "finance",
        financeSection: "overview",
        action: "Se prognosen",
        icon: "finance",
      }),
    e.roster.some((k) => k.captain) ||
      s.push({
        id: "captain",
        priority: "low",
        title: "Velg kaptein",
        detail: "Laget mangler en tydelig leder.",
        tab: "team",
        action: "Velg spiller",
        icon: "team",
      }),
    e.boardMeeting &&
      e.boardTrust < 35 &&
      s.push({
        id: "board-crisis",
        priority: "high",
        title: "Styret krever krisem\xF8te",
        detail: e.boardMeeting.title,
        tab: "board",
        action: "\xC5pne styret",
        icon: "board",
      }));
  const g = { high: 0, medium: 1, low: 2 };
  return s.sort((k, y) => g[k.priority] - g[y.priority]);
}
function bo(e) {
  const s = [],
    n = mn(e);
  n &&
    s.push({
      id: "next-game",
      label: n.playoff ? "Sluttspill" : `Uke ${e.week}`,
      title:
        e.leagueTeams.find((i) => i.id === n.opponentId)?.name ?? "Neste kamp",
      detail: n.home ? "Hjemmekamp" : "Bortekamp",
      urgent: !0,
    });
  const r =
    e.phase === "offseason"
      ? Le(e).find((i) => (i.seasonsLeft ?? 1) <= 0)
      : void 0;
  r &&
    s.push({
      id: "sponsor",
      label: "Offseason",
      title: `${we(r.slot)} m\xE5 fornyes`,
      detail: r.name,
      urgent: !0,
    });
  const c =
    e.phase === "offseason"
      ? wt(e).length
      : e.week >= 9
        ? e.roster.filter((i) => i.contractYears <= 1).length
        : 0;
  return (
    c &&
      s.push({
        id: "contracts",
        label: "Offseason",
        title: `${c} kontrakter til vurdering`,
        detail: "Forny eller frigi",
      }),
    e.seasonStage === "regular" &&
      s.push({
        id: "playoffs",
        label: `Etter uke ${oe}`,
        title: "Sluttspillgrensen avgj\xF8res",
        detail: "Topp 4 g\xE5r videre",
      }),
    s.push({
      id: "offseason",
      label: "Sesongslutt",
      title: "Offseason og draft",
      detail: "Kontrakter, draft, tropp og budsjett",
    }),
    s.slice(0, 5)
  );
}
function qo(e, s, n) {
  const r = e.reputation < s.minReputation || n < s.minAttendance;
  return (s.breachWeeks ?? 0) >= 2
    ? {
        label: "Kritisk",
        className: "danger",
        text: "Neste brudd kan avslutte avtalen.",
      }
    : r || (s.breachWeeks ?? 0) === 1
      ? {
          label: "I risiko",
          className: "warning",
          text: "Avtalekravet er ikke stabilt oppfylt.",
        }
      : (s.seasonsLeft ?? 1) <= 0
        ? {
            label: "Utl\xF8pt",
            className: "warning",
            text: "Fornyelse er tilgjengelig i offseason.",
          }
        : (s.seasonsLeft ?? 1) === 1
          ? {
              label: "Siste sesong",
              className: "warning",
              text: "Avtalen utl\xF8per etter sesongen.",
            }
          : {
              label: "Stabil",
              className: "good",
              text: "Avtalen leverer som forventet.",
            };
}
function ho({ draft: e, setDraft: s, onComplete: n }) {
  const r = [
      "\u{1F6E1}\uFE0F",
      "\u{1F3C8}",
      "\u{1F43A}",
      "\u{1F985}",
      "\u{1F451}",
      "\u26A1",
      "\u{1F525}",
      "\u{1F43B}",
      "\u{1F988}",
      "\u{1F989}",
      "\u{1F409}",
      "\u{1F402}",
    ],
    c = [
      "#2563eb",
      "#1d4ed8",
      "#7c3aed",
      "#be123c",
      "#dc2626",
      "#0891b2",
      "#0f766e",
      "#f59e0b",
      "#0f172a",
    ],
    i = [
      "#f4c542",
      "#f8fafc",
      "#22d3ee",
      "#a3e635",
      "#fb7185",
      "#c4b5fd",
      "#f97316",
      "#94a3b8",
    ],
    d = Ke[e.region],
    u = (f) => {
      const N = Ke[f],
        w = { ...e, region: f, city: N.cities[0], rivalName: N.teams[0][0] };
      s(Qn(w));
    },
    g = [
      { label: "Klubbnavn", ok: !!e.clubName.trim() },
      { label: "Manager-navn", ok: !!e.managerName.trim() },
      { label: "By", ok: !!e.city.trim() },
      { label: "Stadionnavn", ok: !!e.stadiumName.trim() },
    ],
    k = g.every((f) => f.ok),
    y = (f) => s(Sr(e, f));
  return a("main", {
    className: "setup-screen v8-setup",
    style: {
      "--club-primary": e.primaryColor,
      "--club-secondary": e.secondaryColor,
    },
    children: [
      a("section", {
        className: "setup-intro",
        children: [
          t("p", {
            className: "eyebrow",
            children: "Club Dynasty \xB7 PC Career",
          }),
          t("h1", { children: "Bygg klubben fra grunnen." }),
          t("p", {
            children:
              "Lag alt selv, eller bruk terningene og la spillet finne en komplett internasjonal klubbidentitet.",
          }),
          t("button", {
            className: "surprise-button",
            onClick: () => s(Qn(e)),
            children: "\u{1F3B2} Overrask meg med alt",
          }),
          a("div", {
            className: "setup-preview identity-preview",
            children: [
              t(Xn, { profile: e, className: "preview-crest" }),
              a("div", {
                children: [
                  t("strong", { children: e.clubName || "Din nye klubb" }),
                  a("span", {
                    children: [
                      e.city || "Ny by",
                      " \xB7 ",
                      e.stadiumName || "Nytt stadion",
                    ],
                  }),
                  a("small", {
                    children: ["\xAB", e.motto || "Nytt motto", "\xBB"],
                  }),
                ],
              }),
            ],
          }),
          a("div", {
            className: "kit-preview",
            "aria-label": "Draktforh\xE5ndsvisning",
            children: [
              a("div", {
                className: "jersey home-kit",
                children: [
                  t("span", { children: e.logo }),
                  t("b", { children: Zn(e) }),
                  t("small", { children: "HOME" }),
                ],
              }),
              a("div", {
                className: "jersey away-kit",
                children: [
                  t("span", { children: e.logo }),
                  t("b", { children: Zn(e) }),
                  t("small", { children: "AWAY" }),
                ],
              }),
              a("div", {
                className: "identity-mini",
                children: [
                  t("span", { children: "Supportere" }),
                  t("strong", { children: e.supporterName || "Ikke valgt" }),
                  t("span", { children: "Rival" }),
                  t("strong", { children: e.rivalName }),
                ],
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "setup-form",
        children: [
          a("div", {
            className: "form-section",
            children: [
              a("div", {
                className: "section-heading-inline",
                children: [
                  t("p", {
                    className: "step-label",
                    children: "1 \xB7 Identitet",
                  }),
                  t("button", {
                    className: "tiny-random",
                    onClick: () => s(Qn(e)),
                    children: "\u{1F3B2} Generer identitet",
                  }),
                ],
              }),
              a("div", {
                className: "form-grid two",
                children: [
                  a("label", {
                    children: [
                      "Klubbnavn",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            value: e.clubName,
                            onChange: (f) =>
                              s({ ...e, clubName: f.target.value }),
                            placeholder: "Harbor City Hawks",
                          }),
                          t("button", {
                            onClick: () => y("clubName"),
                            "aria-label": "Tilfeldig klubbnavn",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Manager-navn",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            value: e.managerName,
                            onChange: (f) =>
                              s({ ...e, managerName: f.target.value }),
                            placeholder: "Your name",
                          }),
                          t("button", {
                            onClick: () => y("managerName"),
                            "aria-label": "Tilfeldig manager",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Region",
                      t("select", {
                        value: e.region,
                        onChange: (f) => u(f.target.value),
                        children: Object.keys(Ke).map((f) =>
                          t("option", { value: f, children: Ke[f].label }, f),
                        ),
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Spr\xE5k",
                      a("select", {
                        value: e.language,
                        onChange: (f) => s({ ...e, language: f.target.value }),
                        children: [
                          t("option", { value: "nb", children: "Norsk" }),
                          t("option", {
                            value: "en",
                            children: "English (beta)",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "By",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            list: "region-cities",
                            value: e.city,
                            onChange: (f) => s({ ...e, city: f.target.value }),
                            placeholder: d.cities[0],
                          }),
                          t("button", {
                            onClick: () => y("city"),
                            "aria-label": "Tilfeldig by",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                      t("datalist", {
                        id: "region-cities",
                        children: d.cities.map((f) =>
                          t("option", { value: f }, f),
                        ),
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Stadionnavn",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            value: e.stadiumName,
                            onChange: (f) =>
                              s({ ...e, stadiumName: f.target.value }),
                            placeholder: "Summit Field",
                          }),
                          t("button", {
                            onClick: () => y("stadiumName"),
                            "aria-label": "Tilfeldig stadionnavn",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Klubbmotto",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            value: e.motto,
                            onChange: (f) => s({ ...e, motto: f.target.value }),
                          }),
                          t("button", {
                            onClick: () => y("motto"),
                            "aria-label": "Tilfeldig motto",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Supportergruppe",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("input", {
                            value: e.supporterName,
                            onChange: (f) =>
                              s({ ...e, supporterName: f.target.value }),
                          }),
                          t("button", {
                            onClick: () => y("supporterName"),
                            "aria-label": "Tilfeldig supportergruppe",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Hovedrival",
                      a("div", {
                        className: "input-with-dice",
                        children: [
                          t("select", {
                            value: e.rivalName,
                            onChange: (f) =>
                              s({ ...e, rivalName: f.target.value }),
                            children: d.teams.map(([f]) =>
                              t("option", { children: f }, f),
                            ),
                          }),
                          t("button", {
                            onClick: () => y("rivalName"),
                            "aria-label": "Tilfeldig rival",
                            children: "\u{1F3B2}",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          a("div", {
            className: "form-section",
            children: [
              a("div", {
                className: "section-heading-inline",
                children: [
                  t("p", {
                    className: "step-label",
                    children: "2 \xB7 Logo, drakt og klubbfarger",
                  }),
                  t("button", {
                    className: "tiny-random",
                    onClick: () => y("colors"),
                    children: "\u{1F3A8} Nye farger",
                  }),
                ],
              }),
              t("div", {
                className: "choice-row logos",
                children: r.map((f) =>
                  t(
                    "button",
                    {
                      className: e.logo === f ? "selected" : "",
                      onClick: () => s({ ...e, logo: f }),
                      children: f,
                    },
                    f,
                  ),
                ),
              }),
              t("span", { className: "mini-label", children: "Hovedfarge" }),
              t("div", {
                className: "choice-row colors",
                children: c.map((f) =>
                  t(
                    "button",
                    {
                      style: { background: f },
                      className: e.primaryColor === f ? "selected" : "",
                      onClick: () => s({ ...e, primaryColor: f }),
                      "aria-label": f,
                    },
                    f,
                  ),
                ),
              }),
              t("span", {
                className: "mini-label",
                children: "Sekund\xE6rfarge",
              }),
              t("div", {
                className: "choice-row colors",
                children: i.map((f) =>
                  t(
                    "button",
                    {
                      style: { background: f },
                      className: e.secondaryColor === f ? "selected" : "",
                      onClick: () => s({ ...e, secondaryColor: f }),
                      "aria-label": f,
                    },
                    f,
                  ),
                ),
              }),
            ],
          }),
          a("div", {
            className: "form-section",
            children: [
              t("p", {
                className: "step-label",
                children: "3 \xB7 Karrierevalg",
              }),
              t("div", {
                className: "option-grid",
                children: [
                  [
                    "business",
                    "\u{1F4B0}",
                    "\xD8konomisk vekst",
                    "Styret bel\xF8nner overskudd og stadion.",
                  ],
                  [
                    "trophies",
                    "\u{1F3C6}",
                    "Jakten p\xE5 trofeer",
                    "Mer budsjett, h\xF8yere resultatkrav.",
                  ],
                  [
                    "youth",
                    "\u{1F393}",
                    "Utvikle talenter",
                    "Unge startere og akademi prioriteres.",
                  ],
                  [
                    "survival",
                    "\u{1F6DF}",
                    "Redde klubben",
                    "Lavere forventninger, strammere start.",
                  ],
                ].map(([f, N, w, v]) =>
                  a(
                    "button",
                    {
                      className: e.strategy === f ? "selected" : "",
                      onClick: () => s({ ...e, strategy: f }),
                      children: [
                        a("strong", { children: [N, " ", w] }),
                        t("span", { children: v }),
                      ],
                    },
                    f,
                  ),
                ),
              }),
              a("div", {
                className: "form-grid two compact",
                children: [
                  a("label", {
                    children: [
                      "Din rolle",
                      a("select", {
                        value: e.managerRole,
                        onChange: (f) =>
                          s({ ...e, managerRole: f.target.value }),
                        children: [
                          t("option", {
                            value: "owner",
                            children: "Eier og manager",
                          }),
                          t("option", {
                            value: "generalManager",
                            children: "Daglig leder",
                          }),
                          t("option", {
                            value: "headCoach",
                            children: "Hovedtrener",
                          }),
                        ],
                      }),
                    ],
                  }),
                  a("label", {
                    children: [
                      "Vanskelighetsgrad",
                      a("select", {
                        value: e.difficulty,
                        onChange: (f) =>
                          s({ ...e, difficulty: f.target.value }),
                        children: [
                          t("option", {
                            value: "casual",
                            children: "Casual \u2013 mer hjelp",
                          }),
                          t("option", {
                            value: "manager",
                            children: "Manager \u2013 balansert",
                          }),
                          t("option", {
                            value: "hardcore",
                            children: "Hardcore \u2013 streng \xF8konomi",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          a("div", {
            className: "setup-launch-sticky",
            children: [
              a("div", {
                className: "setup-validation",
                children: [
                  t("strong", { children: "F\xF8r du kan starte" }),
                  g.map((f) =>
                    a(
                      "span",
                      {
                        className: f.ok ? "ok" : "missing",
                        children: [f.ok ? "\u2713" : "\u25CB", " ", f.label],
                      },
                      f.label,
                    ),
                  ),
                ],
              }),
              t("button", {
                className: "launch-button",
                onClick: n,
                disabled: !k,
                children: "Start Club Dynasty \u2192",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function fe({ label: e, value: s, detail: n, highlight: r }) {
  return a("article", {
    className: `kpi ${r ? "highlight" : ""}`,
    children: [
      t("span", { children: e }),
      t("strong", { children: s }),
      t("small", { children: n }),
    ],
  });
}
function Ze({ eyebrow: e, title: s, detail: n }) {
  return t("header", {
    className: "panel-header",
    children: a("div", {
      children: [
        t("p", { className: "eyebrow", children: e }),
        t("h2", { children: s }),
        n && t("p", { children: n }),
      ],
    }),
  });
}
function ko({ game: e, onOpen: s, compact: n = !1 }) {
  const r = ["main", "kit", "boards", "stadium"],
    c = r.filter((y) => !!_e(e, y)).length,
    i = Le(e).reduce((y, f) => y + f.weeklyPay, 0),
    d = pe(e).expectedAttendance,
    u = (y) =>
      e.sponsorOffers.filter(
        (f) =>
          f.slot === y &&
          e.reputation >= f.minReputation &&
          d >= f.minAttendance,
      ),
    g = (y) => {
      const f = e.sponsorOffers.filter((w) => w.slot === y);
      if (!f.length) return "Ingen tilbud n\xE5";
      const N = [...f].sort(
        (w, v) =>
          Math.max(0, w.minReputation - e.reputation) +
          Math.max(0, w.minAttendance - d) / 100 -
          (Math.max(0, v.minReputation - e.reputation) +
            Math.max(0, v.minAttendance - d) / 100),
      )[0];
      return e.reputation < N.minReputation
        ? `Krever profil ${N.minReputation}`
        : d < N.minAttendance
          ? `Krever ${Z(N.minAttendance)} publikum`
          : "Tilbud klart";
    },
    k = r.filter((y) => Xe(e, y) && !_e(e, y) && u(y).length > 0);
  return n
    ? a("button", {
        className: "sponsor-ribbon-compact",
        onClick: () => s(),
        children: [
          t(_, { name: "sponsor" }),
          t("strong", { children: "Sponsorer" }),
          a("span", { children: [c, "/4 aktive \xB7 ", h(i), "/uke"] }),
          a("em", {
            children: [
              k.length
                ? `${we(k[0])}: tilbud klart`
                : c < 4
                  ? "Ingen nye avtaler klare"
                  : "Portef\xF8ljen er komplett",
              " \u2192",
            ],
          }),
        ],
      })
    : a("section", {
        className: "sponsor-ribbon",
        "aria-label": "Sponsorportef\xF8lje",
        children: [
          a("button", {
            className: "sponsor-ribbon-title",
            onClick: () => s(),
            children: [
              t(_, { name: "sponsor" }),
              a("span", {
                children: [
                  t("small", { children: "KOMMERSIELL PORTEF\xD8LJE" }),
                  t("strong", { children: "Sponsorer" }),
                ],
              }),
            ],
          }),
          r.map((y) => {
            const f = _e(e, y),
              N = Xe(e, y),
              w = f ? (f.breachWeeks ?? 0) > 0 : !1,
              v = f ? e.phase === "offseason" && (f.seasonsLeft ?? 1) <= 0 : !1,
              $ = u(y).length,
              D = N
                ? f
                  ? w
                    ? "Krav i fare"
                    : v
                      ? "Fornyelse klar"
                      : "Avtale aktiv"
                  : $
                    ? `${$} tilbud klar${$ === 1 ? "t" : "e"}`
                    : g(y)
                : "L\xE5st",
              q =
                f?.name ??
                (N ? ($ ? "Ledig plass" : "Ikke tilgjengelig enn\xE5") : la(y));
            return a(
              "button",
              {
                className: `sponsor-ribbon-slot ${w ? "risk" : v ? "renewal" : f ? "active" : $ ? "available" : "unavailable"}`,
                onClick: () => s(y),
                disabled: !N,
                children: [
                  t("small", { children: we(y) }),
                  t("strong", { children: q }),
                  a("span", {
                    children: [
                      f ? `${h(f.weeklyPay)}/uke` : D,
                      t("em", { children: D }),
                    ],
                  }),
                ],
              },
              y,
            );
          }),
        ],
      });
}
function vo({
  game: e,
  opponent: s,
  nextGame: n,
  recommendation: r,
  onContinue: c,
  onAutoPrepare: i,
  onBestLineup: d,
  onRest: u,
  onStart: g,
  onTab: k,
  onClaimMission: y,
  onClaimChallenge: f,
  onTactic: N,
  onTraining: w,
  onAction: v,
  onAutoSeason: $,
}) {
  const D = cn(e.weekStep),
    q = ds(e),
    x = Math.round(Ne(e).overall),
    R = e.roster.filter((O) => O.condition < 50).length,
    E = Gn(s),
    T = ha(e, s, n?.home ?? !0),
    Y = Ms(T),
    ae = Ne(e),
    W = Tn.filter((O) => !e.claimedMissions.includes(O.id)).length === 0,
    L = go(e).slice(0, 2),
    U = bo(e),
    G = e.season === 1 && Nt(e) < 2,
    re =
      qe(e) < 3
        ? Lt.filter((O) => ["clock", "balanced", "vertical"].includes(O.id))
        : Lt,
    he =
      qe(e) < 3
        ? Nn.filter((O) => ["balanced", "chemistry", "recovery"].includes(O.id))
        : Nn;
  return a(X, {
    children: [
      G &&
        a("section", {
          className: "first-session-briefing",
          children: [
            a("div", {
              className: "briefing-lead",
              children: [
                t("span", { children: t(_, { name: "target" }) }),
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: "F\xF8rste 15 minutter",
                    }),
                    t("h3", {
                      children:
                        "Bygg en kampklar klubb uten \xE5 miste kontrollen",
                    }),
                    t("p", {
                      children:
                        "Du trenger ikke \xE5pne alle menyene. F\xF8lg disse tre stegene, s\xE5 l\xE6rer du \xF8konomi, laguttak og kampflyt i riktig rekkef\xF8lge.",
                    }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "briefing-steps",
              children: [
                a("article", {
                  className:
                    e.roster.some((O) => O.captain) && Dt(e) ? "done" : "",
                  children: [
                    t("b", { children: "1" }),
                    a("div", {
                      children: [
                        t("strong", { children: "Gj\xF8r laget klart" }),
                        t("span", {
                          children:
                            "Velg kaptein og fyll alle posisjoner. Et ubalansert lag taper oftere.",
                        }),
                      ],
                    }),
                    t("button", {
                      onClick: () => k("team"),
                      children: "\xC5pne laget",
                    }),
                  ],
                }),
                a("article", {
                  className: e.activeSponsor ? "done" : "",
                  children: [
                    t("b", { children: "2" }),
                    a("div", {
                      children: [
                        t("strong", { children: "Beskytt \xF8konomien" }),
                        t("span", {
                          children:
                            "Sponsor \xE5pnes etter f\xF8rste kamp eller ved 100 supportere. Du m\xE5 sammenligne krav og forhandle avtalen.",
                        }),
                      ],
                    }),
                    t("button", {
                      onClick: () => k("finance"),
                      children: "Se \xF8konomi",
                    }),
                  ],
                }),
                a("article", {
                  className: Nt(e) > 0 ? "done" : "",
                  children: [
                    t("b", { children: "3" }),
                    a("div", {
                      children: [
                        t("strong", { children: "Spill f\xF8rste kamp" }),
                        t("span", {
                          children:
                            "Trening, condition og lagstyrke p\xE5virker oddsen \u2013 resultatet er aldri garantert.",
                        }),
                      ],
                    }),
                    t("button", { onClick: i, children: "Gj\xF8r kampklar" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      a("section", {
        className: "v18-command-deck",
        children: [
          a("article", {
            className: "v18-week-card",
            children: [
              a("div", {
                className: "v18-card-head",
                children: [
                  a("div", {
                    children: [
                      a("p", {
                        className: "eyebrow",
                        children: [q.name, " \xB7 S", e.season, " U", e.week],
                      }),
                      t("h2", { children: D.title }),
                    ],
                  }),
                  a("span", { children: [e.weekStep + 1, "/4"] }),
                ],
              }),
              t("p", { children: D.text }),
              t("div", {
                className: "v18-week-track",
                children: ["Plan", "Trening", "Laguttak", "Kamp"].map((O, Q) =>
                  a(
                    "div",
                    {
                      className: Q <= e.weekStep ? "done" : "",
                      children: [
                        t("i", { children: Q < e.weekStep ? "\u2713" : Q + 1 }),
                        t("span", { children: O }),
                      ],
                    },
                    O,
                  ),
                ),
              }),
              a("div", {
                className: "hero-buttons",
                children: [
                  t("button", {
                    className: "primary-button big",
                    onClick: c,
                    children:
                      e.weekStep >= 3
                        ? "Start kamp \u2192"
                        : "Neste steg \u2192",
                  }),
                  e.weekStep < 3 &&
                    a("button", {
                      className: "soft-button",
                      onClick: i,
                      children: [
                        t(_, { name: "wand", size: 17 }),
                        " Gj\xF8r kampklar",
                      ],
                    }),
                ],
              }),
            ],
          }),
          a("article", {
            className: `v18-match-card ${s.name === e.profile.rivalName ? "rival-match" : ""}`,
            children: [
              a("div", {
                className: "v18-card-head",
                children: [
                  a("div", {
                    children: [
                      a("p", {
                        className: "eyebrow",
                        children: [
                          "Neste kamp \xB7 ",
                          n?.home ? "hjemme" : "borte",
                          s.name === e.profile.rivalName
                            ? " \xB7 RIVALOPPGJ\xD8R"
                            : "",
                        ],
                      }),
                      a("h3", { children: [s.logo, " ", s.name] }),
                    ],
                  }),
                  t("span", { className: "matchup-category", children: Y }),
                ],
              }),
              a("div", {
                className: "v18-matchup",
                children: [
                  a("div", {
                    children: [
                      t("strong", { children: x }),
                      t("span", { children: "Din OVR" }),
                    ],
                  }),
                  t("b", { children: "VS" }),
                  a("div", {
                    children: [
                      t("strong", { children: Math.round(E.overall) }),
                      t("span", { children: "Motstander" }),
                    ],
                  }),
                ],
              }),
              a("div", {
                className: "v18-intel-grid",
                children: [
                  a("span", {
                    children: [
                      "Vinnersjanse ",
                      a("b", { children: [Math.round(T * 100), "%"] }),
                    ],
                  }),
                  a("span", {
                    children: [
                      "Condition ",
                      a("b", { children: [Math.round(ae.stamina), "%"] }),
                    ],
                  }),
                  a("span", {
                    children: [
                      "Kjemi ",
                      a("b", { children: [Math.round(ae.chemistry), "%"] }),
                    ],
                  }),
                ],
              }),
              a("div", {
                className: "fixture-actions",
                children: [
                  t("button", {
                    className: "primary-button",
                    onClick: () => g("live"),
                    children: "Direkte",
                  }),
                  t("button", {
                    onClick: () => g("highlights"),
                    children: "H\xF8ydepunkter",
                  }),
                  t("button", {
                    onClick: () => g("fast"),
                    children: "Hurtigsim",
                  }),
                  t("button", {
                    onClick: () => g("instant"),
                    children: "\xD8yeblikkelig",
                  }),
                ],
              }),
            ],
          }),
          a("article", {
            className: "v18-autopilot-card",
            children: [
              a("div", {
                className: "v18-card-head",
                children: [
                  a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Sesongassistent",
                      }),
                      t("h3", { children: "La klubben g\xE5 fremover" }),
                    ],
                  }),
                  t(_, { name: "wand" }),
                ],
              }),
              t("p", {
                children:
                  "Assistenten setter lag, velger trygg trening og simulerer vanlige uker. Du f\xE5r rapport og kan stoppe ved viktige hendelser.",
              }),
              a("div", {
                className: "v18-auto-facts",
                children: [
                  a("span", {
                    children: [
                      "Serie ",
                      a("b", { children: [e.wins, "-", e.losses] }),
                    ],
                  }),
                  a("span", {
                    children: [
                      "Gjenst\xE5r ",
                      t("b", { children: Math.max(0, oe - e.week + 1) }),
                    ],
                  }),
                  a("span", {
                    children: [
                      "Prognose ",
                      a("b", {
                        className: pe(e).profit >= 0 ? "positive" : "negative",
                        children: [
                          pe(e).profit >= 0 ? "+" : "",
                          h(pe(e).profit),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              t("button", {
                className: "primary-button",
                onClick: $,
                children: "\xC5pne auto-manager \u2192",
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "management-overview-grid v18-management-grid",
        children: [
          a("div", {
            className: "action-center-panel",
            children: [
              a("div", {
                className: "section-heading",
                children: [
                  a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Prioriteringer",
                      }),
                      t("h3", { children: "Det som gir mest effekt n\xE5" }),
                    ],
                  }),
                  t("b", { children: Math.max(3, L.length) }),
                ],
              }),
              t("div", {
                className: "action-center-list",
                children: L.length
                  ? L.map((O) =>
                      a(
                        "button",
                        {
                          className: `action-item ${O.priority}`,
                          onClick: () => v(O),
                          children: [
                            t("span", {
                              className: "action-icon",
                              children: t(_, { name: O.icon }),
                            }),
                            a("div", {
                              children: [
                                t("strong", { children: O.title }),
                                t("small", { children: O.detail }),
                              ],
                            }),
                            a("em", { children: [O.action, " \u2192"] }),
                          ],
                        },
                        O.id,
                      ),
                    )
                  : a(X, {
                      children: [
                        a("button", {
                          className: "action-item low",
                          onClick: i,
                          children: [
                            t("span", {
                              className: "action-icon",
                              children: t(_, { name: "wand" }),
                            }),
                            a("div", {
                              children: [
                                t("strong", {
                                  children: "Gj\xF8r laget kampklart",
                                }),
                                t("small", {
                                  children: R
                                    ? `${R} spillere trenger restitusjon f\xF8r kampen.`
                                    : "Assistenten kan sette beste lag og fullf\xF8re ukeplanen.",
                                }),
                              ],
                            }),
                            t("em", { children: "Forbered \u2192" }),
                          ],
                        }),
                        a("button", {
                          className: "action-item low",
                          onClick: () => k("finance"),
                          children: [
                            t("span", {
                              className: "action-icon",
                              children: t(_, { name: "finance" }),
                            }),
                            a("div", {
                              children: [
                                t("strong", {
                                  children: "Beskytt sesong\xF8konomien",
                                }),
                                a("small", {
                                  children: [
                                    "Forventet ukesresultat er ",
                                    pe(e).profit >= 0 ? "+" : "",
                                    h(pe(e).profit),
                                    ".",
                                  ],
                                }),
                              ],
                            }),
                            t("em", { children: "\xD8konomi \u2192" }),
                          ],
                        }),
                        a("button", {
                          className: "action-item low",
                          onClick: $,
                          children: [
                            t("span", {
                              className: "action-icon",
                              children: t(_, { name: "season" }),
                            }),
                            a("div", {
                              children: [
                                t("strong", {
                                  children:
                                    "Kj\xF8r frem til neste h\xF8ydepunkt",
                                }),
                                t("small", {
                                  children:
                                    "Hopp over rutineukene og stopp ved et viktig valg.",
                                }),
                              ],
                            }),
                            t("em", { children: "Auto \u2192" }),
                          ],
                        }),
                      ],
                    }),
              }),
            ],
          }),
          a("div", {
            className: "timeline-panel",
            children: [
              a("div", {
                className: "section-heading",
                children: [
                  a("div", {
                    children: [
                      t("p", { className: "eyebrow", children: "Sesongradar" }),
                      t("h3", { children: "Dette kommer" }),
                    ],
                  }),
                  t(_, { name: "calendar" }),
                ],
              }),
              t("div", {
                className: "club-timeline",
                children: U.map((O) =>
                  a(
                    "div",
                    {
                      className: O.urgent ? "urgent" : "",
                      children: [
                        t("i", {}),
                        t("span", { children: O.label }),
                        a("div", {
                          children: [
                            t("strong", { children: O.title }),
                            t("small", { children: O.detail }),
                          ],
                        }),
                      ],
                    },
                    O.id,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "quick-actions-section",
        children: [
          a("div", {
            className: "section-heading",
            children: [
              a("div", {
                children: [
                  t("p", { className: "eyebrow", children: "Quick actions" }),
                  t("h3", { children: "Gj\xF8r det viktigste med ett trykk" }),
                ],
              }),
              t("span", {
                children:
                  e.settings.assistance === "easy"
                    ? "Enkel modus aktiv"
                    : "Manager-modus",
              }),
            ],
          }),
          a("div", {
            className: "quick-actions-grid",
            children: [
              a("button", {
                onClick: () => d("opponent"),
                children: [
                  t("span", { children: t(_, { name: "wand" }) }),
                  t("strong", { children: "Velg beste lag" }),
                  a("small", { children: ["Tilpasset ", s.name] }),
                ],
              }),
              a("button", {
                onClick: u,
                children: [
                  t("span", { children: t(_, { name: "leaf" }) }),
                  t("strong", { children: "Hvil laget" }),
                  t("small", {
                    children: R
                      ? `${R} slitne spillere`
                      : "Laget ser friskt ut",
                  }),
                ],
              }),
              a("button", {
                onClick: () => k("team"),
                children: [
                  t("span", { children: t(_, { name: "team" }) }),
                  t("strong", { children: "Se oppstillingen" }),
                  t("small", { children: "Startere, kaptein og l\xE5ser" }),
                ],
              }),
              a("button", {
                onClick: () => k("finance"),
                children: [
                  t("span", { children: t(_, { name: "finance" }) }),
                  t("strong", { children: "Sjekk \xF8konomien" }),
                  a("small", { children: [h(e.cash), " tilgjengelig"] }),
                ],
              }),
            ],
          }),
        ],
      }),
      !W &&
        a("section", {
          className: "mission-panel",
          children: [
            a("div", {
              className: "section-heading",
              children: [
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: "Klubbens f\xF8rste reise",
                    }),
                    t("h3", { children: "L\xE6r spillet mens klubben vokser" }),
                  ],
                }),
                a("b", {
                  children: [e.claimedMissions.length, "/", Tn.length],
                }),
              ],
            }),
            t("div", {
              className: "mission-list",
              children: Tn.map((O) => {
                const Q = us(e, O.id),
                  De = e.claimedMissions.includes(O.id);
                return a(
                  "article",
                  {
                    className: `${Q ? "complete" : ""} ${De ? "claimed" : ""}`,
                    children: [
                      t("i", { children: De ? "\u2713" : Q ? "!" : "\u25CB" }),
                      a("div", {
                        children: [
                          t("strong", { children: O.title }),
                          t("span", { children: O.text }),
                        ],
                      }),
                      t("button", {
                        onClick: () => y(O.id),
                        disabled: !Q || De,
                        children: De
                          ? "Hentet"
                          : Q
                            ? `Hent ${h(O.reward)}`
                            : h(O.reward),
                      }),
                    ],
                  },
                  O.id,
                );
              }),
            }),
          ],
        }),
      a("section", {
        className: "simple-card home-challenge-card",
        children: [
          a("div", {
            className: "section-heading",
            children: [
              a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Ukentlig utfordring",
                  }),
                  t("h3", { children: e.weeklyChallenge.title }),
                ],
              }),
              t(_, { name: "target" }),
            ],
          }),
          a("div", {
            className: "challenge-progress",
            children: [
              t("div", {
                children: t("span", {
                  style: {
                    width: `${b((e.weeklyChallenge.progress / e.weeklyChallenge.target) * 100, 0, 100)}%`,
                  },
                }),
              }),
              a("small", {
                children: [
                  Z(e.weeklyChallenge.progress),
                  " / ",
                  Z(e.weeklyChallenge.target),
                ],
              }),
            ],
          }),
          t("button", {
            className: "soft-button",
            onClick: f,
            disabled:
              e.weeklyChallenge.claimed ||
              e.weeklyChallenge.progress < e.weeklyChallenge.target,
            children: e.weeklyChallenge.claimed
              ? "Bel\xF8nning hentet"
              : `Hent ${h(e.weeklyChallenge.reward)}`,
          }),
        ],
      }),
      a("details", {
        className: "prep-drawer",
        children: [
          a("summary", {
            children: [
              a("span", {
                children: [
                  t(_, { name: "tactics", size: 17 }),
                  " Kampforberedelser",
                ],
              }),
              a("small", {
                children: [
                  Lt.find((O) => O.id === e.selectedTactic)?.name,
                  " \xB7 ",
                  Nn.find((O) => O.id === e.trainingPlan)?.name,
                ],
              }),
            ],
          }),
          a("div", {
            className: "prep-content",
            children: [
              t("h3", { children: "Taktikk" }),
              t("div", {
                className: "tactic-grid compact-grid",
                children: re.map((O) =>
                  a(
                    "button",
                    {
                      className: e.selectedTactic === O.id ? "selected" : "",
                      onClick: () => N(O.id),
                      children: [
                        a("strong", { children: [O.emoji, " ", O.name] }),
                        t("span", { children: O.description }),
                      ],
                    },
                    O.id,
                  ),
                ),
              }),
              t("h3", { children: "Ukeplan" }),
              t("div", {
                className: "training-grid compact-grid",
                children: he.map((O) =>
                  a(
                    "button",
                    {
                      className: e.trainingPlan === O.id ? "selected" : "",
                      onClick: () => w(O.id),
                      children: [
                        a("strong", { children: [O.emoji, " ", O.name] }),
                        t("span", { children: O.description }),
                      ],
                    },
                    O.id,
                  ),
                ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function yo({ game: e }) {
  const s = ds(e),
    n =
      s.level === 1
        ? 0
        : s.level === 2
          ? 100
          : s.level === 3
            ? 1e3
            : s.level === 4
              ? 5e3
              : 25e3,
    r = s.next,
    c =
      s.level >= 5 ? 100 : b(((e.fans - n) / Math.max(1, r - n)) * 100, 0, 100);
  return a("section", {
    className: "club-level-card",
    children: [
      a("div", {
        children: [
          t("span", { children: t(_, { name: "building" }) }),
          a("div", {
            children: [
              a("p", {
                className: "eyebrow",
                children: [
                  "Klubbniv\xE5 ",
                  s.level,
                  "/5 \xB7 ikke liganiv\xE5",
                ],
              }),
              t("h3", { children: s.name }),
            ],
          }),
        ],
      }),
      t("p", { children: s.text }),
      t("div", {
        className: "level-progress",
        children: t("i", { style: { width: `${c}%` } }),
      }),
      t("small", {
        children:
          s.level >= 5
            ? "Maksniv\xE5 n\xE5dd"
            : `${Z(e.fans)} / ${Z(r)} supportere`,
      }),
    ],
  });
}
function So({ game: e, feature: s }) {
  const n = Tr[s];
  return a("section", {
    className: "locked-feature",
    children: [
      t("span", { children: n.icon }),
      t("p", { className: "eyebrow", children: "Ikke l\xE5st opp enn\xE5" }),
      t("h2", { children: n.name }),
      t("p", { children: n.hint }),
      t(yo, { game: e }),
    ],
  });
}
function wo({
  game: e,
  capacity: s,
  onProject: n,
  onMoveBase: r,
  onStaff: c,
  onSystem: i,
  locked: d,
}) {
  const u = Qe(e),
    g = Vt(e, u),
    k = On(e, u, !0, "Klart", g),
    y = e.roster
      .filter((v) => v.injuryWeeks > 0)
      .sort((v, $) => $.injuryWeeks - v.injuryWeeks),
    f = Be(e.clubBase),
    N = _a.filter((v) => v.rank > f.rank),
    w = ["Sportslig", "Kampdag", "Kommersielt", "Organisasjon"];
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Klubbomr\xE5de og organisasjon",
        title: f.name,
        detail: `${Z(s)} kapasitet \xB7 ${h(f.weeklyRent)}/uke i leie og grunnkostnad \xB7 Klubbprofil ${Math.round(e.reputation)}`,
      }),
      a("section", {
        className: "club-base-hero",
        children: [
          t("div", { className: "club-base-icon", children: f.icon }),
          a("div", {
            children: [
              t("p", {
                className: "eyebrow",
                children: "N\xE5v\xE6rende base",
              }),
              t("h2", { children: f.name }),
              t("p", { children: f.description }),
              t("div", {
                className: "base-rights",
                children: f.rights.map((v) => t("span", { children: v }, v)),
              }),
            ],
          }),
          a("div", {
            className: "base-facts",
            children: [
              a("span", {
                children: ["Kapasitet ", t("b", { children: Z(f.capacity) })],
              }),
              a("span", {
                children: [
                  "Ukentlig leie ",
                  t("b", { children: h(f.weeklyRent) }),
                ],
              }),
              a("span", {
                children: [
                  "Utbyggingsrett ",
                  t("b", {
                    children:
                      f.rank >= 3
                        ? "Full"
                        : f.rank >= 2
                          ? "Avtalt"
                          : f.rank >= 1
                            ? "Begrenset"
                            : "Ingen",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "stadium-metrics-grid",
        children: [
          t(fe, {
            label: "Forventet publikum",
            value: Z(k.attendance),
            detail: `${Math.round(k.occupancy * 100)}% belegg`,
            highlight: !0,
          }),
          t(fe, {
            label: "Klubbprofil",
            value: `${Math.round(e.reputation)}/100`,
            detail: "Sponsorer og spillere",
          }),
          t(fe, {
            label: "Prosjektkapasitet",
            value: `${Ve(e).length}/${on(e)}`,
            detail: Ve(e).length
              ? `${Ve(e)
                  .map((v) => et(v.id).names[v.stage])
                  .join(", ")}`
              : "Ledig kapasitet",
          }),
          t(fe, {
            label: "Skadde",
            value: y.length.toString(),
            detail: y.length ? "I behandling" : "Troppen er skadefri",
          }),
        ],
      }),
      N.length > 0 &&
        a("section", {
          className: "base-market",
          children: [
            t("div", {
              className: "section-heading",
              children: a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Neste mulige lokaler",
                  }),
                  t("h3", {
                    children: "Flytt n\xE5r klubben har vokst inn i det",
                  }),
                  t("p", {
                    children:
                      "St\xF8rre base gir kapasitet og rettigheter, men h\xF8yere fast kostnad.",
                  }),
                ],
              }),
            }),
            t("div", {
              className: "base-option-grid",
              children: N.slice(0, 2).map((v) => {
                const $ = Yn(e, v.id);
                return a(
                  "article",
                  {
                    className: $ ? "eligible" : "",
                    children: [
                      a("header", {
                        children: [
                          t("span", { children: v.icon }),
                          a("div", {
                            children: [
                              t("strong", { children: v.name }),
                              t("small", { children: v.description }),
                            ],
                          }),
                        ],
                      }),
                      a("dl", {
                        children: [
                          a("div", {
                            children: [
                              t("dt", { children: "Etablering" }),
                              t("dd", { children: h(v.moveCost) }),
                            ],
                          }),
                          a("div", {
                            children: [
                              t("dt", { children: "Leie" }),
                              a("dd", { children: [h(v.weeklyRent), "/uke"] }),
                            ],
                          }),
                          a("div", {
                            children: [
                              t("dt", { children: "Kapasitet" }),
                              t("dd", { children: Z(v.capacity) }),
                            ],
                          }),
                        ],
                      }),
                      a("p", {
                        children: [
                          "Krav: ",
                          Z(v.minFans),
                          " supportere \xB7 profil ",
                          v.minProfile,
                          " \xB7 ",
                          le[v.minLeague].name,
                        ],
                      }),
                      t("button", {
                        onClick: () => r(v.id),
                        disabled: d || !$ || e.cash < v.moveCost,
                        children: $
                          ? e.cash < v.moveCost
                            ? "Mangler kapital"
                            : `Flytt til ${v.name}`
                          : "Krav ikke oppfylt",
                      }),
                    ],
                  },
                  v.id,
                );
              }),
            }),
          ],
        }),
      w.map((v) =>
        a(
          "section",
          {
            className: "development-category",
            children: [
              t("div", {
                className: "section-heading",
                children: a("div", {
                  children: [
                    t("p", { className: "eyebrow", children: v }),
                    t("h3", {
                      children:
                        v === "Kampdag"
                          ? "Arena og publikum"
                          : v === "Sportslig"
                            ? "Prestasjon og spillerutvikling"
                            : v === "Kommersielt"
                              ? "Salg, sponsor og supportere"
                              : "Ledelse og systemer",
                    }),
                  ],
                }),
              }),
              t("div", {
                className: "development-project-grid",
                children: Wa.filter(($) => $.category === v).map(($) => {
                  const D = e.completedProjects[$.id],
                    q = D >= 3,
                    x = q ? { ok: !0, reason: "" } : pa(e, $.id),
                    R = q ? 0 : Dn(e, $.id),
                    E = q ? 0 : ua(e, $.id),
                    T = q ? void 0 : bs(e, $.id),
                    Y = Ve(e).find((U) => U.id === $.id),
                    ae = !!Y,
                    B = Ve(e).length >= on(e),
                    W = Ve(e).some((U) => Ot(U.id) === Ot($.id)),
                    L = Be(fs(e, $.id));
                  return a(
                    "article",
                    {
                      className: `${x.ok ? "" : "locked"} ${ae ? "active" : ""} ${q ? "complete" : ""}`,
                      children: [
                        a("header", {
                          children: [
                            t("span", { children: $.icon }),
                            a("div", {
                              children: [
                                a("small", {
                                  children: [
                                    $.kind === "building"
                                      ? "Bygg"
                                      : $.kind === "department"
                                        ? "Avdeling"
                                        : "Program",
                                    " \xB7 trinn ",
                                    Math.min(D + 1, 3),
                                    "/3",
                                  ],
                                }),
                                t("h3", { children: $.names[Math.min(D, 2)] }),
                              ],
                            }),
                          ],
                        }),
                        t("p", { children: $.description }),
                        a("div", {
                          className: "project-benefit",
                          children: [
                            t("span", {
                              children: q ? "Oppn\xE5dd" : "Gir klubben",
                            }),
                            t("strong", {
                              children: $.benefits[Math.min(D, 2)],
                            }),
                          ],
                        }),
                        !q &&
                          T &&
                          a("div", {
                            className: "project-economy-lines",
                            children: [
                              a("span", {
                                children: [
                                  "Betal n\xE5 ",
                                  t("b", { children: h(R) }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  $.kind === "building"
                                    ? "Byggetid"
                                    : $.kind === "department"
                                      ? "Etablering"
                                      : "Implementering",
                                  " ",
                                  a("b", { children: [E, " uker"] }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  "Ny drift ",
                                  a("b", {
                                    children: ["+", h(T.weeklyDelta), "/uke"],
                                  }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  "Ukesresultat ",
                                  t("b", {
                                    className:
                                      pe(T.after).profit >= 0
                                        ? "positive"
                                        : "negative",
                                    children: h(pe(T.after).profit),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        !q &&
                          a("p", {
                            className: `project-base-requirement ${x.ok ? "ok" : ""}`,
                            children: [
                              "Krever: ",
                              L.name,
                              x.ok ? " \xB7 rettigheter p\xE5 plass" : "",
                            ],
                          }),
                        !x.ok &&
                          t("p", {
                            className: "project-lock-reason",
                            children: x.reason,
                          }),
                        t("button", {
                          onClick: () => n($.id),
                          disabled:
                            d || q || !x.ok || ae || B || W || e.cash < R,
                          children: q
                            ? "Fullf\xF8rt"
                            : ae
                              ? `${Y?.weeksLeft} uker igjen`
                              : B
                                ? "Prosjektkapasiteten er full"
                                : W
                                  ? "Prosjekt i samme kategori p\xE5g\xE5r"
                                  : x.ok
                                    ? `Start ${$.names[Math.min(D, 2)]}`
                                    : x.reason,
                        }),
                      ],
                    },
                    $.id,
                  );
                }),
              }),
            ],
          },
          v,
        ),
      ),
      a("section", {
        className: "staff-clarity-section",
        children: [
          t("div", {
            className: "section-heading",
            children: a("div", {
              children: [
                t("p", { className: "eyebrow", children: "Ansatte" }),
                t("h3", {
                  children: "Engangskostnad og ukel\xF8nn vises separat",
                }),
              ],
            }),
          }),
          t("div", {
            className: "staff-clarity-grid",
            children: sn.slice(0, 8).map((v) => {
              const $ = e.staff[v.id],
                D = ga(v.id, $),
                q = v.salary * ($ + 1);
              return a(
                "article",
                {
                  children: [
                    t("span", { children: v.emoji }),
                    a("div", {
                      children: [
                        t("strong", { children: v.name }),
                        t("small", { children: v.description }),
                      ],
                    }),
                    a("dl", {
                      children: [
                        a("div", {
                          children: [
                            t("dt", { children: "Betal n\xE5" }),
                            t("dd", { children: h(D) }),
                          ],
                        }),
                        a("div", {
                          children: [
                            t("dt", { children: "Ny ukel\xF8nn" }),
                            t("dd", { children: h(q) }),
                          ],
                        }),
                      ],
                    }),
                    t("button", {
                      onClick: () => c(v.id),
                      disabled: d || e.cash < D,
                      children: "Ansett / utvid team",
                    }),
                  ],
                },
                v.id,
              );
            }),
          }),
        ],
      }),
      a("details", {
        className: "legacy-facilities",
        children: [
          t("summary", { children: "Vis tekniske systeminvesteringer" }),
          t("div", {
            className: "system-investment-grid",
            children: Cn.map((v) => {
              const $ = e.systemInvestments[v.id],
                D = ba(v.id, $);
              return a(
                "article",
                {
                  children: [
                    t("h3", { children: v.name }),
                    t("p", { children: v.description }),
                    t("button", {
                      onClick: () => i(v.id),
                      disabled: d || $ >= 3 || e.cash < D,
                      children: $ >= 3 ? "Maksniv\xE5" : `Invester ${h(D)}`,
                    }),
                  ],
                },
                v.id,
              );
            }),
          }),
        ],
      }),
    ],
  });
}
function Vo({
  game: e,
  opponent: s,
  nextGame: n,
  recommendation: r,
  playoffChanceValue: c,
  onStart: i,
  onTactic: d,
  onTraining: u,
  onClaimChallenge: g,
}) {
  const k = Ne(e).overall,
    y = k - s.power,
    f =
      y > 10 ? "Du er favoritt" : y < -10 ? "T\xF8ff utfordring" : "Jevn kamp",
    N = e.schedule
      .filter((w) => w.played)
      .slice(-5)
      .map((w) => ((w.ourScore ?? 0) > (w.opponentScore ?? 0) ? "W" : "L"));
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Club HQ",
        title: `Uke ${e.week} \xB7 ${e.seasonStage === "regular" ? `Sesong ${e.season}` : e.seasonStage === "quarterfinal" ? "Kvartfinale" : e.seasonStage === "semifinal" ? "Semifinale" : e.seasonStage === "final" ? "Finale" : "Offseason"}`,
        detail: `${ao(e.profile.strategy)} \xB7 ${Ls(e.profile.managerRole)}`,
      }),
      a("section", {
        className: "command-center",
        children: [
          a("div", {
            className: "next-match-card",
            children: [
              a("div", {
                className: "match-clubs",
                children: [
                  a("div", {
                    className: "mini-club",
                    children: [
                      t("span", { children: e.profile.logo }),
                      t("strong", { children: e.profile.clubName }),
                      a("small", { children: ["Power ", Math.round(k)] }),
                    ],
                  }),
                  a("div", {
                    className: "versus-block",
                    children: [
                      t("b", { children: n?.home ? "HJEMME" : "BORTE" }),
                      t("strong", { children: "VS" }),
                      t("small", { children: f }),
                    ],
                  }),
                  a("div", {
                    className: "mini-club",
                    children: [
                      t("span", { children: s.logo }),
                      t("strong", { children: s.name }),
                      a("small", { children: ["Power ", Math.round(s.power)] }),
                    ],
                  }),
                ],
              }),
              a("div", {
                className: "opponent-report",
                children: [
                  a("div", {
                    children: [
                      t("span", { children: "Form" }),
                      t("b", {
                        children: N.length
                          ? N.map((w, v) =>
                              t(
                                "i",
                                {
                                  className: w === "W" ? "win" : "loss",
                                  children: w,
                                },
                                v,
                              ),
                            )
                          : "Ingen kamper",
                      }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "Sluttspillsjanse" }),
                      a("b", { children: [Math.round(c), "%"] }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "V\xE6rmelding" }),
                      t("b", { children: "Skiftende" }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "N\xF8kkel" }),
                      t("b", {
                        children:
                          y >= 0
                            ? "Kontroller tempoet"
                            : "Vinn momentum tidlig",
                      }),
                    ],
                  }),
                ],
              }),
              a("div", {
                className: "match-mode-grid",
                children: [
                  a("button", {
                    onClick: () => i("highlights"),
                    disabled: e.phase !== "club",
                    children: [
                      t("span", { children: "\u{1F3AC}" }),
                      t("strong", { children: "Se h\xF8ydepunkter" }),
                      t("small", { children: "30\u201345 sek \xB7 pausevalg" }),
                    ],
                  }),
                  a("button", {
                    onClick: () => i("fast"),
                    disabled: e.phase !== "club",
                    children: [
                      t("span", { children: "\u23E9" }),
                      t("strong", { children: "Hurtigsimulering" }),
                      t("small", { children: "Ca. 5\u201310 sek" }),
                    ],
                  }),
                  a("button", {
                    onClick: () => i("instant"),
                    disabled: e.phase !== "club",
                    children: [
                      t("span", { children: "\u26A1" }),
                      t("strong", { children: "\xD8yeblikkelig" }),
                      t("small", { children: "Resultat med \xE9n gang" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          a("aside", {
            className: "week-status",
            children: [
              t("p", { className: "eyebrow", children: "Manager brief" }),
              t("h3", { children: r.title }),
              t("p", { children: r.text }),
              a("div", {
                className: "status-line",
                children: [
                  t("span", { children: "Condition" }),
                  a("b", { children: [Math.round(Ne(e).stamina), "%"] }),
                ],
              }),
              a("div", {
                className: "status-line",
                children: [
                  t("span", { children: "Moral" }),
                  a("b", { children: [Math.round(Ne(e).morale), "%"] }),
                ],
              }),
              a("div", {
                className: "status-line",
                children: [
                  t("span", { children: "Kjemi" }),
                  a("b", { children: [Math.round(Ne(e).chemistry), "%"] }),
                ],
              }),
            ],
          }),
        ],
      }),
      t("h3", { className: "section-title", children: "Taktikk f\xF8r kamp" }),
      t("div", {
        className: "tactic-grid",
        children: Lt.map((w) =>
          a(
            "button",
            {
              className: e.selectedTactic === w.id ? "selected" : "",
              onClick: () => d(w.id),
              disabled: e.phase !== "club",
              children: [
                a("strong", { children: [w.emoji, " ", w.name] }),
                t("span", { children: w.description }),
              ],
            },
            w.id,
          ),
        ),
      }),
      t("h3", { className: "section-title", children: "Ukeplan" }),
      t("div", {
        className: "training-grid",
        children: Nn.map((w) =>
          a(
            "button",
            {
              className: e.trainingPlan === w.id ? "selected" : "",
              onClick: () => u(w.id),
              disabled: e.phase !== "club",
              children: [
                a("strong", { children: [w.emoji, " ", w.name] }),
                t("span", { children: w.description }),
              ],
            },
            w.id,
          ),
        ),
      }),
      a("section", {
        className: "challenge-card",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Ukentlig utfordring" }),
              t("h3", { children: e.weeklyChallenge.title }),
              a("p", {
                children: ["Bel\xF8nning: ", h(e.weeklyChallenge.reward)],
              }),
            ],
          }),
          a("div", {
            className: "challenge-progress",
            children: [
              t("div", {
                children: t("span", {
                  style: {
                    width: `${b((e.weeklyChallenge.progress / e.weeklyChallenge.target) * 100, 0, 100)}%`,
                  },
                }),
              }),
              a("small", {
                children: [
                  Z(e.weeklyChallenge.progress),
                  " / ",
                  Z(e.weeklyChallenge.target),
                ],
              }),
            ],
          }),
          t("button", {
            onClick: g,
            disabled:
              e.weeklyChallenge.claimed ||
              e.weeklyChallenge.progress < e.weeklyChallenge.target,
            children: e.weeklyChallenge.claimed
              ? "Hentet"
              : "Hent bel\xF8nning",
          }),
        ],
      }),
    ],
  });
}
function Mo({ game: e, speed: s, setSpeed: n }) {
  const r = e.match,
    c = ((r.totalTicks - r.ticksLeft) / r.totalTicks) * 100,
    i = Math.min(4, Math.floor(c / 25) + 1),
    d = c >= 100 ? 0 : Math.max(1, Math.ceil(15 * (1 - (c % 25) / 25))),
    u = topMatchPerformers(r.playerBox ?? {}, 3);
  return a("section", {
    className: "match-day",
    children: [
      a("div", {
        className: "match-day-header",
        children: [
          a("div", {
            children: [
              a("p", {
                className: "live-label",
                children: [t("span", {}), " LIVE \xB7 Q", i],
              }),
              t("h2", { children: r.bigMoment }),
              a("p", {
                children: [
                  Is(r.mode),
                  " \xB7 ",
                  r.weather,
                  " \xB7 ",
                  Z(r.attendance),
                  " tilskuere",
                ],
              }),
            ],
          }),
          t("div", {
            className: "speed-control",
            children: [0, 1, 2, 4].map((d) =>
              t(
                "button",
                {
                  className: s === d ? "active" : "",
                  onClick: () => n(d),
                  children: d === 0 ? "\u23F8" : `${d}\xD7`,
                },
                d,
              ),
            ),
          }),
        ],
      }),
      a("div", {
        className: "score-shell",
        children: [
          a("div", {
            className: "score-team user",
            children: [
              t("span", { children: e.profile.logo }),
              t("strong", { children: e.profile.clubName }),
              t("b", { children: r.homeScore }),
            ],
          }),
          a("div", {
            className: "game-clock",
            children: [
              a("span", { children: ["Q", i] }),
              a("strong", {
                children: [d, ":00"],
              }),
              t("small", {
                children:
                  r.possession === "home"
                    ? `${e.profile.clubName} har ballen`
                    : `${r.opponentName} har ballen`,
              }),
            ],
          }),
          a("div", {
            className: "score-team",
            children: [
              t("b", { children: r.awayScore }),
              t("strong", { children: r.opponentName }),
              t("span", {
                children:
                  e.leagueTeams.find((d) => d.id === r.opponentId)?.logo ??
                  "\u{1F3C8}",
              }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "match-grid",
        children: [
          a("div", {
            className: "field-visual",
            children: [
              t("div", {
                className: "field-end top",
                children: e.profile.clubName.toUpperCase(),
              }),
              [20, 40, 60, 80].map((d) =>
                t(
                  "div",
                  {
                    className: "yard-marker",
                    style: { top: `${d}%` },
                    children: t("span", { children: d <= 50 ? d : 100 - d }),
                  },
                  d,
                ),
              ),
              t("div", { className: "field-logo", children: e.profile.logo }),
              t("div", {
                className: `ball-marker ${r.possession}`,
                children: "\u{1F3C8}",
              }),
              t("div", {
                className: "player-dots home-dots",
                children: [1, 2, 3, 4, 5].map((d) => t("i", {}, d)),
              }),
              t("div", {
                className: "player-dots away-dots",
                children: [1, 2, 3, 4, 5].map((d) => t("i", {}, d)),
              }),
              t("div", {
                className: "field-end bottom",
                children: ln(e).toUpperCase(),
              }),
            ],
          }),
          a("div", {
            className: "match-feed",
            children: [
              t("h3", { children: "H\xF8ydepunkter" }),
              r.eventLog.map((d, u) =>
                t(
                  "p",
                  { className: u === 0 ? "latest" : "", children: d },
                  `${d}-${u}`,
                ),
              ),
            ],
          }),
        ],
      }),
      a("div", {
        className: "momentum",
        children: [
          t("span", { children: e.profile.clubName }),
          t("div", {
            children: t("i", {
              style: { left: `${b((r.momentum + 100) / 2, 0, 100)}%` },
            }),
          }),
          t("span", { children: r.opponentName }),
        ],
      }),
      a("div", {
        className: "live-stat-strip",
        children: [
          ["Yards", r.teamStats?.totalYards ?? 0],
          ["First downs", r.teamStats?.firstDowns ?? 0],
          ["Balltap", r.teamStats?.turnovers ?? 0],
          ["Defensive stopp", r.teamStats?.defensiveStops ?? 0],
        ].map(([d, u]) =>
          a(
            "article",
            {
              children: [
                t("span", { children: d }),
                t("strong", { children: u }),
              ],
            },
            d,
          ),
        ),
      }),
      u.length > 0 &&
        a("section", {
          className: "live-player-leaders",
          children: [
            t("h3", { children: "Spillere som preger kampen" }),
            a("div", {
              children: u.map((d) =>
                a(
                  "article",
                  {
                    children: [
                      t("b", { children: d.position }),
                      t("strong", { children: d.name }),
                      a("small", {
                        children: [
                          d.passingYards || d.receivingYards || d.rushingYards
                            ? `${d.passingYards + d.receivingYards + d.rushingYards} yards`
                            : `${d.tackles} taklinger`,
                          " \xB7 rating ",
                          d.rating,
                        ],
                      }),
                    ],
                  },
                  d.playerId,
                ),
              ),
            }),
          ],
        }),
      t("div", {
        className: "match-progress",
        children: t("span", { style: { width: `${c}%` } }),
      }),
      t("p", {
        className: "locked-message",
        children:
          "\u{1F512} Transfers, fasiliteter og laguttak \xE5pnes igjen etter sluttsignalet.",
      }),
    ],
  });
}
function No({ game: e, onChoose: s }) {
  const n = e.match,
    r = n.decisionType === "late";
  return a("section", {
    className: "halftime-panel",
    children: [
      t("p", {
        className: "eyebrow",
        children: r ? "Avgj\xF8rende sluttfase" : "Pauseavgj\xF8relse",
      }),
      a("h2", {
        children: [
          e.profile.clubName,
          " ",
          n.homeScore,
          "\u2013",
          n.awayScore,
          " ",
          n.opponentName,
        ],
      }),
      t("p", {
        children: r
          ? "Fjerde quarter starter. Velg hvordan laget skal angripe sluttminuttene."
          : "Du f\xE5r \xE9n tydelig pausejustering. Valget p\xE5virker andre omgang.",
      }),
      a("div", {
        className: "halftime-grid",
        children: [
          a("button", {
            onClick: () => s("attack"),
            children: [
              t("strong", {
                children: r
                  ? "\u{1F525} Jakt avgj\xF8relsen"
                  : "\u{1F525} G\xE5 offensivt",
              }),
              t("span", {
                children: r
                  ? "+7% angrep \xB7 \xE5pner bakover"
                  : "+9% angrep \xB7 mer risiko",
              }),
            ],
          }),
          a("button", {
            onClick: () => s("defense"),
            children: [
              t("strong", {
                children: r
                  ? "\u{1F6E1}\uFE0F Kontroller klokken"
                  : "\u{1F6E1}\uFE0F Beskytt resultatet",
              }),
              t("span", {
                children: r
                  ? "+7% forsvar \xB7 tryggere spill"
                  : "+9% forsvar \xB7 f\xE6rre store spill",
              }),
            ],
          }),
          a("button", {
            onClick: () => s("motivate"),
            children: [
              t("strong", {
                children: r
                  ? "\u{1F4E3} Tenn comebackgnisten"
                  : "\u{1F4E3} Motiver laget",
              }),
              t("span", {
                children: r
                  ? "St\xF8rre effekt n\xE5r momentum er imot"
                  : "Liten bonus p\xE5 begge sider",
              }),
            ],
          }),
          a("button", {
            onClick: () => s("protect"),
            children: [
              t("strong", { children: "\u{1F33F} Beskytt n\xF8kkelspillere" }),
              t("span", {
                children: "Mer stamina \xB7 klart lavere skaderisiko",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Co({ report: e, onContinue: s }) {
  const n =
      e.finance.tickets +
      e.finance.vip +
      e.finance.food +
      e.finance.merch +
      e.finance.sponsor +
      e.finance.sponsorBonus +
      e.finance.tv,
    r =
      e.finance.salaries +
      e.finance.staff +
      e.finance.maintenance +
      e.finance.matchOps +
      (e.finance.debtService ?? 0),
    c = e.capacity ?? Math.max(e.attendance, 1),
    i = e.occupancy ?? e.attendance / Math.max(1, c),
    d = Gr(e),
    u = e.scoreLine.match(/^(.*?)\s(\d+)–(\d+)\s(.*)$/),
    g = u?.[1] ?? "Din klubb",
    k = u?.[2] ?? "",
    y = u?.[3] ?? "",
    f = u?.[4] ?? "",
    N = (w) =>
      w.position === "QB"
        ? `${w.passingYards} pasningsyards \xB7 ${w.passingTouchdowns} TD`
        : w.position === "RB"
          ? `${w.rushingYards} l\xF8psyards \xB7 ${w.rushingTouchdowns} TD`
          : ["WR", "TE"].includes(w.position)
            ? `${w.receptions} mottak \xB7 ${w.receivingYards} yards \xB7 ${w.receivingTouchdowns} TD`
            : ["DL", "LB", "CB", "S"].includes(w.position)
              ? `${w.tackles} taklinger \xB7 ${w.sacks} sacks \xB7 ${w.interceptions} INT`
              : w.position === "K"
                ? `${w.fieldGoals} field goals`
                : `${w.rating} rating`;
  return a("section", {
    className: `report-card v20-match-report ${e.won ? "won" : "lost"}`,
    children: [
      a("header", {
        className: "match-report-hero",
        children: [
          a("div", {
            children: [
              a("p", {
                className: "eyebrow",
                children: ["Kamprapport \xB7 ", d],
              }),
              a("div", {
                className: "match-report-score",
                children: [
                  t("span", { children: g }),
                  a("strong", {
                    children: [k, t("i", { children: "\u2013" }), y],
                  }),
                  t("span", { children: f }),
                ],
              }),
              t("p", {
                children:
                  e.matchSummary ??
                  "Kampen ble avgjort i de viktigste situasjonene.",
              }),
            ],
          }),
          a("div", {
            className: `result-seal ${e.won ? "won" : "lost"}`,
            children: [
              t("b", { children: e.won ? "SEIER" : "TAP" }),
              t("span", { children: e.home === !1 ? "Borte" : "Hjemme" }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "match-impact-strip",
        children: [
          a("article", {
            children: [
              t("span", { children: "Kampens spiller" }),
              t("strong", { children: e.mvp }),
              t("small", { children: e.mvpTeam ?? "MVP" }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "Publikum" }),
              t("strong", { children: Z(e.attendance) }),
              a("small", { children: [Math.round(i * 100), "% belegg"] }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "Supportere" }),
              a("strong", {
                className: e.fansChange >= 0 ? "positive" : "negative",
                children: [e.fansChange >= 0 ? "+" : "", Z(e.fansChange)],
              }),
              a("small", {
                children: [
                  "Tilfredshet ",
                  e.fanSatisfactionChange >= 0 ? "+" : "",
                  e.fanSatisfactionChange,
                ],
              }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "Kamp\xF8konomi" }),
              a("strong", {
                className: e.finance.profit >= 0 ? "positive" : "negative",
                children: [
                  e.finance.profit >= 0 ? "+" : "",
                  h(e.finance.profit),
                ],
              }),
              a("small", { children: [h(n), " inn \xB7 ", h(r), " ut"] }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "match-report-conclusion",
        children: [
          t(_, { name: e.won ? "check" : "alert" }),
          a("div", {
            children: [
              t("strong", { children: "Hva avgjorde kampen" }),
              t("p", {
                children:
                  e.notes.filter(Boolean).join(" \xB7 ") ||
                  "Ingen alvorlige hendelser etter kampen.",
              }),
            ],
          }),
        ],
      }),
      e.playerStats?.length > 0 &&
        a("section", {
          className: "match-player-boxscore",
          children: [
            t("div", {
              className: "section-heading",
              children: a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Player box score",
                  }),
                  t("h3", { children: "Spillerne som avgjorde kampen" }),
                ],
              }),
            }),
            a("div", {
              children: e.playerStats.slice(0, 5).map((w, v) =>
                a(
                  "article",
                  {
                    className: v === 0 ? "mvp" : "",
                    children: [
                      t("b", { children: w.position }),
                      a("div", {
                        children: [
                          t("strong", { children: w.name }),
                          t("small", { children: N(w) }),
                        ],
                      }),
                      t("span", { children: v === 0 ? "MVP" : w.rating }),
                    ],
                  },
                  w.playerId,
                ),
              ),
            }),
          ],
        }),
      a("details", {
        className: "report-details-drawer",
        children: [
          a("summary", {
            children: [
              t("span", { children: "\xC5pne full kampanalyse" }),
              t("small", {
                children: "\xD8konomi, supporterreaksjon og n\xF8kkeltall",
              }),
            ],
          }),
          t("div", {
            className: "report-details-content",
            children: a("div", {
              className: "report-columns compact-report-columns",
              children: [
                a("div", {
                  className: "report-finance-card",
                  children: [
                    a("header", {
                      children: [
                        t("h3", { children: "Inntekter" }),
                        a("strong", {
                          className: "positive",
                          children: ["+", h(n)],
                        }),
                      ],
                    }),
                    t(Pe, {
                      label: "Billetter og VIP",
                      value: e.finance.tickets + e.finance.vip,
                      positive: !0,
                    }),
                    t(Pe, {
                      label: "Mat og merch",
                      value: e.finance.food + e.finance.merch,
                      positive: !0,
                    }),
                    t(Pe, {
                      label: "Sponsor og medier",
                      value:
                        e.finance.sponsor +
                        e.finance.sponsorBonus +
                        e.finance.tv,
                      positive: !0,
                    }),
                  ],
                }),
                a("div", {
                  className: "report-finance-card",
                  children: [
                    a("header", {
                      children: [
                        t("h3", { children: "Kostnader" }),
                        a("strong", {
                          className: "negative",
                          children: ["-", h(r)],
                        }),
                      ],
                    }),
                    t(Pe, {
                      label: "Spillerl\xF8nn",
                      value: e.finance.salaries,
                      expense: !0,
                    }),
                    t(Pe, {
                      label: "Ansatte og vedlikehold",
                      value: e.finance.staff + e.finance.maintenance,
                      expense: !0,
                    }),
                    t(Pe, {
                      label: "Kampdrift",
                      value: e.finance.matchOps,
                      expense: !0,
                    }),
                    (e.finance.debtService ?? 0) > 0 &&
                      t(Pe, {
                        label: `Avdrag og renter${e.finance.loanInterest ? ` (${h(e.finance.loanInterest)} renter)` : ""}`,
                        value: e.finance.debtService,
                        expense: !0,
                      }),
                  ],
                }),
                a("div", {
                  className: "report-consequences",
                  children: [
                    a("header", {
                      children: [
                        t("h3", { children: "Konsekvenser" }),
                        t(_, { name: "chart" }),
                      ],
                    }),
                    a("p", {
                      children: [
                        "Klubbprofil: ",
                        e.reputationChange >= 0 ? "+" : "",
                        e.reputationChange,
                      ],
                    }),
                    a("p", {
                      children: [
                        "Styre: ",
                        e.boardChange >= 0 ? "+" : "",
                        e.boardChange,
                      ],
                    }),
                    a("p", {
                      children: [
                        e.mediaPayout?.format ?? "Medier",
                        ": ",
                        Z(e.tvAudience ?? 0),
                        " seere/lyttere",
                      ],
                    }),
                    e.mediaPayout &&
                      a("p", {
                        children: [
                          h(e.mediaPayout.fixedFee),
                          " fast + ",
                          h(e.mediaPayout.cpmRevenue),
                          " ved ",
                          e.mediaPayout.cpm,
                          " CPM",
                        ],
                      }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
      a("footer", {
        className: "report-sticky-continue",
        children: [
          a("div", {
            children: [
              t("strong", {
                children: "Rapporten er lagret i sesonghistorikken",
              }),
              t("span", {
                children:
                  "Neste steg g\xE5r tilbake til klubbuken eller postseason.",
              }),
            ],
          }),
          t("button", {
            className: "primary-button",
            onClick: s,
            children: "Fortsett \u2192",
          }),
        ],
      }),
    ],
  });
}
function Eo({ game: e, onTab: s }) {
  const n = e.history[e.history.length - 1],
    r = rn(e);
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Season review",
        title: `Sesong ${e.season} er ferdig`,
        detail: e.playoffBracket?.championName
          ? `Mester: ${e.playoffBracket.championName}`
          : "Postseason fullf\xF8rt",
      }),
      a("div", {
        className: "offseason-review-grid",
        children: [
          t(fe, {
            label: "Resultat",
            value: n?.result ?? "Fullf\xF8rt",
            detail: n?.record ?? `${e.wins}-${e.losses}`,
            highlight: !0,
          }),
          t(fe, {
            label: "Driftsresultat",
            value: h(n?.profit ?? 0),
            detail: "Hele sesongen",
          }),
          t(fe, {
            label: "\xC5rets spiller",
            value: n?.bestPlayer ?? "\u2014",
            detail: "Klubbens MVP",
          }),
          t(fe, {
            label: "Cap space",
            value: h(r.space),
            detail: `${e.roster.length} spillere`,
          }),
        ],
      }),
      t(Ks, { game: e, standings: ft(e) }),
      a("section", {
        className: "quick-actions-section",
        children: [
          a("div", {
            className: "section-heading",
            children: [
              a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Offseason actions",
                  }),
                  t("h3", { children: "Bygg neste sesongs lag" }),
                ],
              }),
              t("span", { children: "Ingen ny sesong starter automatisk" }),
            ],
          }),
          a("div", {
            className: "quick-actions-grid",
            children: [
              a("button", {
                onClick: () => s("team"),
                children: [
                  t("span", { children: "\u270D\uFE0F" }),
                  t("strong", { children: "Kontrakter" }),
                  a("small", { children: [wt(e).length, " utl\xF8pte"] }),
                ],
              }),
              a("button", {
                onClick: () => s("market"),
                children: [
                  t("span", { children: "\u{1F393}" }),
                  t("strong", { children: "Draft & free agents" }),
                  a("small", { children: [e.draftPicks, " valg igjen"] }),
                ],
              }),
              a("button", {
                onClick: () => s("finance"),
                children: [
                  t("span", { children: "\u{1F4B0}" }),
                  t("strong", { children: "\xD8konomi" }),
                  a("small", { children: [h(e.cash), " p\xE5 konto"] }),
                ],
              }),
              a("button", {
                onClick: () => s("history"),
                children: [
                  t("span", { children: "\u{1F3DB}\uFE0F" }),
                  t("strong", { children: "Klubbhistorie" }),
                  t("small", { children: "Se sesongarkivet" }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Po({
  game: e,
  onStart: s,
  onReview: n,
  onReviewSponsors: r,
  onApprove: c,
  onSkipDraft: i,
  onAssistantPlan: d,
  onRenew: u,
  onRenewSponsor: g,
  onSell: k,
  onTab: y,
}) {
  const f = Ce(e),
    N = wt(e),
    w = {
      ...f.offseasonChecklist,
      contractsResolved: N.length === 0,
      draftResolved: e.draftPicks <= 0,
      rosterReady: Za(e),
    },
    v = ["summary", "contracts", "draft", "roster", "sponsors", "budget"],
    $ = w.summaryReviewed
      ? w.contractsResolved
        ? w.draftResolved
          ? w.rosterReady
            ? w.sponsorsReviewed
              ? "budget"
              : "sponsors"
            : "roster"
          : "draft"
        : "contracts"
      : "summary",
    [D, q] = ge($),
    x = e.history[e.history.length - 1],
    R = ta(e),
    E = rn(e),
    T = Object.values(w).every(Boolean) && Gt(e).length === 0,
    Y = (L) =>
      L === "summary"
        ? w.summaryReviewed
        : L === "contracts"
          ? w.contractsResolved
          : L === "draft"
            ? w.draftResolved
            : L === "roster"
              ? w.rosterReady
              : L === "sponsors"
                ? w.sponsorsReviewed
                : w.budgetApproved,
    ae = (L) => v.indexOf(L) <= v.indexOf($) || Y(L),
    B = () => {
      if (D === "summary") {
        (n(), q("contracts"));
        return;
      }
      if (D === "contracts") {
        N.length ? (d(), R.blocked.length || q("draft")) : q("draft");
        return;
      }
      if (D === "draft") {
        e.draftPicks > 0 ? y("market") : q("roster");
        return;
      }
      if (D === "roster") {
        w.rosterReady ? q("sponsors") : y("team");
        return;
      }
      if (D === "sponsors") {
        (w.sponsorsReviewed || r(), q("budget"));
        return;
      }
      if (!w.budgetApproved) {
        Gt(e).length ? y("finance", "loans") : c();
        return;
      }
      s();
    },
    W =
      D === "summary"
        ? "Marker som lest og g\xE5 til kontrakter"
        : D === "contracts"
          ? N.length
            ? "Signer de viktigste og frigi resten"
            : "Fortsett til draft"
          : D === "draft"
            ? e.draftPicks > 0
              ? `\xC5pne draftrommet \xB7 ${e.draftPicks} valg igjen`
              : "Fortsett til tropp"
            : D === "roster"
              ? w.rosterReady
                ? "Troppen er klar \xB7 fortsett til sponsorer"
                : "\xC5pne spillerstallen"
              : D === "sponsors"
                ? w.sponsorsReviewed
                  ? "Fortsett til budsjett"
                  : "Godkjenn sponsorplanen"
                : w.budgetApproved
                  ? `Start sesong ${e.season + 1}`
                  : Gt(e).length
                    ? "L\xF8s \xF8konomien f\xF8rst"
                    : "Godkjenn budsjettet";
  return a("section", {
    className: "offseason-linear",
    children: [
      a("header", {
        className: "offseason-linear-header",
        children: [
          a("div", {
            children: [
              a("p", {
                className: "eyebrow",
                children: ["Offseason \xB7 Sesong ", e.season],
              }),
              t("h2", { children: "\xC9n oppgave om gangen" }),
              t("p", {
                children:
                  "Fullf\xF8r stegene i rekkef\xF8lge. Den bl\xE5 knappen nederst er alltid neste riktige handling.",
              }),
            ],
          }),
          a("div", {
            children: [
              a("strong", {
                children: [Object.values(w).filter(Boolean).length, "/6"],
              }),
              t("span", { children: "fullf\xF8rt" }),
            ],
          }),
        ],
      }),
      t("nav", {
        className: "offseason-linear-steps",
        children: v.map((L, U) =>
          a(
            "button",
            {
              disabled: !ae(L),
              onClick: () => ae(L) && q(L),
              className: `${D === L ? "active" : ""} ${Y(L) ? "done" : ""}`,
              children: [
                t("i", { children: Y(L) ? "\u2713" : U + 1 }),
                t("span", {
                  children:
                    L === "summary"
                      ? "Oppsummering"
                      : L === "contracts"
                        ? "Kontrakter"
                        : L === "draft"
                          ? "Draft"
                          : L === "roster"
                            ? "Tropp"
                            : L === "sponsors"
                              ? "Sponsorer"
                              : "Budsjett",
                }),
              ],
            },
            L,
          ),
        ),
      }),
      a("div", {
        className: "offseason-linear-content",
        children: [
          D === "summary" &&
            a("section", {
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "1 \xB7 Sesongoppsummering",
                      }),
                      t("h3", { children: x?.result ?? "Sesongen er ferdig" }),
                      t("p", {
                        children:
                          "Les hovedtallene. Detaljer ligger fortsatt i historikken.",
                      }),
                    ],
                  }),
                }),
                a("div", {
                  className: "offseason-review-grid",
                  children: [
                    t(fe, {
                      label: "Sesong",
                      value: x?.record ?? `${e.wins}-${e.losses}`,
                      detail: x?.result ?? "Fullf\xF8rt",
                      highlight: !0,
                    }),
                    t(fe, {
                      label: "Drift",
                      value: h(x?.profit ?? 0),
                      detail: "F\xF8r sesongpremier",
                    }),
                    t(fe, {
                      label: "Premier",
                      value: h(x?.totalReward ?? 0),
                      detail: "Plassering, TV og sponsor",
                    }),
                    t(fe, {
                      label: "Supportere",
                      value: `${(x?.fansChange ?? 0) >= 0 ? "+" : ""}${Z(x?.fansChange ?? 0)}`,
                      detail: `${Z(x?.fansStart ?? e.fans)} \u2192 ${Z(x?.fansEnd ?? e.fans)}`,
                    }),
                  ],
                }),
                x?.tiebreakReason &&
                  a("div", {
                    className: "tiebreak-explanation",
                    children: [
                      t(_, { name: "chart" }),
                      a("div", {
                        children: [
                          t("strong", { children: "Plasseringen forklart" }),
                          t("p", { children: x.tiebreakReason }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
          D === "contracts" &&
            a("section", {
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "2 \xB7 Kontrakter",
                      }),
                      t("h3", {
                        children: N.length
                          ? `${N.length} avtale${N.length === 1 ? "" : "r"} m\xE5 avgj\xF8res`
                          : "Alle kontrakter er avklart",
                      }),
                      t("p", {
                        children:
                          "Assistenten beholder n\xF8kkelspillere og talenter, og frigir overfl\xF8dig bredde.",
                      }),
                      t("small", {
                        children:
                          "Mangler klubben kontanter til bonus, tilbys automatisk en bonusfri avtale med litt høyere ukelønn.",
                      }),
                    ],
                  }),
                }),
                N.length
                  ? a(X, {
                      children: [
                        a("div", {
                          className: "assistant-plan-preview",
                          children: [
                            a("div", {
                              children: [
                                t("span", { children: "Fornyes" }),
                                t("strong", { children: R.renewed.length }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Frigis" }),
                                t("strong", { children: R.released.length }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Bonus n\xE5" }),
                                t("strong", { children: h(R.totalBonus) }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Ny ukel\xF8nn" }),
                                t("strong", { children: h(R.projectedSalary) }),
                              ],
                            }),
                          ],
                        }),
                        a("details", {
                          className: "manual-contract-details",
                          children: [
                            t("summary", {
                              children: "Se og behandle enkeltspillere manuelt",
                            }),
                            t("div", {
                              className: "offseason-contract-list",
                              children: N.map((L) =>
                                a(
                                  "article",
                                  {
                                    children: [
                                      a("div", {
                                        className: "contract-player",
                                        children: [
                                          t("b", { children: L.position }),
                                          a("div", {
                                            children: [
                                              t("strong", { children: L.name }),
                                              a("small", {
                                                children: [
                                                  "OVR ",
                                                  H(L),
                                                  " \xB7 ",
                                                  It(e, L),
                                                  " \xB7 ",
                                                  h(L.salary),
                                                  "/uke",
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      a("div", {
                                        className: "contract-quick-years",
                                        children: [
                                          [1, 2, 3].map((U) =>
                                            a(
                                              "button",
                                              {
                                                onClick: () => u(L.id, U),
                                                children: [U, " \xE5r"],
                                              },
                                              U,
                                            ),
                                          ),
                                          t("button", {
                                            className: "danger-button",
                                            onClick: () => k(L.id),
                                            children: "Frigi",
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  L.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                      ],
                    })
                  : a("div", {
                      className: "all-clear",
                      children: [
                        t(_, { name: "check" }),
                        a("div", {
                          children: [
                            t("strong", {
                              children: "Kontraktssteget er ferdig",
                            }),
                            t("small", {
                              children: "Ingen ul\xF8ste avtaler.",
                            }),
                          ],
                        }),
                      ],
                    }),
              ],
            }),
          D === "draft" &&
            a("section", {
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "3 \xB7 Draft",
                      }),
                      t("h3", {
                        children: e.draftPicks
                          ? `${e.draftPicks} valg gjenst\xE5r`
                          : "Draften er ferdig",
                      }),
                      t("p", {
                        children:
                          "Draftrommet skiller n\xE5 mellom lagbehov, beste talent og assistentens helhetsvalg.",
                      }),
                    ],
                  }),
                }),
                a("div", {
                  className: "offseason-draft-summary",
                  children: [
                    a("article", {
                      children: [
                        t("span", { children: "Tilgjengelige prospects" }),
                        t("strong", { children: e.draftProspects.length }),
                      ],
                    }),
                    a("article", {
                      children: [
                        t("span", { children: "Cap space" }),
                        t("strong", { children: h(E.space) }),
                      ],
                    }),
                    a("article", {
                      children: [
                        t("span", { children: "Troppsplass" }),
                        a("strong", { children: [e.roster.length, "/", Je] }),
                      ],
                    }),
                  ],
                }),
                e.draftPicks > 0 &&
                  t("button", {
                    className: "soft-button skip-draft-clean",
                    onClick: i,
                    children: "Gi fra deg resterende valg",
                  }),
              ],
            }),
          D === "roster" &&
            a("section", {
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "4 \xB7 Troppskontroll",
                      }),
                      t("h3", {
                        children: w.rosterReady
                          ? "Troppen er godkjent"
                          : "Troppen trenger arbeid",
                      }),
                      a("p", {
                        children: [
                          "Minst ",
                          ve,
                          " spillere, alle posisjoner dekket og l\xF8nn innenfor b\xE5de liga-cap og klubbens faktiske betalingsevne.",
                        ],
                      }),
                    ],
                  }),
                }),
                a("div", {
                  className: "roster-readiness-grid",
                  children: [
                    a("article", {
                      className: e.roster.length >= ve ? "done" : "",
                      children: [
                        t("span", { children: "Spillere" }),
                        a("strong", { children: [e.roster.length, "/", ve] }),
                      ],
                    }),
                    a("article", {
                      className: Dt(e) ? "done" : "",
                      children: [
                        t("span", { children: "Posisjoner" }),
                        t("strong", { children: Dt(e) ? "Dekket" : "Mangler" }),
                      ],
                    }),
                    a("article", {
                      className: E.space >= 0 ? "done" : "",
                      children: [
                        t("span", { children: "Liga-cap" }),
                        t("strong", { children: h(E.space) }),
                      ],
                    }),
                    a("article", {
                      className: E.used <= me(e) ? "done" : "",
                      children: [
                        t("span", { children: "Klubbens budsjett" }),
                        t("strong", { children: h(me(e) - E.used) }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          D === "sponsors" &&
            (() => {
              const L = Le(e),
                U = L.filter((G) => (G.seasonsLeft ?? 1) <= 0);
              return a("section", {
                children: [
                  t("div", {
                    className: "section-heading",
                    children: a("div", {
                      children: [
                        t("p", {
                          className: "eyebrow",
                          children: "5 \xB7 Sponsorer",
                        }),
                        t("h3", {
                          children: U.length
                            ? `${U.length} sponsoravtale${U.length === 1 ? "" : "r"} m\xE5 avgj\xF8res`
                            : w.sponsorsReviewed
                              ? "Sponsorplanen er klar"
                              : "Kontroller sponsorportef\xF8ljen",
                        }),
                        t("p", {
                          children:
                            "Du kan fornye direkte her. Auto-managerens sponsorvedlikehold kan ogs\xE5 h\xE5ndtere trygge avtaler automatisk.",
                        }),
                      ],
                    }),
                  }),
                  U.length
                    ? t("div", {
                        className: "offseason-sponsor-decisions",
                        children: U.map((G) =>
                          a(
                            "article",
                            {
                              children: [
                                a("div", {
                                  children: [
                                    t("span", { children: we(G.slot) }),
                                    t("h3", { children: G.name }),
                                    a("p", {
                                      children: [
                                        h(G.weeklyPay),
                                        "/uke \xB7 relasjon ",
                                        Math.round(G.relationship ?? 60),
                                        "/100",
                                      ],
                                    }),
                                  ],
                                }),
                                a("div", {
                                  className: "offseason-sponsor-actions",
                                  children: [
                                    t("button", {
                                      onClick: () => g(G.slot, "safe"),
                                      children: "Forny trygt",
                                    }),
                                    t("button", {
                                      onClick: () => g(G.slot, "balanced"),
                                      children: "Markedsverdi",
                                    }),
                                    t("button", {
                                      onClick: () => g(G.slot, "aggressive"),
                                      children: "Ambisi\xF8st krav",
                                    }),
                                  ],
                                }),
                              ],
                            },
                            G.id,
                          ),
                        ),
                      })
                    : a("div", {
                        className: "all-clear",
                        children: [
                          t(_, { name: "check" }),
                          a("div", {
                            children: [
                              t("strong", {
                                children: "Ingen avtaler utl\xF8per n\xE5",
                              }),
                              a("small", {
                                children: [
                                  L.filter((G) => (G.seasonsLeft ?? 1) > 0)
                                    .length,
                                  "/4 sponsorflater aktive \xB7 ",
                                  h(
                                    L.filter(
                                      (G) => (G.seasonsLeft ?? 1) > 0,
                                    ).reduce((G, re) => G + re.weeklyPay, 0),
                                  ),
                                  "/uke",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                  a("div", {
                    className: "offseason-sponsor-footer",
                    children: [
                      t("button", {
                        className: "soft-button",
                        onClick: () => r(),
                        children: "Marker sponsorplanen som behandlet",
                      }),
                      t("button", {
                        className: "soft-button",
                        onClick: () => y("finance", "sponsors"),
                        children: "Se alle tilbud",
                      }),
                    ],
                  }),
                ],
              });
            })(),
          D === "budget" &&
            (() => {
              const L = pe(e),
                U = Gt(e);
              return a("section", {
                children: [
                  t("div", {
                    className: "section-heading",
                    children: a("div", {
                      children: [
                        t("p", {
                          className: "eyebrow",
                          children: "6 \xB7 Budsjett",
                        }),
                        t("h3", {
                          children: U.length
                            ? "\xD8konomien m\xE5 l\xF8ses f\xF8r sesongstart"
                            : w.budgetApproved
                              ? "Budsjettet er godkjent"
                              : "Siste kontroll f\xF8r ny sesong",
                        }),
                        t("p", {
                          children:
                            "Salary cap er ligagrensen. Klubbens l\xF8nnsbudsjett viser hva driften faktisk t\xE5ler.",
                        }),
                      ],
                    }),
                  }),
                  a("div", {
                    className: "budget-final-check",
                    children: [
                      a("div", {
                        children: [
                          t("span", { children: "Penger p\xE5 konto" }),
                          t("strong", { children: h(e.cash) }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Spillerl\xF8nn" }),
                          a("strong", { children: [h(E.used), "/uke"] }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Klubbens l\xF8nnsbudsjett" }),
                          a("strong", { children: [h(me(e)), "/uke"] }),
                        ],
                      }),
                      a("div", {
                        children: [
                          t("span", { children: "Forventet ukesresultat" }),
                          a("strong", {
                            className: L.profit >= 0 ? "positive" : "negative",
                            children: [L.profit >= 0 ? "+" : "", h(L.profit)],
                          }),
                        ],
                      }),
                    ],
                  }),
                  U.length > 0 &&
                    a("div", {
                      className: "budget-blocker-box",
                      children: [
                        t("strong", { children: "Dette m\xE5 l\xF8ses" }),
                        U.map((G) =>
                          a("span", { children: ["\u2022 ", G] }, G),
                        ),
                        t("button", {
                          className: "soft-button",
                          onClick: () => y("finance", "loans"),
                          children: "\xC5pne \xF8konomien",
                        }),
                      ],
                    }),
                ],
              });
            })(),
        ],
      }),
      a("footer", {
        className: "offseason-linear-footer",
        children: [
          t("button", {
            className: "soft-button",
            disabled: v.indexOf(D) === 0,
            onClick: () => q(v[Math.max(0, v.indexOf(D) - 1)]),
            children: "\u2190 Forrige",
          }),
          a("div", {
            children: [
              t("strong", {
                children: T
                  ? `Klar for sesong ${e.season + 1}`
                  : `Neste steg: ${$ === "summary" ? "Oppsummering" : $ === "contracts" ? "Kontrakter" : $ === "draft" ? "Draft" : $ === "roster" ? "Tropp" : $ === "sponsors" ? "Sponsorer" : "Budsjett"}`,
              }),
              t("span", {
                children:
                  D === "contracts" && N.length
                    ? `${R.renewed.length} fornyes \xB7 ${R.released.length} frigis`
                    : "Ingen skjulte steg eller ekstra knapper",
              }),
            ],
          }),
          a("button", {
            className: "primary-button",
            onClick: B,
            children: [W, " \u2192"],
          }),
        ],
      }),
    ],
  });
}
function $o({
  game: e,
  onStarter: s,
  onCaptain: n,
  onRenew: r,
  onSell: c,
  onBestLineup: i,
  onAssistantPlan: d,
  onToggleLock: u,
  onTransferOffer: g,
  locked: k,
}) {
  const [y, f] = ge("table"),
    [N, w] = ge("ALL"),
    [v, $] = ge(""),
    [D, q] = ge(null),
    [x, R] = ge(!1),
    E = [...e.roster]
      .filter((B) => N === "ALL" || B.position === N)
      .filter((B) => B.name.toLowerCase().includes(v.trim().toLowerCase()))
      .sort(
        (B, W) =>
          Number(W.starter) - Number(B.starter) ||
          je.indexOf(B.position) - je.indexOf(W.position) ||
          H(W) - H(B),
      ),
    T = D ? e.roster.find((B) => B.id === D) : void 0,
    Y = rn(e),
    ae = wt(e),
    seasonStat = T ? playerHeadlineStat(T, "season") : void 0,
    careerStat = T ? playerHeadlineStat(T, "career") : void 0;
  return a(X, {
    children: [
      a("div", {
        className: "panel-title-row",
        children: [
          t(Ze, {
            eyebrow: "Roster, depth chart & contracts",
            title: "Bygg en komplett spillerstall",
            detail: `${e.roster.length}/${Je} spillere \xB7 ${pn(e).length}/${je.length} startere`,
          }),
          a("div", {
            className: "view-switch",
            "aria-label": "Velg visning",
            children: [
              t("button", {
                className: y === "table" ? "active" : "",
                onClick: () => f("table"),
                children: "\u2637 Tabell",
              }),
              t("button", {
                className: y === "cards" ? "active" : "",
                onClick: () => f("cards"),
                children: "\u25A6 Kort",
              }),
              t("button", {
                className: y === "legacy" ? "active" : "",
                onClick: () => f("legacy"),
                children: "\u2605 Statistikk",
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: `cap-card ${Y.space < 0 || Y.used > me(e) ? "over" : Y.percentage > 88 ? "warning" : ""}`,
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Spillerl\xF8nn" }),
              a("h3", { children: [h(Y.used), "/uke"] }),
              a("p", {
                children: [
                  "Klubbens budsjett ",
                  h(me(e)),
                  "/uke \xB7 liga-cap ",
                  h(Y.cap),
                ],
              }),
            ],
          }),
          a("div", {
            children: [
              t("div", {
                className: "cap-meter",
                children: t("i", {
                  style: {
                    width: `${Math.min(100, (Y.used / Math.max(1, me(e))) * 100)}%`,
                  },
                }),
              }),
              t("small", {
                className: Y.used <= me(e) ? "positive" : "negative",
                children:
                  Y.used <= me(e)
                    ? `${h(me(e) - Y.used)} innenfor b\xE6rekraftig budsjett`
                    : `${h(Y.used - me(e))} over klubbens budsjett`,
              }),
            ],
          }),
        ],
      }),
      Y.used > me(e) &&
        (() => {
          const B = fo(e),
            W = B?.option;
          return a("section", {
            className: "salary-repair-card",
            children: [
              a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Budsjettassistent",
                  }),
                  a("h3", {
                    children: ["Du m\xE5 spare ", h(B?.over ?? 0), "/uke"],
                  }),
                  t("p", {
                    children: W?.replacement
                      ? `St\xF8rste enkle grep: selg ${W.player.name} og vurder ${W.replacement.agent.name} som billig ${W.player.position}-reserve.`
                      : "I offseason kan du g\xE5 under 16 spillere midlertidig, selge dyrt og hente rimeligere bredde etterp\xE5.",
                  }),
                ],
              }),
              W &&
                a("div", {
                  className: "salary-repair-metrics",
                  children: [
                    a("span", {
                      children: [
                        t("small", { children: "Spart l\xF8nn" }),
                        a("strong", {
                          children: ["\u2212", h(W.saving), "/uke"],
                        }),
                      ],
                    }),
                    a("span", {
                      children: [
                        t("small", { children: "Ny l\xF8nn" }),
                        a("strong", {
                          children: [h(Y.used - W.saving), "/uke"],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          });
        })(),
      e.transferOffers.length > 0 &&
        a("section", {
          className: "transfer-offer-center",
          children: [
            t("div", {
              className: "section-heading",
              children: a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Bud fra andre klubber",
                  }),
                  a("h3", {
                    children: [
                      e.transferOffers.length,
                      " aktivt bud",
                      (e.transferOffers.length === 1, ""),
                    ],
                  }),
                  t("p", {
                    children:
                      "Spilleren kan ikke forsvinne uten at du godkjenner salget.",
                  }),
                ],
              }),
            }),
            e.transferOffers.map((B) => {
              const W = e.roster.find((G) => G.id === B.playerId);
              if (!W) return null;
              const L = Fe(e, W),
                U =
                  B.amount > L.high
                    ? "Over markedsverdi"
                    : B.amount < L.low
                      ? "Under markedsverdi"
                      : "Innenfor markedsverdi";
              return a(
                "article",
                {
                  children: [
                    a("div", {
                      children: [
                        t("b", { children: W.position }),
                        a("div", {
                          children: [
                            a("strong", {
                              children: [B.clubName, " byr p\xE5 ", W.name],
                            }),
                            a("small", {
                              children: [
                                h(B.amount),
                                " \xB7 markedsverdi ",
                                h(L.low),
                                "\u2013",
                                h(L.high),
                                " \xB7 ",
                                U,
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    a("div", {
                      children: [
                        t("button", {
                          onClick: () => g(B.id, "reject"),
                          children: "Avsl\xE5",
                        }),
                        t("button", {
                          onClick: () => g(B.id, "counter"),
                          disabled: B.countered,
                          children: "Krev mer",
                        }),
                        t("button", {
                          className: "primary-button",
                          onClick: () => g(B.id, "accept"),
                          children: "Godta bud",
                        }),
                      ],
                    }),
                  ],
                },
                B.id,
              );
            }),
          ],
        }),
      ae.length > 0 &&
        a("section", {
          className: "contract-alert",
          children: [
            t(_, { name: "alert" }),
            a("div", {
              children: [
                a("strong", {
                  children: [ae.length, " utl\xF8pte kontrakter"],
                }),
                t("p", {
                  children:
                    "\xC5pne spilleren og velg kontraktslengde eller frigi spilleren.",
                }),
              ],
            }),
          ],
        }),
      t("section", {
        className: "depth-chart-strip",
        children: je.map((B) => {
          const W = e.roster
            .filter((L) => L.position === B)
            .sort(
              (L, U) => Number(U.starter) - Number(L.starter) || H(U) - H(L),
            );
          return a(
            "article",
            {
              className: W.length ? "" : "missing",
              children: [
                t("b", { children: B }),
                t("strong", {
                  children:
                    W.find((L) => L.starter)?.name ?? "Tom starterplass",
                }),
                a("small", {
                  children: [
                    W.length,
                    " spiller(e) \xB7 beste OVR ",
                    W.length ? Math.max(...W.map(H)) : 0,
                  ],
                }),
              ],
            },
            B,
          );
        }),
      }),
      a("section", {
        className: "lineup-assistant pc-lineup-assistant",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Assistentmanager" }),
              t("h3", { children: "Velg hvor mye hjelp du vil ha" }),
              t("p", {
                children:
                  e.settings.responsibility === "manual"
                    ? "Manuell styring er aktiv. Assistenten gir ingen automatiske endringer."
                    : e.settings.responsibility === "delegated"
                      ? `Delegert drift er aktiv. Trygge valg under ${h(e.settings.assistantApprovalLimit)} kan gjennomf\xF8res samlet.`
                      : "Assistert drift er aktiv. Du kan be om anbefalinger og godkjenne trygge valg samlet.",
              }),
            ],
          }),
          a("div", {
            className: "lineup-buttons",
            children: [
              t("button", {
                className: "primary-button",
                onClick: () => i("opponent"),
                disabled: k,
                children: "Sett beste lag",
              }),
              t("button", {
                onClick: () => i("rested"),
                disabled: k,
                children: "Hvil slitne spillere",
              }),
              t("button", {
                onClick: () => i("youth"),
                disabled: k,
                children: "Utvikle unge",
              }),
              t("button", {
                className: "assistant-safe-button",
                onClick: d,
                disabled: k || e.settings.responsibility === "manual",
                children:
                  e.phase === "offseason"
                    ? "Signer og rydd kontrakter"
                    : "Gjennomf\xF8r anbefaling",
              }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "team-summary-grid",
        children: [
          t(fe, {
            label: "Attack",
            value: Math.round(Ne(e).attack).toString(),
            detail: "Startere",
          }),
          t(fe, {
            label: "Defense",
            value: Math.round(Ne(e).defense).toString(),
            detail: "Startere",
          }),
          t(fe, {
            label: "Stamina",
            value: Math.round(Ne(e).stamina).toString(),
            detail: "Conditionjustert",
          }),
          t(fe, {
            label: "Kjemi",
            value: `${Math.round(Ne(e).chemistry)}%`,
            detail: "Garderoben",
            highlight: !0,
          }),
        ],
      }),
      a("section", {
        className: "roster-toolbar",
        children: [
          a("label", {
            children: [
              t("span", { children: "S\xF8k" }),
              t("input", {
                value: v,
                onChange: (B) => $(B.target.value),
                placeholder: "Spillernavn \u2026",
              }),
            ],
          }),
          a("label", {
            children: [
              t("span", { children: "Posisjon" }),
              a("select", {
                value: N,
                onChange: (B) => w(B.target.value),
                children: [
                  t("option", { value: "ALL", children: "Alle" }),
                  Va.map((B) => t("option", { value: B, children: B }, B)),
                ],
              }),
            ],
          }),
          a("div", {
            children: [
              t("strong", { children: E.length }),
              t("span", { children: "vises" }),
            ],
          }),
        ],
      }),
      y === "legacy"
        ? t(PlayerLegacyPanel, {
            game: e,
            onPlayer: (B) => {
              (R(!1), q(B));
            },
          })
        : y === "table"
          ? t("div", {
              className: "roster-table-wrap compact-roster-wrap",
              children: a("table", {
                className: "roster-table compact-roster-table",
                children: [
                  t("thead", {
                    children: a("tr", {
                      children: [
                        t("th", { children: "Spiller" }),
                        t("th", { children: "Pos" }),
                        t("th", { children: "OVR" }),
                        t("th", { children: "Sesong" }),
                        t("th", { children: "Form" }),
                        t("th", { children: "Kontrakt" }),
                        t("th", { children: "L\xF8nn" }),
                        t("th", { children: "Markedsverdi" }),
                        t("th", { children: "Rolle" }),
                        t("th", { children: "Handling" }),
                      ],
                    }),
                  }),
                  t("tbody", {
                    children: E.map((B) =>
                      a(
                        "tr",
                        {
                          tabIndex: 0,
                          "aria-label": `Administrer ${B.name}`,
                          onClick: () => {
                            (R(!1), q(B.id));
                          },
                          onKeyDown: (W) => {
                            (W.key === "Enter" || W.key === " ") &&
                              (W.preventDefault(), R(!1), q(B.id));
                          },
                          className: `clickable-player-row ${B.starter ? "starter-row" : ""} ${B.injuryWeeks > 0 ? "injured-row" : ""}`,
                          children: [
                            t("td", {
                              children: a("div", {
                                className: "table-player",
                                children: [
                                  t("span", {
                                    children: B.captain
                                      ? "\u2605"
                                      : B.locked
                                        ? "L"
                                        : B.personality === "Stortalent"
                                          ? "\u25C6"
                                          : "\xB7",
                                  }),
                                  a("div", {
                                    children: [
                                      t("strong", { children: B.name }),
                                      a("small", {
                                        children: [
                                          B.personality,
                                          " \xB7 ",
                                          B.age,
                                          " \xE5r \xB7 hjemby ",
                                          B.hometown,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            t("td", {
                              children: t("b", {
                                className: "table-position",
                                children: B.position,
                              }),
                            }),
                            t("td", {
                              children: t("strong", { children: H(B) }),
                            }),
                            a("td", {
                              children: [
                                t("strong", {
                                  children: playerHeadlineStat(B).value,
                                }),
                                t("small", {
                                  className: "table-subvalue",
                                  children: playerHeadlineStat(B).label,
                                }),
                              ],
                            }),
                            a("td", {
                              children: [
                                a("span", {
                                  className:
                                    B.condition < 45
                                      ? "negative"
                                      : B.condition > 78
                                        ? "positive"
                                        : "",
                                  children: [B.condition, "%"],
                                }),
                                a("small", {
                                  className: "table-subvalue",
                                  children: ["Moral ", B.morale, "%"],
                                }),
                              ],
                            }),
                            t("td", {
                              className: B.contractYears <= 0 ? "negative" : "",
                              children:
                                B.contractYears <= 0
                                  ? "Utl\xF8pt"
                                  : `${B.contractYears} \xE5r`,
                            }),
                            a("td", {
                              children: [
                                h(B.salary),
                                t("small", {
                                  className: `table-subvalue ${xn(e, B).className}`,
                                  children: xn(e, B).label,
                                }),
                              ],
                            }),
                            a("td", {
                              children: [
                                h(Fe(e, B).low),
                                "\u2013",
                                h(Fe(e, B).high),
                              ],
                            }),
                            t("td", {
                              className:
                                It(e, B) === "B\xF8r frigis" ? "negative" : "",
                              children:
                                B.injuryWeeks > 0
                                  ? `Skadet ${B.injuryWeeks}u`
                                  : It(e, B),
                            }),
                            t("td", {
                              className: "roster-action-cell",
                              children: t("button", {
                                className: "manage-player-button",
                                onClick: (W) => {
                                  (W.stopPropagation(), R(!1), q(B.id));
                                },
                                children: "\xC5pne",
                              }),
                            }),
                          ],
                        },
                        B.id,
                      ),
                    ),
                  }),
                ],
              }),
            })
          : t("div", {
              className: "roster-grid",
              children: E.map((B) =>
                t(
                  Os,
                  {
                    player: B,
                    showExact: !0,
                    children: a("div", {
                      className: "player-actions",
                      children: [
                        t("button", {
                          onClick: () => s(B.id),
                          disabled: k || B.starter || B.injuryWeeks > 0,
                          children: B.starter
                            ? "Starter"
                            : `Start som ${B.position}`,
                        }),
                        t("button", {
                          onClick: () => n(B.id),
                          disabled: k || B.captain,
                          children: B.captain ? "Kaptein" : "Velg kaptein",
                        }),
                        t("button", {
                          className: "primary-mini",
                          onClick: () => {
                            (R(!1), q(B.id));
                          },
                          children: "Administrer spiller",
                        }),
                      ],
                    }),
                  },
                  B.id,
                ),
              ),
            }),
      T &&
        t("div", {
          className: "player-manager-backdrop",
          onMouseDown: () => {
            (R(!1), q(null));
          },
          children: a("section", {
            className: "player-manager-drawer",
            onMouseDown: (B) => B.stopPropagation(),
            "aria-modal": "true",
            role: "dialog",
            children: [
              a("header", {
                className: "player-manager-header",
                children: [
                  a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Spilleradministrasjon",
                      }),
                      t("h2", { children: T.name }),
                      a("p", {
                        children: [
                          T.position,
                          " \xB7 OVR ",
                          H(T),
                          " \xB7 ",
                          T.age,
                          " \xE5r \xB7 ",
                          T.personality,
                        ],
                      }),
                    ],
                  }),
                  t("button", {
                    className: "drawer-close",
                    onClick: () => {
                      (R(!1), q(null));
                    },
                    "aria-label": "Lukk",
                    children: "\xD7",
                  }),
                ],
              }),
              a("div", {
                className: "player-manager-kpis",
                children: [
                  a("div", {
                    children: [
                      t("span", { children: "Rolle" }),
                      t("strong", { children: It(e, T) }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "Form" }),
                      a("strong", { children: [T.condition, "%"] }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "Moral" }),
                      a("strong", { children: [T.morale, "%"] }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "N\xE5v\xE6rende avtale" }),
                      t("strong", {
                        children:
                          T.contractYears <= 0
                            ? "Utl\xF8pt"
                            : `${T.contractYears} \xE5r`,
                      }),
                    ],
                  }),
                ],
              }),
              a("section", {
                className: "player-career-summary",
                children: [
                  a("article", {
                    children: [
                      t("span", { children: `Sesong ${e.season}` }),
                      t("strong", { children: seasonStat?.value ?? 0 }),
                      t("small", {
                        children: seasonStat?.label ?? "Statistikk",
                      }),
                    ],
                  }),
                  a("article", {
                    children: [
                      t("span", { children: "Karriere" }),
                      t("strong", { children: careerStat?.value ?? 0 }),
                      t("small", {
                        children: careerStat?.label ?? "Statistikk",
                      }),
                    ],
                  }),
                  a("article", {
                    children: [
                      t("span", { children: "Kamper / seire" }),
                      a("strong", {
                        children: [
                          T.careerStats?.games ?? T.careerGames ?? 0,
                          " / ",
                          T.careerStats?.wins ?? 0,
                        ],
                      }),
                      t("small", {
                        children: `${T.seasonHistory?.length ?? 0} fullf\xF8rte sesonger`,
                      }),
                    ],
                  }),
                  a("article", {
                    children: [
                      t("span", { children: "MVP / sesongpriser" }),
                      a("strong", {
                        children: [
                          T.careerStats?.mvpAwards ?? T.careerAwards ?? 0,
                          " / ",
                          T.seasonAwardCount ?? 0,
                        ],
                      }),
                      t("small", {
                        children: "Kampens spiller / \xE5rspriser",
                      }),
                    ],
                  }),
                ],
              }),
              a("section", {
                className: "player-value-panel",
                children: [
                  a("div", {
                    children: [
                      t("span", { children: "Markedsverdi" }),
                      a("strong", {
                        children: [h(Fe(e, T).low), "\u2013", h(Fe(e, T).high)],
                      }),
                      t("small", {
                        children:
                          "P\xE5virkes av OVR, potensial, alder, form og kontrakt",
                      }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "Sportslig verdi" }),
                      t("strong", { children: xr(e, T) }),
                      a("small", {
                        children: [It(e, T), " p\xE5 ", T.position],
                      }),
                    ],
                  }),
                  a("div", {
                    children: [
                      t("span", { children: "Kontraktsverdi" }),
                      t("strong", {
                        className: xn(e, T).className,
                        children: xn(e, T).label,
                      }),
                      a("small", {
                        children: [
                          h(T.salary),
                          "/uke mot marked ",
                          h($n(e, T).low),
                          "\u2013",
                          h($n(e, T).high),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              a("section", {
                className: "player-manager-section assistant-player-review",
                children: [
                  a("div", {
                    className: "drawer-section-heading",
                    children: [
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "Assistentvurdering",
                          }),
                          t("h3", { children: "F\xE5 et konkret r\xE5d" }),
                        ],
                      }),
                      t("button", {
                        className: "soft-button",
                        onClick: () => R((B) => !B),
                        children: x
                          ? "Skjul vurdering"
                          : "Be assistenten vurdere",
                      }),
                    ],
                  }),
                  x &&
                    (() => {
                      const B = ea(e, T);
                      return a("div", {
                        className: `assistant-assessment ${B.keep ? "keep" : "release"}`,
                        children: [
                          t("strong", { children: B.title }),
                          t("p", { children: B.summary }),
                          t("ul", {
                            children: B.reasons.map((W) =>
                              t("li", { children: W }, W),
                            ),
                          }),
                          a("small", {
                            children: [
                              "Anbefalt kontraktslengde: ",
                              B.recommendedYears,
                              " \xE5r. Assistenten frigir aldri spilleren uten at du bekrefter det.",
                            ],
                          }),
                        ],
                      });
                    })(),
                ],
              }),
              a("section", {
                className: "player-manager-section",
                children: [
                  a("div", {
                    className: "drawer-section-heading",
                    children: [
                      a("div", {
                        children: [
                          t("p", {
                            className: "eyebrow",
                            children: "Kontrakt",
                          }),
                          t("h3", { children: "Velg ny avtale" }),
                        ],
                      }),
                      t("small", {
                        children: "Avtalen erstatter dagens kontrakt",
                      }),
                    ],
                  }),
                  t("div", {
                    className: "contract-choice-grid",
                    children: [1, 2, 3, 4].map((B) => {
                      const W = dt(T, B, !0, e),
                        L = se(e) - T.salary + W.salary,
                        U = T.contractYears <= 0 || B > T.contractYears,
                        G = e.cash >= W.signingBonus,
                        re = Wt(e),
                        he = L <= re;
                      return a(
                        "button",
                        {
                          className: B === 3 ? "recommended" : "",
                          onClick: () => {
                            (r(T.id, B), q(null));
                          },
                          disabled: k || !U || !G || !he,
                          children: [
                            a("span", { children: [B, " \xE5r"] }),
                            a("strong", { children: [h(W.salary), "/uke"] }),
                            a("small", {
                              children: ["Bonus ", h(W.signingBonus)],
                            }),
                            !U &&
                              t("em", { children: "Ikke lengre enn dagens" }),
                            U &&
                              !G &&
                              t("em", { children: "Mangler kontanter" }),
                            U &&
                              G &&
                              !he &&
                              t("em", { children: "Over l\xF8nnsrammen" }),
                          ],
                        },
                        B,
                      );
                    }),
                  }),
                ],
              }),
              a("section", {
                className: "player-manager-section",
                children: [
                  t("div", {
                    className: "drawer-section-heading",
                    children: a("div", {
                      children: [
                        t("p", { className: "eyebrow", children: "Lagrolle" }),
                        t("h3", { children: "Sportslige valg" }),
                      ],
                    }),
                  }),
                  a("div", {
                    className: "player-manager-actions",
                    children: [
                      t("button", {
                        onClick: () => s(T.id),
                        disabled: k || T.starter || T.injuryWeeks > 0,
                        children: T.starter
                          ? "Allerede starter"
                          : `Sett som starter (${T.position})`,
                      }),
                      t("button", {
                        onClick: () => n(T.id),
                        disabled: k || T.captain,
                        children: T.captain
                          ? "Allerede kaptein"
                          : "Velg som kaptein",
                      }),
                      t("button", {
                        onClick: () => u(T.id),
                        disabled: k,
                        children: T.locked
                          ? "L\xE5s opp i laguttak"
                          : "L\xE5s i laguttak",
                      }),
                      t("button", {
                        className: "danger-button",
                        onClick: () => c(T.id),
                        disabled: k,
                        children:
                          T.contractYears <= 0
                            ? "Frigi spiller"
                            : "Selg spiller",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function PlayerLegacyPanel({ game: e, onPlayer: s }) {
  const n = seasonLeaders(e.roster),
    r = careerLeaders(e.roster, e.legends),
    c = [...e.roster]
      .sort(
        (d, u) =>
          Number(u.careerStats?.games ?? u.careerGames ?? 0) -
            Number(d.careerStats?.games ?? d.careerGames ?? 0) ||
          Number(u.seasonAwardCount ?? 0) - Number(d.seasonAwardCount ?? 0),
      )
      .slice(0, 8),
    i = e.playerAwardHistory?.[0];
  return a("section", {
    className: "player-legacy-hub",
    children: [
      a("header", {
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Player legacy" }),
              t("h3", {
                children: `Sesong ${e.season} \xB7 statistikk og karriere`,
              }),
              t("p", {
                children:
                  "Hver kamp bygger spillerens sesongtall, karriererekorder og plass i klubbhistorien.",
              }),
            ],
          }),
          i &&
            a("div", {
              className: "legacy-last-award",
              children: [
                t("span", { children: "Siste \xE5rets spiller" }),
                t("strong", { children: i.mvp ?? "\u2014" }),
                t("small", { children: `Sesong ${i.season} \xB7 ${i.league}` }),
              ],
            }),
        ],
      }),
      t("h4", { children: "Sesongledere" }),
      a("div", {
        className: "legacy-leader-grid",
        children: n.map((d) =>
          a(
            "button",
            {
              onClick: () => s(d.player.id),
              children: [
                t("span", { children: d.label }),
                t("strong", {
                  children: formatStatValue(d.player.seasonStats?.[d.key]),
                }),
                a("small", {
                  children: [d.player.position, " \xB7 ", d.player.name],
                }),
              ],
            },
            d.key,
          ),
        ),
      }),
      t("h4", { children: "Klubbrekorder" }),
      a("div", {
        className: "legacy-record-grid",
        children: r.map((d) => {
          const u = e.roster.some((g) => g.id === d.player.id);
          return a(
            "button",
            {
              onClick: () => u && s(d.player.id),
              disabled: !u,
              children: [
                t("span", { children: d.label }),
                t("strong", {
                  children: formatStatValue(d.player.careerStats?.[d.key]),
                }),
                a("small", {
                  children: [d.player.name, u ? "" : " \xB7 klubblegende"],
                }),
              ],
            },
            d.key,
          );
        }),
      }),
      t("h4", { children: "Flest kamper for klubben" }),
      a("div", {
        className: "legacy-career-table",
        children: c.map((d, u) => {
          const g = playerHeadlineStat(d, "career");
          const k = Number(d.careerStats?.games ?? d.careerGames ?? 0);
          return a(
            "button",
            {
              onClick: () => s(d.id),
              children: [
                t("b", { children: u + 1 }),
                t("span", { children: d.position }),
                a("div", {
                  children: [
                    t("strong", { children: d.name }),
                    a("small", { children: [g.label, ": ", g.value] }),
                  ],
                }),
                a("em", {
                  children: [formatStatValue(k), k === 1 ? " kamp" : " kamper"],
                }),
              ],
            },
            d.id,
          );
        }),
      }),
    ],
  });
}
function xo({
  game: e,
  onScout: s,
  onRefresh: n,
  onSign: r,
  onDraft: c,
  onSkipDraft: i,
  locked: d,
}) {
  const u = e.phase === "offseason",
    g = rn(e),
    k = me(e),
    y = Math.min(g.cap, k),
    f = y - g.used,
    N = es(e).slice(0, 3),
    w = [...e.draftProspects].sort((R, E) => ks(e, E) - ks(e, R)),
    v = N[0]?.position,
    $ = [...e.draftProspects]
      .filter((R) => !v || R.position === v)
      .sort((R, E) => pt(E) - pt(R))[0]?.id,
    D = [...e.draftProspects].sort((R, E) => pt(E) - pt(R))[0]?.id,
    q = w[0]?.id,
    x = [...e.draftProspects].sort((R, E) => pt(E) - pt(R));
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: u ? "Draft og free agency" : "Spillermarked",
        title: u
          ? e.draftPicks > 0
            ? `Draft \xB7 ${e.draftPicks} valg igjen`
            : "Draften er fullf\xF8rt"
          : "Forhandle frem neste signering",
        detail: `${h(g.space)} igjen av liga-cap \xB7 ${f >= 0 ? h(f) + " igjen i klubbens budsjett" : h(Math.abs(f)) + " over klubbens budsjett"} \xB7 ${e.roster.length}/${Je} spillere`,
      }),
      a("section", {
        className: `cap-card compact ${g.space < 0 || f < 0 ? "over" : ""}`,
        children: [
          a("div", {
            children: [
              t("strong", { children: "Spillerl\xF8nn" }),
              a("span", {
                children: [
                  h(g.used),
                  " brukt \xB7 klubbens budsjett ",
                  h(k),
                  " \xB7 liga-cap ",
                  h(g.cap),
                ],
              }),
            ],
          }),
          a("div", {
            children: [
              t("div", {
                className: "cap-meter",
                children: t("i", {
                  style: {
                    width: `${Math.min(100, (g.used / Math.max(1, y)) * 100)}%`,
                  },
                }),
              }),
              t("small", {
                className: f >= 0 ? "positive" : "negative",
                children:
                  f >= 0
                    ? `${h(f)} tilgjengelig`
                    : `${h(Math.abs(f))} m\xE5 bort`,
              }),
            ],
          }),
        ],
      }),
      !u &&
        a("div", {
          className: "market-toolbar",
          children: [
            t("button", {
              className: "soft-button",
              onClick: n,
              disabled: d,
              children: "Ny scoutingrunde",
            }),
            a("span", {
              children: [
                "Scoutingniv\xE5 ",
                e.upgrades.scouting + e.staff.scout,
              ],
            }),
          ],
        }),
      u &&
        a("section", {
          className: "v16-draft-center",
          children: [
            a("div", {
              className: "draft-command-bar",
              children: [
                a("div", {
                  children: [
                    t("p", { className: "eyebrow", children: "Draftrom" }),
                    t("h3", {
                      children:
                        "Tre vurderinger \u2013 ikke \xE9n uklar \xABanbefalt\xBB",
                    }),
                    t("p", {
                      children:
                        "Lagbehov viser hvor troppen er svakest. Beste talent vurderer OVR, potensial, alder og l\xF8nn. Assistentens valg balanserer begge.",
                    }),
                  ],
                }),
                a("div", {
                  className: "draft-picks-badge",
                  children: [
                    t("strong", { children: e.draftPicks }),
                    t("span", { children: "valg igjen" }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "draft-legend",
              children: [
                a("span", {
                  children: [
                    t("b", { children: "BEHOV" }),
                    " dekker svakeste posisjon",
                  ],
                }),
                a("span", {
                  children: [
                    t("b", { children: "BESTE TALENT" }),
                    " h\xF8yest langsiktig verdi",
                  ],
                }),
                a("span", {
                  children: [
                    t("b", { children: "ASSISTENT" }),
                    " beste helhetsvalg",
                  ],
                }),
              ],
            }),
            t("div", {
              className: "draft-needs-strip",
              children: N.map((R, E) =>
                a(
                  "article",
                  {
                    className: E === 0 ? "priority" : "",
                    children: [
                      a("span", { children: ["Behov ", E + 1] }),
                      t("strong", { children: R.position }),
                      a("small", {
                        children: [
                          R.depth,
                          " i troppen \xB7 beste OVR ",
                          R.bestOverall || "\u2014",
                        ],
                      }),
                    ],
                  },
                  R.position,
                ),
              ),
            }),
            e.draftPicks > 0
              ? a(X, {
                  children: [
                    a("div", {
                      className: "draft-list-heading",
                      children: [
                        a("div", {
                          children: [
                            t("h3", { children: "Tilgjengelige prospects" }),
                            t("p", {
                              children:
                                "Andre klubber velger spillere mellom dine valg. Topptalenter kan derfor forsvinne.",
                            }),
                          ],
                        }),
                        t("button", {
                          className: "soft-button",
                          onClick: i,
                          children: "Avslutt draften",
                        }),
                      ],
                    }),
                    t("div", {
                      className: "draft-prospect-grid",
                      children: w.map((R) => {
                        const E = Xa(e, R),
                          T = Math.round((100 - R.revealed) * 0.22),
                          Y = H(R),
                          ae =
                            R.revealed >= 95
                              ? `${Y}`
                              : `${b(Y - T, 20, 99)}\u2013${b(Y + T, 20, 99)}`,
                          B = g.space - E.salary,
                          W = f - E.salary,
                          L =
                            e.roster.length >= Je ||
                            e.cash < E.signingBonus ||
                            B < 0 ||
                            W < 0,
                          U = x.findIndex((he) => he.id === R.id) + 1,
                          G = U <= 3 ? "H\xF8y" : U <= 7 ? "Middels" : "Lav",
                          re = [
                            R.id === $ && "ST\xD8RSTE BEHOV",
                            R.id === D && "BESTE TALENT",
                            R.id === q && "ASSISTENTENS VALG",
                          ].filter(Boolean);
                        return a(
                          "article",
                          {
                            className: `draft-prospect-card ${R.id === q ? "recommended" : ""}`,
                            children: [
                              a("header", {
                                children: [
                                  t("span", {
                                    className: "table-position",
                                    children: R.position,
                                  }),
                                  a("div", {
                                    children: [
                                      t("strong", { children: R.name }),
                                      a("small", {
                                        children: [
                                          R.hometown,
                                          " \xB7 ",
                                          R.age,
                                          " \xE5r \xB7 ",
                                          R.personality,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              t("div", {
                                className: "draft-label-row",
                                children: re.map((he) =>
                                  t("b", { children: he }, he),
                                ),
                              }),
                              t("p", {
                                className: "draft-reason",
                                children:
                                  R.id === q
                                    ? `${vs(e, R)} og sterk total talentverdi.`
                                    : vs(e, R),
                              }),
                              a("div", {
                                className: "draft-rating",
                                children: [
                                  a("div", {
                                    children: [
                                      t("span", { children: "Estimert OVR" }),
                                      t("strong", { children: ae }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "Potensial" }),
                                      t("strong", {
                                        children:
                                          R.revealed >= 60 ? R.potential : "?",
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", {
                                        children: "Risiko f\xF8r neste valg",
                                      }),
                                      t("strong", {
                                        className:
                                          G === "H\xF8y"
                                            ? "negative"
                                            : G === "Middels"
                                              ? "warning"
                                              : "positive",
                                        children: G,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              a("div", {
                                className: "draft-contract-preview",
                                children: [
                                  a("div", {
                                    children: [
                                      t("span", { children: "Rookieavtale" }),
                                      t("strong", { children: "4 \xE5r" }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "L\xF8nn" }),
                                      a("strong", {
                                        children: [h(E.salary), "/uke"],
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "Bonus n\xE5" }),
                                      t("strong", {
                                        children: h(E.signingBonus),
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "Cap etter valg" }),
                                      t("strong", {
                                        className:
                                          B >= 0 ? "positive" : "negative",
                                        children: h(B),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              a("div", {
                                className: "draft-card-actions",
                                children: [
                                  a("button", {
                                    onClick: () => s(R.id),
                                    disabled: R.revealed >= 100,
                                    children: [
                                      "Scout ",
                                      R.revealed >= 100 ? "fullf\xF8rt" : "",
                                    ],
                                  }),
                                  t("button", {
                                    className: "primary-button",
                                    onClick: () => c(R.id),
                                    disabled: L,
                                    children: L
                                      ? e.roster.length >= Je
                                        ? "Troppen er full"
                                        : e.cash < E.signingBonus
                                          ? "Mangler bonus"
                                          : W < 0
                                            ? "Over klubbens budsjett"
                                            : "Over salary cap"
                                      : "Bruk draftvalg",
                                  }),
                                ],
                              }),
                            ],
                          },
                          R.id,
                        );
                      }),
                    }),
                  ],
                })
              : a("div", {
                  className: "draft-complete-card",
                  children: [
                    t(_, { name: "check" }),
                    a("div", {
                      children: [
                        t("strong", { children: "Draften er ferdig" }),
                        t("p", {
                          children:
                            "G\xE5 tilbake til offseason for \xE5 kontrollere troppen.",
                        }),
                      ],
                    }),
                  ],
                }),
          ],
        }),
      t("h3", { className: "section-title", children: "Free agents" }),
      t("div", {
        className: "roster-grid market-grid",
        children: e.freeAgents.map((R) => {
          const E = [dt(R, 1, !1, e), dt(R, 2, !1, e), dt(R, 3, !1, e)];
          return a(
            Os,
            {
              player: R,
              children: [
                t("div", {
                  className: "player-actions",
                  children: t("button", {
                    onClick: () => s(R.id),
                    children: "Scout",
                  }),
                }),
                t("div", {
                  className: "contract-offers",
                  children: E.map((T) => {
                    const ae =
                      u && e.cash < T.signingBonus
                        ? {
                            ...T,
                            salary: Math.round(T.salary * 1.16),
                            signingBonus: 0,
                            bonusFree: !0,
                          }
                        : T;
                    const Y =
                      d ||
                      e.roster.length >= Je ||
                      (!u && e.cash < ae.signingBonus) ||
                      g.space < ae.salary ||
                      f < ae.salary;
                    return a(
                      "button",
                      {
                        className: ae.years === 2 ? "recommended" : "",
                        onClick: () => r(R.id, ae.years),
                        disabled: Y,
                        children: [
                          a("strong", { children: [ae.years, " \xE5r"] }),
                          a("span", { children: [h(ae.salary), "/uke"] }),
                          a("small", {
                            children: ae.bonusFree
                              ? "Bonusfri avtale"
                              : [h(ae.signingBonus), " bonus"],
                          }),
                        ],
                      },
                      ae.years,
                    );
                  }),
                }),
              ],
            },
            R.id,
          );
        }),
      }),
    ],
  });
}
function Os({ player: e, children: s, showExact: n }) {
  const r = H(e),
    c = Math.round((100 - e.revealed) * 0.22),
    i = (d) =>
      n || e.revealed >= 95
        ? `${d}`
        : `${b(d - c, 20, 99)}\u2013${b(d + c, 20, 99)}`;
  return a("article", {
    className: `player-card ${e.starter ? "starter" : ""} ${e.injuryWeeks > 0 ? "injured" : ""}`,
    children: [
      a("header", {
        children: [
          t("div", { className: "position-badge", children: e.position }),
          a("div", {
            children: [
              t("strong", { children: e.name }),
              a("span", { children: [e.hometown, " \xB7 ", e.age, " \xE5r"] }),
            ],
          }),
          t("div", {
            className: "overall-badge",
            children: e.revealed >= 75 || n ? r : "?",
          }),
        ],
      }),
      a("div", {
        className: "player-tags",
        children: [
          t("span", { children: e.personality }),
          a("span", {
            children: ["Potensial ", e.revealed >= 60 || n ? e.potential : "?"],
          }),
          e.captain &&
            t("span", { className: "gold-tag", children: "Kaptein" }),
          e.locked &&
            t("span", { className: "lock-tag", children: "\u{1F512} L\xE5st" }),
          e.starter &&
            t("span", { className: "blue-tag", children: "Starter" }),
          e.injuryWeeks > 0 &&
            a("span", {
              className: "red-tag",
              children: ["Skadet ", e.injuryWeeks, " uker"],
            }),
        ],
      }),
      a("div", {
        className: "stat-row",
        children: [
          a("div", {
            children: [
              t("span", { children: "Attack" }),
              t("b", { children: i(e.attack) }),
            ],
          }),
          a("div", {
            children: [
              t("span", { children: "Defense" }),
              t("b", { children: i(e.defense) }),
            ],
          }),
          a("div", {
            children: [
              t("span", { children: "Stamina" }),
              t("b", { children: i(e.stamina) }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "player-bars",
        children: [
          t(xa, { label: "Condition", value: e.condition }),
          t(xa, { label: "Moral", value: e.morale }),
          t(xa, { label: "Kjemi", value: e.chemistry }),
        ],
      }),
      a("footer", {
        children: [
          a("span", { children: ["L\xF8nn ", h(e.salary), "/uke"] }),
          a("span", { children: [e.contractYears, " \xE5r kontrakt"] }),
        ],
      }),
      s,
    ],
  });
}
function xa({ label: e, value: s }) {
  return a("div", {
    className: "mini-bar",
    children: [
      t("span", { children: e }),
      t("div", { children: t("i", { style: { width: `${b(s, 0, 100)}%` } }) }),
      t("b", { children: Math.round(s) }),
    ],
  });
}
function Ks({ game: e, standings: s }) {
  if (!e.playoffBracket && Nt(e) < 2)
    return a("section", {
      className: "playoff-bracket v21-playoff-preview",
      children: [
        a("div", {
          children: [
            t("p", { className: "eyebrow", children: "Postseason" }),
            t("h3", { children: "Sluttspillbildet \xE5pnes etter to kamper" }),
            t("p", {
              children: `${as(e.leagueIndex)} av ${s.length} lag g\xE5r videre. Ingen seed eller tabellplass er satt f\xF8r sesongen faktisk har startet.`,
            }),
          ],
        }),
        t("span", { children: "INGEN SEED ENN\xC5" }),
      ],
    });
  const n = e.playoffBracket ?? As(e),
    r = (i, d) => {
      if (!d)
        return a("article", {
          className: "bracket-match empty",
          children: [
            t("span", { children: i }),
            t("strong", { children: "Venter p\xE5 forrige runde" }),
          ],
        });
      const u = d.winnerId
          ? d.winnerId === d.home.id
            ? d.home.name
            : d.away.name
          : "",
        g = d.home.id === "user" || d.away.id === "user";
      return a("article", {
        className: `bracket-match ${g ? "user-playoff-match" : ""}`,
        children: [
          t("span", { children: i }),
          a("div", {
            className: d.winnerId === d.home.id ? "winner" : "",
            children: [
              a("b", { children: ["#", d.home.seed] }),
              t("i", { children: d.home.logo }),
              t("strong", { children: d.home.name }),
            ],
          }),
          a("div", {
            className: d.winnerId === d.away.id ? "winner" : "",
            children: [
              a("b", { children: ["#", d.away.seed] }),
              t("i", { children: d.away.logo }),
              t("strong", { children: d.away.name }),
            ],
          }),
          t("small", {
            children: d.score
              ? `${d.score} \xB7 ${u} videre`
              : g
                ? "Din neste utslagskamp"
                : "Ikke spilt",
          }),
        ],
      });
    },
    c = e.seasonStage !== "regular" && e.seasonStage !== "complete";
  return a("section", {
    className: `playoff-bracket v20-playoff-hub ${c ? "live" : ""}`,
    children: [
      a("div", {
        className: "section-heading",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Postseason" }),
              t("h3", {
                children: c
                  ? "Sluttspillet er i gang"
                  : "Veien til mesterskapet",
              }),
              t("p", {
                children:
                  n.format === "top4"
                    ? "Topp 4 g\xE5r rett til semifinalene."
                    : n.format === "top6"
                      ? "Topp 6 g\xE5r videre. Seed 1\u20132 f\xE5r bye."
                      : "Topp 8 spiller kvartfinaler, semifinaler og finale.",
              }),
            ],
          }),
          t("span", {
            children: n.championName
              ? `Mester: ${n.championName}`
              : n.qualified
                ? `Din seed: #${n.userSeed}`
                : e.playoffBracket
                  ? "Ikke kvalifisert"
                  : "Projisert",
          }),
        ],
      }),
      c &&
        a("div", {
          className: "playoff-live-banner",
          children: [
            t(_, { name: "season" }),
            a("div", {
              children: [
                t("strong", {
                  children:
                    e.seasonStage === "quarterfinal"
                      ? "Kvartfinale"
                      : e.seasonStage === "semifinal"
                        ? "Semifinale"
                        : "Mesterskapsfinale",
                }),
                t("span", {
                  children:
                    "Auto-manageren stopper her. Du velger kampforberedelse og simulering selv.",
                }),
              ],
            }),
          ],
        }),
      a("div", {
        className: `bracket-grid format-${n.format}`,
        children: [
          (n.format === "top6" || n.format === "top8") &&
            a("div", {
              className: "bracket-round",
              children: [
                t("h4", { children: "Kvartfinaler" }),
                r("Kvartfinale A", n.quarterfinalA),
                r("Kvartfinale B", n.quarterfinalB),
                n.format === "top8" && r("Kvartfinale C", n.quarterfinalC),
                n.format === "top8" && r("Kvartfinale D", n.quarterfinalD),
              ],
            }),
          (n.format === "top6" || n.format === "top8") &&
            t("div", { className: "bracket-connector", children: "\u2192" }),
          a("div", {
            className: "bracket-round",
            children: [
              t("h4", { children: "Semifinaler" }),
              r("Semifinale A", n.semifinalA),
              r("Semifinale B", n.semifinalB),
            ],
          }),
          t("div", { className: "bracket-connector", children: "\u2192" }),
          a("div", {
            className: "bracket-round",
            children: [
              t("h4", { children: "Finale" }),
              r("Mesterskapsfinale", n.final),
            ],
          }),
        ],
      }),
    ],
  });
}
function jo({ game: e, standings: s }) {
  const [selectedTeamId, setSelectedTeamId] = ge(
      () =>
        e.leagueTeams.find((u) => u.name === e.profile.rivalName)?.id ??
        e.leagueTeams[0]?.id,
    ),
    selectedTeam =
      e.leagueTeams.find((u) => u.id === selectedTeamId) ?? e.leagueTeams[0],
    n = e.wins + e.losses,
    r = as(e.leagueIndex),
    c = s.findIndex((u) => u.id === "user"),
    i = n < 2 ? null : Math.round(Kr(e)),
    d =
      r === 4
        ? "Topp 4 g\xE5r til semifinaler"
        : r === 6
          ? "Topp 6 g\xE5r videre \xB7 seed 1\u20132 f\xE5r bye"
          : "Topp 8 g\xE5r til kvartfinaler";
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "League center",
        title: `${le[e.leagueIndex].logo} ${le[e.leagueIndex].name}`,
        detail: `Sesong ${e.season} \xB7 ${e.seasonStage === "regular" ? `Uke ${e.week}/${oe}` : e.seasonStage === "quarterfinal" ? "Kvartfinale" : e.seasonStage === "semifinal" ? "Semifinale" : e.seasonStage === "final" ? "Finale" : "Offseason"}`,
      }),
      a("div", {
        className: "season-overview",
        children: [
          a("div", {
            className: "standings-card",
            children: [
              t("h3", { children: "Tabell" }),
              n === 0 &&
                a("div", {
                  className: "preseason-table-note",
                  children: [
                    t(_, { name: "calendar" }),
                    a("div", {
                      children: [
                        t("strong", { children: "Sesongen har ikke startet" }),
                        t("span", {
                          children:
                            "Lagene listes forel\xF8pig uten rangering. Sluttspillprognosen \xE5pnes etter to kamper.",
                        }),
                      ],
                    }),
                  ],
                }),
              a("table", {
                children: [
                  t("thead", {
                    children: a("tr", {
                      children: [
                        t("th", { children: "#" }),
                        t("th", { children: "Lag" }),
                        t("th", { children: "W" }),
                        t("th", { children: "L" }),
                        t("th", { children: "Diff" }),
                        t("th", { children: "Form" }),
                      ],
                    }),
                  }),
                  t("tbody", {
                    children: s.map((u, g) =>
                      a(
                        "tr",
                        {
                          className: `${u.id === "user" ? "user-row" : ""} ${n > 0 && g < r ? "playoff-seed" : ""} ${n > 0 && g === r ? "below-playoff-line" : ""}`,
                          children: [
                            t("td", { children: n === 0 ? "\u2013" : g + 1 }),
                            a("td", {
                              children: [
                                t("span", { children: u.logo }),
                                u.name,
                              ],
                            }),
                            t("td", { children: u.wins }),
                            t("td", { children: u.losses }),
                            t("td", {
                              children: u.pointsFor - u.pointsAgainst,
                            }),
                            t("td", {
                              children: u.form.length
                                ? u.form.map((k, y) =>
                                    t(
                                      "i",
                                      {
                                        className: k === "W" ? "win" : "loss",
                                        children: k,
                                      },
                                      y,
                                    ),
                                  )
                                : "\u2014",
                            }),
                          ],
                        },
                        u.id,
                      ),
                    ),
                  }),
                ],
              }),
              a("p", {
                className: "playoff-line",
                children: [
                  d,
                  " \xB7 ",
                  i === null
                    ? "Forh\xE5ndsvurdering \xE5pnes etter uke 2"
                    : `Din sjanse: ${i}% \xB7 n\xE5v\xE6rende seed #${c + 1}`,
                ],
              }),
            ],
          }),
          a("div", {
            className: "league-story living-league-card",
            children: [
              t("h3", { children: "Levende liga" }),
              e.leagueTeams
                .slice()
                .sort((u, g) => g.power - u.power)
                .slice(0, 4)
                .map((u) =>
                  a(
                    "button",
                    {
                      className: `${selectedTeam?.id === u.id ? "selected" : ""} ${u.name === e.profile.rivalName ? "rival" : ""}`,
                      onClick: () => setSelectedTeamId(u.id),
                      children: [
                        t("span", { children: u.logo }),
                        a("p", {
                          children: [
                            t("strong", { children: u.name }),
                            t("small", {
                              children:
                                u.transferActivity ??
                                "Bygger laget for neste utfordring.",
                            }),
                            a("em", {
                              children: [
                                u.strategy === "spender"
                                  ? "Kj\xF8per stjerner"
                                  : u.strategy === "youth"
                                    ? "Satser ungt"
                                    : u.strategy === "draft"
                                      ? "Bygger via draft"
                                      : u.strategy === "defensive"
                                        ? "Defensiv identitet"
                                        : "Balansert",
                                " \xB7 l\xF8nn ",
                                h(u.payroll ?? 0),
                                "/uke",
                              ],
                            }),
                          ],
                        }),
                        a("b", {
                          children: [
                            Math.round(u.power),
                            t("small", { children: h(u.rosterValue ?? 0) }),
                          ],
                        }),
                      ],
                    },
                    u.id,
                  ),
                ),
              selectedTeam &&
                a("section", {
                  className: "opponent-profile-card",
                  children: [
                    a("header", {
                      children: [
                        t("span", { children: selectedTeam.logo }),
                        a("div", {
                          children: [
                            a("h4", {
                              children: [
                                selectedTeam.name,
                                selectedTeam.name === e.profile.rivalName
                                  ? " \xB7 RIVAL"
                                  : "",
                              ],
                            }),
                            t("small", {
                              children: `${selectedTeam.coachName} \xB7 ${selectedTeam.wins}-${selectedTeam.losses}`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    a("div", {
                      children: [
                        ["OVR", Math.round(selectedTeam.power)],
                        ["Angrep", Math.round(selectedTeam.attack)],
                        ["Forsvar", Math.round(selectedTeam.defense)],
                        ["L\xF8nn", h(selectedTeam.payroll ?? 0)],
                      ].map(([u, g]) =>
                        a(
                          "span",
                          {
                            children: [
                              t("small", { children: u }),
                              t("strong", { children: g }),
                            ],
                          },
                          u,
                        ),
                      ),
                    }),
                    t("p", {
                      children: selectedTeam.worldProfile?.offseasonHeadline
                        ? `${selectedTeam.worldProfile.offseasonHeadline}. ${selectedTeam.transferActivity}.`
                        : (selectedTeam.transferActivity ?? "Bygger troppen."),
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      e.leagueFeed?.length > 0 &&
        a("section", {
          className: "league-news-feed",
          children: [
            t("div", {
              className: "section-heading",
              children: a("div", {
                children: [
                  t("p", { className: "eyebrow", children: "League wire" }),
                  t("h3", { children: "Siste fra rivaler og marked" }),
                ],
              }),
            }),
            a("div", {
              children: e.leagueFeed.slice(0, 6).map((u) =>
                a(
                  "article",
                  {
                    className: u.type,
                    children: [
                      t("span", {
                        children:
                          u.type === "rival"
                            ? "\u{1F525}"
                            : u.type === "transfer"
                              ? "\u{1F4DD}"
                              : "\u{1F4F0}",
                      }),
                      a("div", {
                        children: [
                          t("strong", { children: u.headline }),
                          t("p", { children: u.body }),
                        ],
                      }),
                      t("small", {
                        children: `S${u.season} \xB7 U${u.week || "OFF"}`,
                      }),
                    ],
                  },
                  u.id,
                ),
              ),
            }),
          ],
        }),
      t(Ks, { game: e, standings: s }),
      t("h3", { className: "section-title", children: "Terminliste" }),
      t("div", {
        className: "schedule-grid",
        children: e.schedule.map((u) => {
          const g = e.leagueTeams.find((N) => N.id === u.opponentId),
            k = u.played && (u.ourScore ?? 0) > (u.opponentScore ?? 0),
            y = u.played && !k,
            f = u.week === e.week && !u.played;
          return a(
            "article",
            {
              className: `${u.played ? "played" : ""} ${k ? "schedule-win" : ""} ${y ? "schedule-loss" : ""} ${f ? "current" : ""}`,
              children: [
                t("span", {
                  children: u.playoff
                    ? u.playoff === "final"
                      ? "FINAL"
                      : u.playoff === "semifinal"
                        ? "SEMIFINALE"
                        : "KVARTFINALE"
                    : `UKE ${u.week}`,
                }),
                a("strong", { children: [g?.logo, " ", g?.name] }),
                t("small", { children: u.home ? "Hjemme" : "Borte" }),
                t("b", {
                  className: "schedule-result",
                  children: u.played
                    ? `${k ? "W" : "L"} ${u.ourScore}\u2013${u.opponentScore}`
                    : f
                      ? "NEXT"
                      : "\u2014",
                }),
              ],
            },
            `${u.week}-${u.opponentId}-${u.playoff ?? ""}`,
          );
        }),
      }),
    ],
  });
}
function Wo({
  game: e,
  capacity: s,
  onUpgrade: n,
  onStaff: r,
  onSystem: c,
  onPurchase: i,
  locked: d,
}) {
  const u = Qe(e),
    g = Vt(e, u),
    k = On(e, u, !0, "Klart", g),
    y = Ps(e),
    f = e.roster
      .filter((w) => w.injuryWeeks > 0)
      .sort((w, v) => v.injuryWeeks - w.injuryWeeks),
    N =
      e.stadiumOwnership === "rented"
        ? "Leid stadion"
        : e.stadiumOwnership === "owned"
          ? "Klubbeid stadion"
          : "Eget stadionanlegg";
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Stadium & club operations",
        title: ln(e),
        detail: `${N} \xB7 ${Z(s)} plasser \xB7 ${Ct(e)} fasilitetsniv\xE5er`,
      }),
      a("div", {
        className: "stadium-metrics-grid",
        children: [
          t(fe, {
            label: "Kapasitet",
            value: Z(s),
            detail: "Tilgjengelige plasser",
            highlight: !0,
          }),
          t(fe, {
            label: "Neste hjemmekamp",
            value: Z(k.attendance),
            detail: `${Math.round(k.occupancy * 100)}% forventet belegg`,
          }),
          t(fe, {
            label: "Ettersp\xF8rsel",
            value: Z(k.demand),
            detail: k.waitlist
              ? `${Z(k.waitlist)} kan bli uten billett`
              : `${Z(k.unsold)} ledige plasser`,
          }),
          t(fe, {
            label: "Billettpris",
            value: h(g),
            detail:
              e.settings.ticketStrategy === "manual"
                ? "Manuell"
                : "Automatisk priset",
          }),
        ],
      }),
      a("div", {
        className: "stadium-scene v13-stadium-scene",
        children: [
          a("div", {
            className: "stadium-night-lights",
            children: [t("i", {}), t("i", {}), t("i", {}), t("i", {})],
          }),
          a("div", {
            className: "skyline",
            children: [
              t("i", {}),
              t("i", {}),
              t("i", {}),
              t("i", {}),
              t("i", {}),
            ],
          }),
          a("div", {
            className: `stadium-building level-${Math.min(5, Math.max(1, e.upgrades.seats))}`,
            children: [
              t("div", { className: "stadium-roof left" }),
              t("div", { className: "stadium-roof right" }),
              t("div", {
                className: "stadium-screen",
                children: t(Xn, { profile: e.profile }),
              }),
              t("div", {
                className: "stands left",
                children: t("span", {
                  children: Array.from(
                    { length: Math.min(30, Math.round(k.occupancy * 30)) },
                    (w, v) => t("i", {}, v),
                  ),
                }),
              }),
              a("div", {
                className: "pitch",
                children: [
                  t("span", { children: e.profile.clubName }),
                  e.activeSponsor && t("i", { children: e.activeSponsor.name }),
                ],
              }),
              t("div", {
                className: "stands right",
                children: t("span", {
                  children: Array.from(
                    { length: Math.min(30, Math.round(k.occupancy * 30)) },
                    (w, v) => t("i", {}, v),
                  ),
                }),
              }),
              t("div", { className: "stadium-name", children: ln(e) }),
              e.boardsSponsor &&
                t("div", {
                  className: "sponsor-board left-board",
                  children: e.boardsSponsor.name,
                }),
              e.equipmentSponsor &&
                t("div", {
                  className: "sponsor-board right-board",
                  children: e.equipmentSponsor.name,
                }),
            ],
          }),
          a("div", {
            className: "stadium-district-buildings",
            children: [
              a("article", {
                className: e.upgrades.parking ? "active" : "",
                children: [
                  t(_, { name: "building" }),
                  t("span", { children: "Parkering" }),
                ],
              }),
              a("article", {
                className: e.upgrades.food ? "active" : "",
                children: [
                  t(_, { name: "finance" }),
                  t("span", { children: "Matomr\xE5de" }),
                ],
              }),
              a("article", {
                className: e.upgrades.merch ? "active" : "",
                children: [
                  t(_, { name: "sponsor" }),
                  t("span", { children: "Supporterbutikk" }),
                ],
              }),
              a("article", {
                className: e.upgrades.training ? "active" : "",
                children: [
                  t(_, { name: "team" }),
                  t("span", { children: "Treningssenter" }),
                ],
              }),
              a("article", {
                className: e.upgrades.medical ? "active" : "",
                children: [
                  t(_, { name: "alert" }),
                  t("span", { children: "Medisinsk" }),
                ],
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "stadium-ownership-card",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Eierskap" }),
              t("h3", { children: N }),
              t("p", {
                children:
                  e.stadiumOwnership === "rented"
                    ? "Utleier tar en del av kampdagsinntektene. Kj\xF8p gir full kontroll, utbygging og h\xF8yere risiko."
                    : `Klubben beholder st\xF8rre del av kampdagsinntektene. Gjenst\xE5ende stadionl\xE5n: ${h(e.stadiumLoan)}.`,
              }),
            ],
          }),
          e.stadiumOwnership === "rented"
            ? a("div", {
                className: "ownership-options",
                children: [
                  a("button", {
                    onClick: () => i("owned"),
                    disabled: d || e.cash < y.deposit,
                    children: [
                      t("strong", { children: "Kj\xF8p eksisterende" }),
                      a("span", { children: ["Egenkapital ", h(y.deposit)] }),
                      a("small", {
                        children: [
                          "L\xE5n ",
                          h(y.loan),
                          " \xB7 ca. ",
                          h(y.weeklyPayment),
                          "/uke",
                        ],
                      }),
                    ],
                  }),
                  a("button", {
                    onClick: () => i("custom"),
                    disabled: d || e.cash < Math.round(y.deposit * 1.55),
                    children: [
                      t("strong", { children: "Bygg eget stadion" }),
                      a("span", {
                        children: [
                          "Egenkapital ",
                          h(Math.round(y.deposit * 1.55)),
                        ],
                      }),
                      t("small", {
                        children:
                          "St\xF8rre l\xE5n, men +1 tribuneniv\xE5 og full identitet",
                      }),
                    ],
                  }),
                ],
              })
            : a("div", {
                className: "ownership-benefits",
                children: [
                  t("span", { children: "Full utbyggingsrett" }),
                  t("span", { children: "Stadionnavn og arrangementer" }),
                  t("span", { children: "St\xF8rre andel av kampinntektene" }),
                ],
              }),
        ],
      }),
      t("h3", { className: "section-title", children: "Fasiliteter" }),
      t("div", {
        className: "upgrade-grid",
        children: zn.map((w) => {
          const v = e.upgrades[w.id],
            $ = ws(w.id, v);
          return a(
            "button",
            {
              onClick: () => n(w.id),
              disabled: d || e.cash < $,
              children: [
                t("span", { children: w.emoji }),
                t("strong", { children: w.name }),
                t("small", { children: w.description }),
                a("b", { children: ["Niv\xE5 ", v] }),
                t("em", { children: h($) }),
              ],
            },
            w.id,
          );
        }),
      }),
      a("section", {
        className: "rehab-center",
        children: [
          a("div", {
            className: "section-heading",
            children: [
              a("div", {
                children: [
                  t("p", {
                    className: "eyebrow",
                    children: "Medisinsk og rehab",
                  }),
                  t("h3", {
                    children: f.length
                      ? `${f.length} spillere i behandling`
                      : "Troppen er skadefri",
                  }),
                ],
              }),
              a("span", {
                children: ["Medisinsk leder niv\xE5 ", e.staff.medicalDirector],
              }),
            ],
          }),
          f.length
            ? t("div", {
                className: "rehab-player-grid",
                children: f.map((w) =>
                  a(
                    "article",
                    {
                      children: [
                        t("b", { children: w.position }),
                        a("div", {
                          children: [
                            t("strong", { children: w.name }),
                            a("span", {
                              children: [w.injuryWeeks, " uker igjen"],
                            }),
                          ],
                        }),
                        t("small", {
                          children: e.settings.autoRehab
                            ? "Automatisk rehabplan aktiv"
                            : "Manuell oppf\xF8lging",
                        }),
                      ],
                    },
                    w.id,
                  ),
                ),
              })
            : a("div", {
                className: "all-clear",
                children: [
                  t(_, { name: "check" }),
                  a("div", {
                    children: [
                      t("strong", { children: "Ingen aktive skader" }),
                      t("small", {
                        children: "Medisinsk kapasitet brukes forebyggende.",
                      }),
                    ],
                  }),
                ],
              }),
        ],
      }),
      t("h3", {
        className: "section-title",
        children: "Organisasjon og ansatte",
      }),
      t("div", {
        className: "upgrade-grid staff-grid",
        children: sn.map((w) => {
          const v = e.staff[w.id],
            $ = ga(w.id, v);
          return a(
            "button",
            {
              onClick: () => r(w.id),
              disabled: d || e.cash < $,
              children: [
                t("span", { children: w.emoji }),
                t("strong", { children: w.name }),
                t("small", { children: w.description }),
                a("b", { children: ["Niv\xE5 ", v] }),
                a("em", {
                  children: [h($), " \xB7 ", h(w.salary * (v + 1)), "/uke"],
                }),
              ],
            },
            w.id,
          );
        }),
      }),
      t("h3", { className: "section-title", children: "Systeminvesteringer" }),
      t("div", {
        className: "system-investment-grid",
        children: Cn.map((w) => {
          const v = e.systemInvestments[w.id],
            $ = ba(w.id, v);
          return a(
            "article",
            {
              children: [
                a("div", {
                  children: [
                    t(_, {
                      name:
                        w.id === "ticketing"
                          ? "ticket"
                          : w.id === "financeSuite"
                            ? "finance"
                            : w.id === "scoutingDb"
                              ? "search"
                              : w.id === "supporterCrm"
                                ? "team"
                                : w.id === "performanceLab"
                                  ? "chart"
                                  : "alert",
                    }),
                    a("span", { children: ["Niv\xE5 ", v, "/3"] }),
                  ],
                }),
                t("h3", { children: w.name }),
                t("p", { children: w.description }),
                t("button", {
                  onClick: () => c(w.id),
                  disabled: d || v >= 3 || e.cash < $,
                  children: v >= 3 ? "Maksniv\xE5" : `Invester ${h($)}`,
                }),
              ],
            },
            w.id,
          );
        }),
      }),
    ],
  });
}
function Bo({ game: e, mood: s, salary: n, onMeeting: r, onStrategy: c }) {
  const i = Ds(e),
    d = po(e),
    u = Ln(e),
    g = Math.max(1, e.nextBoardMeetingWeek - e.week),
    k =
      i.financial < 48
        ? "\xF8konomien"
        : i.sporting < 48
          ? "resultatene"
          : i.culture < 48
            ? "supporterutviklingen"
            : "";
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Styre og forventninger",
        title: "Rolig kontroll \u2013 ikke et eget minispill",
        detail:
          "Styret f\xF8lger resultat, \xF8konomi og klubbkultur. Du trenger bare \xE5 handle n\xE5r en tydelig sak dukker opp.",
      }),
      a("section", {
        className: `simple-board-overview ${e.boardTrust < 40 ? "danger" : e.boardTrust < 60 ? "warning" : ""}`,
        children: [
          a("div", {
            className: "simple-board-score",
            children: [
              t("span", { children: "Jobbsikkerhet" }),
              a("strong", { children: [Math.round(e.boardTrust), "%"] }),
              t("small", { children: s.label }),
            ],
          }),
          a("div", {
            children: [
              t("p", {
                className: "eyebrow",
                children: "Styrelederens vurdering",
              }),
              t("h3", {
                children: k
                  ? `Styret vil se bedre kontroll p\xE5 ${k}.`
                  : "Klubben beveger seg i riktig retning.",
              }),
              t("p", { children: d.headline }),
            ],
          }),
          a("div", {
            className: "simple-board-next-date",
            children: [
              t("span", { children: "Neste vurdering" }),
              t("strong", {
                children: e.boardMeeting
                  ? "Sak klar n\xE5"
                  : `Om ${g} uke${g === 1 ? "" : "r"}`,
              }),
              t("small", {
                children: "Kun sesongstart, midtveis, sesongslutt eller krise",
              }),
            ],
          }),
        ],
      }),
      a("section", {
        className: "board-simple-goals",
        children: [
          t("div", {
            className: "section-heading",
            children: a("div", {
              children: [
                t("p", {
                  className: "eyebrow",
                  children: "Sesongens tre hovedm\xE5l",
                }),
                t("h3", {
                  children: "Dette er det styret faktisk m\xE5ler deg p\xE5",
                }),
              ],
            }),
          }),
          a("div", {
            className: "goal-grid simple-three-goals",
            children: [
              t(ja, {
                label: "Seire",
                current: e.wins,
                target: e.boardGoals.wins,
              }),
              t(ja, {
                label: "Supportere",
                current: e.fans,
                target: e.boardGoals.fans,
              }),
              t(ja, {
                label: "Kontantreserve",
                current: e.cash,
                target: e.boardGoals.cash,
                money: !0,
              }),
            ],
          }),
          a("div", {
            className: "board-cap-line",
            children: [
              t("span", { children: "Salary cap" }),
              a("strong", {
                children: [h(n), " / ", h(e.boardGoals.salaryCap)],
              }),
              t("em", {
                className:
                  n <= e.boardGoals.salaryCap ? "positive" : "negative",
                children:
                  n <= e.boardGoals.salaryCap
                    ? "Innenfor rammen"
                    : `${h(n - e.boardGoals.salaryCap)} over`,
              }),
            ],
          }),
        ],
      }),
      e.boardMeeting
        ? a("section", {
            className: "simple-board-meeting",
            children: [
              a("div", {
                className: "section-heading",
                children: [
                  a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Styresak \u2013 krever ett valg",
                      }),
                      t("h3", { children: e.boardMeeting.title }),
                      t("p", { children: e.boardMeeting.text }),
                    ],
                  }),
                  t("span", { children: "VELG \xC9N" }),
                ],
              }),
              t("div", {
                children: e.boardMeeting.choices.slice(0, 3).map((y) =>
                  a(
                    "button",
                    {
                      onClick: () => r(y.id),
                      children: [
                        t("strong", { children: y.label }),
                        t("small", { children: y.detail }),
                      ],
                    },
                    y.id,
                  ),
                ),
              }),
            ],
          })
        : a("section", {
            className: "simple-board-next",
            children: [
              t(_, { name: "calendar" }),
              a("div", {
                children: [
                  t("strong", { children: "Ingen styresak krever svar" }),
                  t("p", {
                    children:
                      "Styret reagerer i bakgrunnen p\xE5 resultatene dine. Fanen trenger ikke sjekkes hver uke.",
                  }),
                ],
              }),
            ],
          }),
      a("section", {
        className: "board-direction-card",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Klubbretning" }),
              t("h3", { children: "\xC9n overordnet prioritering" }),
              t("p", {
                children:
                  "Dette p\xE5virker m\xE5lene og hvilke tiltak styret st\xF8tter. Endre bare n\xE5r klubbens retning faktisk skal skifte.",
              }),
            ],
          }),
          t("div", {
            className: "board-direction-options",
            children: Object.keys(_n).map((y) => {
              const f = _n[y];
              return a(
                "button",
                {
                  className: e.boardStrategy === y ? "active" : "",
                  onClick: () => e.boardStrategy !== y && c(y),
                  children: [
                    t("span", { children: f.short }),
                    t("strong", { children: f.label }),
                    t("small", { children: f.priority }),
                  ],
                },
                y,
              );
            }),
          }),
        ],
      }),
      a("details", {
        className: "advanced-board-details",
        open: !1,
        children: [
          a("summary", {
            children: [
              t("span", {
                children: u
                  ? "Avansert styrearbeid"
                  : "Avansert styrearbeid \u2013 l\xE5st",
              }),
              t("small", {
                children: u
                  ? "Tillit, historikk og budsjettfordeling"
                  : "Krever 1 000 supportere eller opprykk",
              }),
            ],
          }),
          u
            ? a("div", {
                className: "advanced-board-content",
                children: [
                  a("div", {
                    className: "board-trust-mini-grid",
                    children: [
                      a("article", {
                        children: [
                          t("span", { children: "Sportslig" }),
                          a("strong", { children: [i.sporting, "%"] }),
                        ],
                      }),
                      a("article", {
                        children: [
                          t("span", { children: "\xD8konomisk" }),
                          a("strong", { children: [i.financial, "%"] }),
                        ],
                      }),
                      a("article", {
                        children: [
                          t("span", { children: "Kultur" }),
                          a("strong", { children: [i.culture, "%"] }),
                        ],
                      }),
                    ],
                  }),
                  a("section", {
                    children: [
                      t("h3", { children: "Gjeldende budsjettfordeling" }),
                      a("p", {
                        children: [
                          "Spillere ",
                          e.boardBudget.players,
                          "% \xB7 ansatte ",
                          e.boardBudget.staff,
                          "% \xB7 anlegg ",
                          e.boardBudget.facilities,
                          "% \xB7 kommersielt ",
                          e.boardBudget.commercial,
                          "% \xB7 reserve ",
                          e.boardBudget.reserve,
                          "%.",
                        ],
                      }),
                    ],
                  }),
                  a("section", {
                    children: [
                      t("h3", { children: "Siste vedtak" }),
                      e.boardDecisionHistory.slice(0, 5).map((y) =>
                        a(
                          "p",
                          {
                            children: [
                              a("strong", {
                                children: [
                                  "S",
                                  y.season,
                                  " U",
                                  y.week,
                                  ": ",
                                  y.title,
                                ],
                              }),
                              " \u2013 ",
                              y.detail,
                            ],
                          },
                          y.id,
                        ),
                      ),
                    ],
                  }),
                ],
              })
            : a("div", {
                className: "advanced-board-locked",
                children: [
                  t(_, { name: "board" }),
                  t("p", {
                    children:
                      "Grunnstyret er allerede aktivt. Medlemmer, avstemninger og avanserte forhandlinger \xE5pnes f\xF8rst n\xE5r klubben er stor nok til at systemet gir mening.",
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
function ja({ label: e, current: s, target: n, money: r, inverted: c }) {
  const i = b(
    c ? (n / Math.max(1, s)) * 100 : (s / Math.max(1, n)) * 100,
    0,
    100,
  );
  return a("article", {
    children: [
      a("div", {
        children: [
          t("span", { children: e }),
          a("b", { children: [r ? h(s) : Z(s), " / ", r ? h(n) : Z(n)] }),
        ],
      }),
      t("div", {
        className: "goal-track",
        children: t("i", { style: { width: `${i}%` } }),
      }),
    ],
  });
}
function Ao({
  game: e,
  salary: s,
  staffCost: n,
  section: r,
  setSection: c,
  slotFilter: i,
  setSlotFilter: d,
  onPricing: u,
  onSponsor: g,
  onRenew: k,
  onTv: y,
  onLoan: f,
  onPayDebt: N,
  onRescue: rescue,
  onNavigate: w,
}) {
  const [v, $] = ge(null),
    [D, q] = ge(null),
    x = pe(e, s, n),
    R = Le(e),
    E = ["main", "kit", "boards", "stadium"],
    T = i === "all" ? E : [i],
    Y = (P) =>
      e.reputation >= P.minReputation &&
      x.expectedAttendance >= P.minAttendance,
    ae = e.sponsorOffers.filter((P) => Xe(e, P.slot) && !_e(e, P.slot) && Y(P)),
    B = (P) => e.sponsorOffers.filter((V) => V.slot === P),
    W = (P) => B(P).filter(Y),
    L = (P) =>
      [...B(P)].sort(
        (V, de) =>
          Math.max(0, V.minReputation - e.reputation) +
          Math.max(0, V.minAttendance - x.expectedAttendance) / 100 -
          (Math.max(0, de.minReputation - e.reputation) +
            Math.max(0, de.minAttendance - x.expectedAttendance) / 100),
      )[0],
    U = (P) => {
      const V = L(P);
      return V
        ? e.reputation < V.minReputation
          ? `Neste tilbud krever klubbprofil ${V.minReputation}`
          : x.expectedAttendance < V.minAttendance
            ? `Neste tilbud krever ${Z(V.minAttendance)} publikum`
            : "Et tilbud er klart"
        : "Ingen tilbud akkurat n\xE5";
    },
    G = e.sponsorOffers
      .filter(
        (P) =>
          (i === "all" || P.slot === i) &&
          Xe(e, P.slot) &&
          !_e(e, P.slot) &&
          Y(P),
      )
      .sort((P, V) => {
        const de =
          e.reputation >= P.minReputation &&
          x.expectedAttendance >= P.minAttendance
            ? 1
            : 0;
        return (
          (e.reputation >= V.minReputation &&
          x.expectedAttendance >= V.minAttendance
            ? 1
            : 0) - de ||
          V.weeklyPay * V.weeks +
            V.signingBonus -
            (P.weeklyPay * P.weeks + P.signingBonus)
        );
      }),
    re = e.sponsorOffers.find((P) => P.id === v),
    he = D ? _e(e, D) : void 0,
    O = Math.max(
      1,
      ...e.financialHistory.map((P) => Math.max(P.income, P.expenses)),
    ),
    Q = x.ticketRevenue + x.vipRevenue + x.foodRevenue + x.merchRevenue,
    De = x.sponsorRevenue + x.tvRevenue,
    Ae = Math.max(0, x.expensesBeforeDebt - s - n),
    Ge =
      x.profit >= 0
        ? {
            label: "\xD8konomien er under kontroll",
            text: `Klubben forventer ${h(x.profit)} i overskudd per kampuke.`,
            className: "good",
          }
        : x.runwayWeeks !== null && x.runwayWeeks < 6
          ? {
              label: "Kontantene varer ikke lenge",
              text: `Med dagens drift varer kontantene omtrent ${x.runwayWeeks.toFixed(1)} uker.`,
              className: "danger",
            }
          : {
              label: "Klubben taper penger",
              text: `Forventet underskudd er ${h(Math.abs(x.profit))} per kampuke.`,
              className: "warning",
            },
    $e =
      x.profit < 0
        ? !e.activeSponsor && W("main").length > 0
          ? {
              title: "Signer en hovedsponsor f\xF8rst",
              text: "Du har et tilbud du kvalifiserer til. En sponsor kan redusere underskuddet direkte.",
              action: "Se sponsortilbud",
            }
          : x.salaryShare > 55
            ? {
                title: "Spillerl\xF8nnen er for h\xF8y",
                text: `${Math.round(x.salaryShare)}% av forventet inntekt g\xE5r til spillerl\xF8nn. Selg eller frigi dyre reserver f\xF8r nye kj\xF8p.`,
                action: "\xC5pne spillerstallen",
              }
            : {
                title: "Stopp nye investeringer",
                text: "Behold kontantreserve, vurder billettpris og vent med anlegg til driften er stabil.",
                action: "Se priser",
              }
        : {
            title: "Du kan investere kontrollert",
            text: `Behold minst ${h(Math.max(5e3, x.expenses * 3))} som reserve f\xF8r du signerer spillere eller bygger ut.`,
            action: "\xD8konomien er trygg",
          },
    xe = getBroadcastDeals(e.leagueIndex),
    debtSnapshot = getDebtSnapshot(e),
    loanDashboard = getLoanDashboard(e, {
      income: x.income,
      expenses: x.expensesBeforeDebt,
      operatingProfit: x.operatingProfit,
    }),
    latestMedia = e.mediaLedger?.[0],
    nextMedia = Cs(e, Qe(e), mn(e), !1),
    He = (P, V) => {
      const de = P === "safe" ? 82 : P === "balanced" ? 58 : 32,
        te =
          e.staff.cfo * 3.5 +
          e.staff.marketing * 3 +
          e.staff.commercialDirector * 4.5 +
          e.reputation / 5,
        Me =
          (V.negotiationAttempts ?? 0) * 12 +
          (e.profile.difficulty === "hardcore"
            ? 8
            : e.profile.difficulty === "casual"
              ? -6
              : 0);
      return Math.round(b(de + te - Me, 15, 94));
    };
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Klubbdrift",
        title: "\xD8konomi",
        detail:
          "Alle prognoser vises per kampuke. Engangskostnader og signeringsbonuser merkes separat.",
      }),
      a("nav", {
        className: "finance-subnav simple-finance-nav",
        "aria-label": "\xD8konomiseksjoner",
        children: [
          a("button", {
            className: r === "overview" ? "active" : "",
            onClick: () => c("overview"),
            children: [t(_, { name: "chart" }), " Oversikt"],
          }),
          a("button", {
            className: r === "sponsors" ? "active" : "",
            onClick: () => {
              (d("all"), c("sponsors"));
            },
            children: [
              t(_, { name: "sponsor" }),
              " Sponsorer ",
              t("span", { children: R.length }),
            ],
          }),
          a("button", {
            className: r === "pricing" ? "active" : "",
            onClick: () => c("pricing"),
            children: [t(_, { name: "ticket" }), " Priser"],
          }),
          a("button", {
            className: r === "loans" ? "active" : "",
            onClick: () => c("loans"),
            children: [
              t(_, { name: "finance" }),
              " Finansiering ",
              debtSnapshot.totalDebt > 0 &&
                t("span", { children: h(debtSnapshot.totalDebt) }),
            ],
          }),
        ],
      }),
      r === "overview" &&
        a(X, {
          children: [
            a("section", {
              className: `finance-clarity-hero ${Ge.className}`,
              children: [
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: "Slik ligger du an",
                    }),
                    t("h2", { children: Ge.label }),
                    t("p", { children: Ge.text }),
                  ],
                }),
                a("strong", {
                  className: x.profit >= 0 ? "positive" : "negative",
                  children: [
                    x.profit >= 0 ? "+" : "",
                    h(x.profit),
                    t("small", { children: "per kampuke" }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "finance-clarity-kpis",
              children: [
                a("article", {
                  children: [
                    t("span", { children: "Penger p\xE5 konto" }),
                    t("strong", { children: h(e.cash) }),
                    t("small", {
                      children:
                        "Saldo nå. Ukesresultatet bokføres først etter neste kamp.",
                    }),
                  ],
                }),
                a("article", {
                  children: [
                    t("span", { children: "Reserve / fritt beløp" }),
                    t("strong", {
                      className: x.freeCash > 0 ? "positive" : "warning",
                      children: h(x.freeCash),
                    }),
                    t("small", {
                      children: `${h(x.recommendedReserve)} anbefalt reserve`,
                    }),
                  ],
                }),
                a("article", {
                  children: [
                    t("span", { children: "Sesongprognose" }),
                    a("strong", {
                      className: x.seasonProfit >= 0 ? "positive" : "negative",
                      children: [
                        x.seasonProfit >= 0 ? "+" : "",
                        h(x.seasonProfit),
                      ],
                    }),
                    a("small", {
                      children: [x.remainingGames, " kampuker gjenst\xE5r"],
                    }),
                  ],
                }),
                a("article", {
                  children: [
                    t("span", { children: "Gjeldstrekk" }),
                    t("strong", { children: h(x.debtPayment) }),
                    a("small", {
                      children: [
                        h(debtSnapshot.totalDebt),
                        " i samlet restgjeld",
                      ],
                    }),
                  ],
                }),
                a("article", {
                  children: [
                    t("span", { children: "Kontantbuffer" }),
                    t("strong", {
                      children:
                        x.runwayWeeks === null
                          ? "Stabil"
                          : `${x.runwayWeeks.toFixed(1)} uker`,
                    }),
                    t("small", {
                      children:
                        x.runwayWeeks === null
                          ? "Positiv drift"
                          : "Ved dagens underskudd",
                    }),
                  ],
                }),
                a("article", {
                  children: [
                    t("span", { children: "Klubbens l\xF8nnsbudsjett" }),
                    t("strong", {
                      className: me(e) - s >= 0 ? "positive" : "negative",
                      children: h(me(e) - s),
                    }),
                    a("small", {
                      children: [
                        h(s),
                        "/uke \xB7 liga-cap ",
                        h(e.boardGoals.salaryCap),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "finance-breakdown-grid",
              children: [
                a("section", {
                  children: [
                    a("div", {
                      className: "section-heading",
                      children: [
                        a("div", {
                          children: [
                            t("p", {
                              className: "eyebrow",
                              children: "Penger inn",
                            }),
                            t("h3", { children: "Forventede inntekter" }),
                          ],
                        }),
                        t("strong", {
                          className: "positive",
                          children: h(x.income),
                        }),
                      ],
                    }),
                    t(Pe, {
                      label: "Kampdag: billetter, mat og merch",
                      value: Q,
                      positive: !0,
                    }),
                    t(Pe, {
                      label: "Sponsorer",
                      value: x.sponsorRevenue,
                      positive: !0,
                    }),
                    t(Pe, {
                      label: "Medier: fastbeløp, CPM og ligafordeling",
                      value: x.tvRevenue,
                      positive: !0,
                    }),
                    t(Pe, {
                      label: "Totalt per kampuke",
                      value: x.income,
                      positive: !0,
                      strong: !0,
                    }),
                  ],
                }),
                a("section", {
                  children: [
                    a("div", {
                      className: "section-heading",
                      children: [
                        a("div", {
                          children: [
                            t("p", {
                              className: "eyebrow",
                              children: "Penger ut",
                            }),
                            t("h3", { children: "Forventede utgifter" }),
                          ],
                        }),
                        t("strong", {
                          className: "negative",
                          children: h(x.expenses),
                        }),
                      ],
                    }),
                    t(Pe, { label: "Spillerl\xF8nn", value: s, expense: !0 }),
                    t(Pe, { label: "Ansatte", value: n, expense: !0 }),
                    t(Pe, {
                      label: "Drift, vedlikehold og kamp",
                      value: Ae,
                      expense: !0,
                    }),
                    x.debtPayment > 0 &&
                      t(Pe, {
                        label: "Automatiske renter og avdrag",
                        value: x.debtPayment,
                        expense: !0,
                      }),
                    t(Pe, {
                      label: "Totalt per kampuke",
                      value: x.expenses,
                      expense: !0,
                      strong: !0,
                    }),
                  ],
                }),
              ],
            }),
            a("section", {
              className: `finance-next-step ${x.profit < 0 ? "warning" : "good"}`,
              children: [
                t(_, { name: x.profit < 0 ? "alert" : "check" }),
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: "Anbefalt neste steg",
                    }),
                    t("h3", { children: $e.title }),
                    t("p", { children: $e.text }),
                  ],
                }),
                a("div", {
                  className: "finance-action-buttons",
                  children: [
                    t("button", {
                      onClick: () =>
                        $e.action === "Se sponsortilbud"
                          ? c("sponsors")
                          : $e.action === "Se priser"
                            ? c("pricing")
                            : $e.action === "\xC5pne spillerstallen"
                              ? w("team")
                              : void 0,
                      children: $e.action,
                    }),
                    x.profit < 0 &&
                      (x.runwayWeeks ?? 99) < 4 &&
                      t("button", {
                        className: "danger-button",
                        onClick: () => c("loans"),
                        children: "Se finansiering",
                      }),
                  ],
                }),
              ],
            }),
            a("section", {
              className: "cash-forecast-v22",
              children: [
                a("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", { className: "eyebrow", children: "Likviditet" }),
                      t("h3", { children: "Fire ukers kontantprognose" }),
                      t("p", {
                        children:
                          "Prognosen bruker dagens drift, medieinntekt og obligatoriske gjeldstrekk.",
                      }),
                    ],
                  }),
                }),
                t("div", {
                  children: x.cashForecast.map((P) =>
                    a(
                      "article",
                      {
                        className: P.cash < 0 ? "danger" : "",
                        children: [
                          a("span", { children: ["Uke +", P.week] }),
                          t("strong", { children: h(P.cash) }),
                        ],
                      },
                      P.week,
                    ),
                  ),
                }),
              ],
            }),
            a("details", {
              className: "finance-details",
              children: [
                t("summary", { children: "Vis historikk og n\xF8kkeltall" }),
                a("div", {
                  className: "finance-detail-stats",
                  children: [
                    a("span", {
                      children: [
                        "L\xF8nn av inntekt ",
                        a("b", { children: [Math.round(x.salaryShare), "%"] }),
                      ],
                    }),
                    a("span", {
                      children: [
                        "Klubbens l\xF8nnsbudsjett ",
                        t("b", { children: h(me(e)) }),
                      ],
                    }),
                    a("span", {
                      children: [
                        "Sponsoravhengighet ",
                        a("b", {
                          children: [Math.round(x.sponsorDependency), "%"],
                        }),
                      ],
                    }),
                    a("span", {
                      children: [
                        "Nullpunkt publikum ",
                        t("b", { children: Z(x.breakEvenAttendance) }),
                      ],
                    }),
                    a("span", {
                      children: [
                        "Forventet publikum ",
                        t("b", { children: Z(x.expectedAttendance) }),
                      ],
                    }),
                  ],
                }),
                t("div", {
                  className: "finance-chart",
                  children: e.financialHistory.length
                    ? e.financialHistory.map((P) =>
                        a(
                          "div",
                          {
                            children: [
                              a("div", {
                                className: "bars",
                                children: [
                                  t("i", {
                                    className: "income",
                                    style: {
                                      height: `${(P.income / O) * 100}%`,
                                    },
                                  }),
                                  t("i", {
                                    className: "expense",
                                    style: {
                                      height: `${(P.expenses / O) * 100}%`,
                                    },
                                  }),
                                ],
                              }),
                              t("span", {
                                children: P.label
                                  .replace("S", "")
                                  .replace(" U", "/"),
                              }),
                              t("b", {
                                className:
                                  P.profit >= 0 ? "positive" : "negative",
                                children: h(P.profit),
                              }),
                            ],
                          },
                          P.label,
                        ),
                      )
                    : t("p", {
                        children:
                          "Spill f\xF8rste kamp for \xE5 bygge historikk.",
                      }),
                }),
              ],
            }),
          ],
        }),
      r === "sponsors" &&
        a(X, {
          children: [
            a("section", {
              className: "sponsor-simple-intro",
              children: [
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: "Sponsoravtaler",
                    }),
                    t("h2", { children: "F\xE6rre avtaler, tydeligere valg" }),
                    a("p", {
                      children: [
                        "Sponsorflatene f\xF8lger klubbens st\xF8rrelse og base. ",
                        Be(e.clubBase).name,
                        " bestemmer hva du faktisk kan selge. Nye avtaler og fornyelser kan forhandles, men sponsoren kan trekke seg.",
                      ],
                    }),
                  ],
                }),
                a("div", {
                  children: [
                    t("span", { children: "Fast inntekt" }),
                    a("strong", { children: [h(x.sponsorRevenue), "/uke"] }),
                    a("small", { children: [R.length, " aktiv(e) avtale(r)"] }),
                  ],
                }),
              ],
            }),
            a("section", {
              className: "club-profile-explainer",
              children: [
                a("div", {
                  children: [
                    t("span", { children: "Klubbprofil" }),
                    a("strong", {
                      children: [Math.round(e.reputation), "/100"],
                    }),
                    t("small", {
                      children:
                        e.reputation >= 45
                          ? "Nasjonalt attraktiv"
                          : e.reputation >= 25
                            ? "Regional profil"
                            : "Lokal profil",
                    }),
                  ],
                }),
                a("p", {
                  children: [
                    "Profilen \xF8ker gjennom resultater, supportervekst, liganiv\xE5, gode sponsorforhold og profesjonell klubbdrift. Dagens base: ",
                    t("b", { children: Be(e.clubBase).name }),
                    ".",
                  ],
                }),
              ],
            }),
            a("nav", {
              className: "sponsor-slot-filter simple-slot-filter",
              children: [
                a("button", {
                  className: i === "all" ? "active" : "",
                  onClick: () => d("all"),
                  children: [
                    t("span", { children: "Tilgjengelige tilbud" }),
                    t("small", { children: ae.length }),
                  ],
                }),
                E.map((P) => {
                  const V = W(P).length;
                  return a(
                    "button",
                    {
                      className: i === P ? "active" : "",
                      onClick: () => d(P),
                      children: [
                        t("span", { children: we(P) }),
                        t("small", {
                          children: _e(e, P)
                            ? "Aktiv"
                            : Xe(e, P)
                              ? V
                                ? `${V} tilgjengelig${V === 1 ? "" : "e"}`
                                : U(P).replace(
                                    "Neste tilbud krever ",
                                    "Krever ",
                                  )
                              : "L\xE5st",
                        }),
                      ],
                    },
                    P,
                  );
                }),
              ],
            }),
            t("div", {
              className: "simple-sponsor-slots",
              children: T.map((P) => {
                const V = _e(e, P),
                  de = Xe(e, P),
                  te = W(P).length;
                return a(
                  "article",
                  {
                    className: `${V ? "active" : ""} ${de ? "" : "locked"} ${de && !V && te === 0 ? "unavailable" : ""}`,
                    children: [
                      a("header", {
                        children: [
                          t("span", {
                            children:
                              P === "main"
                                ? "HOVED"
                                : P === "kit"
                                  ? "LOKAL"
                                  : P === "boards"
                                    ? "ARENA"
                                    : "NAVN",
                          }),
                          t("strong", { children: we(P) }),
                        ],
                      }),
                      V
                        ? a(X, {
                            children: [
                              t("h3", { children: V.name }),
                              a("div", {
                                className: "active-sponsor-meta",
                                children: [
                                  a("div", {
                                    children: [
                                      t("span", { children: "Fast betaling" }),
                                      a("strong", {
                                        children: [h(V.weeklyPay), "/uke"],
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", {
                                        children: "Avtalen l\xF8per",
                                      }),
                                      t("strong", {
                                        children:
                                          (V.seasonsLeft ?? 1) <= 0
                                            ? "Utl\xF8pt"
                                            : `${V.seasonsLeft} sesong${V.seasonsLeft === 1 ? "" : "er"}`,
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "Relasjon" }),
                                      a("strong", {
                                        children: [
                                          Math.round(V.relationship ?? 60),
                                          "/100",
                                        ],
                                      }),
                                    ],
                                  }),
                                  a("div", {
                                    children: [
                                      t("span", { children: "Fornyet" }),
                                      a("strong", {
                                        children: [
                                          V.seasonsTogether ?? 0,
                                          " gang",
                                          (V.seasonsTogether ?? 0) === 1
                                            ? ""
                                            : "er",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              a("div", {
                                className: "sponsor-requirement-box",
                                children: [
                                  t("span", { children: "Avtalekrav" }),
                                  t("strong", { children: V.requirement }),
                                ],
                              }),
                              e.phase === "offseason" &&
                              (V.seasonsLeft ?? 1) <= 0
                                ? t("button", {
                                    className: "open-renewal-button",
                                    onClick: () => {
                                      ($(null), q(P));
                                    },
                                    children: "\xC5pne fornyelsesforhandling",
                                  })
                                : t("small", {
                                    className: "renewal-window-note",
                                    children:
                                      "Fornyelse h\xE5ndteres i offseason n\xE5r avtalen utl\xF8per.",
                                  }),
                            ],
                          })
                        : de
                          ? te
                            ? a(X, {
                                children: [
                                  t("h3", { children: "Tilbud klart" }),
                                  a("p", {
                                    children: [
                                      te,
                                      " avtale",
                                      te === 1 ? "" : "r",
                                      " kan signeres eller forhandles n\xE5.",
                                    ],
                                  }),
                                ],
                              })
                            : a(X, {
                                children: [
                                  t("h3", {
                                    children: "Ikke tilgjengelig enn\xE5",
                                  }),
                                  a("p", { children: [U(P), "."] }),
                                ],
                              })
                          : a(X, {
                              children: [
                                t("h3", { children: "L\xE5st" }),
                                t("p", { children: la(P) }),
                              ],
                            }),
                    ],
                  },
                  P,
                );
              }),
            }),
            he &&
              D &&
              a("section", {
                className: "sponsor-renewal-panel",
                children: [
                  a("div", {
                    className: "section-heading",
                    children: [
                      a("div", {
                        children: [
                          a("p", {
                            className: "eyebrow",
                            children: ["Fornyelse med ", he.name],
                          }),
                          t("h3", {
                            children:
                              "Sammenlign vilk\xE5rene f\xF8r du velger",
                          }),
                          a("p", {
                            children: [
                              "N\xE5v\xE6rende avtale: ",
                              h(he.weeklyPay),
                              "/uke \xB7 relasjon ",
                              Math.round(he.relationship ?? 60),
                              "/100.",
                            ],
                          }),
                        ],
                      }),
                      t("button", {
                        className: "soft-button",
                        onClick: () => q(null),
                        children: "Lukk",
                      }),
                    ],
                  }),
                  t("div", {
                    className: "renewal-comparison-grid",
                    children: ["safe", "balanced", "aggressive"].map((P) => {
                      const V = ia(e, he, P);
                      return a(
                        "button",
                        {
                          onClick: () => {
                            (k(D, P), q(null));
                          },
                          children: [
                            a("header", {
                              children: [
                                t("strong", { children: V.label }),
                                a("span", {
                                  className:
                                    V.chance >= 75
                                      ? "positive"
                                      : V.chance >= 50
                                        ? ""
                                        : "negative",
                                  children: [V.chance, "% aksept"],
                                }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Ny betaling" }),
                                a("b", { children: [h(V.weeklyPay), "/uke"] }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Varighet" }),
                                a("b", {
                                  children: [
                                    V.extension,
                                    " sesong",
                                    V.extension === 1 ? "" : "er",
                                  ],
                                }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Lojalitetsbonus" }),
                                t("b", { children: h(V.renewalBonus) }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Total verdi" }),
                                t("b", { children: h(V.totalValue) }),
                              ],
                            }),
                            a("small", {
                              children: [
                                "Risiko for forholdet: ",
                                V.relationRisk,
                              ],
                            }),
                          ],
                        },
                        P,
                      );
                    }),
                  }),
                  t("p", {
                    className: "negotiation-warning",
                    children:
                      "Et avslag avslutter den utl\xF8pte avtalen. Du kan deretter velge en ny partner f\xF8r sesongstart.",
                  }),
                ],
              }),
            re &&
              a("section", {
                className: "sponsor-negotiation-panel",
                children: [
                  a("div", {
                    className: "section-heading",
                    children: [
                      a("div", {
                        children: [
                          a("p", {
                            className: "eyebrow",
                            children: ["Forhandling med ", re.name],
                          }),
                          t("h3", {
                            children: "Originaltilbud mot tre mulige motbud",
                          }),
                          a("p", {
                            children: [
                              "Originalt: ",
                              h(re.weeklyPay),
                              "/uke \xB7 ",
                              re.seasons,
                              " sesong$",
                              re.seasons === 1 ? "" : "er",
                              " \xB7 bonus ",
                              h(re.signingBonus),
                              ".",
                            ],
                          }),
                        ],
                      }),
                      t("button", {
                        className: "soft-button",
                        onClick: () => $(null),
                        children: "Lukk",
                      }),
                    ],
                  }),
                  a("div", {
                    className: "negotiation-baseline",
                    children: [
                      a("div", {
                        children: [
                          t("span", { children: "Sikker l\xF8sning" }),
                          t("strong", { children: "Godta originaltilbudet" }),
                          a("small", {
                            children: [
                              "Ingen risiko for avslag. Total verdi ",
                              h(re.weeklyPay * re.weeks + re.signingBonus),
                              ".",
                            ],
                          }),
                        ],
                      }),
                      t("button", {
                        onClick: () => {
                          (g(re.id, "accept"), $(null));
                        },
                        children: "Godta originalt",
                      }),
                    ],
                  }),
                  t("div", {
                    className: "negotiation-options",
                    children: [
                      [
                        "safe",
                        "Trygt motbud",
                        1.05,
                        0.85,
                        "Liten forbedring og lav risiko.",
                      ],
                      [
                        "balanced",
                        "Balansert motbud",
                        1.12,
                        0.95,
                        "Bedre betaling med reell avslagssjanse.",
                      ],
                      [
                        "aggressive",
                        "Aggressivt motbud",
                        1.23,
                        0.8,
                        "H\xF8y betaling, men tilbudet kan trekkes.",
                      ],
                    ].map(([P, V, de, te, Me]) => {
                      const nt = Math.round(re.weeklyPay * de),
                        Ht = Math.round(re.signingBonus * te),
                        gt = nt * re.weeks + Ht,
                        Ue = He(P, re);
                      return a(
                        "button",
                        {
                          onClick: () => {
                            (g(re.id, P), $(null));
                          },
                          children: [
                            a("header", {
                              children: [
                                t("strong", { children: V }),
                                a("span", {
                                  className:
                                    Ue >= 75
                                      ? "positive"
                                      : Ue < 50
                                        ? "negative"
                                        : "",
                                  children: [Ue, "% aksept"],
                                }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Ny betaling" }),
                                a("b", { children: [h(nt), "/uke"] }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Signeringsbonus" }),
                                t("b", { children: h(Ht) }),
                              ],
                            }),
                            a("div", {
                              children: [
                                t("span", { children: "Total verdi" }),
                                t("b", { children: h(gt) }),
                              ],
                            }),
                            t("small", { children: Me }),
                          ],
                        },
                        P,
                      );
                    }),
                  }),
                  t("p", {
                    className: "negotiation-warning",
                    children:
                      "Du f\xE5r maksimalt to fors\xF8k. Etter et nytt avslag kan sponsoren trekke tilbudet.",
                  }),
                ],
              }),
            t("div", {
              className: "simple-sponsor-offers",
              children: G.length
                ? G.map((P) => {
                    const V = Xe(e, P.slot),
                      de = !!_e(e, P.slot),
                      te =
                        e.reputation >= P.minReputation &&
                        x.expectedAttendance >= P.minAttendance,
                      Me = P.signingBonus + P.weeklyPay * P.weeks;
                    return a(
                      "article",
                      {
                        className: !V || de || !te ? "muted" : "",
                        children: [
                          a("header", {
                            children: [
                              a("div", {
                                children: [
                                  t("span", { children: we(P.slot) }),
                                  t("h3", { children: P.name }),
                                ],
                              }),
                              a("strong", {
                                children: [h(P.weeklyPay), "/uke"],
                              }),
                            ],
                          }),
                          a("div", {
                            className: "sponsor-offer-summary",
                            children: [
                              a("span", {
                                children: [
                                  "Garantert avtaleverdi ",
                                  t("b", { children: h(Me) }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  "Varighet ",
                                  a("b", {
                                    children: [
                                      P.seasons,
                                      " sesong",
                                      P.seasons === 1 ? "" : "er",
                                    ],
                                  }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  "Signeringsbonus ",
                                  t("b", { children: h(P.signingBonus) }),
                                ],
                              }),
                              a("span", {
                                children: [
                                  "Seiersbonus ",
                                  t("b", { children: h(P.winBonus) }),
                                ],
                              }),
                            ],
                          }),
                          t("p", { children: P.description }),
                          a("div", {
                            className: `offer-qualification ${te ? "good" : "warning"}`,
                            children: [
                              t(_, { name: te ? "check" : "alert" }),
                              t("span", {
                                children: te
                                  ? "Du oppfyller kravene"
                                  : e.reputation < P.minReputation
                                    ? `Klubbprofil ${e.reputation}/${P.minReputation}`
                                    : `Publikum ${Z(x.expectedAttendance)}/${Z(P.minAttendance)}`,
                              }),
                            ],
                          }),
                          a("div", {
                            className: "offer-actions",
                            children: [
                              t("button", {
                                onClick: () => g(P.id, "accept"),
                                disabled: !V || de || !te,
                                children: de
                                  ? "Plassen er opptatt"
                                  : V
                                    ? te
                                      ? "Godta tilbud"
                                      : e.reputation < P.minReputation
                                        ? `Krever profil ${P.minReputation}`
                                        : `Krever ${Z(P.minAttendance)} publikum`
                                    : "Plassen er l\xE5st",
                              }),
                              t("button", {
                                onClick: () => $(P.id),
                                disabled: !V || de || !te,
                                children:
                                  te && !de && V
                                    ? `Forhandle${P.negotiationAttempts ? ` (${P.negotiationAttempts}/2)` : ""}`
                                    : "Kan ikke forhandles enn\xE5",
                              }),
                            ],
                          }),
                          a("small", {
                            className: "sponsor-finance-effect",
                            children: [
                              "Ukesresultat etter avtalen: ",
                              a("b", {
                                className:
                                  x.profit + P.weeklyPay >= 0
                                    ? "positive"
                                    : "negative",
                                children: [
                                  x.profit + P.weeklyPay >= 0 ? "+" : "",
                                  h(x.profit + P.weeklyPay),
                                ],
                              }),
                            ],
                          }),
                        ],
                      },
                      P.id,
                    );
                  })
                : t("p", {
                    className: "empty-state",
                    children:
                      i === "all"
                        ? "Ingen nye sponsoravtaler kan signeres akkurat n\xE5. Bygg klubbprofil og publikum, eller vent p\xE5 nye tilbud."
                        : `${U(i)}.`,
                  }),
            }),
          ],
        }),
      r === "loans" &&
        a(X, {
          children: [
            a("section", {
              className: "loan-capacity-v22",
              children: [
                a("div", {
                  children: [
                    t("p", { className: "eyebrow", children: "Samlet lånetak" }),
                    t("h2", {
                      children: [
                        h(loanDashboard.used),
                        " / ",
                        h(loanDashboard.limit),
                      ],
                    }),
                    t("p", {
                      children:
                        "Rammen beregnes av inntekter, klubbverdi, klubbprofil, styretillit og eksisterende gjeld. Stadionlån teller med.",
                    }),
                  ],
                }),
                a("div", {
                  children: [
                    t("span", { children: "Ledig ramme" }),
                    t("strong", { children: h(loanDashboard.available) }),
                    a("small", {
                      children: [
                        "Kredittscore ",
                        loanDashboard.creditScore,
                        "/100",
                      ],
                    }),
                  ],
                }),
                t("div", {
                  className: "loan-limit-meter",
                  children: t("i", {
                    style: {
                      width: `${Math.min(100, loanDashboard.debtRatio * 100)}%`,
                    },
                  }),
                }),
              ],
            }),
            a("div", {
              className: "loan-products-v22",
              children: loanDashboard.products.map((P) =>
                a(
                  "article",
                  {
                    className: P.eligible ? "" : "locked",
                    children: [
                      a("header", {
                        children: [
                          a("div", {
                            children: [
                              t("span", { children: P.id === "emergency" ? "NØD" : "LÅN" }),
                              t("h3", { children: P.label }),
                            ],
                          }),
                          a("strong", {
                            children: [Math.round(P.annualRate * 100), "%"],
                          }),
                        ],
                      }),
                      t("p", { children: P.description }),
                      a("div", {
                        children: [
                          a("span", {
                            children: [
                              "Utbetalt ",
                              t("b", { children: h(P.amount) }),
                            ],
                          }),
                          a("span", {
                            children: [
                              "Etablering ",
                              t("b", { children: h(P.fee) }),
                            ],
                          }),
                          a("span", {
                            children: [
                              "Tvungent trekk ",
                              a("b", { children: [h(P.weeklyPayment), "/uke"] }),
                            ],
                          }),
                          a("span", {
                            children: [
                              "Løpetid ",
                              a("b", { children: [P.termWeeks, " kampuker"] }),
                            ],
                          }),
                        ],
                      }),
                      a("small", {
                        className: P.eligible ? "loan-preview-good" : "loan-preview-lock",
                        children: P.eligible
                          ? `Etter lånet: ${h(debtSnapshot.weeklyPayment + P.weeklyPayment)}/uke i gjeldstrekk og ${h(P.remainingAfter)} ledig ramme.`
                          : P.reason,
                      }),
                      t("button", {
                        className: P.id === "emergency" ? "danger-button" : "primary-button",
                        disabled: !P.eligible,
                        onClick: () => f(P.id),
                        children: P.eligible
                          ? `Ta ${P.label.toLowerCase()}`
                          : "Ikke tilgjengelig",
                      }),
                    ],
                  },
                  P.id,
                ),
              ),
            }),
            a("section", {
              className: "active-loans-v22",
              children: [
                a("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", { className: "eyebrow", children: "Nedbetalingsplan" }),
                      t("h3", { children: "Aktiv gjeld" }),
                      a("p", {
                        children: [
                          h(debtSnapshot.weeklyPayment),
                          " trekkes hver kampuke uansett kontantsaldo.",
                        ],
                      }),
                    ],
                  }),
                }),
                debtSnapshot.loans.length || debtSnapshot.stadiumDebt > 0
                  ? a("div", {
                      children: [
                        ...debtSnapshot.loans.map((P) =>
                          a(
                            "article",
                            {
                              children: [
                                a("div", {
                                  children: [
                                    t("strong", { children: P.label }),
                                    a("small", {
                                      children: [
                                        Math.round(P.annualRate * 100),
                                        "% rente · ",
                                        P.weeksRemaining,
                                        " kampuker igjen",
                                      ],
                                    }),
                                  ],
                                }),
                                a("div", {
                                  children: [
                                    t("strong", { children: h(P.balance) }),
                                    a("small", {
                                      children: [h(P.weeklyPayment), "/uke"],
                                    }),
                                  ],
                                }),
                              ],
                            },
                            P.id,
                          ),
                        ),
                        debtSnapshot.stadiumDebt > 0 &&
                          a("article", {
                            children: [
                              a("div", {
                                children: [
                                  t("strong", { children: "Sikret stadionlån" }),
                                  t("small", {
                                    children: "Automatisk avdrag knyttet til anlegget",
                                  }),
                                ],
                              }),
                              a("div", {
                                children: [
                                  t("strong", { children: h(debtSnapshot.stadiumDebt) }),
                                  a("small", {
                                    children: [
                                      h(debtSnapshot.weeklyStadiumPayment),
                                      "/uke",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                      ],
                    })
                  : a("div", {
                      className: "all-clear",
                      children: [
                        t(_, { name: "check" }),
                        a("div", {
                          children: [
                            t("strong", { children: "Klubben er gjeldfri" }),
                            t("small", {
                              children: "Ingen renter eller avdrag trekkes.",
                            }),
                          ],
                        }),
                      ],
                    }),
                debtSnapshot.totalDebt > 0 &&
                  a("div", {
                    className: "loan-extra-payments",
                    children: [
                      t("button", {
                        onClick: () => N(5e3),
                        disabled: e.cash <= 0,
                        children: "Betal ekstra $5K",
                      }),
                      t("button", {
                        onClick: () => N(1e4),
                        disabled: e.cash <= 0,
                        children: "Betal ekstra $10K",
                      }),
                      t("button", {
                        onClick: () => N(Math.min(e.cash, debtSnapshot.totalDebt)),
                        disabled: e.cash <= 0,
                        children: "Betal mest mulig",
                      }),
                    ],
                  }),
              ],
            }),
            (e.cash < 0 ||
              (x.profit < 0 && (x.runwayWeeks ?? 99) < 6) ||
              (e.phase === "offseason" &&
                e.history[e.history.length - 1]?.result === "Mester" &&
                Pr(e).some((P) => P.includes("reserve")))) &&
              a("section", {
                className: "offseason-rescue-v22",
                children: [
                  t(_, { name: "alert" }),
                  a("div", {
                    children: [
                      t("strong", { children: "Ingen offseason skal låse karrieren" }),
                      t("p", {
                        children:
                          "Først brukes et nødlån innenfor lånetaket. Er rammen helt brukt opp, kan styret gi ett engangstilskudd per sesong mot kraftig tap av tillit.",
                      }),
                    ],
                  }),
                  t("button", {
                    className: "danger-button",
                    onClick: rescue,
                    children: "Be styret om redningspakke",
                  }),
                ],
              }),
          ],
        }),
      r === "pricing" &&
        a(X, {
          children: [
            a("div", {
              className: "pricing-simple-grid",
              children: [
                a("section", {
                  children: [
                    a("div", {
                      className: "section-heading",
                      children: [
                        a("div", {
                          children: [
                            t("p", {
                              className: "eyebrow",
                              children: "Kampdag",
                            }),
                            t("h3", { children: "Priser" }),
                          ],
                        }),
                        t(_, { name: "ticket" }),
                      ],
                    }),
                    t(Ba, {
                      label: "Billett",
                      value: e.pricing.ticket,
                      min: 5,
                      max: 65,
                      onChange: (P) => u("ticket", P),
                    }),
                    t(Ba, {
                      label: "Merch",
                      value: e.pricing.merch,
                      min: 20,
                      max: 110,
                      onChange: (P) => u("merch", P),
                    }),
                    t(Ba, {
                      label: "Mat",
                      value: e.pricing.food,
                      min: 6,
                      max: 30,
                      onChange: (P) => u("food", P),
                    }),
                    a("p", {
                      className: "finance-tip",
                      children: [
                        "Forventet publikum: ",
                        t("strong", { children: Z(x.expectedAttendance) }),
                        ". Nullpunkt: ",
                        t("strong", { children: Z(x.breakEvenAttendance) }),
                        ". Supportertilfredshet: ",
                        a("strong", { children: [Math.round(mt(e)), "%"] }),
                        ".",
                      ],
                    }),
                  ],
                }),
                a("section", {
                  children: [
                    a("div", {
                      className: "section-heading",
                      children: [
                        a("div", {
                          children: [
                            t("p", {
                              className: "eyebrow",
                              children: "Effekt",
                            }),
                            t("h3", { children: "Med dagens priser" }),
                          ],
                        }),
                        a("strong", {
                          className: x.profit >= 0 ? "positive" : "negative",
                          children: [x.profit >= 0 ? "+" : "", h(x.profit)],
                        }),
                      ],
                    }),
                    t(Pe, { label: "Kampinntekt", value: Q, positive: !0 }),
                    t(Pe, { label: "Fast inntekt", value: De, positive: !0 }),
                    t(Pe, {
                      label: "Kostnader",
                      value: x.expenses,
                      expense: !0,
                    }),
                    t(Pe, {
                      label: "Resultat per kampuke",
                      value: x.profit,
                      positive: x.profit >= 0,
                      expense: x.profit < 0,
                      strong: !0,
                    }),
                    a("div", {
                      className: "cash-actions",
                      children: [
                        e.cash < Math.max(5e3, x.expenses * 2) &&
                          t("button", {
                            onClick: () => c("loans"),
                            children: "Se finansiering",
                          }),
                        t("button", {
                          onClick: () => c("loans"),
                          disabled: debtSnapshot.totalDebt <= 0,
                          children: "Se gjeldsplan",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            a("section", {
              className: "media-cpm-v22",
              children: [
                t(_, { name: "broadcast" }),
                a("div", {
                  children: [
                    t("p", {
                      className: "eyebrow",
                      children: latestMedia ? "Siste medieoppgjør" : "Neste kamp – prognose",
                    }),
                    t("h3", {
                      children: latestMedia?.channel ?? nextMedia.channel,
                    }),
                    a("p", {
                      children: [
                        Z(latestMedia?.audience ?? nextMedia.audience),
                        " seere/lyttere · ",
                        latestMedia?.cpm ?? nextMedia.cpm,
                        " CPM",
                      ],
                    }),
                  ],
                }),
                a("div", {
                  children: [
                    a("span", {
                      children: [
                        "Fast ",
                        t("b", {
                          children: h(latestMedia?.fixedFee ?? nextMedia.fixedFee),
                        }),
                      ],
                    }),
                    a("span", {
                      children: [
                        "CPM ",
                        t("b", {
                          children: h(
                            latestMedia?.cpmRevenue ?? nextMedia.cpmRevenue,
                          ),
                        }),
                      ],
                    }),
                    a("strong", {
                      children: h(latestMedia?.total ?? nextMedia.revenue),
                    }),
                  ],
                }),
              ],
            }),
            t("h3", {
              className: "section-title",
              children: "TV- og strømmerettigheter",
            }),
            _t(e, "tv")
              ? t("div", {
                  className: "deal-grid clean-deals",
                  children: xe.map((P) =>
                    a(
                      "button",
                      {
                        className: e.tvDeal.id === P.id ? "selected" : "",
                        onClick: () => y(P.id),
                        disabled: e.reputation < P.minReputation,
                        children: [
                          t(_, { name: "broadcast" }),
                          t("strong", { children: P.name }),
                          a("span", { children: [Z(P.audience), " seere"] }),
                          a("b", {
                            children: [h(P.fixedFee), " fast + ", P.cpm, " CPM"],
                          }),
                          a("small", {
                            children: ["Krever profil ", P.minReputation],
                          }),
                        ],
                      },
                      P.id,
                    ),
                  ),
                })
              : a("div", {
                  className: "inline-lock clean-lock",
                  children: [
                    t(_, { name: "broadcast" }),
                    a("div", {
                      children: [
                        t("strong", {
                          children: "TV-markedet er ikke \xE5pnet",
                        }),
                        t("p", {
                          children:
                            "Nå 5 000 supportere for å forhandle egne TV-avtaler. Frem til da betaler lokalradio og utvalgte enkeltkamper fastbeløp + CPM automatisk.",
                        }),
                      ],
                    }),
                    t("b", { children: "L\xC5ST" }),
                  ],
                }),
          ],
        }),
    ],
  });
}
function Ba({ label: e, value: s, min: n, max: r, onChange: c }) {
  return a("label", {
    className: "price-slider",
    children: [
      t("span", { children: e }),
      t("input", {
        type: "range",
        min: n,
        max: r,
        value: s,
        onChange: (i) => c(Number(i.target.value)),
      }),
      t("b", { children: h(s) }),
    ],
  });
}
function Ro(e, s) {
  return (
    {
      lower: [
        "Tilfredshet \u2191",
        "Ettersp\xF8rsel \u2191",
        "Billettinntekt kan falle",
      ],
      fanDay: ["Tilfredshet \u2191\u2191", "Kostnad $3.5K", "Lojalitet \u2191"],
      ignore: ["Tilfredshet \u2193\u2193", "Ingen kostnad"],
      own: ["Supportertillit \u2191\u2191", "Styret litt skeptisk"],
      changes: ["H\xE5p \u2191", "Resultatpress \u2191"],
      warn: ["Disiplin \u2191", "Spillermoral \u2193"],
      protect: ["Lagmorale \u2191", "Styret \u2193"],
      bench: ["Tydelig reaksjon", "Sportslig dybde \u2193"],
      players: ["Styret \u2191", "Lagmorale \u2193"],
      officials: ["Medieoppmerksomhet \u2191", "Omd\xF8mme \u2193"],
      renew: ["Spillermoral \u2191", "L\xF8nnskostnad \u2191"],
      deny: ["Ingen kostnad", "Spillermoral \u2193\u2193"],
      sell: ["Kontanter \u2191", "Troppsdybde \u2193"],
      accept: ["Kontanter \u2191", "Supporterprofil \u2193"],
      negotiate: ["Usikkert utfall", "Kommersiell kompetanse teller"],
      refuse: ["Omd\xF8mme \u2191", "Sponsorforhold \u2193"],
      repair: ["Kostnad $5.5K", "Risiko fjernet"],
      patch: ["Lav kostnad", "Rest-risiko"],
      delay: ["Ingen kostnad n\xE5", "Styre og omd\xF8mme \u2193"],
    }[s] ?? ["Konsekvens vises etter valget"]
  );
}
function To({ game: e, onDecision: s }) {
  const n = e.activeDecision ? Kn(e.activeDecision.category) : "";
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Innboks",
        title: "Saker og viktige meldinger",
        detail:
          "Media er ikke lenger et eget system. Bare valg og beskjeder som faktisk betyr noe vises her.",
      }),
      e.activeDecision
        ? a("section", {
            className: `decision-card inbox-decision action-category-${e.activeDecision.category}`,
            children: [
              a("div", {
                className: "decision-category",
                children: [
                  t(_, {
                    name:
                      e.activeDecision.category === "operations"
                        ? "building"
                        : e.activeDecision.category === "sponsors"
                          ? "sponsor"
                          : e.activeDecision.category === "players"
                            ? "team"
                            : "mail",
                  }),
                  t("span", { children: n }),
                ],
              }),
              t("p", { className: "eyebrow", children: "Krever svar" }),
              t("h2", { children: e.activeDecision.title }),
              t("p", { children: e.activeDecision.text }),
              t("div", {
                children: e.activeDecision.choices.map((r) =>
                  a(
                    "button",
                    {
                      onClick: () => s(r.id),
                      children: [
                        t("strong", { children: r.label }),
                        t("span", { children: r.detail }),
                        t("div", {
                          className: "decision-impact-tags",
                          children: Ro(e.activeDecision, r.id).map((c) =>
                            t("em", { children: c }, c),
                          ),
                        }),
                      ],
                    },
                    r.id,
                  ),
                ),
              }),
            ],
          })
        : a("section", {
            className: "no-decision inbox-clear",
            children: [
              t(_, { name: "check" }),
              a("div", {
                children: [
                  t("strong", { children: "Ingen saker krever svar" }),
                  t("p", {
                    children:
                      "N\xE5r en sponsor, spiller eller styret trenger en avgj\xF8relse, dukker den opp \xF8verst her.",
                  }),
                ],
              }),
            ],
          }),
      a("section", {
        className: "clean-inbox-list",
        children: [
          a("div", {
            className: "section-heading",
            children: [
              a("div", {
                children: [
                  t("p", { className: "eyebrow", children: "Klubbinnboks" }),
                  t("h3", { children: "Siste viktige meldinger" }),
                ],
              }),
              t("span", { children: e.inbox.length }),
            ],
          }),
          e.inbox.length
            ? e.inbox.slice(0, 12).map((r, c) =>
                a(
                  "article",
                  {
                    className: c === 0 ? "latest" : "",
                    children: [
                      t("span", { children: c === 0 ? "NY" : "\u2022" }),
                      t("p", { children: r }),
                    ],
                  },
                  `${r}-${c}`,
                ),
              )
            : t("p", {
                className: "empty-state",
                children: "Innboksen er tom.",
              }),
        ],
      }),
      a("details", {
        className: "club-news-details",
        children: [
          t("summary", { children: "Se klubbnytt og bakgrunnsmeldinger" }),
          t("div", {
            children: e.news
              .slice(0, 10)
              .map((r, c) => t("p", { children: r }, `${r}-${c}`)),
          }),
        ],
      }),
    ],
  });
}
function Lo({ game: e }) {
  const s = e.history[e.history.length - 1],
    n = seasonLeaders(e.roster),
    r = careerLeaders(e.roster, e.legends);
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Club history",
        title: "Det du bygger skal huskes",
        detail: `${e.trophies} trofeer \xB7 Sesong ${e.season} \xB7 Fame ${e.famePoints}`,
      }),
      a("section", {
        className: "history-hero-v20",
        children: [
          a("div", {
            children: [
              t("p", { className: "eyebrow", children: "Klubbarv" }),
              t("h2", {
                children: e.trophies
                  ? `${e.trophies} store triumfer`
                  : "Historien er fortsatt ung",
              }),
              t("p", {
                children:
                  "Fame vokser gjennom mesterskap, sluttspill, liganiv\xE5 og langvarige spillerhistorier.",
              }),
            ],
          }),
          a("div", {
            className: "history-fame",
            children: [
              t("span", { children: "FAME" }),
              t("strong", { children: e.famePoints }),
              t("small", {
                children:
                  e.famePoints >= 100
                    ? "Global institusjon"
                    : e.famePoints >= 60
                      ? "Nasjonal storklubb"
                      : e.famePoints >= 25
                        ? "Regional profil"
                        : "Klubb i vekst",
              }),
            ],
          }),
        ],
      }),
      a("div", {
        className: "records-grid",
        children: [
          a("article", {
            children: [
              t("span", { children: "\u{1F3C6}" }),
              t("strong", { children: e.trophies }),
              t("small", { children: "Sluttspilltitler" }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "\u{1F525}" }),
              a("strong", { children: ["+", e.records.biggestWin] }),
              t("small", { children: "St\xF8rste seier" }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "\u{1F3DF}\uFE0F" }),
              t("strong", { children: Z(e.records.recordAttendance) }),
              t("small", { children: "Rekordpublikum" }),
            ],
          }),
          a("article", {
            children: [
              t("span", { children: "\u{1F4C8}" }),
              t("strong", { children: e.records.bestWinStreak }),
              t("small", { children: "Beste seiersrekke" }),
            ],
          }),
        ],
      }),
      s &&
        a("section", {
          className: "latest-history-card",
          children: [
            a("div", {
              children: [
                t("p", {
                  className: "eyebrow",
                  children: "Siste avsluttede sesong",
                }),
                a("h3", {
                  children: ["Sesong ", s.season, " \xB7 ", s.league],
                }),
                a("p", {
                  children: [
                    s.result,
                    " \xB7 ",
                    s.record,
                    s.playoffFinish
                      ? ` \xB7 Sluttspill: ${s.playoffFinish}`
                      : "",
                  ],
                }),
              ],
            }),
            a("div", {
              children: [
                t("span", { children: "Fame" }),
                a("strong", { children: ["+", s.fameAward ?? 0] }),
              ],
            }),
            a("div", {
              children: [
                t("span", { children: "\xC5rets spiller" }),
                t("strong", { children: s.seasonMvp ?? s.bestPlayer }),
              ],
            }),
          ],
        }),
      a("section", {
        className: "history-player-legacy",
        children: [
          t("div", {
            className: "section-heading",
            children: a("div", {
              children: [
                t("p", { className: "eyebrow", children: "Player legacy" }),
                t("h3", { children: "Spillerne setter permanente rekorder" }),
                t("p", {
                  children:
                    "Sesongtall nullstilles ved ny sesong. Karrieretall og klubbrekorder blir igjen.",
                }),
              ],
            }),
          }),
          a("div", {
            className: "history-stat-columns",
            children: [
              a("div", {
                children: [
                  t("h4", { children: `Sesong ${e.season}` }),
                  n.map((c) =>
                    a(
                      "article",
                      {
                        children: [
                          t("span", { children: c.label }),
                          t("strong", { children: c.player.name }),
                          t("b", {
                            children: formatStatValue(
                              c.player.seasonStats?.[c.key],
                            ),
                          }),
                        ],
                      },
                      c.key,
                    ),
                  ),
                ],
              }),
              a("div", {
                children: [
                  t("h4", { children: "Alle tider" }),
                  r.map((c) =>
                    a(
                      "article",
                      {
                        children: [
                          t("span", { children: c.label }),
                          t("strong", { children: c.player.name }),
                          t("b", {
                            children: formatStatValue(
                              c.player.careerStats?.[c.key],
                            ),
                          }),
                        ],
                      },
                      c.key,
                    ),
                  ),
                ],
              }),
            ],
          }),
        ],
      }),
      t("h3", { className: "section-title", children: "Sesongarkiv" }),
      a("div", {
        className: "history-table v20-history-table",
        children: [
          a("div", {
            className: "history-head",
            children: [
              t("span", { children: "Sesong" }),
              t("span", { children: "Liga" }),
              t("span", { children: "Record" }),
              t("span", { children: "Resultat" }),
              t("span", { children: "Sluttspill" }),
              t("span", { children: "\xD8konomi" }),
              t("span", { children: "Priser" }),
            ],
          }),
          [...e.history].reverse().map((n) =>
            a(
              "div",
              {
                children: [
                  t("span", { children: n.season }),
                  t("span", { children: n.league }),
                  t("span", { children: n.record }),
                  t("span", { children: n.result }),
                  a("span", {
                    children: [
                      t("b", { children: n.playoffFinish ?? "\u2014" }),
                      a("small", {
                        children: [
                          n.playoffSeed ? `Seed #${n.playoffSeed}` : "",
                          n.finalScore ? ` \xB7 ${n.finalScore}` : "",
                        ],
                      }),
                    ],
                  }),
                  a("span", {
                    className: n.profit >= 0 ? "positive" : "negative",
                    children: [n.profit >= 0 ? "+" : "", h(n.profit)],
                  }),
                  a("span", {
                    children: [
                      t("b", { children: n.seasonMvp ?? n.bestPlayer }),
                      t("small", {
                        children: n.youngPlayer
                          ? `\xC5rets unge: ${n.youngPlayer}`
                          : "",
                      }),
                    ],
                  }),
                ],
              },
              n.season,
            ),
          ),
        ],
      }),
      e.legends.length > 0 &&
        a(X, {
          children: [
            t("h3", { className: "section-title", children: "Klubblegender" }),
            t("div", {
              className: "legend-grid",
              children: e.legends.map((n) =>
                a(
                  "article",
                  {
                    children: [
                      t("span", { children: "\u2B50" }),
                      t("strong", { children: n.name }),
                      a("p", {
                        children: [n.position, " \xB7 OVR ", n.overall],
                      }),
                      a("small", {
                        children: [
                          n.seasons,
                          " sesonger \xB7 ",
                          n.careerStats?.games ?? 0,
                          " kamper \xB7 ",
                          n.role,
                        ],
                      }),
                    ],
                  },
                  n.id,
                ),
              ),
            }),
          ],
        }),
    ],
  });
}
function Do({
  game: e,
  onSettings: s,
  onSave: n,
  onLoad: r,
  onLoadBackup: c,
  onRepair: i,
  onExport: d,
  importText: u,
  setImportText: g,
  onImport: k,
  onReset: y,
}) {
  const [f, N] = ge("flow"),
    w = !e.settings.music && !e.settings.sound;
  return a(X, {
    children: [
      t(Ze, {
        eyebrow: "Innstillinger",
        title: "Kontroll uten \xE9n endel\xF8s side",
        detail:
          "Spillflyt, klubbdrift, lyd, visning og lagring er delt i tydelige omr\xE5der.",
      }),
      t("nav", {
        className: "settings-subnav",
        children: [
          ["flow", "Spillflyt"],
          ["club", "Klubbdrift"],
          ["audio", "Lyd"],
          ["display", "Visning"],
          ["save", "Lagring"],
        ].map(([v, $]) =>
          t(
            "button",
            {
              className: f === v ? "active" : "",
              onClick: () => N(v),
              children: $,
            },
            v,
          ),
        ),
      }),
      f === "flow" &&
        a("div", {
          className: "settings-section-stack",
          children: [
            a("section", {
              className: "settings-panel",
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Karrieretempo",
                      }),
                      t("h3", { children: "Hvor raskt skal klubben vokse?" }),
                    ],
                  }),
                }),
                t("div", {
                  className: "settings-choice-row",
                  children: ["fast", "standard", "long"].map((v) =>
                    a(
                      "button",
                      {
                        className:
                          e.settings.careerPace === v ? "selected" : "",
                        onClick: () => s({ ...e.settings, careerPace: v }),
                        children: [
                          t("strong", {
                            children:
                              v === "fast"
                                ? "Rask"
                                : v === "standard"
                                  ? "Standard"
                                  : "Lang karriere",
                          }),
                          t("span", {
                            children:
                              v === "fast"
                                ? "Mer vekst og kortere vei til toppen."
                                : v === "standard"
                                  ? "Balansert progresjon."
                                  : "Lavere supporter- og profilvekst; best for lang karriere.",
                          }),
                        ],
                      },
                      v,
                    ),
                  ),
                }),
              ],
            }),
            a("section", {
              className: "settings-panel",
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Auto-manager",
                      }),
                      t("h3", {
                        children: "Stopp bare n\xE5r det faktisk betyr noe",
                      }),
                    ],
                  }),
                }),
                a("div", {
                  className: "settings-grid",
                  children: [
                    t(We, {
                      label: "Stopp f\xF8r sluttspill",
                      text: "Grunnserien avsluttes, men hver utslagsrunde krever et aktivt valg.",
                      checked: e.settings.autoStopPlayoffs,
                      onChange: (v) =>
                        s({ ...e.settings, autoStopPlayoffs: v }),
                    }),
                    t(We, {
                      label: "Stopp ved kritisk styrevedtak",
                      text: "Rutinem\xF8ter h\xE5ndteres i bakgrunnen. Ultimatum og jobbfare stopper simuleringen.",
                      checked: e.settings.autoStopCriticalBoard,
                      onChange: (v) =>
                        s({ ...e.settings, autoStopCriticalBoard: v }),
                    }),
                    t(We, {
                      label: "Auto-hvil slitne",
                      text: "Assistenten velger restitusjon ved lav condition.",
                      checked: e.settings.autoRest,
                      onChange: (v) => s({ ...e.settings, autoRest: v }),
                    }),
                    t(We, {
                      label: "Auto-benk skadde",
                      text: "Skadde spillere fjernes fra startoppstillingen.",
                      checked: e.settings.autoBenchInjured,
                      onChange: (v) =>
                        s({ ...e.settings, autoBenchInjured: v }),
                    }),
                  ],
                }),
              ],
            }),
            a("section", {
              className: "settings-panel",
              children: [
                t("div", {
                  className: "section-heading",
                  children: a("div", {
                    children: [
                      t("p", {
                        className: "eyebrow",
                        children: "Sponsorh\xE5ndtering",
                      }),
                      t("h3", { children: "Hva kan assistenten gj\xF8re?" }),
                    ],
                  }),
                }),
                t("div", {
                  className: "settings-choice-row",
                  children: ["off", "maintenance", "optimize"].map((v) =>
                    a(
                      "button",
                      {
                        className:
                          e.settings.sponsorAutomation === v ? "selected" : "",
                        onClick: () =>
                          s({ ...e.settings, sponsorAutomation: v }),
                        children: [
                          t("strong", {
                            children:
                              v === "off"
                                ? "Av"
                                : v === "maintenance"
                                  ? "Vedlikehold"
                                  : "Optimaliser",
                          }),
                          t("span", {
                            children:
                              v === "off"
                                ? "Du tar alle sponsorvalg."
                                : v === "maintenance"
                                  ? "Fornyer trygt og fyller tomme plasser."
                                  : "Velger best l\xF8nnsomme trygge avtale.",
                          }),
                        ],
                      },
                      v,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
      f === "club" &&
        a("div", {
          className: "settings-section-stack",
          children: [
            a("section", {
              className: "settings-panel",
              children: [
                t("p", { className: "eyebrow", children: "Billettpriser" }),
                t("h3", { children: "Automatisk kampdagsstrategi" }),
                t("div", {
                  className: "strategy-buttons",
                  children: ["manual", "full", "balanced", "revenue"].map((v) =>
                    t(
                      "button",
                      {
                        className:
                          e.settings.ticketStrategy === v ? "selected" : "",
                        onClick: () => s({ ...e.settings, ticketStrategy: v }),
                        children:
                          v === "manual"
                            ? "Manuell"
                            : v === "full"
                              ? "Fullt stadion"
                              : v === "balanced"
                                ? "Balansert"
                                : "Maks inntekt",
                      },
                      v,
                    ),
                  ),
                }),
                a("label", {
                  className: "settings-slider",
                  children: [
                    t("span", { children: "Maks prisendring per kamp" }),
                    a("b", { children: [e.settings.maxTicketChange, "%"] }),
                    t("input", {
                      type: "range",
                      min: "5",
                      max: "30",
                      step: "5",
                      value: e.settings.maxTicketChange,
                      onChange: (v) =>
                        s({
                          ...e.settings,
                          maxTicketChange: Number(v.target.value),
                        }),
                    }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "settings-grid",
              children: [
                t(We, {
                  label: "Rutinemedia",
                  text: "Sm\xE5 mediesaker h\xE5ndteres automatisk.",
                  checked: e.settings.autoMedia,
                  onChange: (v) => s({ ...e.settings, autoMedia: v }),
                }),
                t(We, {
                  label: "Automatisk rehabplan",
                  text: "Medisinsk team f\xF8lger opp skadde spillere.",
                  checked: e.settings.autoRehab,
                  onChange: (v) => s({ ...e.settings, autoRehab: v }),
                }),
                t(We, {
                  label: "Auto-fyll oppstilling",
                  text: "Assistenten fyller tomme posisjoner f\xF8r kamp.",
                  checked: e.settings.autoLineup,
                  onChange: (v) => s({ ...e.settings, autoLineup: v }),
                }),
                t(We, {
                  label: "Autosave",
                  text: "Lagrer automatisk ved endringer.",
                  checked: e.settings.autosave,
                  onChange: (v) => s({ ...e.settings, autosave: v }),
                }),
              ],
            }),
          ],
        }),
      f === "audio" &&
        a("div", {
          className: "settings-section-stack",
          children: [
            a("section", {
              className: "audio-master-card",
              children: [
                a("div", {
                  children: [
                    t("p", { className: "eyebrow", children: "Hovedkontroll" }),
                    t("h3", {
                      children: w ? "All lyd er dempet" : "Lyd er aktiv",
                    }),
                    t("p", {
                      children:
                        "\xC9n knapp demper b\xE5de musikk og lydeffekter.",
                    }),
                  ],
                }),
                t("button", {
                  className: w ? "primary-button" : "soft-button",
                  onClick: () => s({ ...e.settings, music: w, sound: w }),
                  children: w ? "Sl\xE5 p\xE5 lyd" : "Demp all lyd",
                }),
              ],
            }),
            t("section", {
              className: "audio-mixer v20",
              children: a("div", {
                className: "mixer-controls",
                children: [
                  t(We, {
                    label: "Bakgrunnsmusikk",
                    text: "Dynamisk klubbmusikk og kampmodus.",
                    checked: e.settings.music,
                    onChange: (v) => s({ ...e.settings, music: v }),
                  }),
                  a("label", {
                    children: [
                      a("div", {
                        children: [
                          t("strong", { children: "Musikkvolum" }),
                          a("span", {
                            children: [e.settings.musicVolume, "%"],
                          }),
                        ],
                      }),
                      t("input", {
                        type: "range",
                        min: "0",
                        max: "100",
                        value: e.settings.musicVolume,
                        onChange: (v) =>
                          s({
                            ...e.settings,
                            musicVolume: Number(v.target.value),
                          }),
                        disabled: !e.settings.music,
                      }),
                    ],
                  }),
                  t(We, {
                    label: "Lydeffekter",
                    text: "Klikk, varsler og resultattoner.",
                    checked: e.settings.sound,
                    onChange: (v) => s({ ...e.settings, sound: v }),
                  }),
                  a("label", {
                    children: [
                      a("div", {
                        children: [
                          t("strong", { children: "Effektvolum" }),
                          a("span", { children: [e.settings.sfxVolume, "%"] }),
                        ],
                      }),
                      t("input", {
                        type: "range",
                        min: "0",
                        max: "100",
                        value: e.settings.sfxVolume,
                        onChange: (v) =>
                          s({
                            ...e.settings,
                            sfxVolume: Number(v.target.value),
                          }),
                        disabled: !e.settings.sound,
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
      f === "display" &&
        a("div", {
          className: "settings-section-stack",
          children: [
            a("section", {
              className: "settings-panel",
              children: [
                t("p", { className: "eyebrow", children: "Tema" }),
                t("div", {
                  className: "settings-choice-row",
                  children: ["light", "dark", "system"].map((v) =>
                    t(
                      "button",
                      {
                        className: e.settings.theme === v ? "selected" : "",
                        onClick: () => s({ ...e.settings, theme: v }),
                        children: t("strong", {
                          children:
                            v === "light"
                              ? "Lys"
                              : v === "dark"
                                ? "M\xF8rk"
                                : "F\xF8lg systemet",
                        }),
                      },
                      v,
                    ),
                  ),
                }),
              ],
            }),
            a("div", {
              className: "settings-grid",
              children: [
                t(We, {
                  label: "Kompakt PC-visning",
                  text: "Tettere kort og tabeller p\xE5 store skjermer.",
                  checked: e.settings.compactMode,
                  onChange: (v) => s({ ...e.settings, compactMode: v }),
                }),
                t(We, {
                  label: "St\xF8rre tekst",
                  text: "\xD8ker tekstst\xF8rrelsen i hele grensesnittet.",
                  checked: e.settings.largeText,
                  onChange: (v) => s({ ...e.settings, largeText: v }),
                }),
                t(We, {
                  label: "Redusert animasjon",
                  text: "Mindre bevegelse i kamp og menyer.",
                  checked: e.settings.reducedMotion,
                  onChange: (v) => s({ ...e.settings, reducedMotion: v }),
                }),
              ],
            }),
          ],
        }),
      f === "save" &&
        a("div", {
          className: "settings-section-stack",
          children: [
            t("h3", { children: "Lagringsplasser" }),
            t("div", {
              className: "save-slots",
              children: Un.map((v, $) =>
                a(
                  "article",
                  {
                    children: [
                      t("span", { children: "\u{1F4BE}" }),
                      a("strong", { children: ["Plass ", $ + 1] }),
                      t("small", {
                        children: localStorage.getItem(v)
                          ? "Har lagring"
                          : "Tom",
                      }),
                      a("div", {
                        children: [
                          t("button", {
                            onClick: () => n($),
                            children: "Lagre",
                          }),
                          t("button", {
                            onClick: () => r($),
                            disabled: !localStorage.getItem(v),
                            children: "Last",
                          }),
                        ],
                      }),
                    ],
                  },
                  v,
                ),
              ),
            }),
            a("section", {
              className: "autosave-backup-card",
              children: [
                a("div", {
                  children: [
                    t("p", { className: "eyebrow", children: "Sikkerhet" }),
                    t("h3", { children: "Backup og karrierereparasjon" }),
                    t("p", {
                      children:
                        "Gjenopprett forrige autosave eller normaliser lagringen etter store oppdateringer.",
                    }),
                  ],
                }),
                a("div", {
                  children: [
                    t("button", {
                      className: "soft-button",
                      onClick: c,
                      disabled: !localStorage.getItem(nn),
                      children: "Gjenopprett backup",
                    }),
                    t("button", {
                      className: "soft-button",
                      onClick: i,
                      children: "Kontroller og reparer",
                    }),
                  ],
                }),
              ],
            }),
            a("div", {
              className: "import-box",
              children: [
                t("textarea", {
                  value: u,
                  onChange: (v) => g(v.target.value),
                  placeholder: "Eksportkode \u2026",
                }),
                a("div", {
                  children: [
                    t("button", { onClick: d, children: "Kopier eksportkode" }),
                    t("button", {
                      onClick: k,
                      disabled: !u.trim(),
                      children: "Importer",
                    }),
                  ],
                }),
              ],
            }),
            t("button", {
              className: "danger-button",
              onClick: y,
              children: "Nullstill hele karrieren",
            }),
          ],
        }),
    ],
  });
}
function We({ label: e, text: s, checked: n, onChange: r }) {
  return a("label", {
    className: "setting-toggle",
    children: [
      a("div", {
        children: [t("strong", { children: e }), t("span", { children: s })],
      }),
      t("input", {
        type: "checkbox",
        checked: n,
        onChange: (c) => r(c.target.checked),
      }),
      t("i", {}),
    ],
  });
}
function Pe({ label: e, value: s, positive: n, expense: r, strong: c }) {
  const i = n || (s > 0 && !r) ? "positive" : r || s < 0 ? "negative" : "",
    d = n && s >= 0 ? "+" : r && s > 0 ? "-" : "";
  return a("div", {
    className: `finance-line ${c ? "strong" : ""}`,
    children: [
      t("span", { children: e }),
      a("b", { className: i, children: [d, h(Math.abs(s))] }),
    ],
  });
}
export { no as default };
