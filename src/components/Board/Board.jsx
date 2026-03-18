import React from 'react'
import Category from '../Category/Category.jsx'
import { useGameContext } from '../../context/GameContext.jsx'
import './Board.css'

function Board() {
    const { categories, players, resetGame, isGameOver } = useGameContext()

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
    const winner = sortedPlayers[0]

    if (isGameOver) {
        return (
            <div className="game-over-screen">
                <h1 className="congrats-text">CONGRATULATIONS!</h1>
                <div className="winner-podium">
                    <div className="winner-glow"></div>
                    <div className="crown">👑</div>
                    <div className="winner-name">{winner.name}</div>
                    <div className="winner-score">${winner.score}</div>
                </div>
                
                <div className="final-standings">
                    {sortedPlayers.slice(1).map((player, idx) => (
                        <div key={player.id} className="standing-row">
                            <span className="rank">#{idx + 2}</span>
                            <span className="name">{player.name}</span>
                            <span className="score">${player.score}</span>
                        </div>
                    ))}
                </div>

                <button className="reset-btn big-reset" onClick={resetGame}>NEW GAME</button>
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