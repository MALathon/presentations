import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CloudContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Word = styled(motion.span)`
  position: absolute;
  font-weight: ${props => props.weight || 400};
  font-size: ${props => props.size || '16px'};
  color: ${props => props.color || '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.2) !important;
    filter: brightness(1.2);
    z-index: 10;
  }
`;

const WordCloud = ({ words = [] }) => {
  const defaultWords = [
    { text: 'black-box', size: 48, color: '#e74c3c', weight: 700, x: 0, y: 0 },
    { text: 'bias', size: 36, color: '#1a2a6c', weight: 600, x: 150, y: -50, rotate: 15 },
    { text: 'autonomous', size: 36, color: '#0073cf', weight: 600, x: -180, y: -30, rotate: -10 },
    { text: 'non-deterministic', size: 28, color: '#8e44ad', weight: 500, x: 200, y: 80, rotate: 25 },
    { text: 'unpredictable', size: 28, color: '#27ae60', weight: 500, x: -200, y: 100, rotate: -20 },
    { text: 'privacy', size: 24, color: '#1a2a6c', weight: 400, x: 100, y: -120, rotate: 5 },
    { text: 'data volume', size: 24, color: '#e74c3c', weight: 400, x: -120, y: -100, rotate: -15 },
    { text: 'decisions', size: 20, color: '#6c757d', weight: 400, x: 180, y: 20, rotate: 30 },
    { text: 'complexity', size: 20, color: '#6c757d', weight: 400, x: -160, y: 40, rotate: -25 },
    { text: 'opacity', size: 18, color: '#adb5bd', weight: 300, x: 60, y: 60, rotate: 10 },
    { text: 'scale', size: 18, color: '#adb5bd', weight: 300, x: -80, y: 80, rotate: -5 },
    { text: 'explainability', size: 22, color: '#0073cf', weight: 400, x: 250, y: -100, rotate: 40 },
    { text: 'fairness', size: 22, color: '#8e44ad', weight: 400, x: -250, y: -80, rotate: -35 },
    { text: 'control', size: 16, color: '#adb5bd', weight: 300, x: 140, y: 140, rotate: 20 },
    { text: 'trust', size: 16, color: '#adb5bd', weight: 300, x: -140, y: 150, rotate: -30 },
    { text: 'accountability', size: 18, color: '#6c757d', weight: 300, x: 0, y: -180, rotate: 15 },
    { text: 'transparency', size: 18, color: '#6c757d', weight: 300, x: 0, y: 180, rotate: -10 },
    { text: 'regulation', size: 20, color: '#0073cf', weight: 400, x: 180, y: -160, rotate: 45 },
    { text: 'ethics', size: 20, color: '#27ae60', weight: 400, x: -180, y: -150, rotate: -40 },
  ];

  const wordsToRender = words.length > 0 ? words : defaultWords;

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <CloudContainer>
      <motion.div
        style={{ position: 'relative', width: '100%', height: '100%' }}
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {wordsToRender.map((word, index) => (
          <Word
            key={index}
            size={`${word.size}px`}
            color={word.color}
            weight={word.weight}
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${word.x}px), calc(-50% + ${word.y}px)) rotate(${word.rotate || 0}deg)`,
            }}
            variants={wordVariant}
            whileHover={{ scale: 1.3 }}
          >
            {word.text}
          </Word>
        ))}
      </motion.div>
    </CloudContainer>
  );
};

export default WordCloud;