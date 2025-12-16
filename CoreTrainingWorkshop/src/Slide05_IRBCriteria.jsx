import React, { useState, useEffect, useRef } from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes, css } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

// Animation keyframes - simplified for presentation clarity
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 70px; // More headroom
  bottom: 95px; // Room for Based on bar and hints
  left: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
`;

const Title = styled.h1`
  font-size: 36px;
  color: white;
  margin: 0 0 12px 0;
  text-align: center;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #4AE2C0, transparent);
    opacity: 0.7;
  }
`;

// Category Navigation
const CategoryNav = styled.div`
  display: flex;
  gap: 10px;
  margin: 0 auto 6px;
  padding: 5px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  align-self: center;
`;

const CategoryTab = styled.button`
  padding: 8px 20px;
  background: ${props => props.$active ? 
    'linear-gradient(135deg, #4AE2C0 0%, #3BA99C 100%)' : 
    'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$active ? '#4AE2C0' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  color: ${props => props.$active ? '#001833' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 13px;
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-1px);
    background: ${props => props.$active ? 
      'linear-gradient(135deg, #4AE2C0 0%, #3BA99C 100%)' : 
      'rgba(255, 255, 255, 0.08)'};
  }
  
  &:focus {
    outline: 2px solid #4AE2C0;
    outline-offset: 2px;
  }
`;

// Main content container - split layout
const MainContent = styled.div`
  display: flex;
  gap: 30px;
  width: 100%;
  height: calc(100% - 28px);
  position: relative;
  align-items: center;
  justify-content: center;
  padding-top: 5px;
`;

// Left side container with title and wheel
const LeftContainer = styled.div`
  flex: 0 0 42%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const WheelTitle = styled.h2`
  font-size: 24px;
  color: white;
  margin: 0 0 25px 0;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.3px;
  opacity: 0.9;
`;

// Criteria wheel - centered on left
const CriteriaWheel = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 380px;
  height: 380px;
`;

const CriterionNode = styled.div`
  position: absolute;
  width: ${props => props.$critical ? '58px' : '55px'};
  height: ${props => props.$critical ? '58px' : '55px'};
  background: ${props => props.$critical ? 
    'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : 
    'linear-gradient(135deg, #4AE2C0 0%, #3BA99C 100%)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.$critical ? 
    'rgba(255, 107, 107, 0.3)' : 
    'rgba(74, 226, 192, 0.3)'};
  z-index: ${props => props.$selected ? 10 : 1};
  opacity: ${props => props.$dimmed ? 0.3 : (props.$visible ? 1 : 0)};
  transform: scale(${props => props.$visible ? (props.$selected ? 1.2 : 1) : 0})
    translate(-50%, -50%);
  pointer-events: ${props => props.$dimmed ? 'none' : 'auto'};
  
  &::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: ${props => props.$selected ? 
      (props.$critical ? '#FF6B6B' : '#4AE2C0') : 
      'transparent'};
    opacity: ${props => props.$selected ? 0.3 : 0};
    z-index: -1;
  }
  
  &:hover:not([disabled]) {
    transform: scale(${props => props.$selected ? 1.2 : 1.1}) translate(-50%, -50%);
    z-index: 11;
    box-shadow: 0 6px 25px ${props => props.$critical ? 
      'rgba(255, 107, 107, 0.5)' : 
      'rgba(74, 226, 192, 0.5)'};
  }
  
  &:focus {
    outline: 2px solid ${props => props.$critical ? '#FF6B6B' : '#4AE2C0'};
    outline-offset: 4px;
  }
  
  svg {
    width: 28px;
    height: 28px;
    stroke: white;
    fill: none;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }
`;

const CenterHub = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  background: radial-gradient(circle, rgba(74, 226, 192, 0.15) 0%, rgba(74, 226, 192, 0.05) 100%);
  border: 2px solid rgba(74, 226, 192, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #4AE2C0;
  font-weight: 600;
  text-align: center;
  backdrop-filter: blur(10px);
  line-height: 1.2;
  padding: 5px;
`;

