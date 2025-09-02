import React, { Component } from 'react';
import { Slide, Heading, Text, FlexBox, Box } from 'spectacle';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      performanceMode: 'HIGH'
    };
    this.retryTimeoutId = null;
  }
  
  static getDerivedStateFromError(error) {
    // Update state to trigger fallback UI
    return { 
      hasError: true,
      // Automatically downgrade performance on error
      performanceMode: 'LOW'
    };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error for monitoring
    console.error('Slide error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Auto-retry after 3 seconds (max 3 attempts)
    if (this.state.retryCount < 3) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 3000);
    }
    
    // Report to error tracking service (if configured)
    if (window.errorReporter) {
      window.errorReporter.logError(error, {
        componentStack: errorInfo.componentStack,
        slideNumber: this.props.slideNumber,
        retryCount: this.state.retryCount
      });
    }
  }
  
  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }
  
  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      performanceMode: 'MEDIUM' // Try with reduced performance
    }));
  }
  
  handleSkip = () => {
    // Dispatch event to skip to next slide
    window.dispatchEvent(new CustomEvent('skipSlide', {
      detail: { slideNumber: this.props.slideNumber }
    }));
  }
  
  render() {
    if (this.state.hasError) {
      // Fallback UI - Simple, accessible error slide
      return (
        <Slide backgroundColor="#f8f9fa">
          <FlexBox height="100%" flexDirection="column" justifyContent="center" alignItems="center">
            <Box style={{ textAlign: "center", maxWidth: "600px" }}>
              <AlertTriangle size={64} color="#E74C3C" />
              
              <Heading fontSize="h2" color="#003B71" style={{ margin: "32px 0 16px" }}>
                Slide Temporarily Unavailable
              </Heading>
              
              <Text fontSize="text" color="#666" style={{ marginBottom: "32px" }}>
                We encountered an issue loading this slide. 
                {this.state.retryCount < 3 && " Retrying automatically..."}
              </Text>
              
              <FlexBox justifyContent="center" gap={16}>
                <button
                  onClick={this.handleRetry}
                  style={{
                    padding: '12px 24px',
                    background: '#003B71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  aria-label="Retry loading slide"
                >
                  <RefreshCw size={20} />
                  Retry Now
                </button>
                
                <button
                  onClick={this.handleSkip}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    color: '#003B71',
                    border: '2px solid #003B71',
                    borderRadius: '4px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                  aria-label="Skip to next slide"
                >
                  Skip Slide
                </button>
              </FlexBox>
              
              {/* Show simplified content if available */}
              {this.props.fallbackContent && (
                <Box marginTop="48px" padding="24px" backgroundColor="#fff" borderRadius="8px">
                  <Heading fontSize="h4" color="#003B71">
                    Slide Content (Simplified)
                  </Heading>
                  <Text fontSize="text" color="#333" marginTop="16px">
                    {this.props.fallbackContent}
                  </Text>
                </Box>
              )}
              
              {/* Development mode: show error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Box 
                  style={{
                    marginTop: "32px",
                    padding: "16px",
                    backgroundColor: "#fee",
                    borderRadius: "4px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontFamily: "monospace"
                  }}
                >
                  <strong>Error:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong>
                  <pre style={{ 
                    overflow: 'auto', 
                    maxHeight: '200px',
                    fontSize: '12px',
                    marginTop: '8px'
                  }}>
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </Box>
              )}
              
              <Text fontSize="small" color="#999" marginTop="32px">
                Retry attempt {this.state.retryCount} of 3
              </Text>
            </Box>
          </FlexBox>
        </Slide>
      );
    }
    
    // Pass performance mode to children
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { 
        performanceMode: this.state.performanceMode 
      })
    );
  }
}

export default ErrorBoundary;