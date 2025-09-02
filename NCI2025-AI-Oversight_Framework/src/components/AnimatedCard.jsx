import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const CardWrapper = styled(motion.div)`
  position: relative;
  border-radius: 16px;
  background: ${props => props.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  padding: 2px;
  cursor: pointer;
  overflow: hidden;
`;

const CardContent = styled(motion.div)`
  background: white;
  border-radius: 14px;
  padding: 24px;
  position: relative;
  z-index: 1;
  height: 100%;
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at center, rgba(102, 126, 234, 0.4), transparent);
  opacity: 0;
  filter: blur(40px);
  z-index: -1;
`;

const AnimatedCard = ({ children, gradient, className, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setMousePosition({ x, y });
    }
  };

  const rotateX = isHovered ? -(mousePosition.y / 300) * 10 : 0;
  const rotateY = isHovered ? (mousePosition.x / 300) * 10 : 0;

  return (
    <CardWrapper
      ref={cardRef}
      background={gradient}
      className={className}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      initial={{ scale: 1 }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
    >
      <GlowEffect
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <CardContent>
        {children}
      </CardContent>
    </CardWrapper>
  );
};

export default AnimatedCard;