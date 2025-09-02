import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import styled, { keyframes } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

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

const slideLeft = keyframes`
  from { 
    transform: translateX(-100px);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideRight = keyframes`
  from { 
    transform: translateX(100px);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
`;

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  bottom: 80px;
  left: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
`;

const Title = styled.h1`
  font-size: 44px;
  font-weight: 500;
  color: white;
  margin: 0;
  text-align: center;
  letter-spacing: -1px;
  opacity: 0;
  animation: ${titleAnimation} 0.8s ease-out forwards;
`;

const GapContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  height: 400px;
`;

const SideContent = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible ? (props.$left ? slideLeft : slideRight) : 'none'} 0.8s ease-out;
  animation-delay: ${props => props.$delay || '0s'};
  animation-fill-mode: both;
`;

const SideLabel = styled.div`
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${props => props.$left ? '#4AE2C0' : '#8B45FF'};
  font-weight: 600;
  margin-bottom: 5px;
`;

const SideTitle = styled.h2`
  font-size: 28px;
  color: white;
  margin: 0 0 20px 0;
  font-weight: 500;
  line-height: 1.2;
`;

const LanguageBlock = styled.div`
  background: ${props => props.$left ? 
    'linear-gradient(135deg, rgba(74, 226, 192, 0.03) 0%, rgba(74, 226, 192, 0.01) 100%)' :
    'linear-gradient(135deg, rgba(139, 69, 255, 0.03) 0%, rgba(139, 69, 255, 0.01) 100%)'};
  border-left: 3px solid ${props => props.$left ? '#4AE2C0' : '#8B45FF'};
  padding: 15px 20px;
  border-radius: 4px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '10px'});
  transition: all 0.4s ease-out;
  transition-delay: ${props => props.$delay || '0s'};
`;

const LanguageText = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin: 0;
  font-family: ${props => props.$mono ? 
    "'SF Mono', 'Monaco', 'Courier New', monospace" : 
    "inherit"};
`;

const CenterGap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.8s ease-out;
  transition-delay: 0.8s;
`;

const GapVisual = styled.div`
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(255, 107, 107, 0.3) 20%,
    rgba(255, 107, 107, 0.6) 50%,
    rgba(255, 107, 107, 0.3) 80%,
    transparent 100%);
  position: relative;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 107, 107, 0.5);
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &::before {
    top: -10px;
  }
  
  &::after {
    bottom: -10px;
  }
`;

const GapLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #001833;
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid #FF6B6B;
  font-size: 12px;
  font-weight: 600;
  color: #FF6B6B;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
`;

const BottomInsight = styled.div`
  text-align: center;
  max-width: 600px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.95});
  transition: all 0.6s ease-out;
  transition-delay: 1s;
`;

const InsightText = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
  
  strong {
    color: #FF6B6B;
    font-weight: 600;
  }
`;

const Slide8TranslationGap = () => {
  const { step } = useSlideAnimation(6, 'slide-10-translation-gap');


  return (
    <SlideWrapper 
      slideNumber={10}
      slideTitle="The Translation Gap"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <MainContainer>
        <Title>What Both Sides Want</Title>
        
        <GapContainer>
          <SideContent $left={true} $visible={true} $delay="0.5s">
            <div>
              <SideLabel $left={true}>IRB Specialists</SideLabel>
              <SideTitle>Speaking Regulatory</SideTitle>
            </div>
            
            <LanguageBlock $left={true} $visible={true} $delay="0.7s">
              <LanguageText $mono>
                "Per 45 CFR 46.111(a)(2), risks must be reasonable in relation 
                to anticipated benefits..."
              </LanguageText>
            </LanguageBlock>
            
            <LanguageBlock $left={true} $visible={true} $delay="0.9s">
              <LanguageText>
                Need: Complete documentation demonstrating compliance with 
                Common Rule, FDA regulations, and institutional policies
              </LanguageText>
            </LanguageBlock>
          </SideContent>

          <CenterGap $visible={true}>
            <GapVisual />
            <GapLabel>Translation Gap</GapLabel>
          </CenterGap>

          <SideContent $left={false} $visible={true} $delay="0.6s">
            <div>
              <SideLabel $left={false}>AI Researchers</SideLabel>
              <SideTitle>Speaking Technical</SideTitle>
            </div>
            
            <LanguageBlock $left={false} $visible={true} $delay="0.8s">
              <LanguageText $mono>
                "Our CNN achieves 94% AUC with cross-validation on 
                the hold-out test set..."
              </LanguageText>
            </LanguageBlock>
            
            <LanguageBlock $left={false} $visible={true} $delay="1s">
              <LanguageText>
                Want: Clear guidance on what's needed without having to 
                learn regulatory frameworks
              </LanguageText>
            </LanguageBlock>
          </SideContent>
        </GapContainer>

          <BottomInsight $visible={true}>
            <InsightText>
              <strong>The Challenge:</strong> How do we bridge this gap without 
              requiring either side to become experts in the other's domain?
            </InsightText>
          </BottomInsight>
      </MainContainer>

      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Notes>
        The Translation Gap
        
        This slide visually demonstrates the communication gap between 
        IRB specialists and AI researchers.
        
        Left side (IRB):
        - Speaks in regulatory language (CFR citations)
        - Needs complete compliance documentation
        
        Right side (Researchers):
        - Speaks in technical language (AUC, CNN, validation)
        - Wants simple, clear guidance
        
        The visual gap in the center emphasizes the translation challenge.
        
        This sets up the three-question framework as the bridge.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide8TranslationGap;