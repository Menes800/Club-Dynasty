import {
  FACILITY_PURPOSES,
  FUNDING_PROGRAMS,
  START_CAPITAL_OPTIONS,
  applyResolvedApplication,
  createMunicipalApplication,
  normalizeFundingState,
  reimburseEligibleProject,
  resolveDueApplication,
  submitDocumentation,
} from "./game/municipalFunding.js";

const CORE_KEY = "sports-empire-core-v22";
const BACKUP_KEY = "sports-empire-core-v22-backup";
const SLOT_KEYS = ["sports-empire-slot-1", "sports-empire-slot-2", "sports-empire-slot-3"];
const EXTENSION_KEY = "club-dynasty-v23-extension";
const CORE_KEYS = new Set([CORE_KEY, BACKUP_KEY, ...SLOT_KEYS]);
const rawSetItem = Storage.prototype.setItem;
const rawGetItem = Storage.prototype.getItem;
const rawRemoveItem = Storage.prototype.removeItem;

let reloadScheduled = false;
let municipalTabActive = false;
let rendering = false;
let storagePatched = false;

const translations = {
  "Kommandosenter": "Command center",
  "Sportslig": "Sporting",
  "Klubbdrift": "Club operations",
  "Liga": "League",
  "Hjem": "Home",
  "Spillerstall": "Roster",
  "Marked": "Market",
  "Klubbområde": "Club facilities",
  "Økonomi": "Finance",
  "Styre": "Board",
  "Innboks": "Inbox",
  "Sesong": "Season",
  "Historie": "History",
  "Oversikt": "Overview",
  "Sponsorer": "Sponsors",
  "Priser": "Pricing",
  "Finansiering": "Financing",
  "Slik ligger du an": "Current position",
  "Penger på konto": "Cash on hand",
  "Reserve / fritt beløp": "Reserve / free cash",
  "Sesongprognose": "Season forecast",
  "Gjeldstrekk": "Debt payment",
  "Kontantbuffer": "Cash runway",
  "Klubbens lønnsbudsjett": "Club payroll budget",
  "Penger inn": "Money in",
  "Forventede inntekter": "Expected income",
  "Penger ut": "Money out",
  "Forventede kostnader": "Expected expenses",
  "NESTE KAMP": "NEXT MATCH",
  "Bygg neste sesong": "Build next season",
  "Bygg klubben fra grunnen.": "Build the club from the ground up.",
  "Overrask meg med alt": "Surprise me with everything",
  "Klubbnavn": "Club name",
  "Manager-navn": "Manager name",
  "Språk": "Language",
  "By": "City",
  "Stadionnavn": "Stadium name",
  "Klubbmotto": "Club motto",
  "Supportergruppe": "Supporter group",
  "Hovedrival": "Main rival",
  "Generer identitet": "Generate identity",
  "Nye farger": "New colors",
  "Supportere": "Supporters",
  "Ikke valgt": "Not selected",
  "Rival": "Rival",
  "Din nye klubb": "Your new club",
  "Ny by": "New city",
  "Nytt stadion": "New stadium",
  "Nytt motto": "New motto",
};
const reverseTranslations = Object.fromEntries(
  Object.entries(translations).map(([norwegian, english]) => [english, norwegian]),
);
const translatedNodes = new WeakMap();

function parseJson(value, fallback = null) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function defaultExtension() {
  return {
    version: 23,
    startCapital: {
      choice: 150000,
      applied: false,
    },
    funding: normalizeFundingState(),
    sync: null,
    updatedAt: Date.now(),
  };
}

function loadExtension() {
  const stored = parseJson(rawGetItem.call(localStorage, EXTENSION_KEY), {});
  const extension = {
    ...defaultExtension(),
    ...stored,
    startCapital: {
      ...defaultExtension().startCapital,
      ...(stored?.startCapital || {}),
    },
    funding: normalizeFundingState(stored?.funding),
  };
  const core = parseJson(rawGetItem.call(localStorage, CORE_KEY), null);
  if (
    core?.municipalFunding &&
    extension.funding.applications.length === 0 &&
    extension.funding.facilityCredits.length === 0
  ) {
    extension.funding = normalizeFundingState(core.municipalFunding);
  }
  return extension;
}

