import React from 'react'
import Category from '../Category/Category.jsx'
import { useGameContext } from '../../context/GameContext.jsx'
import './Board.css'

function Board() {
    const { categories, players, resetGame } = useGameContext()

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