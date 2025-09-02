# Ethical and Practical Oversight of AI Research
## Presentation Script

### Slide 1: Title Slide
Thank you for joining me today. This topic is huge and, based on the title, you'd think I would have all the answers – I don't. However, what I'm hoping to offer is a unique perspective on the topic of AI research, particularly as it relates to ethical oversight.

### Slide 2: Speaker Background (Venn Diagram)
I bring a somewhat unique perspective to this discussion, having worked on multiple sides of research – as an academic and industry professional – as well as from the perspective of a researcher/innovator and research evaluator.

My hope is that I can make the argument that individuals, innovators, institutions, and research agencies already have the tools and know-how to provide the oversight; that the fear of AI and the existential threats it is purported to bring is overblown. Being an engineer and a scientist first allows me to ask some of the most basic questions when it comes to learning about oversight of research – and as some of my colleagues can attest to, these oft annoying yet foundational questions often lead to productive discussions around what, if any, changes need to apply to AI.

### Slide 3: The Central Question
I'll start with the most basic question that I'm still trying to get answered: What causes angst about AI research communities?

### Slide 4: Common AI Concerns
When I raise this question, many of you may be tempted to start answering right away with concerns like these:
- Its non-deterministic, it's a black-box, no one knows how it "really" works
- It can make its own decisions
- Institutional/organizational biases can lead to incorrect outputs
- It uses so much data

These are all valid concerns that I've heard repeatedly in discussions about AI oversight.

### Slide 5: Not Unique to AI
But here's the thing – while I don't disagree with any of these concerns, I don't think they're unique to AI or machine learning. Let's consider other research domains:

Clinical trials have unpredictable outcomes. Sociological research deals with complex "black box" human behaviors. Medical devices and pharmaceuticals have operated with significant unknowns throughout history. Statistical models have always had the potential to encode and amplify biases.

Yet we've developed frameworks to address these challenges in other domains.

### Slide 6: What's Different Then?
So if these concerns aren't new, what makes AI different? Why does it create such anxiety within research communities?

### Slide 7: The Fundamental Difference
I have spent a considerable amount of time working with research evaluators (IRB specialists and the like) and I think the biggest takeaway is that AI "feels" different.

Take a lot of things, put them in a box, make critical decisions on new data using said box and hope that it's going to work. There's no visibility, and there's a fear of loss of control.

But more fundamentally, AI research uses human data from the very beginning. This is a critical distinction that affects how we approach oversight.

### Slide 8: Traditional Research Pathway
This is not like traditional device and pharmaceutical research, where you have a clear pre-human phase of development. With drugs, you're mixing chemicals in the lab, testing in petri dishes, and running animal trials before any human data enters the picture. The IRB only gets involved at that clear transition point to human subjects.

### Slide 9-10: AI Research Pathway
With AI, particularly in healthcare, we're using human data from the very beginning. There's no equivalent "mixing chemicals in the lab" phase where developers can freely explore without human data implications. Even the earliest prototypes require training on patient records, medical images, or clinical notes.

When developing a new algorithm to detect early signs of a particular condition in medical images, researchers can't even begin the exploratory phase without accessing thousands of patient scans. Unlike a pharmaceutical researcher who might spend years working with synthetic compounds before approaching human tissues, AI researchers are immediately immersed in human data.

### Slide 11: The Oversight Gap
This fundamental difference creates confusion about when oversight should begin and which ethical frameworks apply. The regulatory structures we've built for traditional research assume a linear progression from lab to humans, with clear boundaries between phases. AI development blurs these lines, creating an uncomfortable gap in our oversight models.

Data that was collected for clinical care suddenly becomes the foundation for algorithm development without the patients ever explicitly consenting to this secondary use. This is where the oversight gap emerges.

### Slide 12: What Everyone Wants
What everyone is hungry for is simple and easy processes that don't require becoming an AI scientist to understand. Now, I certainly don't think we have all the answers, but I do think we have made significant progress.

### Slide 13: Three Key Questions Framework
There are three main areas where I think the involvement of AI in research requires an "emphasis" rather than a whole new perspective. 

A reminder here is necessary - these things I'll be presenting are not the only considerations and do not include the standard HRPP processes done today, like ensuring data is properly shared with external entities or that conflicts of interest are mitigated. These standard processes remain important but are not specific to our topic as most institutions already have their own procedures to handle them.

### Slide 14: Three Questions Overview
After reviewing our experiences with AI research oversight, I've identified three critical questions that consistently emerge as focal points for ethical and practical evaluation:

1. Is there a clinical intended use?
2. Does it impact patient care?
3. What unique risks does the technology introduce?

These three questions help focus oversight where it matters most, without requiring reviewers to become AI experts.

### Slide 15: Question 1 - Clinical Intended Use
Our first key question is: Is there a clinical intended use?

This question helps us determine if the research requires safety and efficacy evaluation beyond basic data privacy concerns. It's about identifying when an AI project crosses from being purely exploratory to something that may require regulatory consideration.

### Slide 16: Language Matters
When examining this question, language choices become critically important. The terminology researchers use signals different regulatory implications:

On the left, we see clinical language like "diagnose," "treat," "predict," and "clinical decision support." These terms suggest a clinical intended use that may trigger regulatory oversight.

