import React, { useState, useEffect } from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';

// Subtle float animation
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Smooth appear animation - slowed down and smoothed
const appear = keyframes`
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(20px) rotate(-2deg);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0px) rotate(0deg);
  }
`;

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  bottom: 80px;
  left: 60px;
  right: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const QuestionText = styled.h1`
  font-size: 54px;
  font-weight: 500;
  color: white;
  text-align: center;
  max-width: 900px;
  line-height: 1.2;
  margin: 0 0 80px 0;
  letter-spacing: -1px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.$withConcerns && css`
    font-size: 38px;
    margin-bottom: 50px;
    opacity: 0.9;
  `}
`;

const ConcernsCloud = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: 400px;
  display: ${props => props.$visible ? 'block' : 'none'};
`;

// Speech bubble style concerns
const Concern = styled.div`
  position: absolute;
  background: ${props => {
    const gradients = [
      'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.05))',
      'linear-gradient(135deg, rgba(74, 144, 226, 0.15), rgba(74, 144, 226, 0.05))',
      'linear-gradient(135deg, rgba(255, 107, 107, 0.12), rgba(255, 107, 107, 0.03))',
      'linear-gradient(135deg, rgba(76, 175, 80, 0.12), rgba(76, 175, 80, 0.03))',
      'linear-gradient(135deg, rgba(255, 193, 7, 0.12), rgba(255, 193, 7, 0.03))',
      'linear-gradient(135deg, rgba(156, 39, 176, 0.12), rgba(156, 39, 176, 0.03))',
    ];
    return gradients[props.$index % gradients.length];
  }};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => {
    const radiuses = ['24px 24px 24px 4px', '24px 24px 4px 24px', '24px 4px 24px 24px', '4px 24px 24px 24px'];
    return radiuses[props.$index % radiuses.length];
  }};
  padding: 18px 24px;
  color: rgba(255, 255, 255, 0.95);
  font-size: ${props => {
    const sizes = ['17px', '19px', '16px', '18px', '17px', '16px'];
    return sizes[props.$index % sizes.length];
  }};
  font-weight: ${props => props.$index % 2 === 0 ? '400' : '300'};
  line-height: 1.4;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${appear} 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${props => props.$delay}s both,
             ${float} ${props => 4 + props.$index * 0.8}s ease-in-out infinite ${props => props.$delay + 1.5}s;
  transform-origin: center;
  
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  
  &::before {
    content: '"';
    position: absolute;
    top: 8px;
    left: 12px;
    font-size: 32px;
    opacity: 0.2;
    font-family: Georgia, serif;
  }
  
  &:hover {
    transform: scale(1.08) rotate(2deg);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.15);
    z-index: 10;
  }
`;

const TriggerButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  font-weight: 300;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.5);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: rgba(255, 255, 255, 0.9);
    
    &::after {
      width: 100%;
    }
  }
  
  ${props => props.$hidden && css`
    opacity: 0;
    pointer-events: none;
  `}
`;

const Slide3 = () => {
  const [questionVisible, setQuestionVisible] = useState(true);
  const [concernsVisible, setConcernsVisible] = useState(false);

  // More natural, conversational concerns
  const concerns = [
    {
      text: "It feels like magic - we don't really understand what's happening inside",
      x: 10,
      y: 15
    },
    {
      text: "The same input doesn't always give the same output... that's scary",
      x: 55,
      y: 5
    },
    {
      text: "What if it's just amplifying all our existing prejudices?",
      x: 25,
      y: 45
    },
    {
      text: "There's so much data flowing through - who knows what it's actually learning from",
      x: 60,
      y: 40
    },
    {
      text: "It makes decisions on its own and we can't always explain why",
      x: 8,
      y: 70
    },
    {
      text: "Our institutional blind spots just get baked right into the algorithms",
      x: 50,
      y: 75
    }
  ];

  // Simple initialization
  useEffect(() => {
    // Question fades in on mount
    setQuestionVisible(true);
  }, []);

  const handleReveal = () => {
    setConcernsVisible(true);
  };

  const handleReset = () => {
    setConcernsVisible(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if we're on slide 3
      const params = new URLSearchParams(window.location.search);
      const slideIndex = params.get('slideIndex');
      
      // Only handle keys when we're on slide 3 (index 2)
      if (slideIndex !== '2') return;
      
      if (e.code === 'Space' && !concernsVisible && questionVisible) {
        e.preventDefault();
        handleReveal();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        // Reset slide to initial state
        setConcernsVisible(false);
        setQuestionVisible(false);
        setTimeout(() => setQuestionVisible(true), 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [concernsVisible, questionVisible]);

  return (
    <SlideWrapper 
      slideNumber={3} 
      slideTitle="The Central Question"
      totalSlides={20}
    >
      <MainContainer>
        {questionVisible && (
          <>
            <QuestionText $withConcerns={concernsVisible}>
              What causes angst about AI within research communities?
            </QuestionText>

            {!concernsVisible && (
              <TriggerButton onClick={handleReveal}>
                Let me share what I keep hearing...
              </TriggerButton>
            )}

            <ConcernsCloud $visible={concernsVisible}>
              {concerns.map((concern, index) => (
                <Concern
                  key={index}
                  $index={index}
                  $delay={index * 0.25}
                  $x={concern.x}
                  $y={concern.y}
                >
                  {concern.text}
                </Concern>
              ))}
            </ConcernsCloud>
          </>
        )}
      </MainContainer>
      
      <InteractionHint>
        <kbd>Space</kbd> Reveal concerns <span className="separator">•</span> <kbd>R</kbd> Reset <span className="separator">•</span> <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        Let me start with what I believe is the fundamental question underlying all AI oversight discussions: 
        What causes angst about AI within research communities?
        
        I want you to see these concerns as they emerge naturally - press space to reveal what I consistently 
        hear in my conversations with researchers, IRB members, and institutional leaders.
        
        Notice how these concerns feel visceral and personal. They're not just technical objections - they 
        represent deep anxieties about losing control, perpetuating harm, and operating in uncharted territory. 
        These are the emotional drivers behind much of the friction we see in AI oversight processes.
        
        But here's what's interesting - and what we'll explore throughout this presentation - many of these 
        concerns aren't actually unique to AI. Understanding this distinction is crucial for developing 
        proportional oversight approaches.
        
        [1.5 minutes - Acknowledge and validate concerns before reframing them]
      </Notes>
    </SlideWrapper>
  );
};

export default Slide3;