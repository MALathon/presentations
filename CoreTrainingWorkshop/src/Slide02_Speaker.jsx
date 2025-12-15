import React, { useState, useEffect } from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import styled, { keyframes } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

// Subtle animations
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

// Main container
const ContentWrapper = styled.div`
  position: absolute;
  top: 70px;
  bottom: 40px;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 40px;
`;

// Main grid layout
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr 250px;
  gap: 20px;
  max-width: 1300px;
  width: 100%;
  align-items: start;
  height: 100%;
  margin: 0 auto;
  padding: 0 30px;
`;

// Left column container
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

// Photo container
const PhotoContainer = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.9});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PhotoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  color: rgba(255, 255, 255, 0.3);
`;

// Center column
const CenterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  height: 100%;
  padding: 0 20px;
`;

const NameBlock = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateX(${props => props.$visible ? 0 : '-30px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
  text-align: left;
`;

const Name = styled.h1`
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  line-height: 1.1;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 500;
  color: #4AE2C0;
  margin: 0 0 4px 0;
`;

const Organization = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
`;

// Two-column content grid
const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  width: 100%;
  align-items: stretch;
`;

// Expertise section
const ExpertiseSection = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateX(${props => props.$visible ? 0 : '-30px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.4s;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin: 0 0 12px 0;
  text-align: left;
`;

const ExpertiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  flex: 1;
  align-content: start;
`;

const ExpertiseItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;

  &:hover {
    background: rgba(74, 226, 192, 0.1);
    border-color: rgba(74, 226, 192, 0.3);
    transform: translateY(-2px);
  }
`;

// Experience section
const ExperienceSection = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateX(${props => props.$visible ? 0 : '-30px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.6s;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ExperienceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
  flex: 1;
  height: 100%;
`;

const ExperienceCard = styled.div`
  background: linear-gradient(135deg, rgba(0, 102, 204, 0.08) 0%, rgba(0, 59, 113, 0.04) 100%);
  border: 1px solid rgba(74, 226, 192, 0.15);
  border-radius: 10px;
  padding: 14px 16px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(74, 226, 192, 0.3);
  }
`;

const CompanyName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #4AE2C0;
  margin-bottom: 4px;
`;

const HighlightText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
`;

// Right column - Publications
const PublicationsPanel = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateX(${props => props.$visible ? 0 : 30}px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.8s;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 18px;
  backdrop-filter: blur(10px);
  position: relative;
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
`;

const PublicationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PublicationItem = styled.div`
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid rgba(74, 226, 192, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: #4AE2C0;
  }
`;

const PubTitle = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  margin-bottom: 3px;
`;

const PubJournal = styled.div`
  font-size: 10px;
  color: rgba(74, 226, 192, 0.7);
  font-style: italic;
`;

// Stats panel
const StatsPanel = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : 20}px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 1s;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4AE2C0;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Slide02Speaker = () => {
  const { step, setStep } = useSlideAnimation(6, 'slide-2-speaker');

  useEffect(() => {
    setStep(6);
  }, [setStep]);

  const expertiseAreas = [
    'Medical AI/ML',
    'FDA/CE Regulatory',
    'Diagnostic Biosensors',
    'Clinical Translation',
    'Health Equity',
    'SaMD Governance'
  ];

  const industryHighlights = [
    {
      category: 'Regulatory & Oversight',
      items: ['AI/ML Expert IRB Reviewer', 'FDA/CE-Mark Approvals', 'Medical & Scientific Affairs']
    },
    {
      category: 'Technical Achievements',
      items: ['Hematology AI Systems', 'Biosensor Platforms', 'Point-of-Care Diagnostics']
    }
  ];

  return (
    <SlideWrapper
      slideNumber={2}
      slideTitle="Speaker Introduction"
      totalSlides={9}
      background="linear-gradient(135deg, #003B71 0%, #0066CC 100%)"
    >
      <ContentWrapper>
        <MainGrid>
          <LeftColumn>
            <PhotoContainer $visible={true}>
              <PhotoPlaceholder>ML</PhotoPlaceholder>
            </PhotoContainer>

            <StatsPanel $visible={true}>
              <SectionTitle>Impact Metrics</SectionTitle>
              <StatsGrid>
                <StatItem>
                  <StatLabel>Experience</StatLabel>
                  <StatValue>15+ Years</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Citations</StatLabel>
                  <StatValue>1300+</StatValue>
                </StatItem>
              </StatsGrid>
            </StatsPanel>
          </LeftColumn>

          <CenterColumn>
            <NameBlock $visible={true}>
              <Name>Mark Lifson, PhD</Name>
              <Title>Director, AI/ML Engineering</Title>
              <Organization>Mayo Clinic Center for Digital Health</Organization>
            </NameBlock>

            <ContentGrid>
              <ExpertiseSection $visible={true}>
                <SectionTitle>Technical Expertise</SectionTitle>
                <ExpertiseGrid>
                  {expertiseAreas.map((area, index) => (
                    <ExpertiseItem key={index}>
                      {area}
                    </ExpertiseItem>
                  ))}
                </ExpertiseGrid>
              </ExpertiseSection>

              <ExperienceSection $visible={true}>
                <SectionTitle>Key Contributions</SectionTitle>
                <ExperienceGrid>
                  {industryHighlights.map((category, index) => (
                    <ExperienceCard key={index}>
                      <CompanyName>{category.category}</CompanyName>
                      {category.items.map((item, idx) => (
                        <HighlightText key={idx}>
                          - {item}
                        </HighlightText>
                      ))}
                    </ExperienceCard>
                  ))}
                </ExperienceGrid>
              </ExperienceSection>
            </ContentGrid>
          </CenterColumn>

          <PublicationsPanel $visible={true}>
            <SectionTitle>Career Impact</SectionTitle>
            <PublicationsList>
              <PublicationItem>
                <PubTitle>Biosensor Development</PubTitle>
                <PubJournal>Label-free detection platforms</PubJournal>
              </PublicationItem>
              <PublicationItem>
                <PubTitle>AI/ML in Clinical Practice</PubTitle>
                <PubJournal>FDA-approved diagnostic algorithms</PubJournal>
              </PublicationItem>
              <PublicationItem>
                <PubTitle>Healthcare Governance</PubTitle>
                <PubJournal>Frameworks for responsible AI</PubJournal>
              </PublicationItem>
              <PublicationItem>
                <PubTitle>Regulatory Innovation</PubTitle>
                <PubJournal>Automated oversight systems</PubJournal>
              </PublicationItem>
            </PublicationsList>
          </PublicationsPanel>
        </MainGrid>
      </ContentWrapper>

      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Notes>
        Mark Lifson brings a unique interdisciplinary perspective to AI oversight in healthcare.

        Key experience includes launching FDA-approved AI products at Abbott Laboratories,
        developing commercialized biosensor platforms, and leading AI/ML engineering
        at Mayo Clinic's Center for Digital Health.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide02Speaker;
