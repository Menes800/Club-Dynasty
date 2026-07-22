export const ROOKIE_ECONOMY = Object.freeze({
  startingCash: 15000,
  payrollTarget: 3200,
  foundingSponsorWeeklyPay: 1300,
  repairCashFloor: 5000,
  repairPerPlayedGame: 750,
  repairGrantCap: 9000,
});

const money = (value) => Math.round(Number(value) || 0);

export function capMatchdayRevenue(lines = {}, maximum = Infinity) {
  const revenue = {
    tickets: Math.max(0, money(lines.tickets)),
    vip: Math.max(0, money(lines.vip)),
    food: Math.max(0, money(lines.food)),
    merch: Math.max(0, money(lines.merch)),
  };
  const total = Object.values(revenue).reduce((sum, value) => sum + value, 0);
  const cap = Math.max(0, Number(maximum) || 0);
  const factor = total > cap ? cap / total : 1;
  return {
    tickets: Math.round(revenue.tickets * factor),
    vip: Math.round(revenue.vip * factor),
    food: Math.round(revenue.food * factor),
    merch: Math.round(revenue.merch * factor),
  };
}

export function settleWeeklyEconomy(lines = {}) {
  const revenue = {
    tickets: money(lines.tickets),
    vip: money(lines.vip),
    food: money(lines.food),
    merch: money(lines.merch),
    sponsor: money(lines.sponsor),
    sponsorBonus: money(lines.sponsorBonus),
    media: money(lines.media),
  };
  const costs = {
    salaries: Math.max(0, money(lines.salaries)),
    staff: Math.max(0, money(lines.staff)),
    maintenance: Math.max(0, money(lines.maintenance)),
    matchOps: Math.max(0, money(lines.matchOps)),
    debtService: Math.max(0, money(lines.debtService)),
  };
  const income = Object.values(revenue).reduce((sum, value) => sum + value, 0);
  const expensesBeforeDebt =
    costs.salaries + costs.staff + costs.maintenance + costs.matchOps;
  const expenses = expensesBeforeDebt + costs.debtService;
  const operatingProfit = income - expensesBeforeDebt;
  return {
    revenue,
    costs,
    income,
    expensesBeforeDebt,
    expenses,
    operatingProfit,
    profit: income - expenses,
  };
}

export function rebalanceRookiePayroll(
  roster,
  target = ROOKIE_ECONOMY.payrollTarget,
) {
  if (!Array.isArray(roster) || roster.length === 0) return roster ?? [];
  const current = roster.reduce(
    (sum, player) => sum + Math.max(0, Number(player?.salary) || 0),
    0,
  );
  if (current <= 0) return roster;
  const minimumTotal = roster.length * 110;
  const safeTarget = Math.max(minimumTotal, Math.round(Number(target) || 0));
  const factor = safeTarget / current;
  const scaled = roster.map((player) => ({
    ...player,
    salary: Math.max(110, Math.round((Number(player.salary) || 0) * factor)),
  }));
  let difference =
    safeTarget - scaled.reduce((sum, player) => sum + player.salary, 0);
  if (difference !== 0) {
    const direction = Math.sign(difference);
    for (
      let index = 0;
      difference !== 0 && index < scaled.length * 20;
      index += 1
    ) {
      const player = scaled[index % scaled.length];
      if (direction < 0 && player.salary <= 110) continue;
      player.salary += direction;
      difference -= direction;
    }
  }
  return scaled;
}

export function calculateV221RepairGrant(game) {
  if (
    Number(game?.version ?? 0) >= 22.1 ||
    Number(game?.season ?? 1) !== 1 ||
    Number(game?.leagueIndex ?? 0) !== 0
  )
    return 0;
  const gamesPlayed = Math.max(
    0,
    Math.round(Number(game?.wins ?? 0) + Number(game?.losses ?? 0)),
  );
  if (gamesPlayed <= 0) return 0;
  const compensation = Math.min(
    ROOKIE_ECONOMY.repairGrantCap,
    gamesPlayed * ROOKIE_ECONOMY.repairPerPlayedGame,
  );
  const cashFloorTopUp = Math.max(
    0,
    ROOKIE_ECONOMY.repairCashFloor - (Number(game?.cash) || 0),
  );
  return Math.round(Math.max(compensation, cashFloorTopUp));
}

export function simulateCashPath(startingCash, weeklyProfits) {
  let cash = money(startingCash);
  return (weeklyProfits ?? []).map((profit, index) => {
    cash += money(profit);
    return { week: index + 1, cash };
  });
}
