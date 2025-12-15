import React from 'react';

// Standardized interaction hint component for all slides
// This is a marker component - the actual content will be moved to footer by SlideWrapper
const InteractionHint = ({ children }) => {
  // Return a hidden div with a special marker that SlideWrapper can detect
  return React.createElement('div', {
    'data-interaction-hint': 'true',
    style: { display: 'none' }
  }, children);
};

InteractionHint.displayName = 'InteractionHint';

export default InteractionHint;
