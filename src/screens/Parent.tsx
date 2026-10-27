import { useEffect, useState } from 'react';
import { Avatar } from '../components/Avatar';
import type { Parent } from '../types';
import { useStore } from '../store';
import { balance } from '../logic';
import { HomeSection } from './parent/HomeSection';
import { ChoresSection } from './parent/ChoresSection';
import { RewardsSection } from './parent/RewardsSection';
import { RoutinesSection } from './parent/RoutinesSection';
import { HistorySection } from './parent/HistorySection';
import { ChildSection } from './parent/ChildSection';
import { LookSection } from './parent/LookSection';
import { ParentsSection } from './parent/ParentsSection';
import { BackupSection } from './parent/BackupSection';

const SECTIONS = [
  { id: 'home', emoji: '🏠', label: 'Home' },
  { id: 'chores', emoji: '✅', label: 'Chores' },
  { id: 'rewards', emoji: '🛍️', label: 'Rewards' },
  { id: 'routines', emoji: '🕒', label: 'Routines' },
  { id: 'history', emoji: '📜', label: 'History' },
  { id: 'child', emoji: '🧒', label: 'Child' },
  { id: 'look', emoji: '🎨', label: 'Look & Sound' },
  { id: 'parents', emoji: '🔑', label: 'Grown-ups' },
  { id: 'backup', emoji: '💾', label: 'Share & Backup' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

const AUTO_LOCK_MS = 5 * 60_000;

interface Props {
  parent: Parent;
  today: string;
  onExit: () => void;
}

export function ParentScreen({ parent, today, onExit }: Props) {
  const { state } = useStore();
  const [section, setSection] = useState<SectionId>('home');

  // Lock parent mode after a few minutes without a touch.
  useEffect(() => {
    let timer = window.setTimeout(onExit, AUTO_LOCK_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(onExit, AUTO_LOCK_MS);
    };
    window.addEventListener('pointerdown', reset);
    window.addEventListener('keydown', reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pointerdown', reset);
      window.removeEventListener('keydown', reset);
    };
  }, [onExit]);

  return (
    <div className="parent">
      <header className="topbar parent-topbar">
        <div className="avatar-frame small">
          <Avatar id={state.child.avatarId} skinTone={state.child.skinTone} hairColor={state.child.hairColor} size={44} />
        </div>
        <div className="greeting">
          <h1>Parent mode</h1>
          <div className="on-bg-muted">
            Signed in as {parent.name} · {state.child.name} has {balance(state.events)} ⭐
          </div>
        </div>
        <button className="btn btn-primary" onClick={onExit}>
          🔒 Done
        </button>
      </header>

      <div className="parent-layout">
        <nav className="parent-nav">
          {SECTIONS.map((s) => (
            <button key={s.id} className={'nav-item' + (section === s.id ? ' active' : '')} onClick={() => setSection(s.id)}>
              <span>{s.emoji}</span> {s.label}
            </button>
          ))}
        </nav>
        <main className="parent-main">
          {section === 'home' && <HomeSection parent={parent} today={today} />}
          {section === 'chores' && <ChoresSection today={today} />}
          {section === 'rewards' && <RewardsSection />}
          {section === 'routines' && <RoutinesSection />}
          {section === 'history' && <HistorySection parent={parent} today={today} />}
          {section === 'child' && <ChildSection />}
          {section === 'look' && <LookSection today={today} />}
          {section === 'parents' && <ParentsSection parent={parent} />}
          {section === 'backup' && <BackupSection />}
        </main>
      </div>
    </div>
  );
}
