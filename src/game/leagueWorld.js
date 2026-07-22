const WEEKLY_ACTIVITIES = {
  youth: [
    "ga et akademitalent sin første start",
    "forlenget med en ung nøkkelspiller",
    "prioriterer utvikling foran dyre kjøp",
  ],
  spender: [
    "hentet en profilert veteran",
    "økte lønnsbudsjettet før innspurten",
    "er aktive i overgangsmarkedet",
  ],
  draft: [
    "speider neste draftklasse",
    "bygger videre rundt egne draftvalg",
    "byttet til seg et ekstra draftvalg",
  ],
  defensive: [
    "forsterket den defensive rekken",
    "har ligaens mest disiplinerte forsvar",
    "justerte kampplanen mot et mer fysisk uttrykk",
  ],
  balanced: [
    "gjorde en kontrollert breddeforsterkning",
    "holder en stabil sportslig kurs",
    "prioriterer balanse mellom økonomi og resultater",
  ],
};

function randomFrom(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function feedItem(type, headline, body, team, season, week) {
  return {
    id: `${season}-${week}-${team?.id ?? type}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    headline,
    body,
    teamId: team?.id,
    season,
    week,
  };
}

export function weeklyTeamActivity(team) {
  const strategy = team.strategy ?? "balanced";
  return randomFrom(WEEKLY_ACTIVITIES[strategy] ?? WEEKLY_ACTIVITIES.balanced);
}

export function createWeeklyLeagueFeed({
  teams,
  opponent,
  rivalName,
  season,
  week,
}) {
  const items = [];
  const table = [...teams].sort(
    (a, b) =>
      b.wins - a.wins ||
      b.pointsFor - b.pointsAgainst - (a.pointsFor - a.pointsAgainst),
  );
  const leader = table[0];
  if (leader) {
    items.push(
      feedItem(
        "table",
        `${leader.name} leder ligaen`,
        `${leader.wins}-${leader.losses} etter uke ${week}. Form: ${leader.form?.join(" ") || "–"}.`,
        leader,
        season,
        week,
      ),
    );
  }

  if (opponent) {
    items.push(
      feedItem(
        opponent.name === rivalName ? "rival" : "result",
        opponent.name === rivalName
          ? `Rivalvakten: ${opponent.name}`
          : `${opponent.name} etter møtet`,
        opponent.name === rivalName
          ? `Rivalen står med ${opponent.wins}-${opponent.losses} og ${opponent.transferActivity?.toLowerCase() ?? "bygger troppen"}.`
          : `${opponent.coachName} har laget på ${opponent.wins}-${opponent.losses}.`,
        opponent,
        season,
        week,
      ),
    );
  }

  if (week % 2 === 0 || Math.random() < 0.45) {
    const storyTeam = randomFrom(
      teams.filter((team) => team.id !== opponent?.id),
    );
    if (storyTeam) {
      const activity = weeklyTeamActivity(storyTeam);
      items.push(
        feedItem(
          "transfer",
          `${storyTeam.name} beveger seg i markedet`,
          `${storyTeam.coachName} ${activity}.`,
          storyTeam,
          season,
          week,
        ),
      );
    }
  }
  return items;
}

export function refreshAiTeamStories(teams, season) {
  return teams.map((team, index) => {
    const activity = weeklyTeamActivity(team);
    const draftPick = 1 + Math.floor(Math.random() * 3);
    const draftLabel =
      team.strategy === "draft" || team.strategy === "youth"
        ? `Draftet talent i runde ${draftPick}`
        : activity.charAt(0).toUpperCase() + activity.slice(1);
    return {
      ...team,
      transferActivity: draftLabel,
      worldProfile: {
        identity: team.strategy ?? "balanced",
        offseasonHeadline: `${draftLabel} før sesong ${season}`,
        rivalryHeat: team.worldProfile?.rivalryHeat ?? 0,
        seasonsTracked: Number(team.worldProfile?.seasonsTracked ?? 0) + 1,
        lastPowerChange: team.worldProfile?.lastPowerChange ?? 0,
        spotlightRank: index + 1,
      },
    };
  });
}

export function createOffseasonLeagueFeed(teams, season, rivalName) {
  const biggest = [...teams].sort(
    (a, b) =>
      Math.abs(b.worldProfile?.lastPowerChange ?? 0) -
      Math.abs(a.worldProfile?.lastPowerChange ?? 0),
  )[0];
  const rival = teams.find((team) => team.name === rivalName);
  return [
    biggest
      ? feedItem(
          "offseason",
          `${biggest.name}: ${biggest.transferActivity}`,
          `Klubben går inn i sesong ${season} med OVR ${Math.round(biggest.power)} og lønn ${Math.round(biggest.payroll ?? 0).toLocaleString("nb-NO")}/uke.`,
          biggest,
          season,
          0,
        )
      : null,
    rival
      ? feedItem(
          "rival",
          `${rival.name} gjør seg klar`,
          `${rival.coachName} går inn i sesongen med planen «${rival.transferActivity}».`,
          rival,
          season,
          0,
        )
      : null,
  ].filter(Boolean);
}

export function normalizeLeagueFeed(feed = []) {
  return Array.isArray(feed) ? feed.filter(Boolean).slice(0, 40) : [];
}
