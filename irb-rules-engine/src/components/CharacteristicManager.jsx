import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import db from '../db/rulesDB';

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

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 226, 192, 0.3);
    border-radius: 4px;
  }
`;

const CharacteristicCard = styled.div`
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

const CharName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: white;
`;

const CharMeta = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
`;

const EditorPanel = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 30px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 226, 192, 0.3);
    border-radius: 4px;
  }
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4AE2C0;
    box-shadow: 0 0 0 3px rgba(74, 226, 192, 0.1);
  }

  option {
    background: #1e3c72;
    color: white;
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
    background: ${props => {
      if (props.$variant === 'primary') return 'linear-gradient(90deg, #3cc8a8, #2db090)';
      if (props.$variant === 'danger') return 'rgba(244, 67, 54, 0.3)';
      return 'rgba(255, 255, 255, 0.15)';
    }};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ControlsSection = styled.div`
  margin-top: 40px;
  padding-top: 40px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin: 0 0 10px 0;
  color: white;
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 25px 0;
  line-height: 1.5;
`;

const RiskLevelSection = styled.div`
  background: ${props =>
    props.$level === 'low' ? 'rgba(76, 175, 80, 0.08)' :
    props.$level === 'medium' ? 'rgba(255, 193, 7, 0.08)' :
    'rgba(244, 67, 54, 0.08)'
  };
  border: 2px solid ${props =>
    props.$level === 'low' ? 'rgba(76, 175, 80, 0.3)' :
    props.$level === 'medium' ? 'rgba(255, 193, 7, 0.3)' :
    'rgba(244, 67, 54, 0.3)'
  };
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const RiskLevelTitle = styled.h4`
  margin: 0 0 15px 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${props =>
    props.$level === 'low' ? '#4CAF50' :
    props.$level === 'medium' ? '#FFC107' :
    '#F44336'
  };
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: ${props =>
      props.$level === 'low' ? '"🟢"' :
      props.$level === 'medium' ? '"🟡"' :
      '"🔴"'
    };
  }
`;

const ControlItem = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

const ControlInput = styled(Input)`
  flex: 1;
  margin: 0;
`;

const SmallButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: rgba(244, 67, 54, 0.2);
    border-color: #F44336;
  }
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

const ActionBar = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
`;

