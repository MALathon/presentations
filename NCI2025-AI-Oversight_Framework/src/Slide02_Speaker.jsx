import React, { useState, useEffect, useRef } from 'react';
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

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(-30px);
  }
  to { 
    opacity: 1; 
    transform: translateX(0);
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

// Main grid layout - Responsive 3-column design
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

// Left column container for photo and personal info
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
`;

const ProfilePhoto = styled.img`
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  display: block;
  object-fit: cover;
  margin: -2px;
`;

// Center column - Main info
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

// Industry Experience section
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
    background: linear-gradient(135deg, rgba(0, 102, 204, 0.12) 0%, rgba(0, 59, 113, 0.06) 100%);
  }
`;

const CompanyName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #4AE2C0;
  margin-bottom: 4px;
`;

const RoleText = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 4px;
`;

const HighlightText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
`;

// Right column - Publications sidebar
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

// Personal life content
const PersonalContent = styled.div`
  opacity: ${props => props.$visible ? 1 : 0};
  position: ${props => props.$visible ? 'static' : 'absolute'};
  transition: opacity 0.4s ease;
`;

const PersonalTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 12px 0;
`;

const PersonalItem = styled.div`
  margin-bottom: 6px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 2px solid rgba(74, 226, 192, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: #4AE2C0;
  }
`;

const PersonalLabel = styled.div`
  font-size: 10px;
  color: rgba(74, 226, 192, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PersonalIcon = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(74, 226, 192, 0.8);
`;

const PersonalText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.3;
`;

const ContentToggle = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 11px;
  color: rgba(74, 226, 192, 0.6);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: rgba(74, 226, 192, 0.9);
  }
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

// Stats panel in left column
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

// Badge animations
const swishIn = keyframes`
  0% {
    transform: translateX(-50px) rotate(-10deg) scale(0.8);
    opacity: 0;
  }
  40% {
    transform: translateX(10px) rotate(5deg) scale(1.05);
  }
  60% {
    transform: translateX(-5px) rotate(-2deg) scale(0.98);
  }
  80% {
    transform: translateX(2px) rotate(1deg) scale(1.01);
  }
  100% {
    transform: translateX(0) rotate(0deg) scale(1);
    opacity: 1;
  }
`;


// Badge container - horizontal layout at bottom
const BadgeSection = styled.div`
  display: flex;
  gap: 24px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.6s ease;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const BadgeWrapper = styled.div`
  position: relative;
  animation: ${props => props.$visible ? swishIn : 'none'} 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation-delay: ${props => props.$delay}s;
  animation-fill-mode: both;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
  }
`;

const Badge = styled.div`
  width: 85px;
  height: 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  perspective: 500px;
  flex-shrink: 0;
`;

const BadgeShield = styled.div`
  width: 65px;
  min-height: 70px;
  max-height: 70px;
  background: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin-top: 24px;
  clip-path: polygon(
    50% 0%,
    100% 0,
    100% 70%,
    50% 100%,
    0 70%,
    0 0
  );
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.25))
          drop-shadow(0 0 0 2px ${props => props.$border || '#FFD700'});
  animation: ${props => props.$animate ? bannerWave : 'none'} 12s ease-in-out infinite;
  animation-delay: ${props => 0.5 + props.$delay * 1.2}s;
  transform-origin: center top;
  transform-style: preserve-3d;
`;

const BadgeLogo = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
`;

const bannerWave = keyframes`
  0%, 85%, 100% { 
    transform: perspective(400px) rotateX(0deg) rotateY(0deg) translateZ(0);
  }
  88% { 
    transform: perspective(400px) rotateX(2deg) rotateY(-3deg) translateZ(5px);
  }
  91% { 
    transform: perspective(400px) rotateX(-1deg) rotateY(2deg) translateZ(3px);
  }
  94% { 
    transform: perspective(400px) rotateX(1deg) rotateY(-1deg) translateZ(2px);
  }
`;

const RibbonBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => props.$color || '#8B0000'} 0%, 
    ${props => {
      const col = props.$color || '#8B0000';
      return col + 'f5';
    }} 45%,
    ${props => {
      const col = props.$color || '#8B0000';
      return col + 'dd';
    }} 50%,
    ${props => {
      const col = props.$color || '#8B0000';
      return col + 'f5';
    }} 55%,
    ${props => props.$color || '#8B0000'} 100%
  );
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const BadgeBoard = styled.div`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 620px;
  height: 110px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  z-index: -1;
  backdrop-filter: blur(10px);
`;

const BadgeRibbon = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 85px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  z-index: 10;
`;

const BadgeText = styled.div`
  position: relative;
  font-size: 7px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.2px;
  font-weight: 700;
  z-index: 30;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
`;

const Slide02Speaker = () => {
  const { step, setStep } = useSlideAnimation(6, 'slide-2-speaker');
  const [showPersonal, setShowPersonal] = useState(false);
  const [showBadges, setShowBadges] = useState(true);  // Start with badges visible
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Initialize once when component mounts
    if (!hasInitialized) {
      setStep(6);  // Show all elements
      setHasInitialized(true);
    }
  }, [hasInitialized, setStep]);
  
  // Override default Space behavior for this slide
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check if we're on slide 2
      const params = new URLSearchParams(window.location.search);
      const slideIndex = params.get('slideIndex');
      
      // Only handle keys when we're on slide 2 (index 1)
      if (slideIndex !== '1') return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        e.stopPropagation();
        setShowPersonal(prev => !prev);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        setShowBadges(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        // Reset to initial state
        setStep(6);
        setShowBadges(true);
        setShowPersonal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const expertiseAreas = [
    'AI/ML Medical Devices',
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
  
  const publications = [
    { 
      title: 'Photonic Crystals: Emerging Biosensors and POC Applications',
      journal: 'Chemical Society Reviews'
    },
    {
      title: 'AI Model Documentation Framework for Healthcare',
      journal: 'Nature Digital Medicine'
    },
    {
      title: 'Label-Free Detection Technologies',
      journal: 'Biosensors & Bioelectronics'
    }
  ];

  return (
    <SlideWrapper 
      slideNumber={2}
      slideTitle="Speaker Introduction"
      totalSlides={20}
      background="linear-gradient(135deg, #003B71 0%, #0066CC 100%)"
    >
      <ContentWrapper>
        <MainGrid>
          {/* Left Column - Photo and Stats */}
          <LeftColumn>
            <PhotoContainer $visible={true} $delay="0.2s">
              <ProfilePhoto src={`${import.meta.env.BASE_URL}1620103056556.jpeg`} alt="Mark Lifson" />
            </PhotoContainer>
            
            <StatsPanel $visible={true} $delay="0.4s">
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
                <StatItem>
                  <StatLabel>Patents</StatLabel>
                  <StatValue style={{ fontSize: '11px', lineHeight: '1.2' }}>Diagnostics, Regulatory<br/>& Mechanical Systems</StatValue>
                </StatItem>
              </StatsGrid>
            </StatsPanel>
          </LeftColumn>
          
          {/* Center Column - Main Content */}
          <CenterColumn>
            <NameBlock $visible={true} $delay="0.6000000000000001s">
              <Name>Mark Lifson, PhD</Name>
              <Title>Director, AI/ML Engineering</Title>
              <Organization>Mayo Clinic Center for Digital Health</Organization>
            </NameBlock>
            
            <ContentGrid>
              <ExpertiseSection $visible={true} $delay="0.8s">
                <SectionTitle>Technical Expertise</SectionTitle>
                <ExpertiseGrid>
                  {expertiseAreas.map((area, index) => (
                    <ExpertiseItem key={index}>
                      {area}
                    </ExpertiseItem>
                  ))}
                </ExpertiseGrid>
              </ExpertiseSection>
              
              <ExperienceSection $visible={true} $delay="1s">
                <SectionTitle>Key Contributions</SectionTitle>
                <ExperienceGrid>
                  {industryHighlights.map((category, index) => (
                    <ExperienceCard key={index}>
                      <CompanyName>{category.category}</CompanyName>
                      {category.items.map((item, idx) => (
                        <HighlightText key={idx}>
                          • {item}
                        </HighlightText>
                      ))}
                    </ExperienceCard>
                  ))}
                </ExperienceGrid>
              </ExperienceSection>
            </ContentGrid>
            
            {/* Badges section - horizontal at bottom */}
            <BadgeSection $visible={showBadges}>
              {/* Academic Badges */}
              <BadgeWrapper $visible={showBadges} $delay={0}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#F36917" />
                    <BadgeText>Engineering</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#F36917" $animate={showBadges} $delay={0.2}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/rochester-institute-of-technology-rit-logo-png_seeklogo-355776.png`} alt="RIT" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
              
              <BadgeWrapper $visible={showBadges} $delay={0.1}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#003B71" />
                    <BadgeText>Biomedical</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#FFD100" $animate={showBadges} $delay={0.3}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/university-of-rochester-logo-png_seeklogo-498446.png`} alt="U of R" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
              
              <BadgeWrapper $visible={showBadges} $delay={0.2}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#8C1515" />
                    <BadgeText>Research</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#8C1515" $animate={showBadges} $delay={0.4}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/stanford-university-logo-png_seeklogo-299560.png`} alt="Stanford" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
              
              {/* Industry Badges */}
              <BadgeWrapper $visible={showBadges} $delay={0.3}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#003DA5" />
                    <BadgeText>Healthcare</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#003DA5" $animate={showBadges} $delay={0.5}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/mayo-clinic-logo-png_seeklogo-306700.png`} alt="Mayo Clinic" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
              
              <BadgeWrapper $visible={showBadges} $delay={0.4}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#003168" />
                    <BadgeText>Industry</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#003168" $animate={showBadges} $delay={0.6}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/Abbott-logo.jpg`} alt="Abbott" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
              
              <BadgeWrapper $visible={showBadges} $delay={0.5}>
                <Badge>
                  <BadgeRibbon>
                    <RibbonBackground $color="#4B0082" />
                    <BadgeText>Biosensors</BadgeText>
                  </BadgeRibbon>
                  <BadgeShield $border="#4B0082" $animate={showBadges} $delay={0.7}>
                    <BadgeLogo src={`${import.meta.env.BASE_URL}logos/adarza-biosystems-logo.jpg`} alt="Adarza" />
                  </BadgeShield>
                </Badge>
              </BadgeWrapper>
            </BadgeSection>
          </CenterColumn>
          
          {/* Right Column - Publications/Personal */}
          <PublicationsPanel $visible={true} $delay="1.2s">
            <div style={{ opacity: showPersonal ? 0 : 1, display: showPersonal ? 'none' : 'block' }}>
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
                  <PubJournal>Frameworks for responsible AI deployment</PubJournal>
                </PublicationItem>
                <PublicationItem>
                  <PubTitle>Regulatory Innovation</PubTitle>
                  <PubJournal>Automated oversight systems & patents</PubJournal>
                </PublicationItem>
                <PublicationItem>
                  <PubTitle>Health Equity Research</PubTitle>
                  <PubJournal>Bias mitigation in diagnostic AI</PubJournal>
                </PublicationItem>
              </PublicationsList>
            </div>
            
            <PersonalContent $visible={showPersonal}>
              <PersonalTitle>Beyond the CV</PersonalTitle>
              <PersonalItem style={{ marginBottom: '8px' }}>
                <PersonalLabel>
                  <PersonalIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </PersonalIcon>
                  Location
                </PersonalLabel>
                <PersonalText>Walla Walla, WA - Wine country</PersonalText>
              </PersonalItem>
              <PersonalItem style={{ marginBottom: '8px' }}>
                <PersonalLabel>
                  <PersonalIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </PersonalIcon>
                  Family
                </PersonalLabel>
                <PersonalText>2 kids, 2 cats, 4 chickens</PersonalText>
              </PersonalItem>
              <PersonalItem style={{ marginBottom: '8px' }}>
                <PersonalLabel>
                  <PersonalIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </PersonalIcon>
                  Remote
                </PersonalLabel>
                <PersonalText>Working from home since 2018</PersonalText>
              </PersonalItem>
              <PersonalItem style={{ marginBottom: '8px' }}>
                <PersonalLabel>
                  <PersonalIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                      <path d="M16 3l-2 4H10L8 3"/>
                      <circle cx="8" cy="14" r="2"/>
                      <circle cx="16" cy="14" r="2"/>
                      <path d="M11 14h2"/>
                    </svg>
                  </PersonalIcon>
                  Gaming
                </PersonalLabel>
                <PersonalText>Building & playing roguelikes</PersonalText>
              </PersonalItem>
              <PersonalItem style={{ marginBottom: '8px' }}>
                <PersonalLabel>
                  <PersonalIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="4 17 10 11 4 5"/>
                      <line x1="12" y1="19" x2="20" y2="19"/>
                    </svg>
                  </PersonalIcon>
                  Code
                </PersonalLabel>
                <PersonalText>Procedural generation enthusiast</PersonalText>
              </PersonalItem>
            </PersonalContent>
          </PublicationsPanel>
        </MainGrid>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>Space</kbd> Toggle Info <span className="separator">•</span> <kbd>B</kbd> Badges <span className="separator">•</span> <kbd>R</kbd> Reset <span className="separator">•</span> <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        Mark Lifson brings a unique interdisciplinary perspective to AI oversight in healthcare, 
        with a PhD from University of Rochester in Biomedical Engineering and postdoctoral 
        fellowship at Stanford focused on photonic crystal biosensors for point-of-care diagnostics.
        
        Industry experience includes launching FDA-approved AI products at Abbott Laboratories,
        developing commercialized biosensor platforms at Adarza BioSystems, and leading 
        AI/ML engineering at Mayo Clinic's Center for Digital Health.
        
        Key message: Combining engineering rigor from biosensor development with practical experience 
        in FDA regulatory approval and clinical implementation to create frameworks that enable 
        responsible AI innovation in healthcare.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide02Speaker;