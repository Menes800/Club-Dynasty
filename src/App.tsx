import { useEffect, useMemo, useState } from 'react'
import {
  acceptSponsor,
  autoPickLineup,
  createGame,
  extendPlayer,
  freeAgents,
  lineupStrength,
  nextOpponent,
  payroll,
  playNextWeek,
  playPlayoff,
  releasePlayer,
  setCaptain,
  signFreeAgent,
  sortedStandings,
  startNextSeason,
  toggleLineupPlayer,
  upgradeFacility,
  userRoster,
} from './game/engine'
import type { GameState, Player } from './game/types'

const SAVE_KEY = 'club-dynasty-save-v1'
type Tab = 'dashboard' | 'squad' | 'league' | 'market' | 'sponsors' | 'facilities' | 'board' | 'history' | 'settings'

function formatMoney(value: number) {
  return `${Math.round(value).toLocaleString('nb-NO')} kr`
}

function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) as GameState : null
  } catch {
    return null
  }
}

function Setup({ onStart }: { onStart: (state: GameState) => void }) {
  const [name, setName] = useState('Silver Bay Bears')
  const [city, setCity] = useState('Oslo')
  const [primary, setPrimary] = useState('#2d6cdf')
  const [secondary, setSecondary] = useState('#f2b84b')

  return (
    <main className="setup-shell">
      <section className="setup-card">
        <div className="eyebrow">CLUB DYNASTY</div>
        <h1>Bygg klubben. Vinn ligaen. Skap et dynasti.</h1>
        <p>Start med en liten klubb, bygg spillerstallen, fyll arenaen og jobb deg gjennom sesonger, sluttspill og tøffe styrekrav.</p>
        <div className="setup-grid">
          <label>Klubbnavn<input value={name} onChange={(event) => setName(event.target.value)} maxLength={30} /></label>
          <label>By<input value={city} onChange={(event) => setCity(event.target.value)} maxLength={24} /></label>
          <label>Hovedfarge<input type="color" value={primary} onChange={(event) => setPrimary(event.target.value)} /></label>
          <label>Detaljfarge<input type="color" value={secondary} onChange={(event) => setSecondary(event.target.value)} /></label>
        </div>
        <div className="club-preview" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
          <span>{name.slice(0, 2).toUpperCase()}</span>
          <div><strong>{name || 'Klubbnavn'}</strong><small>{city || 'By'}</small></div>
        </div>
        <button className="primary big" onClick={() => onStart(createGame(name.trim() || 'Club Dynasty FC', city.trim() || 'Oslo', primary, secondary))}>Start karriere</button>
      </section>
    </main>
  )
}

