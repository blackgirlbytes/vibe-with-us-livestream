// ===== LOCAL STORAGE MANAGEMENT =====

class GameStorage {
  constructor() {
    this.storageKey = 'vibeWithUs_gameData';
    this.defaultData = {
      currentLevel: 1,
      unlockedLevels: [1],
      scores: {},
      achievements: [],
      settings: {
        soundEnabled: true,
        musicEnabled: true,
        difficulty: 'normal',
        theme: 'cyberpunk'
      },
      stats: {
        totalPlayTime: 0,
        gamesCompleted: 0,
        totalScore: 0,
        bestStreak: 0
      },
      gameProgress: {
        regex: { level: 1, completed: false, bestScore: 0, bestTime: 0 },
        tetris: { level: 1, completed: false, bestScore: 0, linesCleared: 0 },
        snake: { level: 1, completed: false, bestScore: 0, maxLength: 0 },
        pong: { level: 1, completed: false, bestScore: 0, wins: 0 },
        breakout: { level: 1, completed: false, bestScore: 0, blocksDestroyed: 0 },
        invaders: { level: 1, completed: false, bestScore: 0, aliensDefeated: 0 },
        final: { level: 1, completed: false, bestScore: 0, timesSurvived: 0 }
      },
      lastPlayed: null,
      version: '1.0.0'
    };
  }

