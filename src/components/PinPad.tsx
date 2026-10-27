import { useEffect, useState } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  /** Return false to show the "wrong PIN" shake and clear. */
  onComplete: (pin: string) => boolean | void;
}

export function PinPad({ title, subtitle, onComplete }: Props) {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (pin.length < 4) return;
    const ok = onComplete(pin);
    if (ok === false) {
      setShake(true);
      window.setTimeout(() => {
        setShake(false);
        setPin('');
      }, 450);
    } else {
      setPin('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const press = (d: string) => setPin((p) => (p.length < 4 ? p + d : p));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) press(e.key);
      if (e.key === 'Backspace') setPin((p) => p.slice(0, -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="pinpad">
      <h2>{title}</h2>
      {subtitle && <p className="muted">{subtitle}</p>}
      <div className={'pin-dots' + (shake ? ' shake' : '')} aria-label={`${pin.length} of 4 digits entered`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={'pin-dot' + (i < pin.length ? ' filled' : '')} />
        ))}
      </div>
      <div className="pin-keys">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} className="pin-key" onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <span />
        <button className="pin-key" onClick={() => press('0')}>
          0
        </button>
        <button className="pin-key" onClick={() => setPin((p) => p.slice(0, -1))} aria-label="Delete">
          ⌫
        </button>
      </div>
    </div>
  );
}
