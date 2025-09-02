import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import styled from 'styled-components';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';



const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 10px 0 15px 0;
  letter-spacing: 0.5px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const QuestionHighlight = styled.div`
  background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
  border-radius: 12px;
  padding: 20px 28px;
  margin: 15px auto;
  max-width: 900px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.95});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const QuestionText = styled.h2`
  font-size: 32px;
  font-weight: 500;
  color: white;
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 20px auto;
  padding: 0 40px;
`;

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 35px;
  align-items: start;
`;

const ImpactCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ImpactTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.$direct ? '#FF6B6B' : '#4CAF50'};
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ExampleList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style: none;
`;

const ExampleItem = styled.li`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 6px;
  position: relative;
  padding-left: 18px;

  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: ${props => props.$color || '#00BCD4'};
  }
`;

const ImplicationBox = styled.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 10px;
  padding: 18px 28px;
  margin: 25px auto 20px;
  max-width: 1000px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.5s;
`;

const ImplicationTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #FFC107;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ImplicationText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;

const DirectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L4 7V12C4 16.5 7 20.26 12 21C17 20.26 20 16.5 20 12V7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IndirectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2"/>
    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const RiskIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7V12C2 16.5 5 20.26 10 21C11 20.81 12 20.5 12.84 20.07" stroke="currentColor" strokeWidth="2"/>
    <path d="M19 12V19M19 22V22.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Slide12_Question2 = () => {
  const { step } = useSlideAnimation(5, 'slide-14-question-2');


  return (
    <SlideWrapper 
      slideNumber={14}
      slideTitle="Assessing Patient Impact"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Subtitle $visible={true} $delay="0.2s">Question 2: Patient Care Impact</Subtitle>

      <QuestionHighlight $visible={true} $delay="0.4s">
        <QuestionText>Does it impact patient care?</QuestionText>
      </QuestionHighlight>

      <ContentContainer>
        <ImpactGrid>
          <ImpactCard $direct={true} $visible={true} $delay={0}>
            <ImpactTitle $direct={true}>
              <DirectIcon />
              Direct Impact
            </ImpactTitle>
            <ExampleList>
              <ExampleItem $color="#FF6B6B">AI outputs influence clinical decisions</ExampleItem>
              <ExampleItem $color="#FF6B6B">Alerts trigger immediate actions</ExampleItem>
              <ExampleItem $color="#FF6B6B">Treatment recommendations provided</ExampleItem>
              <ExampleItem $color="#FF6B6B">Real-time decision support active</ExampleItem>
              <ExampleItem $color="#FF6B6B">Results documented in patient records</ExampleItem>
            </ExampleList>
          </ImpactCard>

          <ImpactCard $direct={false} $visible={true} $delay={0.2}>
            <ImpactTitle $direct={false}>
              <IndirectIcon />
              Indirect/No Impact
            </ImpactTitle>
            <ExampleList>
              <ExampleItem $color="#4CAF50">Retrospective analysis only</ExampleItem>
              <ExampleItem $color="#4CAF50">Research insights for future care</ExampleItem>
              <ExampleItem $color="#4CAF50">No real-time clinical influence</ExampleItem>
              <ExampleItem $color="#4CAF50">Results inform protocol development</ExampleItem>
              <ExampleItem $color="#4CAF50">Population-level studies only</ExampleItem>
            </ExampleList>
          </ImpactCard>
        </ImpactGrid>

        <ImplicationBox $visible={true} $delay="0.6000000000000001s">
          <ImplicationTitle>
            <RiskIcon />
            Risk Profile Determines Oversight Level
          </ImplicationTitle>
          <ImplicationText>
            Direct patient impact requires enhanced safety monitoring, real-time performance tracking, 
            and fail-safe mechanisms. Indirect impact allows more flexibility in study design and timing.
          </ImplicationText>
        </ImplicationBox>
      </ContentContainer>

      <Notes>
        Our second key question is: Does it impact patient care? This addresses the direct risk profile to patients involved in AI research. Unlike the first question which focuses on intentions and regulatory pathways, this question examines the immediate practical implications for study participants.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide12_Question2;