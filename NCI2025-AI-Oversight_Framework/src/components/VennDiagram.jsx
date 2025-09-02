import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const SVGContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 500px;
  position: relative;
`;

const VennDiagram = ({ animate = true }) => {
  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 0.7,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.3,
        duration: 0.5,
      },
    }),
  };

  return (
    <SVGContainer>
      <svg viewBox="0 0 600 500" style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Circles */}
        <motion.circle
          cx="200"
          cy="200"
          r="120"
          fill="#1a2a6c"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={circleVariants}
        />
        <motion.circle
          cx="300"
          cy="200"
          r="120"
          fill="#0073cf"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={circleVariants}
        />
        <motion.circle
          cx="250"
          cy="280"
          r="120"
          fill="#8e44ad"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={circleVariants}
        />
        <motion.circle
          cx="350"
          cy="280"
          r="120"
          fill="#27ae60"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={circleVariants}
        />
        
        {/* Center highlight */}
        <motion.circle
          cx="275"
          cy="240"
          r="30"
          fill="#f39c12"
          filter="url(#glow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />
        
        {/* Labels */}
        <motion.text
          x="150"
          y="150"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Academic
          <tspan x="150" dy="20">Research</tspan>
        </motion.text>
        
        <motion.text
          x="350"
          y="150"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Industry
          <tspan x="350" dy="20">Development</tspan>
        </motion.text>
        
        <motion.text
          x="200"
          y="350"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Innovation
        </motion.text>
        
        <motion.text
          x="400"
          y="350"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Research
          <tspan x="400" dy="20">Evaluation</tspan>
        </motion.text>
        
        {/* Center label */}
        <motion.text
          x="275"
          y="240"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          My Unique
          <tspan x="275" dy="14">Perspective</tspan>
        </motion.text>
      </svg>
    </SVGContainer>
  );
};

export default VennDiagram;