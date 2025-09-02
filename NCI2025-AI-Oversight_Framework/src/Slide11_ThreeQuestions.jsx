import React, { useState, useEffect } from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes } from 'styled-components';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import useSlideAnimation from './hooks/useSlideAnimation';

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

const ContentWrapper = styled.div`
  position: absolute;
  top: 70px; // After header, adjusted for no title
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
  font-size: 42px;
  color: white;
  margin: 0 0 35px 0;
  text-align: center;
  font-weight: 300;
  opacity: 0;
  animation: ${titleAnimation} 0.8s ease-out forwards;
`;

const SolutionTagline = styled.div`
  font-size: 24px;
  color: rgba(255, 193, 7, 0.9);
  text-align: center;
  margin-bottom: 30px;
  font-style: italic;
  line-height: 1.4;
  max-width: 900px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.6s ease-out;
  transition-delay: 0.5s;
  
  strong {
    color: #FFC107;
    font-weight: 600;
  }
`;

const QuestionsContainer = styled.div`
  display: flex;
  gap: 25px;
  width: 100%;
  max-width: 1000px;
  justify-content: center;
  align-items: stretch;
`;

const QuestionCard = styled.div`
  flex: 1;
  max-width: 300px;
  background: ${props => {
    switch(props.$index) {
      case 0: return 'rgba(74, 226, 192, 0.1)';
      case 1: return 'rgba(76, 175, 80, 0.1)';
      case 2: return 'rgba(255, 165, 0, 0.1)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border: 2px solid ${props => {
    switch(props.$index) {
      case 0: return '#4AE2C0';
      case 1: return '#4CAF50';
      case 2: return '#FFA500';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  border-radius: 12px;
  padding: 25px 20px;
  text-align: center;
  opacity: ${props => props.$show ? 1 : 0};
  transform: translateY(${props => props.$show ? 0 : '30px'});
  transition: all 0.6s ease-out;
  transition-delay: ${props => props.$delay || '0s'};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuestionNumber = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => {
    switch(props.$index) {
      case 0: return '#4AE2C0';
      case 1: return '#4CAF50';
      case 2: return '#FFA500';
      default: return 'white';
    }
  }};
  color: #003B71;
  font-size: 22px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 15px 0;
`;

const QuestionTitle = styled.h3`
  font-size: 18px;
  color: white;
  margin: 0 0 12px 0;
  font-weight: 600;
  line-height: 1.2;
`;

const QuestionDesc = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  margin: 0;
`;

const FooterNote = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 16px 28px;
  max-width: 700px;
  text-align: center;
  margin-top: 30px;
  opacity: ${props => props.$show ? 1 : 0};
  transform: translateY(${props => props.$show ? 0 : '20px'});
  transition: all 0.6s ease-out;
  transition-delay: 1s;
`;

const FooterText = styled.p`
  color: rgba(255, 255, 255, 0.95);
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
  
  strong {
    color: #4AE2C0;
    font-weight: 600;
  }
`;

const Slide09_ThreeQuestions = () => {
  const { step, isVisible, isStepActive } = useSlideAnimation(4, 'slide-11-three-questions');
  
  const questions = [
    {
      number: '1',
      title: 'Clinical Intended Use?',
      desc: 'Determines regulatory pathway and efficacy evidence requirements'
    },
    {
      number: '2',
      title: 'Patient Care Impact?',
      desc: 'Clarifies risk profile and human subjects protections needed'
    },
    {
      number: '3',
      title: 'Technology Risks?',
      desc: 'Identifies AI-specific considerations often overlooked'
    }
  ];
  
  return (
    <SlideWrapper 
      slideNumber={11}
      slideTitle="The Solution: Three Key Questions"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <ContentWrapper>
        <Title>The Solution: Three Key Questions</Title>
          <SolutionTagline $visible={true}>
            A framework that <strong>translates</strong> technical complexity into <strong>reviewable criteria</strong>
          </SolutionTagline>
        <QuestionsContainer>
          {questions.map((q, index) => (
            <QuestionCard 
              key={index} 
              $index={index}
              $show={true}
              $delay={`${index * 0.2}s`}
            >
              <QuestionNumber $index={index}>{q.number}</QuestionNumber>
              <QuestionTitle>{q.title}</QuestionTitle>
              <QuestionDesc>{q.desc}</QuestionDesc>
            </QuestionCard>
          ))}
        </QuestionsContainer>
        
        <FooterNote $show={true}>
          <FooterText>
            These questions <strong>focus oversight where it matters</strong> – 
            no AI expertise required
          </FooterText>
        </FooterNote>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        Now we arrive at the heart of my proposal: a three-question framework that bridges the translation 
        gap we just discussed.
        
        Instead of requiring IRB reviewers to become AI experts, these questions focus oversight attention 
        where it matters most. Each question builds on existing IRB competencies while addressing the unique 
        aspects of AI research.
        
        The beauty of this approach is its scalability - whether you're reviewing a simple data analysis 
        project or a complex autonomous clinical system, these same three questions provide the scaffolding 
        for proportional oversight.
        
        Let me walk you through each question and show you how they work together to create a practical 
        assessment framework. Press space to reveal each question as we build this framework step by step.
        
        What you'll notice is that these questions are designed to be answerable by researchers without 
        deep technical expertise, and reviewable by IRB members using their existing ethical reasoning skills.
        
        [1.5 minutes - Position framework as practical bridge between technical complexity and ethical oversight]
      </Notes>
    </SlideWrapper>
  );
};

export default Slide09_ThreeQuestions;