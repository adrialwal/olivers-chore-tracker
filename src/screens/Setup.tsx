import { useState } from 'react';
import type { SharedSetup } from '../backup';
import { ChildEditor } from '../components/ChildEditor';
import { ImportButton } from '../components/ImportButton';
import { PinPad } from '../components/PinPad';
import { starterChores, starterRewards, starterRoutines } from '../defaults';
import { newId } from '../logic';
import { hashSecret, makeRecoveryCode, makeSalt } from '../pin';
import { useStore } from '../store';
import { THEMES } from '../themes';
import type { Child, ThemeId } from '../types';

type Step = 'welcome' | 'child' | 'parent-name' | 'pin' | 'pin-confirm' | 'recovery' | 'starter';

export function Setup() {
  const { state, replace, mutate } = useStore();
  const [step, setStep] = useState<Step>('welcome');
  const [child, setChild] = useState<Child>(state.child);
  const [parentName, setParentName] = useState('');
  const [pin, setPin] = useState('');
  const [pinNote, setPinNote] = useState('4 digits. Keep it secret from little eyes!');
  const [recoveryCode] = useState(makeRecoveryCode);
  const [savedCode, setSavedCode] = useState(false);
  const [imported, setImported] = useState<SharedSetup | null>(null);
  const [addChores, setAddChores] = useState(true);
  const [addRewards, setAddRewards] = useState(true);
  const [theme, setTheme] = useState<ThemeId>(state.settings.theme);
  const [importError, setImportError] = useState('');

  const finish = () => {
    const parentSalt = makeSalt();
    const recoverySalt = makeSalt();
    const routines = imported?.routines.length ? imported.routines : starterRoutines();
    replace({
      ...state,
      setupComplete: true,
      child,
      parents: [{ id: newId(), name: parentName.trim(), salt: parentSalt, pinHash: hashSecret(pin, parentSalt) }],
      recovery: { salt: recoverySalt, hash: hashSecret(recoveryCode, recoverySalt) },
      routines,
      chores: imported ? imported.chores : addChores ? starterChores(routines) : [],
      rewards: imported ? imported.rewards : addRewards ? starterRewards() : [],
      settings: imported ? imported.settings : { ...state.settings, theme },
    });
  };

  return (
    <div className="setup">
      <div className="setup-card card">
        {step === 'welcome' && (
          <div className="stack center">
            <div className="hero-emoji">⭐</div>
            <h1>Welcome!</h1>
            <p>Let's set up the chore tracker. It takes about two minutes.</p>
            <button className="btn btn-primary btn-big" onClick={() => setStep('child')}>
              Let's go
            </button>
            <div className="divider">or</div>
            <p className="muted">Already set up on the other iPad? Import the setup file it shared.</p>
            <ImportButton
              onParsed={(result) => {
                if (result.kind === 'backup') {
                  replace({ ...result.state, setupComplete: true });
                } else if (result.kind === 'setup') {
                  setImported(result.setup);
                  setChild(result.setup.child);
                  setImportError('');
                  setStep('child');
                } else {
                  setImportError(result.reason);
                }
              }}
            >
              📥 Import a setup or backup file
            </ImportButton>
            {importError && <p className="error">{importError}</p>}
          </div>
        )}

        {step === 'child' && (
          <div className="stack">
            <h1>About your child</h1>
            {imported && <p className="success-note">✓ Imported chores, rewards and appearance. Check the details below.</p>}
            <ChildEditor child={child} onChange={setChild} />
            <div className="row-end">
              <button className="btn" onClick={() => setStep('welcome')}>
                Back
              </button>
              <button className="btn btn-primary" disabled={!child.name.trim()} onClick={() => setStep('parent-name')}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'parent-name' && (
          <div className="stack">
            <h1>About you</h1>
            <p className="muted">
              Each grown-up gets their own name and PIN for parent mode. You can add more grown-ups later.
            </p>
            <label className="field">
              <span>What does {child.name} call you?</span>
              <input
                className="input"
                value={parentName}
                maxLength={20}
                placeholder="Mom, Dad, Grandma…"
                onChange={(e) => setParentName(e.target.value)}
              />
            </label>
            <div className="row-end">
              <button className="btn" onClick={() => setStep('child')}>
                Back
              </button>
              <button className="btn btn-primary" disabled={!parentName.trim()} onClick={() => setStep('pin')}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'pin' && (
          <div className="stack center">
            <PinPad
              title="Choose your parent PIN"
              subtitle={pinNote}
              onComplete={(p) => {
                setPin(p);
                setStep('pin-confirm');
              }}
            />
            <button className="link-btn" onClick={() => setStep('parent-name')}>
              Back
            </button>
          </div>
        )}

        {step === 'pin-confirm' && (
          <PinPad
            title="Type your PIN again"
            onComplete={(p) => {
              if (p !== pin) {
                setPinNote("Those didn't match. Let's try again.");
                setStep('pin');
                return false;
              }
              setStep('recovery');
            }}
          />
        )}

        {step === 'recovery' && (
          <div className="stack center">
            <h1>Save your recovery code</h1>
            <p>If every grown-up forgets their PIN, this code lets you reset one.</p>
            <div className="recovery-code">{recoveryCode}</div>
            <p className="muted">Take a screenshot or write it down somewhere safe. It won't be shown again.</p>
            <label className="check">
              <input type="checkbox" checked={savedCode} onChange={(e) => setSavedCode(e.target.checked)} />
              I saved the code
            </label>
            <button className="btn btn-primary" disabled={!savedCode} onClick={() => (imported ? finish() : setStep('starter'))}>
              {imported ? 'Finish' : 'Next'}
            </button>
          </div>
        )}

        {step === 'starter' && (
          <div className="stack">
            <h1>Getting started</h1>
            <label className="check">
              <input type="checkbox" checked={addChores} onChange={(e) => setAddChores(e.target.checked)} />
              Add some starter chores (you can change them anytime)
            </label>
            <label className="check">
              <input type="checkbox" checked={addRewards} onChange={(e) => setAddRewards(e.target.checked)} />
              Add some starter rewards like screen time
            </label>
            <div className="field">
              <span>Pick a look</span>
              <div className="theme-grid">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={'theme-option' + (t.id === theme ? ' selected' : '')}
                    onClick={() => {
                      setTheme(t.id);
                      mutate((d) => {
                        d.settings.theme = t.id;
                      });
                    }}
                  >
                    <span className="theme-emoji">{t.emoji}</span>
                    <strong>{t.name}</strong>
                    <span className="muted">{t.description}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="row-end">
              <button className="btn btn-primary btn-big" onClick={finish}>
                Finish setup 🎉
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