// Detail panel on the right - expanded
const DetailPanel = styled.div`
  flex: 1;
  max-width: 500px;
  margin-right: 60px;
  margin-left: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%);
  border-radius: 12px;
  padding: 20px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  opacity: ${props => props.$show ? 1 : 0.5};
  transform: ${props => props.$show ? 'translateX(0)' : 'translateX(10px)'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: auto;
  min-height: 0;
  align-self: center;
  margin-top: 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(74, 226, 192, 0.1), transparent);
    transform: rotate(45deg);
    transition: all 0.5s;
    opacity: ${props => props.$show ? 1 : 0};
  }
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  position: relative;
`;

const DetailIcon = styled.div`
  width: 50px;
  height: 50px;
  background: ${props => props.$critical ? 
    'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)' : 
    'linear-gradient(135deg, #4AE2C0 0%, #3BA99C 100%)'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 26px;
    height: 26px;
    stroke: white;
    fill: none;
  }
`;

const DetailTitleSection = styled.div`
  flex: 1;
`;

const DetailTitle = styled.h2`
  font-size: 20px;
  color: ${props => props.$critical ? '#FF6B6B' : '#4AE2C0'};
  margin: 0 0 6px 0;
  font-weight: 500;
  letter-spacing: 0.2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const RegBadge = styled.span`
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

const RegTag = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background: ${props => props.$highlight ? 'rgba(74, 226, 192, 0.15)' : 'rgba(255, 255, 255, 0.08)'};
  border-radius: 8px;
  font-size: 12px;
  color: ${props => props.$highlight ? '#4AE2C0' : 'rgba(255, 255, 255, 0.7)'};
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  border: 1px solid ${props => props.$highlight ? 'rgba(74, 226, 192, 0.3)' : 'rgba(255, 255, 255, 0.15)'};
  font-weight: ${props => props.$highlight ? '500' : '400'};
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 226, 192, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(74, 226, 192, 0.5);
    }
  }
`;

const DetailDescription = styled.div`
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-left: 3px solid ${props => props.$critical ? '#FF6B6B' : '#4AE2C0'};
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
`;

const AIInsightBox = styled.div`
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.08) 0%, rgba(255, 107, 107, 0.04) 100%);
  border-radius: 10px;
  border: 1px solid rgba(255, 107, 107, 0.2);
  position: relative;
  
  &::before {
    content: 'IRB MUST DETERMINE';
    position: absolute;
    top: -10px;
    left: 14px;
    padding: 3px 12px;
    background: #001833;
    color: #FF6B6B;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 107, 107, 0.3);
  }
`;

const PracticalQuestionsBox = styled.div`
  padding: 12px 14px;
  background: linear-gradient(135deg, rgba(139, 69, 255, 0.08) 0%, rgba(139, 69, 255, 0.04) 100%);
  border-radius: 10px;
  border: 1px solid rgba(139, 69, 255, 0.2);
  position: relative;
  margin-top: 6px;
  
  &::before {
    content: 'PRACTICAL QUESTIONS';
    position: absolute;
    top: -10px;
    left: 14px;
    padding: 3px 12px;
    background: #001833;
    color: #8B45FF;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.8px;
    border-radius: 8px;
    border: 1px solid rgba(139, 69, 255, 0.3);
  }
`;

const QuestionsList = styled.ul`
  margin: 6px 0 0 0;
  padding-left: 18px;
  list-style: none;
  
  li {
    color: rgba(255, 255, 255, 0.9);
    font-size: 13px;
    line-height: 1.45;
    margin-bottom: 6px;
    position: relative;
    padding-left: 14px;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #8B45FF;
      font-size: 14px;
    }
  }
`;

const AIInsightText = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  line-height: 1.5;
  margin-top: 2px;
`;

// Bottom regulatory foundation - positioned higher up
const RegulatoryFoundation = styled.div`
  position: fixed;
  bottom: 58px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 30px;
  background: linear-gradient(135deg, rgba(74, 226, 192, 0.08) 0%, rgba(74, 226, 192, 0.04) 100%);
  border: 1px solid rgba(74, 226, 192, 0.2);
  border-radius: 28px;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  opacity: ${props => props.$show ? 1 : 0};
  transition: all 0.4s ease;
  z-index: 100;
  width: auto;
`;

