import { useMemo, useState, type MouseEvent } from 'react';
import { Avatar } from '../components/Avatar';
import { useFx } from '../components/Fx';
import { ConfirmModal, Modal } from '../components/Modal';
import { ParentLogin } from '../components/ParentLogin';
import { countryOfTheDay, flagEmoji } from '../countries';
import { formatDay, formatTime, fromISODate } from '../dates';
import { balance, choresDueOn, completionFor, eventStars, newId } from '../logic';
import type { Occasion } from '../seasons';
import { useStore } from '../store';
import type { Chore, Reward, StarEvent } from '../types';

type Tab = 'chores' | 'shop' | 'stars';

interface Props {
  today: string;
  occasion: Occasion | null;
  onParentLogin: (parentId: string) => void;
}

export function KidScreen({ today, occasion, onParentLogin }: Props) {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>('chores');
  const [loginOpen, setLoginOpen] = useState(false);
  const stars = balance(state.events);
  const { child, settings } = state;
  const country = settings.theme === 'geography' || settings.theme === 'flags' ? countryOfTheDay(fromISODate(today)) : null;
  const dateLabel = fromISODate(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="kid">
      <header className="topbar">
        <div className="avatar-frame">
          <Avatar id={child.avatarId} skinTone={child.skinTone} hairColor={child.hairColor} size={64} />
        </div>
        <div className="greeting">
          <h1>Hi, {child.name}!</h1>
          <div className="on-bg-muted">{dateLabel}</div>
        </div>
        <div className="star-pill" aria-label={`${stars} stars`}>
          <span className="star-icon">⭐</span>
          <span className="star-count">{stars}</span>
        </div>
        <button className="icon-btn lock-btn" onClick={() => setLoginOpen(true)} aria-label="Parent mode">
          🔒
        </button>
      </header>

      {occasion && (
        <div className="occasion-banner card">
          <span className="occasion-emoji">{occasion.emoji}</span>
          <span>{occasion.id === 'birthday' ? `Happy Birthday, ${child.name}!` : occasion.greeting}</span>
          <span className="occasion-emoji">{occasion.emoji}</span>
        </div>
      )}

      {country && (
        <div className="country-card card">
          <span className="country-flag">{flagEmoji(country.code)}</span>
          <div>
            <div className="eyebrow">{settings.theme === 'flags' ? 'Flag of the day' : 'Country of the day'}</div>
            <div className="country-name">{country.name}</div>
            <div className="muted">
              Capital: {country.capital} · {country.continent}
            </div>
          </div>
        </div>
      )}

      <nav className="tabs" role="tablist">
        {(
          [
            ['chores', '✅', 'Chores'],
            ['shop', '🛍️', 'Reward Shop'],
            ['stars', '⭐', 'My Stars'],
          ] as const
        ).map(([id, emoji, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={'tab' + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
            <span className="tab-emoji">{emoji}</span> {label}
          </button>
        ))}
      </nav>

      {tab === 'chores' && <ChoresTab today={today} />}
      {tab === 'shop' && <ShopTab today={today} stars={stars} />}
      {tab === 'stars' && <StarsTab today={today} />}

      {loginOpen && (
        <ParentLogin
          onClose={() => setLoginOpen(false)}
          onSuccess={(id) => {
            setLoginOpen(false);
            onParentLogin(id);
          }}
        />
      )}
    </div>
  );
}

function ChoresTab({ today }: { today: string }) {
  const { state, mutate } = useStore();
  const fx = useFx();
  const [undoChore, setUndoChore] = useState<{ chore: Chore; event: StarEvent } | null>(null);
  const [allDone, setAllDone] = useState(false);

  const due = choresDueOn(state, today);
  const doneCount = due.filter((c) => completionFor(state.events, c.id, today)).length;

  const groups = useMemo(() => {
    const known = new Set(state.routines.map((r) => r.id));
    const out = state.routines
      .map((r) => ({ id: r.id, name: r.name, emoji: r.emoji, chores: due.filter((c) => c.routineId === r.id) }))
      .filter((g) => g.chores.length > 0);
    const orphans = due.filter((c) => !known.has(c.routineId));
    if (orphans.length) out.push({ id: 'other', name: 'Other', emoji: '📋', chores: orphans });
    return out;
  }, [state.routines, due]);

  const complete = (chore: Chore, e: MouseEvent) => {
    const event: StarEvent = {
      id: newId(), type: 'chore', at: Date.now(), date: today,
      choreId: chore.id, title: chore.title, emoji: chore.emoji, stars: chore.stars,
    };
    mutate((s) => {
      s.events.push(event);
    });
    fx.burst(e.clientX, e.clientY, `+${chore.stars} ⭐`);
    if (doneCount + 1 === due.length) {
      fx.play('allDone');
      fx.shower();
      window.setTimeout(() => setAllDone(true), 600);
    } else {
      fx.play('chore');
    }
  };

  if (due.length === 0) {
    return (
      <div className="empty card">
        <div className="empty-emoji">🏖️</div>
        <h2>No chores today!</h2>
        <p className="muted">Enjoy your day.</p>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <div className="progress-card card">
        <div className="progress-label">
          <strong>
            {doneCount} of {due.length} done today
          </strong>
          {doneCount === due.length && <span> 🎉 All done!</span>}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(doneCount / due.length) * 100}%` }} />
        </div>
      </div>

      {groups.map((g) => (
        <section key={g.id}>
          <h2 className="section-title">
            {g.emoji} {g.name}
          </h2>
          <div className="tile-grid">
            {g.chores.map((chore) => {
              const event = completionFor(state.events, chore.id, today);
              return (
                <button
                  key={chore.id}
                  className={'tile chore-tile' + (event ? ' done' : '')}
                  onClick={(e) => (event ? setUndoChore({ chore, event }) : complete(chore, e))}
                >
                  <span className="tile-emoji">{chore.emoji}</span>
                  <span className="tile-title">{chore.title}</span>
                  <span className="tile-stars">{event ? '✓ Done' : `+${chore.stars} ⭐`}</span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {undoChore && (
        <ConfirmModal
          title={`Undo "${undoChore.chore.title}"?`}
          message={`This takes back ${undoChore.chore.stars} ⭐.`}
          confirmLabel="Undo it"
          cancelLabel="Keep it done"
          onCancel={() => setUndoChore(null)}
          onConfirm={() => {
            mutate((s) => {
              s.events = s.events.filter((ev) => ev.id !== undoChore.event.id);
            });
            setUndoChore(null);
          }}
        />
      )}

      {allDone && (
        <Modal onClose={() => setAllDone(false)}>
          <div className="celebrate">
            <div className="celebrate-emoji">🏆</div>
            <h2>All done today!</h2>
            <p>Amazing work, {state.child.name}!</p>
            <button className="btn btn-primary btn-big" onClick={() => setAllDone(false)}>
              Yay!
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ShopTab({ today, stars }: { today: string; stars: number }) {
  const { state, mutate } = useStore();
  const fx = useFx();
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const [got, setGot] = useState<{ reward: Reward; eventId: string } | null>(null);
  const rewards = state.rewards.filter((r) => r.active);

  const buy = (reward: Reward) => {
    const event: StarEvent = {
      id: newId(), type: 'redeem', at: Date.now(), date: today,
      rewardId: reward.id, title: reward.title, emoji: reward.emoji, cost: reward.cost,
    };
    mutate((s) => {
      s.events.push(event);
    });
    setConfirm(null);
    setGot({ reward, eventId: event.id });
    fx.play('reward');
    fx.shower([reward.emoji, '⭐', '✨']);
  };

  if (rewards.length === 0) {
    return (
      <div className="empty card">
        <div className="empty-emoji">🛍️</div>
        <h2>The shop is empty</h2>
        <p className="muted">Ask a grown-up to add some rewards.</p>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <div className="shop-balance card">
        You have <strong className="big-number">{stars}</strong> ⭐ to spend
      </div>
      <div className="tile-grid">
        {rewards.map((r) => {
          const canAfford = stars >= r.cost;
          return (
            <button key={r.id} className={'tile reward-tile' + (canAfford ? '' : ' locked')} onClick={() => canAfford && setConfirm(r)}>
              <span className="tile-emoji">{r.emoji}</span>
              <span className="tile-title">{r.title}</span>
              <span className="tile-stars">{r.cost} ⭐</span>
              {!canAfford && (
                <>
                  <div className="progress-track small">
                    <div className="progress-fill" style={{ width: `${Math.max(0, (stars / r.cost) * 100)}%` }} />
                  </div>
                  <span className="need-more">Need {r.cost - Math.max(0, stars)} more</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {confirm && (
        <ConfirmModal
          title={`${confirm.emoji} ${confirm.title}`}
          message={`Spend ${confirm.cost} ⭐? You'll have ${stars - confirm.cost} ⭐ left.`}
          confirmLabel="Yes, get it!"
          cancelLabel="Not now"
          onCancel={() => setConfirm(null)}
          onConfirm={() => buy(confirm)}
        />
      )}

      {got && (
        <Modal onClose={() => setGot(null)}>
          <div className="celebrate">
            <div className="celebrate-emoji">{got.reward.emoji}</div>
            <h2>You got it!</h2>
            <p>
              <strong>{got.reward.title}</strong>
            </p>
            <p className="muted">Show a grown-up your reward 😊</p>
            <div className="row-center">
              <button
                className="btn"
                onClick={() => {
                  mutate((s) => {
                    s.events = s.events.filter((e) => e.id !== got.eventId);
                  });
                  setGot(null);
                }}
              >
                Oops, undo
              </button>
              <button className="btn btn-primary btn-big" onClick={() => setGot(null)}>
                Awesome!
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function eventLine(e: StarEvent): { emoji: string; title: string } {
  if (e.type === 'bonus') return { emoji: '🌟', title: e.note ? `Bonus: ${e.note}` : 'Bonus stars' };
  return { emoji: e.emoji, title: e.title };
}

function StarsTab({ today }: { today: string }) {
  const { state } = useStore();
  const recent = [...state.events]
    .filter((e) => !e.voided)
    .sort((a, b) => b.at - a.at)
    .slice(0, 150);

  const byDay = new Map<string, StarEvent[]>();
  for (const e of recent) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);

  if (recent.length === 0) {
    return (
      <div className="empty card">
        <div className="empty-emoji">⭐</div>
        <h2>No stars yet</h2>
        <p className="muted">Finish a chore to earn your first star!</p>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      {[...byDay.entries()].map(([day, events]) => {
        const earned = events.filter((e) => e.type !== 'redeem').reduce((s, e) => s + eventStars(e), 0);
        return (
          <section key={day}>
            <h2 className="section-title">
              {formatDay(day, today)} <span className="section-sub">+{earned} ⭐ earned</span>
            </h2>
            <div className="list card">
              {events.map((e) => {
                const { emoji, title } = eventLine(e);
                const delta = eventStars(e);
                return (
                  <div key={e.id} className="list-row">
                    <span className="list-emoji">{emoji}</span>
                    <span className="list-title">{title}</span>
                    <span className="muted list-time">{formatTime(e.at)}</span>
                    <span className={'delta ' + (delta >= 0 ? 'plus' : 'minus')}>
                      {delta >= 0 ? '+' : ''}
                      {delta} ⭐
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
