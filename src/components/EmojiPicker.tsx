import { useState } from 'react';

export const CHORE_EMOJI = [
  '🛏️', '🪥', '👕', '🧦', '👟', '🧥', '🎒', '📚', '✏️', '📖', '🎹', '🧸', '🧹', '🧺', '🗑️', '♻️',
  '🍽️', '🥣', '🥦', '💧', '🧼', '🚿', '🛁', '💤', '🐶', '🐱', '🐟', '🌱', '🌞', '🌙', '🤝', '💪',
  '⚽', '🏃', '🚲', '🙏', '🧩', '🎨', '🚗', '🧽', '🧃', '🍎',
];

export const REWARD_EMOJI = [
  '📱', '🎮', '📺', '🎬', '🍿', '🍕', '🍦', '🍪', '🧁', '🍩', '🎁', '🧸', '🎨', '🧩', '📚', '🛝',
  '🏞️', '🏊', '🚲', '🎳', '⛳', '🎟️', '🌙', '🛌', '🪙', '💵', '🏕️', '🦖', '🚀', '⚽', '🎉', '👑',
];

export const ROUTINE_EMOJI = ['🌅', '☀️', '🎒', '🏫', '🍎', '🍽️', '🌙', '🛁', '⭐', '🏠', '📅', '🎯'];

interface Props {
  value: string;
  options: string[];
  onChange: (emoji: string) => void;
}

export function EmojiPicker({ value, options, onChange }: Props) {
  const [custom, setCustom] = useState('');
  return (
    <div className="emoji-picker">
      <div className="emoji-grid">
        {options.map((e) => (
          <button
            type="button"
            key={e}
            className={'emoji-option' + (e === value ? ' selected' : '')}
            onClick={() => onChange(e)}
          >
            {e}
          </button>
        ))}
      </div>
      <label className="field-inline">
        <span className="muted">Or type any emoji:</span>
        <input
          className="input emoji-input"
          value={custom}
          maxLength={8}
          onChange={(ev) => {
            setCustom(ev.target.value);
            const first = [...new Intl.Segmenter().segment(ev.target.value)][0]?.segment;
            if (first) onChange(first);
          }}
          placeholder="😀"
        />
      </label>
    </div>
  );
}
