// ===== GAME MANAGER - CORE ORCHESTRATION =====

class GameManager {
  constructor() {
    this.currentScreen = 'loading';
    this.currentGame = null;
    this.gameData = null;
    this.isInitialized = false;
    this.loadingProgress = 0;
    
    // Game definitions
    this.games = [
      {
        id: 'regex',
        name: 'Regex Detective',
        description: 'Solve cyber mysteries with pattern matching',
        level: 1,
        color: '#00FFFF',
        icon: '🔍'
      },
      {
        id: 'tetris',
        name: 'Neon Tetris',
        description: 'Classic blocks with cyberpunk style',
        level: 2,
        color: '#FF00FF',
        icon: '🧱'
      },
      {
        id: 'snake',
        name: 'Snake Evolution',
        description: 'Evolve from worm to cosmic serpent',
        level: 3,
        color: '#32CD32',
        icon: '🐍'
      },
      {
        id: 'pong',
        name: 'Pong Dimension',
        description: 'Reality-bending paddle battles',
        level: 4,
        color: '#FFD700',
        icon: '🏓'
      },
      {
        id: 'breakout',
        name: 'Breakout Shift',
        description: 'Break through dimensional barriers',
        level: 5,
        color: '#FF6B6B',
        icon: '🎯'
      },
      {
        id: 'invaders',
        name: 'Space Invaders Remix',
        description: 'Defend against the alien armada',
        level: 6,
        color: '#4ECDC4',
        icon: '🚀'
      },
      {
        id: 'final',
        name: 'The Final Fusion',
        description: 'All games become one epic challenge',
        level: 7,
        color: '#9B59B6',
        icon: '👑'
      }
    ];

    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  // Initialize the game manager
  async init() {
    try {
      console.log('🎮 Initializing Game Manager...');
      
      // Initialize storage
      this.gameData = window.GameStorage.init();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Start loading sequence
      await this.loadAssets();
      
      // Initialize UI
      this.initializeUI();
      
      // Show main menu
      await this.showMainMenu();
      
      this.isInitialized = true;
      console.log('✅ Game Manager initialized successfully!');
      
    } catch (error) {
      Utils.handleError(error, 'GameManager.init');
      this.showError('Failed to initialize game. Please refresh and try again.');
    }
  }

  // Load game assets
  async loadAssets() {
    const loadingSteps = [
      { text: 'Loading game engine...', duration: 500 },
      { text: 'Initializing graphics system...', duration: 300 },
      { text: 'Loading audio system...', duration: 400 },
      { text: 'Preparing game data...', duration: 300 },
      { text: 'Setting up user interface...', duration: 200 },
      { text: 'Finalizing setup...', duration: 300 }
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      const step = loadingSteps[i];
      const progress = ((i + 1) / loadingSteps.length) * 100;
      
      Utils.updateLoadingProgress(progress, step.text);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Window events
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Menu button events
    Utils.on(Utils.$('#start-game'), 'click', () => this.startGame());
    Utils.on(Utils.$('#level-select'), 'click', () => this.showLevelSelect());
    Utils.on(Utils.$('#achievements'), 'click', () => this.showAchievements());
    Utils.on(Utils.$('#settings'), 'click', () => this.showSettings());
    Utils.on(Utils.$('#back-to-menu'), 'click', () => this.showMainMenu());

    // Game control events
    Utils.on(Utils.$('#pause-game'), 'click', () => this.pauseGame());
    Utils.on(Utils.$('#quit-game'), 'click', () => this.quitGame());
    Utils.on(Utils.$('#resume-game'), 'click', () => this.resumeGame());
    Utils.on(Utils.$('#restart-level'), 'click', () => this.restartLevel());
    Utils.on(Utils.$('#back-to-main'), 'click', () => this.backToMainMenu());

    // Game events
    GameEvents.on('gameCompleted', (data) => this.onGameCompleted(data));
    GameEvents.on('gameFailed', (data) => this.onGameFailed(data));
    GameEvents.on('scoreUpdated', (data) => this.updateScoreDisplay(data));
    GameEvents.on('livesChanged', (lives) => this.updateLivesDisplay(lives));
  }

  // Initialize UI elements
  initializeUI() {
    this.updateProgressDisplay();
    this.generateLevelCards();
    this.createParticleSystem();
  }

  // Update progress display
  updateProgressDisplay() {
    const progress = window.GameStorage.getOverallProgress();
    const bestScore = this.getBestOverallScore();
    
    Utils.$('#overall-progress').textContent = progress + '%';
    Utils.$('#best-score').textContent = Utils.formatScore(bestScore);
  }

  // Generate level selection cards
  generateLevelCards() {
    const container = Utils.$('#levels-grid');
    container.innerHTML = '';

    this.games.forEach(game => {
      const isUnlocked = window.GameStorage.isLevelUnlocked(game.level);
      const progress = window.GameStorage.getGameProgress(game.id);
      
      const card = Utils.createElement('div', `level-card ${!isUnlocked ? 'locked' : ''}`);
      card.innerHTML = `
        <div class="level-number">${game.level}</div>
        <div class="level-title">${game.name}</div>
        <div class="level-description">${game.description}</div>
        <div class="level-stats">
          <span>Best: ${Utils.formatScore(progress.bestScore || 0)}</span>
          <span>${progress.completed ? '✅ Complete' : '⏳ Pending'}</span>
        </div>
      `;

      if (isUnlocked) {
        card.style.borderColor = game.color;
        Utils.on(card, 'click', () => this.startSpecificGame(game.id));
      }

      container.appendChild(card);
    });
  }

  // Create particle system for menu
  createParticleSystem() {
    const container = Utils.$('#menu-particles');
    if (!container) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const x = Utils.random(0, window.innerWidth);
        const y = Utils.random(0, window.innerHeight);
        Utils.createParticle(container, x, y);
      }, i * 200);
    }

