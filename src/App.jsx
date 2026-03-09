import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AuthPage from './pages/AuthPage'
import PredictionsPage from './pages/PredictionsPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ARIRANGPage from './pages/ARIRANGPage'
import NewsPage from './pages/NewsPage'
import TourPage from './pages/TourPage'
import ARMYQuiz from './components/ARMYQuiz'
import { checkQuizPassed } from './lib/quizData'

export default function App() {
  const [quizPassed, setQuizPassed] = useState(checkQuizPassed)

  if (!quizPassed) {
    return <ARMYQuiz onPass={() => setQuizPassed(true)} />
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/predictions" element={<PredictionsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/arirang" element={<ARIRANGPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/tour" element={<TourPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
