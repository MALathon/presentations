import React, { Children, cloneElement, forwardRef } from 'react';
import { Slide } from 'spectacle';
import styled from 'styled-components';

// Create a clean wrapper component that doesn't pass problematic props
const CleanSlide = forwardRef((props, ref) => {
  // Filter out only the problematic props
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
    ...cleanProps
  } = props;

  return <Slide ref={ref} {...cleanProps} />;
});

CleanSlide.displayName = 'CleanSlide';

// Professional slide container with gradient background
const StyledSlide = styled(CleanSlide)`
  background: ${props => props.$background || 'linear-gradient(135deg, #003B71 0%, #0066CC 100%)'};
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
`;

// Header bar with slide number and title
const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 25, 51, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(74, 226, 192, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 1000;
  pointer-events: none;
`;

// Footer bar with presenter info and date
const FooterBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(0, 25, 51, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(74, 226, 192, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  z-index: 900;
  pointer-events: none;
`;

// Slide number badge
const SlideNumber = styled.div`
  background: rgba(74, 226, 192, 0.15);
  border: 1px solid rgba(74, 226, 192, 0.3);
  border-radius: 24px;
  padding: 6px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #4AE2C0;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
`;

// Slide title in header
const SlideTitle = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.5px;
  flex: 1;
  text-align: center;
  text-transform: uppercase;
`;

// Organization logo placeholder
const OrgLogo = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #4AE2C0;
  letter-spacing: 2px;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  text-transform: uppercase;
`;

// Footer text styling
const FooterText = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

// Navigation hint in footer center
const NavigationHint = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;

  kbd {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 600;
    display: inline-block;
    min-width: 20px;
    text-align: center;
  }

  .separator {
    opacity: 0.4;
    margin: 0 2px;
  }
`;

// Main content area with proper padding
const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 60px 70px 60px; // Account for header and footer
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
`;

// Progress indicator dots
const ProgressDots = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
`;

/**
 * Professional slide wrapper component
 * Adds consistent header and footer to all slides
 */
const SlideWrapper = ({
  children,
  slideNumber,
  totalSlides = 9,
  slideTitle = '',
  showHeader = true,
  showFooter = true,
  background,
  navigationHint = null, // Optional custom navigation hint for specific slides
  // These props should not be passed to Slide component
  textAlign,
  padding,
  margin,
  // Filter out any other Spectacle-specific props that might cause warnings
  backgroundColor,
  backgroundImage,
  backgroundOpacity,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  scaleRatio,
  transition,
  template,
  ...props
}) => {
  // Don't show header/footer on title slide (slide 1)
  const isFirstSlide = slideNumber === 1;
  const actualShowHeader = showHeader && !isFirstSlide;
  const actualShowFooter = showFooter && !isFirstSlide;

  // Extract InteractionHint from children
  let interactionHintContent = null;
  let filteredChildren = children;

  if (children) {
    const childArray = Children.toArray(children);

    const interactionHintChild = childArray.find(
      child => {
        // Check for InteractionHint component by displayName or name
        const isInteractionHint =
          child?.type?.displayName === 'InteractionHint' ||
          child?.type?.name === 'InteractionHint';
        return isInteractionHint;
      }
    );

    if (interactionHintChild) {
      interactionHintContent = interactionHintChild.props.children;
      filteredChildren = childArray.filter(
        child => {
          const isInteractionHint =
            child?.type?.displayName === 'InteractionHint' ||
            child?.type?.name === 'InteractionHint';
          return !isInteractionHint;
        }
      );
    }
  }

  // Default navigation if no InteractionHint provided
  const defaultNavigation = <><kbd>←</kbd> <kbd>→</kbd> Navigate</>;
  const navigationContent = interactionHintContent || navigationHint || defaultNavigation;

  return (
    <StyledSlide $background={background}>
      {actualShowHeader && (
        <HeaderBar>
          <SlideNumber>
            <span>{slideNumber}</span>
            {totalSlides && <span style={{ opacity: 0.6, fontSize: '12px' }}>/ {totalSlides}</span>}
          </SlideNumber>
          {slideTitle && <SlideTitle>{slideTitle}</SlideTitle>}
          <OrgLogo></OrgLogo>
        </HeaderBar>
      )}

      <ContentArea>
        {filteredChildren}
      </ContentArea>

      {actualShowFooter && (
        <FooterBar>
          <FooterText>Mark Lifson, PhD</FooterText>
          <NavigationHint>
            {navigationContent}
          </NavigationHint>
          <FooterText>2025 - Core Training Workshop</FooterText>
        </FooterBar>
      )}
    </StyledSlide>
  );
};

export default SlideWrapper;
