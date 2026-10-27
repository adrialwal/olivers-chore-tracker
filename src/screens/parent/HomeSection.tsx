import { useState } from 'react';
import { useFx } from '../../components/Fx';
import { balance, choresDueOn, completionFor, newId, starsEarnedOn } from '../../logic';
import { useStore } from '../../store';
import type { Parent } from '../../types';
import { SectionHeader, Stepper } from './shared';

export function HomeSection({ parent, today }: { parent: Parent; today: string }) {
  const { state, mutate } = useStore();
  const fx = useFx();
  const [amount, setAmount] = useState(2);
  const [note, setNote] = useState('');
  const due = choresDueOn(state, today);

  const giveBonus = () => {
    mutate((s) => {
      s.events.push({ id: newId(), type: 'bonus', at: Date.now(), date: today, stars: amount, note: note.trim(), parentId: parent.id });
    });
    fx.toast(`Gave ${state.child.name} ${amount} bonus ⭐`);
    setNote('');
  };

  return (
    <div className="stack-lg">
      <SectionHeader title="Home" />
      <div className="stat-row">
        <div className="stat card">
          <div className="stat-number">{balance(state.events)}</div>
          <div className="muted">stars to spend</div>
        </div>
        <div className="stat card">
          <div className="stat-number">{starsEarnedOn(state.events, today)}</div>
          <div className="muted">earned today</div>
        </div>
        <div className="stat card">
          <div className="stat-number">
            {due.filter((c) => completionFor(state.events, c.id, today)).length}/{due.length}
          </div>
          <div className="muted">chores done today</div>
        </div>
      </div>

      <div className="card pad stack">
        <h3>🌟 Give bonus stars</h3>
        <div className="row wrap">
          {[1, 2, 5, 10].map((n) => (
            <button key={n} className={'chip' + (amount === n ? ' selected' : '')} onClick={() => setAmount(n)}>
              +{n}
            </button>
          ))}
          <Stepper value={amount} onChange={setAmount} max={500} />
        </div>
        <input
          className="input"
          value={note}
          maxLength={60}
          placeholder="What for? (optional) e.g. Helped carry groceries"
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="row-end">
          <button className="btn btn-primary" onClick={giveBonus}>
            Give {amount} ⭐
          </button>
        </div>
      </div>

      <div className="card pad stack">
        <h3>Today's chores</h3>
        {due.length === 0 && <p className="muted">No chores scheduled today.</p>}
        <div className="list">
          {due.map((c) => {
            const done = completionFor(state.events, c.id, today);
            return (
              <div key={c.id} className="list-row">
                <span className="list-emoji">{c.emoji}</span>
                <span className="list-title">{c.title}</span>
                <span className={done ? 'badge done' : 'badge'}>{done ? '✓ Done' : 'Not yet'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
