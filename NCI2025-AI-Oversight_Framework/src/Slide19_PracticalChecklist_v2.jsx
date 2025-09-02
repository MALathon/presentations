import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';
import { techCategories, getRecommendedControls } from './techCharacteristics';

// Updated to use technology characteristics with quantitative scoring system

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
  min-width: 0;
`;

const Panel = styled.div`
  flex: 1 1 33.333%;
  min-width: 0;
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
  color: ${props => props.$color || 'rgba(255, 255, 255, 0.9)'};
  margin-bottom: 6px;
`;

const Select = styled.select`
  width: 100%;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 11px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4AE2C0;
  }
  
  option {
    background: #1a1a1a;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  
  input[type="radio"] {
    cursor: pointer;
  }
`;

const YesNoQuestion = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
`;

const YesNoText = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
`;

const YesNoButtons = styled.div`
  display: flex;
  gap: 4px;
`;

const YesNoButton = styled.button`
  padding: 3px 10px;
  font-size: 10px;
  border: 1px solid ${props => props.$active ? props.$yes ? '#4AE2C0' : '#FF6B6B' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.$active ? props.$yes ? 'rgba(74, 226, 192, 0.2)' : 'rgba(255, 107, 107, 0.2)' : 'transparent'};
  color: ${props => props.$active ? props.$yes ? '#4AE2C0' : '#FF6B6B' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => !props.$active && 'rgba(255, 255, 255, 0.05)'};
  }
`;

// Characteristic selection styles with badges outside
const CharacteristicWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
`;

const CategoryBadge = styled.div`
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 700;
  border-radius: 3px;
  text-transform: uppercase;
  white-space: nowrap;
  margin-top: 8px;
  background: ${props => 
    props.$category === 'required' ? 'rgba(255, 107, 107, 0.2)' :
    props.$category === 'suggested' ? 'rgba(74, 226, 192, 0.2)' :
    'rgba(255, 255, 255, 0.1)'};
  color: ${props => 
    props.$category === 'required' ? '#FF6B6B' :
    props.$category === 'suggested' ? '#4AE2C0' :
    'rgba(255, 255, 255, 0.5)'};
  border: 1px solid ${props => 
    props.$category === 'required' ? 'rgba(255, 107, 107, 0.3)' :
    props.$category === 'suggested' ? 'rgba(74, 226, 192, 0.3)' :
    'rgba(255, 255, 255, 0.15)'};
`;

const CharacteristicItem = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  padding: 10px;
  
  ${props => props.$selected && `
    background: rgba(74, 226, 192, 0.1);
    border-color: rgba(74, 226, 192, 0.3);
  `}
`;

const CharacteristicHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const CharacteristicCheckbox = styled.input`
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const CharacteristicLabel = styled.label`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$disabled ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  flex: 1;
`;

const CharacteristicDescription = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 22px;
  line-height: 1.3;
`;

const ScoreIndicator = styled.div`
  font-size: 9px;
  color: rgba(74, 226, 192, 0.8);
  margin-left: 22px;
  margin-top: 4px;
  font-style: italic;
`;

// Control status styles
const ControlStatusDropdown = styled.select`
  width: 100%;
  padding: 4px 8px;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-size: 10px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4AE2C0;
  }
  
  option {
    background: #1a1a1a;
  }
`;

// Protocol requirements styles
const RequirementGroup = styled.div`
  margin-bottom: 15px;
`;

const RequirementHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const RequirementTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: white;
`;

const RequirementCount = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(74, 226, 192, 0.2);
  color: #4AE2C0;
  border-radius: 3px;
`;

const RequirementList = styled.div`
  margin-top: 8px;
  padding-left: 12px;
  display: ${props => props.$collapsed ? 'none' : 'block'};
