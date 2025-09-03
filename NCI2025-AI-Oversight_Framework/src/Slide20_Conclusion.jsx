import React from 'react';
import { Notes } from 'spectacle';
import SlideWrapper from './components/SlideWrapper'
import InteractionHint from './components/InteractionHint';
import styled from 'styled-components';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  position: relative;
`;

const QuestionsTitle = styled.h1`
  font-size: 72px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 50px;
  text-align: center;
  letter-spacing: -1px;
`;

const SummarySection = styled.div`
  max-width: 700px;
  width: 100%;
  margin-bottom: 20px;
  text-align: center;
`;

const SummaryText = styled.p`
  color: #4AE2C0;
  font-size: 20px;
  line-height: 1.6;
  margin-bottom: 30px;
  font-weight: 300;
`;

const KeyPoints = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
  text-align: left;
  display: inline-block;
`;

const KeyPoint = styled.li`
  color: rgba(255, 255, 255, 0.85);
  font-size: 18px;
  margin-bottom: 12px;
  padding-left: 25px;
  position: relative;
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #4AE2C0;
    font-size: 20px;
  }
`;

const ContactSection = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 10px;
  border-radius: 8px;
`;

const QRCodeImage = styled.img`
  width: 100px;
  height: 100px;
  display: block;
`;

const ContactInfo = styled.div`
  text-align: left;
`;

const ContactText = styled.p`
  color: #4AE2C0;
  font-size: 16px;
  margin: 5px 0;
  font-weight: 300;
  
  a {
    color: #4AE2C0;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Slide20_Conclusion = () => {
  return (
    <SlideWrapper 
      slideNumber={20}
      slideTitle="Questions & Discussion"
      totalSlides={20}
    >
      <ContentWrapper>
        <QuestionsTitle>Questions?</QuestionsTitle>
        
        <SummarySection>
          <SummaryText>
            A practical three-question framework for AI research oversight
          </SummaryText>
          
          <KeyPoints>
            <KeyPoint>Is this human subjects research requiring IRB review? (Including FDA-regulated device studies)</KeyPoint>
            <KeyPoint>What is the potential for impact on human subjects?</KeyPoint>
            <KeyPoint>Is the technical risk acceptable relative to benefits?</KeyPoint>
          </KeyPoints>
        </SummarySection>
        
        <ContactSection>
          <QRCodeContainer>
            <QRCodeImage src="./qrcode_www.linkedin.com.png" alt="LinkedIn QR Code" />
          </QRCodeContainer>
          
          <ContactInfo>
            <ContactText>lifson.mark@mayo.edu</ContactText>
            <ContactText>
              <a href="https://linkedin.com/in/marklifson" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/marklifson
              </a>
            </ContactText>
          </ContactInfo>
        </ContactSection>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
      
      <Notes>
        Closing (60 seconds):
        
        Thank you for your attention today. We've explored a practical three-question framework 
        that can help streamline AI research oversight without requiring specialized AI expertise.
        
        The key is not having all the answers, but having the right framework for asking questions.
        
        I welcome your thoughts, questions, and experiences as we all navigate this evolving landscape together.
        
        Please feel free to reach out - I'm always interested in learning how different institutions 
        are approaching these challenges.
        
        Thank you.
      </Notes>
    </SlideWrapper>
  );
};

export default Slide20_Conclusion;
