import React, { useState, useEffect } from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';
import { techCategories } from './techCharacteristics';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 60px;
  bottom: 60px;
  left: 80px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const MatrixContainer = styled.div`
  display: flex;
  gap: 40px;
  width: 100%;
  max-width: 1400px;
  height: 100%;
  align-items: stretch;
`;

const MatrixSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  justify-content: center;
`;

const MatrixGrid = styled.div`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 60px repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr) 60px;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 12px;
`;

const AxisLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
  text-align: center;
  padding: 10px;

  &.y-axis {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px 0 0 8px;
  }

  &.x-axis {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0 0 8px 8px;
  }
`;

const RiskCellContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 1000px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`${fadeIn} 0.5s ease-out`};
  animation-delay: ${props => props.$delay || '0s'};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

const RiskCell = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 120px;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  transform: ${props => props.$flipped ? 'rotateY(180deg)' : 'rotateY(0)'};
  cursor: ${props => props.$canFlip ? 'pointer' : 'default'};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const CardFace = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: ${props => {
    const risk = props.$riskLevel;
    if (risk <= 1) return 'linear-gradient(135deg, #4CAF50, #66BB6A)';
    if (risk <= 2) return 'linear-gradient(135deg, #8BC34A, #9CCC65)';
    if (risk <= 3) return 'linear-gradient(135deg, #FFC107, #FFD54F)';
    if (risk <= 4) return 'linear-gradient(135deg, #FF9800, #FFB74D)';
    if (risk <= 5) return 'linear-gradient(135deg, #FF5722, #FF7043)';
    return 'linear-gradient(135deg, #F44336, #EF5350)';
  }};

  /* Pattern overlay for accessibility - different patterns per risk level */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    border-radius: 8px;
    opacity: 0.15;
    background: ${props => {
      const risk = props.$riskLevel;
      if (risk <= 1) return 'none'; /* Solid for low */
      if (risk <= 2) return 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 10px)'; /* Horizontal lines */
      if (risk <= 3) return 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 8px)'; /* Diagonal lines */
      if (risk <= 4) return 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 8px)'; /* Vertical lines */
      if (risk <= 5) return 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.4) 4px, rgba(255,255,255,0.4) 6px)'; /* Dense diagonal */
      return 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 5px), repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 5px)'; /* Cross-hatch for critical */
    }};
  }

  &.front {
    z-index: 2;
    transition: box-shadow 0.3s ease;
  }

  &.back {
    transform: rotateY(180deg);
    overflow-y: auto;
  }
`;

const CellContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const RiskLabel = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  text-align: center;
  margin-bottom: 4px;
`;

const RiskDetails = styled.div`
  margin-top: 6px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ControlBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  gap: 6px;

  .number {
    font-size: 16px;
    color: white;
    font-weight: 700;
  }

  .label {
    font-size: 14px;
  }
`;

const MitigationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  flex: 1;
  overflow-y: auto;
`;

const MitigationItem = styled.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  line-height: 1.3;

  .check {
    color: #E0E0E0;
    flex-shrink: 0;
    font-weight: bold;
    font-size: 12px;
  }
`;

const BackTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
  text-align: center;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const OversightBadge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  z-index: 10;
`;

const Q3Panel = styled.div`
  width: 380px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  border-radius: 12px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateX(${props => props.$visible ? 0 : '20px'});
  transition: all 0.5s ease;
  align-self: center;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
    opacity: 1;
  }
`;

const PanelTitle = styled.h3`
  font-size: 20px;
  color: #FFC107;
  margin: 0 0 15px 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Q3Badge = styled.span`
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(255, 193, 7, 0.4);
`;

const PanelSubtitle = styled.div`
  font-size: 14px;
  color: #E0E0E0;
  margin-bottom: 15px;
  line-height: 1.4;
`;

const TechDropdown = styled.select`
  width: 100%;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 13px;
  margin-bottom: 15px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #FFC107;
  }

  option {
    background: #003B71;
    color: white;
  }
`;

const RiskFactorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 5px;
`;

const RiskFactor = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 10px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
`;

