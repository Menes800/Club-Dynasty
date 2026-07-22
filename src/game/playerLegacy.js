const STAT_KEYS = [
  "games",
  "starts",
  "wins",
  "playoffGames",
  "passingYards",
  "passingTouchdowns",
  "interceptionsThrown",
  "rushingYards",
  "rushingTouchdowns",
  "receptions",
  "receivingYards",
  "receivingTouchdowns",
  "tackles",
  "sacks",
  "interceptions",
  "fieldGoals",
  "mvpAwards",
];

const OFFENSE = new Set(["QB", "RB", "WR", "TE", "OL", "K"]);
const DEFENSE = new Set(["DL", "LB", "CB", "S"]);

export function emptyPlayerStats(season = 1) {
  return {
    season,
    games: 0,
    starts: 0,
    wins: 0,
    playoffGames: 0,
    passingYards: 0,
    passingTouchdowns: 0,
    interceptionsThrown: 0,
    rushingYards: 0,
    rushingTouchdowns: 0,
    receptions: 0,
    receivingYards: 0,
    receivingTouchdowns: 0,
    tackles: 0,
    sacks: 0,
    interceptions: 0,
    fieldGoals: 0,
    mvpAwards: 0,
  };
}

function mergeStats(base, source = {}) {
  const merged = { ...base, ...source };
  for (const key of STAT_KEYS)
    merged[key] = Number(source[key] ?? base[key] ?? 0);
  return merged;
}

export function normalizePlayerLegacy(
  player,
  season = 1,
  currentTeamGames = 0,
) {
  const estimatedSeasonGames = Math.min(
    currentTeamGames,
    Number(player.careerGames ?? 0),
  );
  const seasonStats = mergeStats(emptyPlayerStats(season), {
    ...(player.seasonStats ?? {}),
    season,
    games: player.seasonStats?.games ?? estimatedSeasonGames,
    starts: player.seasonStats?.starts ?? estimatedSeasonGames,
    mvpAwards: player.seasonStats?.mvpAwards ?? 0,
  });
  const careerStats = mergeStats(emptyPlayerStats(0), {
    ...(player.careerStats ?? {}),
    season: 0,
    games: Math.max(
      Number(player.careerStats?.games ?? 0),
      Number(player.careerGames ?? 0),
      seasonStats.games,
    ),
    starts: Math.max(
      Number(player.careerStats?.starts ?? 0),
      Number(player.careerGames ?? 0),
      seasonStats.starts,
    ),
    mvpAwards: Math.max(
      Number(player.careerStats?.mvpAwards ?? 0),
      Number(player.careerAwards ?? 0),
      seasonStats.mvpAwards,
    ),
  });
  return {
    ...player,
    seasonStats,
    careerStats,
    seasonHistory: Array.isArray(player.seasonHistory)
      ? player.seasonHistory.slice(-20)
      : [],
    careerGames: careerStats.games,
    careerAwards: careerStats.mvpAwards,
  };
}

export function normalizeRosterLegacy(roster = [], season = 1, teamGames = 0) {
  return roster.map((player) =>
    normalizePlayerLegacy(player, season, teamGames),
  );
}

function zeroGameLine(player) {
  return {
    playerId: player.id,
    name: player.name,
    position: player.position,
    starter: Boolean(player.starter),
    passingYards: 0,
    passingTouchdowns: 0,
    interceptionsThrown: 0,
    rushingYards: 0,
    rushingTouchdowns: 0,
    receptions: 0,
    receivingYards: 0,
    receivingTouchdowns: 0,
    tackles: 0,
    sacks: 0,
    interceptions: 0,
    fieldGoals: 0,
  };
}

export function createMatchPlayerBox(roster = []) {
  return Object.fromEntries(
    roster.map((player) => [player.id, zeroGameLine(player)]),
  );
}

function randomFrom(values) {
  if (!values.length) return undefined;
  return values[Math.floor(Math.random() * values.length)];
}

function starterFrom(roster, positions) {
  const eligible = roster.filter(
    (player) =>
      player.starter &&
      player.injuryWeeks <= 0 &&
      positions.includes(player.position),
  );
  return (
    randomFrom(eligible) ??
    randomFrom(roster.filter((player) => positions.includes(player.position)))
  );
}

