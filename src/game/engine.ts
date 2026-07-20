import { FACILITIES, FIRST_NAMES, LAST_NAMES, POSITIONS, TEAM_NAMES, makeSponsorOffers } from './data'
import type {
  ActiveSponsor,
  BoardGoal,
  GameState,
  MatchReport,
  Player,
  ScheduledMatch,
  StandingRow,
} from './types'

const USER_TEAM_ID = 'user'

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

function uniquePlayerName(index: number) {
  return `${FIRST_NAMES[index % FIRST_NAMES.length]} ${LAST_NAMES[(index * 7 + randomBetween(0, LAST_NAMES.length - 1)) % LAST_NAMES.length]}`
}

function playerValue(rating: number, potential: number, age: number) {
  const ageFactor = age <= 23 ? 1.25 : age >= 31 ? 0.72 : 1
  return Math.round((rating * rating * 2_900 + potential * 22_000) * ageFactor / 10_000) * 10_000
}

export function makePlayer(index: number, clubId: string | null, boost = 0): Player {
  const age = randomBetween(18, 33)
  const rating = clamp(randomBetween(58, 78) + boost, 50, 92)
  const potential = clamp(rating + randomBetween(2, Math.max(3, 13 - Math.floor((age - 18) / 2))), rating, 95)
  return {
    id: `p-${Date.now().toString(36)}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    name: uniquePlayerName(index + randomBetween(0, 30)),
    age,
    position: POSITIONS[index % POSITIONS.length],
    rating,
    potential,
    morale: randomBetween(64, 84),
    wage: Math.round((35_000 + rating * 2_300 + Math.max(0, potential - rating) * 2_800) / 5_000) * 5_000,
    contractYears: clubId ? randomBetween(1, 3) : 0,
    value: playerValue(rating, potential, age),
    clubId,
    injuredWeeks: 0,
  }
}

function createPlayers() {
  const players: Player[] = []
  for (let i = 0; i < 24; i++) players.push(makePlayer(i, USER_TEAM_ID, i < 10 ? 3 : 0))
  for (let i = 0; i < 28; i++) players.push(makePlayer(100 + i, null, i < 5 ? 4 : 0))
  return players
}

function createStandings(clubName: string): StandingRow[] {
  return TEAM_NAMES.map((name, index) => ({
    teamId: index === 0 ? USER_TEAM_ID : `ai-${index}`,
    name: index === 0 ? clubName : name,
    played: 0,
    won: 0,
    lost: 0,
    scored: 0,
    conceded: 0,
    points: 0,
  }))
}

function createSchedule(teamIds: string[]): ScheduledMatch[] {
  const rotating = [...teamIds]
  const rounds: ScheduledMatch[] = []
  const total = rotating.length
  for (let round = 0; round < total - 1; round++) {
    for (let i = 0; i < total / 2; i++) {
      const homeId = rotating[i]
      const awayId = rotating[total - 1 - i]
      rounds.push({
        id: `r${round + 1}-${homeId}-${awayId}`,
        week: round + 1,
        homeId: round % 2 === 0 ? homeId : awayId,
        awayId: round % 2 === 0 ? awayId : homeId,
        played: false,
      })
    }
    rotating.splice(1, 0, rotating.pop()!)
  }
  const reverse = rounds.map((match) => ({
    ...match,
    id: `r${match.week + total - 1}-${match.awayId}-${match.homeId}`,
    week: match.week + total - 1,
    homeId: match.awayId,
    awayId: match.homeId,
    played: false,
    homeScore: undefined,
    awayScore: undefined,
  }))
  return [...rounds, ...reverse]
}

function makeBoardGoals(fans: number): BoardGoal[] {
  return [
    { id: 'wins', text: 'Vinn minst 8 seriekamper', target: 8, current: 0, reward: 450_000, trustReward: 8, complete: false },
    { id: 'fans', text: `Nå ${Math.round((fans * 1.3 + 500) / 100) * 100} fans`, target: Math.round((fans * 1.3 + 500) / 100) * 100, current: fans, reward: 300_000, trustReward: 6, complete: false },
    { id: 'playoffs', text: 'Kvalifiser til sluttspillet', target: 1, current: 0, reward: 600_000, trustReward: 10, complete: false },
  ]
}

export function createGame(name: string, city: string, primary: string, secondary: string): GameState {
  const standings = createStandings(name)
  const teamIds = standings.map((team) => team.teamId)
  const players = createPlayers()
  const lineup = players
    .filter((player) => player.clubId === USER_TEAM_ID)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10)
    .map((player) => player.id)
  return {
    version: 1,
    club: { name, city, primary, secondary },
    season: 1,
    week: 1,
    phase: 'regular',
    cash: 4_500_000,
    fans: 1_250,
    reputation: 18,
    boardTrust: 62,
    trophies: 0,
    salaryCap: 4_200_000,
    teamIds,
    players,
    lineup,
    captainId: lineup[0] ?? null,
    standings,
    schedule: createSchedule(teamIds),
    playoffRound: null,
    playoffOpponentId: null,
    sponsorOffers: makeSponsorOffers(1, 18, 1_250),
    activeSponsors: [],
    facilities: FACILITIES.map((facility) => ({ ...facility })),
    boardGoals: makeBoardGoals(1_250),
    reports: [],
    history: [],
    settings: { sound: true, autoRenewSponsors: false, compactMode: false },
    notifications: ['Velkommen til Club Dynasty. Sett laget og gjør klubben klar for sesongen.'],
  }
}

export function userRoster(state: GameState) {
  return state.players.filter((player) => player.clubId === USER_TEAM_ID)
}

export function freeAgents(state: GameState) {
  return state.players.filter((player) => player.clubId === null)
}

export function payroll(state: GameState) {
  return userRoster(state).reduce((sum, player) => sum + player.wage, 0)
}

export function lineupStrength(state: GameState) {
  const selected = state.lineup
    .map((id) => state.players.find((player) => player.id === id))
    .filter((player): player is Player => Boolean(player))
  if (!selected.length) return 50
  const base = selected.reduce((sum, player) => sum + player.rating + player.morale / 22 - player.injuredWeeks * 4, 0) / selected.length
  const training = state.facilities.find((facility) => facility.id === 'training')?.level ?? 0
  const captainBonus = state.captainId && state.lineup.includes(state.captainId) ? 1.5 : 0
  return base + training + captainBonus
}

function aiStrength(teamId: string, season: number) {
  const seed = Number(teamId.replace(/\D/g, '')) || 3
  return 65 + seed * 1.8 + season * 0.8 + Math.sin(seed * 4.2 + season) * 4
}

function scoreFromStrength(home: number, away: number) {
  const homeBase = 20 + home / 3.4 + randomBetween(-5, 7)
  const awayBase = 18 + away / 3.5 + randomBetween(-5, 7)
  let homeScore = Math.max(8, Math.round(homeBase))
  let awayScore = Math.max(8, Math.round(awayBase))
  if (homeScore === awayScore) {
    if (Math.random() > 0.5) homeScore += 1
    else awayScore += 1
  }
  return [homeScore, awayScore] as const
}

function updateStanding(rows: StandingRow[], homeId: string, awayId: string, homeScore: number, awayScore: number) {
  const home = rows.find((row) => row.teamId === homeId)!
  const away = rows.find((row) => row.teamId === awayId)!
  home.played += 1
  away.played += 1
  home.scored += homeScore
  home.conceded += awayScore
  away.scored += awayScore
  away.conceded += homeScore
  if (homeScore > awayScore) {
    home.won += 1
    away.lost += 1
    home.points += 2
  } else {
    away.won += 1
    home.lost += 1
    away.points += 2
  }
}

export function sortedStandings(state: GameState) {
  return [...state.standings].sort((a, b) => b.points - a.points || (b.scored - b.conceded) - (a.scored - a.conceded) || b.scored - a.scored)
}

function sponsorWeeklyIncome(state: GameState) {
  const commercial = state.facilities.find((facility) => facility.id === 'commercial')?.level ?? 0
  return state.activeSponsors.reduce((sum, sponsor) => sum + sponsor.weeklyPay, 0) * (1 + commercial * 0.08)
}

function updateBoardGoals(state: GameState) {
  const wins = state.standings.find((row) => row.teamId === USER_TEAM_ID)?.won ?? 0
  const rank = sortedStandings(state).findIndex((row) => row.teamId === USER_TEAM_ID) + 1
  state.boardGoals = state.boardGoals.map((goal) => {
    let current = goal.current
    if (goal.id === 'wins') current = wins
    if (goal.id === 'fans') current = state.fans
    if (goal.id === 'playoffs') current = rank <= 4 && state.week > 14 ? 1 : 0
    if (!goal.complete && current >= goal.target) {
      state.cash += goal.reward
      state.boardTrust = clamp(state.boardTrust + goal.trustReward, 0, 100)
      state.notifications.unshift(`Styremål fullført: ${goal.text}.`)
      return { ...goal, current, complete: true }
    }
    return { ...goal, current }
  })
}

function processPlayerWeek(state: GameState, won: boolean) {
  state.players = state.players.map((player) => {
    if (player.clubId !== USER_TEAM_ID) return player
    const injuryRoll = Math.random()
    const injuredWeeks = player.injuredWeeks > 0 ? player.injuredWeeks - 1 : injuryRoll < 0.012 ? randomBetween(1, 3) : 0
    const morale = clamp(player.morale + (won ? randomBetween(0, 3) : randomBetween(-3, 1)), 35, 100)
    return { ...player, morale, injuredWeeks }
  })
}

export function playNextWeek(input: GameState): GameState {
  if (input.phase !== 'regular') return input
  const state = structuredClone(input)
  const matches = state.schedule.filter((match) => match.week === state.week && !match.played)
  const userStrength = lineupStrength(state)
  let userWon = false
  for (const match of matches) {
    const homeStrength = match.homeId === USER_TEAM_ID ? userStrength : aiStrength(match.homeId, state.season)
    const awayStrength = match.awayId === USER_TEAM_ID ? userStrength : aiStrength(match.awayId, state.season)
    const [homeScore, awayScore] = scoreFromStrength(homeStrength + 2.2, awayStrength)
    match.played = true
    match.homeScore = homeScore
    match.awayScore = awayScore
    updateStanding(state.standings, match.homeId, match.awayId, homeScore, awayScore)
    if (match.homeId === USER_TEAM_ID || match.awayId === USER_TEAM_ID) {
      const userScore = match.homeId === USER_TEAM_ID ? homeScore : awayScore
      const opponentScore = match.homeId === USER_TEAM_ID ? awayScore : homeScore
      userWon = userScore > opponentScore
      const opponentId = match.homeId === USER_TEAM_ID ? match.awayId : match.homeId
      const opponent = state.standings.find((row) => row.teamId === opponentId)?.name ?? 'motstander'
      const arenaLevel = state.facilities.find((facility) => facility.id === 'arena')?.level ?? 1
      const gate = Math.round((90_000 + state.fans * 58) * (1 + arenaLevel * 0.12))
      const winBonus = userWon ? 85_000 : 20_000
      const sponsorIncome = sponsorWeeklyIncome(state)
      state.cash += gate + winBonus + sponsorIncome - payroll(state) / 14
      const fanChange = userWon ? randomBetween(80, 180) + Math.round(state.reputation * 2.5) : -randomBetween(20, 70)
      state.fans = Math.max(250, state.fans + fanChange)
      state.reputation = clamp(state.reputation + (userWon ? 1.4 : -0.4), 0, 100)
      state.boardTrust = clamp(state.boardTrust + (userWon ? 0.8 : -0.7), 0, 100)
      const report: MatchReport = {
        season: state.season,
        week: state.week,
        competition: 'Liga',
        opponent,
        score: `${userScore}–${opponentScore}`,
        result: userWon ? 'W' : 'L',
        note: userWon ? `Seier ga ${fanChange} nye fans.` : `Tap kostet ${Math.abs(fanChange)} fans.`,
      }
      state.reports.unshift(report)
      state.notifications.unshift(`${userWon ? 'Seier' : 'Tap'} mot ${opponent}: ${report.score}.`)
    }
  }
  processPlayerWeek(state, userWon)
  state.week += 1
  updateBoardGoals(state)
  if (state.week > 14) enterPlayoffsOrOffseason(state)
  return state
}

function enterPlayoffsOrOffseason(state: GameState) {
  const table = sortedStandings(state)
  const rank = table.findIndex((row) => row.teamId === USER_TEAM_ID) + 1
  if (rank <= 4) {
    const opponentRank = rank === 1 ? 4 : rank === 2 ? 3 : rank === 3 ? 2 : 1
    state.phase = 'playoffs'
    state.playoffRound = 'semifinal'
    state.playoffOpponentId = table[opponentRank - 1].teamId
    state.notifications.unshift(`Sluttspillet er klart. Du møter ${table[opponentRank - 1].name} i semifinalen. Autospill er stoppet.`)
    const goal = state.boardGoals.find((item) => item.id === 'playoffs')
    if (goal && !goal.complete) {
      goal.current = 1
      goal.complete = true
      state.cash += goal.reward
      state.boardTrust = clamp(state.boardTrust + goal.trustReward, 0, 100)
    }
  } else {
    state.phase = 'offseason'
    state.notifications.unshift(`Sesongen endte på ${rank}. Ingen sluttspill denne gangen.`)
    finalizeSeason(state, rank, 'Ikke kvalifisert')
  }
}

export function playPlayoff(input: GameState): GameState {
  if (input.phase !== 'playoffs' || !input.playoffOpponentId || !input.playoffRound) return input
  const playoffOpponentId = input.playoffOpponentId
  const state = structuredClone(input)
  const opponent = state.standings.find((row) => row.teamId === playoffOpponentId)?.name ?? 'motstander'
  const [userScore, opponentScore] = scoreFromStrength(lineupStrength(state) + 1.5, aiStrength(playoffOpponentId, state.season))
  const won = userScore > opponentScore
  state.reports.unshift({
    season: state.season,
    week: state.week,
    competition: state.playoffRound === 'semifinal' ? 'Semifinale' : 'Finale',
    opponent,
    score: `${userScore}–${opponentScore}`,
    result: won ? 'W' : 'L',
    note: won ? 'Klubben leverte under press.' : 'Sesongen er over.',
  })
  if (won && state.playoffRound === 'semifinal') {
    const candidates = sortedStandings(state).filter((row) => row.teamId !== USER_TEAM_ID && row.teamId !== state.playoffOpponentId).slice(0, 2)
    state.playoffRound = 'final'
    state.playoffOpponentId = pick(candidates).teamId
    state.cash += 450_000
    state.fans += 650
    state.reputation = clamp(state.reputation + 5, 0, 100)
    state.notifications.unshift(`Finale! Semifinalen mot ${opponent} endte ${userScore}–${opponentScore}.`)
    return state
  }
  const rank = sortedStandings(state).findIndex((row) => row.teamId === USER_TEAM_ID) + 1
  if (won) {
    state.trophies += 1
    state.cash += 1_800_000
    state.fans += 1_800
    state.reputation = clamp(state.reputation + 12, 0, 100)
    state.boardTrust = clamp(state.boardTrust + 15, 0, 100)
    state.notifications.unshift(`MESTERE! ${state.club.name} vant finalen ${userScore}–${opponentScore}.`)
    finalizeSeason(state, rank, 'Mester')
  } else {
    state.cash += state.playoffRound === 'final' ? 700_000 : 250_000
    state.fans += state.playoffRound === 'final' ? 700 : 250
    state.notifications.unshift(`${state.playoffRound === 'final' ? 'Finaletap' : 'Semifinaletap'} mot ${opponent}: ${userScore}–${opponentScore}.`)
    finalizeSeason(state, rank, state.playoffRound === 'final' ? 'Finalist' : 'Semifinale')
  }
  state.phase = 'offseason'
  state.playoffRound = null
  state.playoffOpponentId = null
  return state
}

function finalizeSeason(state: GameState, finish: number, playoff: string) {
  state.history.unshift({
    season: state.season,
    finish,
    playoff,
    fans: state.fans,
    cash: state.cash,
    trophies: state.trophies,
  })
  const sponsorPenalty = state.activeSponsors.reduce((penalty, sponsor) => {
    if (finish > sponsor.minFinish || state.fans < sponsor.fanTarget) return penalty + 120_000
    return penalty
  }, 0)
  if (sponsorPenalty > 0) {
    state.cash -= sponsorPenalty
    state.notifications.unshift(`Sponsorbonuser uteble. Klubben mistet ${sponsorPenalty.toLocaleString('nb-NO')} kr.`)
  }
  state.sponsorOffers = makeSponsorOffers(state.season + 1, state.reputation, state.fans)
}

export function startNextSeason(input: GameState): GameState {
  if (input.phase !== 'offseason') return input
  const state = structuredClone(input)
  state.season += 1
  state.week = 1
  state.phase = 'regular'
  state.playoffRound = null
  state.playoffOpponentId = null
  state.activeSponsors = state.activeSponsors
    .map((sponsor) => ({ ...sponsor, seasonsLeft: sponsor.seasonsLeft - 1 }))
    .filter((sponsor) => sponsor.seasonsLeft > 0)
  state.players = state.players
    .map((player) => {
      if (player.clubId !== USER_TEAM_ID) return player
      const contractYears = player.contractYears - 1
      const development = player.age <= 25 && Math.random() < 0.55 ? 1 : player.age >= 31 && Math.random() < 0.35 ? -1 : 0
      return {
        ...player,
        age: player.age + 1,
        contractYears,
        rating: clamp(player.rating + development, 45, player.potential),
        morale: clamp(player.morale + randomBetween(-4, 5), 45, 92),
        injuredWeeks: 0,
      }
    })
    .map((player) => player.clubId === USER_TEAM_ID && player.contractYears <= 0 ? { ...player, clubId: null, contractYears: 0 } : player)
  if (state.settings.autoRenewSponsors) {
    for (const offer of state.sponsorOffers) {
      if (!state.activeSponsors.some((sponsor) => sponsor.category === offer.category)) {
        state.activeSponsors.push({ ...offer, seasonsLeft: offer.seasons })
        state.cash += offer.signingBonus
      }
    }
  }
  state.players.push(makePlayer(500 + state.season, USER_TEAM_ID, (state.facilities.find((facility) => facility.id === 'academy')?.level ?? 0) * 2))
  state.standings = createStandings(state.club.name)
  state.teamIds = state.standings.map((row) => row.teamId)
  state.schedule = createSchedule(state.teamIds)
  state.boardGoals = makeBoardGoals(state.fans)
  state.notifications.unshift(`Sesong ${state.season} er i gang. En ung spiller er hentet opp fra draft/akademiet.`)
  return autoPickLineup(state)
}

export function autoPickLineup(input: GameState): GameState {
  const state = structuredClone(input)
  const healthy = userRoster(state)
    .filter((player) => player.injuredWeeks === 0)
    .sort((a, b) => b.rating + b.morale / 30 - (a.rating + a.morale / 30))
  state.lineup = healthy.slice(0, 10).map((player) => player.id)
  if (!state.captainId || !state.lineup.includes(state.captainId)) state.captainId = state.lineup[0] ?? null
  return state
}

export function toggleLineupPlayer(input: GameState, playerId: string): GameState {
  const state = structuredClone(input)
  if (state.lineup.includes(playerId)) {
    state.lineup = state.lineup.filter((id) => id !== playerId)
    if (state.captainId === playerId) state.captainId = state.lineup[0] ?? null
  } else if (state.lineup.length < 10) {
    const player = state.players.find((item) => item.id === playerId)
    if (player?.clubId === USER_TEAM_ID && player.injuredWeeks === 0) state.lineup.push(playerId)
  }
  return state
}

export function signFreeAgent(input: GameState, playerId: string): GameState {
  const state = structuredClone(input)
  const player = state.players.find((item) => item.id === playerId && item.clubId === null)
  if (!player) return input
  const signingCost = Math.round(player.value * 0.16)
  if (state.cash < signingCost || payroll(state) + player.wage > state.salaryCap || userRoster(state).length >= 30) return input
  player.clubId = USER_TEAM_ID
  player.contractYears = 2
  state.cash -= signingCost
  state.notifications.unshift(`${player.name} signerte en toårskontrakt.`)
  return state
}

export function releasePlayer(input: GameState, playerId: string): GameState {
  const state = structuredClone(input)
  const player = state.players.find((item) => item.id === playerId && item.clubId === USER_TEAM_ID)
  if (!player || userRoster(state).length <= 16) return input
  const compensation = Math.round(player.value * 0.08)
  player.clubId = null
  player.contractYears = 0
  state.cash += compensation
  state.lineup = state.lineup.filter((id) => id !== playerId)
  if (state.captainId === playerId) state.captainId = state.lineup[0] ?? null
  state.notifications.unshift(`${player.name} ble frigitt. Klubben mottok ${compensation.toLocaleString('nb-NO')} kr.`)
  return state
}

export function extendPlayer(input: GameState, playerId: string): GameState {
  const state = structuredClone(input)
  const player = state.players.find((item) => item.id === playerId && item.clubId === USER_TEAM_ID)
  if (!player) return input
  const bonus = Math.round(player.wage * 2.5)
  const raise = Math.round(player.wage * 1.1 / 5_000) * 5_000
  if (state.cash < bonus || payroll(state) - player.wage + raise > state.salaryCap) return input
  state.cash -= bonus
  player.wage = raise
  player.contractYears = Math.max(player.contractYears, 3)
  state.notifications.unshift(`${player.name} forlenget til tre år.`)
  return state
}

export function acceptSponsor(input: GameState, sponsorId: string): GameState {
  const state = structuredClone(input)
  const offer = state.sponsorOffers.find((item) => item.id === sponsorId)
  if (!offer) return input
  const existing = state.activeSponsors.find((sponsor) => sponsor.category === offer.category)
  if (existing) state.activeSponsors = state.activeSponsors.filter((sponsor) => sponsor.category !== offer.category)
  const active: ActiveSponsor = { ...offer, seasonsLeft: offer.seasons }
  state.activeSponsors.push(active)
  state.cash += offer.signingBonus
  state.sponsorOffers = state.sponsorOffers.filter((item) => item.id !== sponsorId)
  state.notifications.unshift(`${offer.name} ble ny ${offer.category.toLowerCase()}-sponsor.`)
  return state
}

export function upgradeFacility(input: GameState, facilityId: string): GameState {
  const state = structuredClone(input)
  const facility = state.facilities.find((item) => item.id === facilityId)
  if (!facility || facility.level >= facility.maxLevel) return input
  const cost = Math.round(facility.baseCost * Math.pow(1.65, facility.level))
  if (state.cash < cost) return input
  state.cash -= cost
  facility.level += 1
  state.notifications.unshift(`${facility.name} er oppgradert til nivå ${facility.level}.`)
  return state
}

export function setCaptain(input: GameState, playerId: string): GameState {
  if (!input.lineup.includes(playerId)) return input
  const state = structuredClone(input)
  state.captainId = playerId
  return state
}

export function nextOpponent(state: GameState) {
  if (state.phase === 'playoffs' && state.playoffOpponentId) return state.standings.find((row) => row.teamId === state.playoffOpponentId)?.name ?? 'Motstander'
  const match = state.schedule.find((item) => item.week === state.week && (item.homeId === USER_TEAM_ID || item.awayId === USER_TEAM_ID))
  if (!match) return 'Ingen kamp'
  const opponentId = match.homeId === USER_TEAM_ID ? match.awayId : match.homeId
  return state.standings.find((row) => row.teamId === opponentId)?.name ?? 'Motstander'
}
