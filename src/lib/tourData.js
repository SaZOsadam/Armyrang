export const TOUR_INFO = {
  name: 'BTS WORLD TOUR: ARIRANG',
  album: 'ARIRANG',
  total_shows: 79,
  total_cities: 34,
  total_continents: 5,
  start_date: '2026-04-11',
  end_date: '2027-03-28',
  stage: '360° In-The-Round',
  tagline: 'The largest tour by any South Korean artist. All 7. 34 cities. 79 nights.',
  website: 'https://btsworldtourofficial.com/',
}

export const CONTINENTS = ['All', 'Asia', 'North America', 'Europe', 'South America', 'Oceania']

export const TOUR_DATES = [
  // ─── ASIA ───────────────────────────────────────────────────────────────────
  {
    id: 't01', continent: 'Asia', city: 'Seoul', country: 'South Korea',
    venue: 'Seoul World Cup Stadium', dates: ['2026-04-11', '2026-04-12', '2026-04-18', '2026-04-19'],
    notes: 'Home shows — Opening Night',
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [true, true, false, false],
  },
  {
    id: 't02', continent: 'Asia', city: 'Tokyo', country: 'Japan',
    venue: 'Japan National Stadium', dates: ['2026-05-02', '2026-05-03', '2026-05-09', '2026-05-10'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [true, true, true, false],
  },
  {
    id: 't03', continent: 'Asia', city: 'Osaka', country: 'Japan',
    venue: 'Kyocera Dome Osaka', dates: ['2026-05-16', '2026-05-17'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [true, false],
  },
  {
    id: 't04', continent: 'Asia', city: 'Bangkok', country: 'Thailand',
    venue: 'Rajamangala National Stadium', dates: ['2026-05-23', '2026-05-24'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't05', continent: 'Asia', city: 'Singapore', country: 'Singapore',
    venue: 'National Stadium', dates: ['2026-05-30', '2026-05-31'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't06', continent: 'Asia', city: 'Manila', country: 'Philippines',
    venue: 'Philippine Arena', dates: ['2026-06-06', '2026-06-07'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't07', continent: 'Asia', city: 'Jakarta', country: 'Indonesia',
    venue: 'Gelora Bung Karno Stadium', dates: ['2026-06-13', '2026-06-14'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't08', continent: 'Asia', city: 'Hong Kong', country: 'Hong Kong',
    venue: 'Hong Kong Stadium', dates: ['2026-06-20', '2026-06-21'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't09', continent: 'Asia', city: 'Taipei', country: 'Taiwan',
    venue: 'Taipei Arena', dates: ['2026-06-27', '2026-06-28'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },

  // ─── NORTH AMERICA ──────────────────────────────────────────────────────────
  {
    id: 't10', continent: 'North America', city: 'New York', country: 'USA',
    venue: 'MetLife Stadium', dates: ['2026-07-25', '2026-07-26', '2026-08-01', '2026-08-02'],
    notes: 'East Coast Opening',
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [true, true, false, false],
  },
  {
    id: 't11', continent: 'North America', city: 'Chicago', country: 'USA',
    venue: 'Soldier Field', dates: ['2026-08-08', '2026-08-09'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't12', continent: 'North America', city: 'Toronto', country: 'Canada',
    venue: 'Rogers Centre', dates: ['2026-08-15', '2026-08-16'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't13', continent: 'North America', city: 'Houston', country: 'USA',
    venue: 'NRG Stadium', dates: ['2026-08-22', '2026-08-23'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't14', continent: 'North America', city: 'Los Angeles', country: 'USA',
    venue: 'SoFi Stadium', dates: ['2026-09-05', '2026-09-06', '2026-09-12', '2026-09-13'],
    notes: 'West Coast run',
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false, false, false],
  },
  {
    id: 't15', continent: 'North America', city: 'Mexico City', country: 'Mexico',
    venue: 'Estadio GNP Seguros', dates: ['2026-09-19', '2026-09-20'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },

  // ─── EUROPE ─────────────────────────────────────────────────────────────────
  {
    id: 't16', continent: 'Europe', city: 'London', country: 'UK',
    venue: 'Wembley Stadium', dates: ['2026-10-10', '2026-10-11', '2026-10-17', '2026-10-18'],
    notes: 'Europe Opening — Wembley',
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false, false, false],
  },
  {
    id: 't17', continent: 'Europe', city: 'Paris', country: 'France',
    venue: 'Stade de France', dates: ['2026-10-24', '2026-10-25'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't18', continent: 'Europe', city: 'Amsterdam', country: 'Netherlands',
    venue: 'Johan Cruijff ArenA', dates: ['2026-10-31', '2026-11-01'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't19', continent: 'Europe', city: 'Berlin', country: 'Germany',
    venue: 'Olympiastadion Berlin', dates: ['2026-11-07', '2026-11-08'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't20', continent: 'Europe', city: 'Madrid', country: 'Spain',
    venue: 'Estadio Metropolitano', dates: ['2026-11-14', '2026-11-15'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't21', continent: 'Europe', city: 'Milan', country: 'Italy',
    venue: 'San Siro', dates: ['2026-11-21', '2026-11-22'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't22', continent: 'Europe', city: 'Stockholm', country: 'Sweden',
    venue: 'Friends Arena', dates: ['2026-11-28'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false],
  },
  {
    id: 't23', continent: 'Europe', city: 'Warsaw', country: 'Poland',
    venue: 'PGE Narodowy', dates: ['2026-12-05', '2026-12-06'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },

  // ─── SOUTH AMERICA ──────────────────────────────────────────────────────────
  {
    id: 't24', continent: 'South America', city: 'São Paulo', country: 'Brazil',
    venue: 'Estádio do Morumbi', dates: ['2027-01-10', '2027-01-11', '2027-01-17'],
    notes: 'South America Opening',
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false, false],
  },
  {
    id: 't25', continent: 'South America', city: 'Buenos Aires', country: 'Argentina',
    venue: 'Estadio Monumental', dates: ['2027-01-24', '2027-01-25'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't26', continent: 'South America', city: 'Santiago', country: 'Chile',
    venue: 'Estadio Nacional', dates: ['2027-02-01', '2027-02-02'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't27', continent: 'South America', city: 'Bogotá', country: 'Colombia',
    venue: 'Estadio El Campín', dates: ['2027-02-08'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false],
  },

  // ─── OCEANIA ────────────────────────────────────────────────────────────────
  {
    id: 't28', continent: 'Oceania', city: 'Sydney', country: 'Australia',
    venue: 'Accor Stadium', dates: ['2027-02-27', '2027-02-28', '2027-03-06'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false, false],
  },
  {
    id: 't29', continent: 'Oceania', city: 'Melbourne', country: 'Australia',
    venue: 'Marvel Stadium', dates: ['2027-03-13', '2027-03-14'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
  {
    id: 't30', continent: 'Oceania', city: 'Auckland', country: 'New Zealand',
    venue: 'Eden Park', dates: ['2027-03-21', '2027-03-22'],
    notes: null,
    ticket_url: 'https://btsworldtourofficial.com/',
    sold_out: [false, false],
  },
]

export const CONTINENT_META = {
  Asia: { emoji: '🌏', shows: 25, cities: 9, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  'North America': { emoji: '🌎', shows: 18, cities: 6, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  Europe: { emoji: '🌍', shows: 18, cities: 8, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  'South America': { emoji: '🌎', shows: 8, cities: 4, color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  Oceania: { emoji: '🌏', shows: 7, cities: 3, color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
}

export function formatTourDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function getTourStatus(dateStr) {
  const diff = new Date(dateStr) - new Date()
  if (diff < 0) return 'passed'
  if (diff < 7 * 86400000) return 'this_week'
  if (diff < 30 * 86400000) return 'this_month'
  return 'upcoming'
}
