# React Jeopardy

## About the Project

<!-- Here you can provide more details about the project
* What features does your project provide?
* Short motivation for the project? (Don't be too long winded)
* Links to the project site

```
Show some example code to describe what your project does
Show some of your APIs
``` -->

This project was created because my family was having a big gathering and I wanted us to play a Jeopardy-like game except with our family's trivia, but because there's no github repos that is exactly how I want it, I made this.

The base of this project is this [react-jeopardy](https://github.com/dyarawilliams/react-jeopardy) project that I vibecoded to use a local JSON file instead so I could modify the questions easily. And because I designed it with my family in mind, I made it so that it'll track scores for 3 players and automatically subtracts and adds scores if the answer is correct or not.

## Table of Contents

1. [About the Project](#about-the-project)
1. [Features](#features)
1. [Getting Started](#getting-started)
   1. [Prerequisites](#prerequisites)
   1. [Installation](#installation)
   1. [Usage](#usage)
1. [Customization](#customization)
1. [Game Rules](#game-rules)
1. [Built With](#built-with)
1. [Authors](#authors)
1. [Acknowledgments](#acknowledgements)

## Features

- **Multi-Player Support**: Host-controlled game for up to 3 players
- **Customizable Questions**: Easy-to-edit JSON file for questions and answers
- **Score Tracking**: Persistent scoring with correct/incorrect point system
- **Sound Effects**: Audio feedback for game interactions
- **Responsive Design**: Beautiful Jeopardy-themed interface
- **Smart Game Logic**: Prevents re-answering questions, tracks wrong answers
- **Host Controls**: Skip questions, select players, manage scoring

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dyarawilliams/react-jeopardy.git
   cd react-jeopardy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

3. **How to Play:**
   - Click any dollar amount to view the question
   - As host, select which player is answering
   - Mark their answer as correct (+points) or incorrect (-points)
   - Use "Skip Question" if no one wants to answer
   - Game automatically prevents re-answering questions

## Customization

### Adding Your Own Questions

Edit `/public/jeopardy-data.json` to customize categories and questions:

```json
{
  "categories": [
    {
      "id": 1,
      "title": "Your Category Name",
      "clues": [
        {
          "value": 200,
          "question": "Your question here",
          "answer": "What is the answer?"
        }
      ]
    }
  ]
}
```

- **Flexible Structure**: Any number of categories and questions
- **Custom Point Values**: Set any dollar amounts you want
- **No Minimum or Maximum Requirements**: Complete flexibility

### Player Names

Player names can be customized in the code or will default to "Player 1", "Player 2", "Player 3".

## Game Rules

1. **Question Selection**: Host clicks a dollar amount to reveal the question
2. **Player Selection**: Host chooses which player is answering
3. **Scoring**:
   - Correct answer: Player gains the question's point value
   - Incorrect answer: Player loses the question's point value
4. **Multiple Attempts**: If a player answers incorrectly, other players can still attempt
5. **Question Completion**: Questions are disabled when:
   - A player answers correctly, OR
   - All players have answered incorrectly, OR
   - Host skips the question
6. **Persistent Scoring**: Scores are saved and persist between browser sessions

## Built With

- [![Vite][Vite.js]][Vite-url] - Build tool and development server
- [![React][React.js]][React-url] - Frontend framework
- [![React Router][Router.js]][Router-url] - Navigation and routing

## Authors

- **[EddieCrispo](https://github.com/EddieCrispo)** - _Modified version with local JSON, multi-player support, host controls, and sound effects_
- **[D'yara Williams](https://github.com/dyarawilliams)** - _Original project_ - [Claire](https://github.com/Mayanwolfe)

## Acknowledgments

- **BIG Thank You** to [mayanwolfe's Repo](https://github.com/Mayanwolfe/React_Jeopardy) for the original inspiration and codebase
- **Shout out** to the React and Vite communities for excellent documentation
- **Special thanks** to the open-source community for making projects like this possible

**[Back to top](#table-of-contents)**

<!-- MARKDOWN LINKS & IMAGES -->

[Vite.js]: https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E
[Vite-url]: https://vitejs.dev/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.dev/
[Router.js]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[Router-url]: https://reactrouter.com/

