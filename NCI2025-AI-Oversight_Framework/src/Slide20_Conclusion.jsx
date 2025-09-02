import React from 'react';
import useSlideAnimation from './hooks/useSlideAnimation';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import styled, { keyframes } from 'styled-components';

const titleAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: 20px 40px;
  overflow-y: auto;
`;

// Title removed per user request

const SummaryBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px 30px;
  max-width: 750px;
  width: 100%;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '20px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.3s;
`;

const SummaryText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.6;
  text-align: left;
  
  ul {
    margin: 10px 0;
    padding-left: 20px;
    list-style: none;
  }
  
  li {
    margin-bottom: 6px;
    position: relative;
    padding-left: 15px;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #4AE2C0;
      font-size: 16px;
    }
  }
`;

const CallToActionBox = styled.div`
  margin-top: 20px;
  background: linear-gradient(135deg, rgba(74, 226, 192, 0.08) 0%, rgba(74, 226, 192, 0.03) 100%);
  border: 2px solid rgba(74, 226, 192, 0.25);
  border-radius: 12px;
  padding: 18px 25px;
  text-align: center;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translateY(${props => props.$visible ? 0 : '10px'});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.6s;
  max-width: 600px;
  width: 100%;
`;

const CTATitle = styled.h3`
  color: #4AE2C0;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const CTAText = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  line-height: 1.4;
  margin: 0 0 10px 0;
`;

const ContactLine = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Slide20 = () => {
  const { step } = useSlideAnimation(3, 'slide-20-conclusion');

  return (
    <SlideWrapper 
      slideNumber={20}
      slideTitle="Conclusion"
      totalSlides={20}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>

      <ContentWrapper>
        <SummaryBox $visible={true} style={{ marginTop: '30px' }}>
          <SummaryText>
            We've explored a practical framework that balances:
            
            <ul>
              <li>Technical complexity with reviewable criteria</li>
              <li>Innovation pace with patient safety</li>
              <li>Flexibility with consistent principles</li>
            </ul>
            
            The three-question approach provides structure without requiring AI expertise.
            This is a conversation starter — your institutions have unique needs and contexts.
          </SummaryText>
        </SummaryBox>

        <CallToActionBox $visible={true}>
          <CTATitle>Questions & Discussion</CTATitle>
          <CTAText>
            Thank you for your attention. I welcome your questions, challenges, and perspectives.
            <br/>
            Let's explore how this framework might work in your context.
          </CTAText>
          <ContactLine>
            lifson.mark@mayo.edu | linkedin.com/in/marklifson
          </ContactLine>
        </CallToActionBox>
      </ContentWrapper>

      <Notes>
        Closing remarks (90 seconds):
        
        We've covered a lot of ground today. The key takeaway isn't that we have all the answers - 
        it's that we have a framework for asking better questions.
        
        The three-question approach gives us a common language for discussing AI research oversight
        without requiring everyone to become machine learning experts.
        
        This framework will evolve. It has to. AI technology changes too quickly for any static 
        approach to remain relevant.
        
        What matters is that we start somewhere - with clear principles, practical tools, and 
        institutional flexibility.
        
        I appreciate your time and attention. I'm interested in your thoughts and experiences
        as we all navigate this new territory together.
        
        Thank you.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide20;