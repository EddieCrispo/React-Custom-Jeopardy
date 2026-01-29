import React from 'react'
import { useNavigate } from 'react-router-dom'
import { playSound } from '../../utils/sounds.js'
import './Clue.css'

const Clue = ({ value, clue, categoryId, clueIndex }) => {
    const navigate = useNavigate()
    const answeredQuestions = JSON.parse(localStorage.getItem('answeredQuestions') || '[]')
    const questionKey = `${categoryId}-${clueIndex}`
    const isAnswered = answeredQuestions.includes(questionKey)
    
    const handleClick = () => {
        if (!isAnswered) {
            playSound('click')
            navigate(`/clue/${categoryId}/${clueIndex}`)
        }
    }

    return (
        <div 
            className={`jeopardy-clue dollar-value ${isAnswered ? 'answered' : ''}`} 
            onClick={handleClick}
            style={{ cursor: isAnswered ? 'not-allowed' : 'pointer' }}
        >
            ${value}
        </div>
    )
}

export default Clue