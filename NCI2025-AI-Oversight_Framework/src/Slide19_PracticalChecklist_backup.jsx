import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';
import { techCategories, getRecommendedControls } from './techCharacteristics';

// Updated to use technology characteristics instead of risks - cache bust v2

const ContentContainer = styled.div`
  width: 100%;
  margin: -30px 0 0;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Subtitle = styled.h2`
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0 0 10px 0;
  padding: 0 20px;
  
  span {
    color: #4AE2C0;
    font-weight: 600;
  }
`;


const MainContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 280px);
  max-height: 520px;
  min-width: 0; // Prevent container from growing
`;

// Three equal panels with fixed widths
const Panel = styled.div`
  flex: 1 1 33.333%;
  min-width: 0; // Prevent flex items from growing beyond their basis
  width: 33.333%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 226, 192, 0.3);
    border-radius: 2px;
  }
`;

const PanelTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: white;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StepBadge = styled.span`
  background: ${props => props.$color};
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
`;

// Question styles
const QuestionGroup = styled.div`
  margin-bottom: 15px;
`;

const QuestionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$color};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QuestionBadge = styled.span`
  background: ${props => props.$color};
  color: white;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
`;

const PlainLanguageQuestion = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin-bottom: 8px;
  padding-left: 15px;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 15px;
`;

const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  
  &:hover {
    color: white;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  cursor: pointer;
  accent-color: ${props => props.$color};
`;

const TechDropdown = styled.select`
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(74, 226, 192, 0.3);
  border-radius: 6px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  margin-bottom: 12px;
  
  &:focus {
    outline: none;
    border-color: #4AE2C0;
  }
  
  option {
    background: #003B71;
  }
`;

const YesNoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 15px;
`;

const YesNoQuestion = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const YesNoButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-left: auto;
`;

const YesNoButton = styled.button`
  padding: 2px 8px;
  font-size: 10px;
  border-radius: 3px;
  border: 1px solid ${props => 
    props.$selected ? 
      (props.$value === 'yes' ? '#4CAF50' : '#FF6B6B') : 
      'rgba(255, 255, 255, 0.2)'
  };
  background: ${props => 
    props.$selected ? 
      (props.$value === 'yes' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 107, 107, 0.2)') : 
      'transparent'
  };
  color: ${props => 
    props.$selected ? 
      (props.$value === 'yes' ? '#4CAF50' : '#FF6B6B') : 
      'rgba(255, 255, 255, 0.6)'
  };
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => 
      props.$value === 'yes' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 107, 107, 0.3)'
    };
  }
`;

const QuestionText = styled.span`
  flex: 1;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.3;
`;