function CharacteristicManager() {
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedChar, setSelectedChar] = useState(null);
  const [controls, setControls] = useState({ low: [], medium: [], high: [] });
  const [editForm, setEditForm] = useState({
    key: '',
    name: '',
    description: '',
    techType: 'ml',
    baseScore: 2
  });

  useEffect(() => {
    loadCharacteristics();
  }, []);

  async function loadCharacteristics() {
    const chars = await db.characteristics.toArray();
    setCharacteristics(chars);
  }

  async function selectCharacteristic(char) {
    setSelectedChar(char);
    setEditForm({
      key: char.key,
      name: char.name,
      description: char.description,
      techType: char.techType,
      baseScore: char.baseScore
    });

    // Load controls for this characteristic
    const charControls = await db.controls.where('characteristicId').equals(char.id).toArray();
    const grouped = {
      low: charControls.filter(c => c.riskLevel === 'low').map(c => c.description),
      medium: charControls.filter(c => c.riskLevel === 'medium').map(c => c.description),
      high: charControls.filter(c => c.riskLevel === 'high').map(c => c.description)
    };
    setControls(grouped);
  }

  async function saveCharacteristic() {
    if (!editForm.key || !editForm.name) {
      alert('Please fill in at least the Key and Name fields');
      return;
    }

    try {
      if (selectedChar) {
        // Update existing characteristic
        await db.characteristics.update(selectedChar.id, editForm);

        // Delete existing controls and re-add
        await db.controls.where('characteristicId').equals(selectedChar.id).delete();

        for (const [level, items] of Object.entries(controls)) {
          for (const description of items) {
            if (description.trim()) {
              await db.controls.add({
                characteristicId: selectedChar.id,
                riskLevel: level,
                description: description.trim()
              });
            }
          }
        }
      } else {
        // Create new characteristic
        const id = await db.characteristics.add(editForm);

        // Add controls
        for (const [level, items] of Object.entries(controls)) {
          for (const description of items) {
            if (description.trim()) {
              await db.controls.add({
                characteristicId: id,
                riskLevel: level,
                description: description.trim()
              });
            }
          }
        }
      }

      await loadCharacteristics();
      alert('✅ Saved successfully!');
    } catch (error) {
      alert('Error saving: ' + error.message);
    }
  }

  function newCharacteristic() {
    setSelectedChar(null);
    setEditForm({
      key: '',
      name: '',
      description: '',
      techType: 'ml',
      baseScore: 2
    });
    setControls({ low: [], medium: [], high: [] });
  }

  function addControl(level) {
    setControls({
      ...controls,
      [level]: [...controls[level], '']
    });
  }

  function updateControl(level, index, value) {
    const newControls = [...controls[level]];
    newControls[index] = value;
    setControls({
      ...controls,
      [level]: newControls
    });
  }

  function removeControl(level, index) {
    const newControls = [...controls[level]];
    newControls.splice(index, 1);
    setControls({
      ...controls,
      [level]: newControls
    });
  }

  async function deleteCharacteristic() {
    if (!selectedChar) return;
    if (!confirm(`Are you sure you want to delete "${selectedChar.name}"? This cannot be undone.`)) return;

    try {
      // Delete associated controls
      await db.controls.where('characteristicId').equals(selectedChar.id).delete();
      // Delete the characteristic
      await db.characteristics.delete(selectedChar.id);

      setSelectedChar(null);
      newCharacteristic();
      await loadCharacteristics();
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
          onClick={newCharacteristic}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          + New Characteristic
        </Button>

        {characteristics.map(char => (
          <CharacteristicCard
            key={char.id}
            $selected={selectedChar?.id === char.id}
            onClick={() => selectCharacteristic(char)}
          >
            <CharName>{char.name}</CharName>
            <CharMeta>
              <span>{char.techType.toUpperCase()}</span>
              <span>Score: {char.baseScore}</span>
            </CharMeta>
          </CharacteristicCard>
        ))}

        {characteristics.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
            No characteristics yet.<br/>
            Click "New Characteristic" to add one.
          </div>
        )}
      </Sidebar>

      <EditorPanel>
        {(selectedChar || editForm.key === '') ? (
          <>
            <h2>{selectedChar ? 'Edit Characteristic' : 'New Characteristic'}</h2>

            <FormGroup>
              <Label>Key (unique identifier) *</Label>
              <Input
                value={editForm.key}
                onChange={(e) => setEditForm({...editForm, key: e.target.value})}
                placeholder="e.g., autonomous_decision"
              />
            </FormGroup>

            <FormGroup>
              <Label>Display Name *</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="e.g., Operates Autonomously"
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                placeholder="Describe what this characteristic means and why it matters..."
              />
            </FormGroup>

            <FormGroup>
              <Label>Technology Type</Label>
              <Select
                value={editForm.techType}
                onChange={(e) => setEditForm({...editForm, techType: e.target.value})}
              >
                <option value="ml">Machine Learning (ML)</option>
                <option value="llm">Large Language Model (LLM)</option>
                <option value="imaging">Medical Imaging AI</option>
                <option value="wearables">Wearables/Sensors</option>
                <option value="apps">Digital Health Apps</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Base Severity Score (1-4)</Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={editForm.baseScore}
                onChange={(e) => setEditForm({...editForm, baseScore: parseInt(e.target.value) || 1})}
              />
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '5px' }}>
                1 = Low concern, 4 = High concern
              </div>
            </FormGroup>

            <ControlsSection>
              <SectionTitle>Recommended Controls by Risk Level</SectionTitle>
              <SectionDescription>
                Define different controls based on the overall project risk level.
                Low risk projects get simpler controls, high risk projects get comprehensive ones.
              </SectionDescription>

              {['low', 'medium', 'high'].map(level => (
                <RiskLevelSection key={level} $level={level}>
                  <RiskLevelTitle $level={level}>
                    {level.toUpperCase()} Risk Controls
                  </RiskLevelTitle>

                  {controls[level].map((control, index) => (
                    <ControlItem key={index}>
                      <ControlInput
                        value={control}
                        onChange={(e) => updateControl(level, index, e.target.value)}
                        placeholder={`Enter ${level} risk control...`}
                      />
                      <SmallButton onClick={() => removeControl(level, index)}>
                        Remove
                      </SmallButton>
                    </ControlItem>
                  ))}

                  <Button onClick={() => addControl(level)} style={{ marginTop: '10px' }}>
                    + Add {level} risk control
                  </Button>
                </RiskLevelSection>
              ))}
            </ControlsSection>

            <ActionBar>
              <Button $variant="primary" onClick={saveCharacteristic}>
                💾 Save Characteristic
              </Button>
              {selectedChar && (
                <Button $variant="danger" onClick={deleteCharacteristic}>
                  🗑️ Delete
                </Button>
              )}
            </ActionBar>
          </>
        ) : (
          <EmptyState>
            <h2>Select a characteristic to edit</h2>
            <p>or create a new one from the sidebar</p>
          </EmptyState>
        )}
      </EditorPanel>
    </Container>
  );
}

export default CharacteristicManager;
