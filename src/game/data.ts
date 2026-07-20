import type { FacilityProject, Position, SponsorOffer } from './types'

export const TEAM_NAMES = [
  'Silver Bay Bears',
  'Northgate Royals',
  'Metro Comets',
  'Harbor Wolves',
  'Crown City Titans',
  'Redwood Storm',
  'Ironvale United',
  'Coastal Falcons',
]

export const POSITIONS: Position[] = [
  'Keeper',
  'Left Back',
  'Center Back',
  'Right Back',
  'Left Wing',
  'Right Wing',
  'Pivot',
  'Playmaker',
  'Defender',
  'Utility',
]

export const FIRST_NAMES = [
  'Noah', 'Elias', 'Liam', 'Oliver', 'Milo', 'Theo', 'Lucas', 'Aksel', 'Adrian', 'Felix',
  'Leo', 'Sander', 'Marius', 'Emil', 'Jonas', 'Marcus', 'Isak', 'Henrik', 'William', 'Oskar',
]

export const LAST_NAMES = [
  'Berg', 'Hansen', 'Lund', 'Moen', 'Solberg', 'Aas', 'Strand', 'Dahl', 'Nilsen', 'Bakke',
  'Holm', 'Lien', 'Vik', 'Foss', 'Hauge', 'Røed', 'Kvam', 'Sæther', 'Storm', 'Nordby',
]

export const SPONSOR_NAMES = [
  'Vertex Energy', 'Northline', 'Apex Mobile', 'Civic Bank', 'Nova Foods', 'Kinetic Wear',
  'Orbit Telecom', 'BluePeak', 'Atlas Motors', 'BrightBet', 'Pulse Nutrition', 'UrbanGrid',
]

export const FACILITIES: FacilityProject[] = [
  {
    id: 'arena',
    name: 'Arena',
    description: 'Flere seter og høyere kampinntekter.',
    level: 1,
    maxLevel: 6,
    baseCost: 850_000,
    effect: '+12 % billettinntekt per nivå',
  },
  {
    id: 'training',
    name: 'Treningssenter',
    description: 'Bedre utvikling og mer stabile prestasjoner.',
    level: 1,
    maxLevel: 6,
    baseCost: 720_000,
    effect: '+1 lagstyrke per nivå',
  },
  {
    id: 'academy',
    name: 'Akademi',
    description: 'Gir bedre draftspillere og lavere rekrutteringskostnad.',
    level: 0,
    maxLevel: 5,
    baseCost: 620_000,
    effect: '+2 potensial på drafted spiller per nivå',
  },
  {
    id: 'commercial',
    name: 'Kommersiell avdeling',
    description: 'Bedre sponsoravtaler og organisk fanvekst.',
    level: 0,
    maxLevel: 5,
    baseCost: 540_000,
    effect: '+8 % sponsorinntekter per nivå',
  },
]

export function makeSponsorOffers(season: number, reputation: number, fans: number): SponsorOffer[] {
  const base = 70_000 + season * 7_500 + reputation * 1_200 + Math.floor(fans / 80)
  const categories: SponsorOffer['category'][] = ['Main', 'Kit', 'Arena']
  return categories.map((category, index) => {
    const difficulty = index + 1
    return {
      id: `${season}-${category}-${Math.random().toString(36).slice(2, 8)}`,
      name: SPONSOR_NAMES[(season * 3 + index * 2 + Math.floor(Math.random() * SPONSOR_NAMES.length)) % SPONSOR_NAMES.length],
      weeklyPay: Math.round((base * (1 + index * 0.28)) / 1_000) * 1_000,
      signingBonus: Math.round((base * 3.2 * (1 + index * 0.2)) / 10_000) * 10_000,
      minFinish: Math.max(1, 7 - reputation / 20 - difficulty),
      fanTarget: Math.round((fans * (1.08 + index * 0.08) + 300 * difficulty) / 50) * 50,
      seasons: index === 0 ? 2 : 1,
      category,
    }
  })
}
