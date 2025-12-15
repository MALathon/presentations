import React from 'react';
import { Deck, Slide } from 'spectacle';
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

// Global styles
const GlobalStyle = styled.div`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .spectacle-presenter-mode {
    background: #001833 !important;
  }

  /* Override Spectacle's default slide styles */
  .spectacle-slide {
    overflow: hidden;
  }
`;

// Clean wrapper component that filters Spectacle props from being passed to DOM
const CleanSlideWrapper = ({ children, ...props }) => {
  // Filter out Spectacle-specific props that shouldn't go to DOM
  const {
    textAlign,
    padding,
    margin,
    backgroundColor,
    backgroundImage,
    backgroundOpacity,
    backgroundPosition,
    backgroundRepeat,
    backgroundSize,
    scaleRatio,
    transition,
    template,
    slideNum,
    numberOfSlides,
    ...cleanProps
  } = props;

  return <Slide {...cleanProps}>{children}</Slide>;
};

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
    <GlobalStyle>
      <Deck
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
        <CleanSlideWrapper>
          <Slide01_Title />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide02_Speaker />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide03_AIvsTraditional />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide04_ClinicalPhases />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide05_IRBCriteria />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide06_TranslationGap />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide07_LanguageMatters />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide08_ImpactSpectrum />
        </CleanSlideWrapper>

        <CleanSlideWrapper>
          <Slide09_RiskMatrix />
        </CleanSlideWrapper>
      </Deck>
    </GlobalStyle>
  );
};

export default Presentation;
