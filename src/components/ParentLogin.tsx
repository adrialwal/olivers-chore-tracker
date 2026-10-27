import { useState } from 'react';
import { hashSecret, makeSalt } from '../pin';
import { useStore } from '../store';
import { Modal } from './Modal';
import { PinPad } from './PinPad';

interface Props {
  onSuccess: (parentId: string) => void;
  onClose: () => void;
}

export function ParentLogin({ onSuccess, onClose }: Props) {
  const { state, mutate } = useStore();
  const [step, setStep] = useState<'pin' | 'code' | 'choose' | 'new' | 'confirm'>('pin');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [who, setWho] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');

  const checkPin = (pin: string) => {
    const match = state.parents.find((p) => hashSecret(pin, p.salt) === p.pinHash);
    if (!match) return false;
    onSuccess(match.id);
  };

  const checkCode = () => {
    const r = state.recovery;
    if (r && hashSecret(code, r.salt) === r.hash) {
      setStep('choose');
      setCodeError('');
    } else {
      setCodeError("That code doesn't match. Check the code you saved when setting up.");
    }
  };

  const pinInUse = (pin: string, exceptId: string) =>
    state.parents.some((p) => p.id !== exceptId && hashSecret(pin, p.salt) === p.pinHash);

  return (
    <Modal onClose={onClose}>
      {step === 'pin' && (
        <>
          <PinPad title="Grown-ups only" subtitle="Enter your PIN" onComplete={checkPin} />
          <div className="center">
            <button className="link-btn" onClick={() => setStep('code')}>
              Forgot PIN?
            </button>
          </div>
        </>
      )}
      {step === 'code' && (
        <div className="stack">
          <h2>Reset a PIN</h2>
          <p className="muted">Enter the recovery code you saved when you set up the app.</p>
          <input
            className="input code-input"
            value={code}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder="ABCD-2345"
            onChange={(e) => setCode(e.target.value)}
          />
          {codeError && <p className="error">{codeError}</p>}
          <div className="row-end">
            <button className="btn" onClick={() => setStep('pin')}>
              Back
            </button>
            <button className="btn btn-primary" onClick={checkCode} disabled={!code.trim()}>
              Next
            </button>
          </div>
        </div>
      )}
      {step === 'choose' && (
        <div className="stack">
          <h2>Whose PIN?</h2>
          {state.parents.map((p) => (
            <button
              key={p.id}
              className="btn btn-block"
              onClick={() => {
                setWho(p.id);
                setStep('new');
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}
      {step === 'new' && (
        <>
          <PinPad
            title="Choose a new PIN"
            subtitle={pinError || '4 digits'}
            onComplete={(pin) => {
              if (who && pinInUse(pin, who)) {
                setPinError('Another grown-up already uses that PIN.');
                return false;
              }
              setPinError('');
              setNewPin(pin);
              setStep('confirm');
            }}
          />
        </>
      )}
      {step === 'confirm' && (
        <PinPad
          title="Type it again"
          onComplete={(pin) => {
            if (pin !== newPin || !who) {
              setStep('new');
              setPinError("Those didn't match. Try again.");
              return false;
            }
            const salt = makeSalt();
            mutate((s) => {
              const p = s.parents.find((x) => x.id === who);
              if (p) {
                p.salt = salt;
                p.pinHash = hashSecret(pin, salt);
              }
            });
            onSuccess(who);
          }}
        />
      )}
    </Modal>
  );
}
