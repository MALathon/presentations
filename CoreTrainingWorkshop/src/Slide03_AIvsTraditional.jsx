import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

const MainContainer = styled.div`
  position: absolute;
  top: 100px;
  bottom: 80px;
  left: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
`;

const ComparisonContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 1600px;
  gap: 60px;
  align-items: center;
  position: relative;
`;

const PathSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const PathHeader = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$isAI ? '#FF6B6B' : '#66BB6A'};
  text-align: center;
  margin-bottom: 10px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.6s ease-out ${props.$delay}s both
  `};
`;

const StepsRow = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  height: 120px;
  padding: 0 20px;
`;

const ProgressLine = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: ${props => props.$isAI ?
    'linear-gradient(90deg, rgba(255, 107, 107, 0.3) 0%, rgba(255, 107, 107, 0.5) 100%)' :
    'linear-gradient(90deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.5) 100%)'
  };
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    right: -10px;
    top: -5px;
    width: 0;
    height: 0;
    border-left: 12px solid ${props => props.$isAI ? 'rgba(255, 107, 107, 0.5)' : 'rgba(76, 175, 80, 0.5)'};
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
  }
`;

const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.5s ease-out ${props.$delay}s both
  `};
`;

const StepDot = styled.div`
  position: absolute;
  top: 18px;
  width: ${props => props.$highlight ? '28px' : '20px'};
  height: ${props => props.$highlight ? '28px' : '20px'};
  border-radius: 50%;
  background: ${props => {
    if (props.$isQuestion) return '#FFC107';
    if (props.$highlight) {
      return props.$isAI ? '#FF6B6B' : '#66BB6A';
    }
    return 'rgba(255, 255, 255, 0.3)';
  }};
  border: 2px solid ${props => {
    if (props.$isQuestion) return '#FFA000';
    if (props.$highlight) {
      return props.$isAI ? '#FF5252' : '#4CAF50';
    }
    return 'rgba(255, 255, 255, 0.2)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: ${props => props.$isQuestion ? '16px' : '12px'};
  color: white;
  transition: all 0.3s ease;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 50%;
    background: radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%);
    z-index: -1;
  }

  ${props => props.$highlight && css`
    animation: ${pulse} 2s ease-in-out infinite;
    box-shadow: 0 0 30px ${props.$isAI ? 'rgba(255, 107, 107, 0.6)' : 'rgba(76, 175, 80, 0.6)'};
  `}
`;

const StepText = styled.div`
  position: absolute;
  top: 60px;
  font-size: 15px;
  color: ${props => {
    if (props.$isQuestion) return '#FFC107';
    if (props.$highlight) return 'rgba(255, 255, 255, 0.95)';
    return 'rgba(255, 255, 255, 0.7)';
  }};
  text-align: center;
  font-weight: ${props => props.$highlight ? '500' : '400'};
  white-space: nowrap;
  ${props => props.$isQuestion && css`
    font-style: italic;
  `}
`;

const VSBadge = styled.div`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease 0.5s;
  z-index: 10;
`;

const KeyInsight = styled.div`
  padding: 24px 40px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.12), rgba(255, 193, 7, 0.06));
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 16px;
  text-align: center;
  max-width: 900px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.6s ease-out 0.3s both
  `};
`;

const InsightText = styled.p`
  font-size: 22px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;

  strong {
    color: #FFC107;
    font-weight: 600;
    background: rgba(255, 193, 7, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

const Slide03_AIvsTraditional = () => {
  const { step } = useSlideAnimation(3, 'slide-3-ai-vs-traditional');

  const traditionalSteps = [
    { text: 'Lab bench', number: '1' },
    { text: 'Animals', number: '2' },
    { text: 'IRB starts', number: '3', highlight: true },
    { text: 'Humans', number: '4' },
    { text: 'Trials', number: '5' }
  ];

  const aiSteps = [
    { text: 'Human data', number: '1', highlight: true },
    { text: 'Training', number: '2' },
    { text: 'Validation', number: '3' },
    { text: 'Testing', number: '4' },
    { text: 'IRB?', isQuestion: true }
  ];

  return (
    <SlideWrapper
      slideNumber={3}
      slideTitle="What Makes AI Different? Data"
      totalSlides={9}
    >
      <MainContainer>
        <ComparisonContainer>
          <PathSection>
            <PathHeader $visible={true} $delay={0}>
              Traditional Research
            </PathHeader>
            <StepsRow>
              <ProgressLine />
              {traditionalSteps.map((s, i) => (
                <Step
                  key={i}
                  $visible={true}
                  $delay={0.1 + i * 0.1}
                >
                  <StepDot
                    $highlight={true && s.highlight}
                  >
                    {s.number}
                  </StepDot>
                  <StepText $highlight={true && s.highlight}>
                    {s.text}
                  </StepText>
                </Step>
              ))}
            </StepsRow>
          </PathSection>

          <VSBadge $visible={true}>VS</VSBadge>

          <PathSection>
            <PathHeader $isAI $visible={true} $delay={0.3}>
              AI Research
            </PathHeader>
            <StepsRow>
              <ProgressLine $isAI />
              {aiSteps.map((s, i) => (
                <Step
                  key={i}
                  $visible={true}
                  $delay={0.4 + i * 0.1}
                >
                  <StepDot
                    $isAI
                    $highlight={s.highlight || s.isQuestion}
                    $isQuestion={s.isQuestion}
                  >
                    {s.isQuestion ? '?' : s.number}
                  </StepDot>
                  <StepText
                    $highlight={s.highlight || s.isQuestion}
                    $isQuestion={s.isQuestion}
                  >
                    {s.text}
                  </StepText>
                </Step>
              ))}
            </StepsRow>
          </PathSection>
        </ComparisonContainer>

        <KeyInsight $visible={true}>
          <InsightText>
            AI research <strong>starts with human data</strong> - there's no pre-human exploration phase
          </InsightText>
        </KeyInsight>
      </MainContainer>

      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Notes>
        What makes AI different from traditional research paths?

        In traditional research, we start with lab bench work, move to animal studies,
        and only then does the IRB get involved when we reach human subjects.

        But AI research uses human data from the very beginning. There's no pre-human phase.
        This raises an important question: When should IRB oversight begin?
      </Notes>
    </SlideWrapper>
  );
};

export default Slide03_AIvsTraditional;
