const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const money = (value) => Math.max(0, Math.round(Number(value) || 0));

export const START_CAPITAL_OPTIONS = Object.freeze([
  {
    id: "lean",
    amount: 75000,
    label: "75 000",
    description: "Stram start med høyere krav til salg og kostnadskontroll.",
  },
  {
    id: "standard",
    amount: 150000,
    label: "150 000",
    description: "Anbefalt startkapital med rom for normal klubbdrift.",
    recommended: true,
  },
  {
    id: "growth",
    amount: 250000,
    label: "250 000",
    description: "Raskere etablering, men høyere forventninger fra styret.",
  },
]);

export const FUNDING_PROGRAMS = Object.freeze({
  establishment: {
    id: "establishment",
    label: "Kommunalt etableringstilskudd",
    min: 25000,
    max: 75000,
    oneTime: true,
  },
  facility: {
    id: "facility",
    label: "Anleggs- og aktivitetstilskudd",
    min: 20000,
    max: 200000,
  },
  municipalLoan: {
    id: "municipalLoan",
    label: "Kommunalt lån",
    min: 50000,
    max: 200000,
  },
});

export const FACILITY_PURPOSES = Object.freeze({
  training: {
    id: "training",
    label: "Treningsfelt og treningssenter",
    projectIds: ["trainingCenter"],
  },
  stands: {
    id: "stands",
    label: "Tribuner, garderober og kampområde",
    projectIds: ["stadiumExpansion", "matchdayZone"],
  },
  accessibility: {
    id: "accessibility",
    label: "Tilgjengelighet og klubbfasiliteter",
    projectIds: ["clubOffice", "medicalCenter"],
  },
  academy: {
    id: "academy",
    label: "Ungdomsakademi",
    projectIds: ["academyProgram"],
  },
  community: {
    id: "community",
    label: "Lokalsamfunn og aktivitet",
    projectIds: ["matchdayZone", "academyProgram"],
  },
});

export function calculateLoanPayment(balance, annualRate, termWeeks) {
  const principal = money(balance);
  const weeks = Math.max(1, Math.round(Number(termWeeks) || 1));
  const weeklyRate = Math.max(0, Number(annualRate) || 0) / 52;
  if (!principal) return 0;
  if (!weeklyRate) return Math.ceil(principal / weeks);
  return Math.ceil(
    (principal * weeklyRate) / (1 - Math.pow(1 + weeklyRate, -weeks)),
  );
}

export function normalizeFundingState(value = {}) {
  return {
    applications: Array.isArray(value.applications) ? value.applications : [],
    facilityCredits: Array.isArray(value.facilityCredits)
      ? value.facilityCredits
      : [],
    lastUpdatedAt: Number(value.lastUpdatedAt) || Date.now(),
  };
}

export function absoluteGameWeek(game) {
  return Math.max(1, Number(game?.season) || 1) * 100 + Math.max(1, Number(game?.week) || 1);
}

