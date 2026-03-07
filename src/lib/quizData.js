export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'When did BTS officially debut?',
    options: ['June 13, 2013', 'August 8, 2012', 'March 15, 2014', 'December 1, 2013'],
    correct: 0,
  },
  {
    id: 2,
    question: 'What does "BTS" originally stand for in Korean?',
    options: ['Beyond The Scene', 'Bangtan Sonyeondan', 'Born To Shine', 'Bulletproof Synergy'],
    correct: 1,
  },
  {
    id: 3,
    question: 'Who is the leader of BTS?',
    options: ['Jin', 'Suga', 'RM', 'J-Hope'],
    correct: 2,
  },
  {
    id: 4,
    question: 'V coined "Borahae (보라해)" — what does it mean?',
    options: ['I miss you', 'I love you forever', 'I purple you', 'You are my universe'],
    correct: 2,
  },
  {
    id: 5,
    question: 'Which member is nicknamed the "Golden Maknae"?',
    options: ['Jimin', 'V', 'Jin', 'Jungkook'],
    correct: 3,
  },
  {
    id: 6,
    question: "What was BTS's first Billboard Hot 100 number-one single?",
    options: ['Boy With Luv', 'DNA', 'Dynamite', 'Fake Love'],
    correct: 2,
  },
  {
    id: 7,
    question: 'How many members are in BTS?',
    options: ['5', '6', '7', '9'],
    correct: 2,
  },
  {
    id: 8,
    question: 'Which BTS member releases solo music under the name "Agust D"?',
    options: ['Jin', 'Suga', 'J-Hope', 'RM'],
    correct: 1,
  },
]

export const PASS_THRESHOLD = 6
export const MAX_ATTEMPTS = 3
export const LOCKOUT_HOURS = 24

export const LS_PASSED = 'armyrang_quiz_passed'
export const LS_ATTEMPTS = 'armyrang_quiz_attempts'
export const LS_LOCKED_UNTIL = 'armyrang_quiz_locked_until'

export function checkQuizPassed() {
  return localStorage.getItem(LS_PASSED) === 'true'
}
