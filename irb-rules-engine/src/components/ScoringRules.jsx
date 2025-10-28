import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import db from '../db/rulesDB';

const Container = styled.div`
  padding: 20px 40px;
  height: 100%;
  overflow-y: auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h2`
  margin: 0 0 10px 0;
  font-size: 24px;
`;

const Description = styled.p`
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Th = styled.th`
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 15px;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Points = styled.span`
  color: ${props => props.$value > 0 ? '#4AE2C0' : props.$value < 0 ? '#F44336' : 'rgba(255, 255, 255, 0.5)'};
  font-weight: 600;
`;

const Badge = styled.span`
  background: rgba(74, 226, 192, 0.2);
  border: 1px solid rgba(74, 226, 192, 0.4);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #4AE2C0, #3cc8a8);
  color: #1e3c72;
  border: 1px solid #4AE2C0;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: rgba(255, 255, 255, 0.5);

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

function ScoringRules() {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    loadRules();
  }, []);

  async function loadRules() {
    const allRules = await db.scoringRules.toArray();
    setRules(allRules);
  }

  return (
    <Container>
      <Header>
        <Title>Scoring Rules</Title>
        <Description>
          Define when characteristics should be recommended based on technology type,
          research phase, and other contextual factors. Higher scores = higher priority.
        </Description>
      </Header>

      {rules.length > 0 ? (
        <>
          <Button onClick={() => alert('Add Rule UI coming soon!')}>
            + Add Scoring Rule
          </Button>

          <div style={{ marginTop: '20px' }}>
            <Table>
              <thead>
                <tr>
                  <Th>Tech Type</Th>
                  <Th>Phase</Th>
                  <Th>Characteristic</Th>
                  <Th>Points</Th>
                  <Th>Reason</Th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule, idx) => (
                  <tr key={idx}>
                    <Td>
                      <Badge>{rule.techType.toUpperCase()}</Badge>
                    </Td>
                    <Td style={{ textTransform: 'capitalize' }}>{rule.phase}</Td>
                    <Td>{rule.characteristicKey}</Td>
                    <Td>
                      <Points $value={rule.points}>
                        {rule.points > 0 ? '+' : ''}{rule.points}
                      </Points>
                    </Td>
                    <Td style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
                      {rule.reason}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      ) : (
        <EmptyState>
          <h3>No scoring rules yet</h3>
          <p>Scoring rules determine when characteristics are recommended to users.</p>
          <p style={{ marginTop: '20px' }}>
            <Button onClick={() => alert('Add Rule UI coming soon!')}>
              + Add Your First Rule
            </Button>
          </p>
        </EmptyState>
      )}
    </Container>
  );
}

export default ScoringRules;
