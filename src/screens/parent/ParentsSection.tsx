import { useState } from 'react';
import { ConfirmModal, Modal } from '../../components/Modal';
import { PinPad } from '../../components/PinPad';
import { useFx } from '../../components/Fx';
import { newId } from '../../logic';
import { hashSecret, makeRecoveryCode, makeSalt } from '../../pin';
import { useStore } from '../../store';
import type { Parent } from '../../types';
import { SectionHeader } from './shared';

type PinFlow = { parentId: string | null; name: string; step: 'name' | 'pin' | 'confirm'; pin: string; note: string };

export function ParentsSection({ parent }: { parent: Parent }) {
  const { state, mutate } = useStore();
  const fx = useFx();
  const [flow, setFlow] = useState<PinFlow | null>(null);
  const [removing, setRemoving] = useState<Parent | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [newCode, setNewCode] = useState<string | null>(null);

  const pinInUse = (pin: string, exceptId: string | null) =>
    state.parents.some((p) => p.id !== exceptId && hashSecret(pin, p.salt) === p.pinHash);

  const savePin = (f: PinFlow, pin: string) => {
    const salt = makeSalt();
    const pinHash = hashSecret(pin, salt);
    mutate((s) => {
      const existing = f.parentId && s.parents.find((p) => p.id === f.parentId);
      if (existing) {
        existing.salt = salt;
        existing.pinHash = pinHash;
      } else {
        s.parents.push({ id: newId(), name: f.name.trim(), salt, pinHash });
      }
    });
    fx.toast(f.parentId ? 'PIN changed' : `Added ${f.name.trim()}`);
    setFlow(null);
  };

  return (
    <div className="stack-lg">
      <SectionHeader title="Grown-ups">
        <button className="btn btn-primary" onClick={() => setFlow({ parentId: null, name: '', step: 'name', pin: '', note: '' })}>
          + Add grown-up
        </button>
      </SectionHeader>
      <p className="muted">Everyone gets their own PIN, so the history shows who gave bonus stars or undid something.</p>
      <div className="list card">
        {state.parents.map((p) => (
          <div key={p.id} className="list-row">
            <span className="list-emoji">🔑</span>
            <div className="list-title">
              {p.name}
              {p.id === parent.id && <span className="muted small"> (you)</span>}
            </div>
            <div className="row-tight">
              <button className="btn btn-small" onClick={() => setRenaming({ id: p.id, name: p.name })}>
                Rename
              </button>
              {p.id === parent.id && (
                <button className="btn btn-small" onClick={() => setFlow({ parentId: p.id, name: p.name, step: 'pin', pin: '', note: '' })}>
                  Change PIN
                </button>
              )}
              {p.id !== parent.id && (
                <button className="btn btn-small btn-danger" onClick={() => setRemoving(p)}>
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card pad stack">
        <h3>Recovery code</h3>
        <p className="muted">Lets you reset a PIN if everyone forgets theirs. Making a new code replaces the old one.</p>
        <div>
          <button className="btn" onClick={() => {
            const code = makeRecoveryCode();
            const salt = makeSalt();
            mutate((s) => {
              s.recovery = { salt, hash: hashSecret(code, salt) };
            });
            setNewCode(code);
          }}>
            Make a new recovery code
          </button>
        </div>
      </div>

      {flow && (
        <Modal onClose={() => setFlow(null)}>
          {flow.step === 'name' && (
            <div className="stack">
              <h2>Add a grown-up</h2>
              <label className="field">
                <span>Name</span>
                <input className="input" value={flow.name} maxLength={20} placeholder="Grandma, Stepdad…" autoFocus onChange={(e) => setFlow({ ...flow, name: e.target.value })} />
              </label>
              <div className="row-end">
                <button className="btn btn-primary" disabled={!flow.name.trim()} onClick={() => setFlow({ ...flow, step: 'pin' })}>
                  Next
                </button>
              </div>
            </div>
          )}
          {flow.step === 'pin' && (
            <PinPad
              title={flow.parentId ? 'New PIN' : `PIN for ${flow.name}`}
              subtitle={flow.note || '4 digits'}
              onComplete={(pin) => {
                if (pinInUse(pin, flow.parentId)) {
                  setFlow({ ...flow, note: 'Someone already uses that PIN. Pick another.' });
                  return false;
                }
                setFlow({ ...flow, step: 'confirm', pin });
              }}
            />
          )}
          {flow.step === 'confirm' && (
            <PinPad
              title="Type it again"
              onComplete={(pin) => {
                if (pin !== flow.pin) {
                  setFlow({ ...flow, step: 'pin', pin: '', note: "Those didn't match. Try again." });
                  return false;
                }
                savePin(flow, pin);
              }}
            />
          )}
        </Modal>
      )}

      {renaming && (
        <Modal title="Rename" onClose={() => setRenaming(null)}>
          <div className="stack">
            <input className="input" value={renaming.name} maxLength={20} autoFocus onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} />
            <div className="row-end">
              <button
                className="btn btn-primary"
                disabled={!renaming.name.trim()}
                onClick={() => {
                  mutate((s) => {
                    const p = s.parents.find((x) => x.id === renaming.id);
                    if (p) p.name = renaming.name.trim();
                  });
                  setRenaming(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {removing && (
        <ConfirmModal
          title={`Remove ${removing.name}?`}
          message="Their PIN will stop working on this iPad. History stays."
          confirmLabel="Remove"
          danger
          onCancel={() => setRemoving(null)}
          onConfirm={() => {
            mutate((s) => {
              s.parents = s.parents.filter((p) => p.id !== removing.id);
            });
            setRemoving(null);
          }}
        />
      )}

      {newCode && (
        <Modal title="Your new recovery code" onClose={() => setNewCode(null)}>
          <div className="stack center">
            <div className="recovery-code">{newCode}</div>
            <p className="muted">Screenshot it or write it down. It won't be shown again.</p>
            <button className="btn btn-primary" onClick={() => setNewCode(null)}>
              I saved it
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
