const images = document.querySelectorAll('img#game-images');

const introContainer = document.getElementById('intro-container');
const gameContainer = document.getElementById('main-game-container');
const scoreContainer = document.getElementById('score-container');

const nameInput = document.getElementById('name-input');
const plagBtn = document.getElementById('play-button');

const playerNameTag = document.getElementById('player-name');
playerNameTag.style.textDecoration = 'underline';

const h3PlayersChoice = document.getElementById('player-choice');
const h3PlayerScore = document.getElementById('player-score');

const computerNameTag = document.getElementById('computer-name');
computerNameTag.style.textDecoration = 'underline';
const h3ComputersChoice = document.getElementById('computer-choice');
const h3ComputerScore = document.getElementById('computer-score');
const h3MatchPoints = document.getElementById('match-points');
const leaderBordContainer = document.createElement('section');

let playerPoints = 0;
let computerPoints = 0;

const userInfo = {};

hideGame();

plagBtn.addEventListener('click', play = e => {
    e.preventDefault();

    let playerName = nameInput.value;
    if (playerName.trim() === '') {
        playerName = 'Player';
    }

    userInfo.name = playerName;
    userInfo.score = 0;

    console.log(userInfo);
    showGame();
});


//Adds an eventlistener to all the images
for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', playGame = e => {
        let playersChoice = e.target.alt;
        let computersChoice = randomizeComputersChoice();

        evalAnswer(playersChoice, computersChoice);

        playerNameTag.innerText = userInfo.name;
        computerNameTag.innerText = 'Computer';

        h3PlayersChoice.innerText = `Picked: ${playersChoice}`;
        h3ComputersChoice.innerText = `Picked: ${computersChoice}`;

        h3PlayerScore.innerText = `Score: ${playerPoints}`;
        h3ComputerScore.innerText = `Score: ${computerPoints}`;

        //Ska man ha continue/quit - meny?
        if (playerPoints == 3) {
            userInfo.score++;
            h3MatchPoints.innerText = `Match points: ${userInfo.score}`;
            console.log(userInfo);
            displayWinner()
        }


        //Game over
        else if (computerPoints == 3) {
            gameOver();
            getHighScores(userInfo);
        }
    });
}


//Function to randomize the computers selected answer
function randomizeComputersChoice() {
    const choices = ['rock', 'paper', 'scissor'];
    const random = Math.round(Math.random() * 2);
    const computersChoice = choices[random];

    return computersChoice;
}


const choices = ['rock', 'paper', 'scissor'];
const beatsChoices = ['paper', 'scissor', 'rock'];

//Function to compare the players and computers choices, returns one point to the winner 
function evalAnswer(playersChoice, computersChoice) {
    for (let i = 0; i < choices.length; i++) {
        if (playersChoice === choices[i]) {
            let playersAnswer = choices[i];

            if (computersChoice === beatsChoices[i]) {
                console.log('COMPUTER WINS!');
                computerPoints++;
            }
            else if (computersChoice === playersAnswer) {
                console.log('ITS A DRAW!');
            }
            else {
                console.log('PLAYER WINS!');
                playerPoints++;
            }
        }
    }
    return playerPoints, computerPoints;
}

function displayWinner() {
    introContainer.style.display = 'none';
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = 'none';
    }

    const winnerContainer = document.createElement('div');
    document.body.appendChild(winnerContainer);
    winnerContainer.className = 'pop-up';

    const winnerText = document.createElement('h3');
    winnerText.innerText = 'You won this round!';
    winnerContainer.appendChild(winnerText);

    const continueBtn = document.createElement('button');
    continueBtn.innerText = 'Next round';
    winnerContainer.appendChild(continueBtn);

    continueBtn.addEventListener('click', resetGame = () => {
        winnerContainer.remove();
        for (let i = 0; i < images.length; i++) {
            images[i].style.display = 'block';
        }
        reset();
    });

    const quitBtn = document.createElement('button');
    quitBtn.innerText = 'Quit game';
    winnerContainer.appendChild(quitBtn);

    quitBtn.addEventListener('click', changeName = () => {
        introContainer.style.display = 'block';
        gameContainer.style.display = 'none';

        winnerContainer.remove();
        reset();
    });
}

