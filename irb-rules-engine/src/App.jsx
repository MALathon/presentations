import React, { useState } from 'react';
import styled from 'styled-components';
import CharacteristicManager from './components/CharacteristicManager';
import GraphVisualizer from './components/GraphVisualizer';
import ScoringRules from './components/ScoringRules';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.3);
  padding: 20px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(90deg, #4AE2C0, #6BFFE9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  background: ${props => props.$active ? 'rgba(74, 226, 192, 0.2)' : 'transparent'};
  border: 1px solid ${props => props.$active ? '#4AE2C0' : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.$active ? '#4AE2C0' : 'white'};
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 226, 192, 0.15);
    border-color: #4AE2C0;
    transform: translateY(-1px);
  }
`;

const Content = styled.main`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const InfoBanner = styled.div`
  background: rgba(74, 226, 192, 0.1);
  border: 1px solid rgba(74, 226, 192, 0.3);
  border-radius: 8px;
  padding: 12px 20px;
  margin: 20px 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;

  .icon {
    font-size: 20px;
  }
`;

function App() {
  const [activeView, setActiveView] = useState('characteristics');

  return (
    <AppContainer>
      <Header>
        <div>
          <Title>IRB Rules Engine</Title>
          <Subtitle>Visual rule builder for protocol assessment</Subtitle>
        </div>
        <Nav>
          <NavButton
            $active={activeView === 'characteristics'}
            onClick={() => setActiveView('characteristics')}
          >
            📋 Characteristics & Controls
          </NavButton>
          <NavButton
            $active={activeView === 'scoring'}
            onClick={() => setActiveView('scoring')}
          >
            🎯 Scoring Rules
          </NavButton>
          <NavButton
            $active={activeView === 'graph'}
            onClick={() => setActiveView('graph')}
          >
            🕸️ Graph View
          </NavButton>
        </Nav>
      </Header>

      <InfoBanner>
        <span className="icon">💡</span>
        <div>
          <strong>Getting Started:</strong> Define characteristics with their controls, then create scoring rules to determine when they're recommended.
          All changes are saved locally in your browser.
        </div>
      </InfoBanner>

      <Content>
        {activeView === 'characteristics' && <CharacteristicManager />}
        {activeView === 'scoring' && <ScoringRules />}
        {activeView === 'graph' && <GraphVisualizer />}
      </Content>
    </AppContainer>
  );
}

export default App;
