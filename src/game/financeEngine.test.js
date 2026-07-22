import assert from "node:assert/strict";
import test from "node:test";
import {
  addLoanFromQuote,
  applyExtraDebtPayment,
  calculateLoanPayment,
  getDebtSnapshot,
  getLoanDashboard,
  normalizeLoanBook,
  processWeeklyDebt,
  restructureDebtWithAdvance,
} from "./financeEngine.js";

const game = {
  season: 1,
  week: 4,
  phase: "club",
  cash: 94,
  debt: 0,
  loans: [],
  stadiumLoan: 0,
  leagueIndex: 0,
  clubValue: 25000,
  reputation: 4,
  boardTrust: 74,
};

const finance = {
  income: 9200,
  expenses: 7300,
  operatingProfit: 1900,
};

test("calculates a real amortized weekly payment", () => {
  const payment = calculateLoanPayment(10000, 0.12, 48);
  assert.ok(payment > 208);
  assert.ok(payment < 240);
});

test("gives a profitable first-season club financing within a hard cap", () => {
  const dashboard = getLoanDashboard(game, finance);
  const credit = dashboard.products.find((product) => product.id === "credit");
  const operating = dashboard.products.find(
    (product) => product.id === "operating",
  );
  assert.ok(dashboard.limit >= 25000);
  assert.equal(credit.eligible, true);
  assert.equal(operating.eligible, true);
  assert.ok(credit.amount >= 10000);
  assert.ok(credit.balance <= dashboard.available);
});

test("tops up one credit facility without stacking separate loans", () => {
  const dashboard = getLoanDashboard(game, finance);
  const quote = dashboard.products.find((product) => product.id === "credit");
  const borrowed = addLoanFromQuote(game, quote, "credit-1").game;
  const after = getLoanDashboard(borrowed, finance);
  const topUp = after.products.find((product) => product.id === "credit");
  assert.equal(topUp.eligible, true);
  assert.equal(topUp.isTopUp, true);
  const toppedUp = addLoanFromQuote(borrowed, topUp, "ignored-new-id").game;
  assert.equal(
    toppedUp.loans.filter((loan) => loan.productId === "credit").length,
    1,
  );
  assert.ok(getDebtSnapshot(toppedUp).totalDebt <= after.limit);
});

test("first-season operating loan stays available during a temporary deficit", () => {
  const dashboard = getLoanDashboard(game, {
    income: 3300,
    expenses: 3800,
    operatingProfit: -500,
  });
  const operating = dashboard.products.find(
    (product) => product.id === "operating",
  );
  assert.equal(operating.eligible, true);
  assert.ok(operating.amount >= operating.minimumAmount);
});

test("player can choose a smaller loan and sees the exact forced payment", () => {
  const dashboard = getLoanDashboard(game, finance, { operating: 5000 });
  const operating = dashboard.products.find(
    (product) => product.id === "operating",
  );
  assert.equal(operating.amount, 5000);
  assert.equal(
    operating.weeklyPayment,
    calculateLoanPayment(
      operating.balance,
      operating.annualRate,
      operating.termWeeks,
    ),
  );
  assert.ok(operating.totalWeeklyPaymentAfter >= operating.weeklyPayment);
});

test("season-one debt can never show available capacity with every route locked", () => {
  const pressured = {
    ...game,
    phase: "offseason",
    cash: 5800,
    loans: normalizeLoanBook([
      {
        id: "credit-active",
        productId: "credit",
        label: "Kassekreditt",
        balance: 3100,
        annualRate: 0.19,
        termWeeks: 24,
        weeksRemaining: 14,
      },
      {
        id: "emergency-active",
        productId: "emergency",
        label: "Styrets nødlån",
        balance: 19400,
        annualRate: 0.28,
        termWeeks: 18,
        weeksRemaining: 18,
      },
    ]),
    debt: 22500,
  };
  const dashboard = getLoanDashboard(pressured, {
    income: 2600,
    expenses: 6000,
    operatingProfit: -3400,
  });
  assert.ok(dashboard.available > 0);
  assert.equal(
    dashboard.products.some((product) => product.eligible),
    true,
  );
});

test("blocks every new loan when the total borrowing limit is used", () => {
  const initial = getLoanDashboard(game, finance);
  const capped = getLoanDashboard(
    { ...game, stadiumLoan: initial.limit },
    finance,
  );
  assert.equal(capped.available, 0);
  assert.equal(
    capped.products.every((product) => !product.eligible),
    true,
  );
});

test("turns legacy scalar debt into a forced repayment plan", () => {
  const loans = normalizeLoanBook(undefined, 12500);
  const processed = processWeeklyDebt({
    ...game,
    loans,
    debt: 12500,
  });
  assert.equal(loans.length, 1);
  assert.equal(loans[0].productId, "legacy");
  assert.ok(processed.payment > 0);
  assert.ok(processed.debt < 12500);
});

test("forces interest and principal payment every game week", () => {
  const loans = normalizeLoanBook([
    {
      id: "loan-1",
      productId: "credit",
      label: "Kassekreditt",
      balance: 10000,
      annualRate: 0.19,
      termWeeks: 24,
      weeksRemaining: 24,
    },
  ]);
  const before = { ...game, loans, debt: 10000, cash: 0 };
  const processed = processWeeklyDebt(before);
  assert.ok(processed.payment > 0);
  assert.ok(processed.interest > 0);
  assert.ok(processed.debt < 10000);
});

test("extra payments target the most expensive debt and reduce cash", () => {
  const loans = normalizeLoanBook([
    { id: "cheap", balance: 6000, annualRate: 0.08, termWeeks: 24 },
    { id: "expensive", balance: 4000, annualRate: 0.28, termWeeks: 18 },
  ]);
  const result = applyExtraDebtPayment(
    { ...game, cash: 5000, loans, debt: 10000 },
    5000,
  );
  const snapshot = getDebtSnapshot(result.game);
  assert.equal(result.paid, 5000);
  assert.equal(result.game.cash, 0);
  assert.equal(snapshot.totalDebt, 5000);
  assert.equal(
    snapshot.loans.some((loan) => loan.id === "expensive"),
    false,
  );
});

test("restructuring consolidates loans instead of stacking more small debt", () => {
  const loans = normalizeLoanBook([
    { id: "one", balance: 4000, annualRate: 0.19, termWeeks: 24 },
    { id: "two", balance: 5000, annualRate: 0.12, termWeeks: 48 },
  ]);
  const result = restructureDebtWithAdvance(
    { ...game, loans, debt: 9000 },
    3000,
    finance,
    "restructured",
  );
  assert.equal(result.ok, true);
  assert.equal(result.game.loans.length, 1);
  assert.equal(result.game.cash, game.cash + 3000);
  assert.ok(result.game.debt > 12000);
});
