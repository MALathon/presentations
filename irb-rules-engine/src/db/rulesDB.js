import Dexie from 'dexie';

// Define the IRB Rules Engine database
export const db = new Dexie('IRBRulesEngine');

db.version(1).stores({
  // Core entities
  characteristics: '++id, key, name, techType',
  controls: '++id, characteristicId, riskLevel',

  // Scoring rules
  scoringRules: '++id, techType, phase, characteristicKey',

  // Questions
  questions: '++id, key, phase, priority',

  // Impact rules (Q2 answers affect characteristics)
  impactRules: '++id, questionKey, characteristicKey, answer',

  // Synergy rules (multiple conditions → bonuses)
  synergyRules: '++id',

  // Institution profiles
  profiles: '++id, name'
});

// Seed initial example data
export async function seedInitialData() {
  const charCount = await db.characteristics.count();

  if (charCount === 0) {
    console.log('Seeding initial data...');

    // Add example characteristics
    const charIds = await db.characteristics.bulkAdd([
      {
        key: 'autonomous',
        name: 'Operates Autonomously',
        description: 'AI makes decisions without requiring human approval',
        techType: 'ml',
        baseScore: 4
      },
      {
        key: 'patient_data',
        name: 'Uses Patient Data',
        description: 'System is trained on or uses actual medical records',
        techType: 'ml',
        baseScore: 2
      },
      {
        key: 'hallucination',
        name: 'May Generate False Information',
        description: 'LLM can create plausible but incorrect medical information',
        techType: 'llm',
        baseScore: 4
      }
    ], { allKeys: true });

    // Add example controls for the first characteristic
    await db.controls.bulkAdd([
      {
        characteristicId: charIds[0],
        riskLevel: 'low',
        description: 'Document operating boundaries clearly'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'low',
        description: 'Maintain decision logic documentation'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'medium',
        description: 'Require human approval for edge cases'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'medium',
        description: 'Implement regular audit procedures'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'high',
        description: 'Install kill switch mechanism'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'high',
        description: 'Enable real-time monitoring dashboard'
      },
      {
        characteristicId: charIds[0],
        riskLevel: 'high',
        description: 'Maintain liability insurance coverage'
      }
    ]);

    // Add institution profiles
    await db.profiles.bulkAdd([
      {
        name: 'Standard',
        multiplier: 1.0,
        thresholdAdjustment: 0,
        minCharacteristics: 7,
        description: 'Balanced approach for most institutions'
      },
      {
        name: 'Conservative',
        multiplier: 1.3,
        thresholdAdjustment: -5,
        minCharacteristics: 10,
        description: 'More comprehensive coverage, lower thresholds'
      },
      {
        name: 'Streamlined',
        multiplier: 0.7,
        thresholdAdjustment: 5,
        minCharacteristics: 5,
        description: 'Focused on essentials, higher thresholds'
      }
    ]);

    // Add example scoring rules
    await db.scoringRules.bulkAdd([
      {
        techType: 'ml',
        phase: 'translational',
        characteristicKey: 'autonomous',
        points: 12,
        reason: 'Autonomous ML in translational phase requires careful oversight'
      },
      {
        techType: 'ml',
        phase: 'clinical',
        characteristicKey: 'autonomous',
        points: 15,
        reason: 'Autonomous ML in clinical deployment is critical'
      },
      {
        techType: 'llm',
        phase: 'clinical',
        characteristicKey: 'hallucination',
        points: 15,
        reason: 'LLM hallucination risk in clinical setting is critical'
      }
    ]);

    // Add example questions
    await db.questions.bulkAdd([
      {
        key: 'autonomous',
        text: 'Can the AI make decisions without human review?',
        phase: 'all',
        priority: 10
      },
      {
        key: 'vulnerable',
        text: 'Will this involve vulnerable populations?',
        phase: 'all',
        priority: 10
      },
      {
        key: 'real_data',
        text: 'Will you use actual patient records or data?',
        phase: 'discovery',
        priority: 9
      }
    ]);

    console.log('Initial data seeded successfully');
  }
}

// Initialize on import
seedInitialData();

export default db;
