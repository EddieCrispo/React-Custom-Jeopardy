import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { playSound } from '../../utils/sounds.js'
import { useGameContext } from '../../context/GameContext.jsx'
import './CluePage.css'

const CluePage = () => {
    const { categoryId, clueIndex } = useParams()
    const navigate = useNavigate()
    const { 
        categories, 
        players, 
        wrongAnswers, 
        markCorrect, 
        markIncorrect, 
        skipClue 
    } = useGameContext()
    
    const [showAnswer, setShowAnswer] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState(null)
    const stopTimerRef = useRef(null)

    // Helper to find category and clue
    const category = categories.find(cat => cat.id === parseInt(categoryId))
    const clue = category?.clues[parseInt(clueIndex)]
    const questionKey = `${categoryId}-${clueIndex}`
    const playersWhoAnsweredWrong = wrongAnswers[questionKey] || []
    const availablePlayers = players.filter(p => !playersWhoAnsweredWrong.includes(p.id))

    const handleCorrect = () => {
        if (!selectedPlayer) return
        markCorrect(selectedPlayer, questionKey, clue.value)
        setShowAnswer(true)
        setTimeout(() => {
            navigate('/')
        }, 2000)
    }

    const handleIncorrect = () => {
        if (!selectedPlayer) return
        const exhausted = markIncorrect(selectedPlayer, questionKey, clue.value)
        if (exhausted) {
            navigate('/')
        } else {
            setSelectedPlayer(null)
            if (!stopTimerRef.current && !showAnswer) {
                stopTimerRef.current = playSound('timer')
            }
        }
    }

    const handleSkip = () => {
        skipClue(questionKey)
        navigate('/')
    }

    const handleReveal = () => {
        if (!showAnswer) {
            playSound('reveal')
            setShowAnswer(true)
            
            // Mark the question as answered/skipped so it's greyed out on the board
            skipClue(questionKey)
            
            // Auto-navigate back after a delay
            setTimeout(() => {
                navigate('/')
            }, 3000) // 3 seconds to let everyone read the answer
        }
    }

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Player selection: 1, 2, 3...
            if (!selectedPlayer && !showAnswer) {
                const playerIndex = parseInt(e.key) - 1
                if (playerIndex >= 0 && playerIndex < players.length) {
                    const player = players[playerIndex]
                    if (!playersWhoAnsweredWrong.includes(player.id)) {
                        setSelectedPlayer(player.id)
                    }
                }
            }

            // Scoring and Reveal: Space and Backspace
            if (e.code === 'Space') {
                e.preventDefault()
                if (selectedPlayer) {
                    handleCorrect()
                } else {
                    handleReveal()
                }
            }

            if (e.code === 'Backspace' && selectedPlayer) {
                e.preventDefault()
                handleIncorrect()
            }

            // Navigation: Escape or 'B'
            if (e.code === 'Escape' || e.key.toLowerCase() === 'b') {
                navigate('/')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedPlayer, showAnswer, players, playersWhoAnsweredWrong])

    useEffect(() => {
        stopTimerRef.current = playSound('timer')
        return () => {
            if (stopTimerRef.current) stopTimerRef.current()
        }
    }, [])

    useEffect(() => {
        if ((selectedPlayer || showAnswer) && stopTimerRef.current) {
            stopTimerRef.current()
            stopTimerRef.current = null
        }
    }, [selectedPlayer, showAnswer])

    if (!clue) return <div>Loading...</div>

    return (
        <div className="clue-page">
            <div className="player-scores">
                {players.map((player, index) => (
                    <div key={player.id} className={`player-score-small ${selectedPlayer === player.id ? 'active' : ''}`}>
                        <span className="key-hint">[{index + 1}]</span>
                        <span> {player.name}: ${player.score}</span>
                    </div>
                ))}
            </div>
            
            <div className="clue-content">
                <h2>{category.title}</h2>
                <div className="value">${clue.value}</div>
                <div className="question">{clue.question}</div>
                
                {showAnswer && (
                    <div className="answer">{clue.answer}</div>
                )}
                
                {!selectedPlayer ? (
                    <div className="player-selection">
                        {!showAnswer && (
                            <>
                                <h3>Who is answering? <span className="keyboard-hint">(Press 1-{players.length})</span></h3>
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
                                <div className="keyboard-controls-hint">
                                    <p>Press <strong>SPACE</strong> to reveal answer • <strong>ESC</strong> to go back</p>
                                </div>
                                <button className="skip-btn" onClick={handleSkip}>
                                    Skip Question
                                </button>
                            </>
                        )}
                        
                        {showAnswer && (
                            <button className="back-btn" onClick={() => navigate('/')}>
                                Back to Board [ESC]
                            </button>
                        )}
                        
                        {!showAnswer && availablePlayers.length === 0 && (
                            <div className="no-players">
                                <p>All players have answered incorrectly</p>
                                <button className="show-answer-btn" onClick={handleReveal}>
                                    Show Answer [SPACE]
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="answer-section">
                        <p className="selected-player">{players.find(p => p.id === selectedPlayer)?.name} IS ANSWERING</p>
                        
                        <div className="buttons">
                            <button className="correct-btn" onClick={handleCorrect}>
                                CORRECT [SPACE]
                            </button>
                            <button className="incorrect-btn" onClick={handleIncorrect}>
                                INCORRECT [BACKSPACE]
                            </button>
                            {!showAnswer && (
                                <button className="show-answer-btn" onClick={handleReveal}>
                                    REVEAL ANSWER [SPACE]
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CluePage