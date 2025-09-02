import sys
sys.path.append('/Users/lifson.mark/Library/CloudStorage/OneDrive-MayoClinic/Presentations/NCI2025-AI-Oversight_Framework')

# Read speaker notes
with open('SPEAKER_NOTES.md', 'r') as f:
    speaker_notes_content = f.read()

# Parse speaker notes by slide
import re
slides_data = []
slide_pattern = r'## Slide (\d+): (.+?) \(([\d.]+) minutes?\)\n\*\*Visual\*\*: (.+?)\n\n(.*?)(?=\n---|\Z)'
matches = re.findall(slide_pattern, speaker_notes_content, re.DOTALL)

for match in matches:
    slide_num, title, duration, visual, notes = match
    slides_data.append({
        'number': int(slide_num),
        'title': title.strip(),
        'duration': duration,
        'visual': visual.strip(),
        'notes': notes.strip()
    })

# Create slides content
slides_content = [
    {
        'title': 'AI Research Oversight:\nBuilding an Effective Framework',
        'subtitle': 'Adapting existing frameworks for emerging technology',
        'content': 'Authors:\nMark Lifson, PhD (Speaker)\nTamiko Eto\n\nNCI 2025 Conference',
        'notes': slides_data[0]['notes'] if slides_data else ''
    },
    {
        'title': 'Speaker Background',
        'content': '• Aerospace Engineering → Medical Devices → Clinical AI\n• FDA-regulated device development experience\n• Mayo Clinic AI research oversight\n• Cross-domain perspective on safety and efficacy\n\nKey Insight: Effective oversight comes from frameworks that leverage existing expertise while addressing what\'s genuinely new about AI',
        'notes': slides_data[1]['notes'] if len(slides_data) > 1 else ''
    },
    {
        'title': 'The Central Question',
        'content': 'What causes angst about AI within research communities?\n\nCore Concerns:\n• Control and predictability\n• Interpretability and explainability\n• Pace of change and evolution\n• Expertise gap\n\nKey Insight: Most of what makes AI research "research" isn\'t new',
        'notes': slides_data[2]['notes'] if len(slides_data) > 2 else ''
    },
    {
        'title': 'These Challenges Are Not Unique to AI',
        'content': 'Black Box Algorithms → Complex Medical Devices\nBias in Data → Clinical Trial Representation\nRapid Evolution → Genomics, Immunotherapy\nRegulatory Uncertainty → Any Novel Therapy\nValidation Challenges → Personalized Medicine\n\nThe difference: AI combines all challenges simultaneously',
        'notes': slides_data[3]['notes'] if len(slides_data) > 3 else ''
    },
    {
        'title': 'What\'s Different: Traditional vs AI',
        'content': 'Traditional Development:\n• Explicit programming\n• Fixed rules\n• Predictable behavior\n• Linear validation\n\nAI Development:\n• Learned behavior\n• Pattern recognition\n• Emergent properties\n• Continuous evolution\n\nThis changes HOW we validate, not WHETHER we protect subjects',
        'notes': slides_data[4]['notes'] if len(slides_data) > 4 else ''
    },
    {
        'title': 'Clinical Development Phases',
        'content': 'Traditional: Linear progression\n  Discovery → Development → Validation → Deployment\n\nAI: Circular evolution\n  Training ↔ Validation ↔ Deployment ↔ Retraining\n\nImplication: Oversight must account for continuous change',
        'notes': slides_data[5]['notes'] if len(slides_data) > 5 else ''
    },
    {
        'title': 'When is IRB Review Required?',
        'content': 'Apply Existing Definitions:\n\n✓ Systematic investigation?\n✓ Living individuals?\n✓ Generalizable knowledge?\n\n= Human Subjects Research\n\nAI doesn\'t change the definition, just the application',
        'notes': slides_data[6]['notes'] if len(slides_data) > 6 else ''
    },
    {
        'title': 'Regulatory Framework',
        'content': 'FDA Pathways:\n• SaMD (Software as Medical Device)\n• 510(k), De Novo, PMA routes\n• Predetermined Change Control Plans\n\nIRB Considerations:\n• Risk level determination\n• Consent requirements\n• Monitoring plans\n\nKey: Translation between technical and regulatory languages',
        'notes': slides_data[7]['notes'] if len(slides_data) > 7 else ''
    },
    {
        'title': 'IRB Review Criteria Applied to AI',
        'content': '1. Research vs Practice → Standard definitions apply\n2. SaMD Classification → FDA risk categories\n3. Risk/Benefit → Technical performance metrics\n4. Equitable Selection → Bias assessment\n5. Informed Consent → Explainability requirements\n6. Data Monitoring → Drift detection\n7. Privacy → Data governance\n8. Vulnerable Populations → Enhanced protections',
        'notes': slides_data[8]['notes'] if len(slides_data) > 8 else ''
    },
    {
        'title': 'The Translation Gap',
        'content': 'Technical Teams Speak:\n• AUC, F1 scores\n• Gradient descent\n• Neural architectures\n\nIRBs Speak:\n• Minimal risk\n• Beneficence\n• Informed consent\n\nWe need translators, not more experts',
        'notes': slides_data[9]['notes'] if len(slides_data) > 9 else ''
    },
    {
        'title': 'Three Key Questions Framework',
        'content': '1. Is this human subjects research?\n   → Apply standard definitions\n\n2. What is the potential for impact?\n   → Assess direct and cascading effects\n\n3. Is the technical risk acceptable?\n   → Translate metrics to risk language\n\nComprehensive oversight without requiring AI expertise',
        'notes': slides_data[10]['notes'] if len(slides_data) > 10 else ''
    },
    {
        'title': 'Question 1: Research Determination',
        'content': 'Is this human subjects research requiring IRB review?\n\nApply Standard Criteria:\n• Systematic investigation\n• Living individuals\n• Generalizable knowledge\n\nAI-Specific Considerations:\n• Training vs deployment\n• Quality improvement vs research\n• Local optimization vs generalization',
        'notes': slides_data[11]['notes'] if len(slides_data) > 11 else ''
    },
    {
        'title': 'Why Language Matters',
        'content': '"Algorithm" → Scary\n"Decision Support Tool" → Helpful\n\nSame system, different perceptions\n\nNeed consistent terminology that:\n• Accurately conveys capabilities\n• Acknowledges limitations\n• Avoids fear-mongering\n• Prevents overselling',
        'notes': slides_data[12]['notes'] if len(slides_data) > 12 else ''
    },
    {
        'title': 'Question 2: Impact Assessment',
        'content': 'What is the potential for impact on human subjects?\n\nConsider:\n• Direct impacts (immediate effects)\n• Indirect impacts (workflow changes)\n• Cascading effects (system-wide changes)\n• Reversibility of decisions\n• Human oversight levels',
        'notes': slides_data[13]['notes'] if len(slides_data) > 13 else ''
    },
    {
        'title': 'Impact Spectrum',
        'content': 'Minimal Risk:\n• Retrospective analysis\n• Pattern identification\n\nModerate Risk:\n• Clinical decision support\n• Human override required\n\nSignificant Risk:\n• Autonomous recommendations\n• Treatment decisions\n\nCritical Risk:\n• Closed-loop systems\n• Direct patient control',
        'notes': slides_data[14]['notes'] if len(slides_data) > 14 else ''
    },
    {
        'title': 'Question 3: Technical Risk',
        'content': 'Is the technical risk acceptable relative to benefits?\n\nKey Considerations:\n• Performance metrics in context\n• Failure modes and mitigation\n• Bias and fairness assessment\n• Interpretability requirements\n• Monitoring and maintenance plans',
        'notes': slides_data[15]['notes'] if len(slides_data) > 15 else ''
    },
    {
        'title': 'Technical Risk Categories',
        'content': 'Data Risks:\n• Quality, bias, representation\n\nModel Risks:\n• Generalization, overfitting, drift\n\nImplementation Risks:\n• Integration, usability, maintenance\n\nEach requires specific mitigation strategies',
        'notes': slides_data[16]['notes'] if len(slides_data) > 16 else ''
    },
    {
        'title': 'Risk Acceptability Matrix',
        'content': 'Context Determines Acceptability:\n\n85% Accuracy:\n✓ Acceptable for screening\n✗ Unacceptable for treatment\n\nKey Factors:\n• Severity of consequences\n• Availability of alternatives\n• Reversibility of decisions\n• Human oversight level',
        'notes': slides_data[17]['notes'] if len(slides_data) > 17 else ''
    },
    {
        'title': 'Practical Checklist',
        'content': 'Pre-Review Checklist:\n\n□ Research determination complete\n□ Risk level assessed\n□ Technical metrics translated\n□ Bias assessment documented\n□ Monitoring plan defined\n□ Consent language clear\n□ Data governance specified\n□ Failure modes identified\n\nAdapt for your institution',
        'notes': slides_data[18]['notes'] if len(slides_data) > 18 else ''
    },
    {
        'title': 'Questions?',
        'content': 'A practical three-question framework for AI research oversight\n\n• Is this human subjects research requiring IRB review?\n• What is the potential for impact on human subjects?\n• Is the technical risk acceptable relative to benefits?\n\nContact:\nlifson.mark@mayo.edu\nlinkedin.com/in/marklifson',
        'notes': slides_data[19]['notes'] if len(slides_data) > 19 else ''
    }
]

print(f"Prepared {len(slides_content)} slides")
print("Slide titles:")
for i, slide in enumerate(slides_content, 1):
    print(f"  {i}. {slide['title'].split(':')[0] if ':' in slide['title'] else slide['title'][:30]}")