    // Continuously spawn particles
    setInterval(() => {
      if (this.currentScreen === 'main-menu') {
        const x = Utils.random(0, window.innerWidth);
        const y = window.innerHeight + 50;
        Utils.createParticle(container, x, y);
      }
    }, 2000);
  }

  // Show main menu
  async showMainMenu() {
    const loadingScreen = Utils.$('#loading-screen');
    const mainMenu = Utils.$('#main-menu');
    const levelSelect = Utils.$('#level-select-screen');
    const gameScreen = Utils.$('#game-screen');

    if (this.currentScreen === 'loading') {
      // First time showing main menu
      await new Promise(resolve => setTimeout(resolve, 1000));
      loadingScreen.classList.add('hidden');
    } else {
      // Coming from another screen
      if (levelSelect && !levelSelect.classList.contains('hidden')) {
        await Utils.transitionTo(levelSelect, mainMenu);
      }
      if (gameScreen && !gameScreen.classList.contains('hidden')) {
        await Utils.transitionTo(gameScreen, mainMenu);
      }
    }

    mainMenu.classList.remove('hidden');
    this.currentScreen = 'main-menu';
    this.updateProgressDisplay();
  }

  // Show level select screen
  async showLevelSelect() {
    const mainMenu = Utils.$('#main-menu');
    const levelSelect = Utils.$('#level-select-screen');

    await Utils.transitionTo(mainMenu, levelSelect);
    this.currentScreen = 'level-select';
    this.generateLevelCards();
  }

  // Start the game (first available level)
  startGame() {
    const currentLevel = window.GameStorage.getCurrentLevel();
    const game = this.games.find(g => g.level === currentLevel);
    
    if (game) {
      this.startSpecificGame(game.id);
    } else {
      // Start from level 1 if no current level
      this.startSpecificGame('regex');
    }
  }

  // Start a specific game
  async startSpecificGame(gameId) {
    const game = this.games.find(g => g.id === gameId);
    if (!game) {
      console.error('Game not found:', gameId);
      return;
    }

    if (!window.GameStorage.isLevelUnlocked(game.level)) {
      Utils.showAchievement('Level Locked', 'Complete previous levels to unlock this game', '🔒');
      return;
    }

    console.log(`🎮 Starting game: ${game.name}`);
    
    // Show transition
    await this.showTransition(`Loading ${game.name}...`, 'Prepare for battle!');
    
    // Hide other screens and show game screen
    const currentScreenEl = Utils.$(`.screen:not(.hidden)`);
    const gameScreen = Utils.$('#game-screen');
    
    if (currentScreenEl) {
      await Utils.transitionTo(currentScreenEl, gameScreen);
    } else {
      gameScreen.classList.remove('hidden');
    }

    // Update game header
    Utils.$('#current-game-title').textContent = game.name;
    Utils.$('#current-level').textContent = game.level;
    Utils.$('#current-score').textContent = '0';
    Utils.$('#current-lives').textContent = '3';

    // Load and start the specific game
    this.currentGame = gameId;
    this.currentScreen = 'game';
    
    try {
      await this.loadGameModule(gameId);
    } catch (error) {
      Utils.handleError(error, `Loading game: ${gameId}`);
      this.showError(`Failed to load ${game.name}. Please try again.`);
    }
  }

  // Load game module
  async loadGameModule(gameId) {
    // For now, we'll create a placeholder game
    // In the next phases, we'll load actual game modules
    
    const gameContainer = Utils.$('#game-container');
    gameContainer.innerHTML = `
      <div style="text-align: center; color: #00FFFF; font-family: 'Orbitron', monospace;">
        <h2>🚧 ${this.games.find(g => g.id === gameId).name} 🚧</h2>
        <p style="margin: 20px 0; color: #CCCCCC;">This game will be implemented in the next phase!</p>
        <p style="color: #888888;">For now, enjoy this placeholder and imagine the epic gameplay to come...</p>
        <div style="margin: 40px 0;">
          <div class="spinner"></div>
        </div>
        <button class="menu-btn secondary" onclick="GameManager.backToMainMenu()" style="margin-top: 20px;">
          <span class="btn-text">BACK TO MENU</span>
        </button>
      </div>
    `;

    // Simulate game loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Game ${gameId} loaded (placeholder)`);
  }

  // Show transition screen
  showTransition(title, message) {
    return new Promise((resolve) => {
      const transitionScreen = Utils.$('#transition-screen');
      const titleEl = Utils.$('#transition-title');
      const messageEl = Utils.$('#transition-message');

      titleEl.textContent = title;
      messageEl.textContent = message;

      transitionScreen.classList.remove('hidden');
      
      setTimeout(() => {
        transitionScreen.classList.add('hidden');
        resolve();
      }, 2000);
    });
  }

  // Pause current game
  pauseGame() {
    if (this.currentGame) {
      Utils.$('#pause-menu').classList.remove('hidden');
      GameEvents.emit('gamePaused');
    }
  }

  // Resume current game
  resumeGame() {
    Utils.$('#pause-menu').classList.add('hidden');
    GameEvents.emit('gameResumed');
  }

  // Quit current game
  quitGame() {
    if (confirm('Are you sure you want to quit this game?')) {
      this.backToMainMenu();
    }
  }

  // Restart current level
  restartLevel() {
    if (this.currentGame) {
      Utils.$('#pause-menu').classList.add('hidden');
      GameEvents.emit('gameRestarted');
      this.startSpecificGame(this.currentGame);
    }
  }

  // Go back to main menu
  async backToMainMenu() {
    if (this.currentGame) {
      GameEvents.emit('gameEnded');
      this.currentGame = null;
    }
    
    Utils.$('#pause-menu').classList.add('hidden');
    await this.showMainMenu();
  }

  // Handle game completion
  onGameCompleted(data) {
    console.log('🎉 Game completed!', data);
    
    // Update progress
    window.GameStorage.updateGameProgress(data.gameType, {
      completed: true,
      bestScore: data.score,
      level: data.level
    });

    // Update score
    window.GameStorage.updateScore(data.gameType, data.score);

    // Check for achievements
    window.GameStorage.checkMilestones();

    // Show completion message
    this.showTransition('LEVEL COMPLETE!', 'Preparing next challenge...');
    
    // Auto-advance to next level after delay
    setTimeout(() => {
      const nextLevel = data.level + 1;
      const nextGame = this.games.find(g => g.level === nextLevel);
      
      if (nextGame) {
        this.startSpecificGame(nextGame.id);
      } else {
        // All games completed!
        this.showGameComplete();
      }
    }, 3000);
  }

  // Handle game failure
  onGameFailed(data) {
    console.log('💀 Game failed', data);
    
    // Update score if any
    if (data.score > 0) {
      window.GameStorage.updateScore(data.gameType, data.score);
    }

    // Show failure message
    this.showTransition('GAME OVER', 'Better luck next time!');
    
    setTimeout(() => {
      this.backToMainMenu();
    }, 2000);
  }

  // Show game complete screen
  showGameComplete() {
    const transitionScreen = Utils.$('#transition-screen');
    const titleEl = Utils.$('#transition-title');
    const messageEl = Utils.$('#transition-message');

    titleEl.textContent = '🏆 CHAMPION! 🏆';
    messageEl.textContent = 'You have conquered all challenges!';

    transitionScreen.classList.remove('hidden');
    
    setTimeout(() => {
      transitionScreen.classList.add('hidden');
      this.backToMainMenu();
    }, 5000);
  }

  // Update score display
  updateScoreDisplay(data) {
    Utils.$('#current-score').textContent = Utils.formatScore(data.score);
  }

  // Update lives display
  updateLivesDisplay(lives) {
    Utils.$('#current-lives').textContent = lives;
  }

  // Show achievements screen
  showAchievements() {
    const achievements = window.GameStorage.getAchievements();
    console.log('Achievements:', achievements);
    // TODO: Implement achievements screen
    Utils.showAchievement('Coming Soon', 'Achievements screen will be implemented soon!', '🏆');
  }

  // Show settings screen
  showSettings() {
    const settings = window.GameStorage.getSettings();
    console.log('Settings:', settings);
    // TODO: Implement settings screen
    Utils.showAchievement('Coming Soon', 'Settings screen will be implemented soon!', '⚙️');
  }

  // Get best overall score
  getBestOverallScore() {
    let totalBest = 0;
    this.games.forEach(game => {
      totalBest += window.GameStorage.getBestScore(game.id);
    });
    return totalBest;
  }

  // Handle window resize
  handleResize() {
    if (this.currentGame) {
      GameEvents.emit('windowResized', {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }

  // Handle key press
  handleKeyPress(event) {
    // Global key handlers
    switch (event.key) {
      case 'Escape':
        if (this.currentScreen === 'game') {
          this.pauseGame();
        } else if (this.currentScreen === 'level-select') {
          this.showMainMenu();
        }
        break;
      case 'Enter':
        if (this.currentScreen === 'main-menu') {
          this.startGame();
        }
        break;
    }

    // Pass key events to current game
    if (this.currentGame) {
      GameEvents.emit('keyPressed', event);
    }
  }

  // Handle visibility change (tab switching)
  handleVisibilityChange() {
    if (document.hidden && this.currentGame) {
      this.pauseGame();
    }
  }

  // Show error message
  showError(message) {
    const errorDiv = Utils.createElement('div', 'error-message');
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.1);
        border: 2px solid #FF0000;
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        z-index: 1000;
        backdrop-filter: blur(10px);
      ">
        <h3 style="color: #FF0000; margin-bottom: 10px;">Error</h3>
        <p style="color: #FFFFFF; margin-bottom: 20px;">${message}</p>
        <button onclick="location.reload()" style="
          background: transparent;
          border: 1px solid #FF0000;
          color: #FF0000;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        ">Reload Page</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
  }

  // Cleanup
  destroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.currentGame) {
      GameEvents.emit('gameEnded');
    }
  }
}

// Create global game manager instance
window.GameManager = new GameManager();

// Expose the init method globally for easier access
window.GameManager.init = window.GameManager.init.bind(window.GameManager);
