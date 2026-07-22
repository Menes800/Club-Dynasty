const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const LOAN_PRODUCTS = {
  credit: {
    id: "credit",
    label: "Kassekreditt",
    description:
      "Alltid tilgjengelig så lenge klubben har ledig låneramme. Dyr, men gir rask likviditet.",
    annualRate: 0.19,
    feeRate: 0.03,
    termWeeks: 24,
    minimum: 2000,
    maximumByLeague: [18000, 30000, 50000, 85000, 130000],
    allowsTopUp: true,
  },
  operating: {
    id: "operating",
    label: "Driftslån",
    description:
      "Lavere rente for klubber som kan betjene lånet gjennom den løpende driften.",
    annualRate: 0.12,
    feeRate: 0.02,
    termWeeks: 48,
    minimum: 5000,
    maximumByLeague: [25000, 55000, 110000, 220000, 420000],
  },
  emergency: {
    id: "emergency",
    label: "Styrets nødlån",
    description:
      "Siste utvei ved presset likviditet. Kort løpetid, høy rente og lavere styretillit.",
    annualRate: 0.28,
    feeRate: 0.08,
    termWeeks: 18,
    minimum: 1000,
    maximumByLeague: [18000, 28000, 50000, 85000, 140000],
  },
};

export function calculateLoanPayment(balance, annualRate, termWeeks) {
  const principal = Math.max(0, Number(balance) || 0);
  const weeks = Math.max(1, Math.round(Number(termWeeks) || 1));
  const weeklyRate = Math.max(0, Number(annualRate) || 0) / 52;
  if (principal <= 0) return 0;
  if (weeklyRate === 0) return Math.ceil(principal / weeks);
  return Math.ceil(
    (principal * weeklyRate) / (1 - Math.pow(1 + weeklyRate, -weeks)),
  );
}

function normalizeLoan(loan, index = 0) {
  const balance = Math.max(
    0,
    Math.round(Number(loan?.balance ?? loan?.principal ?? 0) || 0),
  );
  const annualRate = clamp(Number(loan?.annualRate ?? 0.14) || 0.14, 0, 0.6);
  const termWeeks = Math.max(
    1,
    Math.round(Number(loan?.termWeeks ?? loan?.weeksRemaining ?? 36) || 36),
  );
  const weeksRemaining = Math.max(
    1,
    Math.round(Number(loan?.weeksRemaining ?? termWeeks) || termWeeks),
  );
  return {
    id: loan?.id ?? `loan-${index + 1}`,
    productId: loan?.productId ?? loan?.type ?? "legacy",
    label: loan?.label ?? "Klubblån",
    originalPrincipal: Math.max(
      balance,
      Math.round(Number(loan?.originalPrincipal ?? balance) || balance),
    ),
    balance,
    annualRate,
    termWeeks,
    weeksRemaining,
    weeklyPayment: Math.max(
      1,
      Math.round(
        Number(loan?.weeklyPayment) ||
          calculateLoanPayment(balance, annualRate, weeksRemaining),
      ),
    ),
    startedSeason: Math.max(
      1,
      Math.round(Number(loan?.startedSeason ?? 1) || 1),
    ),
    startedWeek: Math.max(1, Math.round(Number(loan?.startedWeek ?? 1) || 1)),
  };
}

export function normalizeLoanBook(loans, legacyDebt = 0, season = 1) {
  const normalized = Array.isArray(loans)
    ? loans.map(normalizeLoan).filter((loan) => loan.balance > 0)
    : [];
  const oldDebt = Math.max(0, Math.round(Number(legacyDebt) || 0));
  if (normalized.length || oldDebt <= 0) return normalized;
  return [
    normalizeLoan({
      id: "legacy-debt",
      productId: "legacy",
      label: "Migrert klubbgjeld",
      originalPrincipal: oldDebt,
      balance: oldDebt,
      annualRate: 0.14,
      termWeeks: 36,
      weeksRemaining: 36,
      startedSeason: season,
      startedWeek: 1,
    }),
  ];
}

