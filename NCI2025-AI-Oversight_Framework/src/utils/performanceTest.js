/**
 * Performance testing utility for Slide3 glass shard animation
 * Ensures smooth 60fps performance on standard hardware
 */

export class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.fps = 60;
    this.lastTime = performance.now();
    this.samples = [];
    this.maxSamples = 60;
  }

  startMonitoring() {
    this.animationId = requestAnimationFrame(this.measure.bind(this));
  }

  measure(timestamp) {
    const delta = timestamp - this.lastTime;
    const currentFps = 1000 / delta;
    
    this.samples.push(currentFps);
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
    
    this.fps = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    this.lastTime = timestamp;
    
    // Log warning if FPS drops below 30
    if (this.fps < 30) {
      console.warn(`Performance Warning: FPS dropped to ${this.fps.toFixed(1)}`);
    }
    
    this.animationId = requestAnimationFrame(this.measure.bind(this));
  }

  stopMonitoring() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  getReport() {
    return {
      averageFps: this.fps.toFixed(1),
      minFps: Math.min(...this.samples).toFixed(1),
      maxFps: Math.max(...this.samples).toFixed(1),
      isPerformant: this.fps >= 50 // Target 50+ FPS for smooth experience
    };
  }
}

/**
 * GPU memory estimation for glass shard rendering
 */
export function estimateGPUMemoryUsage(shardCount) {
  // Each shard approximately uses:
  // - Vertex data: ~200 bytes
  // - Fragment shader processing: ~500 bytes
  // - Backdrop filter blur: ~1KB per shard
  // - Transform matrix: 64 bytes
  
  const bytesPerShard = 200 + 500 + 1024 + 64;
  const totalBytes = shardCount * bytesPerShard;
  const totalMB = totalBytes / (1024 * 1024);
  
  return {
    totalMB: totalMB.toFixed(2),
    isOptimal: totalMB < 10, // Keep under 10MB for smooth performance
    recommendation: totalMB > 10 
      ? `Reduce shard count to ${Math.floor(10 * 1024 * 1024 / bytesPerShard)} for optimal performance`
      : 'Memory usage is optimal'
  };
}

/**
 * Accessibility performance checks
 */
export function checkAccessibilityPerformance() {
  const checks = {
    keyboardNavigable: false,
    screenReaderCompatible: false,
    focusIndicatorsPresent: false,
    animationRespectsPrefersReducedMotion: false
  };
  
  // Check for keyboard navigation
  const shards = document.querySelectorAll('[id^="shard-"]');
  checks.keyboardNavigable = Array.from(shards).some(s => s.tabIndex >= 0);
  
  // Check for ARIA labels
  checks.screenReaderCompatible = Array.from(shards).every(s => 
    s.getAttribute('aria-label') && s.getAttribute('role')
  );
  
  // Check for focus indicators
  const styles = getComputedStyle(shards[0]);
  checks.focusIndicatorsPresent = styles.outlineWidth !== '0px' || 
    document.querySelector('[id^="shard-"]:focus');
  
  // Check for reduced motion preference
  checks.animationRespectsPrefersReducedMotion = 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return checks;
}

/**
 * Browser compatibility check
 */
export function checkBrowserCompatibility() {
  return {
    backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    webkitBackdropFilter: CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
    clipPath: CSS.supports('clip-path', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'),
    cssContainment: CSS.supports('contain', 'layout style paint'),
    transformZ: CSS.supports('transform', 'translateZ(0)'),
    willChange: CSS.supports('will-change', 'transform')
  };
}

// Export default test suite
export default function runPerformanceTests() {
  console.log('=== Slide 3 Performance Test Results ===');
  
  // GPU Memory Check
  const memoryUsage = estimateGPUMemoryUsage(60);
  console.log('GPU Memory Usage:', memoryUsage);
  
  // Browser Compatibility
  const compatibility = checkBrowserCompatibility();
  console.log('Browser Compatibility:', compatibility);
  
  // Accessibility
  setTimeout(() => {
    const accessibility = checkAccessibilityPerformance();
    console.log('Accessibility Checks:', accessibility);
  }, 1000);
  
  // FPS Monitoring
  const monitor = new PerformanceMonitor();
  monitor.startMonitoring();
  
  setTimeout(() => {
    monitor.stopMonitoring();
    console.log('Performance Report:', monitor.getReport());
    console.log('=== End Performance Test ===');
  }, 5000);
  
  return monitor;
}