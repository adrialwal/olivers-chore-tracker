import { useState } from 'react';
import { EmojiPicker, REWARD_EMOJI } from '../../components/EmojiPicker';
import { ConfirmModal, Modal } from '../../components/Modal';
import { newId } from '../../logic';
import { useStore } from '../../store';
import type { Reward } from '../../types';
import { SectionHeader, Stepper, move } from './shared';

export function RewardsSection() {
  const { state, mutate } = useStore();
  const [editing, setEditing] = useState<Reward | null>(null);
  const [deleting, setDeleting] = useState<Reward | null>(null);

  const save = (reward: Reward) => {
    mutate((s) => {
      const i = s.rewards.findIndex((r) => r.id === reward.id);
      if (i >= 0) s.rewards[i] = reward;
      else s.rewards.push(reward);
    });
    setEditing(null);
  };

  return (
    <div className="stack-lg">
      <SectionHeader title="Reward Shop">
        <button className="btn btn-primary" onClick={() => setEditing({ id: newId(), title: '', emoji: '🎁', cost: 10, active: true })}>
          + Add reward
        </button>
      </SectionHeader>
      <p className="muted">{state.child.name} can buy these with stars right away. Rewards that cost more than the current balance show how many stars are still needed.</p>

      {state.rewards.length === 0 && <p className="muted">No rewards yet.</p>}
      <div className="list card">
        {state.rewards.map((r, i) => (
          <div key={r.id} className={'list-row' + (r.active ? '' : ' paused')}>
            <span className="list-emoji">{r.emoji}</span>
            <div className="list-title">
              <div>{r.title}</div>
              <div className="muted small">
                {r.cost} ⭐{r.active ? '' : ' · Hidden'}
              </div>
            </div>
            <div className="row-tight">
              <button className="icon-btn" disabled={i === 0} onClick={() => mutate((s) => void (s.rewards = move(s.rewards, i, -1)))} aria-label="Move up">
                ↑
              </button>
              <button
                className="icon-btn"
                disabled={i === state.rewards.length - 1}
                onClick={() => mutate((s) => void (s.rewards = move(s.rewards, i, 1)))}
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
        <RewardEditor
          reward={editing}
          isNew={!state.rewards.some((r) => r.id === editing.id)}
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
          message="Rewards already bought stay in the history."
          confirmLabel="Delete"
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            mutate((s) => {
              s.rewards = s.rewards.filter((r) => r.id !== deleting.id);
            });
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}

function RewardEditor(props: { reward: Reward; isNew: boolean; onSave: (r: Reward) => void; onDelete: () => void; onClose: () => void }) {
  const [r, setR] = useState(props.reward);
  const set = (patch: Partial<Reward>) => setR((prev) => ({ ...prev, ...patch }));
  return (
    <Modal title={props.isNew ? 'New reward' : 'Edit reward'} onClose={props.onClose} wide>
      <div className="stack">
        <label className="field">
          <span>Reward</span>
          <input className="input" value={r.title} maxLength={40} placeholder="e.g. 30 min screen time" onChange={(e) => set({ title: e.target.value })} autoFocus />
        </label>
        <div className="field">
          <span>Picture</span>
          <EmojiPicker value={r.emoji} options={REWARD_EMOJI} onChange={(emoji) => set({ emoji })} />
        </div>
        <div className="field">
          <span>Cost in stars</span>
          <Stepper value={r.cost} onChange={(cost) => set({ cost })} max={9999} />
        </div>
        <label className="check">
          <input type="checkbox" checked={r.active} onChange={(e) => set({ active: e.target.checked })} />
          Show in the shop
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
            <button className="btn btn-primary" disabled={!r.title.trim()} onClick={() => props.onSave({ ...r, title: r.title.trim() })}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