export function sumLoanBalances(loans) {
  return normalizeLoanBook(loans).reduce((sum, loan) => sum + loan.balance, 0);
}

export function calculateStadiumPayment(stadiumLoan = 0) {
  const balance = Math.max(0, Math.round(Number(stadiumLoan) || 0));
  return balance > 0
    ? Math.min(balance, Math.max(750, Math.round(balance / 120)))
    : 0;
}

export function getDebtSnapshot(game) {
  const loans = normalizeLoanBook(game?.loans, game?.debt, game?.season);
  const genericDebt = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const stadiumDebt = Math.max(0, Math.round(Number(game?.stadiumLoan) || 0));
  const weeklyLoanPayment = loans.reduce(
    (sum, loan) =>
      sum +
      Math.min(
        loan.weeklyPayment,
        loan.balance + Math.round((loan.balance * loan.annualRate) / 52),
      ),
    0,
  );
  const weeklyStadiumPayment = calculateStadiumPayment(stadiumDebt);
  return {
    loans,
    genericDebt,
    stadiumDebt,
    totalDebt: genericDebt + stadiumDebt,
    weeklyLoanPayment,
    weeklyStadiumPayment,
    weeklyPayment: weeklyLoanPayment + weeklyStadiumPayment,
  };
}

export function calculateBorrowingCapacity(game, finance = {}) {
  const debt = getDebtSnapshot(game);
  const leagueIndex = clamp(Math.round(Number(game?.leagueIndex) || 0), 0, 4);
  const weeklyIncome = Math.max(0, Number(finance.income) || 0);
  const operatingProfit = Number(
    finance.operatingProfit ?? finance.profit ?? 0,
  );
  const tierCaps = [60000, 160000, 420000, 950000, 2200000];
  const base =
    15000 +
    leagueIndex * 18000 +
    weeklyIncome * 2.35 +
    Math.max(0, Number(game?.clubValue) || 0) * 0.16 +
    Math.max(0, Number(game?.reputation) || 0) * 240 +
    Math.max(0, Number(game?.boardTrust) || 0) * 55;
  const profitabilityAdjustment =
    operatingProfit >= 0
      ? Math.min(25000 + leagueIndex * 15000, operatingProfit * 5)
      : -Math.min(18000, Math.abs(operatingProfit) * 1.6);
  const limit = Math.round(
    clamp(base + profitabilityAdjustment, 25000, tierCaps[leagueIndex]),
  );
  const available = Math.max(0, limit - debt.totalDebt);
  const debtRatio = debt.totalDebt / Math.max(1, limit);
  const creditScore = Math.round(
    clamp(
      36 +
        (Number(game?.boardTrust) || 0) * 0.34 +
        (Number(game?.reputation) || 0) * 0.24 +
        (operatingProfit >= 0 ? 10 : -12) -
        debtRatio * 34,
      0,
      100,
    ),
  );
  return {
    ...debt,
    limit,
    used: debt.totalDebt,
    available,
    debtRatio,
    creditScore,
    operatingProfit,
    weeklyIncome,
  };
}

function desiredLoanAmount(productId, game, finance, capacity) {
  const leagueIndex = clamp(Math.round(Number(game?.leagueIndex) || 0), 0, 4);
  const expenses = Math.max(0, Number(finance.expenses) || 0);
  const cash = Number(game?.cash) || 0;
  const liquidityTarget = Math.max(6000, expenses * 2.5);
  if (productId === "credit") {
    return Math.min(
      capacity.available,
      12000 + leagueIndex * 8000,
      Math.max(5000, liquidityTarget - cash),
    );
  }
  if (productId === "operating") {
    return Math.min(
      capacity.available,
      25000 + leagueIndex * 30000,
      Math.max(10000, capacity.weeklyIncome * 1.6),
    );
  }
  return Math.min(
    capacity.available,
    18000 + leagueIndex * 10000,
    Math.max(5000, liquidityTarget - cash),
  );
}

