import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './routes/LoginPage'
import HomePage from './routes/HomePage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='home' element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
