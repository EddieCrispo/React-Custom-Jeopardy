import React, { useEffect, useState } from 'react'
import Category from '../Category/Category.jsx'
import './Board.css'

function Board() {
    const [categories, setCategories] = useState([]);
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
            const response = await fetch('/jeopardy-data.json');
            const data = await response.json();
            setCategories(data.categories);
        }

        fetchData();
    }, []);

    useEffect(() => {
        localStorage.setItem('jeopardyPlayers', JSON.stringify(players))
    }, [players])

    const resetGame = () => {
        const resetPlayers = players.map(p => ({ ...p, score: 0 }))
        setPlayers(resetPlayers)
        localStorage.removeItem('answeredQuestions')
        localStorage.removeItem('wrongAnswers')
    }

    return (
        <div>
            <div className="scoreboard">
                {players.map(player => (
                    <div key={player.id} className="player-score">
                        <div className="player-name">{player.name}</div>
                        <div className="score">${player.score}</div>
                    </div>
                ))}
                <button className="reset-btn" onClick={resetGame}>Reset Game</button>
            </div>
            <div className="jeopardy-board">
                {categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}

export default Board;