function updateLine(box, player, updates) {
  if (!player) return box;
  const current = box[player.id] ?? zeroGameLine(player);
  const next = { ...current };
  for (const [key, value] of Object.entries(updates)) {
    next[key] = Number(next[key] ?? 0) + Number(value ?? 0);
  }
  return { ...box, [player.id]: next };
}

export function recordScoringPlay(box, roster, kind = "touchdown") {
  if (kind === "fieldGoal") {
    const kicker = starterFrom(roster, ["K"]);
    const distance = 24 + Math.floor(Math.random() * 29);
    return {
      box: updateLine(box, kicker, { fieldGoals: 1 }),
      text: kicker
        ? `${kicker.name} setter et ${distance}-yards field goal.`
        : `Field goal fra ${distance} yards.`,
      playerId: kicker?.id,
    };
  }

  const rushing = Math.random() < 0.36;
  if (rushing) {
    const runner = starterFrom(roster, ["RB", "QB"]);
    const yards = 2 + Math.floor(Math.random() * 24);
    return {
      box: updateLine(box, runner, {
        rushingYards: yards,
        rushingTouchdowns: 1,
      }),
      text: runner
        ? `${runner.name} løper inn touchdown fra ${yards} yards!`
        : "Touchdown på løp!",
      playerId: runner?.id,
    };
  }

  const quarterback = starterFrom(roster, ["QB"]);
  const receiver = starterFrom(roster, ["WR", "TE", "RB"]);
  const yards = 7 + Math.floor(Math.random() * 39);
  let next = updateLine(box, quarterback, {
    passingYards: yards,
    passingTouchdowns: 1,
  });
  next = updateLine(next, receiver, {
    receptions: 1,
    receivingYards: yards,
    receivingTouchdowns: 1,
  });
  return {
    box: next,
    text:
      quarterback && receiver
        ? `${quarterback.name} finner ${receiver.name} for ${yards} yards – touchdown!`
        : "Touchdown på pasning!",
    playerId: receiver?.id ?? quarterback?.id,
  };
}

export function recordDefensivePlay(box, roster, forcedTurnover = false) {
  const defender = starterFrom(roster, ["DL", "LB", "CB", "S"]);
  const turnover = forcedTurnover || Math.random() < 0.18;
  const sack = !turnover && Math.random() < 0.3;
  const updates = turnover
    ? { tackles: 1, interceptions: 1 }
    : sack
      ? { tackles: 1, sacks: 1 }
      : { tackles: 1 + Math.floor(Math.random() * 2) };
  return {
    box: updateLine(box, defender, updates),
    text: defender
      ? turnover
        ? `${defender.name} leser spillet og snapper ballen!`
        : sack
          ? `${defender.name} kommer gjennom med en sack.`
          : `${defender.name} stopper driven på tredje down.`
      : turnover
        ? "Forsvaret skaper en turnover!"
        : "Forsvaret tvinger frem punt.",
    playerId: defender?.id,
  };
}

export function recordOffensiveTurnover(box, roster) {
  const quarterback = starterFrom(roster, ["QB"]);
  const runner = starterFrom(roster, ["RB"]);
  const interception = Math.random() < 0.68 || !runner;
  return {
    box: interception
      ? updateLine(box, quarterback, { interceptionsThrown: 1 })
      : box,
    text:
      interception && quarterback
        ? `${quarterback.name} blir interceptet. Motstanderen overtar.`
        : runner
          ? `${runner.name} mister ballen. Motstanderen overtar.`
          : "Balltap. Motstanderen overtar.",
    playerId: interception ? quarterback?.id : runner?.id,
  };
}

function randomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function finalizeMatchPlayerBox(box, roster, match) {
  let next = { ...box };
  const plays = Math.max(45, Math.round(match.totalTicks * 2.4));
  const quarterback = starterFrom(roster, ["QB"]);
  const runner = starterFrom(roster, ["RB"]);
  const receivers = roster.filter(
    (player) => player.starter && ["WR", "TE", "RB"].includes(player.position),
  );
  const passingBase =
    randomBetween(120, 205) + Math.round(match.userAttack * 1.15);
  const existingPassing = quarterback
    ? (next[quarterback.id]?.passingYards ?? 0)
    : 0;
  const passingRemainder = Math.max(0, passingBase - existingPassing);
  next = updateLine(next, quarterback, { passingYards: passingRemainder });

  const existingReceiving = receivers.reduce(
    (sum, player) => sum + Number(next[player.id]?.receivingYards ?? 0),
    0,
  );
  let receivingRemainder = Math.max(0, passingBase - existingReceiving);
  receivers.forEach((receiver, index) => {
    const share =
      index === receivers.length - 1
        ? receivingRemainder
        : Math.round(receivingRemainder * (index === 0 ? 0.58 : 0.46));
    receivingRemainder -= share;
    next = updateLine(next, receiver, {
      receivingYards: share,
      receptions: Math.max(1, Math.round(share / randomBetween(10, 16))),
    });
  });

  const rushingBase =
    randomBetween(55, 105) + Math.round(match.userAttack * 0.45);
  const existingRushing = runner ? (next[runner.id]?.rushingYards ?? 0) : 0;
  next = updateLine(next, runner, {
    rushingYards: Math.max(0, rushingBase - existingRushing),
  });

  const defenders = roster.filter(
    (player) => player.starter && DEFENSE.has(player.position),
  );
  defenders.forEach((defender) => {
    const existing = next[defender.id]?.tackles ?? 0;
    next = updateLine(next, defender, {
      tackles: Math.max(
        0,
        randomBetween(3, 8) + Math.round(plays / 35) - existing,
      ),
      sacks:
        ["DL", "LB"].includes(defender.position) && Math.random() < 0.23
          ? 1
          : 0,
      interceptions:
        ["CB", "S"].includes(defender.position) && Math.random() < 0.12 ? 1 : 0,
    });
  });
  return next;
}

export function matchStatScore(line = {}) {
  return (
    Number(line.passingYards ?? 0) / 18 +
    Number(line.passingTouchdowns ?? 0) * 8 -
    Number(line.interceptionsThrown ?? 0) * 5 +
    Number(line.rushingYards ?? 0) / 10 +
    Number(line.rushingTouchdowns ?? 0) * 8 +
    Number(line.receivingYards ?? 0) / 10 +
    Number(line.receivingTouchdowns ?? 0) * 8 +
    Number(line.receptions ?? 0) * 0.6 +
    Number(line.tackles ?? 0) * 1.3 +
    Number(line.sacks ?? 0) * 6 +
    Number(line.interceptions ?? 0) * 8 +
    Number(line.fieldGoals ?? 0) * 4
  );
}

