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
    transform: translateY(15px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
`;

const drawPath = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`;

const MainContainer = styled.div`
  position: absolute;
  top: 45px;
  bottom: 60px;
  left: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

// Title removed - using header from SlideWrapper instead

const PathwayContainer = styled.div`
  width: 100%;
  max-width: 1500px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 50px;
  margin-top: 0;
`;

const PathSection = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 220px;
`;

const SectionLabel = styled.div`
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 160px;
  text-align: center;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.6s ease-out
  `};
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: ${props => props.$isTraditional ? '#66BB6A' : '#FF9800'};
  margin: 0 0 6px 0;
  font-weight: 600;
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-style: italic;
`;

const PathArea = styled.div`
  position: absolute;
  left: 220px;
  right: 0;
  top: 0;
  bottom: 0;
`;

const PathSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const PathLine = styled.path`
  fill: none;
  stroke: ${props => props.$color};
  stroke-width: 3;
  stroke-dasharray: ${props => props.$isDashed ? '10, 5' : 'none'};
  stroke-dashoffset: 1000;
  animation: ${props => props.$visible && css`
    ${drawPath} 1.5s ease-out forwards
  `};
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Node = styled.div`
  position: absolute;
  width: ${props => props.$isLarge ? '80px' : '50px'};
  height: ${props => props.$isLarge ? '80px' : '50px'};
  border-radius: 50%;
  background: ${props => {
    if (props.$type === 'irb') return '#4A90E2';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border: 3px solid ${props => {
    if (props.$type === 'irb') return '#357ABD';
    if (props.$type === 'phase') return 'rgba(255, 255, 255, 0.5)';
    return 'rgba(255, 255, 255, 0.4)';
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: ${props => props.$isLarge ? '20px' : '16px'};
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.8});
  transition: all 0.5s ease;
  transition-delay: ${props => props.$delay || '0s'};
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  /* Add a background mask to hide the line behind */
  &::before {
    content: '';
    position: absolute;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    border-radius: 50%;
    background: radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%);
    z-index: -1;
  }
  
  ${props => props.$type === 'irb' && css`
    animation: ${pulse} 2s ease-in-out infinite;
    box-shadow: 0 0 30px rgba(74, 144, 226, 0.5);
  `}
`;

const NodeLabel = styled.div`
  position: absolute;
  top: ${props => props.$above ? '-45px' : 'calc(100% + 10px)'};
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 6px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 14px;
  color: white;
  font-weight: 500;
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
  transition-delay: ${props => props.$delay || '0s'};
  text-align: center;
  line-height: 1.4;
  
  br {
    content: "";
    display: block;
    margin-top: 2px;
  }
`;

const QuestionPill = styled.div`
  position: absolute;
  background: rgba(255, 193, 7, 0.9);
  color: #000;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  border: 2px solid rgba(255, 152, 0, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.9});
  transition: all 0.4s ease;
  transition-delay: ${props => props.$delay || '0s'};
  z-index: 3;
  
  ${props => props.$visible && css`
    animation: ${pulse} 3s ease-in-out infinite;
  `}
`;

const KeyInsight = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 24px 40px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.12), rgba(255, 193, 7, 0.06));
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 16px;
  margin-top: 20px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeIn} 0.6s ease-out 0.3s both
  `};
`;

const InsightText = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.5;
  margin: 0;
  text-align: center;
  
  strong {
    color: #FFC107;
    font-weight: 600;
    background: rgba(255, 193, 7, 0.15);
    padding: 2px 8px;
    border-radius: 4px;
  }
