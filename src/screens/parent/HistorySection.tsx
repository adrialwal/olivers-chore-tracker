import { useState } from 'react';
import { formatDay, formatTime, fromISODate, addDays, toISODate } from '../../dates';
import { eventStars } from '../../logic';
import { useStore } from '../../store';
import type { Parent, StarEvent } from '../../types';
import { eventLine } from '../Kid';
import { SectionHeader } from './shared';

type Range = '7' | '30' | 'all';
type Kind = 'all' | StarEvent['type'];

export function HistorySection({ parent, today }: { parent: Parent; today: string }) {
  const { state, mutate } = useStore();
  const [range, setRange] = useState<Range>('7');
  const [kind, setKind] = useState<Kind>('all');

  const since = range === 'all' ? '' : toISODate(addDays(fromISODate(today), -Number(range) + 1));
  const events = state.events
    .filter((e) => e.date >= since && (kind === 'all' || e.type === kind))
    .sort((a, b) => b.at - a.at);

  const nameOf = (id: string) => state.parents.find((p) => p.id === id)?.name ?? 'a grown-up';
  const byDay = new Map<string, StarEvent[]>();
  for (const e of events) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);

  const setVoided = (id: string, voided: boolean) =>
    mutate((s) => {
      const e = s.events.find((x) => x.id === id);
      if (!e) return;
      if (voided) e.voided = { at: Date.now(), parentId: parent.id };
      else delete e.voided;
    });

  return (
    <div className="stack-lg">
      <SectionHeader title="History" />
      <div className="row wrap">
        <div className="segmented">
          {(
            [
              ['7', '7 days'],
              ['30', '30 days'],
              ['all', 'All'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={range === id ? 'active' : ''} onClick={() => setRange(id)}>
              {label}
            </button>
          ))}
        </div>
        <div className="segmented">
          {(
            [
              ['all', 'Everything'],
              ['chore', 'Chores'],
              ['redeem', 'Rewards'],
              ['bonus', 'Bonus'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={kind === id ? 'active' : ''} onClick={() => setKind(id)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="muted small">Tap “Undo” to cancel a chore, refund a reward or take back bonus stars. Undone items stay listed, crossed out.</p>

      {events.length === 0 && <p className="muted">Nothing here yet.</p>}
      {[...byDay.entries()].map(([day, list]) => (
        <section key={day} className="stack">
          <h3>{formatDay(day, today)}</h3>
          <div className="list card">
            {list.map((e) => {
              const { emoji, title } = eventLine(e);
              const amount = e.type === 'redeem' ? -e.cost : e.stars;
              return (
                <div key={e.id} className={'list-row' + (e.voided ? ' voided' : '')}>
                  <span className="list-emoji">{emoji}</span>
                  <div className="list-title">
                    <div>{title}</div>
                    <div className="muted small">
                      {formatTime(e.at)}
                      {e.type === 'bonus' && ` · from ${nameOf(e.parentId)}`}
                      {e.voided && ` · undone by ${nameOf(e.voided.parentId)}`}
                    </div>
                  </div>
                  <span className={'delta ' + (amount >= 0 ? 'plus' : 'minus')}>
                    {amount >= 0 ? '+' : ''}
                    {amount} ⭐
                  </span>
                  <button className="btn btn-small" onClick={() => setVoided(e.id, !e.voided)}>
                    {e.voided ? 'Restore' : 'Undo'}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="muted small right">
            Day total: {list.reduce((s, e) => s + eventStars(e), 0)} ⭐
          </div>
        </section>
      ))}
    </div>
  );
}
