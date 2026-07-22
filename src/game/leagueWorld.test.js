import assert from "node:assert/strict";
import test from "node:test";

import {
  createOffseasonLeagueFeed,
  createWeeklyLeagueFeed,
  refreshAiTeamStories,
} from "./leagueWorld.js";

const teams = [
  {
    id: "wolves",
    name: "Westbridge Wolves",
    coachName: "Maya Reed",
    strategy: "youth",
    wins: 3,
    losses: 1,
    pointsFor: 90,
    pointsAgainst: 65,
    power: 67,
    payroll: 9000,
    form: ["W", "W", "L", "W"],
  },
  {
    id: "hawks",
    name: "Harbor City Hawks",
    coachName: "Leo Stone",
    strategy: "spender",
    wins: 2,
    losses: 2,
    pointsFor: 70,
    pointsAgainst: 72,
    power: 65,
    payroll: 9500,
    form: ["L", "W", "W", "L"],
  },
];

test("creates structured weekly rivalry and table stories", () => {
  const feed = createWeeklyLeagueFeed({
    teams,
    opponent: teams[0],
    rivalName: "Westbridge Wolves",
    season: 2,
    week: 4,
  });
  assert.ok(feed.some((item) => item.type === "table"));
  assert.ok(feed.some((item) => item.type === "rival"));
  assert.equal(
    feed.every((item) => item.season === 2),
    true,
  );
});

test("gives AI clubs offseason identities and draft headlines", () => {
  const refreshed = refreshAiTeamStories(teams, 3);
  assert.equal(refreshed.length, teams.length);
  assert.equal(
    refreshed.every((team) => team.transferActivity),
    true,
  );
  const feed = createOffseasonLeagueFeed(refreshed, 3, "Westbridge Wolves");
  assert.ok(feed.length >= 1);
});
