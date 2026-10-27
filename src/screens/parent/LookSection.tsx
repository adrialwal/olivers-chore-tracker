import { fromISODate } from '../../dates';
import { OCCASIONS, occasionFor } from '../../seasons';
import { sounds } from '../../sound';
import { useStore } from '../../store';
import { ACCENT_SWATCHES, BACKGROUND_SWATCHES, THEMES } from '../../themes';
import type { ColorMode, Settings } from '../../types';
import { SectionHeader } from './shared';

export function LookSection({ today }: { today: string }) {
  const { state, mutate } = useStore();
  const { settings } = state;
  const set = (patch: Partial<Settings>) =>
    mutate((s) => {
      s.settings = { ...s.settings, ...patch };
    });

  const todays = occasionFor(fromISODate(today), state.child.birthday, settings.disabledOccasions);
  const toggleOccasion = (id: string, on: boolean) =>
    set({ disabledOccasions: on ? settings.disabledOccasions.filter((x) => x !== id) : [...settings.disabledOccasions, id] });

  return (
    <div className="stack-lg">
      <SectionHeader title="Look & Sound" />

      <div className="card pad stack">
        <h3>Theme</h3>
        <div className="theme-grid">
          {THEMES.map((t) => (
            <button key={t.id} className={'theme-option' + (t.id === settings.theme ? ' selected' : '')} onClick={() => set({ theme: t.id })}>
              <span className="theme-emoji">{t.emoji}</span>
              <strong>{t.name}</strong>
              <span className="muted">{t.description}</span>
            </button>
          ))}
        </div>
        <h3>Light or dark</h3>
        <div className="segmented">
          {(
            [
              ['auto', 'Match iPad'],
              ['light', '☀️ Light'],
              ['dark', '🌙 Dark'],
            ] as [ColorMode, string][]
          ).map(([id, label]) => (
            <button key={id} className={settings.mode === id ? 'active' : ''} onClick={() => set({ mode: id })}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="card pad stack">
        <h3>Custom colors</h3>
        <ColorRow
          label="Accent (buttons and highlights)"
          value={settings.accent}
          swatches={ACCENT_SWATCHES}
          onChange={(accent) => set({ accent })}
        />
        <ColorRow
          label="Background"
          value={settings.background}
          swatches={BACKGROUND_SWATCHES}
          onChange={(background) => set({ background })}
        />
      </div>

      <div className="card pad stack">
        <div className="row-between">
          <h3>Seasons & holidays</h3>
          <Toggle checked={settings.seasonal} onChange={(seasonal) => set({ seasonal })} label="Seasonal decorations" />
        </div>
        <p className="muted">
          Adds decorations that change automatically with the date. {settings.seasonal ? '' : 'Currently off.'}
          {settings.seasonal && (todays ? ` Today: ${todays.emoji} ${todays.name}.` : ' Nothing for today.')}
        </p>
        {settings.seasonal && (
          <>
            <p className="muted small">Uncheck any you'd rather skip.</p>
            <div className="occasion-grid">
              {OCCASIONS.map((o) => (
                <label key={o.id} className="check">
                  <input type="checkbox" checked={!settings.disabledOccasions.includes(o.id)} onChange={(e) => toggleOccasion(o.id, e.target.checked)} />
                  {o.emoji} {o.name}
                  {o.id === 'birthday' && !state.child.birthday && <span className="muted small"> (set in Child)</span>}
                </label>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card pad stack">
        <div className="row-between">
          <h3>Sounds</h3>
          <Toggle checked={settings.sound} onChange={(sound) => set({ sound })} label="Sound effects" />
        </div>
        <p className="muted">Little chimes when chores are done and rewards are bought. The iPad's silent switch and volume still apply.</p>
        <div className="row">
          <button className="btn" onClick={() => sounds.chore()}>
            ▶ Chore sound
          </button>
          <button className="btn" onClick={() => sounds.reward()}>
            ▶ Reward sound
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorRow(props: { label: string; value: string | null; swatches: string[]; onChange: (v: string | null) => void }) {
  return (
    <div className="field">
      <span>{props.label}</span>
      <div className="row wrap">
        <button className={'chip' + (props.value === null ? ' selected' : '')} onClick={() => props.onChange(null)}>
          Theme default
        </button>
        {props.swatches.map((c) => (
          <button
            key={c}
            className={'swatch' + (props.value === c ? ' selected' : '')}
            style={{ background: c }}
            aria-label={c}
            onClick={() => props.onChange(c)}
          />
        ))}
        <label className="swatch swatch-custom" aria-label="Pick any color">
          🎨
          <input type="color" value={props.value ?? '#3d7be0'} onChange={(e) => props.onChange(e.target.value)} />
        </label>
      </div>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} className={'toggle' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
      <span className="toggle-knob" />
    </button>
  );
}
