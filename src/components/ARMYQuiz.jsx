import { useState, useEffect } from 'react'
import { Shield, CheckCircle, XCircle, Lock, RefreshCw, ChevronRight } from 'lucide-react'
import {
  QUIZ_QUESTIONS,
  PASS_THRESHOLD,
  MAX_ATTEMPTS,
  LOCKOUT_HOURS,
  LS_PASSED,
  LS_ATTEMPTS,
  LS_LOCKED_UNTIL,
} from '../lib/quizData'

export default function ARMYQuiz({ onPass }) {
  const [phase, setPhase] = useState('intro')
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [score, setScore] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS)

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
      const isCorrect = selected === QUIZ_QUESTIONS[current].correct
      const newAnswers = [...answers, isCorrect]
      setAnswers(newAnswers)
      setConfirmed(true)
    } else {
      if (current + 1 < QUIZ_QUESTIONS.length) {
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

  const bg = 'linear-gradient(135deg, #0d0118 0%, #1e0a3c 60%, #0d0118 100%)'
  const q = QUIZ_QUESTIONS[current]

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-purple-600/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Shield size={36} className="text-purple-400" />
          </div>
          <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">
            Access Verification
          </p>
          <h1
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            ARMY Clearance Test
          </h1>
          <p className="text-purple-200/60 text-sm leading-relaxed mb-2">
            This is a verified ARMY-only space. Prove your knowledge to gain access to the Armyrang Society.
          </p>
          <p className="text-purple-400/50 text-xs mb-8">
            {QUIZ_QUESTIONS.length} questions &nbsp;·&nbsp; {PASS_THRESHOLD}/{QUIZ_QUESTIONS.length} to pass &nbsp;·&nbsp; {MAX_ATTEMPTS} attempts
          </p>
          <div className="bg-purple-900/20 border border-purple-500/20 rounded-2xl p-4 mb-8 text-left">
            <p className="text-purple-200/70 text-sm leading-relaxed">
              💜 Only real ARMY know the answers. If you're here, you already know what this is about. 방탄소년단
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
            Come back in{' '}
            <span className="text-white font-bold">{hoursLeft}h</span> and study up 💜
          </p>
          <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4 text-left">
            <p className="text-red-200/60 text-sm leading-relaxed">
              Tip: Review BTS history — their debut, members, and music. True ARMY never forget. 방탄소년단 💜
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'pass') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: bg }}>
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-purple-600/20 border border-purple-400/40 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-purple-400" />
          </div>
          <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mb-3">
            Verified ARMY
          </p>
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
          >
            Welcome, ARMY 💜
          </h1>
          <p className="text-purple-200/70 mb-2">
            You scored{' '}
            <span className="text-white font-bold">
              {score}/{QUIZ_QUESTIONS.length}
            </span>
          </p>
          <p className="text-purple-300/50 text-sm mb-10">
            Access to the Armyrang Society has been granted.
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
          <p className="text-red-300/70 mb-2">
            You scored{' '}
            <span className="text-white font-bold">
              {score}/{QUIZ_QUESTIONS.length}
            </span>{' '}
            — need {PASS_THRESHOLD} to pass.
          </p>
          <p className="text-purple-300/50 text-sm mb-8">
            {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before 24h lockout.
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

  const isLastQuestion = current + 1 === QUIZ_QUESTIONS.length
  const btnLabel = !confirmed
    ? 'Confirm Answer'
    : isLastQuestion
    ? 'See Results'
    : 'Next Question →'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: bg }}
    >
      <div className="max-w-lg w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-purple-400/60 mb-2">
            <span>
              Question {current + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span>
              {PASS_THRESHOLD}/{QUIZ_QUESTIONS.length} to pass
            </span>
          </div>
          <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((current + (confirmed ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white/[0.04] border border-purple-500/20 rounded-3xl p-8 mb-4">
          <p className="text-purple-400/60 text-xs font-bold tracking-widest uppercase mb-5">
            💜 ARMY Knowledge Check
          </p>
          <h2 className="text-white text-xl font-semibold leading-snug mb-8">
            {q.question}
          </h2>
          <div className="space-y-3">
            {q.options.map((option, idx) => {
              let cls =
                'border-purple-500/20 bg-white/5 text-purple-100/70 hover:border-purple-400/50 hover:bg-purple-500/10'
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
                  className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all ${cls}`}
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