On the right, we see exploratory language like "investigate," "analyze," "examine," and "explore associations." These terms suggest a research focus that may not require the same level of regulatory scrutiny.

### Slide 17: Language Example
Let me illustrate with an example: A research team was developing an algorithm to analyze retinal images. In their initial protocol, they described their work as "developing an AI system to diagnose diabetic retinopathy." This language immediately raised flags because it suggested a clinical intended use.

When we discussed this with the researchers, it became clear they were actually in an exploratory phase, simply trying to determine if certain patterns in the images correlated with disease progression. By rephrasing their work as "investigating image features associated with diabetic retinopathy progression," we were able to appropriately categorize the research and apply the right level of oversight.

This distinction matters because it determines whether the work falls under potential FDA oversight as a medical device, which brings additional regulatory requirements.

### Slide 18: Question 2 - Patient Care Impact
Our second key question is: Does it impact patient care?

This addresses the direct risk profile to patients involved in AI research. Unlike the first question which focuses on intentions and regulatory pathways, this question examines the immediate practical implications for study participants.

### Slide 19: Impact Spectrum
The impact on patient care exists on a spectrum, from minimal to significant:

- Silent mode: The AI operates completely behind the scenes, with outputs never seen by clinicians during the study
- Shadow mode: Clinicians see the outputs but are explicitly instructed not to use them for decisions
- Decision support: The AI actively informs clinical judgment
- Autonomous action: The AI triggers alerts or actions with minimal human intervention

The degree of impact proportionally determines the appropriate oversight intensity.

### Slide 20: Impact Assessment Example
Consider this case study: A research team was developing an AI system to flag potential medication errors in electronic prescriptions. They initially proposed implementing this in a "silent mode" for validation, where the AI would run in the background without clinicians seeing the flags.

After six months of validation showing promising results, they proposed a second phase where the flags would be visible to pharmacists. This transition from non-impactful to potentially impactful required a reassessment of the oversight approach.

In the first phase, the primary risks related to data security and privacy. In the second phase, new considerations emerged: What if pharmacists over-relied on the system? What if false negatives created a false sense of security? What if workflow interruptions caused delays in medication dispensing?

### Slide 21: Question 3 - Technology Risks
Our third key question addresses what makes AI oversight uniquely challenging: What additional risks to human subjects, if any, are the result of the technology itself?

This question helps identify AI-specific considerations that standard oversight processes might miss. Even when we've determined there's no clinical intended use and minimal patient care impact, certain technological characteristics of AI systems introduce novel risks.

### Slide 22: Risk Categories
When examining this question, we focus on several unique risk dimensions:

- Algorithmic bias and fairness concerns: Is the AI trained on representative data? Might it perform differently across demographic groups?
- Model drift and performance degradation: How might the AI's performance change over time as clinical practices or patient populations evolve?
- Explainability limitations: Can clinicians understand how the AI reached its conclusions?
- Data provenance issues: Was training data collected ethically? Do patients understand how their data is being used?
- Integration challenges: How does the AI fit into existing clinical workflows? Might it create new errors at the human-AI interface?

### Slide 23: Traditional vs. AI-Specific Risks
It's worth noting that many of these risks aren't entirely unprecedented in research oversight. We've long considered issues like:
- Selection bias in clinical trials (similar to algorithmic bias)
- Generalizability of findings (similar to model drift)
- Validation of measurement instruments (similar to explainability)
- Secondary use of clinical data (similar to data provenance)

What makes AI unique is the scale, complexity, and sometimes opacity of these issues. The risks aren't fundamentally new, but they manifest in ways that can be harder to detect and address using traditional oversight approaches.

### Slide 24: Risk Assessment Tools
To address these challenges, we've developed straightforward risk assessment frameworks that research evaluators can use without needing deep technical expertise. These include libraries of model-specific risks categorized by model architecture, application domain, and data type.

Equally important is how we document this information in Design History Files (DHF). A structured DHF approach for AI research includes model specifications, training data characteristics and limitations, performance metrics across different populations, identified risks and corresponding mitigations, and validation testing protocols and results.

This systematic documentation creates transparency and accountability throughout the research process.

### Slide 25: Bringing It All Together
Let's take a step back and see how these three questions work together:

1. Is there a clinical intended use? - This helps determine the regulatory pathway and level of efficacy evidence needed.
2. Does it impact patient care? - This clarifies the direct risk profile to study participants and appropriate human subjects protections.
3. What unique risks does the technology introduce? - This identifies AI-specific considerations that might otherwise be overlooked.

Together, these questions create a structured approach to AI research oversight that builds on existing frameworks while addressing the technology's unique characteristics.

The challenge we face isn't creating entirely new oversight mechanisms, but rather adapting our existing tools to accommodate the fundamental differences in AI research approach. We need to identify the appropriate intervention points for ethical review when there's no clear transition from "lab" to "human subjects" because human data is intrinsic to the entire development process.

### Conclusion
In conclusion, what makes this approach particularly valuable is that it doesn't require reviewers to understand the technical details of machine learning. Instead, it focuses on practical implications that align with traditional research oversight concerns: intended use, participant risk, and risk mitigation.

We don't need to reinvent our entire approach to research oversight for AI. By focusing on these three key questions, we can adapt existing frameworks to effectively address AI's distinctive characteristics. This is about evolution, not revolution, of our oversight systems.

Thank you for your attention. I'm happy to take your questions.