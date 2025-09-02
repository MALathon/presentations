import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import styled from 'styled-components';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

const ContentContainer = styled.div`
  max-width: 1400px;
  margin: 10px auto;
  padding: 0 40px;
`;

const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  margin: 5px 0 20px 0;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

// Main container for technology types
const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 25px;
`;

const TechCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.$borderColor};
  border-radius: 12px;
  padding: 18px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '30px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const TechHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TechIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bgColor};
  border-radius: 8px;
`;

const TechTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$color};
  margin: 0;
`;

const RiskSection = styled.div`
  margin-bottom: 14px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

const RiskList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RiskItem = styled.li`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 4px;
  padding-left: 14px;
  position: relative;
  line-height: 1.4;
  
  &::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: ${props => props.$color};
  }
`;

const MitigationBox = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 6px;
  padding: 10px;
  margin-top: 10px;
`;

const MitigationList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const MitigationItem = styled.li`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3px;
  padding-left: 14px;
  position: relative;
  line-height: 1.3;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #4CAF50;
    font-weight: bold;
  }
`;

// Bottom comparison table
const ComparisonTable = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 16px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.95});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 1s;
`;

const TableTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #00BCD4;
  margin: 0 0 12px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: 120px repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
`;

const TableCell = styled.div`
  background: #001833;
  padding: 8px 10px;
  font-size: 11px;
  color: ${props => props.$header ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.$header ? '600' : '400'};
  text-align: ${props => props.$first ? 'left' : 'center'};
  
  ${props => props.$header && `
    background: rgba(255, 255, 255, 0.05);
  `}
`;

// Icons
const TraditionalMLIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4CAF50" strokeWidth="2"/>
    <path d="M7 10H17M7 14H17" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DeepLearningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="2" stroke="#FFC107" strokeWidth="2"/>
    <circle cx="16" cy="8" r="2" stroke="#FFC107" strokeWidth="2"/>
    <circle cx="12" cy="16" r="2" stroke="#FFC107" strokeWidth="2"/>
    <path d="M8 10V14L10 16M16 10V14L14 16" stroke="#FFC107" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GenerativeAIIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 12L12 22L21 12L12 2Z" stroke="#FF6B6B" strokeWidth="2"/>
    <circle cx="12" cy="12" r="3" stroke="#FF6B6B" strokeWidth="2"/>
  </svg>
);

const Slide15TechRisksAndMitigations = () => {
  const { step } = useSlideAnimation(5, 'slide-17-tech-risks-mitigations');


  const techTypes = [
    {
      title: 'Traditional ML',
      color: '#4CAF50',
      borderColor: 'rgba(76, 175, 80, 0.3)',
      bgColor: 'rgba(76, 175, 80, 0.15)',
      icon: <TraditionalMLIcon />,
      risks: [
        'Overfitting to training data',
        'Feature selection bias',
        'Class imbalance effects'
      ],
      mitigations: [
        'Validation strategies',
        'Performance monitoring',
        'Documentation of limitations'
      ]
    },
    {
      title: 'Deep Learning',
      color: '#FFC107',
      borderColor: 'rgba(255, 193, 7, 0.3)',
      bgColor: 'rgba(255, 193, 7, 0.15)',
      icon: <DeepLearningIcon />,
      risks: [
        'Black box decision-making',
        'Hidden spurious correlations',
        'Catastrophic forgetting'
      ],
      mitigations: [
        'Explainability approaches',
        'Human oversight mechanisms',
        'Continuous evaluation'
      ]
    },
    {
      title: 'Generative AI',
      color: '#FF6B6B',
      borderColor: 'rgba(255, 107, 107, 0.3)',
      bgColor: 'rgba(255, 107, 107, 0.15)',
      icon: <GenerativeAIIcon />,
      risks: [
        'Hallucination of medical facts',
        'Training data memorization',
        'Adversarial manipulation'
      ],
      mitigations: [
        'Output verification processes',
        'Privacy safeguards',
        'Usage boundaries and guardrails'
      ]
    }
  ];

  const comparisonData = [
    ['Interpretability', 'High', 'Low', 'Very Low'],
    ['Data Required', '100s-1000s', '10,000s+', 'Millions'],
    ['Failure Mode', 'Predictable', 'Surprising', 'Creative'],
    ['IRB Focus', 'Validation', 'Explainability', 'Safety Bounds']
  ];

  return (
    <SlideWrapper 
      slideNumber={17}
      slideTitle="Technology Characteristics & Controls"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <ContentContainer>
        <Subtitle $visible={true} $delay="0.2s">
          While risks aren't unique to AI, their manifestation requires technology-specific mitigations
        </Subtitle>

        <TechGrid>
          {techTypes.map((tech, idx) => (
            <TechCard
              key={idx}
              $borderColor={tech.borderColor}
              $visible={true}
              $delay={idx * 0.2}
            >
              <TechHeader>
                <TechIcon $bgColor={tech.bgColor}>
                  {tech.icon}
                </TechIcon>
                <TechTitle $color={tech.color}>{tech.title}</TechTitle>
              </TechHeader>

              <RiskSection>
                <SectionLabel>Key Risks</SectionLabel>
                <RiskList>
                  {tech.risks.map((risk, rIdx) => (
                    <RiskItem key={rIdx} $color={tech.color}>
                      {risk}
                    </RiskItem>
                  ))}
                </RiskList>
              </RiskSection>

              <MitigationBox>
                <SectionLabel style={{ color: '#4CAF50', marginBottom: '8px' }}>
                  Potential Mitigations
                </SectionLabel>
                <MitigationList>
                  {tech.mitigations.map((mitigation, mIdx) => (
                    <MitigationItem key={mIdx}>
                      {mitigation}
                    </MitigationItem>
                  ))}
                </MitigationList>
              </MitigationBox>
            </TechCard>
          ))}
        </TechGrid>

        <ComparisonTable $visible={true} $delay="0.4s">
          <TableTitle>Technology Comparison for IRB Review</TableTitle>
          <TableGrid>
            <TableCell $header $first>Aspect</TableCell>
            <TableCell $header>Traditional ML</TableCell>
            <TableCell $header>Deep Learning</TableCell>
            <TableCell $header>Generative AI</TableCell>
            
            {comparisonData.map((row, idx) => (
              <React.Fragment key={idx}>
                <TableCell $first>{row[0]}</TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell>{row[3]}</TableCell>
              </React.Fragment>
            ))}
          </TableGrid>
        </ComparisonTable>
      </ContentContainer>

      <Notes>
        This slide demonstrates why our third question - technology-specific risks - is so crucial. Different AI 
        technologies create fundamentally different risk profiles that require tailored mitigation strategies.
        
        Notice how traditional machine learning models have relatively predictable failure modes - we can validate 
        them against known datasets and understand their decision boundaries. Deep learning introduces opacity and 
        complexity that require different oversight approaches.
        
        Generative AI represents an entirely new category of risk. The comparison table shows how these systems can 
        create novel content, hallucinate information, and exhibit emergent behaviors that weren't present in their 
        training data. This is why generic AI oversight policies often miss critical vulnerabilities.
        
        The key insight here is that effective oversight must be technology-aware without becoming technology-dependent. 
        Our framework addresses this by asking what additional risks the technology itself introduces, rather than 
        requiring reviewers to understand the technical implementation details.
        
        This approach has helped us identify risks in large language model applications that wouldn't have been 
        caught by traditional software review processes.
        
        [1.5 minutes - Emphasize technology-specific nature of AI risks and validation of approach]
      </Notes>
    </SlideWrapper>
  );
};

export default Slide15TechRisksAndMitigations;