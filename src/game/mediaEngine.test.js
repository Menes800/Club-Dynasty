import assert from "node:assert/strict";
import test from "node:test";
import { calculateMediaPayout, getBroadcastDeals } from "./mediaEngine.js";

const game = {
  leagueIndex: 0,
  fans: 180,
  mediaReach: 240,
  reputation: 4,
  profile: { rivalName: "Harbor Wolves" },
  tvDeal: { id: "none" },
};

const opponent = { name: "Town Bears", mediaProfile: 48 };

test("early clubs receive a small transparent radio payout", () => {
  const payout = calculateMediaPayout(game, opponent, {}, false);
  assert.equal(payout.format, "Lokalradio");
  assert.equal(
    payout.revenue,
    payout.fixedFee + payout.cpmRevenue + payout.leagueShare,
  );
  assert.ok(payout.revenue >= 1500);
  assert.ok(payout.revenue < 2500);
});

test("a selected TV deal pays fixed fee plus CPM without millions", () => {
  const deal = getBroadcastDeals(2).find((item) => item.id === "stream");
  const payout = calculateMediaPayout(
    {
      ...game,
      leagueIndex: 2,
      fans: 8000,
      mediaReach: 6000,
      reputation: 40,
      tvDeal: deal,
    },
    { ...opponent, mediaProfile: 75 },
    { playoff: "semifinal" },
    true,
  );
  assert.equal(payout.format, "Strømming");
  assert.ok(payout.cpmRevenue > 0);
  assert.ok(payout.revenue < 50000);
});
