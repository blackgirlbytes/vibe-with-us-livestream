// VIBE WITH US - Regex Game

class RegexGame {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.currentChallenge = 0;
        this.score = 0;
        this.challenges = [
            {
                id: 1,
                title: "Email Detective",
                description: "Create a regex pattern that matches valid email addresses",
                shouldMatch: [
                    "user@example.com",
                    "test.email@domain.org",
                    "hello@test.co.uk"
                ],
                shouldNotMatch: [
                    "invalid.email",
                    "@domain.com",
                    "user@",
                    "user@.com"
                ],
                solution: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                hints: [
                    "Start with ^ to match the beginning",
                    "Use + to match one or more characters",
                    "Don't forget the @ symbol",
                    "End with $ to match the end"
                ],
                points: 100
            },
            {
                id: 2,
                title: "Phone Number Hunter",
                description: "Match US phone numbers in format (123) 456-7890",
                shouldMatch: [
                    "(123) 456-7890",
                    "(555) 123-4567",
                    "(999) 888-7777"
                ],
                shouldNotMatch: [
                    "123-456-7890",
                    "(12) 456-7890",
                    "(123) 45-7890",
                    "123 456 7890"
                ],
                solution: /^\(\d{3}\) \d{3}-\d{4}$/,
                hints: [
                    "Parentheses need to be escaped: \\( \\)",
                    "\\d matches any digit",
                    "{3} means exactly 3 times",
                    "Don't forget the space after the area code"
                ],
                points: 150
            },
            {
                id: 3,
                title: "Password Validator",
                description: "Match passwords with at least 8 characters, containing letters and numbers",
                shouldMatch: [
                    "password123",
                    "MyPass1",
                    "secure123password"
                ],
                shouldNotMatch: [
                    "password",
                    "12345678",
                    "Pass1",
                    "short"
                ],
                solution: /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/,
                hints: [
                    "Use positive lookahead: (?=.*pattern)",
                    "Check for at least one letter: [a-zA-Z]",
                    "Check for at least one digit: \\d",
                    "Minimum 8 characters: .{8,}"
                ],
                points: 200
            }
        ];
        
