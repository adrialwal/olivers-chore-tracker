import { useState } from 'react';
import { backupFile, setupFile, shareFile, type ParsedFile } from '../../backup';
import { useFx } from '../../components/Fx';
import { ImportButton } from '../../components/ImportButton';
import { ConfirmModal } from '../../components/Modal';
import { useStore } from '../../store';
import { SectionHeader } from './shared';

export function BackupSection() {
  const { state, mutate, replace } = useStore();
  const fx = useFx();
  const [pending, setPending] = useState<ParsedFile | null>(null);
  const [error, setError] = useState('');

  const onParsed = (result: ParsedFile) => {
    if (result.kind === 'invalid') setError(result.reason);
    else {
      setError('');
      setPending(result);
    }
  };

  return (
    <div className="stack-lg">
      <SectionHeader title="Share & Backup" />

      <div className="card pad stack">
        <h3>🏠 Share setup with the other house</h3>
        <p className="muted">
          Sends chores, routines, rewards, appearance and {state.child.name}'s profile. Star balance, history and PINs are never
          included, so each house keeps its own.
        </p>
        <p className="muted small">
          On the other iPad: open the app → 🔒 → Share & Backup → Import, or choose “Import” on the first-time setup screen.
        </p>
        <div className="row wrap">
          <button className="btn btn-primary" onClick={() => shareFile(setupFile(state))}>
            📤 Share setup
          </button>
          <ImportButton onParsed={onParsed}>📥 Import a file</ImportButton>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card pad stack">
        <h3>💾 Full backup</h3>
        <p className="muted">
          Saves everything, including history, star balance and grown-ups' PINs. Save it to Files or iCloud Drive. Import it with the
          button above to restore.
        </p>
        <div>
          <button className="btn" onClick={() => shareFile(backupFile(state))}>
            💾 Save a backup
          </button>
        </div>
      </div>

      {pending?.kind === 'setup' && (
        <ConfirmModal
          title="Import setup?"
          message={`This replaces the chores (${pending.setup.chores.length}), rewards (${pending.setup.rewards.length}), routines and appearance on this iPad. Stars, history and PINs stay as they are.`}
          confirmLabel="Import"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            const { setup } = pending;
            mutate((s) => {
              s.routines = setup.routines.length ? setup.routines : s.routines;
              s.chores = setup.chores;
              s.rewards = setup.rewards;
              s.settings = setup.settings;
              s.child = setup.child;
            });
            setPending(null);
            fx.toast('Setup imported');
          }}
        />
      )}
      {pending?.kind === 'backup' && (
        <ConfirmModal
          title="Restore full backup?"
          message="This replaces EVERYTHING on this iPad, including stars, history and grown-ups' PINs, with the backup. You'll need a PIN from the backup to get back into parent mode."
          confirmLabel="Restore"
          danger
          onCancel={() => setPending(null)}
          onConfirm={() => {
            replace({ ...pending.state, setupComplete: true });
            setPending(null);
          }}
        />
      )}
    </div>
  );
}
