import React from 'react';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import useSlideAnimation from './hooks/useSlideAnimation';
import styled, { keyframes, css } from 'styled-components';

// Animation
const titleAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

// SlideContainer removed - using SlideWrapper
const SlideContainer = styled.div`
  background: radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SlideNumber = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  z-index: 10;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 40px; // Reduced from 60px - less space at top
  bottom: 50px; // Before footer
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: white;
  margin: 0 0 25px 0;
  text-align: center;
  font-weight: 300;
  opacity: 0;
  animation: ${titleAnimation} 0.8s ease-out forwards;
`;

const PhasesContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1150px;
  justify-content: center;
  position: relative;
`;

const PhaseCard = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid ${props => {
    switch(props.$phase) {
      case 1: return '#4AE2C0';
      case 2: return '#FFA500';
      case 3: return '#FF6B6B';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  opacity: ${props => props.$show ? 1 : 0};
  transform: translateY(${props => props.$show ? 0 : '30px'});
  transition: all 0.6s ease-out;
  transition-delay: ${props => props.$delay || '0s'};
`;

const PhaseHeader = styled.div`
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const PhaseNumber = styled.div`
  display: inline-block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => {
    switch(props.$phase) {
      case 1: return '#4AE2C0';
      case 2: return '#FFA500';
      case 3: return '#FF6B6B';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  color: #003B71;
  font-size: 18px;
  font-weight: bold;
  line-height: 35px;
  margin-bottom: 8px;
`;

const PhaseTitle = styled.h3`
  font-size: 16px;
  color: white;
  margin: 8px 0 4px 0;
  font-weight: 600;
`;

const PhaseSubtitle = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
`;

const PhaseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PhaseItem = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  padding-left: 12px;
  position: relative;
  line-height: 1.4;
  
  &:before {
    content: '▸';
    position: absolute;
    left: 0;
    color: ${props => {
      switch(props.$phase) {
        case 1: return '#4AE2C0';
        case 2: return '#FFA500';
        case 3: return '#FF6B6B';
        default: return 'rgba(255, 255, 255, 0.5)';
      }
    }};
  }
`;

const ArrowConnector = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%); // Center the arrow properly
  font-size: 28px; // Slightly larger for better visibility
  color: rgba(255, 255, 255, 0.6); // Slightly more visible
  z-index: 1;
  left: ${props => props.$left}%;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.6s ease-out;
  transition-delay: 0.8s;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); // Add subtle shadow for depth
`;

const ValidationRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 900px;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.6s ease-out;
  transition-delay: 1s;
`;

const ValidationBox = styled.div`
  flex: 1;
  background: rgba(74, 226, 192, 0.1);
  border: 1px solid rgba(74, 226, 192, 0.3);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
`;

const ValidationTitle = styled.div`
  font-size: 13px;
  color: #4AE2C0;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ValidationText = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
`;

// Key insight - matches slide 5 styling
const KeyInsight = styled.div`
  width: 100%;
  margin-top: 30px;
  padding: 24px 40px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.12), rgba(255, 193, 7, 0.06));
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 16px;
  text-align: center;
  max-width: 900px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.6s ease-out 0.3s both
  `};
`;

const InsightText = styled.p`
  font-size: 22px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;
  
  strong {
    color: #FFC107;
    font-weight: 600;
    background: rgba(255, 193, 7, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

const SlideClinicalPhases = () => {
  const { step } = useSlideAnimation(5, 'slide-6-clinical-phases');
  
  return (
    <SlideWrapper 
      slideNumber={6}
      slideTitle="What Makes AI Different? Phases"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <ContentWrapper>
        <Title>Phases of AI Clinical Evaluation</Title>
        
        <PhasesContainer>
          <PhaseCard $phase={1} $show={true}>
            <PhaseHeader>
              <PhaseTitle>Exploratory/Discovery</PhaseTitle>
              <PhaseSubtitle>Pre-clinical</PhaseSubtitle>
            </PhaseHeader>
            <PhaseContent>
              <PhaseItem $phase={1}>Identify study aims & hypotheses</PhaseItem>
              <PhaseItem $phase={1}>Literature searches</PhaseItem>
              <PhaseItem $phase={1}>Secondary data analysis</PhaseItem>
              <PhaseItem $phase={1}>Professional society guidelines</PhaseItem>
              <PhaseItem $phase={1}>Initial algorithm development</PhaseItem>
            </PhaseContent>
          </PhaseCard>
          
          
          <PhaseCard $phase={2} $show={true} $delay="0.2s">
            <PhaseHeader>
              <PhaseTitle>Pilot/Validation</PhaseTitle>
              <PhaseSubtitle>Early feasibility</PhaseSubtitle>
            </PhaseHeader>
            <PhaseContent>
              <PhaseItem $phase={2}>Preliminary safety assessment</PhaseItem>
              <PhaseItem $phase={2}>Performance evaluation</PhaseItem>
              <PhaseItem $phase={2}>Small study cohorts</PhaseItem>
              <PhaseItem $phase={2}>Analytical validation</PhaseItem>
              <PhaseItem $phase={2}>Clinical validation metrics</PhaseItem>
            </PhaseContent>
          </PhaseCard>
          
          
          <PhaseCard $phase={3} $show={true} $delay="0.4s">
            <PhaseHeader>
              <PhaseTitle>Intervention/Treatment</PhaseTitle>
              <PhaseSubtitle>Clinical efficacy</PhaseSubtitle>
            </PhaseHeader>
            <PhaseContent>
              <PhaseItem $phase={3}>Confirms clinical efficacy</PhaseItem>
              <PhaseItem $phase={3}>Safety & risk assessment</PhaseItem>
              <PhaseItem $phase={3}>Impacts patient care</PhaseItem>
              <PhaseItem $phase={3}>Pivotal trials</PhaseItem>
              <PhaseItem $phase={3}>Post-market surveillance</PhaseItem>
            </PhaseContent>
          </PhaseCard>
        </PhasesContainer>
        
        <ValidationRow $show={true}>
          <ValidationBox>
            <ValidationTitle>Analytical Validation</ValidationTitle>
            <ValidationText>Accuracy, Reliability, Precision</ValidationText>
          </ValidationBox>
          <ValidationBox>
            <ValidationTitle>Clinical Validation</ValidationTitle>
            <ValidationText>Sensitivity, Specificity, PPV/NPV</ValidationText>
          </ValidationBox>
          <ValidationBox>
            <ValidationTitle>Performance Monitoring</ValidationTitle>
            <ValidationText>Long-term effectiveness & safety</ValidationText>
          </ValidationBox>
        </ValidationRow>
        
          <KeyInsight $visible={true}>
            <InsightText>
              AI requires <strong>three distinct phases</strong> – each with unique validation requirements
            </InsightText>
          </KeyInsight>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        The three phases of clinical evaluation for AI systems mirror traditional 
        medical device development but with unique considerations:
        
        Phase 1: Exploratory - Algorithm development and hypothesis generation
        Phase 2: Pilot/Validation - Early safety and performance testing
        Phase 3: Intervention - Clinical efficacy and patient impact
        
        Each phase requires different validation approaches and regulatory considerations.
        
        Press Space to reveal each phase (4 steps).
      </Notes>
    </SlideWrapper>
  );
};

export default SlideClinicalPhases;