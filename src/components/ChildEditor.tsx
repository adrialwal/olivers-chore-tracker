import { AVATARS, HAIR_COLORS, SKIN_TONES } from '../avatars';
import type { Child } from '../types';
import { Avatar } from './Avatar';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

interface Props {
  child: Child;
  onChange: (child: Child) => void;
}

export function ChildEditor({ child, onChange }: Props) {
  const set = (patch: Partial<Child>) => onChange({ ...child, ...patch });
  const [bMonth, bDay] = child.birthday ? child.birthday.split('-').map(Number) : [0, 0];
  const daysInMonth = bMonth ? new Date(2024, bMonth, 0).getDate() : 31;
  const setBirthday = (m: number, d: number) =>
    set({ birthday: m && d ? `${String(m).padStart(2, '0')}-${String(Math.min(d, new Date(2024, m, 0).getDate())).padStart(2, '0')}` : null });

  return (
    <div className="stack">
      <label className="field">
        <span>Name</span>
        <input className="input" value={child.name} maxLength={20} onChange={(e) => set({ name: e.target.value })} />
      </label>

      <div className="field">
        <span>Avatar</span>
        <div className="avatar-grid">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a.id}
              className={'avatar-option' + (a.id === child.avatarId ? ' selected' : '')}
              onClick={() => set({ avatarId: a.id })}
            >
              <Avatar id={a.id} skinTone={child.skinTone} hairColor={child.hairColor} size={56} />
              <span>{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="two-col">
        <div className="field">
          <span>Skin tone</span>
          <div className="swatches">
            {SKIN_TONES.map((t, i) => (
              <button
                type="button"
                key={t.name}
                className={'swatch' + (i === child.skinTone ? ' selected' : '')}
                style={{ background: t.base }}
                aria-label={t.name}
                onClick={() => set({ skinTone: i })}
              />
            ))}
          </div>
        </div>
        <div className="field">
          <span>Hair color</span>
          <div className="swatches">
            {HAIR_COLORS.map((h, i) => (
              <button
                type="button"
                key={h.name}
                className={'swatch' + (i === child.hairColor ? ' selected' : '')}
                style={{ background: h.color }}
                aria-label={h.name}
                onClick={() => set({ hairColor: i })}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="field">
        <span>Birthday (optional, for a birthday celebration)</span>
        <div className="row">
          <select className="input" value={bMonth} onChange={(e) => setBirthday(Number(e.target.value), bDay || 1)}>
            <option value={0}>Month</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          <select className="input" value={bDay} disabled={!bMonth} onChange={(e) => setBirthday(bMonth, Number(e.target.value))}>
            {Array.from({ length: daysInMonth }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          {child.birthday && (
            <button type="button" className="btn" onClick={() => set({ birthday: null })}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
