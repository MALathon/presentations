import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to manage slide animations based on visibility
 * Ensures animations only start when the slide is actually visible
 * Resets animations to beginning when navigating to a slide
 */
export const useSlideAnimation = (maxSteps = 1, slideId = null) => {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simple visibility check
    const checkVisibility = () => {
      const params = new URLSearchParams(window.location.search);
      const currentSlideIndex = params.get('slideIndex');
      const slideNumber = currentSlideIndex ? parseInt(currentSlideIndex) + 1 : 0;
      
      // Extract slide number from slideId (e.g., 'slide-2-speaker' -> 2)
      const mySlideNumber = slideId ? parseInt(slideId.match(/\d+/)?.[0] || '0') : 0;
      
      setIsVisible(slideNumber === mySlideNumber);
    };
    
    // Check immediately and periodically
    checkVisibility();
    const interval = setInterval(checkVisibility, 100);
    
    return () => clearInterval(interval);
  }, [slideId]);
  
  // Handle keyboard navigation for step-through animations
  useEffect(() => {
    if (!isVisible) return;
    
    const handleKeyDown = (event) => {
      // Check if we're the visible slide
      const params = new URLSearchParams(window.location.search);
      const currentSlideIndex = params.get('slideIndex');
      const slideNumber = currentSlideIndex ? parseInt(currentSlideIndex) + 1 : 0;
      const mySlideNumber = slideId ? parseInt(slideId.match(/\d+/)?.[0] || '0') : 0;
      
      if (slideNumber !== mySlideNumber) return;
      
      // Only handle Space for stepping through animations, not arrows
      // Let Spectacle handle arrow navigation
      if (event.code === 'Space') {
        // Only prevent default if we have more steps to show
        if (step < maxSteps) {
          event.preventDefault();
          setStep(prev => Math.min(prev + 1, maxSteps));
        }
      } else if (event.key === 'r' || event.key === 'R') {
        setStep(0);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, maxSteps, slideId, step]);
  
  return {
    step,
    isVisible,
    setStep,
    // Helper to check if a specific step is active
    isStepActive: (stepNumber) => isVisible && step >= stepNumber,
    // Reset animation for current slide
    reset: () => setStep(0)
  };
};

export default useSlideAnimation;