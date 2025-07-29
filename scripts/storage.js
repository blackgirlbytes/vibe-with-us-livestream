// VIBE WITH US - Simple Storage (No localStorage for now)

class GameStorage {
    constructor() {
        // Simple in-memory storage for this basic implementation
        this.data = {
            currentLevel: 1,
            scores: {},
            achievements: [],
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                difficulty: 'normal'
            },
            progress: {
                levelsCompleted: 0,
                totalScore: 0,
                bestScore: 0,
                playTime: 0
            }
        };
    }

    // Get data by key
    get(key) {
        return this.data[key];
    }

    // Set data by key
    set(key, value) {
        this.data[key] = value;
        return true;
    }

    // Get nested data
    getNested(path) {
        const keys = path.split('.');
        let current = this.data;
        
        for (let key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return undefined;
            }
        }
        
        return current;
    }

    // Set nested data
    setNested(path, value) {
        const keys = path.split('.');
        let current = this.data;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return true;
    }

    // Save score for a level
    saveScore(level, score) {
        if (!this.data.scores[level] || score > this.data.scores[level]) {
            this.data.scores[level] = score;
            
            // Update best score
            if (score > this.data.progress.bestScore) {
                this.data.progress.bestScore = score;
            }
            
            // Update total score
            this.data.progress.totalScore += score;
            
            return true;
        }
        return false;
    }

    // Get score for a level
    getScore(level) {
        return this.data.scores[level] || 0;
    }

    // Get best score across all levels
    getBestScore() {
        return this.data.progress.bestScore;
    }

    // Update current level
    setCurrentLevel(level) {
        this.data.currentLevel = level;
        
        // Update levels completed
        if (level > this.data.progress.levelsCompleted) {
            this.data.progress.levelsCompleted = level - 1;
        }
    }

    // Get current level
    getCurrentLevel() {
        return this.data.currentLevel;
    }

    // Check if level is unlocked
    isLevelUnlocked(level) {
        return level <= this.data.progress.levelsCompleted + 1;
    }

    // Add achievement
    addAchievement(achievement) {
        if (!this.data.achievements.includes(achievement.id)) {
            this.data.achievements.push(achievement.id);
            return true;
        }
        return false;
    }

    // Check if achievement is unlocked
    hasAchievement(achievementId) {
        return this.data.achievements.includes(achievementId);
    }

    // Get all achievements
    getAchievements() {
        return [...this.data.achievements];
    }

    // Update settings
    updateSetting(key, value) {
        this.data.settings[key] = value;
    }

    // Get setting
    getSetting(key) {
        return this.data.settings[key];
    }

    // Get all settings
    getSettings() {
        return { ...this.data.settings };
    }

    // Get progress data
    getProgress() {
        return { ...this.data.progress };
    }

    // Calculate progress percentage
    getProgressPercentage() {
        const totalLevels = 7; // We have 7 levels
        return Math.floor((this.data.progress.levelsCompleted / totalLevels) * 100);
    }

    // Reset all data
    reset() {
        this.data = {
            currentLevel: 1,
            scores: {},
            achievements: [],
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                difficulty: 'normal'
            },
            progress: {
                levelsCompleted: 0,
                totalScore: 0,
                bestScore: 0,
                playTime: 0
            }
        };
    }

    // Reset level progress only
    resetProgress() {
        this.data.currentLevel = 1;
        this.data.scores = {};
        this.data.achievements = [];
        this.data.progress = {
            levelsCompleted: 0,
            totalScore: 0,
            bestScore: 0,
            playTime: 0
        };
    }

    // Export data (for debugging)
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    // Import data (for debugging)
    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);
            this.data = { ...this.data, ...importedData };
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    // Get game statistics
    getStats() {
        const totalLevels = 7;
        const completedLevels = this.data.progress.levelsCompleted;
        const totalScore = this.data.progress.totalScore;
        const bestScore = this.data.progress.bestScore;
        const achievements = this.data.achievements.length;
        
        return {
            totalLevels,
            completedLevels,
            totalScore,
            bestScore,
            achievements,
            progressPercentage: this.getProgressPercentage()
        };
    }
}

// Create global storage instance
const gameStorage = new GameStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameStorage, gameStorage };
} else {
    window.GameStorage = GameStorage;
    window.gameStorage = gameStorage;
}
