import React, { useEffect, useRef } from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import styled from 'styled-components';

// SlideContainer removed - using SlideWrapper
const SlideContainer = styled.div`
  background: radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SlideNumber = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  z-index: 10;
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 40px; // Moved up from 60px
  bottom: 50px; // Before footer
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
`;

const Title = styled.h1`
  font-size: 36px;
  color: white;
  margin: 0 0 25px 0;
  text-align: center;
  font-weight: 300;
`;

const FrameworkContainer = styled.div`
  display: flex;
  gap: 20px; // Reduced from 30px
  width: 100%;
  max-width: 1400px;
  justify-content: center;
  align-items: flex-start; // Align columns at the top
  margin-top: 10px; // Reduced from 20px
`;

const RegulationColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch; // Ensure cards stretch to fill width
`;

const ColumnHeader = styled.div`
  background: ${props => {
    switch(props.$type) {
      case 'fda': return 'linear-gradient(135deg, #FF6B6B 0%, #DC143C 100%)';
      case 'iso': return 'linear-gradient(135deg, #4AE2C0 0%, #3BA99C 100%)';
      case 'irb': return 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border-radius: 10px;
  padding: 16px; // Reduced from 20px
  text-align: center;
  opacity: ${props => props.$show ? 1 : 0};
  transform: scale(${props => props.$show ? 1 : 0.9});
  transition: all 0.5s ease-out;
  transition-delay: ${props => props.$delay || '0s'};
`;

const ColumnTitle = styled.h3`
  font-size: 22px;
  color: white;
  margin: 0 0 6px 0;
  font-weight: 600;
`;

const ColumnSubtitle = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-style: italic;
`;

const RegulationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px; // Reduced from 16px
  opacity: ${props => props.$show ? 1 : 0};
  transform: translateY(${props => props.$show ? 0 : '10px'});
  transition: all 0.5s ease-out;
  transition-delay: ${props => props.$delay || '0s'};
  min-height: 75px; // Ensure consistent card height
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RegCode = styled.div`
  font-size: 15px;
  color: ${props => {
    switch(props.$type) {
      case 'fda': return '#FF6B6B';
      case 'iso': return '#4AE2C0';
      case 'irb': return '#FFA500';
      default: return 'white';
    }
  }};
  font-weight: 600;
  margin-bottom: 6px;
`;

const RegDesc = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin-top: 4px;
`;

const IntegrationDiagram = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.6s ease-out;
  transition-delay: 1.5s;
`;

const IntegrationItem = styled.div`
  text-align: center;
  flex: 1;
`;

const IntegrationIcon = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
`;

const IntegrationText = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
`;

const Arrow = styled.div`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
`;

const SlideRegulatoryFramework = () => {
  const { step, setStep, isVisible } = useSlideAnimation(11, 'slide-8-regulatory-framework');
  const hasAnimatedRef = React.useRef(false);
  
  useEffect(() => {
    // Auto-run animation when slide becomes visible
    if (isVisible && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      const totalSteps = 11;
      for (let i = 0; i <= totalSteps; i++) {
        setTimeout(() => {
          setStep(i);
        }, i * 300); // 300ms between each step for smoother animation
      }
    } else if (!isVisible) {
      // Reset when leaving slide
      hasAnimatedRef.current = false;
      setStep(0);
    }
  }, [isVisible, setStep]);
  
  const regulations = {
    fda: [
      { code: '21 CFR 820.30', desc: 'Design Controls - Standard V&V requirements now applied to AI models' },
      { code: '21 CFR 812', desc: 'IDE regulations - Clinical trial requirements now covering AI devices' },
      { code: '21 CFR 11', desc: 'Electronic records - Existing compliance rules for digital data' },
      { code: 'FDA SaMD Guidance', desc: 'Software as Medical Device - Pre-AI framework being adapted' },
      { code: '21st Century Cures Act', desc: 'Medical software provisions and real-world evidence' }
    ],
    iso: [
      { code: 'ISO 14971', desc: 'Risk management - Standard medical device risk framework' },
      { code: 'ISO 62304', desc: 'Software lifecycle - Traditional software development processes' },
      { code: 'ISO 13485', desc: 'Quality management - Standard QMS requirements' },
      { code: 'IEC 62366', desc: 'Usability engineering - Human factors requirements' },
      { code: 'ISO/IEC 82304', desc: 'Health software - General software product requirements' }
    ],
    irb: [
      { code: '45 CFR 46', desc: 'Common Rule - Human subjects protections from 1991' },
      { code: '21 CFR 50', desc: 'FDA human subjects - Standard informed consent requirements' },
      { code: '21 CFR 56', desc: 'IRB requirements - Traditional institutional review processes' },
      { code: '32 CFR 219', desc: 'DoD protections - Military-specific human subjects rules' },
      { code: 'Belmont Report', desc: 'Ethical principles - Respect, beneficence, justice (1979)' }
    ]
  };
  
  return (
    <SlideWrapper 
      slideNumber={8}
      slideTitle="Good News: Same Frameworks Apply"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <ContentWrapper>
        <FrameworkContainer>
          <RegulationColumn>
            <ColumnHeader $type="fda" $show={true}>
              <ColumnTitle>FDA Regulations</ColumnTitle>
              <ColumnSubtitle>Medical Device & Software</ColumnSubtitle>
            </ColumnHeader>
            {regulations.fda.map((reg, idx) => (
              <RegulationCard 
                key={idx} 
                $show={true}
                $delay={`${idx * 0.05}s`}
              >
                <RegCode $type="fda">{reg.code}</RegCode>
                <RegDesc>{reg.desc}</RegDesc>
              </RegulationCard>
            ))}
          </RegulationColumn>
          
          <RegulationColumn>
            <ColumnHeader $type="iso" $show={true} $delay="0.1s">
              <ColumnTitle>ISO Standards</ColumnTitle>
              <ColumnSubtitle>International Standards</ColumnSubtitle>
            </ColumnHeader>
            {regulations.iso.map((reg, idx) => (
              <RegulationCard 
                key={idx} 
                $show={true}
                $delay={`${(idx + 0.5) * 0.05}s`}
              >
                <RegCode $type="iso">{reg.code}</RegCode>
                <RegDesc>{reg.desc}</RegDesc>
              </RegulationCard>
            ))}
          </RegulationColumn>
          
          <RegulationColumn>
            <ColumnHeader $type="irb" $show={true} $delay="0.2s">
              <ColumnTitle>IRB/Ethics</ColumnTitle>
              <ColumnSubtitle>Human Subjects Protection</ColumnSubtitle>
            </ColumnHeader>
            {regulations.irb.map((reg, idx) => (
              <RegulationCard 
                key={idx} 
                $show={true}
                $delay={`${(idx + 1) * 0.05}s`}
              >
                <RegCode $type="irb">{reg.code}</RegCode>
                <RegDesc>{reg.desc}</RegDesc>
              </RegulationCard>
            ))}
          </RegulationColumn>
        </FrameworkContainer>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        The regulatory framework for AI research spans three major domains:
        
        1. FDA Regulations - Governing medical devices and software
        2. ISO Standards - International quality and safety standards
        3. IRB/Ethics - Human subjects protection requirements
        
        These regulations work together to ensure AI systems are safe, effective, 
        and ethically developed. Key regulations include 21 CFR 820.30 for design 
        controls, ISO 14971 for risk management, and 45 CFR 46 for human subjects protection.
        
        Press Space to reveal the framework (10 steps).
      </Notes>
    </SlideWrapper>
  );
};

export default SlideRegulatoryFramework;