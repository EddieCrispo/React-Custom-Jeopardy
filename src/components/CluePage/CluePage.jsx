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

    useEffect(() => {
        // Start the timer sound
        stopTimerRef.current = playSound('timer')

        return () => {
            // Cleanup on unmount
            if (stopTimerRef.current) stopTimerRef.current()
        }
    }, [])

    useEffect(() => {
        // Stop the timer if a player is selected or answer is shown
        if ((selectedPlayer || showAnswer) && stopTimerRef.current) {
            stopTimerRef.current()
            stopTimerRef.current = null
        }
    }, [selectedPlayer, showAnswer])

    const category = categories.find(cat => cat.id === parseInt(categoryId))
    const clue = category?.clues[parseInt(clueIndex)]
    const questionKey = `${categoryId}-${clueIndex}`
    const playersWhoAnsweredWrong = wrongAnswers[questionKey] || []

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
            // Resume timer if other players can still answer
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
            skipClue(questionKey)
            setTimeout(() => {
                navigate('/')
            }, 3000)
        }
    }

    // Keyboard Controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedPlayer && !showAnswer) {
                const playerIndex = parseInt(e.key) - 1
                if (playerIndex >= 0 && playerIndex < players.length) {
                    const player = players[playerIndex]
                    if (!playersWhoAnsweredWrong.includes(player.id)) {
                        setSelectedPlayer(player.id)
                    }
                }
            }

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

            if (e.code === 'Escape' || e.key.toLowerCase() === 'b') {
                navigate('/')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [selectedPlayer, showAnswer, players, playersWhoAnsweredWrong])

    const availablePlayers = players.filter(p => !playersWhoAnsweredWrong.includes(p.id))

    if (!clue) return <div>Loading...</div>

    return (
        <div className="clue-page">
            <div className="player-scores">
                {players.map((player, index) => (
                    <div key={player.id} className={`player-score-small ${selectedPlayer === player.id ? 'active' : ''}`}>
                        <span>[{index + 1}] {player.name}: ${player.score}</span>
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
                                <button className="skip-btn" onClick={handleSkip}>
                                    Skip Question
                                </button>
                            </>
                        )}
                        
                        {showAnswer && (
                            <button className="back-btn" onClick={() => navigate('/')}>
                                Back to Board
                            </button>
                        )}
                        
                        {!showAnswer && availablePlayers.length === 0 && (
                            <div className="no-players">
                                <p>All players have answered incorrectly</p>
                                <button className="show-answer-btn" onClick={handleReveal}>
                                    Show Answer
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