import { useEffect, useState } from 'react';
import { toISODate } from './dates';

/** Today's date, refreshed when the day rolls over or the app comes back to the foreground. */
export function useToday(): string {
  const [today, setToday] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const check = () => setToday(toISODate(new Date()));
    const timer = window.setInterval(check, 30_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return today;
}
