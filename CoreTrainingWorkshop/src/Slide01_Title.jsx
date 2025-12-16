import React from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Styled components
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px 40px;
  gap: 0;
`;

const WorkshopBadge = styled.div`
  background: linear-gradient(135deg, rgba(74, 226, 192, 0.2) 0%, rgba(74, 226, 192, 0.1) 100%);
  border: 2px solid rgba(74, 226, 192, 0.4);
  border-radius: 30px;
  padding: 8px 25px;
  font-size: 14px;
  font-weight: 600;
  color: #4AE2C0;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 25px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const MainTitle = styled.h1`
  font-size: 52px;
  font-weight: 700;
  color: white;
  margin: 0 0 20px 0;
  line-height: 1.2;
  letter-spacing: -1px;
  animation: ${fadeIn} 1s ease-out 0.2s both;

  span.highlight {
    background: linear-gradient(90deg, #4AE2C0, #00B4D8, #4AE2C0);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${gradientShift} 3s ease infinite;
  }
`;

const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 30px 0;
  max-width: 800px;
  line-height: 1.4;
  animation: ${fadeIn} 1s ease-out 0.4s both;
`;

const Divider = styled.div`
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #4AE2C0, transparent);
  margin: 0 0 25px 0;
  animation: ${fadeIn} 1s ease-out 0.5s both;
`;

const PresenterInfo = styled.div`
  animation: ${fadeIn} 1s ease-out 0.6s both;
`;

const PresenterName = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
`;

const PresenterTitle = styled.div`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

const EventInfo = styled.div`
  margin-top: 25px;
  padding: 15px 35px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 1s ease-out 0.8s both;
`;

const EventText = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
`;

const DateText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
`;

const TopicHighlights = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out 1s both;
`;

const TopicTag = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
`;

const Slide01_Title = () => {
  return (
    <SlideWrapper
      slideNumber={1}
      totalSlides={9}
      slideTitle=""
      showHeader={false}
      showFooter={false}
      background="radial-gradient(ellipse at top, #0066CC 0%, #003B71 50%, #001833 100%)"
    >
      <TitleContainer>
        <WorkshopBadge>Core Training Workshop</WorkshopBadge>

        <MainTitle>
          Hands-On Training on<br />
          <span className="highlight">Artificial Intelligence</span>
        </MainTitle>

        <Subtitle>
          Understanding AI Research Oversight in Healthcare
        </Subtitle>

        <Divider />

        <PresenterInfo>
          <PresenterName>Mark Lifson, PhD</PresenterName>
          <PresenterTitle>AI/ML Director</PresenterTitle>
        </PresenterInfo>

        <EventInfo>
          <EventText>Core Training Workshop Series</EventText>
          <DateText>2025</DateText>
        </EventInfo>

        <TopicHighlights>
          <TopicTag>AI vs Traditional Research</TopicTag>
          <TopicTag>Clinical Intent</TopicTag>
          <TopicTag>Risk Assessment</TopicTag>
          <TopicTag>Oversight Framework</TopicTag>
        </TopicHighlights>
      </TitleContainer>

      <Notes>
        Welcome to the Core Training Workshop on Artificial Intelligence.

        This condensed session covers the essential concepts for understanding
        AI research oversight in healthcare settings.

        Topics covered:
        - How AI differs from traditional research
        - Understanding clinical intent and its implications
        - The translation gap between researchers and IRBs
        - Risk assessment frameworks for AI systems
      </Notes>
    </SlideWrapper>
  );
};

export default Slide01_Title;
