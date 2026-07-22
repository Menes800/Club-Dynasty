import assert from "node:assert/strict";
import test from "node:test";

import {
  applyMatchStatsToRoster,
  archiveRosterSeason,
  careerLeaders,
  createMatchPlayerBox,
  finalizeMatchPlayerBox,
  normalizeRosterLegacy,
  recordDefensivePlay,
  recordScoringPlay,
  selectSeasonAwards,
  seasonLeaders,
  startNewPlayerSeason,
  topMatchPerformers,
} from "./playerLegacy.js";

const roster = [
  ["qb", "Aksel Storm", "QB"],
  ["rb", "Emil Berg", "RB"],
  ["wr", "Noah Dahl", "WR"],
  ["te", "Theo Lund", "TE"],
  ["ol", "Viggo Vik", "OL"],
  ["dl", "Anton Falk", "DL"],
  ["lb", "Lucas Holm", "LB"],
  ["cb", "Felix Lind", "CB"],
  ["s", "Elias Molin", "S"],
  ["k", "Mikkel Solvik", "K"],
].map(([id, name, position]) => ({
  id,
  name,
  position,
  starter: true,
  injuryWeeks: 0,
  age: 24,
  careerGames: 0,
  careerAwards: 0,
}));

test("migrates old players into v21 legacy fields", () => {
  const migrated = normalizeRosterLegacy(
    [{ ...roster[0], careerGames: 14, careerAwards: 2 }],
    3,
    4,
  )[0];
  assert.equal(migrated.seasonStats.season, 3);
  assert.equal(migrated.seasonStats.games, 4);
  assert.equal(migrated.careerStats.games, 14);
  assert.equal(migrated.careerStats.mvpAwards, 2);
});

test("turns live match events into season and career statistics", () => {
  let box = createMatchPlayerBox(roster);
  for (let i = 0; i < 4; i += 1) box = recordScoringPlay(box, roster).box;
  for (let i = 0; i < 5; i += 1) box = recordDefensivePlay(box, roster).box;
  box = finalizeMatchPlayerBox(box, roster, {
    totalTicks: 40,
    userAttack: 62,
  });
  const leaders = topMatchPerformers(box, 5);
  assert.equal(leaders.length, 5);
  assert.ok(leaders[0].rating > 0);

  const updated = applyMatchStatsToRoster(roster, box, 1, {
    won: true,
    playoff: false,
    mvpId: leaders[0].playerId,
  });
  assert.equal(
    updated.every((player) => player.careerStats.games === 1),
    true,
  );
  assert.equal(
    updated.find((player) => player.id === leaders[0].playerId).careerStats
      .mvpAwards,
    1,
  );
  assert.ok(selectSeasonAwards(updated).mvp);
  assert.equal(
    seasonLeaders(updated).every(
      (entry) => Number(entry.player.seasonStats[entry.key]) > 0,
    ),
    true,
  );
  assert.equal(
    careerLeaders(updated).every(
      (entry) => Number(entry.player.careerStats[entry.key]) > 0,
    ),
    true,
  );
});

test("archives a season and resets only season totals", () => {
  let box = finalizeMatchPlayerBox(createMatchPlayerBox(roster), roster, {
    totalTicks: 24,
    userAttack: 55,
  });
  const updated = applyMatchStatsToRoster(roster, box, 2, { won: true });
  const archived = archiveRosterSeason(updated, 2, "Town League");
  const next = startNewPlayerSeason(archived, 3);
  assert.equal(next[0].seasonHistory.length, 1);
  assert.equal(next[0].seasonStats.games, 0);
  assert.equal(next[0].careerStats.games, 1);
});
