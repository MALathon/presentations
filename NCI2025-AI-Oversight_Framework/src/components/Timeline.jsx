import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Activity, Beaker, Microscope, Stethoscope, Users } from 'lucide-react';

const TimelineContainer = styled.div`
  width: 100%;
  padding: 40px 0;
  position: relative;
`;

const TimelineLine = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1a2a6c 0%, #0073cf 50%, #27ae60 100%);
  transform: translateY(-50%);
`;

const StagesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Stage = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 3px solid ${props => props.borderColor || '#1a2a6c'};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const StageLabel = styled(motion.div)`
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
`;

const IRBMarker = styled(motion.div)`
  position: absolute;
  top: -80px;
  left: 60%;
  transform: translateX(-50%);
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #e74c3c;
  }
`;

const Timeline = ({ showIRB = true, stages = [] }) => {
  const defaultStages = [
    { icon: Beaker, label: 'Lab\nResearch', color: '#1a2a6c' },
    { icon: Microscope, label: 'Petri Dish\nTesting', color: '#0073cf' },
    { icon: Activity, label: 'Animal\nStudies', color: '#8e44ad' },
    { icon: Stethoscope, label: 'First-in-\nHuman', color: '#27ae60' },
    { icon: Users, label: 'Clinical\nTrials', color: '#f39c12' },
  ];

  const stagesData = stages.length > 0 ? stages : defaultStages;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <TimelineContainer>
      <TimelineLine
        initial="hidden"
        animate="visible"
        variants={lineVariants}
      />
      
      <StagesContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {stagesData.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <Stage key={index} variants={stageVariants}>
              <IconWrapper
                borderColor={stage.color}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={36} color={stage.color} />
              </IconWrapper>
              <StageLabel>
                {stage.label.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </StageLabel>
            </Stage>
          );
        })}
      </StagesContainer>
      
      {showIRB && (
        <IRBMarker
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
        >
          IRB OVERSIGHT BEGINS
        </IRBMarker>
      )}
    </TimelineContainer>
  );
};

export default Timeline;