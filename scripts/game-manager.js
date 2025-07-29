// VIBE WITH US - Game Manager

class GameManager {
    constructor() {
        this.currentScreen = 'loading';
        this.currentGame = null;
        this.gameState = {
            level: 1,
            score: 0,
            lives: 3,
            paused: false
        };
        
        // Game definitions
        this.games = [
            {
                id: 1,
                name: 'Regex Detective',
                description: 'Master the art of pattern matching',
                unlocked: true,
                completed: false
            }
        ];
        
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        console.log('Initializing Game Manager...');
        
        try {
            await this.showLoadingScreen();
            await this.setupEventListeners();
            await this.loadAssets();
            this.showMainMenu();
            this.initialized = true;
            console.log('Game Manager initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Game Manager:', error);
        }
    }

    async showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        loadingScreen.classList.remove('hidden');
        
        const loadingSteps = [
            'Initializing Game Engine...',
            'Loading Assets...',
            'Setting up Game World...',
            'Preparing First Challenge...',
            'Ready to Play!'
        ];
        
        for (let i = 0; i < loadingSteps.length; i++) {
            loadingText.textContent = loadingSteps[i];
            loadingProgress.style.width = `${((i + 1) / loadingSteps.length) * 100}%`;
            await Utils.wait(500);
        }
        
