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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 35px;
  align-items: start;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CategoryCard = styled.div`
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

const CategoryTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.$color || '#00BCD4'};
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

// Icon components
const ClinicalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2L17 7H22V12L17 14L22 16V21H17L14 26L11 21H6V16L11 14L6 12V7H11L14 2Z" 
          stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const ExploratoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M18 18L25 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const RegulatoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M4 10H24M10 4V10M18 4V10" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 15H19M9 19H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Slide10_Question1 = () => {
  const { step } = useSlideAnimation(5, 'slide-12-question-1');


  return (
    <SlideWrapper 
      slideNumber={12}
      slideTitle="Determining Clinical Intent"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Subtitle $visible={true} $delay="0.2s">Question 1: Clinical Intended Use</Subtitle>

      <QuestionHighlight $visible={true} $delay="0.4s">
        <QuestionText>Is there a clinical intended use?</QuestionText>
      </QuestionHighlight>

      <ContentContainer>
        <Column>
          <CategoryCard $visible={true} $delay={0}>
            <CategoryTitle $color="#00BCD4">
              <ClinicalIcon />
              Clinical Use
            </CategoryTitle>
            <ExampleList>
              <ExampleItem $color="#00BCD4">Diagnostic algorithms for patient care</ExampleItem>
              <ExampleItem $color="#00BCD4">Treatment recommendation systems</ExampleItem>
              <ExampleItem $color="#00BCD4">Risk stratification tools</ExampleItem>
              <ExampleItem $color="#00BCD4">Clinical decision support</ExampleItem>
              <ExampleItem $color="#00BCD4">Patient monitoring systems</ExampleItem>
            </ExampleList>
          </CategoryCard>
        </Column>

        <Column>
          <CategoryCard $visible={true} $delay={0.2}>
            <CategoryTitle $color="#4CAF50">
              <ExploratoryIcon />
              Exploratory Research
            </CategoryTitle>
            <ExampleList>
              <ExampleItem $color="#4CAF50">Pattern discovery in datasets</ExampleItem>
              <ExampleItem $color="#4CAF50">Hypothesis generation</ExampleItem>
              <ExampleItem $color="#4CAF50">Research-only algorithms</ExampleItem>
              <ExampleItem $color="#4CAF50">Retrospective analyses</ExampleItem>
              <ExampleItem $color="#4CAF50">Method development studies</ExampleItem>
            </ExampleList>
          </CategoryCard>
        </Column>
      </ContentContainer>

      <ImplicationBox $visible={true} $delay="0.6000000000000001s">
        <ImplicationTitle>
          <RegulatoryIcon />
          Regulatory Pathway Implications
        </ImplicationTitle>
        <ImplicationText>
          Clinical intended use triggers requirements for safety and efficacy evaluation beyond basic data privacy concerns. 
          This determines whether FDA regulatory pathways, clinical validation studies, or additional safety monitoring are needed.
        </ImplicationText>
      </ImplicationBox>

      <Notes>
        Our first key question is: Is there a clinical intended use? This question helps us determine if the research requires safety and efficacy evaluation beyond basic data privacy concerns.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide10_Question1;