function stableHash(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function debtTotal(game) {
  const loanDebt = Array.isArray(game?.loans)
    ? game.loans.reduce((sum, loan) => sum + money(loan?.balance), 0)
    : money(game?.debt);
  return loanDebt + money(game?.stadiumLoan);
}

function youthScore(game) {
  return clamp(
    (Number(game?.upgrades?.academy) || 0) * 12 +
      (Number(game?.completedProjects?.academyProgram) || 0) * 16 +
      (game?.boardStrategy === "youth" ? 18 : 0),
    0,
    60,
  );
}

export function applicationScore(game, input, documentationBonus = 0) {
  const program = FUNDING_PROGRAMS[input.programId];
  if (!program) return 0;

  const requested = money(input.amount);
  const ownContribution = money(input.ownContribution);
  const clubValue = money(game?.clubValue);
  const reputation = clamp(Number(game?.reputation) || 0, 0, 100);
  const boardTrust = clamp(Number(game?.boardTrust) || 0, 0, 100);
  const fans = money(game?.fans);
  const debt = debtTotal(game);
  const cash = Number(game?.cash) || 0;
  const leagueIndex = clamp(Number(game?.leagueIndex) || 0, 0, 4);

  let score =
    28 +
    reputation * 0.25 +
    boardTrust * 0.18 +
    Math.min(12, Math.log10(Math.max(10, fans)) * 4) +
    documentationBonus;

  if (program.id === "establishment") {
    score += leagueIndex === 0 ? 18 : -22;
    score += clubValue <= 100000 ? 17 : clubValue <= 180000 ? 7 : -18;
    score += youthScore(game) * 0.25;
    score += requested <= 50000 ? 8 : 1;
  }

  if (program.id === "facility") {
    const totalProject = requested + ownContribution;
    const ownShare = totalProject > 0 ? ownContribution / totalProject : 0;
    score += youthScore(game) * (input.purposeId === "academy" ? 0.42 : 0.2);
    score += ownShare >= 0.5 ? 18 : ownShare >= 0.35 ? 12 : ownShare >= 0.2 ? 5 : -18;
    score += input.purposeId === "community" || input.purposeId === "accessibility" ? 8 : 3;
    if (requested > totalProject * 0.5) score -= 22;
  }

  if (program.id === "municipalLoan") {
    const valueBase = Math.max(50000, clubValue + Math.max(0, cash));
    const debtRatio = debt / valueBase;
    score += cash >= 0 ? 8 : -4;
    score += debtRatio < 0.25 ? 16 : debtRatio < 0.55 ? 7 : -22;
    score += requested <= Math.max(75000, clubValue * 0.7) ? 10 : -10;
    score += leagueIndex <= 1 ? 5 : -4;
  }

  return Math.round(clamp(score, 0, 100));
}

function validateApplication(game, funding, input) {
  const program = FUNDING_PROGRAMS[input.programId];
  if (!program) return "Ukjent støtteordning.";
  const amount = money(input.amount);
  if (amount < program.min || amount > program.max) {
    return `Beløpet må være mellom ${program.min} og ${program.max}.`;
  }
  const season = Math.max(1, Number(game?.season) || 1);
  const applications = normalizeFundingState(funding).applications;
  const sameSeason = applications.some(
    (application) =>
      application.programId === program.id && application.season === season,
  );
  if (sameSeason) return "Denne støtteordningen er allerede brukt denne sesongen.";
  if (
    program.oneTime &&
    applications.some(
      (application) =>
        application.programId === program.id &&
        ["approved", "partial"].includes(application.status),
    )
  ) {
    return "Etableringstilskuddet kan bare mottas én gang.";
  }
  const cooldown = applications
    .filter((application) => application.programId === program.id)
    .sort((a, b) => (b.resolvedAtWeek || 0) - (a.resolvedAtWeek || 0))[0];
  if (
    cooldown?.status === "rejected" &&
    absoluteGameWeek(game) < (cooldown.retryAfterWeek || 0)
  ) {
    return "Ny søknad kan ikke sendes før ventetiden etter avslaget er over.";
  }
  if (program.id === "facility") {
    if (!FACILITY_PURPOSES[input.purposeId]) return "Velg et gyldig prosjektformål.";
    const ownContribution = money(input.ownContribution);
    if (ownContribution < Math.round(amount * 0.25)) {
      return "Egenandelen må være minst 25 % av søknadsbeløpet.";
    }
  }
  return "";
}

export function createMunicipalApplication(game, funding, input) {
  const normalized = normalizeFundingState(funding);
  const error = validateApplication(game, normalized, input);
  if (error) return { ok: false, error, funding: normalized };

  const season = Math.max(1, Number(game?.season) || 1);
  const week = Math.max(1, Number(game?.week) || 1);
  const seed = stableHash(
    `${game?.profile?.clubName || "club"}:${season}:${week}:${input.programId}:${input.amount}:${input.purposeId || "general"}`,
  );
  const processingWeeks = 2 + (seed % 5);
  const application = {
    id: `municipal-${season}-${week}-${seed.toString(36)}`,
    programId: input.programId,
    purposeId: input.purposeId || "general",
    amount: money(input.amount),
    ownContribution: money(input.ownContribution),
    purposeText: String(input.purposeText || "").slice(0, 180),
    season,
    week,
    submittedAtWeek: absoluteGameWeek(game),
    dueAtWeek: absoluteGameWeek(game) + processingWeeks,
    processingWeeks,
    status: "pending",
    score: applicationScore(game, input),
    documentationRounds: 0,
  };

  return {
    ok: true,
    application,
    funding: {
      ...normalized,
      applications: [application, ...normalized.applications],
      lastUpdatedAt: Date.now(),
    },
  };
}

function outcomeFor(application) {
  const score = Number(application.score) || 0;
  if (score >= 70) return "approved";
  if (score >= 55) return "partial";
  if (score >= 42 && (application.documentationRounds || 0) === 0) {
    return "documentation";
  }
  return "rejected";
}

export function resolveDueApplication(game, funding) {
  const normalized = normalizeFundingState(funding);
  const now = absoluteGameWeek(game);
  const pending = normalized.applications.find(
    (application) => application.status === "pending" && application.dueAtWeek <= now,
  );
  if (!pending) return { changed: false, funding: normalized };

  const status = outcomeFor(pending);
  const seed = stableHash(`${pending.id}:${pending.score}:${pending.documentationRounds || 0}`);
  const partialFactor = 0.58 + (seed % 28) / 100;
  const approvedAmount =
    status === "approved"
      ? pending.amount
      : status === "partial"
        ? Math.max(
            FUNDING_PROGRAMS[pending.programId].min,
            Math.round((pending.amount * partialFactor) / 1000) * 1000,
          )
        : 0;
  const resolved = {
    ...pending,
    status,
    approvedAmount,
    resolvedAtWeek: now,
    retryAfterWeek: status === "rejected" ? now + 6 : undefined,
  };
  return {
    changed: true,
    application: resolved,
    funding: {
      ...normalized,
      applications: normalized.applications.map((application) =>
        application.id === resolved.id ? resolved : application,
      ),
      lastUpdatedAt: Date.now(),
    },
  };
}

export function submitDocumentation(game, funding, applicationId) {
  const normalized = normalizeFundingState(funding);
  const application = normalized.applications.find((item) => item.id === applicationId);
  if (!application || application.status !== "documentation") {
    return { ok: false, error: "Søknaden venter ikke på dokumentasjon.", funding: normalized };
  }
  const score = applicationScore(
    game,
    {
      programId: application.programId,
      purposeId: application.purposeId,
      amount: application.amount,
      ownContribution: application.ownContribution,
    },
    14,
  );
  const updated = {
    ...application,
    status: "pending",
    score,
    documentationRounds: (application.documentationRounds || 0) + 1,
    dueAtWeek: absoluteGameWeek(game) + 2,
  };
  return {
    ok: true,
    application: updated,
    funding: {
      ...normalized,
      applications: normalized.applications.map((item) =>
        item.id === updated.id ? updated : item,
      ),
      lastUpdatedAt: Date.now(),
    },
  };
}

function addInbox(game, message) {
  return {
    ...game,
    inbox: [message, ...(Array.isArray(game?.inbox) ? game.inbox : [])].slice(0, 80),
  };
}

export function applyResolvedApplication(game, funding, application) {
  const normalized = normalizeFundingState(funding);
  if (!application || !["approved", "partial"].includes(application.status)) {
    return { game, funding: normalized, transaction: null };
  }
  const amount = money(application.approvedAmount);
  if (!amount) return { game, funding: normalized, transaction: null };

  if (application.programId === "establishment") {
    const nextGame = addInbox(
      {
        ...game,
        cash: Number(game?.cash || 0) + amount,
        records: {
          ...(game?.records || {}),
          mostCash: Math.max(Number(game?.records?.mostCash) || 0, Number(game?.cash || 0) + amount),
        },
      },
      `🏛️ Kommunen innvilget ${amount} i etableringstilskudd.`,
    );
    return {
      game: nextGame,
      funding: normalized,
      transaction: { type: "cash", amount },
    };
  }

  if (application.programId === "facility") {
    const purpose = FACILITY_PURPOSES[application.purposeId] || FACILITY_PURPOSES.community;
    const totalProjectBudget = application.amount + application.ownContribution;
    const coverageRate = clamp(amount / Math.max(1, totalProjectBudget), 0.2, 0.5);
    const credit = {
      id: `credit-${application.id}`,
      applicationId: application.id,
      purposeId: purpose.id,
      projectIds: purpose.projectIds,
      originalAmount: amount,
      remaining: amount,
      coverageRate,
      season: application.season,
      createdAt: Date.now(),
    };
    return {
      game: addInbox(
        game,
        `🏗️ Kommunen ga tilsagn om ${amount} til ${purpose.label}. Beløpet utbetales kun når et godkjent prosjekt startes.`,
      ),
      funding: {
        ...normalized,
        facilityCredits: [credit, ...normalized.facilityCredits],
        lastUpdatedAt: Date.now(),
      },
      transaction: { type: "facilityCredit", amount },
    };
  }

  const annualRate = 0.06;
  const termWeeks = 72;
  const loan = {
    id: `municipal-loan-${application.id}`,
    productId: "municipal",
    label: "Kommunalt utviklingslån",
    originalPrincipal: amount,
    balance: amount,
    annualRate,
    termWeeks,
    weeksRemaining: termWeeks,
    weeklyPayment: calculateLoanPayment(amount, annualRate, termWeeks),
    startedSeason: Math.max(1, Number(game?.season) || 1),
    startedWeek: Math.max(1, Number(game?.week) || 1),
  };
  const loans = [...(Array.isArray(game?.loans) ? game.loans : []), loan];
  const nextGame = addInbox(
    {
      ...game,
      cash: Number(game?.cash || 0) + amount,
      loans,
      debt: loans.reduce((sum, item) => sum + money(item.balance), 0),
    },
    `🏛️ Kommunalt lån på ${amount} er utbetalt med 6 % rente og 72 ukers løpetid.`,
  );
  return {
    game: nextGame,
    funding: normalized,
    transaction: { type: "loan", amount, loan },
  };
}

export function reimburseEligibleProject(previousGame, nextGame, funding) {
  const normalized = normalizeFundingState(funding);
  const previousProjects = new Set(
    (previousGame?.activeDevelopmentProjects || []).map((project) => project.id),
  );
  const startedProject = (nextGame?.activeDevelopmentProjects || []).find(
    (project) => !previousProjects.has(project.id),
  );
  if (!startedProject) return { changed: false, game: nextGame, funding: normalized };

  const spent = Math.max(0, Number(previousGame?.cash || 0) - Number(nextGame?.cash || 0));
  if (!spent) return { changed: false, game: nextGame, funding: normalized };

  const credit = normalized.facilityCredits.find(
    (item) => item.remaining > 0 && item.projectIds.includes(startedProject.id),
  );
  if (!credit) return { changed: false, game: nextGame, funding: normalized };

  const reimbursement = Math.min(
    credit.remaining,
    Math.max(0, Math.round(spent * credit.coverageRate)),
  );
  if (!reimbursement) return { changed: false, game: nextGame, funding: normalized };

  const nextFunding = {
    ...normalized,
    facilityCredits: normalized.facilityCredits.map((item) =>
      item.id === credit.id
        ? {
            ...item,
            remaining: Math.max(0, item.remaining - reimbursement),
            lastProjectId: startedProject.id,
            lastReimbursement: reimbursement,
          }
        : item,
    ),
    lastUpdatedAt: Date.now(),
  };
  const reimbursedGame = addInbox(
    {
      ...nextGame,
      cash: Number(nextGame?.cash || 0) + reimbursement,
    },
    `🏗️ Kommunen refunderte ${reimbursement} av prosjektkostnaden. Midlene kunne ikke brukes på lønn eller spillerkjøp.`,
  );
  return {
    changed: true,
    reimbursement,
    projectId: startedProject.id,
    game: reimbursedGame,
    funding: nextFunding,
  };
}