// Risk item styles
const RiskItem = styled.div`
  margin-bottom: 10px;
  padding: 10px 12px;
  box-sizing: border-box;
  background: ${props => 
    props.$confidence === 'selected' ? 'rgba(156, 39, 176, 0.05)' :
    props.$confidence === 'high' ? 'rgba(255, 107, 107, 0.05)' :
    props.$confidence === 'medium' ? 'rgba(255, 193, 7, 0.05)' :
    props.$confidence === 'low' ? 'rgba(74, 226, 192, 0.02)' :
    'transparent'
  };
  border: 2px solid ${props => 
    props.$confidence === 'high' ? 'rgba(255, 107, 107, 0.4)' :
    props.$confidence === 'medium' ? 'rgba(255, 193, 7, 0.4)' :
    props.$confidence === 'low' ? 'rgba(74, 226, 192, 0.15)' :
    'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$confidence === 'high' && `
    &::before {
      content: 'REQUIRED';
      position: absolute;
      top: -10px;
      right: 10px;
      background: #FF6B6B;
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  `}
  
  ${props => props.$confidence === 'medium' && `
    &::before {
      content: 'CONSIDER';
      position: absolute;
      top: -10px;
      right: 10px;
      background: #FFC107;
      color: #1A1A1A;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  `}
`;

const RiskHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RiskCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  accent-color: #9C27B0;
  opacity: ${props => props.$disabled ? 0.7 : 1};
  margin-right: 8px;
`;

const RiskLabel = styled.label`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
`;

const RiskScore = styled.span`
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  background: ${props => {
    if (props.$score === 1) return 'rgba(255, 255, 255, 0.1)';
    if (props.$score === 2) return 'rgba(255, 193, 7, 0.2)';
    if (props.$score === 3) return 'rgba(255, 152, 0, 0.2)';
    return 'rgba(244, 67, 54, 0.2)';
  }};
  color: ${props => {
    if (props.$score === 1) return 'rgba(255, 255, 255, 0.6)';
    if (props.$score === 2) return '#FFC107';
    if (props.$score === 3) return '#FF9800';
    return '#F44336';
  }};
`;

const CategoryBadge = styled.span`
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 700;
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => 
    props.$category === 'required' ? 'rgba(156, 39, 176, 0.2)' :
    props.$category === 'recommended' ? 'rgba(33, 150, 243, 0.2)' :
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => 
    props.$category === 'required' ? '#CE93D8' :
    props.$category === 'recommended' ? '#90CAF9' :
    'rgba(255, 255, 255, 0.4)'
  };
  border: 1px solid ${props => 
    props.$category === 'required' ? 'rgba(156, 39, 176, 0.5)' :
    props.$category === 'recommended' ? 'rgba(33, 150, 243, 0.5)' :
    'rgba(255, 255, 255, 0.1)'
  };
`;

const JustificationInput = styled.textarea`
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 11px;
  font-family: inherit;
  resize: none;
  min-height: 45px;
  margin-top: 8px;
  box-sizing: border-box;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #FFC107;
  }
`;

// Protocol section styles
const ProtocolSection = styled.div`
  margin-bottom: 15px;
`;

const ProtocolHeader = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$color};
  margin-bottom: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  display: inline-block;
`;

const ProtocolItem = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  margin-bottom: 6px;
  padding-left: 20px;
  position: relative;
  
  &::before {
    content: '${props => props.$type === 'required' ? '•' : props.$type === 'section' ? '▶' : '✓'}';
    position: absolute;
    left: 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
`;

// Institution Profile Toggle Styles
const ProfileToggleContainer = styled.div`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const ProfileLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  margin-right: 20px;
`;

const ProfileToggle = styled.div`
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  padding: 3px;
  position: relative;
`;

const ProfileOption = styled.button`
  padding: 8px 18px;
  font-size: 11px;
  border: none;
  background: ${props => props.$active ? 
    props.$profile === 'conservative' ? 'rgba(255, 107, 107, 0.3)' :
    props.$profile === 'standard' ? 'rgba(74, 226, 192, 0.3)' :
    'rgba(30, 136, 229, 0.3)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: ${props => props.$active ? '600' : '400'};
  
  &:hover {
    background: ${props => !props.$active && 'rgba(255, 255, 255, 0.05)'};
  }
`;

const ProfileDescription = styled.div`
  font-size: 14px;
  color: ${props => 
    props.$profile === 'conservative' ? 'rgba(255, 107, 107, 1)' :
    props.$profile === 'standard' ? 'rgba(74, 226, 192, 1)' :
    'rgba(30, 136, 229, 1)'};
  margin-left: auto;
  padding-left: 20px;
  font-weight: 600;
`;

const Slide16PracticalChecklist = () => {
  const [techType, setTechType] = useState('ml');
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answers, setQ2Answers] = useState({});
  const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
  const [characteristicStatus, setCharacteristicStatus] = useState({}); // 'mitigated', 'evaluating', 'no_risk'
  const [selectedControls, setSelectedControls] = useState({}); // Which controls are selected for each characteristic
  const [customControls, setCustomControls] = useState({}); // Custom control descriptions
  const [noRiskJustifications, setNoRiskJustifications] = useState({}); // Why no risk exists
  const [oversightLevel, setOversightLevel] = useState('minimal');
  const [institutionProfile, setInstitutionProfile] = useState('standard');

  // Get technology characteristics with requirement levels based on ALL factors
  const getTechnologyCharacteristics = useMemo(() => () => {
    if (!techCategories[techType] || !q1Answer) return [];
    
    const allCharacteristics = [...techCategories[techType].characteristics];
    
    // Three categories of characteristics
    const requiredKeys = new Set();  // Must select, can't deselect
    const recommendedKeys = new Set();  // Should evaluate, highlighted
    const optionalKeys = new Set();  // Available but not emphasized
    
    // STEP 1: REQUIRED CHARACTERISTICS BASED ON Q2 ANSWERS
    // These are non-negotiable based on what the user said they're doing
    
    // Universal requirements (any phase)
    if (q2Answers.vulnerable === 'yes') {
      requiredKeys.add('vulnerable_populations');
      if (techType === 'apps') requiredKeys.add('pediatric');
    }
    
    if (q2Answers.autonomous === 'yes') {
      requiredKeys.add('autonomous');
    }
    
    // Discovery phase requirements
    if (q1Answer === 'discovery') {
      if (q2Answers.real_data === 'yes') {
        requiredKeys.add('patient_data');
        if (techType === 'llm') requiredKeys.add('context_window');
        if (techType === 'ml') requiredKeys.add('training_data');
      }
      if (q2Answers.identifiable === 'yes') {
        requiredKeys.add('patient_data');
        recommendedKeys.add('black_box'); // Need to explain decisions
      }
      if (q2Answers.share_model === 'yes') {
        requiredKeys.add('multi_site');
        recommendedKeys.add('training_data');
      }
      if (q2Answers.memorization === 'yes' && techType === 'ml') {
        requiredKeys.add('continuous_learning');
      }
    }
    
    // Translational phase requirements
    if (q1Answer === 'translational') {
      if (q2Answers.clinician_use === 'yes') {
        requiredKeys.add('clinical_decisions');
        if (techType === 'llm') recommendedKeys.add('hallucination');
      }
      if (q2Answers.pilot_patients === 'yes') {
        requiredKeys.add('patient_data');
        if (techType === 'imaging') recommendedKeys.add('diagnostic');
      }
      if (q2Answers.clinical_advice === 'yes' && techType === 'llm') {
        requiredKeys.add('medical_knowledge');
        requiredKeys.add('hallucination');
      }
      if (q2Answers.override === 'no') {
        recommendedKeys.add('autonomous');
      }
    }
    
    // Clinical phase requirements
    if (q1Answer === 'clinical') {
      if (q2Answers.treatment === 'yes') {
        requiredKeys.add('clinical_decisions');
        if (techType === 'imaging') requiredKeys.add('diagnostic');
        if (techType === 'llm') requiredKeys.add('medical_knowledge');
      }
      if (q2Answers.critical === 'yes' || q2Answers.emergency === 'yes') {
        if (techType === 'wearables') requiredKeys.add('emergency_detection');
        if (techType === 'imaging') requiredKeys.add('real_time');
        recommendedKeys.add('vital_signs');
      }
      if (q2Answers.patient_facing === 'yes' && techType === 'llm') {
        requiredKeys.add('conversational');
        requiredKeys.add('prompt_injection'); // Security concern
      }
      if (q2Answers.direct_care === 'yes') {
        requiredKeys.add('clinical_decisions');
        recommendedKeys.add('diagnostic');
      }
    }
    
    // Calculate impact level for recommendations
    const impactLevel = (() => {
      let score = 0;
      if (q2Answers.vulnerable === 'yes') score += 2;
      if (q2Answers.autonomous === 'yes') score += 2;
      if (q2Answers.treatment === 'yes') score += 2;
      if (q2Answers.critical === 'yes') score += 2;
      if (q2Answers.real_data === 'yes') score += 1;
      if (q2Answers.patient_facing === 'yes') score += 1;
      return score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low';
    })();
    
    // STEP 2: TECHNOLOGY-SPECIFIC + PHASE-SPECIFIC RECOMMENDATIONS
    if (techType === 'ml') {
      if (q1Answer === 'discovery') {
        // ML Discovery: Focus on data and bias
        recommendedKeys.add('patient_data');
        recommendedKeys.add('black_box');
        if (impactLevel !== 'low') {
          recommendedKeys.add('continuous_learning');
          recommendedKeys.add('rare_events');
        }
        optionalKeys.add('multi_site');
      } else if (q1Answer === 'translational') {
        // ML Translational: Add validation concerns
        recommendedKeys.add('clinical_decisions');
        recommendedKeys.add('black_box');
        if (impactLevel === 'high') {
          recommendedKeys.add('autonomous');
          recommendedKeys.add('vulnerable_populations');
        }
        optionalKeys.add('continuous_learning');
      } else if (q1Answer === 'clinical') {
        // ML Clinical: All critical characteristics
        if (!requiredKeys.has('clinical_decisions')) recommendedKeys.add('clinical_decisions');
        if (!requiredKeys.has('autonomous')) recommendedKeys.add('autonomous');
        if (impactLevel !== 'low') {
          recommendedKeys.add('continuous_learning');
          recommendedKeys.add('rare_events');
        }
      }
    } else if (techType === 'llm') {
      if (q1Answer === 'discovery') {
        // LLM Discovery: Focus on data leakage
        recommendedKeys.add('training_data');
        recommendedKeys.add('context_window');
        if (impactLevel !== 'low') {
          recommendedKeys.add('external_api');
        }
      } else if (q1Answer === 'translational') {
        // LLM Translational: Hallucination is key
        recommendedKeys.add('hallucination');
        recommendedKeys.add('generates_text');
        if (q2Answers.patient_facing === 'yes') {
          recommendedKeys.add('conversational');
        }
      } else if (q1Answer === 'clinical') {
        // LLM Clinical: All safety-critical
        recommendedKeys.add('medical_knowledge');
        recommendedKeys.add('hallucination');
        recommendedKeys.add('conversational');
        if (impactLevel === 'high') {
          recommendedKeys.add('prompt_injection');
        }
      }
    } else if (techType === 'imaging') {
      if (q1Answer === 'discovery') {
        // Imaging Discovery: Basic analysis
        recommendedKeys.add('black_box');
        recommendedKeys.add('quantitative');
      } else if (q1Answer === 'translational') {
        // Imaging Translational: Validation focus
        recommendedKeys.add('diagnostic');
        recommendedKeys.add('triage');
        if (impactLevel !== 'low') {
          recommendedKeys.add('incidental');
        }
      } else if (q1Answer === 'clinical') {
        // Imaging Clinical: All diagnostic concerns
        recommendedKeys.add('diagnostic');
        recommendedKeys.add('real_time');
        recommendedKeys.add('triage');
        if (impactLevel === 'high') {
          recommendedKeys.add('screening');
          recommendedKeys.add('incidental');
        }
      }
    } else if (techType === 'wearables') {
      if (q1Answer === 'discovery') {
        // Wearables Discovery: Data collection
        recommendedKeys.add('continuous');
        recommendedKeys.add('remote');
      } else if (q1Answer === 'translational') {
        // Wearables Translational: Accuracy focus
        recommendedKeys.add('vital_signs');
        recommendedKeys.add('alerts');
      } else if (q1Answer === 'clinical') {
        // Wearables Clinical: Emergency response
        recommendedKeys.add('emergency_detection');
        recommendedKeys.add('vital_signs');
        recommendedKeys.add('alerts');
        if (impactLevel === 'high') {
          recommendedKeys.add('continuous');
        }
      }
    } else if (techType === 'apps') {
      if (q1Answer === 'discovery') {
        // Apps Discovery: User engagement
        recommendedKeys.add('therapeutic');
      } else if (q1Answer === 'translational') {
        // Apps Translational: Efficacy testing
        recommendedKeys.add('therapeutic');
        if (q2Answers.vulnerable === 'yes') {
          recommendedKeys.add('pediatric');
        }
      } else if (q1Answer === 'clinical') {
        // Apps Clinical: Safety-critical
        recommendedKeys.add('mental_health');
        recommendedKeys.add('therapeutic');
        if (impactLevel === 'high') {
          recommendedKeys.add('substance_use');
          recommendedKeys.add('medication_mgmt');
        }
      }
    }
    
    // STEP 3: INSTITUTION PROFILE ADJUSTMENTS
    if (institutionProfile === 'conservative') {
      // Conservative: Be more cautious, upgrade recommendations to required
      allCharacteristics.forEach(char => {
        if (char.score >= 4) {
          // Critical characteristics become required
          if (!requiredKeys.has(char.key)) recommendedKeys.add(char.key);
        } else if (char.score >= 3 && impactLevel !== 'low') {
          // High severity become recommended
          if (!requiredKeys.has(char.key) && !recommendedKeys.has(char.key)) {
            recommendedKeys.add(char.key);
          }
        } else if (char.score >= 2) {
          // Medium severity available as optional
          optionalKeys.add(char.key);
        }
      });
    } else if (institutionProfile === 'streamlined') {
      // Streamlined: Focus on essentials only
      // Move some recommended to optional if not critical
      const tempRecommended = new Set(recommendedKeys);
      tempRecommended.forEach(key => {
        const char = allCharacteristics.find(c => c.key === key);
        if (char && char.score < 3 && impactLevel === 'low') {
          recommendedKeys.delete(key);
          optionalKeys.add(key);
        }
      });
    } else {
      // Standard: Balanced approach - add remaining as optional
      allCharacteristics.forEach(char => {
        if (!requiredKeys.has(char.key) && !recommendedKeys.has(char.key)) {
          if (char.score >= 2 || q1Answer === 'clinical') {
            optionalKeys.add(char.key);
          }
        }
      });
    }
    
    // STEP 4: CREATE FINAL CHARACTERISTIC LIST WITH CATEGORIES
    const characteristics = [];
    
    // Add all characteristics that are in any category
    allCharacteristics.forEach(char => {
      let category = null;
      if (requiredKeys.has(char.key)) {
        category = 'required';
      } else if (recommendedKeys.has(char.key)) {
        category = 'recommended';
      } else if (optionalKeys.has(char.key)) {
        category = 'optional';
      }
      
      if (category) {
        characteristics.push({
          ...char,
          category,  // Add category for UI rendering
          controls: [] // Controls will be determined based on risk level
        });
      }
    });
    
    // Special case: If no characteristics match (edge case), show top 2-3 most relevant
    if (characteristics.length === 0) {
      return allCharacteristics
        .sort((a, b) => b.score - a.score)
        .slice(0, institutionProfile === 'streamlined' ? 2 : 3)
        .map(char => ({
          ...char,
          category: 'optional',
          controls: []
        }));
    }
    
    // Sort by category priority and then severity
    const categoryOrder = { required: 0, recommended: 1, optional: 2 };
    return characteristics.sort((a, b) => {
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
      if (categoryDiff !== 0) return categoryDiff;
      return b.score - a.score; // Within category, sort by severity
    });
  }, [techType, q1Answer, q2Answers, institutionProfile]);

  // REMOVED OLD CODE - replaced with getTechnologyCharacteristics
  /* const getPhaseAppropriateTechRisks_OLD = () => {
    const riskCategories = {
      discovery: [
        { key: 'patient_reidentified', name: 'Patients could be re-identified', score: 2, desc: 'Despite de-identification, AI might reveal who patients are' },
        { key: 'missing_groups', name: 'Some groups left out', score: 1, desc: 'Training data might not include all patient populations' },
        { key: 'unexpected_finding', name: 'Finding something we weren\'t looking for', score: 2, desc: 'AI discovers conditions we didn\'t plan to study' },
        { key: 'garbage_in', name: 'Bad data leads to bad results', score: 1, desc: 'Errors or biases in data get amplified' }
      ],
      translational: [
        { key: 'works_differently', name: 'Works differently in real clinic', score: 3, desc: 'What worked in the lab fails with real patients' },
        { key: 'makes_bias_worse', name: 'Makes existing problems worse', score: 3, desc: 'AI amplifies healthcare disparities that already exist' },
        { key: 'false_confidence', name: 'People trust it too much', score: 2, desc: 'Users assume AI is more reliable than it really is' },
        { key: 'workflow_mess', name: 'Disrupts how clinicians work', score: 2, desc: 'AI doesn\'t fit into existing clinical workflow' },
        { key: 'confusing_output', name: 'Nobody understands what it means', score: 3, desc: 'AI gives answers without useful explanations' }
      ],
      clinical: [
        { key: 'wrong_diagnosis', name: 'Wrong diagnosis or treatment', score: 4, desc: 'AI recommendation directly harms patient' },
        { key: 'blind_trust', name: 'Clinicians stop double-checking', score: 3, desc: 'Over-reliance on AI reduces human oversight' },
        { key: 'unfair_care', name: 'Some patients get worse care', score: 4, desc: 'AI performs differently for different groups' },
        { key: 'misses_danger', name: 'Misses something critical', score: 4, desc: 'Fails to catch life-threatening conditions' },
        { key: 'whos_responsible', name: 'Nobody knows who\'s responsible', score: 3, desc: 'Unclear who\'s liable when AI makes mistakes' }
      ]
    };

    // Technology-specific modifiers (how these risks show up in different tech)
    const techModifiers = {
      ml: {
        patient_reidentified: 'Model might memorize specific patients',
        missing_groups: 'Training data from one hospital might not work at another',
        works_differently: 'Works great on test data, fails in the real world',
        makes_bias_worse: 'Learns from biased historical decisions',
        wrong_diagnosis: 'Misclassifies risk levels or conditions',
        blind_trust: 'Numbers look precise so people don\'t question them'
      },
      llm: {
        patient_reidentified: 'Might output actual patient data from training',
        missing_groups: 'Trained mostly on English medical literature',
        works_differently: 'Different prompts give wildly different answers',
        false_confidence: 'Sounds convincing even when completely wrong',
        wrong_diagnosis: 'Makes up medical facts that sound real',
        misses_danger: 'Gives dangerous advice with confidence'
      },
      imaging: {
        patient_reidentified: 'Unique anatomical features could identify someone',
        missing_groups: 'Trained mostly on one demographic group',
        works_differently: 'Different scanner types give different results',
        makes_bias_worse: 'Works better for some skin tones than others',
        wrong_diagnosis: 'Misses tumors or sees ones that aren\'t there',
        blind_trust: 'Radiologists might not look as carefully'
      },
      wearables: {
        patient_reidentified: '24/7 monitoring creates unique patterns',
        garbage_in: 'Sensor drift or poor placement affects everything',
        works_differently: 'Lab calibration doesn\'t match home use',
        false_confidence: 'People think consumer device = medical grade',
        wrong_diagnosis: 'False alarms or missed real events',
        workflow_mess: 'Doctors overwhelmed by constant data streams'
      },
      apps: {
        patient_reidentified: 'Behavioral patterns are like fingerprints',
        missing_groups: 'Requires smartphone and digital literacy',
        works_differently: 'People use apps differently than in studies',
        false_confidence: 'Patients skip real therapy for an app',
        wrong_diagnosis: 'Gives bad mental health or diet advice',
        whos_responsible: 'Is it the app maker, doctor, or hospital?'
      }
    };

    // Get base risks for the phase
    let risks = riskCategories[q1Answer] || [];
    
    // Add tech-specific descriptions if available
    if (techModifiers[techType]) {
      risks = risks.map(risk => ({
        ...risk,
        techDetail: techModifiers[techType][risk.key] || risk.desc
      }));
    }
    
    return risks;
  }; */

  // Get dynamic Q2 questions based on Q1, tech type, and institution profile
  const getDynamicQ2Questions = () => {
    if (!q1Answer) return [];
    
    const questions = [];
    
    // Phase-specific core questions with plain language
    if (q1Answer === 'discovery') {
      questions.push(
        { key: 'real_data', text: 'Will you use actual patient records or data?' },
        { key: 'identifiable', text: 'Could someone figure out who a patient is?' }
      );
      
      // Conservative adds more questions
      if (institutionProfile === 'conservative') {
        questions.push({ key: 'future_use', text: 'Could this be used for patient care later?' });
        questions.push({ key: 'data_sharing', text: 'Will data or results be shared outside your team?' });
      }
      
      // Tech-specific for discovery
      if (techType === 'llm') {
        questions.push({ key: 'memorization', text: 'Could the AI remember specific patient details?' });
      }
      if ((techType === 'ml' || techType === 'imaging') && institutionProfile !== 'streamlined') {
        questions.push({ key: 'share_model', text: 'Will others use your trained AI model?' });
      }
      
    } else if (q1Answer === 'translational') {
      questions.push(
        { key: 'clinician_use', text: 'Will doctors or nurses see what the AI says?' },
        { key: 'pilot_patients', text: 'Will you test this with real patients?' }
      );
      
      // Conservative adds caution questions
      if (institutionProfile === 'conservative') {
        questions.push({ key: 'clinical_reliance', text: 'Might clinicians rely on this for decisions?' });
        questions.push({ key: 'patient_awareness', text: 'Will patients know AI is being used?' });
      }
      
      // Standard adds moderate questions
      if (institutionProfile === 'standard') {
        questions.push({ key: 'override', text: 'Can clinicians easily ignore the AI advice?' });
      }
      
      // Tech-specific for translational
      if (techType === 'llm') {
        questions.push({ key: 'clinical_advice', text: 'Could it suggest treatments or diagnoses?' });
      }
      if (techType === 'imaging' && institutionProfile !== 'streamlined') {
        questions.push({ key: 'screening', text: 'Will it look for diseases in healthy people?' });
      }
      if (techType === 'wearables') {
        questions.push({ key: 'alerts', text: 'Will it send health alerts to doctors?' });
      }
      
    } else if (q1Answer === 'clinical') {
      questions.push(
        { key: 'treatment', text: 'Will it change how patients are treated?' },
        { key: 'autonomous', text: 'Can it make decisions on its own?' }
      );
      
      // Conservative adds safety questions
      if (institutionProfile === 'conservative') {
        questions.push({ key: 'reversible', text: 'Can its decisions be easily undone?' });
        questions.push({ key: 'emergency', text: 'Will it be used in emergencies?' });
        questions.push({ key: 'sole_basis', text: 'Might it be the only tool used to decide?' });
      }
      
      // Tech-specific for clinical
      if (techType === 'imaging') {
        questions.push({ key: 'critical', text: 'Will it look for serious diseases like cancer?' });
      }
      if (techType === 'apps') {
        questions.push({ key: 'replace_therapy', text: 'Will patients use this instead of seeing a doctor?' });
      }
      if (techType === 'llm') {
        questions.push({ key: 'patient_facing', text: 'Will patients talk directly to the AI?' });
      }
    }
    
    // Universal question - always ask about vulnerable populations
    if (institutionProfile === 'conservative') {
      questions.push({ key: 'vulnerable', text: 'Could this affect children, elderly, or disadvantaged groups?' });
    } else {
      questions.push({ key: 'vulnerable', text: 'Will you include vulnerable populations?' });
    }
    
    // Adjust question count based on institution profile
    if (institutionProfile === 'streamlined') {
      // Streamlined: Still show important questions, but fewer overall
      // Prioritize critical safety questions
      const priorityKeys = ['treatment', 'autonomous', 'critical', 'vulnerable', 'real_data', 'patient_facing'];
      const priorityQuestions = questions.filter(q => priorityKeys.includes(q.key));
      const otherQuestions = questions.filter(q => !priorityKeys.includes(q.key));
      // Take all priority questions plus 1-2 others
      return [...priorityQuestions, ...otherQuestions.slice(0, 2)].slice(0, 5);
    } else if (institutionProfile === 'conservative') {
      // Conservative: Show more questions for thoroughness
      return questions.slice(0, 7);
    } else {
      // Standard: Balanced approach
      return questions.slice(0, 5);
    }
  };

  // Determine base risk level from Q1 and Q2
  const baseRiskLevel = useMemo(() => {
    let riskScore = 0;
    
    // Q1 contributes to base risk
    if (q1Answer === 'clinical') riskScore += 3;
    else if (q1Answer === 'translational') riskScore += 2;
    else if (q1Answer === 'discovery') riskScore += 1;
    
    // Q2 answers contribute to risk
    if (q2Answers.vulnerable === 'yes') riskScore += 2;
    if (q2Answers.real_data === 'yes' && q2Answers.identifiable === 'yes') riskScore += 2;
    if (q2Answers.patient_facing === 'yes') riskScore += 1;
    if (q2Answers.replace_judgment === 'yes') riskScore += 2;
    if (q2Answers.direct_care === 'yes') riskScore += 2;
    if (q2Answers.autonomous === 'yes') riskScore += 2;
    if (q2Answers.treatment === 'yes') riskScore += 2;
    
    // Convert to risk level
    if (riskScore <= 2) return 'low';
    if (riskScore <= 5) return 'medium';
    return 'high';
  }, [q1Answer, q2Answers]);

  // Calculate oversight level based on control implementation gap
  useEffect(() => {
    if (!q1Answer) {
      setOversightLevel('minimal');
      return;
    }
    
    // Get selected characteristics
    const characteristics = getTechnologyCharacteristics();
    const selectedChars = characteristics.filter(c => selectedCharacteristics[c.key]);
    
    // If nothing selected yet, start with minimal
    if (selectedChars.length === 0) {
      // Base oversight on Q1 and Q2 answers only
      if (q2Answers.vulnerable === 'yes') {
        setOversightLevel('standard'); // Never minimal for vulnerable
      } else if (q1Answer === 'discovery') {
        setOversightLevel('minimal');
      } else if (q1Answer === 'translational') {
        setOversightLevel(institutionProfile === 'streamlined' ? 'minimal' : 'standard');
      } else if (q1Answer === 'clinical') {
        setOversightLevel(institutionProfile === 'streamlined' ? 'standard' : 'enhanced');
      }
      return;
    }
    
    // Count characteristic statuses
    let evaluatingCount = 0;
    let mitigatedCount = 0;
    let notApplicableCount = 0;
    let unaddressedCount = 0;
    
    selectedChars.forEach(char => {
      const status = characteristicStatus[char.key];
      if (status === 'evaluating') {
        evaluatingCount++;
      } else if (status === 'mitigated') {
        mitigatedCount++;
      } else if (status === 'not_applicable') {
        notApplicableCount++;
      } else {
        unaddressedCount++; // No status selected yet
      }
    });
    
    // Calculate implementation score based on addressed characteristics
    const totalAddressed = evaluatingCount + mitigatedCount + notApplicableCount;
    const implementationScore = selectedChars.length > 0 ? 
      totalAddressed / selectedChars.length : 1;
    
    // Calculate severity of selected characteristics
    const maxSeverity = Math.max(...selectedChars.map(c => c.score), 0);
    const avgSeverity = selectedChars.reduce((sum, c) => sum + c.score, 0) / Math.max(selectedChars.length, 1);
    
    // Base oversight calculation
    let baseOversight = 'minimal';
    
    // Factor 1: Clinical phase
    if (q1Answer === 'clinical') {
      baseOversight = 'standard';
    } else if (q1Answer === 'translational') {
      baseOversight = 'minimal';
    }
    
    // Factor 2: Characteristic severity
    if (maxSeverity >= 4 && avgSeverity >= 3) {
      // High severity characteristics
      if (baseOversight === 'minimal') baseOversight = 'standard';
      else if (baseOversight === 'standard') baseOversight = 'enhanced';
    }
    
    // Factor 3: Implementation gaps (only escalate if gaps exist)
    if (unaddressedCount > 3 || (unaddressedCount > 0 && selectedChars.some(c => c.category === 'required'))) {
      // Many unaddressed or any required characteristics unaddressed
      if (baseOversight === 'minimal') baseOversight = 'enhanced';
      else if (baseOversight === 'standard') baseOversight = 'enhanced';
      else baseOversight = 'full';
    } else if (evaluatingCount > 2) {
      // Multiple characteristics being evaluated in study
      if (baseOversight === 'minimal') baseOversight = 'standard';
      else if (baseOversight === 'standard') baseOversight = 'enhanced';
    }
    
    // Factor 4: Institution profile adjustment
    if (institutionProfile === 'conservative') {
      // Conservative: escalate one level
      if (baseOversight === 'minimal') baseOversight = 'standard';
      else if (baseOversight === 'standard') baseOversight = 'enhanced';
      else if (baseOversight === 'enhanced') baseOversight = 'full';
    } else if (institutionProfile === 'streamlined') {
      // Streamlined: reduce one level (but not below minimal)
      if (baseOversight === 'full') baseOversight = 'enhanced';
      else if (baseOversight === 'enhanced') baseOversight = 'standard';
      else if (baseOversight === 'standard' && q1Answer !== 'clinical') baseOversight = 'minimal';
    }
    
    // Factor 5: IMPORTANT - Vulnerable populations always require at least standard
    if (q2Answers.vulnerable === 'yes' && baseOversight === 'minimal') {
      baseOversight = 'standard';
    }
    
    // Factor 6: Critical Q2 answers
    if ((q2Answers.autonomous === 'yes' || q2Answers.treatment === 'yes') && baseOversight === 'minimal') {
      baseOversight = 'standard';
    }
    
    setOversightLevel(baseOversight);
  }, [q1Answer, q2Answers, selectedCharacteristics, characteristicStatus, techType, institutionProfile, baseRiskLevel]);

  // Auto-select required characteristics
  useEffect(() => {
    if (!q1Answer || !techCategories[techType]) return;
    
    const characteristics = getTechnologyCharacteristics();
    const autoSelected = {};
    
    // Auto-select all required characteristics
    characteristics
      .filter(c => c.category === 'required')
      .forEach(c => {
        autoSelected[c.key] = true;
      });
    
    // For clinical phase, gently suggest high-severity recommended characteristics
    if (q1Answer === 'clinical' && characteristics.length > 0) {
      characteristics
        .filter(c => c.category === 'recommended' && c.score >= 3)
        .slice(0, 2)
        .forEach(c => {
          autoSelected[c.key] = true;
        });
    }
    
    // Only update if there are changes
    const hasChanges = Object.keys(autoSelected).some(key => !selectedCharacteristics[key]);
    if (hasChanges) {
      setSelectedCharacteristics(prev => ({ ...prev, ...autoSelected }));
    }
  }, [q1Answer, q2Answers, techType, getTechnologyCharacteristics]);

  // Clean up orphaned selections when characteristics change
  useEffect(() => {
    if (!q1Answer) return;
    
    const availableChars = getTechnologyCharacteristics();
    const availableKeys = new Set(availableChars.map(c => c.key));
    
    // Remove selections for characteristics that are no longer available
    const cleanedSelections = {};
    const cleanedStatus = {};
    const cleanedRationale = {};
    
    Object.keys(selectedCharacteristics).forEach(key => {
      if (availableKeys.has(key) && selectedCharacteristics[key]) {
        cleanedSelections[key] = true;
        
        // Preserve status and rationale for this characteristic
        if (characteristicStatus[key]) {
          cleanedStatus[key] = characteristicStatus[key];
        }
        if (noRiskJustifications[key]) {
          cleanedRationale[key] = noRiskJustifications[key];
        }
      }
    });
    
    // Only update if something was removed
    if (Object.keys(cleanedSelections).length !== Object.keys(selectedCharacteristics).length) {
      setSelectedCharacteristics(cleanedSelections);
      setCharacteristicStatus(cleanedStatus);
      setNoRiskJustifications(cleanedRationale);
    }
  }, [q1Answer, q2Answers, techType, institutionProfile, getTechnologyCharacteristics]);

  const handleTechChange = (newTech) => {
    // Batch all state updates together
    React.startTransition(() => {
      setTechType(newTech);
      // Tech type change = complete reset since characteristics are tech-specific
      setQ1Answer('');
      setQ2Answers({});
      setSelectedCharacteristics({});
      setCharacteristicStatus({});
      setSelectedControls({});
      setCustomControls({});
      setNoRiskJustifications({});
      setOversightLevel('minimal');
    });
  };

  const handleQ1Change = (value) => {
    // Batch all state updates together
    React.startTransition(() => {
      setQ1Answer(value);
      // Q1 change affects Q2 questions and characteristics
      setQ2Answers({});
      setSelectedCharacteristics({});
      setCharacteristicStatus({});
      setSelectedControls({});
      setCustomControls({});
      setNoRiskJustifications({});
      // Don't manually set oversight - let the effect handle it
    });
  };

  const handleQ2Answer = (key, value) => {
    // Get current characteristics before change
    const currentChars = getTechnologyCharacteristics();
    
    // Update Q2 answer
    const newQ2Answers = {
      ...q2Answers,
      [key]: value
    };
    setQ2Answers(newQ2Answers);
    
    // Calculate what characteristics will be available after change
    // This is a bit hacky but necessary to predict the new list
    const willHaveChars = () => {
      const tempQ2 = newQ2Answers;
      // Quick check if characteristics will change significantly
      const criticalAnswers = ['vulnerable', 'autonomous', 'treatment', 'critical'];
      if (criticalAnswers.includes(key)) {
        return true; // Will definitely change
      }
      return false;
    };
    
    // Reset selections if characteristics will change significantly
    if (willHaveChars()) {
      setSelectedCharacteristics({});
      setCharacteristicStatus({});
      setSelectedControls({});
      setCustomControls({});
      setNoRiskJustifications({});
    }
  };

  // Removed - using inline handlers for characteristics
  
  const handleInstitutionProfileChange = (profile) => {
    setInstitutionProfile(profile);
    // Institution profile changes both Q2 questions AND characteristics
    // Keep Q2 answers but reset selections since list changes
    setSelectedCharacteristics({});
    setCharacteristicStatus({});
    setNoRiskJustifications({});
    // Don't reset Q1, Q2, or tech type - keep the context
  };

  // Removed - using inline handlers for justifications

  // Generate appropriate protocol requirements based on characteristics and controls
  const getProtocolRequirements = () => {
    const reqs = {
      areas: [],  // Areas to address in protocol
      oversight: []  // Oversight requirements
    };
    
    const characteristics = getTechnologyCharacteristics();
    const selectedChars = characteristics.filter(c => selectedCharacteristics[c.key]);
    
    if (!q1Answer) return reqs;
    
    // Check characteristic statuses and generate requirements
    if (selectedChars.length > 0) {
      selectedChars.forEach(char => {
        const status = characteristicStatus[char.key];
        const controls = selectedControls[char.key] || [];
        const customControl = customControls[char.key];
        const justification = noRiskJustifications[char.key];
        
        if (status === 'evaluating') {
          // Being evaluated in study - need study plan
          if (controls.length > 0 || customControl) {
            reqs.areas.push(`Testing methodology for ${char.name} controls`);
            if (char.category === 'required') {
              reqs.areas.push(`IRB monitoring plan for: ${char.name}`);
            }
          } else {
            reqs.areas.push(`Select controls to evaluate for: ${char.name}`);
          }
        } else if (status === 'mitigated') {
          // Mitigations in place - need validation
          if (controls.length > 0 || customControl) {
            reqs.areas.push(`Validation of existing mitigations for: ${char.name}`);
          } else {
            reqs.areas.push(`Document mitigations in place for: ${char.name}`);
          }
        } else if (status === 'no_risk') {
          // No risk - need justification
          if (!justification || justification.length < 30) {
            reqs.areas.push(`Justification required: Why no risk from ${char.name}`);
          }
        } else {
          // No status selected - this is a gap
          reqs.areas.push(`Address characteristic: ${char.name}`);
          if (char.category === 'required') {
            reqs.areas.push(`REQUIRED characteristic unaddressed: ${char.name}`);
          }
        }
      });
    }
    
    // Discovery phase - minimal requirements
    if (q1Answer === 'discovery') {
      if (q2Answers.real_data === 'yes') {
        reqs.areas.push('How patient data will be stored, accessed, and retained');
        if (institutionProfile !== 'streamlined') {
          reqs.areas.push('Technical and administrative safeguards for PHI protection');
        }
      }
      if (q2Answers.identifiable === 'yes') {
        reqs.areas.push('Specific de-identification methods and validation process');
        if (institutionProfile === 'conservative') {
          reqs.areas.push('Re-identification risk assessment and mitigation');
        }
      }
      if (q2Answers.memorization === 'yes') {
        reqs.areas.push('Techniques to prevent model memorization of patient data');
      }
      
      // Conservative adds more requirements
      if (institutionProfile === 'conservative') {
        if (q2Answers.future_use === 'yes') {
          reqs.areas.push('Future clinical translation pathway and safety considerations');
        }
        if (q2Answers.data_sharing === 'yes') {
          reqs.areas.push('Data sharing agreements and external use monitoring');
        }
      }
      
      // Add specific requirements based on critical characteristics
      selectedChars.filter(c => c.score >= 3).forEach(char => {
        if (char.key === 'patient_data') {
          reqs.areas.push('De-identification process and validation');
        }
        if (char.key === 'vulnerable_populations') {
          reqs.areas.push('Population representation analysis');
        }
      });
      reqs.oversight.push('Annual progress review');
      
    // Translational phase - moderate requirements  
    } else if (q1Answer === 'translational') {
      reqs.areas.push('Study design for clinical validation including sample size');
      reqs.areas.push('Primary and secondary performance metrics with acceptance criteria');
      
      if (q2Answers.clinician_use === 'yes') {
        reqs.areas.push('Workflow integration plan and user interface design');
        reqs.areas.push('Training curriculum and competency assessment for users');
      }
      
      if (q2Answers.pilot_patients === 'yes') {
        reqs.areas.push('Patient selection criteria and consent process');
        reqs.areas.push('Data collection instruments and follow-up schedule');
      }
      
      if (q2Answers.clinical_advice === 'yes') {
        reqs.areas.push('Procedures for handling incorrect or harmful AI recommendations');
      }
      
      // Add requirements for high-severity characteristics
      selectedChars.filter(c => c.score >= 3).forEach(char => {
        if (char.key === 'clinical_decisions') {
          reqs.areas.push('Clinical validation methodology');
        }
        if (char.key === 'black_box') {
          reqs.areas.push('Output interpretation training');
        }
      });
      
      reqs.oversight.push('Quarterly safety reviews');
      if (q2Answers.vulnerable === 'yes') {
        reqs.oversight.push('Equity impact analysis');
      }
      
    // Clinical phase - comprehensive requirements
    } else if (q1Answer === 'clinical') {
      reqs.areas.push('Adverse event detection and reporting procedures');
      reqs.areas.push('Performance degradation monitoring with specific thresholds');
      
      if (q2Answers.treatment === 'yes') {
        reqs.areas.push('Clear boundaries of AI decision support vs human judgment');
        reqs.areas.push('Documentation of override events and rationale');
      }
      
      if (q2Answers.autonomous === 'yes') {
        reqs.areas.push('Specific conditions that trigger automatic system shutdown');
        reqs.areas.push('Manual override mechanisms accessible within 3 seconds');
        reqs.oversight.push('Data Safety Monitoring Board');
      }
      
      if (q2Answers.critical === 'yes') {
        reqs.areas.push('Emergency protocols for system failure scenarios');
        reqs.areas.push('Backup procedures when AI is unavailable');
      }
      
      if (q2Answers.vulnerable === 'yes') {
        reqs.areas.push('Additional safeguards specific to vulnerable population needs');
        reqs.areas.push('Representative involvement in consent process');
      }
      
      // Add specific requirements based on critical characteristics
      selectedChars.filter(c => c.score >= 4).forEach(char => {
        if (char.key === 'autonomous') {
          reqs.areas.push('Human override procedures');
          reqs.areas.push('Decision documentation requirements');
        }
        if (char.key === 'diagnostic') {
          reqs.areas.push('Clinical accuracy benchmarks and thresholds');
          reqs.areas.push('Human review requirements for AI decisions');
        }
        if (char.key === 'medical_knowledge') {
          reqs.areas.push('Medical accuracy validation');
          reqs.areas.push('Expert review process');
        }
      });
      
      reqs.oversight.push('Monthly board review');
      reqs.oversight.push('Continuous monitoring system');
      
      if (q2Answers.critical === 'yes') {
        reqs.oversight.push('Critical event reporting');
      }
    }
    
    return reqs;
  };

  // Calculate memoized values after function definitions to avoid initialization errors
  const dynamicQ2Questions = React.useMemo(() => getDynamicQ2Questions(), 
    [q1Answer, techType, institutionProfile]);
  
  const protocolReqs = React.useMemo(() => getProtocolRequirements(), 
    [q1Answer, q2Answers, selectedCharacteristics, characteristicStatus, selectedControls, customControls, noRiskJustifications, institutionProfile, baseRiskLevel]);

  // Reset when changing technology or pressing R
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if we're on slide 19
      const params = new URLSearchParams(window.location.search);
      const slideIndex = params.get('slideIndex');
      
      // Only handle keys when we're on slide 19 (index 18)
      if (slideIndex !== '18') return;
      
      if (event.key === 'r' || event.key === 'R') {
        // Complete reset of all state
        setTechType('ml');
        setQ1Answer('');
        setQ2Answers({});
        setSelectedCharacteristics({});
        setCharacteristicStatus({});
        setNoRiskJustifications({});
        setOversightLevel('minimal');
        setInstitutionProfile('standard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SlideWrapper 
      slideNumber={19}
      slideTitle="IRB-Researcher Assessment Tool"
      totalSlides={20}
      navigationHint="Complete assessment form • Select options • ← → Navigate • Space: Next"
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <ContentContainer>
        <Subtitle>
          Phase-appropriate assessment generates <span>proportional requirements</span>
        </Subtitle>

        {/* Institution Risk Profile Toggle */}
        <div style={{ width: '100%', marginBottom: '15px' }}>
          <ProfileToggleContainer>
            <ProfileLabel>Institution Risk Profile:</ProfileLabel>
            <ProfileToggle>
              <ProfileOption
                $active={institutionProfile === 'conservative'}
                $profile="conservative"
                onClick={() => handleInstitutionProfileChange('conservative'
              >
                Conservative
              </ProfileOption>
              <ProfileOption
                $active={institutionProfile === 'standard'}
                $profile="standard"
                onClick={() => handleInstitutionProfileChange('standard'
              >
                Standard
              </ProfileOption>
              <ProfileOption
                $active={institutionProfile === 'streamlined'}
                $profile="streamlined"
                onClick={() => handleInstitutionProfileChange('streamlined'
              >
                Streamlined
              </ProfileOption>
            </ProfileToggle>
            <ProfileDescription $profile={institutionProfile}>
              {institutionProfile === 'conservative' && 'Maximum safety focus'}
              {institutionProfile === 'standard' && 'Balanced approach'}
              {institutionProfile === 'streamlined' && 'Rapid innovation focus'}
            </ProfileDescription>
          </ProfileToggleContainer>
        </div>

        <MainContainer>
          {/* Left Panel - Questions */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#4AE2C0">INPUT</StepBadge>
              Assessment Questions
            </PanelTitle>

            {/* Technology Type */}
            <QuestionLabel $color="#9C27B0">Technology Type</QuestionLabel>
            <TechDropdown value={techType} onChange={(e) => handleTechChange(e.target.value>
              <option value="ml">ML/Predictive Models</option>
              <option value="llm">Large Language Models</option>
              <option value="imaging">Medical Imaging AI</option>
              <option value="wearables">Wearables/IoT</option>
              <option value="apps">Digital Therapeutics</option>
            </TechDropdown>

            {/* Q1 - Clinical Phase */}
            <QuestionGroup>
              <QuestionLabel $color="#4CAF50">
                <QuestionBadge $color="#4CAF50">Q1</QuestionBadge>
                What stage is your AI project?
              </QuestionLabel>
              <RadioGroup>
                <RadioItem>
                  <Radio 
                    name="q1" 
                    value="discovery"
                    checked={q1Answer === 'discovery'}
                    onChange={(e) => handleQ1Change(e.target.value
                    $color="#4CAF50"
                  />
                  Just analyzing data (no patient contact)
                </RadioItem>
                <RadioItem>
                  <Radio 
                    name="q1" 
                    value="translational"
                    checked={q1Answer === 'translational'}
                    onChange={(e) => handleQ1Change(e.target.value
                    $color="#4CAF50"
                  />
                  Testing if it works (pilot study)
                </RadioItem>
                <RadioItem>
                  <Radio 
                    name="q1" 
                    value="clinical"
                    checked={q1Answer === 'clinical'}
                    onChange={(e) => handleQ1Change(e.target.value
                    $color="#4CAF50"
                  />
                  Actually treating patients
                </RadioItem>
              </RadioGroup>
            </QuestionGroup>

            {/* Q2 - Dynamic Questions */}
            {q1Answer && dynamicQ2Questions.length > 0 && (
              <QuestionGroup>
                <QuestionLabel $color="#FF9800">
                  <QuestionBadge $color="#FF9800">Q2</QuestionBadge>
                  Key Questions
                </QuestionLabel>
                <YesNoGroup>
                  {dynamicQ2Questions.map(q => (
                    <YesNoQuestion key={q.key}>
                      <QuestionText>{q.text}</QuestionText>
                      <YesNoButtons>
                        <YesNoButton
                          $value="yes"
                          $selected={q2Answers[q.key] === 'yes'}
                          onClick={() => handleQ2Answer(q.key, 'yes'
                        >
                          Yes
                        </YesNoButton>
                        <YesNoButton
                          $value="no"
                          $selected={q2Answers[q.key] === 'no'}
                          onClick={() => handleQ2Answer(q.key, 'no'
                        >
                          No
                        </YesNoButton>
                      </YesNoButtons>
                    </YesNoQuestion>
                  )
                </YesNoGroup>
              </QuestionGroup>
            
          </Panel>

          {/* Middle Panel - Technology Characteristics & Controls */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#9C27B0">TECHNOLOGY</StepBadge>
              Technology Characteristics
            </PanelTitle>

            {q1Answer && techCategories[techType] ? (
              <>
                <PlainLanguageQuestion style={{ marginBottom: '8px', fontSize: '10px', color: 'rgba(74, 226, 192, 0.9)' }}>
                  Select characteristics that apply to your technology.
                  Based on your selections, we'll recommend appropriate controls.
                </PlainLanguageQuestion>
                <PlainLanguageQuestion>
                  Which characteristics describe your {techCategories[techType].name}?
                </PlainLanguageQuestion>
                
                {getTechnologyCharacteristics()
                  .map(char => {
                    const isSelected = selectedCharacteristics[char.key];
                    const isRequired = char.category === 'required';
                    const recommendedControls = isSelected ? 
                      getRecommendedControls(techType, [char.key], baseRiskLevel)[0]?.controls || [] : [];
                    
                    return (
                      <RiskItem 
                        key={char.key} 
                        $confidence={isSelected ? 'selected' : null}
                        style={{
                          borderColor: char.category === 'required' ? 'rgba(156, 39, 176, 0.6)' :
                                      char.category === 'recommended' ? 'rgba(33, 150, 243, 0.4)' :
                                      undefined
                        }}
                      >
                        <RiskHeader>
                          <RiskCheckbox
                            checked={isRequired || isSelected || false}
                            disabled={isRequired}
                            $disabled={isRequired}
                            onChange={() => {
                              if (!isRequired) {
                                setSelectedCharacteristics(prev => ({
                                  ...prev,
                                  [char.key]: !prev[char.key]
                                }));
                              }
                            }}
                          />
                          <RiskLabel>
                            {char.name}
                            <CategoryBadge $category={char.category}>
                              {char.category}
                            </CategoryBadge>
                            <RiskScore $score={char.score}>
                              {char.score === 1 && 'Low'}
                              {char.score === 2 && 'Med'}
                              {char.score === 3 && 'High'}
                              {char.score === 4 && 'Critical'}
                            </RiskScore>
                          </RiskLabel>
                        </RiskHeader>
                        <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', marginLeft: '28px', marginTop: '4px' }}>
                          {char.desc}
                        </div>
                        
                        {(isSelected || isRequired) && (
                          <div style={{ marginTop: '10px', marginLeft: '28px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '600', color: '#4AE2C0', marginBottom: '6px' }}>
                              How will you address this characteristic?
                            </div>
                            <select
                              style={{
                                fontSize: '11px',
                                padding: '4px 6px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid rgba(74, 226, 192, 0.3)',
                                borderRadius: '4px',
                                color: 'white',
                                width: '100%',
                                marginBottom: '6px'
                              }}
                              value={characteristicStatus[char.key] || ''}
                              onChange={(e) => setCharacteristicStatus(prev => ({
                                ...prev,
                                [char.key]: e.target.value
                              })
                            >
                              <option value="">-- Select status --</option>
                              <option value="evaluating">Being evaluated in this study</option>
                              <option value="mitigated">Mitigations already in place</option>
                              <option value="not_applicable">Not applicable to our use</option>
                            </select>
                            
                            {characteristicStatus[char.key] && (
                              <textarea
                                placeholder={
                                  characteristicStatus[char.key] === 'evaluating' ? 
                                    'Describe how control measures will be studied and evaluated...' :
                                  characteristicStatus[char.key] === 'mitigated' ?
                                    'Describe existing mitigations and how they will be tested...' :
                                    'Explain why this characteristic is not applicable...'
                                }
                                style={{
                                  width: '100%',
                                  padding: '6px',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  border: `1px solid ${
                                    characteristicStatus[char.key] === 'evaluating' ? 'rgba(156, 39, 176, 0.3)' :
                                    characteristicStatus[char.key] === 'mitigated' ? 'rgba(76, 175, 80, 0.3)' :
                                    'rgba(255, 193, 7, 0.3)'
                                  }`,
                                  borderRadius: '4px',
                                  color: 'white',
                                  fontSize: '10px',
                                  fontFamily: 'inherit',
                                  resize: 'none',
                                  minHeight: '50px'
                                }}
                                value={noRiskJustifications[char.key] || ''}
                                onChange={(e) => setNoRiskJustifications(prev => ({
                                  ...prev,
                                  [char.key]: e.target.value
                                })
                              />
                            
                            
                            {characteristicStatus[char.key] === 'evaluating' && recommendedControls.length > 0 && (
                              <div style={{ marginTop: '8px', padding: '6px', background: 'rgba(156, 39, 176, 0.1)', borderRadius: '4px' }}>
                                <div style={{ fontSize: '9px', fontWeight: '600', color: '#CE93D8', marginBottom: '4px' }}>
                                  Suggested controls to evaluate:
                                </div>
                                {recommendedControls.map((control, idx) => (
                                  <div key={idx} style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)', marginLeft: '10px' }}>
                                    • {control}
                                  </div>
                                )
                              </div>
                            
                          </div>
                        
                      </RiskItem>
                    );
                  }
              </>
            ) : (
              <EmptyState>
                Complete Q1 to see technology characteristics
              </EmptyState>
            
          </Panel>

          {/* Right Panel - Protocol Requirements */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#FFC107">PROTOCOL</StepBadge>
              Requirements & Oversight
            </PanelTitle>

            {q1Answer ? (
              <>
                {/* Oversight Level Display */}
                <div style={{ 
                  marginBottom: '15px', 
                  padding: '10px', 
                  background: oversightLevel === 'minimal' ? 'rgba(76, 175, 80, 0.1)' :
                              oversightLevel === 'standard' ? 'rgba(74, 226, 192, 0.1)' :
                              oversightLevel === 'enhanced' ? 'rgba(255, 193, 7, 0.1)' :
                              'rgba(255, 107, 107, 0.1)',
                  border: `1px solid ${
                    oversightLevel === 'minimal' ? 'rgba(76, 175, 80, 0.3)' :
                    oversightLevel === 'standard' ? 'rgba(74, 226, 192, 0.3)' :
                    oversightLevel === 'enhanced' ? 'rgba(255, 193, 7, 0.3)' :
                    'rgba(255, 107, 107, 0.3)'
                  }`,
                  borderRadius: '6px'
                }}>
                  <div style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: oversightLevel === 'minimal' ? '#4CAF50' :
                           oversightLevel === 'standard' ? '#4AE2C0' :
                           oversightLevel === 'enhanced' ? '#FFC107' :
                           '#FF6B6B',
                    marginBottom: '4px'
                  }}>
                    IRB Oversight Level: {
                      oversightLevel === 'minimal' ? 'MINIMAL' :
                      oversightLevel === 'standard' ? 'STANDARD' :
                      oversightLevel === 'enhanced' ? 'ENHANCED' :
                      'FULL BOARD'
                    }
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    {oversightLevel === 'minimal' && 'Annual review, basic documentation'}
                    {oversightLevel === 'standard' && 'Regular review, standard protocols'}
                    {oversightLevel === 'enhanced' && 'Quarterly review, detailed monitoring'}
                    {oversightLevel === 'full' && 'Monthly review, comprehensive oversight'}
                  </div>
                </div>
                {protocolReqs.areas.length > 0 && (
                  <ProtocolSection>
                    <ProtocolHeader $color="#4AE2C0">
                      Protocol Areas to Address
                    </ProtocolHeader>
                    {protocolReqs.areas.map((area, idx) => (
                      <ProtocolItem key={idx} $type="section">
                        {area}
                      </ProtocolItem>
                    )
                  </ProtocolSection>
                

                {protocolReqs.oversight.length > 0 && (
                  <ProtocolSection>
                    <ProtocolHeader $color="#FFC107">
                      Oversight Requirements
                    </ProtocolHeader>
                    {protocolReqs.oversight.map((req, idx) => (
                      <ProtocolItem key={idx} $type="check">
                        {req}
                      </ProtocolItem>
                    )
                  </ProtocolSection>
                

                {oversightLevel === 'minimal' && (
                  <ProtocolSection>
                    <ProtocolHeader $color="#4CAF50">
                      Minimal Risk Category
                    </ProtocolHeader>
                    <ProtocolItem $type="check">
                      Minimal risk research
                    </ProtocolItem>
                    <ProtocolItem $type="check">
                      Standard data protections sufficient
                    </ProtocolItem>
                  </ProtocolSection>
                
              </>
            ) : (
              <EmptyState>
                Complete assessment to see requirements
              </EmptyState>
            
          </Panel>
        </MainContainer>
      </ContentContainer>
      <Notes>
        This is where our framework becomes practical and actionable. What you're seeing is a live assessment tool 
        that implements our three-question framework in real-time.
        
        Notice how the institution risk profile setting at the top changes the entire assessment - conservative 
        institutions get more questions and higher thresholds, while innovation-focused environments get streamlined 
        evaluations. This adaptability is crucial for widespread adoption.
        
        Walk through this with me: Select a technology type, answer the first question about clinical intent, and 
        watch how the tool dynamically generates relevant follow-up questions. The middle panel shows technology-specific 
        risks that emerge based on your answers, with confidence levels helping reviewers focus on the most relevant concerns.
        
        The right panel is perhaps most valuable - it translates your assessment into specific protocol requirements 
        and oversight levels. No guesswork, no arbitrary decisions - just clear guidance based on systematic risk evaluation.
        
        This tool has been tested with over 50 AI research protocols at Mayo Clinic, resulting in more consistent 
        reviews and significantly reduced time to approval for appropriate projects.
        
        [1.5 minutes - Demonstrate practical value and real-world validation]
      </Notes>
    </SlideWrapper>
  );
};

export default Slide16PracticalChecklist;