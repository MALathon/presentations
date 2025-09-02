import React from 'react';
import {
  Deck,
  Slide,
  Heading,
  Text,
  Box,
  FlexBox,
  Notes,
  FullScreen
} from 'spectacle';
import styled, { createGlobalStyle } from 'styled-components';

// Import all slides
import Slide01Title from './Slide01_Title';
import Slide02Speaker from './Slide02_Speaker';
import Slide03CentralQuestion from './Slide03_CentralQuestion';
import Slide04NotUnique from './Slide04_NotUnique';
import Slide05AIvsTraditional from './Slide05_AIvsTraditional';
import Slide06ClinicalPhases from './Slide06_ClinicalPhases';
import Slide07WhenIRB from './Slide07_WhenIRB';
import Slide08RegulatoryFramework from './Slide08_RegulatoryFramework';
import Slide09IRBCriteria from './Slide09_IRBCriteria';
import Slide10TranslationGap from './Slide10_TranslationGap';
import Slide11ThreeQuestions from './Slide11_ThreeQuestions';
import Slide12Question1 from './Slide12_Question1';
import Slide13LanguageMatters from './Slide13_LanguageMatters';
import Slide14Question2 from './Slide14_Question2';
import Slide15ImpactSpectrum from './Slide15_ImpactSpectrum';
import Slide16Question3 from './Slide16_Question3';
import Slide17TechRisksAndMitigations from './Slide17_TechRisksAndMitigations';
import Slide18RiskAcceptabilityMatrix from './Slide18_RiskAcceptabilityMatrix';
import Slide19PracticalChecklist from './Slide19_PracticalChecklist';
import Slide20Conclusion from './Slide20_Conclusion';

// Healthcare Theme
const healthcareTheme = {
  colors: {
    primary: '#003B71',
    secondary: '#0066CC',
    tertiary: '#1E88E5',
    quaternary: '#FFFFFF',
    background: '#FAFAFA',
    text: '#333333',
    textSecondary: '#666666',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    accent: '#00BCD4'
  },
  fonts: {
    header: 'Helvetica Neue, Helvetica, Arial, sans-serif',
    text: 'Georgia, Cambria, "Times New Roman", Times, serif',
    monospace: 'Consolas, "Liberation Mono", Menlo, Courier, monospace'
  },
  fontSizes: {
    h1: '72px',
    h2: '56px',
    h3: '44px',
    h4: '32px',
    h5: '24px',
    paragraph: '20px',
    text: '18px'
  }
};

const StyledDeck = styled(Deck)`
  font-family: ${healthcareTheme.fonts.text};
`;


const Presentation = () => {
  return (
    <>
      <StyledDeck theme={healthcareTheme} loop={false}>
        <FullScreen />

      {/* PRESENTATION: 20 SLIDES TOTAL */}

      {/* PART 1: THE PROBLEM (Slides 1-8) */}
      {/* Establish context and the unique challenges of AI research */}
      
      {/* Slide 1: Title */}
      <Slide01Title />
      
      {/* Slide 2: Speaker Background */}
      <Slide02Speaker />

      {/* Slide 3: The Central Question - What causes angst? */}
      <Slide03CentralQuestion />

      {/* Slide 4: Not Unique to AI - These concerns exist elsewhere */}
      <Slide04NotUnique />

      {/* Slide 5: AI vs Traditional Research - Combined view */}
      <Slide05AIvsTraditional />

      {/* Slide 6: Clinical Phases - Same Phases, Different Challenges */}
      <Slide06ClinicalPhases />

      {/* Slide 7: When Does IRB Get Involved? - Clear vs Unclear */}
      <Slide07WhenIRB />

      {/* Slide 8: Regulatory Framework - FDA/ISO/IRB landscape */}
      <Slide08RegulatoryFramework />

      {/* PART 2: THE SOLUTION FRAMEWORK (Slides 9-11) */}
      {/* Introduce the approach to addressing these challenges */}

      {/* Slide 9: IRB Review Criteria - Complex regulatory reality */}
      <Slide09IRBCriteria />

      {/* Slide 10: The Translation Gap - What both sides want */}
      <Slide10TranslationGap />

      {/* Slide 11: Three Key Questions Framework - The solution bridge */}
      <Slide11ThreeQuestions />

      {/* PART 3: QUESTION 1 - CLINICAL USE (Slides 12-13) */}
      
      {/* Slide 12: Question 1 - Clinical Intended Use */}
      <Slide12Question1 />

      {/* Slide 13: Language Matters - Clinical vs exploratory */}
      <Slide13LanguageMatters />

      {/* PART 4: QUESTION 2 - PATIENT IMPACT (Slides 14-15) */}

      {/* Slide 14: Question 2 - Patient Care Impact */}
      <Slide14Question2 />

      {/* Slide 15: Impact Spectrum - Silent to autonomous */}
      <Slide15ImpactSpectrum />

      {/* PART 5: QUESTION 3 - TECHNOLOGY RISKS (Slides 16-17) */}

      {/* Slide 16: Question 3 - Technology Risks */}
      <Slide16Question3 />

      {/* Slide 17: Technology-Specific Risks & Mitigations */}
      <Slide17TechRisksAndMitigations />

      {/* PART 6: PRACTICAL APPLICATION (Slides 18-19) */}

      {/* Slide 18: Risk-Based Oversight Framework - Matrix combining all questions */}
      <Slide18RiskAcceptabilityMatrix />

      {/* Slide 19: IRB-Researcher Assessment Tool - Interactive checklist */}
      <Slide19PracticalChecklist />

      {/* PART 7: CONCLUSION */}
      
      {/* Slide 20: Bringing It All Together - Evolution not revolution */}
      <Slide20Conclusion />

      </StyledDeck>
    </>
  );
};

export default Presentation;