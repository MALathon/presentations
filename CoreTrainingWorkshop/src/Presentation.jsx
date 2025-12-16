import React from 'react';
import { Deck } from 'spectacle';
import styled from 'styled-components';

// Import slides
import Slide01_Title from './Slide01_Title';
import Slide02_Speaker from './Slide02_Speaker';
import Slide03_AIvsTraditional from './Slide03_AIvsTraditional';
import Slide04_ClinicalPhases from './Slide04_ClinicalPhases';
import Slide05_IRBCriteria from './Slide05_IRBCriteria';
import Slide06_TranslationGap from './Slide06_TranslationGap';
import Slide07_LanguageMatters from './Slide07_LanguageMatters';
import Slide08_ImpactSpectrum from './Slide08_ImpactSpectrum';
import Slide09_RiskMatrix from './Slide09_RiskMatrix';

// Custom theme for the presentation
const theme = {
  colors: {
    primary: '#ffffff',
    secondary: '#4AE2C0',
    tertiary: '#003B71',
    quaternary: '#FFC107',
    quinary: '#FF6B6B',
  },
  fonts: {
    header: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    text: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    monospace: '"SF Mono", "Monaco", "Menlo", "Courier New", monospace',
  },
  fontSizes: {
    h1: '64px',
    h2: '48px',
    h3: '32px',
    text: '24px',
    monospace: '20px',
  },
  space: [16, 24, 32, 48, 64],
};

// Styled Deck - extends Deck directly instead of wrapping it
const StyledDeck = styled(Deck)`
  font-family: ${theme.fonts.text};
`;


/**
 * Core Training Workshop: Hands-On Core Training on Artificial Intelligence
 *
 * A condensed presentation covering key concepts in AI research oversight:
 *
 * 1. Title Slide - Workshop introduction
 * 2. Speaker Introduction
 * 3. AI vs Traditional Research - The data difference
 * 4. Clinical Phases - Three phases of AI evaluation
 * 5. IRB Criteria - 9 review criteria
 * 6. Translation Gap - Communication challenges
 * 7. Language Matters - Clinical vs research intent
 * 8. Impact Spectrum - Oversight requirements
 * 9. Risk Matrix - Risk-based oversight framework
 */
const Presentation = () => {
  return (
    <>
      <StyledDeck
        theme={theme}
        template={() => null}
        transition={{
          from: {
            opacity: 0,
            transform: 'translateX(100%)',
          },
          enter: {
            opacity: 1,
            transform: 'translateX(0)',
          },
          leave: {
            opacity: 0,
            transform: 'translateX(-100%)',
          },
        }}
      >
        <Slide01_Title />
        <Slide02_Speaker />
        <Slide03_AIvsTraditional />
        <Slide04_ClinicalPhases />
        <Slide05_IRBCriteria />
        <Slide06_TranslationGap />
        <Slide07_LanguageMatters />
        <Slide08_ImpactSpectrum />
        <Slide09_RiskMatrix />
      </StyledDeck>
    </>
  );
};

export default Presentation;
