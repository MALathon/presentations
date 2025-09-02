slides = [
    ("The Central Question", "What causes angst about AI within research communities?\n\nCore Concerns:\n• Control and predictability\n• Interpretability and explainability\n• Pace of change and evolution\n• Expertise gap"),
    ("Not Unique to AI", "Black Box → Medical Devices\nBias → Clinical Trials\nEvolution → Genomics\nUncertainty → Novel Therapy\nValidation → Personalized Medicine"),
    ("Traditional vs AI", "Traditional:\n• Explicit programming\n• Fixed rules\n• Predictable behavior\n\nAI:\n• Learned behavior\n• Pattern recognition  \n• Emergent properties"),
    ("When is IRB Review Required?", "✓ Systematic investigation?\n✓ Living individuals?\n✓ Generalizable knowledge?\n\n= Human Subjects Research"),
    ("Regulatory Framework", "FDA: SaMD, 510(k), De Novo\nIRB: Risk levels, Consent, Monitoring"),
    ("IRB Criteria Applied", "1. Research vs Practice\n2. SaMD Classification\n3. Risk/Benefit\n4. Equitable Selection\n5. Informed Consent\n6. Data Monitoring\n7. Privacy\n8. Vulnerable Populations"),
    ("Translation Gap", "Technical: AUC, F1, Neural nets\nIRB: Minimal risk, Beneficence, Consent\n\nNeed: Translators"),
    ("Three Questions", "1. Is this research?\n2. What's the impact?\n3. Is risk acceptable?"),
    ("Question 1", "Human subjects research?\n• Systematic investigation\n• Living individuals\n• Generalizable knowledge"),
    ("Question 2", "Impact on subjects?\n• Direct effects\n• Workflow changes  \n• System changes"),
    ("Question 3", "Technical risk?\n• Performance metrics\n• Failure modes\n• Bias assessment"),
    ("Impact Spectrum", "Minimal: Retrospective\nModerate: Decision support\nSignificant: Autonomous\nCritical: Closed-loop"),
    ("Risk Categories", "Data: Quality, bias\nModel: Generalization, drift\nImplementation: Integration, maintenance"),
    ("Risk Matrix", "85% Accuracy:\n✓ Screening\n✗ Treatment\n\nContext matters"),
    ("Practical Checklist", "□ Research determination\n□ Risk assessment\n□ Metrics translated\n□ Bias documented\n□ Monitoring plan\n□ Clear consent\n□ Data governance\n□ Failure modes"),
    ("Questions?", "Three-question framework:\n\n1. Is this research?\n2. What's the impact?\n3. Is risk acceptable?\n\nlifson.mark@mayo.edu")
]

for i, (title, content) in enumerate(slides, 2):
    print(f"Adding slide {i}: {title}")
