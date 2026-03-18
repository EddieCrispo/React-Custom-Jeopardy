import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Board from './components/Board/Board.jsx'
import CluePage from './components/CluePage/CluePage.jsx'
import { GameProvider } from './context/GameContext.jsx'

const App = () => {
  return (
    <div className='App'>
      <GameProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/clue/:categoryId/:clueIndex" element={<CluePage />} />
          </Routes>
        </Router>
      </GameProvider>
    </div>
  )
}

export default App