export function topMatchPerformers(box = {}, limit = 5) {
  return Object.values(box)
    .map((line) => ({
      ...line,
      rating: Math.round(matchStatScore(line) * 10) / 10,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function applyMatchStatsToRoster(
  roster,
  box,
  season,
  { won = false, playoff = false, mvpId } = {},
) {
  return roster.map((rawPlayer) => {
    const player = normalizePlayerLegacy(rawPlayer, season);
    const line = box[player.id] ?? zeroGameLine(player);
    const appearance = player.starter ? 1 : 0;
    const increments = {
      games: appearance,
      starts: appearance,
      wins: appearance && won ? 1 : 0,
      playoffGames: appearance && playoff ? 1 : 0,
      passingYards: line.passingYards,
      passingTouchdowns: line.passingTouchdowns,
      interceptionsThrown: line.interceptionsThrown,
      rushingYards: line.rushingYards,
      rushingTouchdowns: line.rushingTouchdowns,
      receptions: line.receptions,
      receivingYards: line.receivingYards,
      receivingTouchdowns: line.receivingTouchdowns,
      tackles: line.tackles,
      sacks: line.sacks,
      interceptions: line.interceptions,
      fieldGoals: line.fieldGoals,
      mvpAwards: player.id === mvpId ? 1 : 0,
    };
    const seasonStats = { ...player.seasonStats, season };
    const careerStats = { ...player.careerStats, season: 0 };
    for (const key of STAT_KEYS) {
      seasonStats[key] =
        Number(seasonStats[key] ?? 0) + Number(increments[key] ?? 0);
      careerStats[key] =
        Number(careerStats[key] ?? 0) + Number(increments[key] ?? 0);
    }
    return {
      ...player,
      seasonStats,
      careerStats,
      careerGames: careerStats.games,
      careerAwards: careerStats.mvpAwards,
    };
  });
}

function seasonScore(player) {
  const stats = player.seasonStats ?? emptyPlayerStats();
  return matchStatScore(stats) + stats.mvpAwards * 12 + stats.wins * 0.8;
}

export function selectSeasonAwards(roster = []) {
  const ranked = [...roster].sort((a, b) => seasonScore(b) - seasonScore(a));
  const offense = ranked.filter((player) => OFFENSE.has(player.position));
  const defense = ranked.filter((player) => DEFENSE.has(player.position));
  const young = ranked.filter((player) => player.age <= 23);
  return {
    mvp: ranked[0],
    young: young[0],
    offense: offense[0],
    defense: defense[0],
  };
}

export function seasonLeaders(roster = []) {
  const leader = (key) =>
    [...roster].sort(
      (a, b) =>
        Number(b.seasonStats?.[key] ?? 0) - Number(a.seasonStats?.[key] ?? 0),
    )[0];
  return [
    {
      key: "passingYards",
      label: "Pasningsyards",
      player: leader("passingYards"),
    },
    { key: "rushingYards", label: "Løpsyards", player: leader("rushingYards") },
    {
      key: "receivingYards",
      label: "Mottaksyards",
      player: leader("receivingYards"),
    },
    { key: "tackles", label: "Taklinger", player: leader("tackles") },
    { key: "sacks", label: "Sacks", player: leader("sacks") },
    {
      key: "interceptions",
      label: "Interceptions",
      player: leader("interceptions"),
    },
  ].filter((entry) => entry.player);
}

export function careerLeaders(roster = [], legends = []) {
  const pool = [
    ...roster,
    ...legends.map((legend) => ({
      ...legend,
      careerStats: legend.careerStats ?? emptyPlayerStats(0),
    })),
  ];
  const leader = (key) =>
    [...pool].sort(
      (a, b) =>
        Number(b.careerStats?.[key] ?? 0) - Number(a.careerStats?.[key] ?? 0),
    )[0];
  return [
    { key: "games", label: "Kamper", player: leader("games") },
    {
      key: "passingTouchdowns",
      label: "Pasnings-TD",
      player: leader("passingTouchdowns"),
    },
    {
      key: "rushingTouchdowns",
      label: "Løps-TD",
      player: leader("rushingTouchdowns"),
    },
    {
      key: "receivingTouchdowns",
      label: "Mottaks-TD",
      player: leader("receivingTouchdowns"),
    },
    { key: "tackles", label: "Taklinger", player: leader("tackles") },
    { key: "mvpAwards", label: "MVP-priser", player: leader("mvpAwards") },
  ].filter((entry) => entry.player);
}

export function playerHeadlineStat(player, scope = "season") {
  const stats = scope === "career" ? player.careerStats : player.seasonStats;
  if (!stats) return { label: "Kamper", value: 0 };
  if (player.position === "QB")
    return {
      label: "Yards / TD",
      value: `${stats.passingYards} / ${stats.passingTouchdowns}`,
    };
  if (player.position === "RB")
    return {
      label: "Yards / TD",
      value: `${stats.rushingYards} / ${stats.rushingTouchdowns}`,
    };
  if (["WR", "TE"].includes(player.position))
    return {
      label: "Yards / TD",
      value: `${stats.receivingYards} / ${stats.receivingTouchdowns}`,
    };
  if (["DL", "LB", "CB", "S"].includes(player.position))
    return {
      label: "Taklinger / store spill",
      value: `${stats.tackles} / ${stats.sacks + stats.interceptions}`,
    };
  if (player.position === "K")
    return { label: "Field goals", value: stats.fieldGoals };
  return { label: "Starter", value: stats.starts };
}

export function archivePlayerSeason(player, season, league) {
  const normalized = normalizePlayerLegacy(player, season);
  const entry = {
    season,
    league,
    ...normalized.seasonStats,
  };
  return {
    ...normalized,
    seasonHistory: [...normalized.seasonHistory, entry].slice(-20),
  };
}

export function archiveRosterSeason(roster, season, league) {
  return roster.map((player) => archivePlayerSeason(player, season, league));
}

export function startNewPlayerSeason(roster, nextSeason) {
  return roster.map((player) => ({
    ...normalizePlayerLegacy(player, nextSeason),
    seasonStats: emptyPlayerStats(nextSeason),
  }));
}

export function createLegendFromPlayer(player, overall, seasons) {
  const normalized = normalizePlayerLegacy(player);
  return {
    id: normalized.id,
    name: normalized.name,
    position: normalized.position,
    overall,
    seasons,
    role: "Pensjonert",
    careerStats: normalized.careerStats,
    seasonHistory: normalized.seasonHistory,
  };
}

export function formatStatValue(value) {
  return new Intl.NumberFormat("nb-NO").format(Number(value ?? 0));
}
