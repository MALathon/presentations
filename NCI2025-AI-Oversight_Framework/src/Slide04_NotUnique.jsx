import React, { useState, useEffect } from 'react';
import { Heading, Text, FlexBox, Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

// Professional animation definitions
const shimmer = keyframes`
  0% { 
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const flowIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px) scale(0.9);
  }
  50% {
    opacity: 0.5;
    transform: translateX(-10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideInFromRight = keyframes`
  0% {
    opacity: 0;
    transform: translateX(30px) scale(0.9);
  }
  50% {
    opacity: 0.5;
    transform: translateX(10px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const drawConnection = keyframes`
  0% {
    stroke-dashoffset: 300;
    opacity: 0;
  }
  20% {
    opacity: 0.3;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.4));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(74, 144, 226, 0.8));
    transform: scale(1.05);
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 30px; // Further reduced for better space usage
  bottom: 50px; // Before footer
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // Center vertically to use all space
  padding: 0 40px;
`;

const TitleSection = styled.div`
  text-align: center;
  margin-bottom: 30px; // Optimized spacing
  position: relative;
  z-index: 10;
`;

const MainTitle = styled(Heading)`
  color: white;
  margin-bottom: 8px;
  font-size: 48px; // Larger title
  font-weight: 700;
  letter-spacing: -0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #4A90E2, transparent);
    animation: ${shimmer} 3s ease-in-out infinite;
    background-size: 200% 100%;
  }
`;

const SubTitle = styled(Text)`
  color: rgba(255, 255, 255, 0.95);
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-top: 10px;
`;

// Main container for the parallel display
const ParallelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px; // Balanced spacing
  width: 100%;
  max-width: 1200px; // Optimal width for viewport
  margin: 0 auto;
  flex: 1; // Take available space
  justify-content: center; // Center vertically within available space
`;

// Individual row for each parallel
const ParallelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 25px; // Balanced gap
  align-items: center;
  opacity: 0;
  animation: ${flowIn} 0.8s ease-out ${props => props.$delay}s forwards;
  position: relative;
  min-height: 80px; // Slightly reduced for better fit
  
  ${props => props.$isActive && css`
    z-index: 5;
  `}
`;

// AI Challenge Card (left side)
const ChallengeCard = styled.div`
  background: ${props => props.$isActive ? 
    'linear-gradient(135deg, rgba(0, 61, 166, 0.2) 0%, rgba(74, 144, 226, 0.15) 100%)' :
    'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isActive ?
    'rgba(74, 144, 226, 0.5)' :
    'rgba(255, 255, 255, 0.15)'};
  border-radius: 16px;
  padding: 18px 24px; // Balanced padding
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(74, 144, 226, 0.1),
      transparent
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  ${props => props.$isActive && css`
    transform: translateX(-5px) scale(1.02);
    box-shadow: 
      -5px 5px 20px rgba(0, 61, 166, 0.2),
      0 0 40px rgba(74, 144, 226, 0.1);
    
    &::before {
      transform: translateX(100%);
    }
  `}
  
  &:hover {
    transform: translateX(-3px) scale(1.01);
    border-color: rgba(74, 144, 226, 0.4);
    background: linear-gradient(135deg, rgba(0, 61, 166, 0.15) 0%, rgba(74, 144, 226, 0.1) 100%);
  }
`;

// SVG Icon Container
const IconWrapper = styled.div`
  width: 44px;
  height: 44px; // Larger icons for better visibility
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
    ${props => props.$isActive && css`
      animation: ${pulseGlow} 2s ease-in-out infinite;
    `}
  }
`;

// Challenge Text
const ChallengeText = styled.div`
  flex: 1;
`;

const ChallengeTitle = styled.div`
  font-size: 18px; // Increased from 16px
  font-weight: 600;
  color: white;
  line-height: 1.3;
  margin-bottom: 4px;
`;

const ChallengeSubtext = styled.div`
  font-size: 14px; // Increased from 12px
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
`;

// Connection Visual (center)
const ConnectionWrapper = styled.div`
  width: 120px; // Wider connection area
  height: 70px; // Taller for better visual balance
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ConnectionSVG = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
  
  .connection-path {
    stroke: ${props => props.$isActive ? '#4A90E2' : 'rgba(255, 255, 255, 0.35)'};
    stroke-width: 3; // Increased from 2 for better visibility
    fill: none;
    stroke-dasharray: 200; // Adjusted for smoother animation
    stroke-dashoffset: ${props => props.$isActive ? 0 : 200};
    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); // Smoother timing
    ${props => props.$isActive && css`
      animation: ${drawConnection} 1.5s ease-out forwards; // Slightly longer
      filter: drop-shadow(0 0 8px rgba(74, 144, 226, 0.6)); // Enhanced glow
    `}
  }
  
  .arrow-head {
    fill: ${props => props.$isActive ? '#4A90E2' : 'rgba(255, 255, 255, 0.35)'};
    transition: all 0.5s ease; // Longer transition
    transform-origin: center;
  }
  
  .pulse-dot {
    fill: #4A90E2;
    opacity: ${props => props.$isActive ? 1 : 0};
  }
`;

// Domain Example Card (right side)
const DomainCard = styled.div`
  background: ${props => props.$isActive ?
    'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 250, 0.95) 100%)' :
    'rgba(255, 255, 255, 0.05)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isActive ?
    'rgba(255, 255, 255, 0.8)' :
    'rgba(255, 255, 255, 0.15)'};
  border-radius: 16px;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.$isActive && css`
    transform: translateX(5px) scale(1.02);
    box-shadow: 
      5px 5px 20px rgba(0, 0, 0, 0.1),
      0 0 40px rgba(255, 255, 255, 0.1);
  `}
  
  &:hover {
    transform: translateX(3px) scale(1.01);
    border-color: rgba(255, 255, 255, 0.4);
    background: ${props => props.$isActive ?
      'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(252, 252, 252, 0.98) 100%)' :
      'rgba(255, 255, 255, 0.08)'};
  }
`;

const DomainHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
`;

const DomainBadge = styled.div`
  background: ${props => props.$color};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DomainTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$isActive ? '#001A4D' : 'rgba(255, 255, 255, 0.9)'};
`;

const DomainDetail = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${props => props.$isActive ? '#1A1A1A' : 'rgba(255, 255, 255, 0.75)'};
  margin-top: 2px;
`;

// Professional SVG Icons as React Components
const UnpredictableIcon = ({ color = "#4A90E2" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V12C2 16.5 4.23 20.68 8 22.3C8.5 21.5 9.14 20.74 9.84 20.03C9.31 19.83 8.81 19.55 8.36 19.17C7.5 18.5 6.73 17.62 6.11 16.58C4.47 15.29 3.5 13.65 3.5 12V7.94L12 3.36L20.5 7.94V12C20.5 12.8 20.32 13.56 20.03 14.26C20.64 14.77 21.15 15.43 21.5 16.22C21.8 15.23 22 14.15 22 13V7L12 2Z" fill={color}/>
    <path d="M12 8C10.34 8 9 9.34 9 11C9 12.31 9.84 13.41 11 13.82V16H13V13.82C14.16 13.41 15 12.31 15 11C15 9.34 13.66 8 12 8Z" fill={color}/>
    <path d="M17 18L14.5 20.5L16.08 22.08L17 21.16L17.92 22.08L19.5 20.5L17 18Z" fill={color}/>
    <circle cx="17" cy="17" r="1.5" fill={color}/>
  </svg>
);

const BlackBoxIcon = ({ color = "#4A90E2" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
    <path d="M8 12H16M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <circle cx="12" cy="12" r="3" fill={color} opacity="0.6"/>
    <path d="M2 8L4 6M22 8L20 6M2 16L4 18M22 16L20 18" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const UnknownsIcon = ({ color = "#4A90E2" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
    <path d="M12 6C10.3 6 9 7.3 9 9H11C11 8.4 11.4 8 12 8C12.6 8 13 8.4 13 9C13 9.88 11.75 9.97 11.53 11.77C11.5 12.02 11.5 12.27 11.5 12.5H13.5C13.5 12.27 13.5 12.02 13.53 11.77C13.77 9.97 15 9.88 15 9C15 7.3 13.7 6 12 6Z" fill={color}/>
    <circle cx="12" cy="15.5" r="1" fill={color}/>
    <path d="M7 12L5.5 13.5M17 12L18.5 13.5M7 12L5.5 10.5M17 12L18.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const BiasIcon = ({ color = "#4A90E2" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L6.5 11L12 20L17.5 11L12 2Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.1"/>
    <path d="M12 2L9 11H15L12 2Z" fill={color} opacity="0.3"/>
    <path d="M9 11L12 20L15 11H9Z" fill={color} opacity="0.5"/>
    <circle cx="12" cy="11" r="2" fill={color}/>
    <path d="M2 11H6.5M17.5 11H22" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

const parallels = [
  {
    ai: { 
      icon: UnpredictableIcon,
      title: 'Outcome Uncertainty',
      subtitle: 'Non-deterministic results'
    },
    domain: { 
      text: 'Risk Calculators', 
      color: '#003DA6',
      detail: 'Clinical risk scores provide probability estimates — AI extends this capability'
    }
  },
  {
    ai: { 
      icon: BlackBoxIcon,
      title: 'Limited Explainability',
      subtitle: 'Complex decision pathways'
    },
    domain: { 
      text: 'Complex Algorithms', 
      color: '#2E7D32',
      detail: 'Statistical models have inherent opacity — AI increases complexity'
    }
  },
  {
    ai: { 
      icon: UnknownsIcon,
      title: 'Data Requirements',
      subtitle: 'Extensive training sets needed'
    },
    domain: { 
      text: 'Clinical Research', 
      color: '#E65100',
      detail: 'Large studies require thousands of records — AI requires millions'
    }
  },
  {
    ai: { 
      icon: BiasIcon,
      title: 'Potential Bias',
      subtitle: 'Training data limitations'
    },
    domain: { 
      text: 'All Research', 
      color: '#6A1B9A',
      detail: 'Selection bias exists in all research — AI propagates it at scale'
    }
  }
];

const Slide4 = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [revealStep, setRevealStep] = useState(1); // Start with content visible
  
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if we're on slide 4
      const params = new URLSearchParams(window.location.search);
      const slideIndex = params.get('slideIndex');
      
      // Only handle keys when we're on slide 4 (index 3)
      if (slideIndex !== '3') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        // Progressive reveal: first show all rows, then cycle through highlighting
        if (revealStep === 0) {
          setRevealStep(1); // Show all rows
        } else if (revealStep === 1) {
          setActiveIndex(0); // Start highlighting
          setRevealStep(2);
        } else if (revealStep === 2) {
          // Cycle through highlights
          setActiveIndex(prev => {
            if (prev === 3) {
              setRevealStep(3); // All shown, no highlight
              return null;
            }
            return prev + 1;
          });
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        // Reset to initial state showing content
        setRevealStep(1);
        setActiveIndex(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [revealStep]);

  const handleRowClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <SlideWrapper 
      slideNumber={4}
      slideTitle="Not Unique to AI"
      totalSlides={20}
    >
      <ContentWrapper>
        <TitleSection>
          <SubTitle>Traditional research challenges persist in AI — amplified by scale and speed</SubTitle>
        </TitleSection>
        
        <ParallelContainer>
          {parallels.map((parallel, index) => {
            const Icon = parallel.ai.icon;
            const isVisible = revealStep >= 1;
            const isActive = activeIndex === index;
            
            return (
              <ParallelRow 
                key={index}
                $delay={index * 0.2}
                $isActive={isActive}
                style={{ opacity: isVisible ? 1 : 0 }}
              >
                <ChallengeCard
                  $isActive={isActive}
                  onClick={() => handleRowClick(index)}
                >
                  <IconWrapper $isActive={isActive}>
                    <Icon color={isActive ? "#4A90E2" : "rgba(255, 255, 255, 0.8)"} />
                  </IconWrapper>
                  <ChallengeText>
                    <ChallengeTitle>{parallel.ai.title}</ChallengeTitle>
                    <ChallengeSubtext>{parallel.ai.subtitle}</ChallengeSubtext>
                  </ChallengeText>
                </ChallengeCard>
                
                <ConnectionWrapper>
                  <ConnectionSVG $isActive={isActive}>
                    <defs>
                      <marker
                        id={`arrow-${index}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3, 0 6"
                          className="arrow-head"
                        />
                      </marker>
                    </defs>
                    <path
                      className="connection-path"
                      d="M 10 30 Q 50 30 90 30"
                      markerEnd={`url(#arrow-${index})`}
                    />
                    {isActive && (
                      <>
                        <circle className="pulse-dot" cx="30" cy="40" r="3">
                          <animate
                            attributeName="cx"
                            from="20"
                            to="100"
                            dur="1.5s"
                            repeatCount="3"
                          />
                          <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            dur="1.5s"
                            repeatCount="3"
                          />
                        </circle>
                      </>
                    )}
                  </ConnectionSVG>
                </ConnectionWrapper>
                
                <DomainCard
                  $isActive={isActive}
                  onClick={() => handleRowClick(index)}
                >
                  <DomainHeader>
                    <DomainBadge $color={parallel.domain.color}>
                      {parallel.domain.text}
                    </DomainBadge>
                    <DomainTitle $isActive={isActive}>
                      Proven Framework
                    </DomainTitle>
                  </DomainHeader>
                  <DomainDetail $isActive={isActive}>
                    {parallel.domain.detail}
                  </DomainDetail>
                </DomainCard>
              </ParallelRow>
            );
          })}
        </ParallelContainer>
      </ContentWrapper>
      
      <Notes>
        But here's the thing – while I don't disagree with any of these concerns, 
        I don't think they're unique to AI or machine learning. 
        
        Clinical trials have unpredictable outcomes. Sociological research deals with 
        complex "black box" human behaviors. Medical devices operate with significant unknowns. 
        Statistical models have always had the potential to encode biases.
        
        Yet we've developed frameworks to address these challenges in other domains.
      </Notes>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
    </SlideWrapper>
  );
};

export default Slide4;