const FoundationText = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.3px;
  white-space: nowrap;
  
  .belmont {
    color: ${props => props.$highlightBelmont ? '#FFD700' : '#4AE2C0'};
    font-weight: ${props => props.$highlightBelmont ? '600' : '500'};
    transition: all 0.3s ease;
  }
  
  .policy {
    color: ${props => props.$highlightPolicy ? '#FFD700' : '#4AE2C0'};
    font-weight: ${props => props.$highlightPolicy ? '600' : '500'};
    transition: all 0.3s ease;
  }
`;

const FoundationRefs = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
  padding-left: 20px;
  border-left: 1px solid rgba(74, 226, 192, 0.2);
  display: flex;
  gap: 16px;
  align-items: center;
  white-space: nowrap;
  
  .cfr21 {
    color: ${props => props.$highlight21CFR ? '#FFD700' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlight21CFR ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .cfr45 {
    color: ${props => props.$highlight45CFR ? '#FFD700' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlight45CFR ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .cfr32 {
    color: ${props => props.$highlight32CFR ? '#FFD700' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlight32CFR ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .fda {
    color: ${props => props.$highlightFDA ? '#FF6B6B' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlightFDA ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .iso {
    color: ${props => props.$highlightISO ? '#4AE2C0' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlightISO ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .cures {
    color: ${props => props.$highlightCures ? '#FFA500' : 'rgba(255, 255, 255, 0.7)'};
    font-weight: ${props => props.$highlightCures ? '600' : '400'};
    transition: all 0.3s ease;
  }
  
  .separator {
    color: rgba(74, 226, 192, 0.4);
    font-weight: 300;
  }
`;

// Removed InteractiveHint styled component - using InteractionHint component instead

// SVG Icons for each criterion - clean and professional
const ResearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
    <path d="M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
  </svg>
);

const HumanSubjectsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M12 14v7"/>
  </svg>
);

const DeviceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12" y2="18"/>
    <path d="M8 6h8M8 10h8M8 14h5"/>
  </svg>
);

const RiskIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const EquityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const ConsentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const MonitorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
    <path d="M7 8h3M7 12h5M17 8v8"/>
  </svg>
);

const PrivacyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const VulnerableIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    <path d="M12 8v6"/>
    <circle cx="12" cy="16" r="1"/>
  </svg>
);

