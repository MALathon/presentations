import Dexie from 'dexie';

// Define the IRB Rules Engine database with full graph modeling
export const db = new Dexie('IRBRulesEngine');

db.version(2).stores({
  // === NODES (All entities) ===
  nodes: '++id, type, key, name',  // Universal node table

  // === EDGES (All relationships) ===
  edges: '++id, sourceId, targetId, type',  // Universal edge table

  // === Metadata ===
  metadata: 'key, value'  // For storing config like "lastMigration"
});

// Node Types
export const NodeType = {
  TECH_TYPE: 'tech_type',
  CHARACTERISTIC: 'characteristic',
  CONTROL: 'control',
  QUESTION: 'question',
  PHASE: 'phase',
  PROFILE: 'profile',
  SCORING_RULE: 'scoring_rule'
};

// Edge Types (Relationships)
export const EdgeType = {
  // Tech Type relationships
  HAS_CHARACTERISTIC: 'has_characteristic',

  // Characteristic relationships
  HAS_CONTROL: 'has_control',  // metadata: { riskLevel: 'low|medium|high' }
  DEPENDS_ON: 'depends_on',  // Characteristic A requires Characteristic B
  CONFLICTS_WITH: 'conflicts_with',  // Can't have both
  SYNERGIZES_WITH: 'synergizes_with',  // metadata: { bonusPoints: number }

  // Scoring relationships
  SCORES: 'scores',  // metadata: { points: number, reason: string, phase: string }

  // Question relationships
  IMPACTS: 'impacts',  // metadata: { answer: 'yes|no', points: number }
  BELONGS_TO_PHASE: 'belongs_to_phase',

  // Control relationships
  PREREQUISITE: 'prerequisite',  // Control A requires Control B first
  ALTERNATIVE_TO: 'alternative_to',  // Can use either control

  // Profile relationships
  MODIFIES: 'modifies'  // metadata: { multiplier: number, threshold: number }
};

// Helper functions for graph operations
export async function createNode(type, data) {
  return await db.nodes.add({
    type,
    ...data,
    createdAt: new Date().toISOString()
  });
}

export async function createEdge(sourceId, targetId, type, metadata = {}) {
  return await db.edges.add({
    sourceId,
    targetId,
    type,
    metadata,
    createdAt: new Date().toISOString()
  });
}

export async function getNodesByType(type) {
  return await db.nodes.where('type').equals(type).toArray();
}

export async function getEdgesByType(type) {
  return await db.edges.where('type').equals(type).toArray();
}

export async function getOutgoingEdges(nodeId, edgeType = null) {
  if (edgeType) {
    return await db.edges.where({ sourceId: nodeId, type: edgeType }).toArray();
  }
  return await db.edges.where('sourceId').equals(nodeId).toArray();
}

export async function getIncomingEdges(nodeId, edgeType = null) {
  if (edgeType) {
    return await db.edges.where({ targetId: nodeId, type: edgeType }).toArray();
  }
  return await db.edges.where('targetId').equals(nodeId).toArray();
}

export async function deleteNodeAndEdges(nodeId) {
  // Delete all edges connected to this node
  await db.edges.where('sourceId').equals(nodeId).delete();
  await db.edges.where('targetId').equals(nodeId).delete();
  // Delete the node
  await db.nodes.delete(nodeId);
}

