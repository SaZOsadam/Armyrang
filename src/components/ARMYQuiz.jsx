import { useState, useEffect, useMemo } from 'react'
import { Shield, CheckCircle, XCircle, Lock, RefreshCw, ChevronRight } from 'lucide-react'
import {
  PASS_THRESHOLD,
  QUESTIONS_PER_SESSION,
  MAX_ATTEMPTS,
  LOCKOUT_HOURS,
  LS_PASSED,
  LS_ATTEMPTS,
  LS_LOCKED_UNTIL,
  LEVEL_CONFIG,
  getRandomQuestions,
  getCurrentLevel,
  advanceLevel,
} from '../lib/quizData'

const LEVEL_TIPS = {
  1: 'Review BTS fan culture — BT21 characters, members\' pets, and their reality shows. Real ARMY know. 방탄소년단 💜',
  2: 'Dig into the albums, mixtapes, and tour history. Watch Bon Voyage and the HYYH era content. 방탄소년단 💜',
  3: 'Go back to the roots — Rookie King, Bangtan Blog, 2013 debuts. OG ARMY remember everything. 방탄소년단 💜',
}

export default function ARMYQuiz({ onPass }) {
  const level = getCurrentLevel()
  const cfg = LEVEL_CONFIG[level]

  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)

  const questions = useMemo(() => getRandomQuestions(level), [level])

  useEffect(() => {
    const locked = localStorage.getItem(LS_LOCKED_UNTIL)
    const attempts = parseInt(localStorage.getItem(LS_ATTEMPTS) || '0')
    setAttemptsLeft(MAX_ATTEMPTS - attempts)
    if (locked) {
      const lockTime = parseInt(locked)
      if (Date.now() < lockTime) {
        setLockedUntil(lockTime)
        setPhase('locked')
      } else {
        localStorage.removeItem(LS_LOCKED_UNTIL)
        localStorage.removeItem(LS_ATTEMPTS)
        setAttemptsLeft(MAX_ATTEMPTS)
      }
    }
  }, [])

  function startQuiz() {
    setCurrent(0)
    setSelected(null)
    setConfirmed(false)
    setAnswers([])
    setScore(0)
    setPhase('quiz')
  }

  function handleAction() {
    if (!confirmed) {
      if (selected === null) return
      const isCorrect = selected === questions[current].correct
      setAnswers((prev) => [...prev, isCorrect])
      setConfirmed(true)
    } else {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1)
        setSelected(null)
        setConfirmed(false)
      } else {
        const finalScore = answers.filter(Boolean).length
        setScore(finalScore)
        if (finalScore >= PASS_THRESHOLD) {
          localStorage.setItem(LS_PASSED, 'true')
          localStorage.removeItem(LS_ATTEMPTS)
          localStorage.removeItem(LS_LOCKED_UNTIL)
          advanceLevel()
          setPhase('pass')
        } else {
          const newAttempts = parseInt(localStorage.getItem(LS_ATTEMPTS) || '0') + 1
          localStorage.setItem(LS_ATTEMPTS, newAttempts.toString())
          const remaining = MAX_ATTEMPTS - newAttempts
          setAttemptsLeft(remaining)
          if (remaining <= 0) {
            const lockUntil = Date.now() + LOCKOUT_HOURS * 60 * 60 * 1000
            localStorage.setItem(LS_LOCKED_UNTIL, lockUntil.toString())
            setLockedUntil(lockUntil)
            setPhase('locked')
          } else {
            setPhase('fail')
          }
        }
      }
    }
  }

  const bg = 'linear-gradient(135deg, #050010 0%, #0d0118 40%, #1a0533 100%)'
  const q = questions[current]

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto" style={{ background: bg }}>
        <div className="max-w-md w-full text-center py-8">
          <div className="w-20 h-20 bg-purple-600/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield size={36} className="text-purple-400" />
          </div>

          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-widest uppercase">
            {cfg.badge} · {cfg.label}
          </div>

          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            ARMY Clearance Test
          </h1>
          <p className="text-purple-200/50 text-sm mb-1">{cfg.sublabel}</p>
          <p className="text-purple-400/40 text-xs mb-8">
            {QUESTIONS_PER_SESSION} random questions &nbsp;·&nbsp; {PASS_THRESHOLD}/{QUESTIONS_PER_SESSION} to pass &nbsp;·&nbsp; {MAX_ATTEMPTS} attempts
          </p>

          {level > 1 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-4 text-left">
              <p className="text-orange-200/80 text-sm leading-relaxed">
                ⚡ You're back. The questions get harder every time — these are <strong className="text-orange-200">{cfg.label}</strong> level. New random set every session.
              </p>
            </div>
          )}

          <div className="bg-purple-900/20 border border-purple-500/20 rounded-2xl p-4 mb-8 text-left">
            <p className="text-purple-200/70 text-sm leading-relaxed">
              💜 Only verified ARMY get through. No guessing your way in — these questions separate the stans from the superfans. 방탄소년단
            </p>
          </div>

          <button
            onClick={startQuiz}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-purple-500/20 active:scale-[0.98]"
          >
            Begin Verification
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'locked') {
    const hoursLeft = lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 3600000) : LOCKOUT_HOURS
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-600/20 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-red-400" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Access Denied
          </h1>
          <p className="text-red-300/70 mb-2">You've used all your attempts.</p>
          <p className="text-purple-200/50 text-sm mb-8">
            Come back in <span className="text-white font-bold">{hoursLeft}h</span> and do your research 💜
          </p>
          <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4 text-left">
            <p className="text-red-200/60 text-sm leading-relaxed">
              Study tip: {LEVEL_TIPS[level]}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'pass') {
    const nextLevel = Math.min(level + 1, 3)
    const nextCfg = LEVEL_CONFIG[nextLevel]
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-purple-600/20 border border-purple-400/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-purple-400" />
          </div>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold px-4 py-2 rounded-full mb-5 tracking-widest uppercase">
            {cfg.badge} Cleared
          </div>
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Welcome, ARMY 💜
          </h1>
          <p className="text-purple-200/70 mb-1">
            You scored <span className="text-white font-bold">{score}/{QUESTIONS_PER_SESSION}</span>
          </p>
          {nextLevel > level && (
            <p className="text-purple-400/60 text-xs mb-2">
              Next time you return: <span className="text-purple-300 font-semibold">{nextCfg.badge} — {nextCfg.label}</span> questions await.
            </p>
          )}
          {nextLevel === level && (
            <p className="text-purple-400/60 text-xs mb-2">
              You've reached the highest level. OG ARMY status confirmed. 👑
            </p>
          )}
          <p className="text-purple-300/40 text-xs mb-10">
            Questions are randomised every session — no two quizzes are the same.
          </p>
          <button
            onClick={onPass}
            className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-xl hover:shadow-purple-500/20 active:scale-[0.98]"
          >
            Enter the Society <ChevronRight size={20} />
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'fail') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-600/20 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <XCircle size={36} className="text-red-400" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Not Quite, ARMY
          </h1>
          <p className="text-red-300/70 mb-1">
            You scored <span className="text-white font-bold">{score}/{QUESTIONS_PER_SESSION}</span> — need {PASS_THRESHOLD} to pass.
          </p>
          <p className="text-purple-300/50 text-sm mb-2">
            {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before 24h lockout.
          </p>
          <p className="text-purple-400/40 text-xs mb-8">
            New random questions on your next try — study up 💜
          </p>
          <button
            onClick={startQuiz}
            className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-xl active:scale-[0.98]"
          >
            <RefreshCw size={18} /> Try Again
          </button>
        </div>
      </div>
    )
  }

  const isLastQuestion = current + 1 === questions.length
  const btnLabel = !confirmed ? 'Confirm Answer' : isLastQuestion ? 'See Results' : 'Next Question →'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
      <div className="max-w-lg w-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-400/60 tracking-widest uppercase">
              {cfg.badge} · {cfg.label}
            </span>
            <span className="text-xs text-purple-400/60">
              {current + 1} / {questions.length} &nbsp;·&nbsp; need {PASS_THRESHOLD} correct
            </span>
          </div>
          <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((current + (confirmed ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white/[0.04] border border-purple-500/20 rounded-3xl p-7 mb-4">
          <h2 className="text-white text-lg font-semibold leading-snug mb-7">
            {q.question}
          </h2>
          <div className="space-y-2.5">
            {q.options.map((option, idx) => {
              let cls = 'border-purple-500/20 bg-white/5 text-purple-100/70 hover:border-purple-400/50 hover:bg-purple-500/10'
              if (!confirmed && selected === idx)
                cls = 'border-purple-500 bg-purple-500/20 text-white'
              if (confirmed && idx === q.correct)
                cls = 'border-green-500 bg-green-500/20 text-green-300'
              if (confirmed && selected === idx && idx !== q.correct)
                cls = 'border-red-500 bg-red-500/20 text-red-300'

              return (
                <button
                  key={idx}
                  onClick={() => !confirmed && setSelected(idx)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all ${cls}`}
                >
                  <span className="opacity-40 mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleAction}
          disabled={selected === null && !confirmed}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-base transition-all hover:shadow-xl hover:shadow-purple-500/20 active:scale-[0.98]"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}