function quoteProduct(productId, game, finance, capacity, requestedAmount) {
  const product = LOAN_PRODUCTS[productId];
  const activeProductLoan = capacity.loans.find(
    (loan) => loan.productId === productId && loan.balance > 0,
  );
  const hasProduct = Boolean(activeProductLoan);
  const leagueIndex = clamp(Math.round(Number(game?.leagueIndex) || 0), 0, 4);
  const productLimit = product.maximumByLeague[leagueIndex];
  const productDebtRemaining = Math.max(
    0,
    productLimit -
      (product.allowsTopUp ? (activeProductLoan?.balance ?? 0) : 0),
  );
  const maximumAmount = Math.max(
    0,
    Math.floor(
      Math.min(capacity.available, productDebtRemaining) /
        (1 + product.feeRate) /
        500,
    ) * 500,
  );
  const recommendedAmount = Math.max(
    0,
    Math.floor(
      Math.min(
        desiredLoanAmount(productId, game, finance, capacity),
        maximumAmount,
      ) / 500,
    ) * 500,
  );
  const selectedAmount = Number(requestedAmount);
  const amount = Number.isFinite(selectedAmount)
    ? clamp(Math.floor(selectedAmount / 500) * 500, 0, maximumAmount)
    : recommendedAmount;
  const fee = Math.round(amount * product.feeRate);
  const balance = amount + fee;
  const isTopUp = Boolean(product.allowsTopUp && activeProductLoan);
  const resultingProductBalance =
    (isTopUp ? activeProductLoan.balance : 0) + balance;
  const resultingTermWeeks = isTopUp
    ? Math.max(activeProductLoan.weeksRemaining, product.termWeeks)
    : product.termWeeks;
  const weeklyPayment = calculateLoanPayment(
    resultingProductBalance,
    product.annualRate,
    resultingTermWeeks,
  );
  const totalWeeklyPaymentAfter = Math.max(
    0,
    capacity.weeklyPayment -
      (isTopUp ? activeProductLoan.weeklyPayment : 0) +
      weeklyPayment,
  );
  const cashThreshold = Math.max(5000, (Number(finance.expenses) || 0) * 2);
  const firstSeasonAccess =
    Number(game?.season ?? 1) <= 1 && Number(game?.leagueIndex ?? 0) === 0;
  let reason = "";
  if (hasProduct && !product.allowsTopUp)
    reason = `Du har allerede aktiv ${product.label.toLowerCase()}.`;
  else if (capacity.available < product.minimum)
    reason = "Klubben har brukt hele lånerammen.";
  else if (maximumAmount < product.minimum)
    reason = isTopUp
      ? "Kassekreditten er fullt utnyttet innenfor produkt- eller lånerammen."
      : `Det er mindre enn minste lånebeløp ${product.minimum} igjen av rammen.`;
  else if (amount < product.minimum)
    reason = `Minste lånebeløp er ${product.minimum}.`;
  else if (
    productId === "operating" &&
    capacity.operatingProfit <= 0 &&
    capacity.creditScore < 62 &&
    !firstSeasonAccess
  )
    reason =
      "Driftslånet krever positivt ukesresultat eller kredittscore på minst 62.";
  else if (
    productId === "emergency" &&
    Number(game?.cash) >= cashThreshold &&
    game?.phase !== "offseason"
  )
    reason = "Nødlån åpnes når likviditeten er presset eller i offseason.";
  const eligible = !reason;
  return {
    ...product,
    amount,
    fee,
    balance,
    weeklyPayment,
    totalWeeklyPaymentAfter,
    paymentIncrease: Math.max(
      0,
      weeklyPayment - (isTopUp ? activeProductLoan.weeklyPayment : 0),
    ),
    productLimit,
    minimumAmount: product.minimum,
    recommendedAmount,
    maximumAmount,
    amountChoices: [
      ...new Set([product.minimum, recommendedAmount, maximumAmount]),
    ].filter((choice) => choice >= product.minimum && choice <= maximumAmount),
    isTopUp,
    actionLabel: isTopUp
      ? "Øk kassekreditten"
      : `Ta ${product.label.toLowerCase()}`,
    remainingAfter: Math.max(0, capacity.available - balance),
    eligible,
    reason,
  };
}

