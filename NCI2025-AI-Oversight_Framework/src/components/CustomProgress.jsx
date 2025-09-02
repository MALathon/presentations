import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  z-index: 1000;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ProgressDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$active ? 'rgba(74, 226, 192, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
  
  ${props => props.$active && `
    box-shadow: 0 0 10px rgba(74, 226, 192, 0.5);
  `}
`;

// Simple static progress indicator
// Spectacle will handle the actual navigation
const CustomProgress = () => {
  // This is a placeholder - Spectacle's built-in Progress handles the logic
  return null; // We'll use Spectacle's Progress with custom styling instead
};

export default CustomProgress;