`;

const Legend = styled.div`
  position: fixed;
  bottom: 80px;
  right: 40px;
  display: flex;
  gap: 30px;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.6s ease;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const LegendDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.$color};
  border: 2px solid ${props => props.$borderColor};
  box-shadow: ${props => props.$glow ? `0 0 10px ${props.$borderColor}` : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: white;
`;


const Slide6 = () => {
  const { step } = useSlideAnimation(3, 'slide-7-when-irb');


  return (
    <SlideWrapper 
      slideNumber={7}
      slideTitle="What Makes AI Different? Ambiguity"
      totalSlides={20}
    >
      <MainContainer>
        <PathwayContainer>
          {/* Traditional Research Path */}
          <PathSection>
            <SectionLabel $visible={true} $delay="0.2s">
              <SectionTitle $isTraditional>Traditional Research</SectionTitle>
              <SectionSubtitle>Clear IRB entry point</SectionSubtitle>
            </SectionLabel>
            
            <PathArea>
              <PathSvg viewBox="0 0 900 200">
                {/* Main path line */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 5, 0 10"
                      fill="rgba(102, 187, 106, 0.8)"
                    />
                  </marker>
                </defs>
                <PathLine
                  d="M 20 100 L 850 100"
                  $color="rgba(102, 187, 106, 0.8)"
                  $visible={true} $delay="0.4s"
                  markerEnd="url(#arrowhead)"
                />
              </PathSvg>
              
              {/* Nodes along traditional path - all centered at exactly 50% */}
              <Node $type="phase" $visible={true} $delay="0s" style={{left: '0%', top: 'calc(50% - 25px)'}}>
                1
                <NodeLabel $visible={true} $delay="0s">Lab Development</NodeLabel>
              </Node>
              
              <Node $type="phase" $visible={true} $delay="0.1s" style={{left: '25%', top: 'calc(50% - 25px)'}}>
                2
                <NodeLabel $visible={true} $delay="0.1s">Animal Testing</NodeLabel>
              </Node>
              
              <Node $type="irb" $isLarge $visible={true} $delay="0.2s" style={{left: '50%', top: 'calc(50% - 40px)'}}>
                IRB
                <NodeLabel $visible={true} $delay="0.2s" $above>First Human Study</NodeLabel>
              </Node>
              
              <Node $type="phase" $visible={true} $delay="0.3s" style={{left: '75%', top: 'calc(50% - 25px)'}}>
                3+
                <NodeLabel $visible={true} $delay="0.3s">Clinical Trials</NodeLabel>
              </Node>
            </PathArea>
          </PathSection>

          {/* AI Development Path */}
          <PathSection>
            <SectionLabel $visible={true} $delay="0.6000000000000001s">
              <SectionTitle>AI Development</SectionTitle>
              <SectionSubtitle>Multiple unclear decision points</SectionSubtitle>
            </SectionLabel>
            
            <PathArea>
              <PathSvg viewBox="0 0 900 200">
                {/* Branching paths for AI */}
                <PathLine
                  d="M 20 100 Q 150 100 200 60"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="0.8s"
                />
                <PathLine
                  d="M 20 100 Q 150 100 200 140"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1s"
                />
                <PathLine
                  d="M 200 60 Q 350 60 400 100"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1.2s"
                />
                <PathLine
                  d="M 200 140 Q 350 140 400 100"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1.4s"
                />
                <PathLine
                  d="M 400 100 Q 500 100 600 60"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1.5999999999999999s"
                />
                <PathLine
                  d="M 400 100 Q 500 100 600 140"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1.7999999999999998s"
                />
                <PathLine
                  d="M 600 60 Q 700 60 800 100"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="1.9999999999999998s"
                />
                <PathLine
                  d="M 600 140 Q 700 140 800 100"
                  $color="rgba(255, 152, 0, 0.4)"
                  $isDashed
                  $visible={true} $delay="2.1999999999999997s"
                />
              </PathSvg>
              
              {/* Nodes and question bubbles for AI path */}
              <Node $type="phase" $visible={true} $delay="0.2s" style={{left: '0%', top: 'calc(50% - 25px)'}}>
                1
                <NodeLabel $visible={true} $delay="0.4s">Data Collection</NodeLabel>
              </Node>
              <QuestionPill $visible={true} $delay="0.3s" style={{left: 'calc(0% - 60px)', top: 'calc(50% - 55px)'}}>
                Retrospective? IRB?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="0.4s" style={{left: '22%', top: 'calc(30% - 25px)'}}>
                ?
              </Node>
              <QuestionPill $visible={true} $delay="0.5s" style={{left: 'calc(22% - 50px)', top: 'calc(30% - 55px)'}}>
                Research or QI?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="0.4s" style={{left: '22%', top: 'calc(70% - 25px)'}}>
                ?
              </Node>
              <QuestionPill $visible={true} $delay="0.5s" style={{left: 'calc(22% - 60px)', top: 'calc(70% + 35px)'}}>
                De-identified? IRB?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="0.6s" style={{left: '45%', top: 'calc(50% - 25px)'}}>
                2
                <NodeLabel $visible={true} $delay="0.8s">Model Training</NodeLabel>
              </Node>
              <QuestionPill $visible={true} $delay="0.7s" style={{left: 'calc(45% - 75px)', top: 'calc(50% - 55px)'}}>
                External validation? IRB?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="0.8s" style={{left: '67%', top: 'calc(30% - 25px)'}}>
                ?
              </Node>
              <QuestionPill $visible={true} $delay="0.9s" style={{left: 'calc(67% - 50px)', top: 'calc(30% - 55px)'}}>
                Publishing? IRB?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="0.8s" style={{left: '67%', top: 'calc(70% - 25px)'}}>
                ?
              </Node>
              <QuestionPill $visible={true} $delay="0.9s" style={{left: 'calc(67% - 65px)', top: 'calc(70% + 35px)'}}>
                Patient consent? IRB?
              </QuestionPill>
              
              <Node $type="phase" $visible={true} $delay="1s" style={{left: '88%', top: 'calc(50% - 25px)'}}>
                3
                <NodeLabel $visible={true} $delay="1.2s">Model Deployment</NodeLabel>
              </Node>
              <QuestionPill $visible={true} $delay="1.1s" style={{left: 'calc(88% - 85px)', top: 'calc(50% - 55px)'}}>
                What Phase of Clinical Evaluation?
              </QuestionPill>
            </PathArea>
          </PathSection>
        </PathwayContainer>

        
          <KeyInsight $visible={true} $delay="2.4s">
            <InsightText>
              AI development has <strong>multiple ambiguous IRB decision points</strong> throughout the process
            </InsightText>
          </KeyInsight>
        
      </MainContainer>

      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Notes>
        When Does IRB Get Involved?
        
        This slide contrasts traditional research (like drug trials) where IRB involvement 
        is obvious and happens at a clear point, versus AI research where:
        
        1. Multiple points could require IRB review
        2. It's unclear at each point whether IRB is needed
        3. Depends on factors like: Is it research or QI? Retrospective or prospective?
        4. Even experienced researchers struggle with these determinations
        
        This sets up the need for the framework we'll present in the following slides.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide6;