// Seed initial example data with new structure
export async function seedInitialData() {
  const nodeCount = await db.nodes.count();

  if (nodeCount === 0) {
    console.log('Seeding initial data with graph structure...');

    // === Technology Types (now configurable!) ===
    const mlId = await createNode(NodeType.TECH_TYPE, {
      key: 'ml',
      name: 'Machine Learning',
      description: 'Traditional ML models including supervised/unsupervised learning',
      icon: '🤖'
    });

    const llmId = await createNode(NodeType.TECH_TYPE, {
      key: 'llm',
      name: 'Large Language Model',
      description: 'Generative AI models based on transformer architecture',
      icon: '💬'
    });

    const imagingId = await createNode(NodeType.TECH_TYPE, {
      key: 'imaging',
      name: 'Medical Imaging AI',
      description: 'AI for analyzing medical images (X-ray, MRI, CT, etc.)',
      icon: '🏥'
    });

    // === Research Phases (configurable) ===
    const discoveryId = await createNode(NodeType.PHASE, {
      key: 'discovery',
      name: 'Discovery/Feasibility',
      description: 'Early stage research, proof of concept',
      order: 1
    });

    const translationalId = await createNode(NodeType.PHASE, {
      key: 'translational',
      name: 'Translational/Pilot',
      description: 'Testing with real but limited clinical data',
      order: 2
    });

    const clinicalId = await createNode(NodeType.PHASE, {
      key: 'clinical',
      name: 'Clinical Validation',
      description: 'Full clinical deployment and validation',
      order: 3
    });

    // === Characteristics ===
    const autonomousId = await createNode(NodeType.CHARACTERISTIC, {
      key: 'autonomous',
      name: 'Operates Autonomously',
      description: 'AI makes decisions without requiring human approval',
      baseScore: 4
    });

    const patientDataId = await createNode(NodeType.CHARACTERISTIC, {
      key: 'patient_data',
      name: 'Uses Patient Data',
      description: 'System is trained on or uses actual medical records',
      baseScore: 2
    });

    const hallucinationId = await createNode(NodeType.CHARACTERISTIC, {
      key: 'hallucination',
      name: 'May Generate False Information',
      description: 'LLM can create plausible but incorrect medical information',
      baseScore: 4
    });

    // === Connect Tech Types to Characteristics ===
    await createEdge(mlId, autonomousId, EdgeType.HAS_CHARACTERISTIC);
    await createEdge(mlId, patientDataId, EdgeType.HAS_CHARACTERISTIC);
    await createEdge(llmId, hallucinationId, EdgeType.HAS_CHARACTERISTIC);
    await createEdge(llmId, autonomousId, EdgeType.HAS_CHARACTERISTIC); // LLMs can also be autonomous

    // === Characteristic Dependencies ===
    // "autonomous" depends on "patient_data" (if it's using patient data, autonomy matters more)
    await createEdge(autonomousId, patientDataId, EdgeType.DEPENDS_ON, {
      reason: 'Autonomous decisions on patient data require extra scrutiny'
    });

    // === Characteristic Synergies ===
    // hallucination + autonomous = extra dangerous
    await createEdge(hallucinationId, autonomousId, EdgeType.SYNERGIZES_WITH, {
      bonusPoints: 10,
      reason: 'Autonomous hallucinations are critically dangerous'
    });

    // === Controls ===
    const killSwitchId = await createNode(NodeType.CONTROL, {
      key: 'kill_switch',
      name: 'Kill Switch Mechanism',
      description: 'Ability to immediately disable AI system'
    });

    const humanOversightId = await createNode(NodeType.CONTROL, {
      key: 'human_oversight',
      name: 'Human Oversight Required',
      description: 'All AI decisions must be reviewed by humans'
    });

    const auditLogId = await createNode(NodeType.CONTROL, {
      key: 'audit_log',
      name: 'Comprehensive Audit Logging',
      description: 'Log all AI decisions and inputs for review'
    });

    // === Connect Characteristics to Controls ===
    await createEdge(autonomousId, killSwitchId, EdgeType.HAS_CONTROL, { riskLevel: 'high' });
    await createEdge(autonomousId, humanOversightId, EdgeType.HAS_CONTROL, { riskLevel: 'medium' });
    await createEdge(autonomousId, auditLogId, EdgeType.HAS_CONTROL, { riskLevel: 'low' });

    await createEdge(hallucinationId, humanOversightId, EdgeType.HAS_CONTROL, { riskLevel: 'high' });
    await createEdge(hallucinationId, auditLogId, EdgeType.HAS_CONTROL, { riskLevel: 'medium' });

    // === Control Prerequisites ===
    // Kill switch requires audit logging to be in place first
    await createEdge(killSwitchId, auditLogId, EdgeType.PREREQUISITE, {
      reason: 'Need audit trail before allowing kill switch activation'
    });

    // === Questions ===
    const autonomousQId = await createNode(NodeType.QUESTION, {
      key: 'autonomous',
      text: 'Can the AI make decisions without human review?',
      priority: 10
    });

    const vulnerableQId = await createNode(NodeType.QUESTION, {
      key: 'vulnerable',
      text: 'Will this involve vulnerable populations?',
      priority: 10
    });

    const realDataQId = await createNode(NodeType.QUESTION, {
      key: 'real_data',
      text: 'Will you use actual patient records or data?',
      priority: 9
    });

    // === Connect Questions to Phases ===
    await createEdge(autonomousQId, clinicalId, EdgeType.BELONGS_TO_PHASE);
    await createEdge(autonomousQId, translationalId, EdgeType.BELONGS_TO_PHASE);
    await createEdge(vulnerableQId, clinicalId, EdgeType.BELONGS_TO_PHASE);
    await createEdge(realDataQId, discoveryId, EdgeType.BELONGS_TO_PHASE);

    // === Question Impacts on Characteristics ===
    await createEdge(autonomousQId, autonomousId, EdgeType.IMPACTS, {
      answer: 'yes',
      points: 25,
      reason: 'Autonomous operation significantly increases risk'
    });

    await createEdge(realDataQId, patientDataId, EdgeType.IMPACTS, {
      answer: 'yes',
      points: 18,
      reason: 'Using real patient data requires data protection controls'
    });

    // === Institution Profiles ===
    const standardId = await createNode(NodeType.PROFILE, {
      key: 'standard',
      name: 'Standard',
      description: 'Balanced approach for most institutions',
      multiplier: 1.0,
      thresholdAdjustment: 0,
      minCharacteristics: 7
    });

    const conservativeId = await createNode(NodeType.PROFILE, {
      key: 'conservative',
      name: 'Conservative',
      description: 'More comprehensive coverage, lower thresholds',
      multiplier: 1.3,
      thresholdAdjustment: -5,
      minCharacteristics: 10
    });

    // === Scoring Rules ===
    const mlTransAutonomousRule = await createNode(NodeType.SCORING_RULE, {
      key: 'ml_trans_autonomous',
      name: 'ML Translational Autonomous Scoring'
    });

    // Connect scoring rule: ML + Translational + Autonomous = +12 points
    await createEdge(mlId, mlTransAutonomousRule, EdgeType.SCORES);
    await createEdge(translationalId, mlTransAutonomousRule, EdgeType.SCORES);
    await createEdge(mlTransAutonomousRule, autonomousId, EdgeType.SCORES, {
      points: 12,
      reason: 'Autonomous ML in translational phase requires careful oversight'
    });

    console.log('Graph-based data seeded successfully!');
    console.log(`Created ${await db.nodes.count()} nodes and ${await db.edges.count()} edges`);
  }
}

// Initialize on import
seedInitialData();

export default db;
