// Shared technology characteristics for Risk Matrix slide
export const techCategories = {
  ml: {
    name: 'ML/Predictive Models',
    characteristics: [
      {
        key: 'autonomous',
        name: 'Autonomous operation',
        score: 4,
        desc: 'Operates without human input',
        controls: {
          low: ['Clear operating boundaries', 'Document decision logic'],
          medium: ['Human approval for edge cases', 'Regular audits', 'Override capability'],
          high: ['Kill switch required', 'Real-time monitoring', 'Human takeover protocol', 'Liability insurance']
        }
      },
      {
        key: 'clinical_decisions',
        name: 'Clinical decision influence',
        score: 3,
        desc: 'Outputs used in care decisions',
        controls: {
          low: ['Include disclaimers', 'Research use only'],
          medium: ['Confidence scores required', 'Human review process', 'Second opinion protocol'],
          high: ['Mandatory physician override', 'Decision audit trail', 'Error reporting system', 'Malpractice coverage']
        }
      },
      {
        key: 'continuous_learning',
        name: 'Continuous learning',
        score: 3,
        desc: 'Updates from new data',
        controls: {
          low: ['Version control', 'Change logs'],
          medium: ['Performance drift monitoring', 'Update approval process', 'Testing protocol'],
          high: ['Regulatory re-validation', 'A/B testing protocol', 'Rollback procedures', 'FDA notification']
        }
      },
      {
        key: 'age_extremes',
        name: 'Age extremes included',
        score: 3,
        desc: 'Users <10 or >80 years',
        controls: {
          low: ['Population documented', 'Inclusion criteria'],
          medium: ['Special consent forms', 'Guardian involvement', 'Extra safeguards'],
          high: ['Ethics board review', 'Advocate required', 'Enhanced monitoring', 'Withdrawal protocol']
        }
      },
      {
        key: 'patient_data',
        name: 'Patient data usage',
        score: 2,
        desc: 'Processes medical records',
        controls: {
          low: ['Document data sources', 'Data dictionary'],
          medium: ['Privacy impact assessment', 'De-identification protocol', 'Access logs'],
          high: ['Full HIPAA compliance', 'Consent workflows', 'Data retention policies', 'Audit trails']
        }
      },
      {
        key: 'black_box',
        name: 'Black box algorithm',
        score: 2,
        desc: 'Limited explainability',
        controls: {
          low: ['Document model type', 'Performance metrics'],
          medium: ['Feature importance analysis', 'Sample explanations', 'Validation studies'],
          high: ['Full explainability suite', 'Decision trace documentation', 'Expert review panel']
        }
      }
    ]
  },
  llm: {
    name: 'Large Language Models',
    characteristics: [
      {
        key: 'medical_knowledge',
        name: 'Medical advice generation',
        score: 4,
        desc: 'Generates health guidance',
        controls: {
          low: ['General health only', 'Educational disclaimer', 'Not medical advice'],
          medium: ['Disclaimer required', 'Encourage provider consultation', 'Scope boundaries', 'Reference sources'],
          high: ['Licensed provider review', 'FDA compliance check', 'Clinical validation', 'Liability coverage', 'Expert oversight']
        }
      },
      {
        key: 'conversational',
        name: 'Conversational interface',
        score: 4,
        desc: 'Chat-based interaction',
        controls: {
          low: ['Clear bot identification', 'Limited scope', 'Hours of operation'],
          medium: ['Escalation to human', 'Scope limitations', 'Conversation monitoring', 'Feedback mechanism'],
          high: ['24/7 human backup', 'Crisis detection', 'Conversation logs', 'Real-time supervision', 'Emergency protocols']
        }
      },
      {
        key: 'hallucination',
        name: 'Hallucination potential',
        score: 4,
        desc: 'Can generate false information',
        controls: {
          low: ['Accuracy disclaimers', 'User education', 'Confidence indicators'],
          medium: ['Fact-checking required', 'Source verification', 'Output review', 'Uncertainty flagging'],
          high: ['Expert validation', 'Ground truth checking', 'Retrieval augmentation', 'Citation mandatory', 'Error tracking']
        }
      },
      {
        key: 'external_api',
        name: 'External API usage',
        score: 3,
        desc: 'Cloud-based processing',
        controls: {
          low: ['API documentation', 'Terms of service', 'Data types logged'],
          medium: ['Data processing agreement', 'Encryption in transit', 'API monitoring', 'Rate limiting'],
          high: ['BAA required', 'Local deployment only', 'Zero data retention', 'Audit logs', 'HIPAA compliant']
        }
      },
      {
        key: 'generates_text',
        name: 'Medical text generation',
        score: 3,
        desc: 'Produces clinical text',
        controls: {
          low: ['Label as AI-generated', 'Draft only', 'Template-based'],
          medium: ['Fact-checking protocol', 'Citation requirements', 'Review workflow', 'Version tracking'],
          high: ['Medical expert review', 'Liability disclaimers', 'Output validation', 'Regulatory approval', 'Quality assurance']
        }
      }
    ]
  },
  imaging: {
    name: 'Medical Imaging AI',
    characteristics: [
      {
        key: 'diagnostic',
        name: 'Diagnostic capability',
        score: 4,
        desc: 'Identifies conditions',
        controls: {
          low: ['Research use only', 'Not for clinical use', 'Performance metrics'],
          medium: ['Radiologist required', 'Second reader protocol', 'Confidence thresholds', 'QA process'],
          high: ['FDA 510(k) clearance', 'Clinical validation', 'Liability insurance', 'Expert panel review', 'Post-market surveillance']
        }
      },
      {
        key: 'triage',
        name: 'Triage functionality',
        score: 3,
        desc: 'Prioritizes cases',
        controls: {
          low: ['Priority guidelines', 'Override option', 'Manual review'],
          medium: ['Performance monitoring', 'Fairness testing', 'Workflow integration', 'Escalation protocol'],
          high: ['Clinical validation', 'Bias assessment', 'Patient safety protocol', 'Continuous monitoring', 'Equity analysis']
        }
      },
      {
        key: 'screening',
        name: 'Screening application',
        score: 3,
        desc: 'Population-level analysis',
        controls: {
          low: ['Quality sampling', 'Batch review', 'Statistics tracking'],
          medium: ['Batch QA process', 'False positive protocol', 'Recall procedures', 'Performance tracking'],
          high: ['Public health approval', 'Equity analysis', 'Follow-up protocols', 'Registry reporting', 'Outcome tracking']
        }
      },
      {
        key: 'real_time',
        name: 'Real-time processing',
        score: 3,
        desc: 'Live analysis capability',
        controls: {
          low: ['Latency specs', 'Performance testing', 'Backup plan'],
          medium: ['Fallback protocol', 'Performance monitoring', 'Alert thresholds', 'Quality checks'],
          high: ['Redundant systems', 'Expert backup', 'Failure protocols', 'Real-time QA', 'Safety mechanisms']
        }
      }
    ]
  },
  wearables: {
    name: 'Wearables/IoT',
    characteristics: [
      {
        key: 'emergency_detection',
        name: 'Emergency detection',
        score: 4,
        desc: 'Identifies critical events',
        controls: {
          low: ['Emergency contacts', 'User training', 'False positive info'],
          medium: ['Validation studies', '911 integration', 'Caregiver alerts', 'Sensitivity settings'],
          high: ['Clinical validation', 'EMS protocols', 'Liability coverage', '24/7 support', 'Chain of custody']
        }
      },
      {
        key: 'continuous',
        name: 'Continuous operation',
        score: 3,
        desc: 'Always-on monitoring',
        controls: {
          low: ['Privacy notice', 'Data types listed', 'Opt-out option'],
          medium: ['Data minimization', 'User controls', 'Pause capability', 'Download rights'],
          high: ['Granular consent', 'Right to delete', 'Retention limits', 'Purpose limitation', 'Data portability']
        }
      },
      {
        key: 'alerts',
        name: 'Alert generation',
        score: 3,
        desc: 'Produces notifications',
        controls: {
          low: ['Alert types listed', 'Disable option', 'User settings'],
          medium: ['Customizable thresholds', 'Snooze function', 'Alert fatigue monitoring', 'Escalation rules'],
          high: ['Clinical validation', 'Escalation pathways', 'False alarm tracking', 'Provider integration', 'Alert optimization']
        }
      },
      {
        key: 'vital_signs',
        name: 'Vital sign measurement',
        score: 3,
        desc: 'Tracks physiological data',
        controls: {
          low: ['Accuracy specs', 'Measurement conditions', 'Limitations stated'],
          medium: ['Clinical validation', 'Calibration protocol', 'Error handling', 'Trending analysis'],
          high: ['FDA clearance', 'Medical grade accuracy', 'Clinical studies', 'Reference standard comparison', 'Continuous QA']
        }
      }
    ]
  },
  apps: {
    name: 'Digital Therapeutics',
    characteristics: [
      {
        key: 'mental_health',
        name: 'Mental health application',
        score: 4,
        desc: 'Addresses psychological conditions',
        controls: {
          low: ['Crisis resources', 'Helpline numbers', 'When to seek help'],
          medium: ['Safety assessments', 'Escalation protocols', 'Risk screening', 'Provider referral'],
          high: ['24/7 crisis support', 'Provider alerts', 'Emergency intervention', 'Suicide prevention', 'Real-time monitoring']
        }
      },
      {
        key: 'substance_use',
        name: 'Addiction monitoring',
        score: 4,
        desc: 'Tracks substance use patterns',
        controls: {
          low: ['Recovery resources', 'Support groups', 'Educational content'],
          medium: ['Relapse prevention', 'Trigger monitoring', 'Sponsor connection', 'Progress tracking'],
          high: ['Medical supervision', 'MAT integration', 'Emergency protocols', 'Withdrawal management', 'Clinical coordination']
        }
      },
      {
        key: 'therapeutic',
        name: 'Therapeutic delivery',
        score: 3,
        desc: 'Provides treatment protocols',
        controls: {
          low: ['Evidence-based', 'Self-help format', 'Progress tracking'],
          medium: ['Licensed content', 'Therapist review', 'Homework assignments', 'Skill building'],
          high: ['Clinical trials', 'FDA clearance', 'Outcomes monitoring', 'Therapist supervision', 'Efficacy studies']
        }
      },
      {
        key: 'medication_mgmt',
        name: 'Medication tracking',
        score: 3,
        desc: 'Schedules and doses',
        controls: {
          low: ['Reminder only', 'Med list', 'Basic tracking'],
          medium: ['Interaction checking', 'Adherence monitoring', 'Refill alerts', 'Side effect tracking'],
          high: ['Prescriber integration', 'Pharmacy connection', 'Clinical protocols', 'Dose adjustment', 'Safety monitoring']
        }
      }
    ]
  }
};

// Helper function to get controls based on risk level
export const getRecommendedControls = (techType, characteristics, riskLevel) => {
  if (!techCategories[techType]) return [];

  const controls = [];
  const riskCategory = riskLevel <= 2 ? 'low' : riskLevel <= 4 ? 'medium' : 'high';

  characteristics.forEach(charKey => {
    const char = techCategories[techType].characteristics.find(c => c.key === charKey);
    if (char && char.controls[riskCategory]) {
      controls.push({
        characteristic: char.name,
        charKey: char.key,
        controls: char.controls[riskCategory]
      });
    }
  });

  return controls;
};
