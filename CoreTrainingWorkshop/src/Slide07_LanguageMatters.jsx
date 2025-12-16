import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';

const ContentContainer = styled.div`
  position: absolute;
  top: 75px;
  bottom: 65px;
  left: 40px;
  right: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: #E0E0E0;
  text-align: center;
  margin: 0 0 5px 0;
  letter-spacing: 0.5px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
    opacity: 1;
  }
`;

const KeyWordsSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  position: relative;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.1) 80%,
      transparent 100%
    );
    opacity: ${props => props.$showDivider ? 1 : 0};
    transition: opacity 1.2s ease;
    transition-delay: 0.5s;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColumnHeader = styled.div`
  background: ${props => props.$clinical ?
    'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)' :
    'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
  };
  border: 2px solid ${props => props.$clinical ?
    'rgba(251, 191, 36, 0.5)' :
    'rgba(96, 165, 250, 0.5)'
  };
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 6px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: scale(${props => props.$visible ? 1 : 0.9});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;
`;

const ColumnTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$clinical ? '#FBBF24' : '#60A5FA'};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const KeyWord = styled.span`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid ${props => props.$clinical ?
    'rgba(251, 191, 36, 0.4)' :
    'rgba(96, 165, 250, 0.4)'
  };
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$clinical ? '#FBBF24' : '#60A5FA'};
  margin: 0 3px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  opacity: ${props => props.$visible ? 1 : 0};
  animation: ${props => props.$visible && css`
    ${fadeInScale} 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${props.$delay}s both
  `};

  /* Add small icon indicator for colorblind accessibility */
  &::before {
    content: ${props => props.$clinical ? '"⚠"' : '"✓"'};
    font-size: 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    opacity: 1;
  }
`;

const ExamplesSection = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 8px;
`;

const ExampleCard = styled.div`
  background: ${props => props.$type === 'clinical' ?
    'rgba(251, 191, 36, 0.06)' :
    props.$type === 'ambiguous' ?
    'rgba(45, 212, 191, 0.06)' :
    'rgba(96, 165, 250, 0.06)'
  };
  border-left: 3px solid ${props => props.$type === 'clinical' ?
    '#FBBF24' :
    props.$type === 'ambiguous' ?
    '#2DD4BF' :
    '#60A5FA'
  };
  border-radius: 6px;
  padding: 8px 14px;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '15px'});
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;
`;

const SectionHeader = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #C7C7C7;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 2px;
`;

const ExampleText = styled.p`
  font-size: 14px;
  color: #FFFFFF;
  margin: 0 0 3px 0;
  line-height: 1.35;

  .highlight-clinical {
    background: rgba(251, 191, 36, 0.2);
    color: #FBBF24;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
    /* Add icon prefix for accessibility */
    &::before {
      content: '⚠ ';
      font-size: 12px;
    }
  }

  .highlight-exploratory {
    background: rgba(96, 165, 250, 0.2);
    color: #60A5FA;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
    /* Add icon prefix for accessibility */
    &::before {
      content: '✓ ';
      font-size: 12px;
    }
  }

  .highlight-ambiguous {
    background: rgba(45, 212, 191, 0.2);
    color: #2DD4BF;
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
    /* Add icon prefix for accessibility */
    &::before {
      content: '? ';
      font-size: 12px;
    }
  }
`;

const ExampleLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$type === 'clinical' ?
    '#FBBF24' :
    props.$type === 'ambiguous' ?
    '#2DD4BF' :
    '#60A5FA'
  };
  text-transform: uppercase;
  letter-spacing: 0.7px;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  /* Add icon prefix based on type */
  &::before {
    content: ${props => props.$type === 'clinical' ? '"⚠"' :
      props.$type === 'ambiguous' ? '"?"' : '"✓"'};
  }