function gameOver() {
    introContainer.style.display = 'none';
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = 'none';
    }

    const gameOverContainer = document.createElement('div');
    document.body.appendChild(gameOverContainer);
    gameOverContainer.className = 'pop-up';

    const loserText = document.createElement('h3');
    loserText.innerText = 'GAME OVER!';
    gameOverContainer.appendChild(loserText);

    const playAgainBtn = document.createElement('button');
    playAgainBtn.innerText = 'Play again'
    gameOverContainer.appendChild(playAgainBtn);

    playAgainBtn.addEventListener('click', resetGame = () => {
        gameOverContainer.remove();
        for (let i = 0; i < images.length; i++) {
            images[i].style.display = 'block';
        }

        userInfo.score = 0;
        h3MatchPoints.innerText = `Match points: ${userInfo.score}`;
        removeLeaderBoard();
        reset();
    });

    const changeNameBtn = document.createElement('button');
    changeNameBtn.innerText = 'Change name';
    gameOverContainer.appendChild(changeNameBtn);

    changeNameBtn.addEventListener('click', changeName = () => {
        introContainer.style.display = 'block';
        gameContainer.style.display = 'none';

        gameOverContainer.remove();
        removeLeaderBoard();
        reset();
    });
}

function hideGame() {
    gameContainer.style.display = 'none';
    introContainer.style.display = 'block';
}

function showGame() {
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = 'block';
    }
    gameContainer.style.display = 'block';
    introContainer.style.display = 'none';
}

//Resets points and choices
function reset() {
    playerPoints = 0;
    computerPoints = 0;

    h3PlayersChoice.innerText = ``;
    h3ComputersChoice.innerText = ``;
    h3PlayerScore.innerText = ``;
    h3ComputerScore.innerText = ``;
}


/*Firebase*/
const url = 'https://js2-miniprojekt1-default-rtdb.europe-west1.firebasedatabase.app/highscores/.json'

//Get a sorted list of all highscores
async function getHighScores(userInfo) {
    const response = await fetch(url);
    const highScores = await response.json();
    console.log(highScores);

    compare(sortScore(highScores), userInfo);
}


function compare(highScoreList, userInfo) {
    console.log(highScoreList);
    if (userInfo.score > highScoreList[4].score) {
        highScoreList[4] = userInfo;
    }

    sortScore(highScoreList);
    updateHighScore(highScoreList);
}


//Sorts the scores
function sortScore(highScores) {
    highScores.sort((a, b) => b.score - a.score);
    return highScores;
}


async function updateHighScore(highScoreList) {
    const init = {
        method: 'PUT',
        body: JSON.stringify(highScoreList),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    };

    const response = await fetch(url, init);
    const data = await response.json();
    console.log(data);


    //Leaderboard
    leaderBordContainer.classList.add('leaderboard-container')
    const h3 = document.createElement('h3');
    h3.innerText = 'LEADERBORD';
    leaderBordContainer.appendChild(h3);

    const headingContainer = document.createElement('div');

    const h5Name = document.createElement('h5'); 
    h5Name.innerText = 'Name';
    headingContainer.appendChild(h5Name);

    const h5Score = document.createElement('h5'); 
    h5Score.innerText = 'Score';
    headingContainer.appendChild(h5Score);
    leaderBordContainer.appendChild(headingContainer);

    for(let i = 0; i < 5; i++){
    
        const div = document.createElement('div');

        const name = document.createElement('b');
        name.innerText = `${i+1}: ${highScoreList[i].name}`;

        const score = document.createElement('b');
        score.innerText = highScoreList[i].score;

        div.appendChild(name)
        div.appendChild(score)
        leaderBordContainer.append(div);
    }

    document.body.append(leaderBordContainer);
}


function removeLeaderBoard(){
    while (leaderBordContainer.firstChild) {
        leaderBordContainer.removeChild(leaderBordContainer.firstChild);
      }

    leaderBordContainer.remove();
}