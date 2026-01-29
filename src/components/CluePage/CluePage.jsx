import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { playSound } from '../../utils/sounds.js'
import './CluePage.css'

const CluePage = () => {
    const { categoryId, clueIndex } = useParams()
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [showAnswer, setShowAnswer] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem('jeopardyPlayers')
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Player 1', score: 0 },
            { id: 2, name: 'Player 2', score: 0 },
            { id: 3, name: 'Player 3', score: 0 }
        ]
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/jeopardy-data.json')
            const data = await response.json()
            setCategories(data.categories)
        }
        fetchData()
    }, [])

    const category = categories.find(cat => cat.id === parseInt(categoryId))
    const clue = category?.clues[parseInt(clueIndex)]
    const questionKey = `${categoryId}-${clueIndex}`
    const wrongAnswers = JSON.parse(localStorage.getItem('wrongAnswers') || '{}')
    const playersWhoAnsweredWrong = wrongAnswers[questionKey] || []

    const handleCorrect = () => {
        if (!selectedPlayer) return
        
        playSound('correct')
        setShowAnswer(true)
        
        const updatedPlayers = players.map(p => 
            p.id === selectedPlayer ? { ...p, score: p.score + clue.value } : p
        )
        setPlayers(updatedPlayers)
        localStorage.setItem('jeopardyPlayers', JSON.stringify(updatedPlayers))
        
        const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]')
        answeredQuestions.push(questionKey)
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions))
        
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }

    const handleIncorrect = () => {
        if (!selectedPlayer) return
        
        playSound('incorrect')
        
        const updatedPlayers = players.map(p => 
            p.id === selectedPlayer ? { ...p, score: p.score - clue.value } : p
        )
        setPlayers(updatedPlayers)
        localStorage.setItem('jeopardyPlayers', JSON.stringify(updatedPlayers))
        
        const newWrongAnswers = { ...wrongAnswers }
        if (!newWrongAnswers[questionKey]) {
            newWrongAnswers[questionKey] = []
        }
        newWrongAnswers[questionKey].push(selectedPlayer)
        localStorage.setItem('wrongAnswers', JSON.stringify(newWrongAnswers))
        
        // If all players answered wrong, disable the question
        if (newWrongAnswers[questionKey].length === 3) {
            const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]')
            answeredQuestions.push(questionKey)
            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions))
            navigate('/')
        } else {
            setSelectedPlayer(null)
        }
    }

    const availablePlayers = players.filter(p => !playersWhoAnsweredWrong.includes(p.id))

    if (!clue) return <div>Loading...</div>

    return (
        <div className="clue-page">
            <div className="player-scores">
                {players.map(player => (
                    <div key={player.id} className="player-score-small">
                        <span>{player.name}: ${player.score}</span>
                    </div>
                ))}
            </div>
            
            <div className="clue-content">
                <h2>{category.title}</h2>
                <div className="value">${clue.value}</div>
                <div className="question">{clue.question}</div>
                
                {!selectedPlayer ? (
                    <div className="player-selection">
                        <h3>Who is answering?</h3>
                        <div className="player-buttons">
                            {availablePlayers.map(player => (
                                <button 
                                    key={player.id} 
                                    className="player-btn" 
                                    onClick={() => setSelectedPlayer(player.id)}
                                >
                                    {player.name}
                                </button>
                            ))}
                        </div>
                        <button className="skip-btn" onClick={() => {
                            const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]')
                            answeredQuestions.push(questionKey)
                            localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions))
                            navigate('/')
                        }}>
                            Skip Question
                        </button>
                        {availablePlayers.length === 0 && (
                            <div className="no-players">
                                <p>All players have answered incorrectly</p>
                                <button className="show-answer-btn" onClick={() => setShowAnswer(true)}>
                                    Show Answer
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="answer-section">
                        <p className="selected-player">{players.find(p => p.id === selectedPlayer)?.name} is answering</p>
                        
                        {showAnswer && (
                            <div className="answer">{clue.answer}</div>
                        )}
                        
                        <div className="buttons">
                            <button className="correct-btn" onClick={handleCorrect}>
                                Correct (+${clue.value})
                            </button>
                            <button className="incorrect-btn" onClick={handleIncorrect}>
                                Incorrect (-${clue.value})
                            </button>
                            {!showAnswer && (
                                <button className="show-answer-btn" onClick={() => {
                                    playSound('reveal')
                                    setShowAnswer(true)
                                }}>
                                    Show Answer
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                <button className="back-btn" onClick={() => navigate('/')}>
                    Back to Board
                </button>
            </div>
        </div>
    )
}

export default CluePage