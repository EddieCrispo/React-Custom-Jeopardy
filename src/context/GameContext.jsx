import React, { createContext, useContext, useState, useEffect } from 'react'
import { gameConfig } from '../config/gameConfig'
import { playSound } from '../utils/sounds'

const GameContext = createContext()

export const useGameContext = () => useContext(GameContext)

export const GameProvider = ({ children }) => {
    const [categories, setCategories] = useState([])
    const [players, setPlayers] = useState(() => {
        const saved = localStorage.getItem('jeopardyPlayers')
        return saved ? JSON.parse(saved) : gameConfig.players.map(p => ({ ...p, score: 0 }))
    })
    const [answeredQuestions, setAnsweredQuestions] = useState(() => {
        const saved = localStorage.getItem('answeredQuestions')
        return saved ? JSON.parse(saved) : []
    })
    const [wrongAnswers, setWrongAnswers] = useState(() => {
        const saved = localStorage.getItem('wrongAnswers')
        return saved ? JSON.parse(saved) : {}
    })
    const [isGameOver, setIsGameOver] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/jeopardy-data.json')
                const data = await response.json()
                setCategories(data.categories)
            } catch (error) {
                console.error("Error fetching jeopardy data:", error)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        localStorage.setItem('jeopardyPlayers', JSON.stringify(players))
    }, [players])

    useEffect(() => {
        localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions))
    }, [answeredQuestions])

    useEffect(() => {
        localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers))
    }, [wrongAnswers])

    // Check for game over
    useEffect(() => {
        if (categories.length > 0) {
            const totalClues = categories.reduce((sum, cat) => sum + cat.clues.length, 0)
            if (answeredQuestions.length === totalClues && totalClues > 0) {
                setIsGameOver(true)
            } else {
                setIsGameOver(false)
            }
        }
    }, [answeredQuestions, categories])

    const markCorrect = (playerId, questionKey, value) => {
        playSound('correct')
        const updatedPlayers = players.map(p => 
            p.id === playerId ? { ...p, score: p.score + value } : p
        )
        setPlayers(updatedPlayers)
        setAnsweredQuestions(prev => [...prev, questionKey])
    }

    const markIncorrect = (playerId, questionKey, value) => {
        playSound('incorrect')
        const updatedPlayers = players.map(p => 
            p.id === playerId 
                ? { ...p, score: gameConfig.deductPointsOnWrong ? p.score - value : p.score } 
                : p
        )
        setPlayers(updatedPlayers)
        
        const newWrongAnswers = { ...wrongAnswers }
        if (!newWrongAnswers[questionKey]) {
            newWrongAnswers[questionKey] = []
        }
        newWrongAnswers[questionKey].push(playerId)
        setWrongAnswers(newWrongAnswers)

        if (newWrongAnswers[questionKey].length === players.length) {
            setAnsweredQuestions(prev => [...prev, questionKey])
            return true
        }
        return false
    }

    const skipClue = (questionKey) => {
        setAnsweredQuestions(prev => [...prev, questionKey])
    }

    const resetGame = () => {
        const resetPlayers = gameConfig.players.map(p => ({ ...p, score: 0 }))
        setPlayers(resetPlayers)
        setAnsweredQuestions([])
        setWrongAnswers({})
        setIsGameOver(false)
        localStorage.removeItem('jeopardyPlayers')
        localStorage.removeItem('answeredQuestions')
        localStorage.removeItem('wrongAnswers')
    }

    const value = {
        categories,
        players,
        answeredQuestions,
        wrongAnswers,
        isGameOver,
        markCorrect,
        markIncorrect,
        skipClue,
        resetGame
    }

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    )
}
