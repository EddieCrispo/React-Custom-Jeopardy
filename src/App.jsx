import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Board from './components/Board/Board.jsx'
import CluePage from './components/CluePage/CluePage.jsx'

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/clue/:categoryId/:clueIndex" element={<CluePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
