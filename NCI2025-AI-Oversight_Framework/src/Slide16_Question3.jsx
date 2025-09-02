import React, { useState, useEffect } from 'react';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import useSlideAnimation from './hooks/useSlideAnimation';
import styled from 'styled-components';

const Subtitle = styled.h2`
  font-size: 24px; // Match slides 12 and 14
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 10px 0 15px 0; // Match slides 12 and 14
  letter-spacing: 0.5px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 20px auto; // Match slides 12 and 14
  padding: 0 40px; // Match slides 12 and 14
`;

const QuestionHighlight = styled.div`
  background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
  border-radius: 12px;
  padding: 20px 28px; // Match slides 12 and 14
  margin: 15px auto; // Match slides 12 and 14
  max-width: 900px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.95});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;


const QuestionText = styled.h2`
  font-size: 32px; // Match slides 12 and 14
  font-weight: 500;
  color: white;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  // Remove line-height to match other slides
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 10px;
`;

const ComparisonCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 18px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderIcon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
`;

const HeaderTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
`;



const RiskList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

const RiskItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 5px;
  position: relative;
  padding-left: 16px;

  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: rgba(255, 255, 255, 0.5);
  }
`;


const ImplicationBox = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 10px;
  padding: 18px 28px; // Match slides 12 and 14
  margin: 25px auto 20px; // Match slides 12 and 14
  max-width: 1000px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.5s;
`;

const ImplicationTitle = styled.h4`
  font-size: 18px; // Match slides 12 and 14
  font-weight: 600;
  color: #FFC107;
  margin: 0 0 10px 0; // Match slides 12 and 14
  display: flex; // Match slides 12 and 14
  align-items: center; // Match slides 12 and 14
  gap: 8px; // Match slides 12 and 14
`;

const ImplicationText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px; // Match slides 12 and 14
  line-height: 1.5; // Match slides 12 and 14
  margin: 0;
`;

const Slide14_Question3 = () => {
  const { step, isVisible, isStepActive } = useSlideAnimation(4, 'slide-16-question3');

  return (
    <SlideWrapper 
      slideNumber={16}
      slideTitle="Technology Characteristics"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Subtitle $visible={true} $delay="0.2s">Question 3: Technology-Specific Characteristics</Subtitle>

      <QuestionHighlight $visible={true} $delay="0.4s">
        <QuestionText>
          What technology characteristics require oversight?
        </QuestionText>
      </QuestionHighlight>

      <ContentContainer>
        <ComparisonGrid>
          <ComparisonCard $visible={true} $delay={0}>
            <CardHeader $type="ai">
              <HeaderIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="2"/>
                  <path d="M12 8V12M12 16H12.01" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </HeaderIcon>
              <HeaderTitle>Algorithmic Characteristics</HeaderTitle>
            </CardHeader>
            <RiskList>
              <RiskItem $type="ai">Training data demographics</RiskItem>
              <RiskItem $type="ai">Algorithm transparency level</RiskItem>
              <RiskItem $type="ai">Decision pathway complexity</RiskItem>
              <RiskItem $type="ai">Update frequency requirements</RiskItem>
            </RiskList>
          </ComparisonCard>

          <ComparisonCard $visible={true} $delay={0.1}>
            <CardHeader $type="ai">
              <HeaderIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C12 2 9 6 9 12C9 18 12 22 12 22C12 22 15 18 15 12C15 6 12 2 12 2Z" stroke="#9C27B0" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" stroke="#9C27B0" strokeWidth="2"/>
                </svg>
              </HeaderIcon>
              <HeaderTitle>Feedback Loops</HeaderTitle>
            </CardHeader>
            <RiskList>
              <RiskItem $type="ai">Self-fulfilling predictions</RiskItem>
              <RiskItem $type="ai">Behavior modification</RiskItem>
              <RiskItem $type="ai">Data contamination</RiskItem>
              <RiskItem $type="ai">Perpetual learning risks</RiskItem>
            </RiskList>
          </ComparisonCard>

          <ComparisonCard $visible={true} $delay={0.2}>
            <CardHeader $type="ai">
              <HeaderIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20V20H4V4Z" stroke="#FFC107" strokeWidth="2"/>
                  <path d="M4 12H20M12 4V20" stroke="#FFC107" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="#FFC107"/>
                </svg>
              </HeaderIcon>
              <HeaderTitle>System Risks</HeaderTitle>
            </CardHeader>
            <RiskList>
              <RiskItem $type="ai">Cascading failures</RiskItem>
              <RiskItem $type="ai">Automation dependency</RiskItem>
              <RiskItem $type="ai">Silent failures</RiskItem>
              <RiskItem $type="ai">Integration complexity</RiskItem>
            </RiskList>
          </ComparisonCard>
        </ComparisonGrid>

        <ImplicationBox $visible={true} $delay="0.6000000000000001s">
          <ImplicationTitle>
            Why Implementation Matters
          </ImplicationTitle>
          <ImplicationText>
            While the risk categories aren't new, AI's speed, scale, and autonomous nature create unique 
            implementation challenges that traditional oversight must adapt to address.
          </ImplicationText>
        </ImplicationBox>
      </ContentContainer>

      <Notes>
        Our third key question addresses what makes AI oversight uniquely challenging: What additional risks to human subjects, if any, are the result of the technology itself? This question helps identify AI-specific considerations that standard oversight processes might miss.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide14_Question3;