function saveExtension(extension) {
  extension.updatedAt = Date.now();
  rawSetItem.call(localStorage, EXTENSION_KEY, JSON.stringify(extension));
}

function makeSyncToken() {
  return `v23-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function startSync(game, extension, fields) {
  const token = makeSyncToken();
  game.v23SyncToken = token;
  extension.sync = {
    token,
    snapshot: Object.fromEntries(fields.map((field) => [field, game[field]])),
    createdAt: Date.now(),
  };
}

function applyPendingSync(game, extension) {
  if (!extension.sync) return { game, changed: false };
  if (game.v23SyncToken === extension.sync.token) {
    extension.sync = null;
    return { game, changed: false };
  }
  return {
    changed: true,
    game: {
      ...game,
      ...extension.sync.snapshot,
      v23SyncToken: extension.sync.token,
    },
  };
}

function capitalChoice(extension) {
  return START_CAPITAL_OPTIONS.some(
    (option) => option.amount === Number(extension.startCapital.choice),
  )
    ? Number(extension.startCapital.choice)
    : 150000;
}

function applyStartCapital(game, extension) {
  const seasonStartCash = Number(game?.seasonStartCash ?? 15000);
  const eligible =
    game &&
    game.phase !== "setup" &&
    Number(game.season || 1) === 1 &&
    seasonStartCash <= 20000 &&
    !extension.startCapital.applied;
  if (!eligible) return { game, changed: false };

  const target = capitalChoice(extension);
  const delta = Math.max(0, target - seasonStartCash);
  const cash = Number(game.cash || 0) + delta;
  const next = {
    ...game,
    cash,
    seasonStartCash: target,
    records: {
      ...(game.records || {}),
      mostCash: Math.max(Number(game.records?.mostCash) || 0, cash),
    },
    inbox: [
      `💼 v23 korrigerte startkapitalen til ${target}.`,
      ...(Array.isArray(game.inbox) ? game.inbox : []),
    ].slice(0, 80),
    municipalFunding: extension.funding,
    v23StartCapital: target,
  };
  extension.startCapital.applied = true;
  extension.startCapital.appliedAt = Date.now();
  startSync(next, extension, [
    "cash",
    "seasonStartCash",
    "records",
    "inbox",
    "municipalFunding",
    "v23StartCapital",
  ]);
  return { game: next, changed: true };
}

function scheduleReload() {
  if (reloadScheduled || document.readyState === "loading") return;
  reloadScheduled = true;
  window.setTimeout(() => window.location.reload(), 40);
}

function prepareCoreWrite(key, serialized) {
  const incoming = parseJson(serialized, null);
  if (!incoming || typeof incoming !== "object") return serialized;
  const extension = loadExtension();

  if (key !== CORE_KEY) {
    incoming.municipalFunding = extension.funding;
    incoming.v23StartCapital = capitalChoice(extension);
    return JSON.stringify(incoming);
  }

  const previous = parseJson(rawGetItem.call(localStorage, CORE_KEY), null);
  let game = incoming;
  let changed = false;

  const pendingSync = applyPendingSync(game, extension);
  game = pendingSync.game;
  changed ||= pendingSync.changed;

  if (!pendingSync.changed && incoming.municipalFunding) {
    extension.funding = normalizeFundingState(incoming.municipalFunding);
  }
  if (!pendingSync.changed && Number(incoming.v23StartCapital)) {
    extension.startCapital.choice = Number(incoming.v23StartCapital);
    extension.startCapital.applied = Number(incoming.seasonStartCash || 0) > 20000;
  }

  const capital = applyStartCapital(game, extension);
  game = capital.game;
  changed ||= capital.changed;

  if (previous && !pendingSync.changed) {
    const reimbursement = reimburseEligibleProject(previous, game, extension.funding);
    if (reimbursement.changed) {
      game = reimbursement.game;
      extension.funding = reimbursement.funding;
      game.municipalFunding = extension.funding;
      startSync(game, extension, ["cash", "inbox", "municipalFunding"]);
      changed = true;
    }
  }

  game.municipalFunding = extension.funding;
  game.v23StartCapital = capitalChoice(extension);
  saveExtension(extension);
  if (changed) scheduleReload();
  return JSON.stringify(game);
}

function patchStorage() {
  if (storagePatched) return;
  storagePatched = true;
  Storage.prototype.setItem = function patchedSetItem(key, value) {
    if (this === localStorage && CORE_KEYS.has(String(key))) {
      return rawSetItem.call(this, key, prepareCoreWrite(String(key), String(value)));
    }
    return rawSetItem.call(this, key, value);
  };
  Storage.prototype.removeItem = function patchedRemoveItem(key) {
    if (this === localStorage && key === CORE_KEY) {
      const extension = loadExtension();
      extension.startCapital.applied = false;
      extension.sync = null;
      saveExtension(extension);
    }
    return rawRemoveItem.call(this, key);
  };
}

function commitCoreUpdate(game, extension, fields, shouldReload = true) {
  const previous = rawGetItem.call(localStorage, CORE_KEY);
  if (previous) rawSetItem.call(localStorage, BACKUP_KEY, previous);
  game.municipalFunding = extension.funding;
  game.v23StartCapital = capitalChoice(extension);
  startSync(game, extension, [...new Set([...fields, "municipalFunding", "v23StartCapital"])]);
  saveExtension(extension);
  rawSetItem.call(localStorage, CORE_KEY, JSON.stringify(game));
  if (shouldReload) scheduleReload();
}

function bootstrapExistingSave() {
  const game = parseJson(rawGetItem.call(localStorage, CORE_KEY), null);
  if (!game) return;
  const extension = loadExtension();
  if (game.municipalFunding) {
    extension.funding = normalizeFundingState(game.municipalFunding);
  }
  if (Number(game.v23StartCapital)) {
    extension.startCapital.choice = Number(game.v23StartCapital);
    extension.startCapital.applied = Number(game.seasonStartCash || 0) > 20000;
  }
  const repaired = applyStartCapital(game, extension);
  if (repaired.changed) {
    saveExtension(extension);
    rawSetItem.call(localStorage, CORE_KEY, JSON.stringify(repaired.game));
  } else {
    saveExtension(extension);
  }
}

function currentGame() {
  return parseJson(rawGetItem.call(localStorage, CORE_KEY), null);
}

function currentLanguage() {
  const gameLanguage = currentGame()?.profile?.language;
  if (gameLanguage) return gameLanguage;
  const setupLanguage = [...document.querySelectorAll("select")].find((select) =>
    select.querySelector('option[value="en"]'),
  );
  return setupLanguage?.value || "nb";
}

function formatMoney(value) {
  const language = currentLanguage() === "en" ? "en-US" : "nb-NO";
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function text(key) {
  const english = currentLanguage() === "en";
  const dictionary = {
    municipalSupport: english ? "Municipal support" : "Kommunal støtte",
    intro: english
      ? "Apply for start-up support, earmarked facility grants or a low-interest municipal loan."
      : "Søk om etableringsstøtte, øremerkede anleggsmidler eller et rimelig kommunalt lån.",
    submit: english ? "Submit application" : "Send søknad",
    amount: english ? "Requested amount" : "Ønsket beløp",
    contribution: english ? "Club contribution" : "Klubbens egenandel",
    purpose: english ? "Purpose" : "Formål",
    details: english ? "Application purpose" : "Hva skal tiltaket løse?",
    applications: english ? "Applications" : "Søknader",
    credits: english ? "Earmarked commitments" : "Øremerkede tilsagn",
    none: english ? "No applications yet." : "Ingen søknader er sendt ennå.",
    processing: english ? "Processing" : "Til behandling",
    approved: english ? "Approved" : "Godkjent",
    partial: english ? "Partly approved" : "Delvis godkjent",
    rejected: english ? "Rejected" : "Avslått",
    documentation: english ? "More documentation required" : "Mer dokumentasjon kreves",
    sendDocs: english ? "Send documentation" : "Send dokumentasjon",
  };
  return dictionary[key] || key;
}

function showToast(message, type = "good") {
  let toast = document.getElementById("v23-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "v23-toast";
    document.body.append(toast);
  }
  toast.className = `v23-toast ${type}`;
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4200);
}

function capitalDescriptionEnglish(id) {
  return {
    lean: "Tight start with stronger demands on sales and cost control.",
    standard: "Recommended capital for normal club operations.",
    growth: "Faster establishment with higher board expectations.",
  }[id];
}

function renderStartCapital() {
  const setupForm = document.querySelector(".setup-form");
  if (!setupForm) return;
  const game = currentGame();
  const extension = loadExtension();
  if (!game || game.phase === "setup") {
    if (extension.startCapital.applied) {
      extension.startCapital.applied = false;
      extension.sync = null;
      saveExtension(extension);
    }
  }

  let section = document.getElementById("v23-start-capital");
  if (!section) {
    section = document.createElement("section");
    section.id = "v23-start-capital";
    section.className = "form-section v23-start-capital";
    setupForm.append(section);
  }
  const selected = capitalChoice(extension);
  const english = currentLanguage() === "en";
  const signature = `${english ? "en" : "nb"}:${selected}`;
  if (section.dataset.signature === signature) return;
  section.dataset.signature = signature;
  section.innerHTML = `
    <div class="section-heading-inline">
      <div>
        <p class="step-label">${english ? "Start capital" : "Startkapital"}</p>
        <h3>${english ? "Choose the club's financial starting point" : "Velg klubbens økonomiske utgangspunkt"}</h3>
      </div>
    </div>
    <div class="v23-capital-grid">
      ${START_CAPITAL_OPTIONS.map(
        (option) => `
          <button type="button" data-capital="${option.amount}" class="${selected === option.amount ? "active" : ""}">
            ${option.recommended ? `<span>${english ? "RECOMMENDED" : "ANBEFALT"}</span>` : ""}
            <strong>${formatMoney(option.amount)}</strong>
            <small>${english ? capitalDescriptionEnglish(option.id) : option.description}</small>
          </button>`,
      ).join("")}
    </div>
    <p class="v23-help">${english ? "Standard is 150,000. Existing first-season saves that started on 15,000 are repaired once." : "Standard er 150 000. Eksisterende førstesesonglagringer som startet med 15 000 repareres én gang."}</p>
  `;
  section.querySelectorAll("[data-capital]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = loadExtension();
      next.startCapital.choice = Number(button.dataset.capital);
      next.startCapital.applied = false;
      next.sync = null;
      saveExtension(next);
      section.dataset.signature = "";
      renderStartCapital();
    });
  });
}

function applicationStatusLabel(status) {
  return text(status === "pending" ? "processing" : status);
}

function restoreFinanceContent(nav) {
  const parent = nav?.parentElement;
  if (!parent) return;
  parent.querySelectorAll("[data-v23-hidden]").forEach((element) => {
    delete element.dataset.v23Hidden;
  });
  document.getElementById("v23-municipal-panel")?.remove();
  document.getElementById("v23-municipal-tab")?.classList.remove("active");
}

function applicationCard(application) {
  const program = FUNDING_PROGRAMS[application.programId];
  const status = applicationStatusLabel(application.status);
  const docs = application.status === "documentation";
  return `
    <article class="v23-application-card status-${application.status}">
      <div><strong>${program?.label || application.programId}</strong><span>${status}</span></div>
      <p>${formatMoney(application.approvedAmount || application.amount)}${application.status === "partial" ? ` / ${formatMoney(application.amount)}` : ""}</p>
      <small>${application.status === "pending" ? `${currentLanguage() === "en" ? "Response after" : "Svar etter"} ${application.processingWeeks} ${currentLanguage() === "en" ? "game weeks" : "spilluker"}` : `${currentLanguage() === "en" ? "Season" : "Sesong"} ${application.season}`}</small>
      ${docs ? `<button type="button" data-docs="${application.id}">${text("sendDocs")}</button>` : ""}
    </article>`;
}

function creditCard(credit) {
  const purpose = FACILITY_PURPOSES[credit.purposeId];
  return `
    <article class="v23-credit-card">
      <strong>${purpose?.label || credit.purposeId}</strong>
      <span>${formatMoney(credit.remaining)} ${currentLanguage() === "en" ? "remaining" : "gjenstår"}</span>
      <small>${Math.round(credit.coverageRate * 100)} % ${currentLanguage() === "en" ? "reimbursement on approved projects" : "refusjon på godkjente prosjekter"}</small>
    </article>`;
}

function bindFundingForm(panel, game) {
  const form = panel.querySelector("#v23-funding-form");
  const programSelect = form.elements.programId;
  const amountInput = form.elements.amount;
  const contributionInput = form.elements.ownContribution;
  const purposeField = form.querySelector(".v23-purpose-field");
  const contributionField = form.querySelector(".v23-contribution-field");
  const preview = form.querySelector(".v23-application-preview");

  const refresh = () => {
    const program = FUNDING_PROGRAMS[programSelect.value];
    const facility = program.id === "facility";
    purposeField.hidden = !facility;
    contributionField.hidden = !facility;
    amountInput.min = program.min;
    amountInput.max = program.max;
    if (Number(amountInput.value) < program.min || Number(amountInput.value) > program.max) {
      amountInput.value = program.id === "municipalLoan" ? "75000" : "50000";
    }
    const amount = Number(amountInput.value) || 0;
    const contribution = Number(contributionInput.value) || 0;
    const total = amount + contribution;
    const share = total > 0 ? amount / total : 0;
    preview.innerHTML = facility
      ? `<strong>${currentLanguage() === "en" ? "Municipal share" : "Kommunal andel"}: ${Math.round(share * 100)} %</strong><small>${currentLanguage() === "en" ? "Maximum 50%. Payment is locked to an approved project." : "Maks 50 %. Utbetalingen låses til et godkjent prosjekt."}</small>`
      : program.id === "municipalLoan"
        ? `<strong>6 % ${currentLanguage() === "en" ? "interest · 72 weeks" : "rente · 72 uker"}</strong><small>${currentLanguage() === "en" ? "Repayment is deducted every game week." : "Nedbetaling trekkes hver kampuke."}</small>`
        : `<strong>${currentLanguage() === "en" ? "One-time grant" : "Engangstilskudd"}</strong><small>${currentLanguage() === "en" ? "Primarily for small clubs with limited finances." : "Prioriteres til små klubber med begrenset økonomi."}</small>`;
  };
  programSelect.addEventListener("change", refresh);
  amountInput.addEventListener("input", refresh);
  contributionInput.addEventListener("input", refresh);
  refresh();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const latestGame = currentGame() || game;
    const latestExtension = loadExtension();
    const result = createMunicipalApplication(latestGame, latestExtension.funding, {
      programId: String(data.get("programId")),
      purposeId: String(data.get("purposeId") || "general"),
      amount: Number(data.get("amount")),
      ownContribution: Number(data.get("ownContribution")),
      purposeText: String(data.get("purposeText") || ""),
    });
    if (!result.ok) {
      showToast(result.error, "bad");
      return;
    }
    latestExtension.funding = result.funding;
    saveExtension(latestExtension);
    showToast(
      currentLanguage() === "en"
        ? `Application submitted. Response in ${result.application.processingWeeks} game weeks.`
        : `Søknaden er sendt. Svar kommer om ${result.application.processingWeeks} spilluker.`,
    );
    panel.dataset.signature = "";
    renderMunicipalPanel();
  });
}

function fundingSignature(game, funding) {
  return JSON.stringify({
    language: currentLanguage(),
    city: game?.profile?.city || "",
    updatedAt: funding.lastUpdatedAt,
    applications: funding.applications.map((application) => [
      application.id,
      application.status,
      application.approvedAmount,
      application.dueAtWeek,
      application.documentationRounds,
    ]),
    credits: funding.facilityCredits.map((credit) => [credit.id, credit.remaining]),
  });
}

function renderMunicipalPanel() {
  const nav = document.querySelector(".finance-subnav");
  if (!nav) return;
  let button = document.getElementById("v23-municipal-tab");
  if (!button) {
    button = document.createElement("button");
    button.id = "v23-municipal-tab";
    button.type = "button";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      municipalTabActive = true;
      renderMunicipalPanel();
    });
    nav.append(button);
  }
  const buttonMarkup = `<span aria-hidden="true">🏛️</span> ${text("municipalSupport")}`;
  if (button.innerHTML !== buttonMarkup) button.innerHTML = buttonMarkup;
  button.classList.toggle("active", municipalTabActive);

  if (!nav.dataset.v23Bound) {
    nav.dataset.v23Bound = "true";
    nav.addEventListener("click", (event) => {
      const target = event.target.closest("button");
      if (target && target.id !== "v23-municipal-tab") {
        municipalTabActive = false;
        restoreFinanceContent(nav);
      }
    });
  }

  if (!municipalTabActive) return;
  const parent = nav.parentElement;
  if (!parent) return;
  [...parent.children].forEach((child) => {
    if (child !== nav && child.id !== "v23-municipal-panel") {
      child.dataset.v23Hidden = "true";
    }
  });

  let panel = document.getElementById("v23-municipal-panel");
  if (!panel) {
    panel = document.createElement("section");
    panel.id = "v23-municipal-panel";
    parent.append(panel);
  }
  const game = currentGame();
  if (!game) return;
  const extension = loadExtension();
  const funding = normalizeFundingState(extension.funding);
  const signature = fundingSignature(game, funding);
  if (panel.dataset.signature === signature) return;
  panel.dataset.signature = signature;
  const pending = funding.applications.filter((application) =>
    ["pending", "documentation"].includes(application.status),
  );
  const history = funding.applications.filter(
    (application) => !["pending", "documentation"].includes(application.status),
  );
  const credits = funding.facilityCredits.filter((credit) => credit.remaining > 0);

  panel.innerHTML = `
    <div class="v23-municipal-hero">
      <div>
        <p class="eyebrow">Municipal Funding & Support</p>
        <h2>${text("municipalSupport")}</h2>
        <p>${text("intro")}</p>
      </div>
      <div class="v23-municipal-summary">
        <span>${game.profile?.city || "Local authority"}</span>
        <strong>${pending.length}</strong>
        <small>${text("processing").toLowerCase()}</small>
      </div>
    </div>
    <div class="v23-funding-grid">
      <form id="v23-funding-form" class="v23-funding-form">
        <div class="section-heading">
          <div><p class="eyebrow">${currentLanguage() === "en" ? "New application" : "Ny søknad"}</p><h3>${currentLanguage() === "en" ? "Choose support scheme" : "Velg støtteordning"}</h3></div>
        </div>
        <label>${currentLanguage() === "en" ? "Scheme" : "Ordning"}
          <select name="programId">
            ${Object.values(FUNDING_PROGRAMS).map((program) => `<option value="${program.id}">${program.label}</option>`).join("")}
          </select>
        </label>
        <label class="v23-purpose-field">${text("purpose")}
          <select name="purposeId">
            ${Object.values(FACILITY_PURPOSES).map((purpose) => `<option value="${purpose.id}">${purpose.label}</option>`).join("")}
          </select>
        </label>
        <div class="v23-form-row">
          <label>${text("amount")}<input name="amount" type="number" step="5000" value="50000" /></label>
          <label class="v23-contribution-field">${text("contribution")}<input name="ownContribution" type="number" step="5000" value="25000" /></label>
        </div>
        <label>${text("details")}<textarea name="purposeText" rows="3" maxlength="180" placeholder="${currentLanguage() === "en" ? "Describe the project and local benefit" : "Beskriv tiltaket og lokal nytte"}"></textarea></label>
        <div class="v23-application-preview"></div>
        <button class="v23-primary" type="submit">${text("submit")}</button>
      </form>
      <div class="v23-funding-side">
        <section>
          <div class="section-heading"><div><p class="eyebrow">Status</p><h3>${text("applications")}</h3></div></div>
          <div class="v23-application-list">
            ${[...pending, ...history].length ? [...pending, ...history].slice(0, 8).map(applicationCard).join("") : `<p class="v23-empty">${text("none")}</p>`}
          </div>
        </section>
        <section>
          <div class="section-heading"><div><p class="eyebrow">Facility escrow</p><h3>${text("credits")}</h3></div></div>
          ${credits.length ? credits.map(creditCard).join("") : `<p class="v23-empty">${currentLanguage() === "en" ? "No active facility commitments." : "Ingen aktive anleggstilsagn."}</p>`}
        </section>
      </div>
    </div>
  `;

  bindFundingForm(panel, game);
  panel.querySelectorAll("[data-docs]").forEach((docsButton) => {
    docsButton.addEventListener("click", () => {
      const latestGame = currentGame();
      const latest = loadExtension();
      const result = submitDocumentation(
        latestGame,
        latest.funding,
        docsButton.dataset.docs,
      );
      if (!result.ok) {
        showToast(result.error, "bad");
        return;
      }
      latest.funding = result.funding;
      saveExtension(latest);
      showToast(
        currentLanguage() === "en"
          ? "Documentation submitted. New response in two game weeks."
          : "Dokumentasjon er sendt. Nytt svar kommer om to spilluker.",
      );
      panel.dataset.signature = "";
      renderMunicipalPanel();
    });
  });
}

function processFundingTick() {
  const game = currentGame();
  if (!game || game.phase === "setup") return;
  const extension = loadExtension();
  const result = resolveDueApplication(game, extension.funding);
  if (!result.changed) return;
  extension.funding = result.funding;

  if (["approved", "partial"].includes(result.application.status)) {
    const applied = applyResolvedApplication(game, extension.funding, result.application);
    extension.funding = applied.funding;
    const fields = ["inbox"];
    if (applied.transaction?.type === "cash") fields.push("cash", "records");
    if (applied.transaction?.type === "loan") fields.push("cash", "loans", "debt");
    commitCoreUpdate(applied.game, extension, fields);
    return;
  }

  saveExtension(extension);
  if (municipalTabActive) {
    const panel = document.getElementById("v23-municipal-panel");
    if (panel) panel.dataset.signature = "";
    renderMunicipalPanel();
  }
  showToast(
    result.application.status === "documentation"
      ? text("documentation")
      : currentLanguage() === "en"
        ? "The municipality rejected the application."
        : "Kommunen avslo søknaden.",
    result.application.status === "rejected" ? "bad" : "warning",
  );
}

function translateDocument() {
  if (rendering) return;
  rendering = true;
  const language = currentLanguage();
  document.documentElement.lang = language === "en" ? "en" : "nb";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (!node.parentElement || node.parentElement.closest("script,style,#v23-municipal-panel,#v23-start-capital")) {
      continue;
    }
    const original = translatedNodes.get(node) || node.nodeValue;
    if (!translatedNodes.has(node)) translatedNodes.set(node, original);
    const trimmed = original.trim();
    const replacement = language === "en" ? translations[trimmed] : reverseTranslations[node.nodeValue.trim()];
    if (language === "en" && replacement) {
      node.nodeValue = original.replace(trimmed, replacement);
    } else if (language !== "en" && translatedNodes.has(node) && node.nodeValue !== original) {
      node.nodeValue = original;
    }
  }
  rendering = false;
}

function renderRuntimeUi() {
  renderStartCapital();
  renderMunicipalPanel();
  translateDocument();
}

patchStorage();
bootstrapExistingSave();

document.addEventListener("DOMContentLoaded", () => {
  renderRuntimeUi();
  const observer = new MutationObserver(() => {
    if (rendering) return;
    window.requestAnimationFrame(renderRuntimeUi);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setInterval(processFundingTick, 1400);
  window.setInterval(renderRuntimeUi, 2200);
});
