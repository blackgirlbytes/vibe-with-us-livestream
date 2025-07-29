// ===== UTILITY FUNCTIONS =====

const Utils = {
  // DOM Utilities
  $(selector) {
    return document.querySelector(selector);
  },

  $$(selector) {
    return document.querySelectorAll(selector);
  },

  createElement(tag, className = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
  },

  // Animation Utilities
  animate(element, animation, duration = '0.5s', callback = null) {
    element.style.animationDuration = duration;
    element.classList.add(animation);
    
    const handleAnimationEnd = () => {
      element.classList.remove(animation);
      element.removeEventListener('animationend', handleAnimationEnd);
      if (callback) callback();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  },

  // Screen Transition Utilities
  transitionTo(fromScreen, toScreen, transitionType = 'fade') {
    return new Promise((resolve) => {
      // Hide current screen
      fromScreen.classList.add('animate-fadeOut');
      
      setTimeout(() => {
        fromScreen.classList.add('hidden');
        fromScreen.classList.remove('animate-fadeOut');
        
        // Show new screen
        toScreen.classList.remove('hidden');
        toScreen.classList.add('animate-fadeIn');
        
        setTimeout(() => {
          toScreen.classList.remove('animate-fadeIn');
          resolve();
        }, 500);
      }, 500);
    });
  },

  // Random Utilities
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Color Utilities
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  },

  // Time Utilities
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  formatScore(score) {
    return score.toLocaleString();
  },

  // Debounce and Throttle
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Event Utilities
  on(element, event, handler) {
    element.addEventListener(event, handler);
  },

  off(element, event, handler) {
    element.removeEventListener(event, handler);
  },

  once(element, event, handler) {
    const onceHandler = (e) => {
      handler(e);
      element.removeEventListener(event, onceHandler);
    };
    element.addEventListener(event, onceHandler);
  },

  // Particle System
  createParticle(container, x, y, color = '#00FFFF') {
    const particle = this.createElement('div', 'particle');
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = color;
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 6000);
    
    return particle;
  },

  createParticleExplosion(container, x, y, count = 10) {
    const colors = ['#00FFFF', '#FF00FF', '#32CD32', '#FFD700'];
    
    for (let i = 0; i < count; i++) {
      const offsetX = this.random(-50, 50);
      const offsetY = this.random(-50, 50);
      const color = this.randomChoice(colors);
      
      this.createParticle(container, x + offsetX, y + offsetY, color);
    }
  },

  // Sound Utilities (for future audio implementation)
  playSound(soundName, volume = 1) {
    // Placeholder for sound system
    console.log(`Playing sound: ${soundName} at volume: ${volume}`);
  },

  // Achievement System Helpers
  showAchievement(title, description, icon = '🏆') {
    const notification = this.$('#achievement-notification');
    const titleEl = this.$('#achievement-title');
    const descEl = this.$('#achievement-description');
    const iconEl = notification.querySelector('.achievement-icon');
    
    titleEl.textContent = title;
    descEl.textContent = description;
    iconEl.textContent = icon;
    
    notification.classList.remove('hidden');
    notification.classList.add('animate-slideInRight');
    
    setTimeout(() => {
      notification.classList.add('animate-slideOutRight');
      setTimeout(() => {
        notification.classList.add('hidden');
        notification.classList.remove('animate-slideInRight', 'animate-slideOutRight');
      }, 500);
    }, 3000);
  },

  // Loading Utilities
  updateLoadingProgress(percentage, text = '') {
    const progressBar = this.$('#loading-progress');
    const loadingText = this.$('#loading-text');
    
    if (progressBar) {
      progressBar.style.width = percentage + '%';
    }
    
    if (text && loadingText) {
      loadingText.textContent = text;
    }
  },

  // Keyboard Utilities
  isKeyPressed(key, pressedKeys) {
    return pressedKeys.has(key.toLowerCase());
  },

  // Mobile Detection
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Touch Utilities
  getTouchPos(canvas, touchEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  },

  // Canvas Utilities
  getCanvasContext(canvas, contextType = '2d') {
    return canvas.getContext(contextType);
  },

  clearCanvas(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
  },

  drawRect(ctx, x, y, width, height, color = '#FFFFFF') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  },

  drawCircle(ctx, x, y, radius, color = '#FFFFFF') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  },

  drawText(ctx, text, x, y, font = '16px Arial', color = '#FFFFFF', align = 'left') {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  },

  // Math Utilities
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  },

  distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  },

  angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  },

  // Vector Utilities
  normalizeVector(x, y) {
    const length = Math.sqrt(x * x + y * y);
    return length > 0 ? { x: x / length, y: y / length } : { x: 0, y: 0 };
  },

  // Collision Detection
  rectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  },

  circleCollision(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
  },

  // Performance Utilities
  requestAnimationFrame(callback) {
    return window.requestAnimationFrame(callback);
  },

  cancelAnimationFrame(id) {
    window.cancelAnimationFrame(id);
  },

  // Error Handling
  handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    // In production, you might want to send this to an error tracking service
  },

  // URL Utilities
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
  }
};

// Global event system for communication between modules
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    
    const index = this.events[event].indexOf(callback);
    if (index > -1) {
      this.events[event].splice(index, 1);
    }
  }

  emit(event, data = null) {
    if (!this.events[event]) return;
    
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        Utils.handleError(error, `Event: ${event}`);
      }
    });
  }

  once(event, callback) {
    const onceCallback = (data) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// Global event emitter instance
window.GameEvents = new EventEmitter();

// Export utilities for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Utils, EventEmitter };
}
