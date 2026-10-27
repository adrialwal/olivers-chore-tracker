// Used by the Geography and Flags themes for a "country of the day".
export interface Country {
  code: string; // ISO 3166-1 alpha-2, used to build the flag emoji
  name: string;
  capital: string;
  continent: string;
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', capital: 'Washington, D.C.', continent: 'North America' },
  { code: 'CA', name: 'Canada', capital: 'Ottawa', continent: 'North America' },
  { code: 'MX', name: 'Mexico', capital: 'Mexico City', continent: 'North America' },
  { code: 'JM', name: 'Jamaica', capital: 'Kingston', continent: 'North America' },
  { code: 'CU', name: 'Cuba', capital: 'Havana', continent: 'North America' },
  { code: 'CR', name: 'Costa Rica', capital: 'San José', continent: 'North America' },
  { code: 'PA', name: 'Panama', capital: 'Panama City', continent: 'North America' },
  { code: 'BR', name: 'Brazil', capital: 'Brasília', continent: 'South America' },
  { code: 'AR', name: 'Argentina', capital: 'Buenos Aires', continent: 'South America' },
  { code: 'CL', name: 'Chile', capital: 'Santiago', continent: 'South America' },
  { code: 'PE', name: 'Peru', capital: 'Lima', continent: 'South America' },
  { code: 'CO', name: 'Colombia', capital: 'Bogotá', continent: 'South America' },
  { code: 'GB', name: 'United Kingdom', capital: 'London', continent: 'Europe' },
  { code: 'IE', name: 'Ireland', capital: 'Dublin', continent: 'Europe' },
  { code: 'FR', name: 'France', capital: 'Paris', continent: 'Europe' },
  { code: 'DE', name: 'Germany', capital: 'Berlin', continent: 'Europe' },
  { code: 'IT', name: 'Italy', capital: 'Rome', continent: 'Europe' },
  { code: 'ES', name: 'Spain', capital: 'Madrid', continent: 'Europe' },
  { code: 'PT', name: 'Portugal', capital: 'Lisbon', continent: 'Europe' },
  { code: 'NL', name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe' },
  { code: 'BE', name: 'Belgium', capital: 'Brussels', continent: 'Europe' },
  { code: 'CH', name: 'Switzerland', capital: 'Bern', continent: 'Europe' },
  { code: 'AT', name: 'Austria', capital: 'Vienna', continent: 'Europe' },
  { code: 'SE', name: 'Sweden', capital: 'Stockholm', continent: 'Europe' },
  { code: 'NO', name: 'Norway', capital: 'Oslo', continent: 'Europe' },
  { code: 'FI', name: 'Finland', capital: 'Helsinki', continent: 'Europe' },
  { code: 'DK', name: 'Denmark', capital: 'Copenhagen', continent: 'Europe' },
  { code: 'IS', name: 'Iceland', capital: 'Reykjavík', continent: 'Europe' },
  { code: 'PL', name: 'Poland', capital: 'Warsaw', continent: 'Europe' },
  { code: 'GR', name: 'Greece', capital: 'Athens', continent: 'Europe' },
  { code: 'UA', name: 'Ukraine', capital: 'Kyiv', continent: 'Europe' },
  { code: 'EG', name: 'Egypt', capital: 'Cairo', continent: 'Africa' },
  { code: 'KE', name: 'Kenya', capital: 'Nairobi', continent: 'Africa' },
  { code: 'NG', name: 'Nigeria', capital: 'Abuja', continent: 'Africa' },
  { code: 'MA', name: 'Morocco', capital: 'Rabat', continent: 'Africa' },
  { code: 'ET', name: 'Ethiopia', capital: 'Addis Ababa', continent: 'Africa' },
  { code: 'GH', name: 'Ghana', capital: 'Accra', continent: 'Africa' },
  { code: 'TZ', name: 'Tanzania', capital: 'Dodoma', continent: 'Africa' },
  { code: 'IN', name: 'India', capital: 'New Delhi', continent: 'Asia' },
  { code: 'CN', name: 'China', capital: 'Beijing', continent: 'Asia' },
  { code: 'JP', name: 'Japan', capital: 'Tokyo', continent: 'Asia' },
  { code: 'KR', name: 'South Korea', capital: 'Seoul', continent: 'Asia' },
  { code: 'TH', name: 'Thailand', capital: 'Bangkok', continent: 'Asia' },
  { code: 'VN', name: 'Vietnam', capital: 'Hanoi', continent: 'Asia' },
  { code: 'PH', name: 'Philippines', capital: 'Manila', continent: 'Asia' },
  { code: 'NP', name: 'Nepal', capital: 'Kathmandu', continent: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', capital: 'Abu Dhabi', continent: 'Asia' },
  { code: 'AU', name: 'Australia', capital: 'Canberra', continent: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', capital: 'Wellington', continent: 'Oceania' },
  { code: 'FJ', name: 'Fiji', capital: 'Suva', continent: 'Oceania' },
];

export function flagEmoji(code: string): string {
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Same country all day, a different one each day. */
export function countryOfTheDay(date: Date): Country {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  return COUNTRIES[dayNumber % COUNTRIES.length];
}
