import React from 'react'
import Category from '../Category/Category.jsx'
import { useGameContext } from '../../context/GameContext.jsx'
import './Board.css'

function Board() {
    const { categories, players, resetGame, isGameOver } = useGameContext()

    if (isGameOver) {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
        const winner = sortedPlayers[0]
        return (
            <div className="game-over">
                <h1>Game Over!</h1>
                <h2>Winner: {winner.name} with ${winner.score}</h2>
                <button className="reset-btn" onClick={resetGame}>New Game</button>
            </div>
        )
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
            <div 
                className="jeopardy-board"
                style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
            >
                {categories.map((category) => (
                    <Category key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}

export default Board;