export function getLoanDashboard(game, finance = {}, requestedAmounts = {}) {
  const capacity = calculateBorrowingCapacity(game, finance);
  const products = ["credit", "operating", "emergency"].map((id) =>
    quoteProduct(id, game, finance, capacity, requestedAmounts[id]),
  );
  return { ...capacity, products };
}

export function addLoanFromQuote(game, quote, id) {
  if (!quote?.eligible || quote.amount <= 0) {
    return {
      ok: false,
      reason: quote?.reason || "Lånet er ikke tilgjengelig.",
    };
  }
  const snapshot = getDebtSnapshot(game);
  const existingLoan = quote.isTopUp
    ? snapshot.loans.find((item) => item.productId === quote.id)
    : undefined;
  const loan = normalizeLoan({
    id: existingLoan?.id ?? id ?? `${quote.id}-${Date.now()}`,
    productId: quote.id,
    label: quote.label,
    originalPrincipal: (existingLoan?.originalPrincipal ?? 0) + quote.balance,
    balance: (existingLoan?.balance ?? 0) + quote.balance,
    annualRate: quote.annualRate,
    termWeeks: quote.isTopUp
      ? Math.max(existingLoan?.termWeeks ?? 0, quote.termWeeks)
      : quote.termWeeks,
    weeksRemaining: quote.isTopUp
      ? Math.max(existingLoan?.weeksRemaining ?? 0, quote.termWeeks)
      : quote.termWeeks,
    weeklyPayment: quote.weeklyPayment,
    startedSeason: existingLoan?.startedSeason ?? game?.season ?? 1,
    startedWeek: existingLoan?.startedWeek ?? game?.week ?? 1,
  });
  const loans = existingLoan
    ? snapshot.loans.map((item) => (item.id === existingLoan.id ? loan : item))
    : [...snapshot.loans, loan];
  return {
    ok: true,
    loan,
    game: {
      ...game,
      cash: (Number(game?.cash) || 0) + quote.amount,
      loans,
      debt: sumLoanBalances(loans),
    },
  };
}

export function addManualLoan(
  game,
  {
    id,
    productId = "board",
    label = "Styrelån",
    cashAmount,
    balance,
    annualRate = 0.22,
    termWeeks = 24,
  },
  finance = {},
) {
  const capacity = calculateBorrowingCapacity(game, finance);
  const debtAdded = Math.max(0, Math.round(Number(balance) || 0));
  if (
    capacity.loans.some(
      (loan) => loan.productId === productId && loan.balance > 0,
    )
  ) {
    return {
      ok: false,
      reason: `Klubben har allerede aktiv ${label.toLowerCase()}.`,
    };
  }
  if (debtAdded <= 0 || debtAdded > capacity.available) {
    return {
      ok: false,
      reason:
        capacity.available <= 0
          ? "Klubben har brukt hele lånerammen."
          : `Lånet er over ledig ramme på ${capacity.available}.`,
    };
  }
  const snapshot = getDebtSnapshot(game);
  const loan = normalizeLoan({
    id: id ?? `${productId}-${Date.now()}`,
    productId,
    label,
    originalPrincipal: debtAdded,
    balance: debtAdded,
    annualRate,
    termWeeks,
    weeksRemaining: termWeeks,
    startedSeason: game?.season ?? 1,
    startedWeek: game?.week ?? 1,
  });
  const loans = [...snapshot.loans, loan];
  return {
    ok: true,
    loan,
    game: {
      ...game,
      cash: (Number(game?.cash) || 0) + Math.max(0, Number(cashAmount) || 0),
      loans,
      debt: sumLoanBalances(loans),
    },
  };
}

