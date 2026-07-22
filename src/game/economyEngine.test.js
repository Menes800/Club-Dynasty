import assert from "node:assert/strict";
import test from "node:test";
import {
  ROOKIE_ECONOMY,
  capMatchdayRevenue,
  calculateV221RepairGrant,
  rebalanceRookiePayroll,
  settleWeeklyEconomy,
  simulateCashPath,
} from "./economyEngine.js";

test("matchday revenue cap is shared without changing normal rookie income", () => {
  assert.deepEqual(
    capMatchdayRevenue({ tickets: 320, vip: 120, food: 55, merch: 45 }, 22000),
    { tickets: 320, vip: 120, food: 55, merch: 45 },
  );
  const capped = capMatchdayRevenue(
    { tickets: 20000, vip: 10000, food: 10000, merch: 10000 },
    25000,
  );
  assert.equal(
    Object.values(capped).reduce((sum, value) => sum + value, 0),
    25000,
  );
});

test("a cautious first-season club completes twelve weeks without crisis debt", () => {
  const week = settleWeeklyEconomy({
    tickets: 320,
    vip: 120,
    food: 55,
    merch: 45,
    sponsor: ROOKIE_ECONOMY.foundingSponsorWeeklyPay,
    media: 1660,
    sponsorBonus: 80,
    salaries: ROOKIE_ECONOMY.payrollTarget,
    maintenance: 370,
    matchOps: 205,
  });
  const path = simulateCashPath(
    ROOKIE_ECONOMY.startingCash,
    Array(12).fill(week.profit),
  );
  assert.ok(week.profit > -500);
  assert.ok(path.at(-1).cash > 9000);
});

test("a poor first season is uncomfortable but survives at least eight games", () => {
  const week = settleWeeklyEconomy({
    tickets: 180,
    vip: 60,
    food: 30,
    merch: 20,
    sponsor: ROOKIE_ECONOMY.foundingSponsorWeeklyPay,
    media: 1510,
    salaries: ROOKIE_ECONOMY.payrollTarget,
    maintenance: 390,
    matchOps: 210,
  });
  const path = simulateCashPath(
    ROOKIE_ECONOMY.startingCash,
    Array(8).fill(week.profit),
  );
  assert.ok(week.profit < 0);
  assert.ok(path.at(-1).cash > 7000);
});

test("reckless spending can still create a real financial crisis", () => {
  const week = settleWeeklyEconomy({
    tickets: 320,
    vip: 120,
    food: 55,
    merch: 45,
    sponsor: ROOKIE_ECONOMY.foundingSponsorWeeklyPay,
    media: 1660,
    salaries: 7200,
    staff: 1400,
    maintenance: 1500,
    matchOps: 350,
    debtService: 900,
  });
  const path = simulateCashPath(
    ROOKIE_ECONOMY.startingCash,
    Array(5).fill(week.profit),
  );
  assert.ok(week.profit < -5000);
  assert.ok(path.at(-1).cash < 0);
});

test("rookie payroll is normalized to the shared target", () => {
  const roster = Array.from({ length: 24 }, (_, index) => ({
    id: index,
    salary: 180 + (index % 4) * 30,
  }));
  const balanced = rebalanceRookiePayroll(roster);
  assert.equal(
    balanced.reduce((sum, player) => sum + player.salary, 0),
    ROOKIE_ECONOMY.payrollTarget,
  );
  assert.ok(balanced.every((player) => player.salary >= 110));
});

test("v22 first-season saves receive enough repair cash to escape the old deficit", () => {
  const grant = calculateV221RepairGrant({
    version: 22,
    season: 1,
    leagueIndex: 0,
    wins: 0,
    losses: 6,
    cash: -5900,
  });
  assert.equal(-5900 + grant, ROOKIE_ECONOMY.repairCashFloor);
  assert.equal(
    calculateV221RepairGrant({
      version: 22.1,
      season: 1,
      leagueIndex: 0,
      wins: 0,
      losses: 6,
      cash: -5900,
    }),
    0,
  );
});
