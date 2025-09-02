import React, { useEffect, useRef } from 'react';
import { Notes } from 'spectacle';
import styled, { keyframes } from 'styled-components';
import SlideWrapper from './components/SlideWrapper';
import InteractionHint from './components/InteractionHint';

// Simple, elegant animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const subtleGlow = keyframes`
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
`;

// Neural network canvas - fixed implementation
const NeuralCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
  pointer-events: none;
  z-index: 1;
`;

// Single gradient background for depth
const GradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at top right,
    rgba(0, 102, 204, 0.15) 0%,
    transparent 50%
  ),
  radial-gradient(
    ellipse at bottom left,
    rgba(0, 163, 224, 0.1) 0%,
    transparent 50%
  );
  z-index: 0;
`;

// Content wrapper - no glass morphism for better readability
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  padding: 60px;
`;

// Title with solid color for maximum readability
const Title = styled.h1`
  font-size: 64px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 40px 0;
  padding: 0 80px;
  color: #FFFFFF;
  animation: ${fadeInUp} 1s ease-out;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  max-width: 900px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #00A3E0;
    animation: ${fadeInUp} 1.2s ease-out;
  }
`;

// Subtitle with high contrast
const Subtitle = styled.h2`
  font-size: 48px;
  color: #00A3E0;
  font-weight: 300;
  margin: 0 0 40px 0;
  padding: 0 60px;
  animation: ${fadeInUp} 1.2s ease-out;
  letter-spacing: 1px;
`;

// Tagline - simple and readable
const Tagline = styled.p`
  font-size: 24px;
  color: #FFFFFF;
  font-style: italic;
  margin: 0 0 60px 0;
  padding: 0 30px;
  animation: ${fadeInUp} 1.4s ease-out;
  opacity: 0.9;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

// Presenter info - clean design without glass effect
const PresenterCard = styled.div`
  animation: ${fadeInUp} 1.6s ease-out;
  padding: 20px 35px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 163, 224, 0.3);
  border-radius: 10px;
  position: relative;
`;

const AuthorsLabel = styled.p`
  font-size: 16px;
  color: #00A3E0;
  margin: 0 0 15px 0;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.9;
`;

const PresentersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const PresenterName = styled.h3`
  font-size: 30px;
  color: ${props => props.$isSpeaker ? '#FFD700' : '#FFFFFF'};
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
`;

const PresenterTitle = styled.p`
  font-size: 20px;
  color: #00A3E0;
  margin: 0;
  font-weight: 300;
`;

// Organization branding
const OrgLogo = styled.div`
  position: absolute;
  bottom: 50px;
  right: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  animation: ${fadeInUp} 1.8s ease-out;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
`;

const LogoMark = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0066CC, #00A3E0);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  color: white;
  opacity: 0.8;
`;

const LogoText = styled.div`
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const LogoTagline = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

// Date/event info
const EventInfo = styled.div`
  position: absolute;
  bottom: 50px;
  left: 60px;
  animation: ${fadeInUp} 1.8s ease-out;
`;

const EventDate = styled.div`
  color: #FFFFFF;
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 5px;
`;

const EventLocation = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  font-weight: 300;
`;

// Subtle decoration with transient props
const AccentLine = styled.div`
  position: absolute;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  width: ${props => props.$width}px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    ${props => props.$color || '#00A3E0'},
    transparent
  );
  opacity: ${props => props.$opacity || 0.3};
  animation: ${subtleGlow} 4s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
`;

const Slide01_Title = () => {
  const canvasRef = useRef(null);
  
  // Simplified neural network animation - fixed implementation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set initial canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    
    // Neural network nodes - fewer for better performance
    const nodes = [];
    const nodeCount = 12;
    
    // Initialize nodes with fixed positions for stability
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 3,
        connections: []
      });
    }
    
    let animationId;
    
    // Simplified animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) {
          node.vx *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
        }
        if (node.y <= 0 || node.y >= canvas.height) {
          node.vy *= -1;
          node.y = Math.max(0, Math.min(canvas.height, node.y));
        }
      });
      
      // Draw connections
      ctx.strokeStyle = 'rgba(0, 163, 224, 0.15)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 250) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.globalAlpha = 1 - (distance / 250);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      // Draw nodes
      ctx.fillStyle = '#00A3E0';
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);
  
  return (
    <SlideWrapper 
      slideNumber={1}
      slideTitle=""
      totalSlides={20}
      showHeader={false}
      showFooter={false}
    >
      {/* Layer 1: Gradient background */}
      <GradientBackground />
      
      {/* Layer 2: Neural network */}
      <NeuralCanvas ref={canvasRef} />
      
      {/* Layer 3: Main content - highest z-index for readability */}
      <ContentWrapper>
        <Title>
          Ethical and Practical Oversight of AI Research
        </Title>
        
        <Tagline>
          Adapting existing frameworks for emerging technology
        </Tagline>
        
        <PresenterCard>
          <AuthorsLabel>Authors</AuthorsLabel>
          <PresentersWrapper>
            <PresenterName $isSpeaker={true}>Mark Lifson, PhD</PresenterName>
            <PresenterName $isSpeaker={false}>Tamiko Eto</PresenterName>
          </PresentersWrapper>
        </PresenterCard>
      </ContentWrapper>
      
      {/* Subtle accent lines - using transient props */}
      <AccentLine $top={10} $left={5} $width={100} $opacity={0.2} $delay={0} />
      <AccentLine $top={90} $left={85} $width={100} $opacity={0.2} $delay={1} />
      
      {/* Organization branding */}
      <OrgLogo>
        <LogoContainer>
          <LogoMark>AI</LogoMark>
          <LogoText>RESEARCH OVERSIGHT FRAMEWORK</LogoText>
        </LogoContainer>
      </OrgLogo>
      
      {/* Event information */}
      <EventInfo>
        <EventDate>2025</EventDate>
        <EventLocation>Research Presentation</EventLocation>
      </EventInfo>
      
      <Notes>
        Good morning everyone, and thank you for joining me today for this discussion on AI research oversight. 
        
        The title of today's presentation might suggest I have all the answers to this complex challenge - I don't. 
        What I hope to offer instead is a practical framework developed from our experience at Mayo Clinic, 
        combined with my background in both FDA-regulated device development and clinical AI implementation.
        
        Over the next 30 minutes, we'll explore three key questions that can help streamline AI research oversight 
        without requiring IRB reviewers to become AI experts themselves. My goal is to provide you with actionable 
        tools that build on existing processes rather than creating entirely new bureaucratic hurdles.
        
        [1.5 minutes - Establish credibility and set clear expectations for practical takeaways]
      </Notes>
      
      <InteractionHint>
        <kbd>←</kbd> <kbd>→</kbd> Navigate
      </InteractionHint>
    </SlideWrapper>
  );
};

export default Slide01_Title;