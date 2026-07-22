import assert from "node:assert/strict";
import test from "node:test";
import {
  START_CAPITAL_OPTIONS,
  applyResolvedApplication,
  createMunicipalApplication,
  reimburseEligibleProject,
  resolveDueApplication,
} from "./municipalFunding.js";

const game = {
  season: 1,
  week: 1,
  leagueIndex: 0,
  cash: 150000,
  clubValue: 25000,
  reputation: 45,
  boardTrust: 60,
  fans: 125,
  loans: [],
  upgrades: { academy: 1 },
  completedProjects: { academyProgram: 0 },
  activeDevelopmentProjects: [],
  profile: { clubName: "Test Club" },
  inbox: [],
};

test("standard start capital is 150k", () => {
  assert.equal(START_CAPITAL_OPTIONS.find((item) => item.recommended).amount, 150000);
});

test("only one application per program per season", () => {
  const first = createMunicipalApplication(game, {}, {
    programId: "establishment",
    amount: 50000,
  });
  assert.equal(first.ok, true);
  const second = createMunicipalApplication(game, first.funding, {
    programId: "establishment",
    amount: 50000,
  });
  assert.equal(second.ok, false);
});

test("approved establishment grant adds cash", () => {
  const result = applyResolvedApplication(game, {}, {
    id: "grant",
    programId: "establishment",
    status: "approved",
    approvedAmount: 50000,
  });
  assert.equal(result.game.cash, 200000);
});

test("facility support stays earmarked until a matching project starts", () => {
  const approved = applyResolvedApplication(game, {}, {
    id: "facility",
    programId: "facility",
    purposeId: "training",
    amount: 100000,
    ownContribution: 100000,
    status: "approved",
    approvedAmount: 100000,
    season: 1,
  });
  assert.equal(approved.game.cash, 150000);
  assert.equal(approved.funding.facilityCredits[0].remaining, 100000);

  const next = {
    ...approved.game,
    cash: 50000,
    activeDevelopmentProjects: [
      { id: "trainingCenter", stage: 0, weeksLeft: 3, totalWeeks: 3 },
    ],
  };
  const reimbursement = reimburseEligibleProject(
    approved.game,
    next,
    approved.funding,
  );
  assert.equal(reimbursement.changed, true);
  assert.equal(reimbursement.game.cash, 100000);
  assert.equal(reimbursement.funding.facilityCredits[0].remaining, 50000);
});

test("pending applications resolve when due", () => {
  const created = createMunicipalApplication(game, {}, {
    programId: "municipalLoan",
    amount: 75000,
  });
  const future = { ...game, week: game.week + created.application.processingWeeks };
  const resolved = resolveDueApplication(future, created.funding);
  assert.equal(resolved.changed, true);
  assert.notEqual(resolved.application.status, "pending");
});
