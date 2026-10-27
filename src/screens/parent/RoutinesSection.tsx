import { useState } from 'react';
import { EmojiPicker, ROUTINE_EMOJI } from '../../components/EmojiPicker';
import { ConfirmModal, Modal } from '../../components/Modal';
import { newId } from '../../logic';
import { useStore } from '../../store';
import type { Routine } from '../../types';
import { SectionHeader, move } from './shared';

export function RoutinesSection() {
  const { state, mutate } = useStore();
  const [editing, setEditing] = useState<Routine | null>(null);
  const [deleting, setDeleting] = useState<Routine | null>(null);

  const count = (id: string) => state.chores.filter((c) => c.routineId === id).length;
  const deleteTarget = deleting && state.routines.find((r) => r.id !== deleting.id);

  return (
    <div className="stack-lg">
      <SectionHeader title="Routines">
        <button className="btn btn-primary" onClick={() => setEditing({ id: newId(), name: '', emoji: '⭐' })}>
          + Add routine
        </button>
      </SectionHeader>
      <p className="muted">Routines group chores on the kid screen, in this order.</p>
      <div className="list card">
        {state.routines.map((r, i) => (
          <div key={r.id} className="list-row">
            <span className="list-emoji">{r.emoji}</span>
            <div className="list-title">
              <div>{r.name}</div>
              <div className="muted small">{count(r.id)} chores</div>
            </div>
            <div className="row-tight">
              <button className="icon-btn" disabled={i === 0} onClick={() => mutate((s) => void (s.routines = move(s.routines, i, -1)))} aria-label="Move up">
                ↑
              </button>
              <button
                className="icon-btn"
                disabled={i === state.routines.length - 1}
                onClick={() => mutate((s) => void (s.routines = move(s.routines, i, 1)))}
                aria-label="Move down"
              >
                ↓
              </button>
              <button className="btn btn-small" onClick={() => setEditing(r)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RoutineEditor
          routine={editing}
          isNew={!state.routines.some((r) => r.id === editing.id)}
          canDelete={state.routines.length > 1}
          onClose={() => setEditing(null)}
          onDelete={() => {
            setDeleting(editing);
            setEditing(null);
          }}
          onSave={(routine) => {
            mutate((s) => {
              const i = s.routines.findIndex((r) => r.id === routine.id);
              if (i >= 0) s.routines[i] = routine;
              else s.routines.push(routine);
            });
            setEditing(null);
          }}
        />
      )}
      {deleting && deleteTarget && (
        <ConfirmModal
          title={`Delete "${deleting.name}"?`}
          message={count(deleting.id) ? `Its ${count(deleting.id)} chores will move to “${deleteTarget.name}”.` : undefined}
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            mutate((s) => {
              s.chores.forEach((c) => c.routineId === deleting.id && (c.routineId = deleteTarget.id));
              s.routines = s.routines.filter((r) => r.id !== deleting.id);
            });
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function RoutineEditor(props: {
  routine: Routine;
  isNew: boolean;
  canDelete: boolean;
  onSave: (r: Routine) => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [r, setR] = useState(props.routine);
  return (
    <Modal title={props.isNew ? 'New routine' : 'Edit routine'} onClose={props.onClose}>
      <div className="stack">
        <label className="field">
          <span>Name</span>
          <input className="input" value={r.name} maxLength={24} placeholder="e.g. Weekend" onChange={(e) => setR({ ...r, name: e.target.value })} autoFocus />
        </label>
        <div className="field">
          <span>Picture</span>
          <EmojiPicker value={r.emoji} options={ROUTINE_EMOJI} onChange={(emoji) => setR({ ...r, emoji })} />
        </div>
        <div className="row-between">
          {!props.isNew && props.canDelete ? (
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
            <button className="btn btn-primary" disabled={!r.name.trim()} onClick={() => props.onSave({ ...r, name: r.name.trim() })}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