function Metric({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong>{hint && <small>{hint}</small>}</div>
}

function PlayerRow({ player, inLineup, captain, onToggle, onCaptain, onExtend, onRelease }: {
  player: Player
  inLineup: boolean
  captain: boolean
  onToggle: () => void
  onCaptain: () => void
  onExtend: () => void
  onRelease: () => void
}) {
  return (
    <div className={`player-row ${inLineup ? 'selected' : ''}`}>
      <div className="player-main">
        <div className="rating">{player.rating}</div>
        <div><strong>{player.name}{captain ? ' ©' : ''}</strong><small>{player.position} · {player.age} år · Moral {player.morale}</small></div>
      </div>
      <div className="player-contract"><strong>{formatMoney(player.wage)}</strong><small>{player.contractYears} år · Verdi {formatMoney(player.value)}</small></div>
      <div className="row-actions">
        <button onClick={onToggle} disabled={player.injuredWeeks > 0}>{inLineup ? 'Ta ut' : 'Sett inn'}</button>
        <button onClick={onCaptain} disabled={!inLineup}>Kaptein</button>
        <button onClick={onExtend}>Forleng</button>
        <button className="danger" onClick={onRelease}>Frigi</button>
      </div>
      {player.injuredWeeks > 0 && <div className="injury">Skadet i {player.injuredWeeks} uke(r)</div>}
    </div>
  )
}

function App() {
  const [state, setState] = useState<GameState | null>(() => loadSave())
  const [tab, setTab] = useState<Tab>('dashboard')
  const [autoPlaying, setAutoPlaying] = useState(false)

  useEffect(() => {
    if (state) localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!autoPlaying || !state || state.phase !== 'regular') return
    const timer = window.setTimeout(() => setState((current) => current ? playNextWeek(current) : current), 650)
    return () => window.clearTimeout(timer)
  }, [autoPlaying, state])

  useEffect(() => {
    if (state && state.phase !== 'regular') setAutoPlaying(false)
  }, [state?.phase])

  const table = useMemo(() => state ? sortedStandings(state) : [], [state])
  const rank = state ? table.findIndex((row) => row.teamId === 'user') + 1 : 0

  if (!state) return <Setup onStart={setState} />

  const roster = userRoster(state).sort((a, b) => b.rating - a.rating)
  const market = freeAgents(state).sort((a, b) => b.rating - a.rating).slice(0, 18)
  const currentPayroll = payroll(state)
  const userRow = state.standings.find((row) => row.teamId === 'user')!
  const next = nextOpponent(state)

  const playPrimaryAction = () => {
    if (state.phase === 'regular') setState(playNextWeek(state))
    else if (state.phase === 'playoffs') setState(playPlayoff(state))
    else setState(startNextSeason(state))
  }

  const primaryLabel = state.phase === 'regular'
    ? `Spill uke ${state.week}`
    : state.phase === 'playoffs'
      ? `Spill ${state.playoffRound === 'semifinal' ? 'semifinale' : 'finale'}`
      : `Start sesong ${state.season + 1}`

  const navItems: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'Oversikt' },
    { id: 'squad', label: 'Spillerstall' },
    { id: 'league', label: 'Liga' },
    { id: 'market', label: 'Marked' },
    { id: 'sponsors', label: 'Sponsorer' },
    { id: 'facilities', label: 'Klubbbase' },
    { id: 'board', label: 'Styret' },
    { id: 'history', label: 'Historikk' },
    { id: 'settings', label: 'Innstillinger' },
  ]

  return (
    <div className={`app-shell ${state.settings.compactMode ? 'compact' : ''}`} style={{ '--club-primary': state.club.primary, '--club-secondary': state.club.secondary } as React.CSSProperties}>
      <header className="topbar">
        <div className="brand-mark" style={{ background: `linear-gradient(135deg, ${state.club.primary}, ${state.club.secondary})` }}>{state.club.name.slice(0, 2).toUpperCase()}</div>
        <div className="brand-copy"><strong>{state.club.name}</strong><small>{state.club.city} · Sesong {state.season}</small></div>
        <div className="top-metrics">
          <Metric label="Kontanter" value={formatMoney(state.cash)} />
          <Metric label="Fans" value={state.fans.toLocaleString('nb-NO')} />
          <Metric label="Styretillit" value={`${Math.round(state.boardTrust)} %`} />
          <Metric label="Plass" value={state.phase === 'regular' ? `${rank}.` : state.phase === 'playoffs' ? 'Sluttspill' : 'Offseason'} />
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <nav>{navItems.map((item) => <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>{item.label}</button>)}</nav>
          <div className="season-control">
            <small>{state.phase === 'regular' ? `Uke ${state.week} av 14` : state.phase === 'playoffs' ? state.playoffRound === 'semifinal' ? 'Semifinale' : 'Finale' : 'Sesong ferdig'}</small>
            <strong>{next}</strong>
            <button className="primary" onClick={playPrimaryAction} disabled={state.phase === 'regular' && state.lineup.length < 10}>{primaryLabel}</button>
            {state.phase === 'regular' && <button className={autoPlaying ? 'danger' : ''} onClick={() => setAutoPlaying((value) => !value)}>{autoPlaying ? 'Stopp autospill' : 'Autospill serie'}</button>}
            {state.lineup.length < 10 && <p className="warning">Du må ha 10 friske spillere i laget.</p>}
          </div>
        </aside>

        <main className="content">
          {tab === 'dashboard' && (
            <>
              <section className="hero-panel">
                <div><div className="eyebrow">{state.phase === 'playoffs' ? 'SLUTTSPILL' : state.phase === 'offseason' ? 'OFFSEASON' : `UKE ${state.week}`}</div><h1>{state.phase === 'regular' ? `Neste kamp mot ${next}` : state.phase === 'playoffs' ? `${state.playoffRound === 'semifinal' ? 'Semifinale' : 'Finale'} mot ${next}` : 'Bygg laget før neste sesong'}</h1><p>Lagstyrke {lineupStrength(state).toFixed(1)} · {state.lineup.length}/10 startspillere · Lønn {formatMoney(currentPayroll)} av {formatMoney(state.salaryCap)}</p></div>
                <button className="primary big" onClick={playPrimaryAction}>{primaryLabel}</button>
              </section>
              <section className="metric-grid">
                <Metric label="Ligaseire" value={`${userRow.won}`} hint={`${userRow.played} spilt`} />
                <Metric label="Målforskjell" value={`${userRow.scored - userRow.conceded > 0 ? '+' : ''}${userRow.scored - userRow.conceded}`} hint={`${userRow.scored}–${userRow.conceded}`} />
                <Metric label="Omdømme" value={`${Math.round(state.reputation)}`} hint="Påvirker marked og sponsorer" />
                <Metric label="Pokaler" value={`${state.trophies}`} hint="Mesterskap vunnet" />
              </section>
              <div className="two-column">
                <section className="panel"><div className="section-title"><h2>Siste nytt</h2></div><div className="feed">{state.notifications.slice(0, 8).map((note, index) => <div key={`${note}-${index}`}>{note}</div>)}</div></section>
                <section className="panel"><div className="section-title"><h2>Tabelltopp</h2><button onClick={() => setTab('league')}>Se hele</button></div><div className="mini-table">{table.slice(0, 5).map((row, index) => <div key={row.teamId} className={row.teamId === 'user' ? 'user-row' : ''}><span>{index + 1}</span><strong>{row.name}</strong><span>{row.points} p</span></div>)}</div></section>
              </div>
              <section className="panel"><div className="section-title"><h2>Siste kamper</h2></div><div className="report-grid">{state.reports.slice(0, 6).map((report, index) => <article key={`${report.season}-${report.week}-${index}`} className={report.result === 'W' ? 'win' : 'loss'}><small>{report.competition} · S{report.season}</small><strong>{report.score}</strong><span>{report.opponent}</span><p>{report.note}</p></article>)}</div></section>
            </>
          )}

          {tab === 'squad' && (
            <section className="panel">
              <div className="section-title"><div><h2>Min spillerstall</h2><p>{roster.length} spillere · {state.lineup.length}/10 i startlaget</p></div><button className="primary" onClick={() => setState(autoPickLineup(state))}>Velg beste lag</button></div>
              <div className="salary-bar"><span style={{ width: `${Math.min(100, currentPayroll / state.salaryCap * 100)}%` }} /></div>
              <div className="player-list">{roster.map((player) => <PlayerRow key={player.id} player={player} inLineup={state.lineup.includes(player.id)} captain={state.captainId === player.id} onToggle={() => setState(toggleLineupPlayer(state, player.id))} onCaptain={() => setState(setCaptain(state, player.id))} onExtend={() => setState(extendPlayer(state, player.id))} onRelease={() => setState(releasePlayer(state, player.id))} />)}</div>
            </section>
          )}

          {tab === 'league' && (
            <div className="two-column wide-left">
              <section className="panel"><div className="section-title"><h2>Ligatabell</h2><span>Top 4 går til sluttspill</span></div><table><thead><tr><th>#</th><th>Klubb</th><th>K</th><th>V</th><th>T</th><th>MF</th><th>P</th></tr></thead><tbody>{table.map((row, index) => <tr key={row.teamId} className={row.teamId === 'user' ? 'user-row' : ''}><td>{index + 1}</td><td>{row.name}</td><td>{row.played}</td><td>{row.won}</td><td>{row.lost}</td><td>{row.scored - row.conceded}</td><td><strong>{row.points}</strong></td></tr>)}</tbody></table></section>
              <section className="panel"><div className="section-title"><h2>Kommende</h2></div><div className="fixture-list">{state.schedule.filter((match) => !match.played && (match.homeId === 'user' || match.awayId === 'user')).slice(0, 6).map((match) => { const opponentId = match.homeId === 'user' ? match.awayId : match.homeId; const opponent = state.standings.find((row) => row.teamId === opponentId)?.name; return <div key={match.id}><span>Uke {match.week}</span><strong>{match.homeId === 'user' ? `${state.club.name} – ${opponent}` : `${opponent} – ${state.club.name}`}</strong></div> })}</div></section>
            </div>
          )}

          {tab === 'market' && (
            <section className="panel"><div className="section-title"><div><h2>Spillermarked</h2><p>Andre klubbers spillere vises ikke som dine. Her kan du kun signere ledige spillere.</p></div><span>{roster.length}/30 spillere</span></div><div className="market-grid">{market.map((player) => { const fee = Math.round(player.value * 0.16); const blocked = state.cash < fee || currentPayroll + player.wage > state.salaryCap || roster.length >= 30; return <article key={player.id}><div className="rating large">{player.rating}</div><h3>{player.name}</h3><p>{player.position} · {player.age} år</p><dl><div><dt>Potensial</dt><dd>{player.potential}</dd></div><div><dt>Lønn</dt><dd>{formatMoney(player.wage)}</dd></div><div><dt>Signering</dt><dd>{formatMoney(fee)}</dd></div></dl><button className="primary" disabled={blocked} onClick={() => setState(signFreeAgent(state, player.id))}>{blocked ? 'Ikke mulig nå' : 'Signer 2 år'}</button></article> })}</div></section>
          )}

          {tab === 'sponsors' && (
            <>
              <section className="panel"><div className="section-title"><h2>Aktive sponsorer</h2><span>{state.activeSponsors.length}/3 avtaler</span></div><div className="sponsor-grid">{state.activeSponsors.length ? state.activeSponsors.map((sponsor) => <article key={sponsor.id}><span className="badge">{sponsor.category}</span><h3>{sponsor.name}</h3><strong>{formatMoney(sponsor.weeklyPay)} / uke</strong><p>{sponsor.seasonsLeft} sesong(er) igjen</p><small>Krav: topp {Math.round(sponsor.minFinish)} og {sponsor.fanTarget.toLocaleString('nb-NO')} fans</small></article>) : <p>Ingen aktive sponsoravtaler. Velg tilbud under.</p>}</div></section>
              <section className="panel"><div className="section-title"><h2>Tilbud</h2><span>Klikk for å signere eller erstatte samme kategori</span></div><div className="sponsor-grid">{state.sponsorOffers.map((offer) => <article key={offer.id}><span className="badge">{offer.category}</span><h3>{offer.name}</h3><strong>{formatMoney(offer.weeklyPay)} / uke</strong><p>Signeringsbonus {formatMoney(offer.signingBonus)}</p><small>Krav: topp {Math.round(offer.minFinish)} og {offer.fanTarget.toLocaleString('nb-NO')} fans</small><button className="primary" onClick={() => setState(acceptSponsor(state, offer.id))}>Signer avtale</button></article>)}</div></section>
            </>
          )}

          {tab === 'facilities' && (
            <section className="panel"><div className="section-title"><div><h2>Klubbbase</h2><p>Langsiktige investeringer som gjør hver sesong sterkere.</p></div></div><div className="facility-grid">{state.facilities.map((facility) => { const cost = Math.round(facility.baseCost * Math.pow(1.65, facility.level)); return <article key={facility.id}><div className="facility-level">Nivå {facility.level}/{facility.maxLevel}</div><h3>{facility.name}</h3><p>{facility.description}</p><strong>{facility.effect}</strong><button className="primary" disabled={facility.level >= facility.maxLevel || state.cash < cost} onClick={() => setState(upgradeFacility(state, facility.id))}>{facility.level >= facility.maxLevel ? 'Maks nivå' : `Oppgrader · ${formatMoney(cost)}`}</button></article> })}</div></section>
          )}

          {tab === 'board' && (
            <div className="two-column">
              <section className="panel"><div className="section-title"><h2>Styrets mål</h2><span>Tillit {Math.round(state.boardTrust)} %</span></div><div className="goal-list">{state.boardGoals.map((goal) => <article key={goal.id} className={goal.complete ? 'complete' : ''}><div><strong>{goal.text}</strong><small>{goal.current.toLocaleString('nb-NO')} / {goal.target.toLocaleString('nb-NO')}</small></div><div className="progress"><span style={{ width: `${Math.min(100, goal.current / goal.target * 100)}%` }} /></div><p>Belønning {formatMoney(goal.reward)} · +{goal.trustReward} tillit</p></article>)}</div></section>
              <section className="panel"><div className="section-title"><h2>Styrevurdering</h2></div><div className={`board-score ${state.boardTrust >= 70 ? 'good' : state.boardTrust < 40 ? 'bad' : ''}`}>{Math.round(state.boardTrust)}</div><p>{state.boardTrust >= 75 ? 'Styret er svært fornøyd. Du har handlingsrom til å bygge langsiktig.' : state.boardTrust >= 50 ? 'Styret støtter prosjektet, men forventer tydelig sportslig fremgang.' : 'Stillingen din er utsatt. Resultater og økonomisk kontroll må forbedres raskt.'}</p></section>
            </div>
          )}

          {tab === 'history' && (
            <section className="panel"><div className="section-title"><h2>Klubbhistorikk</h2><span>{state.trophies} mesterskap</span></div>{state.history.length ? <table><thead><tr><th>Sesong</th><th>Serieplass</th><th>Sluttspill</th><th>Fans</th><th>Kontanter</th><th>Pokaler</th></tr></thead><tbody>{state.history.map((season) => <tr key={season.season}><td>{season.season}</td><td>{season.finish}.</td><td>{season.playoff}</td><td>{season.fans.toLocaleString('nb-NO')}</td><td>{formatMoney(season.cash)}</td><td>{season.trophies}</td></tr>)}</tbody></table> : <p>Historikken fylles etter første fullførte sesong.</p>}</section>
          )}

          {tab === 'settings' && (
            <section className="panel settings-panel"><div className="section-title"><h2>Innstillinger</h2></div><label className="switch-row"><div><strong>Lyd</strong><small>Spilllyd og varsler</small></div><input type="checkbox" checked={state.settings.sound} onChange={(event) => setState({ ...state, settings: { ...state.settings, sound: event.target.checked } })} /></label><label className="switch-row"><div><strong>Automatisk sponsorfornyelse</strong><small>Fyll tomme sponsorkategorier automatisk ved ny sesong</small></div><input type="checkbox" checked={state.settings.autoRenewSponsors} onChange={(event) => setState({ ...state, settings: { ...state.settings, autoRenewSponsors: event.target.checked } })} /></label><label className="switch-row"><div><strong>Kompakt visning</strong><small>Mindre luft i lister og paneler</small></div><input type="checkbox" checked={state.settings.compactMode} onChange={(event) => setState({ ...state, settings: { ...state.settings, compactMode: event.target.checked } })} /></label><button className="danger reset" onClick={() => { if (window.confirm('Slette hele karrieren og starte på nytt?')) { localStorage.removeItem(SAVE_KEY); setState(null) } }}>Slett lagring</button></section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