`;

const RequirementItem = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
  padding-left: 12px;
  position: relative;
  
  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: rgba(74, 226, 192, 0.5);
  }
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

const Slide19PracticalChecklist = () => {
  const [techType, setTechType] = useState('ml');
  const [q1Answer, setQ1Answer] = useState('');
  const [q2Answers, setQ2Answers] = useState({});
  const [selectedCharacteristics, setSelectedCharacteristics] = useState({});
  const [characteristicStatus, setCharacteristicStatus] = useState({});
  const [selectedControls, setSelectedControls] = useState({});
  const [customControls, setCustomControls] = useState({});
  const [noRiskJustifications, setNoRiskJustifications] = useState({});
  const [oversightLevel, setOversightLevel] = useState('minimal');
  const [institutionProfile, setInstitutionProfile] = useState('standard');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // QUANTITATIVE SCORING SYSTEM
  const getTechnologyCharacteristics = useMemo(() => () => {
    if (!techCategories[techType] || !q1Answer) return [];
    
    const allCharacteristics = [...techCategories[techType].characteristics];
    const characteristicScores = new Map();
    
    // Initialize all characteristics
    allCharacteristics.forEach(char => {
      characteristicScores.set(char.key, {
        baseScore: 0,
        phaseScore: 0,
        q2Score: 0,
        profileScore: 0,
        totalScore: 0,
        reasons: []
      });
    });
    
    // SCORING TABLES
    const phaseScoring = {
      discovery: {
        'patient_data': 8,
        'training_data': 7,
        'black_box': 6,
        'multi_site': 5,
        'context_window': 5
      },
      translational: {
        'clinical_decisions': 9,
        'black_box': 7,
        'hallucination': 8,
        'diagnostic': 7,
        'autonomous': 6
      },
      clinical: {
        'clinical_decisions': 10,
        'autonomous': 9,
        'diagnostic': 9,
        'medical_knowledge': 8,
        'vulnerable_populations': 10
      }
    };
    
    const q2ImpactMatrix = {
      'vulnerable': { 
        'yes': { 'vulnerable_populations': 20, 'pediatric': 12, 'equity': 10 }
      },
      'autonomous': { 
        'yes': { 'autonomous': 20, 'clinical_decisions': 10 }
      },
      'real_data': { 
        'yes': { 'patient_data': 15, 'training_data': 10, 'context_window': 8 }
      },
      'identifiable': { 
        'yes': { 'patient_data': 12, 'black_box': 10 }
      },
      'treatment': { 
        'yes': { 'clinical_decisions': 15, 'diagnostic': 12, 'medical_knowledge': 12 }
      },
      'critical': { 
        'yes': { 'emergency_detection': 15, 'real_time': 12, 'vital_signs': 10 }
      },
      'patient_facing': { 
        'yes': { 'conversational': 15, 'prompt_injection': 12, 'hallucination': 10 }
      },
      'clinician_use': { 
        'yes': { 'clinical_decisions': 15, 'hallucination': 10, 'black_box': 8 }
      }
    };
    
    const techBaseScores = {
      ml: {
        'training_data': 5,
        'black_box': 4,
        'continuous_learning': 3,
        'rare_events': 3
      },
      llm: {
        'hallucination': 5,
        'prompt_injection': 4,
        'context_window': 4,
        'conversational': 3,
        'medical_knowledge': 4
      },
      imaging: {
        'diagnostic': 5,
        'real_time': 3,
        'black_box': 4
      },
      wearables: {
        'vital_signs': 5,
        'emergency_detection': 4,
        'continuous_monitoring': 4
      },
      apps: {
        'pediatric': 3,
        'conversational': 4,
        'vulnerable_populations': 3
      }
    };
    
    // Apply phase scores
    Object.entries(phaseScoring[q1Answer] || {}).forEach(([key, score]) => {
      if (characteristicScores.has(key)) {
        const scoreData = characteristicScores.get(key);
        scoreData.phaseScore = score;
        scoreData.reasons.push(`${q1Answer} phase: +${score}`);
      }
    });
    
    // Apply Q2 scores
    Object.entries(q2Answers).forEach(([question, answer]) => {
      const impacts = q2ImpactMatrix[question]?.[answer];
      if (impacts) {
        Object.entries(impacts).forEach(([charKey, points]) => {
          if (characteristicScores.has(charKey)) {
            const scoreData = characteristicScores.get(charKey);
            scoreData.q2Score += points;
            scoreData.reasons.push(`${question}: +${points}`);
          }
        });
      }
    });
    
    // Apply technology base scores
    Object.entries(techBaseScores[techType] || {}).forEach(([key, score]) => {
      if (characteristicScores.has(key)) {
        const scoreData = characteristicScores.get(key);
        scoreData.baseScore = score;
        scoreData.reasons.push(`${techType} base: +${score}`);
      }
    });
    
    // Apply profile modifiers
    const profileModifiers = {
      conservative: 1.2,
      standard: 1.0,
      streamlined: 0.8
    };
    
    const profileMod = profileModifiers[institutionProfile];
    
    // Calculate final scores and categorize
    const scoredCharacteristics = [];
    
    allCharacteristics.forEach(char => {
      const scoreData = characteristicScores.get(char.key);
      if (!scoreData) return;
      
      // Calculate raw total
      const rawTotal = scoreData.baseScore + scoreData.phaseScore + scoreData.q2Score;
      
      // Apply profile modifier
      scoreData.totalScore = Math.round(rawTotal * profileMod);
      
      // Only include if score > 0
      if (scoreData.totalScore > 0) {
        let category;
        if (scoreData.totalScore >= 25) {
          category = 'required';
        } else if (scoreData.totalScore >= 15) {
          category = 'suggested';
        } else {
          category = 'optional';
        }
        
        // Special overrides
        if (char.key === 'vulnerable_populations' && q2Answers.vulnerable === 'yes') {
          category = 'required';
        }
        if (char.key === 'autonomous' && q2Answers.autonomous === 'yes') {
          category = 'required';
        }
        
        scoredCharacteristics.push({
          ...char,
          category,
          totalScore: scoreData.totalScore,
          scoreBreakdown: scoreData.reasons.join(', '),
          controls: getRecommendedControls(char.key, techType) || []
        });
      }
    });
    
    // Apply profile-based filtering
    let filtered = scoredCharacteristics;
    
    if (institutionProfile === 'streamlined') {
      filtered = scoredCharacteristics.filter(c => 
        c.totalScore >= 10 || c.category === 'required'
      ).slice(0, 8);
    } else if (institutionProfile === 'standard') {
      filtered = scoredCharacteristics.filter(c => 
        c.totalScore >= 5
      );
    }
    
    // Sort by category then score
    const categoryOrder = { required: 0, suggested: 1, optional: 2 };
    return filtered.sort((a, b) => {
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
      if (categoryDiff !== 0) return categoryDiff;
      return b.totalScore - a.totalScore;
    });
  }, [techType, q1Answer, q2Answers, institutionProfile]);

  // Dynamic Q2 questions
  const getDynamicQ2Questions = () => {
    if (!q1Answer) return [];
    
    const questionBank = {
      discovery: [
        { key: 'real_data', text: 'Will you use actual patient records or data?' },
        { key: 'identifiable', text: 'Could someone figure out who a patient is?' },
        { key: 'future_use', text: 'Could this be used for patient care later?' },
        { key: 'data_sharing', text: 'Will data or results be shared outside your team?' },
        { key: 'memorization', text: 'Could the AI remember specific patient details?' }
      ],
      translational: [
        { key: 'clinician_use', text: 'Will doctors or nurses see what the AI says?' },
        { key: 'pilot_patients', text: 'Will you test this with real patients?' },
        { key: 'clinical_reliance', text: 'Might clinicians rely on this for decisions?' },
        { key: 'patient_awareness', text: 'Will patients know AI is being used?' },
        { key: 'override', text: 'Can clinicians easily ignore the AI advice?' }
      ],
      clinical: [
        { key: 'treatment', text: 'Will this directly affect treatment decisions?' },
        { key: 'patient_facing', text: 'Will patients interact with the AI directly?' },
        { key: 'autonomous', text: 'Can the AI make decisions without human review?' },
        { key: 'critical', text: 'Will this be used in critical or emergency situations?' },
        { key: 'vulnerable', text: 'Will this involve vulnerable populations?' }
      ]
    };
    
    const questions = questionBank[q1Answer] || [];
    
    // Add universal critical questions
    if (!questions.find(q => q.key === 'vulnerable')) {
      questions.push({ key: 'vulnerable', text: 'Will this involve vulnerable populations?' });
    }
    if (!questions.find(q => q.key === 'autonomous')) {
      questions.push({ key: 'autonomous', text: 'Can the AI make decisions without human review?' });
    }
    
    // Profile-based filtering
    if (institutionProfile === 'streamlined') {
      return questions.slice(0, 5);
    } else if (institutionProfile === 'conservative') {
      return questions.slice(0, 7);
    }
    return questions.slice(0, 6);
  };

  // Calculate oversight level
  useEffect(() => {
    if (!q1Answer) {
      setOversightLevel('minimal');
      return;
    }
    
    const characteristics = getTechnologyCharacteristics();
    const selectedChars = characteristics.filter(c => selectedCharacteristics[c.key]);
    
    // Base oversight calculation
    let baseScore = 0;
    
    // Phase contribution
    if (q1Answer === 'discovery') baseScore += 1;
    else if (q1Answer === 'translational') baseScore += 2;
    else if (q1Answer === 'clinical') baseScore += 3;
    
    // Q2 contribution
    if (q2Answers.vulnerable === 'yes') baseScore += 2;
    if (q2Answers.autonomous === 'yes') baseScore += 2;
    if (q2Answers.treatment === 'yes') baseScore += 2;
    if (q2Answers.critical === 'yes') baseScore += 2;
    
    // Selected characteristics contribution
    const unaddressedRequired = selectedChars.filter(c => 
      c.category === 'required' && !characteristicStatus[c.key]
    ).length;
    
    if (unaddressedRequired > 0) baseScore += 3;
    
    // Determine level
    let level;
    if (baseScore <= 2) level = 'minimal';
    else if (baseScore <= 5) level = 'standard';
    else if (baseScore <= 8) level = 'enhanced';
    else level = 'full';
    
    // Never minimal with vulnerable populations
    if (q2Answers.vulnerable === 'yes' && level === 'minimal') {
      level = 'standard';
    }
    
    setOversightLevel(level);
  }, [q1Answer, q2Answers, selectedCharacteristics, characteristicStatus]);

  // Auto-select required characteristics
  useEffect(() => {
    const characteristics = getTechnologyCharacteristics();
    const newSelected = { ...selectedCharacteristics };
    
    characteristics.forEach(char => {
      if (char.category === 'required') {
        newSelected[char.key] = true;
      }
    });
    
    setSelectedCharacteristics(newSelected);
  }, [techType, q1Answer, q2Answers, institutionProfile]);

  // Group protocol requirements
  const getGroupedRequirements = () => {
    const groups = {
      'Documentation Requirements': [],
      'Review & Approval': [],
      'Monitoring & Reporting': [],
      'Technical Controls': [],
      'Patient Protections': []
    };
    
    // Add requirements based on selections
    const characteristics = getTechnologyCharacteristics();
    const selectedChars = characteristics.filter(c => selectedCharacteristics[c.key]);
    
    selectedChars.forEach(char => {
      const status = characteristicStatus[char.key];
      
      if (status === 'evaluating') {
        groups['Documentation Requirements'].push(`Evaluation plan for ${char.name}`);
        groups['Monitoring & Reporting'].push(`Track ${char.name} metrics`);
      } else if (status === 'no_risk') {
        groups['Documentation Requirements'].push(`Justification for ${char.name} assessment`);
      } else if (status === 'mitigated') {
        groups['Technical Controls'].push(`Implemented controls for ${char.name}`);
      }
    });
    
    // Add Q2-based requirements
    if (q2Answers.vulnerable === 'yes') {
      groups['Patient Protections'].push('Additional safeguards for vulnerable populations');
      groups['Review & Approval'].push('Ethics committee review required');
    }
    
    if (q2Answers.autonomous === 'yes') {
      groups['Technical Controls'].push('Human override mechanism required');
      groups['Monitoring & Reporting'].push('Log all autonomous decisions');
    }
    
    // Add oversight-based requirements
    if (oversightLevel === 'enhanced' || oversightLevel === 'full') {
      groups['Review & Approval'].push('Full board review required');
      groups['Monitoring & Reporting'].push('Monthly progress reports');
    }
    
    return groups;
  };

  const handleReset = () => {
    setTechType('ml');
    setQ1Answer('');
    setQ2Answers({});
    setSelectedCharacteristics({});
    setCharacteristicStatus({});
    setSelectedControls({});
    setCustomControls({});
    setNoRiskJustifications({});
    setOversightLevel('minimal');
    setInstitutionProfile('standard');
    setCollapsedGroups({});
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
    };
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  return (
    <SlideWrapper title="Building Your Technology Checklist">
      <ContentContainer>
        <ProfileToggleContainer>
          <ProfileLabel>Institution Risk Profile:</ProfileLabel>
          <ProfileToggle>
            <ProfileOption
              $active={institutionProfile === 'conservative'}
              $profile="conservative"
              onClick={() => setInstitutionProfile('conservative'
            >
              Conservative
            </ProfileOption>
            <ProfileOption
              $active={institutionProfile === 'standard'}
              $profile="standard"
              onClick={() => setInstitutionProfile('standard'
            >
              Standard
            </ProfileOption>
            <ProfileOption
              $active={institutionProfile === 'streamlined'}
              $profile="streamlined"
              onClick={() => setInstitutionProfile('streamlined'
            >
              Streamlined
            </ProfileOption>
          </ProfileToggle>
          <ProfileDescription $profile={institutionProfile}>
            {institutionProfile === 'conservative' && 'More oversight, broader review'}
            {institutionProfile === 'standard' && 'Balanced approach'}
            {institutionProfile === 'streamlined' && 'Focused essentials only'}
          </ProfileDescription>
        </ProfileToggleContainer>

        <Subtitle>
          Answer questions to build <span>personalized requirements</span> based on your technology and use case
        </Subtitle>

        <MainContainer>
          {/* Panel 1: Context Questions */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#4AE2C0">1</StepBadge>
              Define Your Context
            </PanelTitle>
            
            <QuestionGroup>
              <QuestionLabel>What type of AI technology?</QuestionLabel>
              <Select value={techType} onChange={(e) => setTechType(e.target.value>
                <option value="ml">Machine Learning (ML)</option>
                <option value="llm">Large Language Model (LLM)</option>
                <option value="imaging">Medical Imaging AI</option>
                <option value="wearables">Wearables/Sensors</option>
                <option value="apps">Digital Health Apps</option>
              </Select>
            </QuestionGroup>

            <QuestionGroup>
              <QuestionLabel $color="#FFD93D">Q1: What phase is your research?</QuestionLabel>
              <RadioGroup>
                <RadioOption>
                  <input
                    type="radio"
                    name="phase"
                    value="discovery"
                    checked={q1Answer === 'discovery'}
                    onChange={(e) => setQ1Answer(e.target.value
                  />
                  Discovery/Feasibility
                </RadioOption>
                <RadioOption>
                  <input
                    type="radio"
                    name="phase"
                    value="translational"
                    checked={q1Answer === 'translational'}
                    onChange={(e) => setQ1Answer(e.target.value
                  />
                  Translational/Pilot
                </RadioOption>
                <RadioOption>
                  <input
                    type="radio"
                    name="phase"
                    value="clinical"
                    checked={q1Answer === 'clinical'}
                    onChange={(e) => setQ1Answer(e.target.value
                  />
                  Clinical Validation
                </RadioOption>
              </RadioGroup>
            </QuestionGroup>

            {q1Answer && (
              <QuestionGroup>
                <QuestionLabel $color="#FFD93D">Q2: Key Questions</QuestionLabel>
                {getDynamicQ2Questions().map((question) => (
                  <YesNoQuestion key={question.key}>
                    <YesNoText>{question.text}</YesNoText>
                    <YesNoButtons>
                      <YesNoButton
                        $active={q2Answers[question.key] === 'yes'}
                        $yes={true}
                        onClick={() => setQ2Answers({...q2Answers, [question.key]: 'yes'}
                      >
                        Yes
                      </YesNoButton>
                      <YesNoButton
                        $active={q2Answers[question.key] === 'no'}
                        $yes={false}
                        onClick={() => setQ2Answers({...q2Answers, [question.key]: 'no'}
                      >
                        No
                      </YesNoButton>
                    </YesNoButtons>
                  </YesNoQuestion>
                )
              </QuestionGroup>
            
          </Panel>

          {/* Panel 2: Technology Characteristics */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#FF6B6B">2</StepBadge>
              Select Technology Characteristics
            </PanelTitle>
            
            {q1Answer ? (
              getTechnologyCharacteristics().map((char) => (
                <CharacteristicWrapper key={char.key}>
                  <CategoryBadge $category={char.category}>
                    {char.category === 'required' ? 'Must Address' :
                     char.category === 'suggested' ? 'Suggested' :
                     'Consider'}
                  </CategoryBadge>
                  
                  <CharacteristicItem $selected={selectedCharacteristics[char.key]}>
                    <CharacteristicHeader>
                      <CharacteristicCheckbox
                        type="checkbox"
                        id={char.key}
                        checked={selectedCharacteristics[char.key] || false}
                        disabled={char.category === 'required'}
                        onChange={(e) => {
                          if (char.category !== 'required') {
                            setSelectedCharacteristics({
                              ...selectedCharacteristics,
                              [char.key]: e.target.checked
                            });
                          }
                        }}
                      />
                      <CharacteristicLabel 
                        htmlFor={char.key}
                        $disabled={char.category === 'required'}
                      >
                        {char.name}
                      </CharacteristicLabel>
                    </CharacteristicHeader>
                    
                    <CharacteristicDescription>{char.desc}</CharacteristicDescription>
                    <ScoreIndicator>Score: {char.totalScore} ({char.scoreBreakdown})</ScoreIndicator>
                    
                    {selectedCharacteristics[char.key] && (
                      <ControlStatusDropdown
                        value={characteristicStatus[char.key] || ''}
                        onChange={(e) => setCharacteristicStatus({
                          ...characteristicStatus,
                          [char.key]: e.target.value
                        }
                      >
                        <option value="">How will you address this?</option>
                        <option value="mitigated">Controls in place</option>
                        <option value="evaluating">Being evaluated in study</option>
                        <option value="no_risk">No risk - can justify</option>
                      </ControlStatusDropdown>
                    
                  </CharacteristicItem>
                </CharacteristicWrapper>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', padding: '40px 20px' }}>
                Complete Q1 to see relevant technology characteristics
              </div>
            
          </Panel>

          {/* Panel 3: Protocol Requirements */}
          <Panel>
            <PanelTitle>
              <StepBadge $color="#9B59B6">3</StepBadge>
              Your Protocol Requirements
            </PanelTitle>
            
            <div style={{ 
              padding: '8px 12px', 
              background: oversightLevel === 'minimal' ? 'rgba(30, 136, 229, 0.1)' :
                          oversightLevel === 'standard' ? 'rgba(74, 226, 192, 0.1)' :
                          oversightLevel === 'enhanced' ? 'rgba(255, 193, 61, 0.1)' :
                          'rgba(255, 107, 107, 0.1)',
              borderRadius: '6px',
              marginBottom: '15px',
              border: `1px solid ${
                oversightLevel === 'minimal' ? 'rgba(30, 136, 229, 0.3)' :
                oversightLevel === 'standard' ? 'rgba(74, 226, 192, 0.3)' :
                oversightLevel === 'enhanced' ? 'rgba(255, 193, 61, 0.3)' :
                'rgba(255, 107, 107, 0.3)'
              }`
            }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                IRB Oversight Level: {oversightLevel.toUpperCase(
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {oversightLevel === 'minimal' && 'Expedited review, minimal reporting'}
                {oversightLevel === 'standard' && 'Standard review process'}
                {oversightLevel === 'enhanced' && 'Additional safeguards required'}
                {oversightLevel === 'full' && 'Comprehensive review and monitoring'}
              </div>
            </div>
            
            {Object.entries(getGroupedRequirements()).map(([groupName, items]) => (
              items.length > 0 && (
                <RequirementGroup key={groupName}>
                  <RequirementHeader 
                    onClick={() => setCollapsedGroups({
                      ...collapsedGroups,
                      [groupName]: !collapsedGroups[groupName]
                    }
                  >
                    <RequirementTitle>{groupName}</RequirementTitle>
                    <RequirementCount>{items.length}</RequirementCount>
                  </RequirementHeader>
                  <RequirementList $collapsed={collapsedGroups[groupName]}>
                    {items.map((item, idx) => (
                      <RequirementItem key={idx}>{item}</RequirementItem>
                    )
                  </RequirementList>
                </RequirementGroup>
              )
            )
          </Panel>
        </MainContainer>

        <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      </ContentContainer>

      <Notes>
        Practical implementation checklist that adapts based on:
        - Technology type (ML, LLM, imaging, etc.)
        - Research phase (discovery, translational, clinical)
        - Specific use case factors from Q2
        - Institution risk profile
        
        Uses quantitative scoring to determine which characteristics are most relevant
      </Notes>
    </SlideWrapper>
  );
};

export default Slide19PracticalChecklist;