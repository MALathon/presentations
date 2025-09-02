// Accessibility Manager - Comprehensive keyboard and screen reader support
class AccessibilityManager {
  constructor() {
    this.announcer = null;
    this.shortcuts = new Map();
    this.focusTrap = null;
    this.mode = 'enhanced'; // 'enhanced' | 'reader' | 'minimal'
    
    this.init();
  }
  
  init() {
    // Create screen reader announcer
    this.createAnnouncer();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Initialize focus management
    this.initFocusManagement();
    
    // Setup skip links
    this.setupSkipLinks();
  }
  
  createAnnouncer() {
    // Create live region for screen reader announcements
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('role', 'status');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.announcer);
    
    // Create assertive announcer for critical messages
    this.assertiveAnnouncer = document.createElement('div');
    this.assertiveAnnouncer.setAttribute('role', 'alert');
    this.assertiveAnnouncer.setAttribute('aria-live', 'assertive');
    this.assertiveAnnouncer.className = 'sr-only';
    this.assertiveAnnouncer.style.cssText = this.announcer.style.cssText;
    document.body.appendChild(this.assertiveAnnouncer);
  }
  
  announce(message, priority = 'polite') {
    const announcer = priority === 'assertive' ? this.assertiveAnnouncer : this.announcer;
    
    // Clear and set new message (ensures announcement)
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
  
  setupKeyboardShortcuts() {
    // Global shortcuts
    this.shortcuts.set('Alt+N', { 
      action: 'nextSlide', 
      description: 'Go to next slide' 
    });
    this.shortcuts.set('Alt+P', { 
      action: 'previousSlide', 
      description: 'Go to previous slide' 
    });
    this.shortcuts.set('Alt+O', { 
      action: 'overviewMode', 
      description: 'Toggle overview mode' 
    });
    this.shortcuts.set('Alt+F', { 
      action: 'fullscreen', 
      description: 'Toggle fullscreen' 
    });
    this.shortcuts.set('Alt+S', { 
      action: 'skipAnimations', 
      description: 'Skip animations on current slide' 
    });
    this.shortcuts.set('Alt+H', { 
      action: 'help', 
      description: 'Show help menu' 
    });
    this.shortcuts.set('?', { 
      action: 'showShortcuts', 
      description: 'Show keyboard shortcuts' 
    });
    this.shortcuts.set('Escape', { 
      action: 'escape', 
      description: 'Exit current mode' 
    });
    
    // Navigation shortcuts
    this.shortcuts.set('Home', { 
      action: 'firstSlide', 
      description: 'Go to first slide' 
    });
    this.shortcuts.set('End', { 
      action: 'lastSlide', 
      description: 'Go to last slide' 
    });
    this.shortcuts.set('PageUp', { 
      action: 'previousSection', 
      description: 'Go to previous section' 
    });
    this.shortcuts.set('PageDown', { 
      action: 'nextSection', 
      description: 'Go to next section' 
    });
    
    // Listen for keyboard events
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  handleKeyboard(event) {
    // Build shortcut string
    const keys = [];
    if (event.altKey) keys.push('Alt');
    if (event.ctrlKey) keys.push('Ctrl');
    if (event.shiftKey) keys.push('Shift');
    if (event.metaKey) keys.push('Meta');
    
    // Add the actual key
    if (event.key === ' ') {
      keys.push('Space');
    } else if (event.key.length === 1) {
      keys.push(event.key.toUpperCase());
    } else {
      keys.push(event.key);
    }
    
    const shortcut = keys.join('+');
    
    // Check if shortcut exists
    if (this.shortcuts.has(shortcut)) {
      event.preventDefault();
      const { action } = this.shortcuts.get(shortcut);
      this.executeAction(action);
    }
  }
  
  executeAction(action) {
    // Dispatch custom event for the application to handle
    window.dispatchEvent(new CustomEvent('accessibilityAction', {
      detail: { action }
    }));
    
    // Announce action to screen reader
    const actionMessages = {
      nextSlide: 'Moving to next slide',
      previousSlide: 'Moving to previous slide',
      overviewMode: 'Toggling overview mode',
      fullscreen: 'Toggling fullscreen',
      skipAnimations: 'Skipping animations',
      help: 'Opening help menu',
      showShortcuts: 'Showing keyboard shortcuts',
      firstSlide: 'Moving to first slide',
      lastSlide: 'Moving to last slide'
    };
    
    if (actionMessages[action]) {
      this.announce(actionMessages[action]);
    }
  }
  
  initFocusManagement() {
    // Add focus visible styles
    const style = document.createElement('style');
    style.textContent = `
      /* High contrast focus indicators */
      *:focus {
        outline: 3px solid #0073CF !important;
        outline-offset: 2px !important;
      }
      
      /* Remove outline for mouse users */
      *:focus:not(:focus-visible) {
        outline: none !important;
      }
      
      /* Ensure focus visible for keyboard users */
      *:focus-visible {
        outline: 3px solid #0073CF !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(0, 115, 207, 0.2) !important;
      }
      
      /* Skip links */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #003B71;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 100000;
        border-radius: 0 0 4px 0;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);
  }
  
  setupSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    const skipToNav = document.createElement('a');
    skipToNav.href = '#navigation';
    skipToNav.className = 'skip-link';
    skipToNav.textContent = 'Skip to navigation';
    document.body.insertBefore(skipToNav, document.body.firstChild);
  }
  
  trapFocus(container) {
    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    // Trap focus handler
    const trapHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', trapHandler);
    
    // Store for cleanup
    this.focusTrap = { container, handler: trapHandler };
    
    // Focus first element
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }
  
  releaseFocusTrap() {
    if (this.focusTrap) {
      this.focusTrap.container.removeEventListener('keydown', this.focusTrap.handler);
      this.focusTrap = null;
    }
  }
  
  // Announce slide change
  announceSlide(slideNumber, totalSlides, slideTitle) {
    const message = `Slide ${slideNumber} of ${totalSlides}: ${slideTitle}`;
    this.announce(message);
  }
  
  // Get help text for shortcuts
  getShortcutsHelp() {
    const shortcuts = [];
    this.shortcuts.forEach((value, key) => {
      shortcuts.push(`${key}: ${value.description}`);
    });
    return shortcuts;
  }
  
  // Set accessibility mode
  setMode(mode) {
    this.mode = mode;
    
    const modeMessages = {
      enhanced: 'Enhanced accessibility mode enabled',
      reader: 'Reader mode enabled - simplified layout',
      minimal: 'Minimal accessibility mode'
    };
    
    this.announce(modeMessages[mode] || 'Accessibility mode changed', 'assertive');
  }
  
  // Check if reduced motion is preferred
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Check if high contrast is preferred
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
  
  // Clean up
  destroy() {
    if (this.announcer) {
      document.body.removeChild(this.announcer);
    }
    if (this.assertiveAnnouncer) {
      document.body.removeChild(this.assertiveAnnouncer);
    }
    document.removeEventListener('keydown', this.handleKeyboard);
    this.releaseFocusTrap();
  }
}

// Singleton instance
const accessibilityManager = new AccessibilityManager();

export default accessibilityManager;