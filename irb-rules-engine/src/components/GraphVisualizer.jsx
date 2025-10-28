import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import db from '../db/rulesDB';

// Register dagre layout
cytoscape.use(dagre);

const Container = styled.div`
  display: flex;
  height: 100%;
  gap: 20px;
  padding: 20px 40px;
`;

const GraphContainer = styled.div`
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
`;

const Sidebar = styled.div`
  width: 300px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  overflow-y: auto;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
`;

const InfoSection = styled.div`
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 5px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: white;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
`;

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.$color};
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const EmptyState = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  max-width: 400px;

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

function GraphVisualizer() {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [stats, setStats] = useState({ chars: 0, rules: 0, controls: 0 });

  useEffect(() => {
    loadGraphData();
  }, []);

  async function loadGraphData() {
    const characteristics = await db.characteristics.toArray();
    const scoringRules = await db.scoringRules.toArray();
    const controls = await db.controls.toArray();

    setStats({
      chars: characteristics.length,
      rules: scoringRules.length,
      controls: controls.length
    });

    if (characteristics.length === 0) return;

    const nodes = [];
    const edges = [];

    // Add characteristic nodes
    characteristics.forEach(char => {
      nodes.push({
        data: {
          id: `char-${char.id}`,
          label: char.name,
          type: 'characteristic',
          info: char
        }
      });
    });

    // Add control nodes and edges
    controls.forEach((control, idx) => {
      const controlId = `control-${idx}`;
      nodes.push({
        data: {
          id: controlId,
          label: `${control.riskLevel}: ${control.description.substring(0, 30)}...`,
          type: 'control',
          riskLevel: control.riskLevel,
          info: control
        }
      });

      edges.push({
        data: {
          source: `char-${control.characteristicId}`,
          target: controlId,
          label: control.riskLevel
        }
      });
    });

    // Add scoring rule nodes
    scoringRules.forEach((rule, idx) => {
      const ruleId = `rule-${idx}`;
      nodes.push({
        data: {
          id: ruleId,
          label: `${rule.techType}/${rule.phase}\n+${rule.points}`,
          type: 'rule',
          info: rule
        }
      });

      // Try to connect to characteristic
      const char = characteristics.find(c => c.key === rule.characteristicKey);
      if (char) {
        edges.push({
          data: {
            source: ruleId,
            target: `char-${char.id}`,
            label: `+${rule.points}`
          }
        });
      }
    });

    renderGraph(nodes, edges);
  }

  function renderGraph(nodes, edges) {
    if (!containerRef.current) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: { nodes, edges },
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '12px',
            'color': '#ffffff',
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'background-color': '#4AE2C0',
            'border-width': 2,
            'border-color': '#ffffff',
            'width': 80,
            'height': 80
          }
        },
        {
          selector: 'node[type="characteristic"]',
          style: {
            'background-color': '#4AE2C0',
            'shape': 'round-rectangle'
          }
        },
        {
          selector: 'node[type="control"]',
          style: {
            'background-color': '#FFC107',
            'width': 60,
            'height': 60,
            'font-size': '10px'
          }
        },
        {
          selector: 'node[type="control"][riskLevel="low"]',
          style: {
            'background-color': '#4CAF50'
          }
        },
        {
          selector: 'node[type="control"][riskLevel="high"]',
          style: {
            'background-color': '#F44336'
          }
        },
        {
          selector: 'node[type="rule"]',
          style: {
            'background-color': '#2196F3',
            'shape': 'diamond',
            'width': 70,
            'height': 70
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': 'rgba(255, 255, 255, 0.3)',
            'target-arrow-color': 'rgba(255, 255, 255, 0.3)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '10px',
            'color': 'rgba(255, 255, 255, 0.7)',
            'text-background-color': '#1e3c72',
            'text-background-opacity': 0.8,
            'text-background-padding': '3px'
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#FFD700'
          }
        }
      ],
      layout: {
        name: 'dagre',
        rankDir: 'TB',
        nodeSep: 50,
        rankSep: 100
      }
    });

    cyRef.current.on('tap', 'node', (evt) => {
      const node = evt.target;
      setSelectedNode(node.data());
    });

    cyRef.current.on('tap', (evt) => {
      if (evt.target === cyRef.current) {
        setSelectedNode(null);
      }
    });
  }

  return (
    <Container>
      <GraphContainer ref={containerRef}>
        {stats.chars === 0 && (
          <EmptyState>
            <h3>No data to visualize yet</h3>
            <p>Add some characteristics and controls in the Characteristics tab to see the graph.</p>
          </EmptyState>
        )}
      </GraphContainer>

      <Sidebar>
        <SidebarTitle>Graph Overview</SidebarTitle>

        <InfoSection>
          <InfoLabel>Statistics</InfoLabel>
          <InfoValue>{stats.chars} Characteristics</InfoValue>
          <InfoValue>{stats.rules} Scoring Rules</InfoValue>
          <InfoValue>{stats.controls} Controls</InfoValue>
        </InfoSection>

        <InfoSection>
          <InfoLabel>Legend</InfoLabel>
          <Legend>
            <LegendItem>
              <LegendColor $color="#4AE2C0" />
              <span>Characteristics</span>
            </LegendItem>
            <LegendItem>
              <LegendColor $color="#4CAF50" />
              <span>Low Risk Controls</span>
            </LegendItem>
            <LegendItem>
              <LegendColor $color="#FFC107" />
              <span>Medium Risk Controls</span>
            </LegendItem>
            <LegendItem>
              <LegendColor $color="#F44336" />
              <span>High Risk Controls</span>
            </LegendItem>
            <LegendItem>
              <LegendColor $color="#2196F3" />
              <span>Scoring Rules</span>
            </LegendItem>
          </Legend>
        </InfoSection>

        {selectedNode && (
          <InfoSection>
            <InfoLabel>Selected: {selectedNode.type}</InfoLabel>
            <InfoValue style={{ fontSize: '13px', lineHeight: '1.6' }}>
              {JSON.stringify(selectedNode.info, null, 2)}
            </InfoValue>
          </InfoSection>
        )}

        {!selectedNode && (
          <InfoSection>
            <InfoLabel>Tip</InfoLabel>
            <InfoValue style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Click on a node to see its details
            </InfoValue>
          </InfoSection>
        )}
      </Sidebar>
    </Container>
  );
}

export default GraphVisualizer;
