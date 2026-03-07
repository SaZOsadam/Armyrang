export const PASS_THRESHOLD = 6
export const QUESTIONS_PER_SESSION = 8
export const MAX_ATTEMPTS = 3
export const LOCKOUT_HOURS = 24

export const LS_PASSED = 'armyrang_quiz_passed'
export const LS_ATTEMPTS = 'armyrang_quiz_attempts'
export const LS_LOCKED_UNTIL = 'armyrang_quiz_locked_until'
export const LS_LEVEL = 'armyrang_quiz_level'

export const LEVEL_CONFIG = {
  1: {
    label: 'Real ARMY',
    sublabel: 'Fan culture, BT21 & member knowledge',
    color: 'from-indigo-900 to-purple-900',
    badge: '💜 Level 1',
  },
  2: {
    label: 'Deep ARMY',
    sublabel: 'Album lore, BTS Universe & mixtapes',
    color: 'from-purple-900 to-violet-900',
    badge: '🔥 Level 2',
  },
  3: {
    label: 'OG ARMY',
    sublabel: 'Debut era, inside jokes & classic content',
    color: 'from-violet-900 to-fuchsia-900',
    badge: '👑 Level 3',
  },
}

export const QUESTIONS_BY_LEVEL = {
  1: [
    {
      id: 'l1q1',
      question: 'What does the "ARMY" fandom name stand for?',
      options: [
        'Adorable Representative MC of Youth',
        'Always Ready for More Youth',
        'Awesome Royals Making Yell',
        'All Rounder Music Youth',
      ],
      correct: 0,
    },
    {
      id: 'l1q2',
      question: 'Which BT21 character represents RM?',
      options: ['Cooky', 'Koya', 'Shooky', 'Mang'],
      correct: 1,
    },
    {
      id: 'l1q3',
      question: "What is the name of V's Pomeranian dog?",
      options: ['Gureum', 'Holly', 'Yeontan', 'Mickey'],
      correct: 2,
    },
    {
      id: 'l1q4',
      question: "What breed is Suga's beloved dog Holly?",
      options: ['Pomeranian', 'Toy Poodle', 'Shih Tzu', 'Maltese'],
      correct: 1,
    },
    {
      id: 'l1q5',
      question: 'Both Jimin and Jungkook are originally from which South Korean city?',
      options: ['Seoul', 'Daegu', 'Incheon', 'Busan'],
      correct: 3,
    },
    {
      id: 'l1q6',
      question: "What is Jin's famous self-declared title that became a global fan meme?",
      options: [
        'Most Handsome King',
        'Worldwide Handsome',
        'International Star',
        'Global Prince',
      ],
      correct: 1,
    },
    {
      id: 'l1q7',
      question: 'Which BTS travel reality show features the members exploring international cities together?',
      options: ['Run BTS', 'In the Soop', 'Bon Voyage', 'BTS Road Trip'],
      correct: 2,
    },
    {
      id: 'l1q8',
      question: 'Which member is known for their "4D personality" — quirky, unpredictable, and iconic in early fan content?',
      options: ['Jungkook', 'Suga', 'V', 'J-Hope'],
      correct: 2,
    },
    {
      id: 'l1q9',
      question: 'What is the name of BTS\'s cozy nature retreat show where members cook, fish, and unwind?',
      options: ['Bon Voyage', 'In the Soop', 'BTS Camping', 'Rest with BTS'],
      correct: 1,
    },
    {
      id: 'l1q10',
      question: 'Who is the eldest member of BTS?',
      options: ['RM', 'Suga', 'Jin', 'J-Hope'],
      correct: 2,
    },
    {
      id: 'l1q11',
      question: "What was J-Hope's debut solo mixtape called?",
      options: ['Shade of Hope', 'Hope World', "J-Hope's World", 'Future Hope'],
      correct: 1,
    },
    {
      id: 'l1q12',
      question: 'What fan nickname is Jungkook widely known by, inspired by his bright smile and front teeth?',
      options: ['Kookie', 'JK', 'Bunny 🐰', 'Googie'],
      correct: 2,
    },
  ],

  2: [
    {
      id: 'l2q1',
      question: 'Which BTS album was the first predominantly non-English album to reach #1 on the US Billboard 200?',
      options: ['Wings', 'Love Yourself: Her', 'Love Yourself: Tear', 'Map of the Soul: 7'],
      correct: 2,
    },
    {
      id: 'l2q2',
      question: 'The entire WINGS album concept was inspired by which literary classic?',
      options: [
        'The Little Prince by Antoine de Saint-Exupéry',
        'Demian by Hermann Hesse',
        'Thus Spoke Zarathustra by Nietzsche',
        'Siddhartha by Hermann Hesse',
      ],
      correct: 1,
    },
    {
      id: 'l2q3',
      question: "What was the name of BTS's very first world tour (2014–2015)?",
      options: ['Fire Tour', 'The Red Bullet', 'Burn the Stage', 'Live Trilogy'],
      correct: 1,
    },
    {
      id: 'l2q4',
      question: 'What does the Korean phrase "화양연화" (HYYH) translate to in English?',
      options: [
        'Beautiful Youth',
        'Flowers of a Generation',
        'The Most Beautiful Moment in Life',
        'Time of Your Life',
      ],
      correct: 2,
    },
    {
      id: 'l2q5',
      question: "Before BTS debuted, RM was known in Seoul's underground rap scene under what name?",
      options: ['Rap Monster (underground)', 'Runch Randa', 'Seoul Child', 'Dark Namjoon'],
      correct: 1,
    },
    {
      id: 'l2q6',
      question: 'Suga dropped the Agust D mixtape with zero announcement or promotion. What year was this?',
      options: ['2014', '2015', '2016', '2017'],
      correct: 2,
    },
    {
      id: 'l2q7',
      question: '"Agust D" — where does the name come from?',
      options: [
        "It's his real name reversed",
        'An anagram of "DT Suga" — referencing Daegu Town (his hometown)',
        "His mother's initials + D for debut",
        'A term from Korean classical poetry',
      ],
      correct: 1,
    },
    {
      id: 'l2q8',
      question: 'The rap sub-unit of BTS (RM + Suga + J-Hope) is collectively known as?',
      options: ['Bangtan Rap Division', 'Rap Line', 'BTS Hip Hop Unit', 'Bulletproof Rappers'],
      correct: 1,
    },
    {
      id: 'l2q9',
      question: "Which 2022 BTS anthology album signalled their transition toward solo careers?",
      options: ['Map of the Soul', 'BE', 'Proof', 'Butter'],
      correct: 2,
    },
    {
      id: 'l2q10',
      question: "At BTS's FESTA 2022 anniversary dinner, what emotional announcement did the members make?",
      options: [
        'A new world tour announcement',
        'A temporary hiatus to focus on solo work',
        'Renewed HYBE contracts',
        'A surprise collab album',
      ],
      correct: 1,
    },
    {
      id: 'l2q11',
      question: '"Map of the Soul: 7" draws heavily from Carl Jung. Which three Jungian concepts does the album explore?',
      options: [
        'Id, Ego, and Superego',
        'Persona, Shadow, and Ego',
        'Anima, Shadow, and Self',
        'Persona, Mask, and True Self',
      ],
      correct: 1,
    },
    {
      id: 'l2q12',
      question: "J-Hope was a street dancer before Big Hit. What style was he trained in as a child?",
      options: [
        'Contemporary ballet',
        'Popping and b-boying',
        'Traditional Korean dance (한국무용)',
        'Jazz and tap',
      ],
      correct: 1,
    },
  ],

  3: [
    {
      id: 'l3q1',
      question: "What was the title of BTS's very first debut single album (June 2013)?",
      options: ['O!RUL8,2?', '2 Cool 4 Skool', 'Skool Luv Affair', 'Dark & Wild'],
      correct: 1,
    },
    {
      id: 'l3q2',
      question: 'Their second EP\'s title "O!RUL8,2?" (2013) is a play on words. What does it mean?',
      options: [
        '"Oh! Are You Late, Too?"',
        '"Or You Late, To?"',
        '"Oh! Rule Eight, Too?"',
        '"Oh! Real Like, Two?"',
      ],
      correct: 0,
    },
    {
      id: 'l3q3',
      question: 'On their first anniversary (June 13, 2014), BTS released a free track as a tribute to J. Cole. What did they rename the cover?',
      options: ['Born Idol', 'Born Bulletproof', 'Born Singer', 'Born ARMY'],
      correct: 2,
    },
    {
      id: 'l3q4',
      question: 'Before official platforms, what did BTS use to communicate their trainee diaries and early life to fans?',
      options: ['Twitter threads', 'Instagram stories', 'A Naver Blog called "Bangtan Blog"', 'Fan café posts only'],
      correct: 2,
    },
    {
      id: 'l3q5',
      question: 'When V explained "Borahae (I purple you)," what specific meaning did he give to the color purple?',
      options: [
        '"Purple is my favourite colour so I give it to you"',
        '"Purple means forever in Korean culture"',
        '"Purple is the last colour of the rainbow — I\'ll trust and love you for a long, long time"',
        '"I turned purple from all the love I have for you"',
      ],
      correct: 2,
    },
    {
      id: 'l3q6',
      question: "BTS's very first music show win in 2015 was on Music Bank. Which song earned them that historic first win?",
      options: ['Blood Sweat & Tears', 'I Need U', 'Danger', 'Run'],
      correct: 1,
    },
    {
      id: 'l3q7',
      question: 'What was the name of BTS\'s 2013 TV variety show — considered essential "classic BTS" viewing — where they pranked each other and played games?',
      options: ['Run BTS', 'Rookie King: Channel Bangtan', 'Bangtan Chronicles', 'BTS Early Days'],
      correct: 1,
    },
    {
      id: 'l3q8',
      question: '"Jimin, you got no jams" is one of the most iconic ARMY inside jokes. Who said it, and to whom?',
      options: [
        'Suga said it to Jimin',
        'J-Hope said it to Jimin',
        'RM said it to Jimin',
        'Jin said it to Jimin',
      ],
      correct: 2,
    },
    {
      id: 'l3q9',
      question: 'Which BTS debut-era track directly addressed South Korea\'s education system and the pressure on students to study instead of dream?',
      options: ['No More Dream', 'N.O', 'Danger', 'Boy In Luv'],
      correct: 1,
    },
    {
      id: 'l3q10',
      question: "Jin's solo intro track 'Epiphany' (Love Yourself: Answer) is considered his defining solo moment. What is its central message?",
      options: [
        'A love letter to ARMY',
        'Heartbreak and loss',
        'Loving yourself and being your own hero',
        'Missing his members during tour',
      ],
      correct: 2,
    },
    {
      id: 'l3q11',
      question: "BTS's 2018 YouTube documentary series following their world tour was later expanded into a cinema film. What was it called?",
      options: [
        'Bring the Soul: The Movie',
        'Burn the Stage: The Movie',
        'Love Yourself in Seoul',
        'BTS World Tour: The Film',
      ],
      correct: 1,
    },
    {
      id: 'l3q12',
      question: 'The platform "Bubble" (formerly called something else) is where BTS sends personal messages to fans. What is unique about it compared to Weverse?',
      options: [
        'It\'s free for all ARMY',
        'It\'s a paid subscription for private 1-on-1 style message feeds from each member',
        'It only shows official announcements',
        'It replaced VLIVE entirely',
      ],
      correct: 1,
    },
  ],
}

export function getRandomQuestions(level) {
  const pool = QUESTIONS_BY_LEVEL[level] || QUESTIONS_BY_LEVEL[1]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, QUESTIONS_PER_SESSION)
}

export function getCurrentLevel() {
  return parseInt(localStorage.getItem(LS_LEVEL) || '1')
}

export function advanceLevel() {
  const current = getCurrentLevel()
  if (current < 3) localStorage.setItem(LS_LEVEL, (current + 1).toString())
}

export function checkQuizPassed() {
  return localStorage.getItem(LS_PASSED) === 'true'
}

export function resetQuizForLogout() {
  localStorage.removeItem(LS_PASSED)
  localStorage.removeItem(LS_ATTEMPTS)
  localStorage.removeItem(LS_LOCKED_UNTIL)
}