  // Initialize storage
  init() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        this.saveData(this.defaultData);
        return this.defaultData;
      }
      
      const data = JSON.parse(stored);
      // Merge with default data to ensure all properties exist
      return this.mergeWithDefaults(data);
    } catch (error) {
      if (window.Utils) {
        Utils.handleError(error, 'GameStorage.init');
      } else {
        console.error('GameStorage.init error:', error);
      }
      return this.defaultData;
    }
  }

  // Merge stored data with defaults to handle version updates
  mergeWithDefaults(storedData) {
    const merged = { ...this.defaultData };
    
    // Recursively merge objects
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = target[key] || {};
          deepMerge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };
    
    deepMerge(merged, storedData);
    return merged;
  }

  // Save data to localStorage
  saveData(data) {
    try {
      data.lastPlayed = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      if (window.GameEvents) {
        GameEvents.emit('dataSaved', data);
      }
      return true;
    } catch (error) {
      if (window.Utils) {
        Utils.handleError(error, 'GameStorage.saveData');
      } else {
        console.error('GameStorage.saveData error:', error);
      }
      return false;
    }
  }

  // Load data from localStorage
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.defaultData;
    } catch (error) {
      Utils.handleError(error, 'GameStorage.loadData');
      return this.defaultData;
    }
  }

  // Clear all data
  clearData() {
    try {
      localStorage.removeItem(this.storageKey);
      GameEvents.emit('dataCleared');
      return true;
    } catch (error) {
      Utils.handleError(error, 'GameStorage.clearData');
      return false;
    }
  }

  // Update specific game progress
  updateGameProgress(gameType, progressData) {
    const data = this.loadData();
    
    if (!data.gameProgress[gameType]) {
      data.gameProgress[gameType] = {};
    }
    
    // Merge progress data
    Object.assign(data.gameProgress[gameType], progressData);
    
    // Update overall stats
    if (progressData.completed && !data.gameProgress[gameType].completed) {
      data.stats.gamesCompleted++;
      this.unlockNextLevel(data);
    }
    
    if (progressData.bestScore && progressData.bestScore > (data.gameProgress[gameType].bestScore || 0)) {
      data.gameProgress[gameType].bestScore = progressData.bestScore;
    }
    
    this.saveData(data);
    GameEvents.emit('progressUpdated', { gameType, progressData });
  }

  // Unlock next level
  unlockNextLevel(data) {
    const nextLevel = data.currentLevel + 1;
    if (nextLevel <= 7 && !data.unlockedLevels.includes(nextLevel)) {
      data.unlockedLevels.push(nextLevel);
      data.currentLevel = nextLevel;
      
      // Trigger achievement
      this.addAchievement(data, {
        id: `level_${nextLevel}_unlocked`,
        title: 'Level Unlocked!',
        description: `You've unlocked level ${nextLevel}`,
        icon: '🔓',
        timestamp: new Date().toISOString()
      });
    }
  }

  // Add achievement
  addAchievement(data, achievement) {
    if (!data.achievements.find(a => a.id === achievement.id)) {
      data.achievements.push(achievement);
      GameEvents.emit('achievementUnlocked', achievement);
      Utils.showAchievement(achievement.title, achievement.description, achievement.icon);
    }
  }

  // Update score
  updateScore(gameType, score) {
    const data = this.loadData();
    
    if (!data.scores[gameType]) {
      data.scores[gameType] = [];
    }
    
    data.scores[gameType].push({
      score,
      timestamp: new Date().toISOString()
    });
    
    // Keep only top 10 scores
    data.scores[gameType].sort((a, b) => b.score - a.score);
    data.scores[gameType] = data.scores[gameType].slice(0, 10);
    
    // Update total score
    data.stats.totalScore += score;
    
    this.saveData(data);
    GameEvents.emit('scoreUpdated', { gameType, score });
  }

  // Get high scores
  getHighScores(gameType) {
    const data = this.loadData();
    return data.scores[gameType] || [];
  }

  // Get best score for a game
  getBestScore(gameType) {
    const scores = this.getHighScores(gameType);
    return scores.length > 0 ? scores[0].score : 0;
  }

  // Update settings
  updateSettings(newSettings) {
    const data = this.loadData();
    Object.assign(data.settings, newSettings);
    this.saveData(data);
    GameEvents.emit('settingsUpdated', data.settings);
  }

  // Get settings
  getSettings() {
    const data = this.loadData();
    return data.settings;
  }

  // Update play time
  updatePlayTime(seconds) {
    const data = this.loadData();
    data.stats.totalPlayTime += seconds;
    this.saveData(data);
  }

  // Get achievements
  getAchievements() {
    const data = this.loadData();
    return data.achievements;
  }

  // Check if level is unlocked
  isLevelUnlocked(level) {
    const data = this.loadData();
    return data.unlockedLevels.includes(level);
  }

  // Get current level
  getCurrentLevel() {
    const data = this.loadData();
    return data.currentLevel;
  }

  // Get game progress
  getGameProgress(gameType) {
    const data = this.loadData();
    return data.gameProgress[gameType] || {};
  }

  // Get overall progress percentage
  getOverallProgress() {
    const data = this.loadData();
    const totalGames = Object.keys(data.gameProgress).length;
    const completedGames = Object.values(data.gameProgress).filter(p => p.completed).length;
    return Math.round((completedGames / totalGames) * 100);
  }

  // Export data for backup
  exportData() {
    const data = this.loadData();
    const exportData = {
      ...data,
      exportedAt: new Date().toISOString(),
      version: this.defaultData.version
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // Import data from backup
  importData(jsonString) {
    try {
      const importedData = JSON.parse(jsonString);
      
      // Validate imported data
      if (!importedData.version || !importedData.gameProgress) {
        throw new Error('Invalid data format');
      }
      
      // Merge with current data (keep the better scores)
      const currentData = this.loadData();
      const mergedData = this.mergeImportedData(currentData, importedData);
      
      this.saveData(mergedData);
      GameEvents.emit('dataImported', mergedData);
      return true;
    } catch (error) {
      Utils.handleError(error, 'GameStorage.importData');
      return false;
    }
  }

  // Merge imported data with current data
  mergeImportedData(current, imported) {
    const merged = { ...current };
    
    // Merge unlocked levels (take the maximum)
    merged.unlockedLevels = [...new Set([...current.unlockedLevels, ...imported.unlockedLevels])];
    merged.currentLevel = Math.max(current.currentLevel, imported.currentLevel);
    
    // Merge achievements
    const achievementIds = new Set(current.achievements.map(a => a.id));
    imported.achievements.forEach(achievement => {
      if (!achievementIds.has(achievement.id)) {
        merged.achievements.push(achievement);
      }
    });
    
    // Merge game progress (keep best scores)
    Object.keys(imported.gameProgress).forEach(gameType => {
      const currentProgress = current.gameProgress[gameType] || {};
      const importedProgress = imported.gameProgress[gameType];
      
      merged.gameProgress[gameType] = {
        ...currentProgress,
        level: Math.max(currentProgress.level || 1, importedProgress.level || 1),
        completed: currentProgress.completed || importedProgress.completed,
        bestScore: Math.max(currentProgress.bestScore || 0, importedProgress.bestScore || 0),
        bestTime: currentProgress.bestTime && importedProgress.bestTime ? 
          Math.min(currentProgress.bestTime, importedProgress.bestTime) : 
          currentProgress.bestTime || importedProgress.bestTime || 0
      };
    });
    
    // Merge stats (take the maximum values)
    merged.stats = {
      totalPlayTime: Math.max(current.stats.totalPlayTime, imported.stats.totalPlayTime),
      gamesCompleted: Math.max(current.stats.gamesCompleted, imported.stats.gamesCompleted),
      totalScore: Math.max(current.stats.totalScore, imported.stats.totalScore),
      bestStreak: Math.max(current.stats.bestStreak, imported.stats.bestStreak)
    };
    
    return merged;
  }

  // Get statistics for display
  getStats() {
    const data = this.loadData();
    return {
      ...data.stats,
      overallProgress: this.getOverallProgress(),
      achievementsCount: data.achievements.length,
      lastPlayed: data.lastPlayed ? new Date(data.lastPlayed).toLocaleDateString() : 'Never'
    };
  }

  // Check for milestones and award achievements
  checkMilestones() {
    const data = this.loadData();
    const stats = data.stats;
    
    // Play time milestones
    const playTimeHours = Math.floor(stats.totalPlayTime / 3600);
    if (playTimeHours >= 1 && !data.achievements.find(a => a.id === 'playtime_1_hour')) {
      this.addAchievement(data, {
        id: 'playtime_1_hour',
        title: 'Dedicated Player',
        description: 'Played for 1 hour total',
        icon: '⏰',
        timestamp: new Date().toISOString()
      });
    }
    
    // Score milestones
    if (stats.totalScore >= 10000 && !data.achievements.find(a => a.id === 'score_10k')) {
      this.addAchievement(data, {
        id: 'score_10k',
        title: 'Score Master',
        description: 'Earned 10,000 total points',
        icon: '💯',
        timestamp: new Date().toISOString()
      });
    }
    
    // Completion milestones
    if (stats.gamesCompleted >= 3 && !data.achievements.find(a => a.id === 'games_3_complete')) {
      this.addAchievement(data, {
        id: 'games_3_complete',
        title: 'Getting Good',
        description: 'Completed 3 games',
        icon: '🎯',
        timestamp: new Date().toISOString()
      });
    }
    
    if (stats.gamesCompleted >= 7 && !data.achievements.find(a => a.id === 'all_games_complete')) {
      this.addAchievement(data, {
        id: 'all_games_complete',
        title: 'Champion of Champions',
        description: 'Completed all games!',
        icon: '👑',
        timestamp: new Date().toISOString()
      });
    }
    
    this.saveData(data);
  }
}

// Create global storage instance
window.GameStorage = new GameStorage();
