import { useState } from 'react';
import { CHORE_EMOJI, EmojiPicker } from '../../components/EmojiPicker';
import { ConfirmModal, Modal } from '../../components/Modal';
import { WEEKDAYS } from '../../dates';
import { describeSchedule, newId } from '../../logic';
import { useStore } from '../../store';
import type { Chore, Schedule } from '../../types';
import { SectionHeader, Stepper, move } from './shared';

export function ChoresSection({ today }: { today: string }) {
  const { state, mutate } = useStore();
  const [editing, setEditing] = useState<Chore | null>(null);
  const [deleting, setDeleting] = useState<Chore | null>(null);

  const blank = (): Chore => ({
    id: newId(), title: '', emoji: '⭐', stars: 1,
    routineId: state.routines[0]?.id ?? '', schedule: { type: 'daily' }, active: true,
  });

  const save = (chore: Chore) => {
    mutate((s) => {
      const i = s.chores.findIndex((c) => c.id === chore.id);
      if (i >= 0) s.chores[i] = chore;
      else s.chores.push(chore);
    });
    setEditing(null);
  };

  const reorder = (chore: Chore, delta: number) =>
    mutate((s) => {
      // Move within the same routine by swapping with the neighbouring chore in that routine.
      const sameRoutine = s.chores.filter((c) => c.routineId === chore.routineId);
      const idx = sameRoutine.findIndex((c) => c.id === chore.id);
      const other = sameRoutine[idx + delta];
      if (!other) return;
      const a = s.chores.findIndex((c) => c.id === chore.id);
      const b = s.chores.findIndex((c) => c.id === other.id);
      s.chores = move(s.chores, a, b - a);
    });

  const groups = [
    ...state.routines.map((r) => ({ id: r.id, label: `${r.emoji} ${r.name}` })),
    { id: '__other', label: '📋 Other' },
  ]
    .map((g) => ({
      ...g,
      chores: state.chores.filter((c) =>
        g.id === '__other' ? !state.routines.some((r) => r.id === c.routineId) : c.routineId === g.id,
      ),
    }))
    .filter((g) => g.chores.length > 0);

  return (
    <div className="stack-lg">
      <SectionHeader title="Chores">
        <button className="btn btn-primary" onClick={() => setEditing(blank())}>
          + Add chore
        </button>
      </SectionHeader>

      {state.chores.length === 0 && <p className="muted">No chores yet. Tap “Add chore” to create one.</p>}

      {groups.map((g) => (
        <section key={g.id} className="stack">
          <h3>{g.label}</h3>
          <div className="list card">
            {g.chores.map((c, i) => (
              <div key={c.id} className={'list-row' + (c.active ? '' : ' paused')}>
                <span className="list-emoji">{c.emoji}</span>
                <div className="list-title">
                  <div>{c.title}</div>
                  <div className="muted small">
                    {describeSchedule(c.schedule)} · {c.stars} ⭐{c.active ? '' : ' · Paused'}
                    {c.schedule.type === 'once' && c.schedule.date < today ? ' · Past' : ''}
                  </div>
                </div>
                <div className="row-tight">
                  <button className="icon-btn" disabled={i === 0} onClick={() => reorder(c, -1)} aria-label="Move up">
                    ↑
                  </button>
                  <button className="icon-btn" disabled={i === g.chores.length - 1} onClick={() => reorder(c, 1)} aria-label="Move down">
                    ↓
                  </button>
                  <button className="btn btn-small" onClick={() => setEditing(c)}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {editing && (
        <ChoreEditor
          chore={editing}
          today={today}
          isNew={!state.chores.some((c) => c.id === editing.id)}
          onSave={save}
          onDelete={() => {
            setDeleting(editing);
            setEditing(null);
          }}
          onClose={() => setEditing(null)}
        />
      )}
      {deleting && (
        <ConfirmModal
          title={`Delete "${deleting.title}"?`}
          message="Stars already earned for it stay in the history."
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            mutate((s) => {
              s.chores = s.chores.filter((c) => c.id !== deleting.id);
            });
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function ChoreEditor(props: {
  chore: Chore;
  today: string;
  isNew: boolean;
  onSave: (c: Chore) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const { state } = useStore();
  const [c, setC] = useState<Chore>(props.chore);
  const set = (patch: Partial<Chore>) => setC((prev) => ({ ...prev, ...patch }));
  const scheduleKind = c.schedule.type;

  const setSchedule = (s: Schedule) => set({ schedule: s });
  const toggleDay = (d: number) => {
    if (c.schedule.type !== 'weekdays') return;
    const days = c.schedule.days.includes(d) ? c.schedule.days.filter((x) => x !== d) : [...c.schedule.days, d];
    setSchedule({ type: 'weekdays', days });
  };
  const valid = c.title.trim() && (c.schedule.type !== 'weekdays' || c.schedule.days.length > 0);

  return (
    <Modal title={props.isNew ? 'New chore' : 'Edit chore'} onClose={props.onClose} wide>
      <div className="stack">
        <label className="field">
          <span>Chore</span>
          <input className="input" value={c.title} maxLength={40} placeholder="e.g. Feed the dog" onChange={(e) => set({ title: e.target.value })} autoFocus />
        </label>
        <div className="field">
          <span>Picture</span>
          <EmojiPicker value={c.emoji} options={CHORE_EMOJI} onChange={(emoji) => set({ emoji })} />
        </div>
        <div className="two-col">
          <div className="field">
            <span>Stars earned</span>
            <Stepper value={c.stars} onChange={(stars) => set({ stars })} max={100} />
          </div>
          <label className="field">
            <span>Routine</span>
            <select className="input" value={c.routineId} onChange={(e) => set({ routineId: e.target.value })}>
              {state.routines.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="field">
          <span>When</span>
          <div className="segmented">
            <button type="button" className={scheduleKind === 'daily' ? 'active' : ''} onClick={() => setSchedule({ type: 'daily' })}>
              Every day
            </button>
            <button
              type="button"
              className={scheduleKind === 'weekdays' ? 'active' : ''}
              onClick={() => setSchedule({ type: 'weekdays', days: [1, 2, 3, 4, 5] })}
            >
              Certain days
            </button>
            <button type="button" className={scheduleKind === 'once' ? 'active' : ''} onClick={() => setSchedule({ type: 'once', date: props.today })}>
              One time
            </button>
          </div>
          {c.schedule.type === 'weekdays' && (
            <div className="row wrap">
              {WEEKDAYS.map((name, d) => (
                <button
                  type="button"
                  key={name}
                  className={'chip' + (c.schedule.type === 'weekdays' && c.schedule.days.includes(d) ? ' selected' : '')}
                  onClick={() => toggleDay(d)}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
          {c.schedule.type === 'once' && (
            <input className="input" type="date" value={c.schedule.date} onChange={(e) => e.target.value && setSchedule({ type: 'once', date: e.target.value })} />
          )}
        </div>
        <label className="check">
          <input type="checkbox" checked={c.active} onChange={(e) => set({ active: e.target.checked })} />
          Active (uncheck to pause without deleting)
        </label>
        <div className="row-between">
          {!props.isNew ? (
            <button className="btn btn-danger" onClick={props.onDelete}>
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="row">
            <button className="btn" onClick={props.onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={!valid} onClick={() => props.onSave({ ...c, title: c.title.trim() })}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
