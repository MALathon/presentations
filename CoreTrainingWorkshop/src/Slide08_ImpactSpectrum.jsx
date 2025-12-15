import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';
import styled from 'styled-components';

const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 10px 0 25px 0;
  letter-spacing: 0.5px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SpectrumContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
`;

const SpectrumBar = styled.div`
  position: relative;
  height: 60px;
  background: linear-gradient(90deg,
    rgba(76, 175, 80, 0.3) 0%,
    rgba(255, 193, 7, 0.3) 50%,
    rgba(244, 67, 54, 0.3) 100%
  );
  border-radius: 30px;
  margin: 30px 0 50px 0;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scaleX(${props => props.$visible ? 1 : 0});
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      #4CAF50 0%,
      #FFC107 50%,
      #F44336 100%
    );
    transform: translateY(-50%);
  }
`;

const SpectrumLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -40px;
  margin-bottom: 20px;
  padding: 0 20px;
`;

const SpectrumLabel = styled.div`
  font-size: 14px;
  color: ${props => props.$color};
  font-weight: 600;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.6s ease;
  transition-delay: ${props => props.$delay}s;
`;

const ImpactLevels = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 30px;
`;

const ImpactCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => {
    if (props.$level === 'low') return 'rgba(76, 175, 80, 0.4)';
    if (props.$level === 'moderate') return 'rgba(255, 193, 7, 0.4)';
    return 'rgba(244, 67, 54, 0.4)';
  }};
  border-radius: 12px;
  padding: 18px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '30px'}) scale(${props => props.$visible ? 1 : 0.9});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.06);
  }

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${props => {
      if (props.$level === 'low') return '#4CAF50';
      if (props.$level === 'moderate') return '#FFC107';
      return '#F44336';
    }};
    box-shadow: 0 0 15px ${props => {
      if (props.$level === 'low') return 'rgba(76, 175, 80, 0.5)';
      if (props.$level === 'moderate') return 'rgba(255, 193, 7, 0.5)';
      return 'rgba(244, 67, 54, 0.5)';
    }};
  }
`;

const ImpactTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${props => {
    if (props.$level === 'low') return '#4CAF50';
    if (props.$level === 'moderate') return '#FFC107';
    return '#F44336';
  }};
  margin: 0 0 10px 0;
`;

const ImpactDescription = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  margin: 0 0 10px 0;
`;

const ImpactExample = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  strong {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
  }
`;

const OversightIndicator = styled.div`
  margin-top: 40px;
  background: linear-gradient(135deg, rgba(63, 81, 181, 0.1) 0%, rgba(48, 63, 159, 0.1) 100%);
  border: 1px solid rgba(63, 81, 181, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.95});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.8s;
`;

const OversightText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin: 0;

  strong {
    color: #7986CB;
  }
`;

const Slide08_ImpactSpectrum = () => {
  const { step } = useSlideAnimation(8, 'slide-8-impact-spectrum');

  const impactLevels = [
    {
      level: 'low',
      title: 'Silent/Shadow Mode',
      description: 'AI runs in background without clinical use',
      example: 'Algorithm validation study',
      oversight: 'Standard data review + annual reports'
    },
    {
      level: 'moderate',
      title: 'Advisory Mode',
      description: 'AI provides recommendations for review',
      example: 'Risk scores shown in EHR',
      oversight: 'Performance monitoring + quarterly safety reviews'
    },
    {
      level: 'high',
      title: 'Active Intervention',
      description: 'AI triggers actions or alerts directly',
      example: 'Auto-schedules follow-ups',
      oversight: 'Real-time monitoring + DSMB + FDA consultation'
    }
  ];

  return (
    <SlideWrapper
      slideNumber={8}
      slideTitle="Impact Spectrum & Oversight Requirements"
      totalSlides={9}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Subtitle $visible={true} $delay="0.2s">Patient impact level determines IRB oversight requirements</Subtitle>

      <SpectrumContainer>
        <SpectrumBar $visible={true} $delay="0.4s" />
        <SpectrumLabels>
          <SpectrumLabel $color="#4CAF50" $visible={true} $delay={0}>
            Minimal
          </SpectrumLabel>
          <SpectrumLabel $color="#FFC107" $visible={true} $delay={0.1}>
            Moderate
          </SpectrumLabel>
          <SpectrumLabel $color="#F44336" $visible={true} $delay={0.2}>
            Significant
          </SpectrumLabel>
        </SpectrumLabels>

        <ImpactLevels>
          {impactLevels.map((impact, index) => (
            <ImpactCard
              key={impact.level}
              $level={impact.level}
              $visible={true}
              $delay={0.1 * index}
            >
              <ImpactTitle $level={impact.level}>
                {impact.title}
              </ImpactTitle>
              <ImpactDescription>
                {impact.description}
              </ImpactDescription>
              <ImpactExample>
                <strong>Example:</strong> {impact.example}
              </ImpactExample>
              <ImpactExample style={{marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px'}}>
                <strong style={{color: impact.level === 'low' ? '#4CAF50' : impact.level === 'moderate' ? '#FFC107' : '#F44336'}}>IRB Oversight:</strong> {impact.oversight}
              </ImpactExample>
            </ImpactCard>
          ))}
        </ImpactLevels>

        <OversightIndicator $visible={true} $delay="0.6s">
          <OversightText>
            <strong>Oversight Intensity:</strong> Proportional to the degree of patient care impact
          </OversightText>
        </OversightIndicator>
      </SpectrumContainer>

      <Notes>
        The impact on patient care exists on a spectrum, from minimal to significant:
        - Silent mode: AI operates behind the scenes, outputs never seen by clinicians
        - Shadow mode: Clinicians see outputs but are explicitly instructed not to use them
        - Decision support: AI actively informs clinical judgment
        - Autonomous action: AI triggers alerts or actions with minimal human intervention
        The degree of impact proportionally determines the appropriate oversight intensity.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide08_ImpactSpectrum;
