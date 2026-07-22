const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const DEAL_SPECS = {
  none: {
    id: "none",
    name: "Ingen fast TV-avtale",
    format: "Lokalradio",
    fixedFee: 260,
    cpm: 4,
    audience: 1200,
    minReputation: 0,
  },
  local: {
    id: "local",
    name: "Local Sports Network",
    format: "Lokal-TV",
    fixedFee: 650,
    cpm: 6,
    audience: 18000,
    minReputation: 0,
  },
  stream: {
    id: "stream",
    name: "StreamSport+",
    format: "Strømming",
    fixedFee: 1250,
    cpm: 8,
    audience: 55000,
    minReputation: 25,
  },
  national: {
    id: "national",
    name: "National Prime",
    format: "Nasjonal-TV",
    fixedFee: 2400,
    cpm: 10,
    audience: 180000,
    minReputation: 55,
  },
};

export function getBroadcastDeals(leagueIndex = 0) {
  const league = clamp(Math.round(Number(leagueIndex) || 0), 0, 4);
  return ["local", "stream", "national"].map((id) => {
    const deal = DEAL_SPECS[id];
    return {
      ...deal,
      fixedFee: Math.round(
        deal.fixedFee * (1 + league * (id === "national" ? 0.5 : 0.34)),
      ),
      cpm: deal.cpm + league,
    };
  });
}

export function normalizeBroadcastDeal(deal, leagueIndex = 0) {
  const id = deal?.id && DEAL_SPECS[deal.id] ? deal.id : "none";
  if (id === "none") return { ...DEAL_SPECS.none };
  const current = getBroadcastDeals(leagueIndex).find((item) => item.id === id);
  return { ...current, ...(deal ?? {}), ...current };
}

function automaticCoverage(game, opponent, fixture) {
  const rival = opponent?.name === game?.profile?.rivalName;
  const playoff = Boolean(fixture?.playoff);
  const profile = Number(game?.reputation) || 0;
  const reach = Number(game?.mediaReach) || 0;
  if (playoff || rival || profile >= 12 || reach >= 650) {
    return {
      id: "spot-tv",
      name: "Lokal-TV enkeltkamp",
      format: "Lokal-TV",
      fixedFee: 320 + (Number(game?.leagueIndex) || 0) * 140,
      cpm: 5,
      audience: 6500,
      minReputation: 0,
    };
  }
  return { ...DEAL_SPECS.none };
}

export function calculateMediaPayout(game, opponent, fixture, won = false) {
  const leagueIndex = clamp(Math.round(Number(game?.leagueIndex) || 0), 0, 4);
  const selected = normalizeBroadcastDeal(game?.tvDeal, leagueIndex);
  const coverage =
    selected.id === "none"
      ? automaticCoverage(game, opponent, fixture)
      : selected;
  const rival = opponent?.name === game?.profile?.rivalName;
  const playoff = Boolean(fixture?.playoff);
  const audienceBoost =
    1 +
    Math.log1p(Math.max(0, Number(game?.fans) || 0)) / 18 +
    Math.log1p(Math.max(0, Number(game?.mediaReach) || 0)) / 30 +
    ((Number(opponent?.mediaProfile) || 50) - 50) / 170 +
    (rival ? 0.32 : 0) +
    (playoff ? 0.46 : 0);
  const minimumAudience = Math.max(250, coverage.audience * 0.45);
  const maximumAudience = coverage.audience * (playoff ? 2.4 : 1.9);
  const audience = Math.round(
    clamp(coverage.audience * audienceBoost, minimumAudience, maximumAudience),
  );
  const fixedFee = Math.round(coverage.fixedFee * (playoff ? 1.35 : 1));
  const cpmRevenue = Math.round((audience / 1000) * coverage.cpm);
  const leagueShare = Math.round(
    [1400, 2300, 4700, 9200, 17000][leagueIndex] * (playoff ? 1.5 : 1),
  );
  const resultBonus = won
    ? Math.round((90 + leagueIndex * 120) * (rival || playoff ? 1.5 : 1))
    : 0;
  const revenue = fixedFee + cpmRevenue + leagueShare + resultBonus;
  const reachGain = Math.round(
    3 + Math.log1p(audience) * 0.8 + (rival ? 4 : 0) + (playoff ? 7 : 0),
  );
  return {
    dealId: coverage.id,
    channel: coverage.name,
    format: coverage.format,
    audience,
    cpm: coverage.cpm,
    fixedFee,
    cpmRevenue,
    leagueShare,
    resultBonus,
    revenue,
    reachGain,
  };
}
