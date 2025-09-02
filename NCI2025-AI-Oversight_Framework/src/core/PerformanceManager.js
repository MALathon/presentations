// Performance Manager - Implements LOD system and performance monitoring
class PerformanceManager {
  constructor() {
    this.level = 'HIGH';
    this.fps = 60;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.measurements = [];
    this.animationBudget = {
      cssAnimations: 0.6,
      jsAnimations: 0.3,
      particleEffects: 0.1
    };
    
    // Performance thresholds
    this.thresholds = {
      HIGH: { minFPS: 50, particles: 1000 },
      MEDIUM: { minFPS: 30, particles: 500 },
      LOW: { minFPS: 0, particles: 0 }
    };
    
    // Start monitoring
    this.startMonitoring();
  }
  
  startMonitoring() {
    const measureFPS = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      // Calculate FPS
      const currentFPS = 1000 / delta;
      this.measurements.push(currentFPS);
      
      // Keep only last 60 measurements (1 second at 60fps)
      if (this.measurements.length > 60) {
        this.measurements.shift();
      }
      
      // Average FPS over last second
      this.fps = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
      
      // Auto-adjust performance level
      if (this.frameCount % 60 === 0) {
        this.adjustPerformanceLevel();
      }
      
      this.frameCount++;
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }
  
  adjustPerformanceLevel() {
    const previousLevel = this.level;
    
    if (this.fps < 30) {
      this.level = 'LOW';
    } else if (this.fps < 50) {
      this.level = 'MEDIUM';
    } else {
      this.level = 'HIGH';
    }
    
    if (previousLevel !== this.level) {
      this.notifyLevelChange();
    }
  }
  
  notifyLevelChange() {
    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('performanceLevelChange', {
      detail: {
        level: this.level,
        fps: this.fps,
        settings: this.getCurrentSettings()
      }
    }));
  }
  
  getCurrentSettings() {
    const settings = {
      HIGH: {
        particles: 1000,
        shadows: true,
        blur: true,
        animations: 'full',
        transitions: 'smooth',
        effects: 'all'
      },
      MEDIUM: {
        particles: 500,
        shadows: false,
        blur: false,
        animations: 'reduced',
        transitions: 'fast',
        effects: 'minimal'
      },
      LOW: {
        particles: 0,
        shadows: false,
        blur: false,
        animations: 'css-only',
        transitions: 'instant',
        effects: 'none'
      }
    };
    
    return settings[this.level];
  }
  
  canUseFeature(feature) {
    const featureRequirements = {
      particles: ['HIGH', 'MEDIUM'],
      complexAnimations: ['HIGH'],
      blur: ['HIGH'],
      shadows: ['HIGH'],
      transitions3D: ['HIGH', 'MEDIUM']
    };
    
    return featureRequirements[feature]?.includes(this.level) ?? false;
  }
  
  // Get current animation budget allocation
  getAnimationBudget() {
    if (this.level === 'LOW') {
      return {
        cssAnimations: 1.0,
        jsAnimations: 0,
        particleEffects: 0
      };
    }
    
    if (this.level === 'MEDIUM') {
      return {
        cssAnimations: 0.8,
        jsAnimations: 0.2,
        particleEffects: 0
      };
    }
    
    return this.animationBudget;
  }
  
  // Measure specific operation performance
  measureOperation(name, operation) {
    const start = performance.now();
    const result = operation();
    const duration = performance.now() - start;
    
    // Log slow operations
    if (duration > 16.67) { // Longer than 1 frame at 60fps
      console.warn(`Slow operation "${name}": ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
  
  // Get performance report
  getReport() {
    return {
      currentFPS: Math.round(this.fps),
      performanceLevel: this.level,
      settings: this.getCurrentSettings(),
      animationBudget: this.getAnimationBudget(),
      averageFrameTime: (1000 / this.fps).toFixed(2) + 'ms'
    };
  }
}

// Singleton instance
const performanceManager = new PerformanceManager();

export default performanceManager;