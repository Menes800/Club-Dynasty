export type Phase = 'regular' | 'playoffs' | 'offseason'
export type Position = 'Keeper' | 'Left Back' | 'Center Back' | 'Right Back' | 'Left Wing' | 'Right Wing' | 'Pivot' | 'Playmaker' | 'Defender' | 'Utility'

export interface ClubIdentity {
  name: string
  city: string
  primary: string
  secondary: string
}

export interface Player {
  id: string
  name: string
  age: number
  position: Position
  rating: number
  potential: number
  morale: number
  wage: number
  contractYears: number
  value: number
  clubId: string | null
  injuredWeeks: number
}

export interface StandingRow {
  teamId: string
  name: string
  played: number
  won: number
  lost: number
  scored: number
  conceded: number
  points: number
}

export interface ScheduledMatch {
  id: string
  week: number
  homeId: string
  awayId: string
  played: boolean
  homeScore?: number
  awayScore?: number
}

export interface SponsorOffer {
  id: string
  name: string
  weeklyPay: number
  signingBonus: number
  minFinish: number
  fanTarget: number
  seasons: number
  category: 'Main' | 'Kit' | 'Arena'
}

export interface ActiveSponsor extends SponsorOffer {
  seasonsLeft: number
}

export interface FacilityProject {
  id: string
  name: string
  description: string
  level: number
  maxLevel: number
  baseCost: number
  effect: string
}

export interface BoardGoal {
  id: string
  text: string
  target: number
  current: number
  reward: number
  trustReward: number
  complete: boolean
}

export interface MatchReport {
  season: number
  week: number
  competition: string
  opponent: string
  score: string
  result: 'W' | 'L'
  note: string
}

export interface SeasonSummary {
  season: number
  finish: number
  playoff: string
  fans: number
  cash: number
  trophies: number
}

export interface Settings {
  sound: boolean
  autoRenewSponsors: boolean
  compactMode: boolean
}

export interface GameState {
  version: number
  club: ClubIdentity
  season: number
  week: number
  phase: Phase
  cash: number
  fans: number
  reputation: number
  boardTrust: number
  trophies: number
  salaryCap: number
  teamIds: string[]
  players: Player[]
  lineup: string[]
  captainId: string | null
  standings: StandingRow[]
  schedule: ScheduledMatch[]
  playoffRound: 'semifinal' | 'final' | null
  playoffOpponentId: string | null
  sponsorOffers: SponsorOffer[]
  activeSponsors: ActiveSponsor[]
  facilities: FacilityProject[]
  boardGoals: BoardGoal[]
  reports: MatchReport[]
  history: SeasonSummary[]
  settings: Settings
  notifications: string[]
}