        await Utils.wait(500);
        loadingScreen.classList.add('hidden');
    }

    setupEventListeners() {
        // Main menu buttons
        document.getElementById('start-game')?.addEventListener('click', () => {
            this.startGame(1);
        });
        
        document.getElementById('level-select')?.addEventListener('click', () => {
            this.showLevelSelect();
        });
        
        document.getElementById('achievements')?.addEventListener('click', () => {
            this.showAchievements();
        });
        
        document.getElementById('settings')?.addEventListener('click', () => {
            this.showSettings();
        });
        
        // Game controls
        document.getElementById('pause-game')?.addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('quit-game')?.addEventListener('click', () => {
            this.quitGame();
        });
        
        // Pause menu
        document.getElementById('resume-game')?.addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('restart-level')?.addEventListener('click', () => {
            this.restartLevel();
        });
        
        document.getElementById('back-to-main')?.addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Back button
        document.getElementById('back-to-menu')?.addEventListener('click', () => {
            this.showMainMenu();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentScreen === 'game' && !this.gameState.paused) {
                    this.pauseGame();
                } else if (this.gameState.paused) {
                    this.resumeGame();
                }
            }
        });
    }

    async loadAssets() {
        // For now, just simulate asset loading
        // In a full implementation, this would load images, sounds, etc.
        console.log('Assets loaded');
    }

    showMainMenu() {
        this.hideAllScreens();
        this.currentScreen = 'menu';
        
        const mainMenu = document.getElementById('main-menu');
        mainMenu.classList.remove('hidden');
        mainMenu.classList.add('fade-in');
        
        // Update progress display
        this.updateProgressDisplay();
    }

    showLevelSelect() {
        this.hideAllScreens();
        this.currentScreen = 'level-select';
        
        const levelSelectScreen = document.getElementById('level-select-screen');
        levelSelectScreen.classList.remove('hidden');
        levelSelectScreen.classList.add('fade-in');
        
        this.renderLevelGrid();
    }

    renderLevelGrid() {
        const levelsGrid = document.getElementById('levels-grid');
        levelsGrid.innerHTML = '';
        
        this.games.forEach((game, index) => {
            const levelCard = Utils.createElement('div', {
                className: `level-card ${game.unlocked ? 'unlocked' : 'locked'} ${game.completed ? 'completed' : ''}`,
                'data-level': game.id
            });
            
            levelCard.innerHTML = `
                <div class="level-number">${game.id}</div>
                <h3 class="level-title">${game.name}</h3>
                <p class="level-description">${game.description}</p>
                <div class="level-stats">
                    <span>Best: ${gameStorage.getScore(game.id) || 0}</span>
                </div>
                <button class="level-play-btn ${game.unlocked ? '' : 'disabled'}" 
                        ${game.unlocked ? '' : 'disabled'}>
                    ${game.unlocked ? 'PLAY' : 'LOCKED'}
                </button>
            `;
            
            if (game.unlocked) {
                levelCard.addEventListener('click', () => {
                    this.startGame(game.id);
                });
            }
            
            levelsGrid.appendChild(levelCard);
        });
    }

    async startGame(levelId) {
        console.log(`Starting game level ${levelId}`);
        
        this.hideAllScreens();
        this.currentScreen = 'game';
        
        // Reset game state
        this.gameState = {
            level: levelId,
            score: 0,
            lives: 3,
            paused: false
        };
        
        // Update storage
        gameStorage.setCurrentLevel(levelId);
        
        // Show game screen
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('fade-in');
        
        // Update game header
        this.updateGameHeader();
        
        // Load the specific game
        await this.loadGame(levelId);
    }

    async loadGame(levelId) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        
        switch (levelId) {
            case 1:
                await this.loadRegexGame();
                break;
            default:
                console.error(`Game ${levelId} not implemented yet`);
                gameContainer.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #00FFFF; font-size: 2rem;">
                        Game ${levelId} - Coming Soon!
                        <br><br>
                        <button onclick="window.GameManager.showMainMenu()" style="padding: 1rem 2rem; font-size: 1rem; background: transparent; border: 2px solid #00FFFF; color: #00FFFF; cursor: pointer;">
                            Back to Menu
                        </button>
                    </div>
                `;
        }
    }

    async loadRegexGame() {
        // Load the regex game
        try {
            // Import the regex game module
            const script = document.createElement('script');
            script.src = 'scripts/games/regex-game.js';
            script.onload = () => {
                if (window.RegexGame) {
                    this.currentGame = new window.RegexGame(this);
                    this.currentGame.init();
                } else {
                    console.error('RegexGame not found');
                }
            };
            script.onerror = () => {
                console.error('Failed to load regex game');
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error loading regex game:', error);
        }
    }

    pauseGame() {
        if (this.currentGame && !this.gameState.paused) {
            this.gameState.paused = true;
            this.currentGame.pause?.();
            document.getElementById('pause-menu').classList.remove('hidden');
        }
    }

    resumeGame() {
        if (this.currentGame && this.gameState.paused) {
            this.gameState.paused = false;
            this.currentGame.resume?.();
            document.getElementById('pause-menu').classList.add('hidden');
        }
    }

    restartLevel() {
        if (this.currentGame) {
            this.currentGame.restart?.();
            this.gameState.score = 0;
            this.gameState.lives = 3;
            this.updateGameHeader();
            this.resumeGame();
        }
    }

    quitGame() {
        if (this.currentGame) {
            this.currentGame.destroy?.();
            this.currentGame = null;
        }
        this.showMainMenu();
    }

    updateScore(points) {
        this.gameState.score += points;
        this.updateGameHeader();
    }

    updateLives(change) {
        this.gameState.lives += change;
        this.updateGameHeader();
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        console.log('Game Over!');
        // Save score
        gameStorage.saveScore(this.gameState.level, this.gameState.score);
        
        // Show game over screen or return to menu
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
    }

    levelComplete() {
        console.log('Level Complete!');
        
        // Save score
        gameStorage.saveScore(this.gameState.level, this.gameState.score);
        
        // Mark level as completed
        const game = this.games.find(g => g.id === this.gameState.level);
        if (game) {
            game.completed = true;
        }
        
        // Unlock next level
        if (this.gameState.level < this.games.length) {
            const nextGame = this.games.find(g => g.id === this.gameState.level + 1);
            if (nextGame) {
                nextGame.unlocked = true;
            }
        }
        
        // Show completion message
        this.showTransition(`Level ${this.gameState.level} Complete!`, 'Great job! Moving to next challenge...');
        
        setTimeout(() => {
            this.showMainMenu();
        }, 3000);
    }

    showTransition(title, message) {
        const transitionScreen = document.getElementById('transition-screen');
        document.getElementById('transition-title').textContent = title;
        document.getElementById('transition-message').textContent = message;
        transitionScreen.classList.remove('hidden');
        
        setTimeout(() => {
            transitionScreen.classList.add('hidden');
        }, 3000);
    }

    updateGameHeader() {
        document.getElementById('current-game-title').textContent = 
            this.games.find(g => g.id === this.gameState.level)?.name || 'Game';
        document.getElementById('current-level').textContent = this.gameState.level;
        document.getElementById('current-score').textContent = Utils.formatNumber(this.gameState.score);
        document.getElementById('current-lives').textContent = this.gameState.lives;
    }

    updateProgressDisplay() {
        const progress = gameStorage.getProgressPercentage();
        const bestScore = gameStorage.getBestScore();
        
        document.getElementById('overall-progress').textContent = `${progress}%`;
        document.getElementById('best-score').textContent = Utils.formatNumber(bestScore);
    }

    hideAllScreens() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.add('hidden');
            screen.classList.remove('fade-in', 'fade-out');
        });
        
        // Hide modals
        document.getElementById('pause-menu').classList.add('hidden');
        document.getElementById('transition-screen').classList.add('hidden');
    }

    showAchievements() {
        console.log('Achievements screen - Coming soon!');
    }

    showSettings() {
        console.log('Settings screen - Coming soon!');
    }
}

// Create global game manager instance
const gameManager = new GameManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
} else {
    window.GameManager = gameManager;
}