`;

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L30 26H2L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 11V18M16 22V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SafeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2L4 8V16C4 22 8 26 16 30C24 26 28 22 28 16V8L16 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M11 16L14 19L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Slide07_LanguageMatters = () => {
  const { step } = useSlideAnimation(8, 'slide-7-language-matters');

  const examples = [
    {
      section: "STUDY OBJECTIVES",
      text: <>
        The primary objective is to develop a deep learning model that will <span className="highlight-clinical">diagnose</span> pneumonia from chest X-rays with
        accuracy comparable to board-certified radiologists. The system will be <span className="highlight-clinical">deployed in emergency departments</span> to
        <span className="highlight-clinical">expedite treatment decisions</span> for patients with respiratory symptoms.
      </>,
      type: "clinical",
      label: "Clinical Intent - FDA pathway likely"
    },
    {
      section: "RESEARCH AIMS",
      text: <>
        This study will <span className="highlight-exploratory">investigate</span> novel biomarkers in retinal images by <span className="highlight-exploratory">analyzing
        patterns</span> across large retrospective datasets. We aim to <span className="highlight-exploratory">explore correlations</span> between retinal
        features and cardiovascular risk factors to <span className="highlight-exploratory">generate hypotheses</span> for future prospective studies.
      </>,
      type: "exploratory",
      label: "Exploratory Research - IRB focus on data privacy"
    },
    {
      section: "METHODOLOGY",
      text: <>
        Our AI platform will <span className="highlight-exploratory">analyze</span> patient data to <span className="highlight-clinical">predict</span> 30-day
        readmission risk. Results will be <span className="highlight-ambiguous">provided to clinicians</span> for <span className="highlight-exploratory">evaluation</span> of
        potential <span className="highlight-clinical">treatment modifications</span>. The system will <span className="highlight-ambiguous">support</span> clinical teams
        in <span className="highlight-ambiguous">decision-making processes</span>.
      </>,
      type: "ambiguous",
      label: "Mixed signals - Contains both clinical and research language"
    },
    {
      section: "DATA ANALYSIS PLAN",
      text: <>
        The AI algorithm will <span className="highlight-clinical">screen</span> mammography images to <span className="highlight-clinical">identify
        suspicious lesions</span> requiring immediate radiologist review. Cases flagged as high-risk will <span className="highlight-clinical">trigger
        automatic scheduling</span> for follow-up imaging, with the AI assessment <span className="highlight-clinical">documented in patient records</span>.
      </>,
      type: "clinical",
      label: "Clinical Intent - Direct patient impact"
    }
  ];

  return (
    <SlideWrapper
      slideNumber={7}
      slideTitle="Determining Clinical Intent"
      totalSlides={9}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <ContentContainer>
        <Subtitle $visible={true} $delay="0.2s">The same technology described differently triggers different regulatory pathways</Subtitle>

        <KeyWordsSection $visible={true} $delay="0.4s" $showDivider={true}>
          <Column>
            <ColumnHeader $clinical={true} $visible={true} $delay={0.1}>
              <ColumnTitle $clinical={true}>
                <WarningIcon />
                Clinical Trigger Words
              </ColumnTitle>
            </ColumnHeader>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["diagnose", "treat", "screen", "detect", "clinical decision", "deployed", "patient care"].map((term, index) => (
                <KeyWord
                  key={term}
                  $clinical={true}
                  $visible={true}
                  $delay={0.1 + (index * 0.08)}
                >
                  {term}
                </KeyWord>
              ))}
            </div>
          </Column>

          <Column>
            <ColumnHeader $clinical={false} $visible={true} $delay={0.2}>
              <ColumnTitle $clinical={false}>
                <SafeIcon />
                Research Indicators
              </ColumnTitle>
            </ColumnHeader>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {["investigate", "analyze", "explore", "retrospective", "patterns", "correlations", "hypotheses"].map((term, index) => (
                <KeyWord
                  key={term}
                  $clinical={false}
                  $visible={true}
                  $delay={0.1 + (index * 0.08)}
                >
                  {term}
                </KeyWord>
              ))}
            </div>
          </Column>
        </KeyWordsSection>

        <ExamplesSection>
          {examples.map((example, index) => (
            <ExampleCard
              key={index}
              $type={example.type}
              $visible={true}
              $delay={0.15 * index}
            >
              <SectionHeader>{example.section}</SectionHeader>
              <ExampleText>{example.text}</ExampleText>
              <ExampleLabel $type={example.type}>{example.label}</ExampleLabel>
            </ExampleCard>
          ))}
        </ExamplesSection>
      </ContentContainer>

      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <Notes>
        Language choices become critically important. The terminology researchers use signals different regulatory implications:
        On the left, clinical language like 'diagnose,' 'treat,' 'predict' - triggers regulatory oversight.
        On the right, exploratory language like 'investigate,' 'analyze,' 'explore' - suggests research focus.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide07_LanguageMatters;
