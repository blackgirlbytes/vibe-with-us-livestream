// Game state
let score = 0;
let timeLeft = 30;
let timerInterval;
let currentPattern;

// Patterns for the game with required regex solutions
const patterns = [
    { 
        text: '123',
        solution: '\\d+',
        hint: 'Use \\d+ to match one or more digits'
    },
    { 
        text: 'abc',
        solution: '[a-z]+',
        hint: 'Use [a-z]+ to match one or more lowercase letters'
    },
    { 
        text: 'ABC',
        solution: '[A-Z]+',
        hint: 'Use [A-Z]+ to match one or more uppercase letters'
    },
    { 
        text: 'cat',
        solution: '[a-z]{3}',
        hint: 'Match exactly 3 lowercase letters'
    },
    { 
        text: 'phone: 555-123-4567',
        solution: '\\d{3}-\\d{3}-\\d{4}',
        hint: 'Match a phone number pattern'
    },
    { 
        text: 'hello world',
        solution: '[a-z]+\\s[a-z]+',
        hint: 'Match two words with a space between'
    },
    { 
        text: 'apple42',
        solution: '[a-z]+\\d+',
        hint: 'Match letters followed by numbers'
    },
    {
        text: 'color colour',
        solution: 'colou?r',
        hint: 'Match both spellings using an optional character'
    }
];

// Initialize game
function initGame() {
    score = 0;
    timeLeft = 30;
    updateScore(0);
    updateTimer();
    setNewPattern();
    startTimer();

    // Set up input listener
    document.getElementById('regex-input').addEventListener('input', checkPattern);
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Update timer display
function updateTimer() {
    document.getElementById('timer-value').textContent = timeLeft;
}

// Update score display
function updateScore(newScore) {
    score = newScore;
    document.getElementById('score-value').textContent = score;
}

// Set new pattern to match
function setNewPattern() {
    currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    document.getElementById('current-text').textContent = currentPattern.text;
    document.getElementById('regex-input').value = '';
    updateFeedback(currentPattern.hint);
}

// Check if the pattern matches
function checkPattern(event) {
    const input = event.target.value;
    
    // Don't accept the literal text as an answer
    if (input === currentPattern.text) {
        updateFeedback('Using the exact text is not allowed! Try using regex patterns.', false);
        return;
    }

    try {
        const regex = new RegExp(`^${input}$`);
        const matches = regex.test(currentPattern.text);
        const isCorrectPattern = input === currentPattern.solution;
        
        if (matches && isCorrectPattern) {
            updateScore(score + 1);
            updateFeedback('Perfect regex! 🎉', true);
            setTimeout(setNewPattern, 500);
        } else if (matches) {
            updateFeedback('It matches, but try using the proper regex pattern!', false);
        } else {
            updateFeedback(currentPattern.hint, false);
        }
    } catch (e) {
        updateFeedback('Invalid regex pattern', false);
    }
}

// Update feedback display
function updateFeedback(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = isCorrect ? 'correct' : 'incorrect';
}

// End the game
function endGame() {
    clearInterval(timerInterval);
    document.getElementById('regex-input').disabled = true;
    updateFeedback(`Game Over! Final Score: ${score}`, true);
}

// Start the game when the page loads
window.addEventListener('load', initGame);
