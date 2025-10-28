import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import db, { NodeType, createNode, getNodesByType, deleteNodeAndEdges } from '../db/rulesDB';

const Container = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 100%;
  gap: 20px;
  padding: 20px 40px;
`;

const Sidebar = styled.aside`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TechCard = styled.div`
  background: ${props => props.$selected ? 'rgba(74, 226, 192, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.$selected ? '#4AE2C0' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(74, 226, 192, 0.1);
    border-color: #4AE2C0;
    transform: translateX(5px);
  }
`;

const TechIcon = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

const TechName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const EditorPanel = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4AE2C0;
    box-shadow: 0 0 0 3px rgba(74, 226, 192, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  min-height: 100px;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4AE2C0;
    box-shadow: 0 0 0 3px rgba(74, 226, 192, 0.1);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

const Button = styled.button`
  background: ${props => {
    if (props.$variant === 'primary') return 'linear-gradient(90deg, #4AE2C0, #3cc8a8)';
    if (props.$variant === 'danger') return 'rgba(244, 67, 54, 0.2)';
    return 'rgba(255, 255, 255, 0.1)';
  }};
  color: ${props => props.$variant === 'primary' ? '#1e3c72' : 'white'};
  border: 1px solid ${props => {
    if (props.$variant === 'primary') return '#4AE2C0';
    if (props.$variant === 'danger') return 'rgba(244, 67, 54, 0.5)';
    return 'rgba(255, 255, 255, 0.3)';
  }};
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const ActionBar = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  color: rgba(255, 255, 255, 0.5);

  h2 {
    font-size: 24px;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.7);
  }

  p {
    font-size: 14px;
  }
`;

function TechnologyTypesManager() {
  const [techTypes, setTechTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({
    key: '',
    name: '',
    description: '',
    icon: '🤖'
  });

  useEffect(() => {
    loadTechTypes();
  }, []);

  async function loadTechTypes() {
    const types = await getNodesByType(NodeType.TECH_TYPE);
    setTechTypes(types);
  }

  async function selectTechType(tech) {
    setSelected(tech);
    setEditForm({
      key: tech.key,
      name: tech.name,
      description: tech.description || '',
      icon: tech.icon || '🤖'
    });
  }

  function newTechType() {
    setSelected(null);
    setEditForm({
      key: '',
      name: '',
      description: '',
      icon: '🤖'
    });
  }

  async function saveTechType() {
    if (!editForm.key || !editForm.name) {
      alert('Please fill in key and name');
      return;
    }

    try {
      if (selected) {
        // Update existing
        await db.nodes.update(selected.id, editForm);
      } else {
        // Create new
        await createNode(NodeType.TECH_TYPE, editForm);
      }

      await loadTechTypes();
      alert('✅ Saved successfully!');
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  }

  async function deleteTechType() {
    if (!selected) return;
    if (!confirm(`Delete "${selected.name}"? This will remove all associated characteristics.`)) return;

    try {
      await deleteNodeAndEdges(selected.id);
      setSelected(null);
      newTechType();
      await loadTechTypes();
      alert('✅ Deleted successfully');
    } catch (error) {
      alert('Error deleting: ' + error.message);
    }
  }

  return (
    <Container>
      <Sidebar>
        <Button
          $variant="primary"
          onClick={newTechType}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          + New Technology Type
        </Button>

        {techTypes.map(tech => (
          <TechCard
            key={tech.id}
            $selected={selected?.id === tech.id}
            onClick={() => selectTechType(tech)}
          >
            <TechIcon>{tech.icon || '🤖'}</TechIcon>
            <TechName>{tech.name}</TechName>
          </TechCard>
        ))}

        {techTypes.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
            No technology types yet.
          </div>
        )}
      </Sidebar>

      <EditorPanel>
        {(selected || editForm.key === '') ? (
          <>
            <h2>{selected ? 'Edit Technology Type' : 'New Technology Type'}</h2>

            <FormGroup>
              <Label>Key (unique identifier) *</Label>
              <Input
                value={editForm.key}
                onChange={(e) => setEditForm({...editForm, key: e.target.value})}
                placeholder="e.g., ml"
              />
            </FormGroup>

            <FormGroup>
              <Label>Display Name *</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="e.g., Machine Learning"
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Describe this technology type..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Icon (emoji)</Label>
              <Input
                value={editForm.icon}
                onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                placeholder="🤖"
              />
            </FormGroup>

            <ActionBar>
              <Button $variant="primary" onClick={saveTechType}>
                💾 Save Technology Type
              </Button>
              {selected && (
                <Button $variant="danger" onClick={deleteTechType}>
                  🗑️ Delete
                </Button>
              )}
            </ActionBar>
          </>
        ) : (
          <EmptyState>
            <h2>Select a technology type to edit</h2>
            <p>or create a new one from the sidebar</p>
          </EmptyState>
        )}
      </EditorPanel>
    </Container>
  );
}

export default TechnologyTypesManager;