export function restructureDebtWithAdvance(
  game,
  cashAmount,
  finance = {},
  id = `restructure-${Date.now()}`,
) {
  const capacity = calculateBorrowingCapacity(game, finance);
  const snapshot = getDebtSnapshot(game);
  const amount = Math.max(0, Math.round(Number(cashAmount) || 0));
  const fee = Math.round(amount * 0.08);
  if (amount <= 0 || amount + fee > capacity.available) {
    return {
      ok: false,
      reason:
        capacity.available <= 0
          ? "Klubben har brukt hele lånerammen."
          : "Det er ikke nok ledig ramme til restruktureringen.",
    };
  }
  const balance = snapshot.genericDebt + amount + fee;
  const loan = normalizeLoan({
    id,
    productId: "restructure",
    label: "Gjeldsrestrukturering",
    originalPrincipal: balance,
    balance,
    annualRate: 0.24,
    termWeeks: 36,
    weeksRemaining: 36,
    startedSeason: game?.season ?? 1,
    startedWeek: game?.week ?? 1,
  });
  return {
    ok: true,
    amount,
    fee,
    loan,
    game: {
      ...game,
      cash: (Number(game?.cash) || 0) + amount,
      loans: [loan],
      debt: loan.balance,
    },
  };
}

export function processWeeklyDebt(game) {
  const snapshot = getDebtSnapshot(game);
  let interest = 0;
  let principal = 0;
  let loanPayment = 0;
  const loans = [];
  for (const loan of snapshot.loans) {
    const weeklyInterest = Math.max(
      0,
      Math.round((loan.balance * loan.annualRate) / 52),
    );
    const payment = Math.min(
      loan.balance + weeklyInterest,
      Math.max(1, loan.weeklyPayment),
    );
    const principalPaid = Math.min(
      loan.balance,
      Math.max(0, payment - weeklyInterest),
    );
    const balance = Math.max(0, loan.balance - principalPaid);
    interest += weeklyInterest;
    principal += principalPaid;
    loanPayment += payment;
    if (balance > 0) {
      loans.push({
        ...loan,
        balance,
        weeksRemaining: Math.max(1, loan.weeksRemaining - 1),
      });
    }
  }
  const stadiumPayment = snapshot.weeklyStadiumPayment;
  const stadiumLoan = Math.max(0, snapshot.stadiumDebt - stadiumPayment);
  return {
    loans,
    debt: sumLoanBalances(loans),
    stadiumLoan,
    payment: loanPayment + stadiumPayment,
    loanPayment,
    stadiumPayment,
    interest,
    principal: principal + stadiumPayment,
  };
}

export function applyExtraDebtPayment(game, requestedAmount = 10000) {
  const snapshot = getDebtSnapshot(game);
  let available = Math.max(
    0,
    Math.min(Number(game?.cash) || 0, Number(requestedAmount) || 0),
  );
  const paid = available;
  const ordered = [...snapshot.loans].sort(
    (a, b) => b.annualRate - a.annualRate,
  );
  const loans = ordered
    .map((loan) => {
      const payment = Math.min(available, loan.balance);
      available -= payment;
      return { ...loan, balance: loan.balance - payment };
    })
    .filter((loan) => loan.balance > 0);
  let stadiumLoan = snapshot.stadiumDebt;
  if (available > 0 && stadiumLoan > 0) {
    const payment = Math.min(available, stadiumLoan);
    stadiumLoan -= payment;
    available -= payment;
  }
  const actualPaid = paid - available;
  return {
    game: {
      ...game,
      cash: (Number(game?.cash) || 0) - actualPaid,
      loans,
      debt: sumLoanBalances(loans),
      stadiumLoan,
    },
    paid: actualPaid,
  };
}

export function buildCashForecast(game, weeklyProfit, weeks = 4) {
  let cash = Number(game?.cash) || 0;
  return Array.from({ length: Math.max(1, weeks) }, (_, index) => {
    cash += Number(weeklyProfit) || 0;
    return { week: index + 1, cash: Math.round(cash) };
  });
}