const Slide05_IRBCriteria = () => {
  const [selectedCriterion, setSelectedCriterion] = useState(0);
  const [category, setCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [animateNodes, setAnimateNodes] = useState(false);
  
  useEffect(() => {
    // Initial animation
    const timer = setTimeout(() => {
      setShowAll(true);
      setAnimateNodes(true);
    }, 300);
    
    const handleKeyPress = (e) => {
      // Use Tab for navigation, Enter for selection, numbers for direct access
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        setSelectedCriterion(prev => (prev + 1) % 9);
      } else if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        setSelectedCriterion(prev => (prev - 1 + 9) % 9);
      } else if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        setSelectedCriterion(parseInt(e.key) - 1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setCategory('all');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        // Reset to initial state
        setSelectedCriterion(0);
        setCategory('all');
        setShowAll(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  
  const criteria = [
    {
      id: 0,
      title: 'FDA-Regulated Device?',
      shortTitle: 'FDA Device',
      ref: '21 CFR 812, 820',
      desc: 'Software intended for diagnosis, treatment, prevention, or mitigation of disease with quality system requirements',
      ai: 'Compliance with FDA Quality System Regulation (21 CFR 820) design controls, including verification and validation activities per 21 CFR 820.30(g), software validation per 21 CFR 820.70(i), and determination of significant risk vs non-significant risk device classification under 21 CFR 812.',
      critical: true,
      category: 'definition',
      icon: DeviceIcon,
      referenceSources: ['21CFR', 'Policy', 'FDA', 'ISO'],
      practicalQuestions: [
        'Will clinicians use the AI output to make treatment decisions?',
        'Does the AI provide diagnostic suggestions or risk scores?',
        'Could a wrong AI prediction directly harm a patient?'
      ]
    },
    {
      id: 1,
      title: 'Is it Human Subjects?',
      shortTitle: 'Human Subjects',
      ref: '45 CFR 46.102(e)',
      desc: 'Living individual about whom an investigator obtains data or biospecimens',
      ai: 'Whether the activity involves living individuals about whom an investigator obtains data through intervention or interaction, or identifiable private information per 45 CFR 46.102(e).',
      critical: true,
      category: 'definition',
      icon: HumanSubjectsIcon,
      referenceSources: ['45CFR', 'Belmont'],
      practicalQuestions: [
        'Will your AI model learn from or be trained on patient data?',
        'Could the AI output be traced back to specific individuals?',
        'Are you using data from living individuals?'
      ]
    },
    {
      id: 2,
      title: 'Is it Research?',
      shortTitle: 'Research',
      ref: '45 CFR 46.102(l)',
      desc: 'Systematic investigation designed to develop or contribute to generalizable knowledge',
      ai: 'Whether the activity constitutes a systematic investigation designed to develop or contribute to generalizable knowledge per 45 CFR 46.102(l), including determination of whether machine learning model training constitutes research.',
      critical: true,
      category: 'definition',
      icon: ResearchIcon,
      referenceSources: ['45CFR', 'Belmont'],
      practicalQuestions: [
        'Are you testing hypotheses about AI performance?',
        'Will findings be published or shared publicly?',
        'Is this designed to develop generalizable knowledge?'
      ]
    },
    {
      id: 3,
      title: 'Risks Minimized & Reasonable?',
      shortTitle: 'Risk Assessment',
      ref: '45 CFR 46.111(a)',
      desc: 'Risks to subjects are minimized and reasonable in relation to anticipated benefits',
      ai: 'Assessment per 45 CFR 46.111(a)(1-2) that risks are minimized using procedures consistent with sound research design and do not unnecessarily expose subjects to risk, and that risks are reasonable in relation to anticipated benefits and importance of knowledge expected.',
      critical: false,
      category: 'risk',
      icon: RiskIcon,
      referenceSources: ['45CFR', 'Belmont', 'ISO'],
      practicalQuestions: [
        'What happens if the AI is wrong - what\'s the worst case scenario?',
        'How will you know if the AI starts making more errors over time?',
        'Is there a human backup when the AI is uncertain?'
      ]
    },
    {
      id: 4,
      title: 'Equitable Subject Selection?',
      shortTitle: 'Equity',
      ref: '45 CFR 46.111(3)',
      desc: 'Selection of subjects is equitable and representative of the population',
      ai: 'Equitable selection per 45 CFR 46.111(a)(3) ensuring no unjust exclusion based on race, gender, or economic status, with particular attention to fair distribution of research burdens and benefits across populations as required by the Belmont principle of justice.',
      critical: false,
      category: 'subject',
      icon: EquityIcon,
      referenceSources: ['45CFR', 'Belmont', '32CFR'],
      practicalQuestions: [
        'Does your training data include diverse patient populations?',
        'Have you tested if the AI works equally well for all groups?',
        'Could the AI worsen existing healthcare disparities?'
      ]
    },
    {
      id: 5,
      title: 'Informed Consent Obtained?',
      shortTitle: 'Consent',
      ref: '45 CFR 46.111(4)',
      desc: 'Informed consent will be sought from each subject and appropriately documented',
      ai: 'Informed consent documentation per 45 CFR 46.116 containing all required elements including reasonably foreseeable risks (§46.116(b)(2)), procedures to be followed (§46.116(b)(1)), and for AI/ML research, disclosure of data retention per §46.116(b)(5).',
      critical: false,
      category: 'subject',
      icon: ConsentIcon,
      referenceSources: ['45CFR', 'Belmont', '21CFR', 'Cures'],
      practicalQuestions: [
        'How will you explain AI involvement in terms patients understand?',
        'Will patients know when AI is making recommendations about their care?',
        'Can patients opt out of AI analysis while still receiving care?'
      ]
    },
    {
      id: 6,
      title: 'Data Monitoring Plan?',
      shortTitle: 'Monitoring',
      ref: '45 CFR 46.111(6)',
      desc: 'Adequate provisions for monitoring data collection to ensure subject safety',
      ai: 'Adequate provisions for monitoring data collection per 45 CFR 46.111(a)(6) to ensure safety, including periodic review of model performance metrics, adverse event reporting per 21 CFR 812.150, and continuing review requirements under 45 CFR 46.109(e).',
      critical: false,
      category: 'risk',
      icon: MonitorIcon,
      referenceSources: ['45CFR', 'Policy', '21CFR', 'ISO', 'Cures'],
      practicalQuestions: [
        'How often will you check if the AI is still accurate?',
        'What triggers would make you stop using the AI?',
        'Who is responsible for catching AI errors?'
      ]
    },
    {
      id: 7,
      title: 'Privacy & Confidentiality?',
      shortTitle: 'Privacy',
      ref: '45 CFR 46.111(7)',
      desc: 'Adequate provisions to protect privacy and maintain data confidentiality',
      ai: 'Adequate provisions per 45 CFR 46.111(a)(7) to protect privacy and maintain confidentiality, including compliance with HIPAA Privacy Rule (45 CFR 164), implementation of appropriate administrative, physical, and technical safeguards per 45 CFR 164.308-310.',
      critical: false,
      category: 'subject',
      icon: PrivacyIcon,
      referenceSources: ['45CFR', 'Policy'],
      practicalQuestions: [
        'Where will the AI model and patient data be stored?',
        'Who can access the AI predictions and training data?',
        'Could the AI inadvertently memorize patient information?'
      ]
    },
    {
      id: 8,
      title: 'Vulnerable Populations?',
      shortTitle: 'Vulnerable Groups',
      ref: '45 CFR 46.111(b)',
      desc: 'Additional safeguards when vulnerable subjects are involved',
      ai: 'Additional safeguards per 45 CFR 46.111(b) when vulnerable subjects are involved, including protections under Subparts B (pregnant women), C (prisoners), and D (children), with consideration of diminished autonomy and requirements for assent/permission as applicable.',
      critical: false,
      category: 'subject',
      icon: VulnerableIcon,
      referenceSources: ['45CFR', 'Belmont', '32CFR'],
      practicalQuestions: [
        'Was the AI trained on data from vulnerable populations?',
        'Have you tested for bias against protected groups?',
        'Are there extra safeguards for pediatric or elderly patients?'
      ]
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All Criteria', count: 9 },
    { id: 'definition', label: 'Research Definition', count: 3 },
    { id: 'risk', label: 'Risk Management', count: 2 },
    { id: 'subject', label: 'Subject Protection', count: 4 }
  ];
  
  const selectedData = criteria[selectedCriterion];
  
  // Calculate positions for circular layout
  const getNodePosition = (index, total) => {
    const angle = (index * 360 / total) - 90; // Start from top
    const radius = 145; // Adjusted to prevent overlap
    const radian = (angle * Math.PI) / 180;
    const x = 190 + radius * Math.cos(radian); // Center at 190,190
    const y = 190 + radius * Math.sin(radian);
    return { x, y };
  };
  
  return (
    <SlideWrapper 
      slideNumber={5}
      slideTitle="9 Criteria, 1 Review"
      totalSlides={9}
      background="radial-gradient(ellipse at center, #0066CC 0%, #003B71 70%, #001833 100%)"
    >
      <ContentWrapper>
        <CategoryNav>
          {categories.map(cat => (
            <CategoryTab
              key={cat.id}
              $active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label} ({cat.count})
            </CategoryTab>
          ))}
        </CategoryNav>
        
        <MainContent>
          <LeftContainer>
            <CriteriaWheel>
              <WheelContainer>
                {criteria.map((criterion, idx) => {
                  const pos = getNodePosition(idx, 9);
                  const Icon = criterion.icon;
                  const isFiltered = category !== 'all' && criterion.category !== category;
                  return (
                    <CriterionNode
                      key={idx}
                      $critical={criterion.critical}
                      $selected={selectedCriterion === idx}
                      $visible={showAll}
                      $dimmed={isFiltered}
                      style={{ 
                        left: `${pos.x}px`, 
                        top: `${pos.y}px`,
                        transitionDelay: `${idx * 50}ms`
                      }}
                      onClick={() => !isFiltered && setSelectedCriterion(idx)}
                      tabIndex={isFiltered ? -1 : 0}
                      aria-label={`${criterion.shortTitle}${criterion.critical ? ' (Critical)' : ''}${isFiltered ? ' (Filtered)' : ''}`}
                    >
                      <Icon />
                    </CriterionNode>
                  );
                })}
                <CenterHub>
                  9 Review<br/>Criteria
                </CenterHub>
              </WheelContainer>
            </CriteriaWheel>
          </LeftContainer>
          
          <DetailPanel $show={selectedData}>
            <DetailHeader>
              <DetailIcon $critical={selectedData.critical}>
                {React.createElement(selectedData.icon)}
              </DetailIcon>
              <DetailTitleSection>
                <DetailTitle $critical={selectedData.critical}>
                  {selectedData.title}
                </DetailTitle>
                <RegBadge>
                  <RegTag $highlight={selectedData.referenceSources && (selectedData.referenceSources.includes('45CFR') || selectedData.referenceSources.includes('21CFR'))}>{selectedData.ref}</RegTag>
                  {selectedData.referenceSources && selectedData.referenceSources.includes('Belmont') && 
                    <RegTag $highlight={true}>Belmont</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('Policy') && 
                    <RegTag $highlight={true}>Policy</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('21CFR') && !selectedData.ref.includes('21 CFR') && 
                    <RegTag $highlight={true}>21 CFR</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('32CFR') && 
                    <RegTag $highlight={true}>32 CFR 219</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('FDA') && 
                    <RegTag $highlight={true}>FDA Guidance</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('ISO') && 
                    <RegTag $highlight={true}>ISO Standards</RegTag>
                  }
                  {selectedData.referenceSources && selectedData.referenceSources.includes('Cures') && 
                    <RegTag $highlight={true}>Cures Act</RegTag>
                  }
                </RegBadge>
              </DetailTitleSection>
            </DetailHeader>
            
            <DetailContent>
              <DetailDescription $critical={selectedData.critical}>
                {selectedData.desc}
              </DetailDescription>
              
              <AIInsightBox>
                <AIInsightText>
                  {selectedData.ai}
                </AIInsightText>
              </AIInsightBox>
            </DetailContent>
          </DetailPanel>
        </MainContent>
        
        <RegulatoryFoundation $show={showAll}>
          <FoundationText 
            $highlightBelmont={selectedData.referenceSources && selectedData.referenceSources.includes('Belmont')}
            $highlightPolicy={selectedData.referenceSources && selectedData.referenceSources.includes('Policy')}
          >
            Based on: <span className="belmont">Belmont Report</span> • <span className="policy">Institutional Policy</span>
          </FoundationText>
          <FoundationRefs
            $highlight21CFR={selectedData.referenceSources && selectedData.referenceSources.includes('21CFR')}
            $highlight45CFR={selectedData.referenceSources && selectedData.referenceSources.includes('45CFR')}
            $highlightFDA={selectedData.referenceSources && selectedData.referenceSources.includes('FDA')}
            $highlightISO={selectedData.referenceSources && selectedData.referenceSources.includes('ISO')}
            $highlightCures={selectedData.referenceSources && selectedData.referenceSources.includes('Cures')}
          >
            <span className="cfr21">21 CFR 50, 56, 812, 820</span>
            <span className="separator">•</span>
            <span className="cfr45">45 CFR 46</span>
            <span className="separator">•</span>
            <span className="fda">FDA SaMD Guidance</span>
            <span className="separator">•</span>
            <span className="iso">ISO 13485, 14971</span>
            <span className="separator">•</span>
            <span className="cures">21st Century Cures Act</span>
          </FoundationRefs>
        </RegulatoryFoundation>
      </ContentWrapper>
      
      <InteractionHint>
        <kbd>Tab</kbd> Navigate criteria <span className="separator">•</span> <kbd>1-8</kbd> Jump to criterion <span className="separator">•</span> <kbd>Esc</kbd> Clear filter <span className="separator">•</span> <kbd>R</kbd> Reset <span className="separator">•</span> Click tabs to filter categories
      </InteractionHint>
      
      <Notes>
        Interactive IRB Review Criteria visualization with category filtering:
        
        - Research Definition: Human subjects determination and SaMD classification
        - Risk Management: Risk-benefit analysis and monitoring plans
        - Subject Protection: Consent, privacy, equity, and vulnerable populations
        
        Critical criteria (red) are foundational requirements.
        Standard criteria (green) ensure comprehensive protection.
        
        Navigate with arrow keys, number keys (1-8), or click directly on nodes.
        Filter by category using the top navigation tabs.
      </Notes>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
    </SlideWrapper>
  );
};

export default Slide05_IRBCriteria;