const RiskCheckbox = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${props => props.$present ? '#FFC107' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 3px;
  background: ${props => props.$present ? 'rgba(255, 193, 7, 0.2)' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;

  &::after {
    content: ${props => props.$present ? '"✓"' : '""'};
    color: #FFC107;
    font-size: 11px;
    font-weight: bold;
  }
`;

const FactorContent = styled.div`
  flex: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
`;

const FactorTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$present ? '#FFC107' : '#E0E0E0'};
  line-height: 1.2;
`;

const FactorDesc = styled.div`
  font-size: 12px;
  color: #C7C7C7;
  line-height: 1.2;
  margin-top: 2px;
`;

const RiskScore = styled.div`
  display: flex;
  gap: 2px;
  margin-left: auto;
  padding-left: 8px;
`;

const RiskDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 1px;
  background: ${props => props.$filled ?
    (props.$level === 4 ? '#FF6B6B' :
     props.$level === 3 ? '#FF9800' :
     props.$level === 2 ? '#FFC107' :
     '#9E9E9E') : 'rgba(255, 255, 255, 0.2)'};
`;

const TotalScore = styled.div`
  margin-top: 15px;
  padding: 10px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-size: 14px;
    color: #E0E0E0;
  }

  .score {
    font-size: 16px;
    font-weight: 600;
    color: #FFC107;
  }
`;

const Slide09_RiskMatrix = () => {
  const [flippedCells, setFlippedCells] = useState({});
  const [techCategory, setTechCategory] = useState('ml');
  const [q3Factors, setQ3Factors] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      const params = new URLSearchParams(window.location.search);
      const slideIndex = params.get('slideIndex');
      if (slideIndex !== '8') return;

      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        setFlippedCells({});
        setQ3Factors({});
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFactor = (factor) => {
    setQ3Factors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }));
  };

  const toggleCellFlip = (index) => {
    setFlippedCells(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const q3Characteristics = techCategories[techCategory].characteristics.sort((a, b) => b.score - a.score);

  const calculateQ3Impact = () => {
    const totalScore = q3Characteristics.reduce((sum, characteristic) =>
      sum + (q3Factors[characteristic.key] ? characteristic.score : 0), 0
    );
    if (totalScore === 0) return 0;
    if (totalScore <= 3) return 1;
    if (totalScore <= 6) return 2;
    if (totalScore <= 9) return 3;
    return 4;
  };

  const matrixData = [
    { row: 0, col: 1, risk: 4, label: 'Medium-High', oversight: 'Enhanced Review', details: 'Exploratory with direct impact', q1: 'Exploratory', q2: 'Direct Care' },
    { row: 0, col: 2, risk: 5, label: 'High', oversight: 'Full IRB', details: 'Translational affecting patients', q1: 'Translational', q2: 'Direct Care' },
    { row: 0, col: 3, risk: 6, label: 'Critical', oversight: 'Full IRB + Monitoring', details: 'Clinical deployment to patients', q1: 'Clinical', q2: 'Direct Care' },
    { row: 1, col: 1, risk: 2, label: 'Low-Medium', oversight: 'Standard Review', details: 'Exploratory with indirect effects', q1: 'Exploratory', q2: 'Indirect' },
    { row: 1, col: 2, risk: 3, label: 'Medium', oversight: 'Enhanced Review', details: 'Translational validation phase', q1: 'Translational', q2: 'Indirect' },
    { row: 1, col: 3, risk: 4, label: 'Medium-High', oversight: 'Full IRB', details: 'Clinical decision support', q1: 'Clinical', q2: 'Indirect' },
    { row: 2, col: 1, risk: 1, label: 'Low', oversight: 'Minimal', details: 'Pure research, no patient involvement', q1: 'Exploratory', q2: 'No Impact' },
    { row: 2, col: 2, risk: 2, label: 'Low-Medium', oversight: 'Standard Review', details: 'Algorithm development phase', q1: 'Translational', q2: 'No Impact' },
    { row: 2, col: 3, risk: 3, label: 'Medium', oversight: 'Enhanced Review', details: 'Clinical readiness testing', q1: 'Clinical', q2: 'No Impact' },
  ];

  const getActiveMitigations = (cellRisk = null) => {
    const controls = [];
    if (calculateQ3Impact() === 0) return controls;

    q3Characteristics.forEach(characteristic => {
      if (q3Factors[characteristic.key]) {
        let riskCategory;
        if (cellRisk <= 2) riskCategory = 'low';
        else if (cellRisk <= 4) riskCategory = 'medium';
        else riskCategory = 'high';

        if (characteristic.controls && characteristic.controls[riskCategory]) {
          controls.push(...characteristic.controls[riskCategory]);
        }
      }
    });

    return [...new Set(controls)];
  };

  const shouldShowMitigations = (cellRisk) => {
    return cellRisk > 2 && calculateQ3Impact() > 0;
  };

  return (
    <SlideWrapper
      slideNumber={9}
      slideTitle="Risk Control Prioritization Matrix"
      totalSlides={9}
      navigationHint="ISO 14971-based framework - Select risks to see controls"
    >
      <ContentWrapper>
        <MatrixContainer>
          <MatrixSection>
            <div style={{
              position: 'absolute',
              left: '-120px',
              top: '40%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontSize: '16px',
              fontWeight: '600',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              width: '200px',
              textAlign: 'center'
            }}>
              Q2: Patient Impact
            </div>
            <MatrixGrid>
              <div style={{ gridRow: '1', gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px 0 0 0', padding: '8px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                Direct Care
              </div>
              <div style={{ gridRow: '2', gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', background: 'rgba(0, 0, 0, 0.3)', padding: '8px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                Indirect
              </div>
              <div style={{ gridRow: '3', gridColumn: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '0 0 0 8px', padding: '8px', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                No Impact
              </div>

              {matrixData.map((cell, index) => {
                const mitigations = getActiveMitigations(cell.risk);
                const hasControls = shouldShowMitigations(cell.risk) && mitigations.length > 0;

                return (
                  <RiskCellContainer
                    key={index}
                    $visible={true}
                    $delay={`${index * 0.1}s`}
                    style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
                  >
                    <RiskCell
                      $flipped={flippedCells[index]}
                      $canFlip={hasControls}
                      onClick={() => hasControls && toggleCellFlip(index)}
                    >
                      <CardFace className="front" $riskLevel={cell.risk}>
                        <OversightBadge>{cell.oversight}</OversightBadge>
                        <CellContent>
                          <RiskLabel>{cell.label} Risk</RiskLabel>
                          <RiskDetails>
                            <div style={{ fontSize: '14px', color: 'white', lineHeight: '1.3', textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)', fontWeight: '500' }}>
                              {cell.details}
                            </div>
                            {hasControls && (
                              <ControlBadge>
                                <span className="number">{mitigations.length}</span>
                                <span className="label">Controls</span>
                              </ControlBadge>
                            )}
                            {hasControls && (
                              <div style={{ fontSize: '12px', color: '#E0E0E0', marginTop: '6px', fontStyle: 'italic' }}>
                                Click to flip
                              </div>
                            )}
                          </RiskDetails>
                        </CellContent>
                      </CardFace>

                      <CardFace className="back" $riskLevel={cell.risk}>
                        <BackTitle>Potential Risk Controls</BackTitle>
                        <MitigationsList>
                          {mitigations.map((mitigation, idx) => (
                            <MitigationItem key={idx}>
                              <span className="check">-</span>
                              <span>{mitigation}</span>
                            </MitigationItem>
                          ))}
                        </MitigationsList>
                      </CardFace>
                    </RiskCell>
                  </RiskCellContainer>
                );
              })}

              <div style={{gridRow: '4', gridColumn: '1'}}></div>
              <AxisLabel className="x-axis" style={{gridRow: '4', gridColumn: '2'}}>Exploratory</AxisLabel>
              <AxisLabel className="x-axis" style={{gridRow: '4', gridColumn: '3'}}>Translational</AxisLabel>
              <AxisLabel className="x-axis" style={{gridRow: '4', gridColumn: '4'}}>Clinical</AxisLabel>
            </MatrixGrid>

            <div style={{textAlign: 'center', marginTop: '15px', fontSize: '16px', color: '#FFFFFF', fontWeight: '600'}}>
              Q1: Clinical Intent
            </div>
          </MatrixSection>

          <Q3Panel $visible={true} $delay="0.4s">
            <PanelTitle>
              <Q3Badge>Q3</Q3Badge>
              Technology Characteristics
            </PanelTitle>

            <PanelSubtitle>
              Select technology features to determine appropriate controls
            </PanelSubtitle>

            <TechDropdown value={techCategory} onChange={(e) => {
              setTechCategory(e.target.value);
              setQ3Factors({});
            }}>
              {Object.entries(techCategories).map(([key, cat]) => (
                <option key={key} value={key}>{cat.name}</option>
              ))}
            </TechDropdown>

            <RiskFactorList>
              {q3Characteristics.map((characteristic) => (
                <RiskFactor key={characteristic.key}>
                  <RiskCheckbox
                    $present={q3Factors[characteristic.key]}
                    onClick={() => toggleFactor(characteristic.key)}
                  />
                  <FactorContent onClick={() => toggleFactor(characteristic.key)}>
                    <div style={{display: 'flex', width: '100%', alignItems: 'center', gap: '8px'}}>
                      <div style={{flex: 1}}>
                        <FactorTitle $present={q3Factors[characteristic.key]}>
                          {characteristic.name}
                        </FactorTitle>
                        <FactorDesc>{characteristic.desc}</FactorDesc>
                      </div>
                      <RiskScore>
                        {[...Array(4)].map((_, i) => (
                          <RiskDot key={i} $filled={i < characteristic.score} $level={characteristic.score} />
                        ))}
                      </RiskScore>
                    </div>
                  </FactorContent>
                </RiskFactor>
              ))}
            </RiskFactorList>

            <TotalScore>
              <div className="label">Complexity Score</div>
              <div className="score">
                {q3Characteristics.reduce((sum, characteristic) =>
                  sum + (q3Factors[characteristic.key] ? characteristic.score : 0), 0)}
                 / {q3Characteristics.reduce((sum, c) => sum + c.score, 0)}
              </div>
            </TotalScore>
          </Q3Panel>
        </MatrixContainer>
      </ContentWrapper>

      <div style={{
        position: 'absolute',
        bottom: '70px',
        right: '40px',
        fontSize: '14px',
        color: '#C7C7C7',
        fontStyle: 'italic'
      }}>
        Based on ISO 14971 Risk Management
      </div>

      <InteractionHint>
        <kbd>R</kbd> Reset <span className="separator">|</span> Click cells to flip <span className="separator">|</span> Click factors to toggle
      </InteractionHint>

      <Notes>
        Risk-Based Oversight Framework

        This matrix shows how Q1 (Clinical Intent) and Q2 (Patient Impact) determine
        the base risk level and oversight requirements.

        Q3 (Technology Risks) adds another dimension - it doesn't change the base
        oversight level but informs what specific mitigations are needed.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide09_RiskMatrix;