        this.container = null;
        this.inputElement = null;
        this.currentPattern = '';
    }

    init() {
        console.log('Initializing Regex Game...');
        this.createGameContainer();
        this.loadChallenge(0);
        this.setupEventListeners();
        
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles/games/regex-game.css';
        document.head.appendChild(link);
    }

    createGameContainer() {
        const gameContainer = document.getElementById('game-container');
        
        this.container = Utils.createElement('div', {
            className: 'regex-game'
        });
        
        gameContainer.appendChild(this.container);
    }

    loadChallenge(challengeIndex) {
        if (challengeIndex >= this.challenges.length) {
            this.gameComplete();
            return;
        }
        
        this.currentChallenge = challengeIndex;
        const challenge = this.challenges[challengeIndex];
        
        this.container.innerHTML = `
            <div class="regex-header">
                <h2 class="regex-title">${challenge.title}</h2>
                <div class="regex-progress">
                    <div class="progress-text">Challenge ${challengeIndex + 1} of ${this.challenges.length}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((challengeIndex) / this.challenges.length) * 100}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="regex-challenge">
                <p class="challenge-description">${challenge.description}</p>
                
                <div class="test-strings">
                    <h4>✅ Should Match:</h4>
                    <div class="string-list" id="should-match">
                        ${challenge.shouldMatch.map(str => 
                            `<div class="test-string should-match" data-string="${str}">${str}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="test-strings">
                    <h4>❌ Should NOT Match:</h4>
                    <div class="string-list" id="should-not-match">
                        ${challenge.shouldNotMatch.map(str => 
                            `<div class="test-string should-not-match" data-string="${str}">${str}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="regex-input-section">
                    <div class="regex-input-container">
                        <span class="regex-delimiters">/</span>
                        <input type="text" class="regex-input" id="regex-input" 
                               placeholder="Enter your regex pattern here" autocomplete="off">
                        <span class="regex-delimiters">/</span>
                    </div>
                    <div class="validation-feedback" id="validation-feedback"></div>
                </div>
                
                <div class="regex-actions">
                    <button class="regex-btn" id="test-regex">Test Pattern</button>
                    <button class="regex-btn primary" id="submit-regex" disabled>Submit Answer</button>
                    <button class="regex-btn" id="show-hint">Show Hint</button>
                </div>
                
                <div class="regex-hints" id="hints-container" style="display: none;">
                    <h5>💡 Hints:</h5>
                    <ul id="hints-list"></ul>
                </div>
            </div>
        `;
        
        this.inputElement = document.getElementById('regex-input');
        this.setupChallengeEventListeners();
    }

    setupEventListeners() {
        // Global event listeners for the regex game
    }

    setupChallengeEventListeners() {
        const testBtn = document.getElementById('test-regex');
        const submitBtn = document.getElementById('submit-regex');
        const hintBtn = document.getElementById('show-hint');
        const input = this.inputElement;
        
        // Test pattern on input change
        input.addEventListener('input', () => {
            this.currentPattern = input.value;
            this.testPattern();
        });
        
        // Test button
        testBtn.addEventListener('click', () => {
            this.testPattern();
        });
        
        // Submit button
        submitBtn.addEventListener('click', () => {
            this.submitAnswer();
        });
        
        // Hint button
        hintBtn.addEventListener('click', () => {
            this.showHints();
        });
        
        // Enter key to test/submit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (submitBtn.disabled) {
                    this.testPattern();
                } else {
                    this.submitAnswer();
                }
            }
        });
    }

    testPattern() {
        const pattern = this.currentPattern.trim();
        const feedback = document.getElementById('validation-feedback');
        const submitBtn = document.getElementById('submit-regex');
        
        if (!pattern) {
            feedback.innerHTML = '<span class="feedback-error">Enter a regex pattern to test</span>';
            this.inputElement.className = 'regex-input';
            submitBtn.disabled = true;
            return;
        }
        
        try {
            const regex = new RegExp(pattern);
            const challenge = this.challenges[this.currentChallenge];
            
            let correctMatches = 0;
            let totalTests = challenge.shouldMatch.length + challenge.shouldNotMatch.length;
            
            // Test strings that should match
            challenge.shouldMatch.forEach(str => {
                const element = document.querySelector(`[data-string="${str}"]`);
                if (regex.test(str)) {
                    element.classList.add('matched');
                    element.classList.remove('not-matched');
                    correctMatches++;
                } else {
                    element.classList.add('not-matched');
                    element.classList.remove('matched');
                }
            });
            
            // Test strings that should NOT match
            challenge.shouldNotMatch.forEach(str => {
                const element = document.querySelector(`[data-string="${str}"]`);
                if (!regex.test(str)) {
                    element.classList.add('matched');
                    element.classList.remove('not-matched');
                    correctMatches++;
                } else {
                    element.classList.add('not-matched');
                    element.classList.remove('matched');
                }
            });
            
            // Update feedback
            if (correctMatches === totalTests) {
                feedback.innerHTML = '<span class="feedback-success">✅ Perfect! All tests pass!</span>';
                this.inputElement.className = 'regex-input valid';
                submitBtn.disabled = false;
            } else {
                feedback.innerHTML = `<span class="feedback-partial">⚠️ ${correctMatches}/${totalTests} tests passing</span>`;
                this.inputElement.className = 'regex-input invalid';
                submitBtn.disabled = true;
            }
            
        } catch (error) {
            feedback.innerHTML = '<span class="feedback-error">❌ Invalid regex pattern</span>';
            this.inputElement.className = 'regex-input invalid';
            submitBtn.disabled = true;
            
            // Clear all test results
            document.querySelectorAll('.test-string').forEach(el => {
                el.classList.remove('matched', 'not-matched');
            });
        }
    }

    submitAnswer() {
        const challenge = this.challenges[this.currentChallenge];
        
        // Award points
        this.score += challenge.points;
        this.gameManager.updateScore(challenge.points);
        
        // Show success animation
        this.showSuccessAnimation();
        
        // Move to next challenge after delay
        setTimeout(() => {
            this.currentChallenge++;
            if (this.currentChallenge < this.challenges.length) {
                this.loadChallenge(this.currentChallenge);
            } else {
                this.gameComplete();
            }
        }, 2000);
    }

    showSuccessAnimation() {
        const animation = Utils.createElement('div', {
            className: 'success-animation',
            innerHTML: '🎉 CORRECT! 🎉'
        });
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            document.body.removeChild(animation);
        }, 1000);
    }

    showHints() {
        const hintsContainer = document.getElementById('hints-container');
        const hintsList = document.getElementById('hints-list');
        const challenge = this.challenges[this.currentChallenge];
        
        hintsList.innerHTML = challenge.hints.map(hint => `<li>${hint}</li>`).join('');
        hintsContainer.style.display = 'block';
        
        // Scroll to hints
        hintsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    gameComplete() {
        console.log('Regex Game Complete!');
        
        // Show completion message
        this.container.innerHTML = `
            <div style="text-align: center; padding: 4rem;">
                <h2 class="neon-text" style="font-size: 3rem; margin-bottom: 2rem;">🎉 LEVEL COMPLETE! 🎉</h2>
                <p style="font-size: 1.5rem; color: #00FFFF; margin-bottom: 1rem;">
                    You've mastered the art of regex!
                </p>
                <p style="font-size: 1.2rem; color: #CCCCCC; margin-bottom: 2rem;">
                    Final Score: ${Utils.formatNumber(this.score)} points
                </p>
                <div style="margin-top: 3rem;">
                    <button class="regex-btn primary" onclick="window.GameManager.levelComplete()">
                        CONTINUE TO NEXT LEVEL
                    </button>
                </div>
            </div>
        `;
        
        // Notify game manager
        setTimeout(() => {
            this.gameManager.levelComplete();
        }, 3000);
    }

    pause() {
        // Pause game logic if needed
        console.log('Regex game paused');
    }

    resume() {
        // Resume game logic if needed
        console.log('Regex game resumed');
    }

    restart() {
        // Restart current challenge
        this.currentChallenge = 0;
        this.score = 0;
        this.loadChallenge(0);
    }

    destroy() {
        // Clean up game resources
        if (this.container) {
            this.container.remove();
        }
        console.log('Regex game destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegexGame;
} else {
    window.RegexGame = RegexGame;
}
