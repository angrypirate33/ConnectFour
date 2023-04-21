/*----- constants -----*/

// RPS_LOOKUP is an object that holds our images and what each of the 
// different pieces wins against r > S, p > r, s > p.
// our controller will check this to determine winner of each round.
const RPS_LOOKUP = {
    r: {img: 'images/rock.png' , beats: 's'},
    p: {img: 'images/paper.png', beats: 'r'},
    s: {img: 'images/scissors.png', beats: 'p'}
}

const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');

// if the goal count is met, stop the game.
const GOAL_COUNT = 3

/*---------------------*/

/*----- app's state (variables) -----*/

//  scores --> Object with keys of 'p'(playter), 't'(ties), 'c'(computer)
let scores
// results --> Object to hold each round's result - 'r', 'p', or 's'.
let results
// winner --> String to hold ''(initial state), 'p', 'c', or 't'.
let winner
// goalMet --> stop the game if the goal number is reached.
// start with three wins will finish the game.
let goalMet

/*---------------------*/

/*----- cached element references -----*/

// these are direct references to our score display elements.
const scoreEls = {
    p: document.getElementById('p-score'),
    c: document.getElementById('c-score'),
    t: document.getElementById('t-score')
}

// here are our results elements.
const pResultEl = document.getElementById('p-result')
const cResultEl = document.getElementById('c-result')
const countdownEl = document.getElementById('countdown')

// anywhere we want to add a message to the user is an h1 (in this app)
// hold them all together, we'll use this later.
const msgEl = document.querySelector('h1')

/*---------------------*/

/*----- event listeners -----*/

// we're going to have a handleClick function that manages all user interaction.
// basically, do all the rock paper scissors stuff when a button is clicked.

document.querySelector('main').addEventListener('click', handleClick)

/*---------------------*/

/*----- functions -----*/

init()
// initializer function is going to set up our initial state (give values to state variables).
// calls the render function which will change what is displayed to the user.
function init() {
    // set scores to 0.
    scores = {
        p: 0,
        c: 0,
        t: 0
    }
    // set our results to determine which image is displayed.
    results = {
        p: 'r',
        c: 'r'
    }
    // set winner to 't'.
    winner = 't'
    // set goalMet to a falsey value(we'll choose an empty string).
    goalMet = ''
    // finally, our init will call the render function.
    render()
}

// render function transfers/visualizes all state
function render() {
    // find the scores in the scores object and map them to DOM elements accordingly.
    // we can loop through the scores object and apply each to the scoreEls.
    for (let scoreKey in scores) {
        scoreEls[scoreKey].innerText = scores[scoreKey]
    }
    // look at results, and source the image to their respective DOM elements.
    // p-result will update player image, c-result will update computer image.
    pResultEl.src = RPS_LOOKUP[results.p].img
    cResultEl.src = RPS_LOOKUP[results.c].img
    // render a boarder around the winner of the round.
    pResultEl.style.borderColor = winner === 'p' ? 'gray' : 'white'
    cResultEl.style.borderColor = winner === 'c' ? 'gray' : 'white'
    // eventually we'll want render to display who is the overall winner (three wins).
    if (goalMet && goalMet !== 'T') {
    msgEl.textContent = goalMet ? `Goal Met By ${goalMet === 'p' ? 'PLAYER' : 'COMPUTER'}` : 'ROCK PAPER SCISSORS'
    }
}

// the handleClick function is going to be responsible for responding  to
// user interaction. It updates all impacted state, then calls render.
// e stands for the event.
function handleClick(e) {
    // associate clicks only with buttons.
    if (e.target.tagName !== 'BUTTON') return
    // when a user clicks a button, update results.p accordingly.
    results.p = e.target.innerText.toLowerCase()
    // after the user has chosen, the computer will pick randomly.
    results.c = getRandomRPS()
    doCountdown(function () {
        //check for a winner - based on the results object
        // tie, player win, computer win
        if (results.c === results.p) {
            winner = 't'
        } else if (RPS_LOOKUP[results.c].beats === results.p) {
            winner = 'c'
        } else {
            winner = 'p'
        }
        // all we have to do to u pdate teh scores is change the value for each key in our scores object
        scores[winner]++
        // check to see who is the overall winner (someonen with a score of three).
        goalMet = scores[winner] === GOAL_COUNT ? winner : ''
        // at the bottom of our handler, we'll call render, which will update the DOM
        render()
    })
}

// this function will pick a 'random' item from the RPS_LOOKUP object
// set that pick to be the computer results (results.c).
function getRandomRPS() {
    const RPS = Object.keys(RPS_LOOKUP)
    const rndIdx = Math.floor(Math.random() * RPS.length)
    return RPS[rndIdx]
} 

// we're passing in a parameter because we want to check the winner after the countdown is complete.
// passing the wincheck callback is the easiest way to do it.
function doCountdown(cb) {
    // give count a value
    let count = 3
    // display count in the DOM
    countdownEl.textContent = count
    countdownEl.style.visibility = 'visible'
    // run our countdown audio
    AUDIO.currentTime = 0
    AUDIO.play()
    // user setInterval to update the count
    const timerId = setInterval(function() {
        // we want the count to go down by one every second
        count--
        if (count <= 0) {
            // stop the timer
            clearInterval(timerId)
            countdownEl.style.visibility = 'hidden'
            // after that, call the callback function which will check the winner.
            cb()
        } else {
            countdownEl.textContent = count
        }
    }, 1000)
}

/*---------------------*/