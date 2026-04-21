const fetch = require('node-fetch');

// MoCA/MMSE Standard Domain Specifications
const COGNITIVE_DOMAINS = {
  global: {
    name: 'Global Cognitive Screen',
    standard: 'MoCA/MMSE',
    description: 'Standardized baseline cognitive assessment',
    questionTypes: [
      'orientation (time, place, person)',
      'attention and concentration (serial subtraction, digit span)',
      'short-term memory registration',
      'visuospatial abilities (clock concepts, spatial reasoning)',
      'abstraction and conceptual thinking'
    ],
    ageAdjustments: {
      '18-40': 'Include faster processing speed items, abstract reasoning',
      '41-60': 'Balance speed and accuracy, include work-related scenarios',
      '61-75': 'Slower pacing, clear instructions, familiar contexts',
      '76+': 'Simplified language, extended time concepts, daily routine focus'
    }
  },
  'episodic-memory': {
    name: 'Episodic Memory Assessment',
    standard: 'Delayed Recall / Rey Auditory Verbal Learning',
    description: 'Evaluates memory encoding, storage, and retrieval',
    questionTypes: [
      'immediate recall of word lists or stories',
      'delayed recall after interference',
      'recognition memory (identifying previously seen items)',
      'temporal ordering (sequence of events)',
      'source memory (context of learning)'
    ],
    ageAdjustments: {
      '18-40': 'Longer lists, faster presentation, interference tasks',
      '41-60': 'Moderate complexity, work and life event scenarios',
      '61-75': 'Shorter lists, meaningful content, recognition cues available',
      '76+': 'Very short lists, high imagery content, multiple retrieval cues'
    }
  },
  executive: {
    name: 'Executive Function Assessment',
    standard: 'Trail Making Test B / Stroop / Wisconsin Card Sort concepts',
    description: 'Measures planning, flexibility, inhibition, and problem-solving',
    questionTypes: [
      'set-shifting and cognitive flexibility',
      'planning and sequencing',
      'inhibitory control (resisting automatic responses)',
      'working memory manipulation',
      'problem-solving and reasoning'
    ],
    ageAdjustments: {
      '18-40': 'Complex multi-step problems, time pressure scenarios',
      '41-60': 'Workplace decision-making, priority management',
      '61-75': 'Daily planning scenarios, familiar multi-step tasks',
      '76+': 'Simple sequencing, routine-based decisions, clear steps'
    }
  },
  language: {
    name: 'Language Assessment',
    standard: 'Category Fluency / Boston Naming concepts',
    description: 'Evaluates verbal expression, comprehension, and word retrieval',
    questionTypes: [
      'semantic fluency (category naming concepts)',
      'phonemic fluency (letter-based retrieval)',
      'naming and word-finding',
      'sentence comprehension',
      'verbal reasoning and inference'
    ],
    ageAdjustments: {
      '18-40': 'Advanced vocabulary, idioms, complex syntax',
      '41-60': 'Professional terminology, nuanced comprehension',
      '61-75': 'Common vocabulary, clear context, familiar expressions',
      '76+': 'High-frequency words, simple sentences, concrete concepts'
    }
  },
  functional: {
    name: 'Functional Assessment',
    standard: 'IADL Scale / FAQ',
    description: 'Connects cognitive abilities to real-world daily functioning',
    questionTypes: [
      'financial management (bills, transactions, budgeting)',
      'medication management (scheduling, compliance)',
      'transportation and navigation',
      'household management (cooking, cleaning, maintenance)',
      'technology use and communication'
    ],
    ageAdjustments: {
      '18-40': 'Complex financial decisions, career management, digital tasks',
      '41-60': 'Family coordination, work-life balance, health management',
      '61-75': 'Retirement planning, health appointments, grandparenting tasks',
      '76+': 'Basic daily activities, safety awareness, support seeking'
    }
  }
};

// Education-based vocabulary and complexity adjustments
const EDUCATION_LEVELS = {
  'elementary': { vocabularyLevel: 'basic', sentenceComplexity: 'simple', abstractionLevel: 'concrete' },
  'high-school': { vocabularyLevel: 'intermediate', sentenceComplexity: 'moderate', abstractionLevel: 'semi-abstract' },
  'bachelors': { vocabularyLevel: 'advanced', sentenceComplexity: 'complex', abstractionLevel: 'abstract' },
  'masters': { vocabularyLevel: 'sophisticated', sentenceComplexity: 'complex', abstractionLevel: 'highly-abstract' },
  'doctorate': { vocabularyLevel: 'specialized', sentenceComplexity: 'complex', abstractionLevel: 'theoretical' }
};

// Get age bracket for adjustments
const getAgeBracket = (age) => {
  const numAge = parseInt(age, 10);
  if (numAge <= 40) return '18-40';
  if (numAge <= 60) return '41-60';
  if (numAge <= 75) return '61-75';
  return '76+';
};

// Build comprehensive MoCA-aligned prompt
const buildPrompt = ({ name, age, gender, occupation, education, language, handedness, medicalFlags }) => {
  const ageBracket = getAgeBracket(age);
  const eduLevel = EDUCATION_LEVELS[education] || EDUCATION_LEVELS['high-school'];
  
  const profileDetails = [
    `Patient: ${name || 'Anonymous'}`,
    `Age: ${age} years (${ageBracket} bracket)`,
    `Gender: ${gender || 'not specified'}`,
    `Education: ${education || 'high-school'} level`,
    `Occupation: ${occupation || 'not specified'}`,
    `Primary Language: ${language || 'English'}`,
    `Handedness: ${handedness || 'right'}`,
    medicalFlags?.length ? `Medical considerations: ${medicalFlags.join(', ')}` : ''
  ].filter(Boolean).join('\n');

  const domainInstructions = Object.entries(COGNITIVE_DOMAINS).map(([id, domain]) => {
    return `
### ${domain.name} (ID: ${id})
- Standard: ${domain.standard}
- Purpose: ${domain.description}
- Question types to include: ${domain.questionTypes.join('; ')}
- Age-specific adjustment (${ageBracket}): ${domain.ageAdjustments[ageBracket]}`;
  }).join('\n');

  return `You are an expert neuropsychologist creating a comprehensive cognitive assessment battery following MoCA (Montreal Cognitive Assessment) and MMSE (Mini-Mental State Examination) standards.

## PATIENT PROFILE
${profileDetails}

## ASSESSMENT REQUIREMENTS

### Vocabulary & Complexity Calibration
- Vocabulary level: ${eduLevel.vocabularyLevel}
- Sentence complexity: ${eduLevel.sentenceComplexity}  
- Abstraction level: ${eduLevel.abstractionLevel}

### Clinical Standards to Follow
1. **MoCA Standards**: Questions should mirror MoCA domains (visuospatial/executive, naming, memory, attention, language, abstraction, delayed recall, orientation)
2. **Age-Appropriate Norms**: Adjust difficulty based on age bracket. Older adults (65+) receive 1-2 point adjustment in scoring norms.
3. **Education Adjustment**: Lower education (<12 years) adds 1 point to MoCA total. Reflect appropriate vocabulary.
4. **Cultural Sensitivity**: Use culturally neutral content appropriate for the patient's background.

### Occupation-Specific Tailoring
For a ${occupation || 'general'} professional:
- Include domain-relevant scenarios (e.g., technical tasks for engineers, patient care for healthcare workers)
- Reference familiar work contexts in examples
- Adjust functional assessment to occupational demands

${medicalFlags?.includes('vision-impairment') ? '### Visual Impairment Accommodation\n- Avoid visually-dependent questions\n- Use verbal descriptions instead of diagrams\n- Emphasize auditory memory tasks' : ''}
${medicalFlags?.includes('hearing-impairment') ? '### Hearing Impairment Accommodation\n- Provide clear written instructions\n- Avoid questions requiring auditory processing\n- Use visual recognition tasks where possible' : ''}
${medicalFlags?.includes('motor-impairment') ? '### Motor Impairment Accommodation\n- Avoid timed motor tasks\n- Focus on verbal and cognitive responses\n- No drawing or writing-based assessments' : ''}

## COGNITIVE DOMAINS TO ASSESS
${domainInstructions}

## OUTPUT REQUIREMENTS

Generate EXACTLY 5 tests with the following specifications:

1. **Question Count**: Each test MUST have exactly 6 questions
2. **Difficulty Distribution**: 
   - 2 easy questions (foundational, most should answer correctly)
   - 2 medium questions (moderate challenge)
   - 2 hard questions (discriminating, fewer will answer correctly)
3. **Question Format**: MCQ only with exactly 4 options (A, B, C, D)
4. **Include difficulty field**: Each question must have "difficulty": "easy"|"medium"|"hard"
5. **Include domain tag**: Each question must have "cognitiveDomain": specific subdomain being tested
6. **MoCA Point Equivalent**: Include "mocaPoints": 1-3 based on complexity

## JSON SCHEMA (Return ONLY valid JSON, no markdown fences)

{
  "tests": [
    {
      "id": "global",
      "title": "Global Cognitive Screen",
      "description": "MoCA/MMSE-style standardized cognitive baseline assessment",
      "standard": "MoCA/MMSE",
      "questions": [
        {
          "id": "q1",
          "type": "mcq",
          "question": "...",
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
          "correctAnswer": "A) ...",
          "difficulty": "easy",
          "cognitiveDomain": "orientation",
          "mocaPoints": 1
        }
      ]
    }
  ],
  "metadata": {
    "patientAge": ${age},
    "ageBracket": "${ageBracket}",
    "educationLevel": "${education || 'high-school'}",
    "normativeAdjustment": "description of any scoring adjustments"
  }
}

IMPORTANT: 
- Questions must be clinically meaningful and discriminating
- Avoid obvious or trivial questions
- Ensure distractors (wrong options) are plausible but clearly incorrect
- Follow the specific age adjustments for the ${ageBracket} bracket
- Make questions personally relevant to a ${age}-year-old ${gender || 'person'} working as ${occupation || 'general professional'}`;
};

// Build prompt for adaptive single question generation
const buildAdaptivePrompt = ({ 
  profile, 
  currentDomain, 
  questionNumber, 
  previousPerformance, 
  askedQuestions,
  targetDifficulty 
}) => {
  const { name, age, gender, occupation, education } = profile;
  const ageBracket = getAgeBracket(age);
  const domain = COGNITIVE_DOMAINS[currentDomain];
  const eduLevel = EDUCATION_LEVELS[education] || EDUCATION_LEVELS['high-school'];

  const performanceSummary = previousPerformance ? 
    `Current performance: ${previousPerformance.correct}/${previousPerformance.total} correct (${Math.round(previousPerformance.correct/previousPerformance.total*100)}%)
     Recent trend: ${previousPerformance.recentTrend || 'stable'}
     Struggling domains: ${previousPerformance.strugglingAreas?.join(', ') || 'none identified'}` : 
    'First question - no prior performance data';

  return `You are generating a SINGLE adaptive cognitive assessment question following MoCA/MMSE standards.

## PATIENT CONTEXT
- Patient: ${name}, ${age} years old (${ageBracket} bracket), ${gender}
- Education: ${education || 'high-school'} (vocabulary: ${eduLevel.vocabularyLevel})
- Occupation: ${occupation}

## CURRENT ASSESSMENT STATE
- Domain: ${domain.name} (${currentDomain})
- Standard: ${domain.standard}
- Question number: ${questionNumber} of 6 in this domain
- Target difficulty: ${targetDifficulty} (based on adaptive algorithm)
- ${performanceSummary}

## QUESTIONS ALREADY ASKED (avoid repetition)
${askedQuestions?.length ? askedQuestions.map((q, i) => `${i+1}. ${q.substring(0, 100)}...`).join('\n') : 'None yet'}

## DOMAIN-SPECIFIC GUIDANCE
- Question types: ${domain.questionTypes.join('; ')}
- Age adjustment (${ageBracket}): ${domain.ageAdjustments[ageBracket]}

## ADAPTIVE DIFFICULTY RULES
${targetDifficulty === 'easy' ? 
  '- Generate a foundational question that most cognitively intact individuals should answer correctly\n- Use familiar contexts and straightforward language\n- Clear, unambiguous correct answer' :
  targetDifficulty === 'medium' ?
  '- Generate a moderately challenging question requiring active cognitive processing\n- Plausible distractors that require discrimination\n- Tests specific cognitive skill within the domain' :
  '- Generate a challenging discriminating question\n- Subtle distinctions between options\n- Requires integration of multiple cognitive processes\n- Only those with strong abilities in this domain will answer correctly'}

## OUTPUT (JSON only, no markdown)
{
  "question": {
    "id": "q${questionNumber}",
    "type": "mcq",
    "question": "...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correctAnswer": "A) ...",
    "difficulty": "${targetDifficulty}",
    "cognitiveDomain": "specific subdomain",
    "mocaPoints": 1-3,
    "rationale": "Brief explanation of what this question tests and why this difficulty"
  },
  "adaptiveMetadata": {
    "recommendedNextDifficulty": "easy|medium|hard based on expected performance",
    "domainCoverage": "which subdomain this covers"
  }
}`;
};

// Enhanced normalizeTests with difficulty and domain metadata
const normalizeTests = (tests, metadata = {}) => {
  if (!Array.isArray(tests)) return [];
  return tests.slice(0, 5).map((test, index) => {
    const domainInfo = COGNITIVE_DOMAINS[test.id] || {};
    return {
      id: test.id || `test-${index + 1}`,
      title: test.title || domainInfo.name || `Assessment ${index + 1}`,
      description: test.description || domainInfo.description || 'Personalized assessment based on profile context.',
      standard: test.standard || domainInfo.standard || 'MoCA-aligned',
      questions: Array.isArray(test.questions)
        ? test.questions.map((question, questionIndex) => {
          const type = 'mcq';
          const options = Array.isArray(question.options) ? question.options : [];
          const correctAnswer = question.correctAnswer ?? question.answer ?? '';
          return {
            ...question,
            id: question.id || `q${questionIndex + 1}`,
            type,
            options,
            correctAnswer,
            difficulty: question.difficulty || 'medium',
            cognitiveDomain: question.cognitiveDomain || test.id,
            mocaPoints: question.mocaPoints || 1,
          };
        })
        : [],
      metadata: {
        ...metadata,
        questionCount: test.questions?.length || 0,
      }
    };
  });
};

const extractJson = (text) => {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }
  return cleaned.slice(firstBrace, lastBrace + 1);
};

// Calculate adaptive difficulty based on performance
const calculateAdaptiveDifficulty = (performance) => {
  if (!performance || performance.total === 0) return 'medium';
  
  const accuracy = performance.correct / performance.total;
  const recentAccuracy = performance.recentCorrect !== undefined ? 
    performance.recentCorrect / Math.min(performance.total, 3) : accuracy;
  
  // Adaptive algorithm (simplified IRT-like)
  if (recentAccuracy >= 0.8) return 'hard';
  if (recentAccuracy >= 0.5) return 'medium';
  return 'easy';
};

// Generate full test set (enhanced)
exports.generateTests = async (req, res) => {
  try {
    const { profile } = req.body || {};
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ success: false, message: 'Profile details are required.' });
    }

    // Validate required fields
    const requiredFields = ['name', 'age', 'gender', 'occupation'];
    const missingFields = requiredFields.filter(field => !profile[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Assessment engine not configured.' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Migration for legacy users
    if (user.subscriptionTestsUsed === 0 && user.testsUsed > 0 && user.subscriptionTier !== 'free') {
      user.subscriptionTestsUsed = user.testsUsed;
      await user.save();
    }

    // 30-Day Reset Logic (Monthly allowance)
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const lastReset = user.subscriptionResetDate || user.createdAt || now;
    
    if (user.subscriptionTier !== 'free' && (now - lastReset) > thirtyDaysInMs) {
      user.subscriptionTestsUsed = 0;
      user.subscriptionResetDate = now;
      await user.save();
    }

    const limits = { free: 2, basic: 10, pro: Infinity };
    const tier = user.subscriptionTier;
    const currentUsage = tier === 'free' ? user.freeTestsUsed : user.subscriptionTestsUsed;
    const currentLimit = limits[tier] || 2;

    if (currentUsage >= currentLimit) {
      return res.status(403).json({ 
        success: false, 
        message: `Assessment limit reached for ${tier.toUpperCase()} plan (${currentUsage}/${currentLimit}). Please upgrade for more.` 
      });
    }

    const prompt = buildPrompt(profile);
    
    // Use Gemini 3.1 Flash Lite Preview (free tier)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 8192,
          }
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ success: false, message: 'Assessment engine failed to respond.' });
    }

    const jsonPayload = extractJson(text);
    if (!jsonPayload) {
      return res.status(500).json({ success: false, message: 'Assessment engine returned invalid data.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JSON parse error:', error.message, jsonPayload.substring(0, 500));
      return res.status(500).json({ success: false, message: 'Core logic error: invalid data format.' });
    }

    const tests = normalizeTests(parsed.tests, parsed.metadata);
    if (tests.length === 0) {
      return res.status(500).json({ success: false, message: 'Assessment engine did not return valid data.' });
    }

    // Increment the appropriate counter
    if (user.subscriptionTier === 'free') {
      user.freeTestsUsed += 1;
    } else {
      user.subscriptionTestsUsed += 1;
    }
    await user.save();

    return res.status(200).json({ 
      success: true, 
      tests,
      metadata: {
        ...parsed.metadata,
        generatedAt: new Date().toISOString(),
        patientProfile: {
          age: profile.age,
          ageBracket: getAgeBracket(profile.age),
          education: profile.education || 'high-school',
        }
      }
    });
  } catch (error) {
    console.error('Generate tests error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate tests.' });
  }
};

// Generate single adaptive question
exports.generateAdaptiveQuestion = async (req, res) => {
  try {
    const { profile, currentDomain, questionNumber, performance, askedQuestions } = req.body || {};
    
    if (!profile || !currentDomain) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile and currentDomain are required.' 
      });
    }

    if (!COGNITIVE_DOMAINS[currentDomain]) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid domain: ${currentDomain}. Valid domains: ${Object.keys(COGNITIVE_DOMAINS).join(', ')}` 
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Only check if free user has already used their trial when starting a NEW adaptive assessment (first domain, q1)
    const isFirstQuestionOfAssessment = (currentDomain === 'global' && (questionNumber === 1 || !questionNumber));
    
    if (user.subscriptionTier === 'free' && isFirstQuestionOfAssessment && user.hasUsedAdaptive) {
      return res.status(403).json({
        success: false,
        message: 'Free adaptive trial already used. Standard mode available for remaining tests.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Assessment engine not configured.' });
    }

    // Calculate target difficulty based on performance
    const targetDifficulty = calculateAdaptiveDifficulty(performance);
    
    const prompt = buildAdaptivePrompt({
      profile,
      currentDomain,
      questionNumber: questionNumber || 1,
      previousPerformance: performance,
      askedQuestions: askedQuestions || [],
      targetDifficulty
    });

    // Use Gemini 3.1 Flash Lite Preview (free tier)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('Gemini response:', JSON.stringify(data, null, 2));
      return res.status(500).json({ success: false, message: 'No response from AI.' });
    }

    const jsonPayload = extractJson(text);
    if (!jsonPayload) {
      return res.status(500).json({ success: false, message: 'Core logic response did not include valid JSON.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonPayload);
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Core logic response was not valid JSON.' });
    }

    const question = parsed.question;
    if (!question) {
      return res.status(500).json({ success: false, message: 'No question generated.' });
    }

    // Normalize question
    const normalizedQuestion = {
      ...question,
      id: question.id || `q${questionNumber || 1}`,
      type: 'mcq',
      options: Array.isArray(question.options) ? question.options : [],
      correctAnswer: question.correctAnswer || '',
      difficulty: question.difficulty || targetDifficulty,
      cognitiveDomain: question.cognitiveDomain || currentDomain,
      mocaPoints: question.mocaPoints || 1,
    };

    // Mark trial as used only on the very first question of the assessment successfully generated
    if (user.subscriptionTier === 'free' && isFirstQuestionOfAssessment) {
      user.hasUsedAdaptive = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      question: normalizedQuestion,
      adaptiveMetadata: {
        ...parsed.adaptiveMetadata,
        currentDifficulty: targetDifficulty,
        questionNumber: questionNumber || 1,
        domain: currentDomain,
      }
    });
  } catch (error) {
    console.error('Generate adaptive question error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate question.' });
  }
};

// Get cognitive domain information
exports.getCognitiveDomains = (req, res) => {
  return res.status(200).json({
    success: true,
    domains: Object.entries(COGNITIVE_DOMAINS).map(([id, domain]) => ({
      id,
      name: domain.name,
      standard: domain.standard,
      description: domain.description,
      questionTypes: domain.questionTypes,
    })),
    educationLevels: Object.keys(EDUCATION_LEVELS),
  });
};

// Calculate MoCA-equivalent score
exports.calculateMocaScore = (req, res) => {
  try {
    const { answers, tests, profile } = req.body || {};
    
    if (!answers || !tests) {
      return res.status(400).json({ success: false, message: 'Answers and tests are required.' });
    }

    const ageBracket = getAgeBracket(profile?.age || 65);
    const education = profile?.education || 'high-school';
    
    let totalMocaPoints = 0;
    let earnedMocaPoints = 0;
    const domainScores = {};

    tests.forEach(test => {
      const testAnswers = answers[test.id] || {};
      let domainEarned = 0;
      let domainTotal = 0;

      test.questions.forEach(question => {
        const userAnswer = testAnswers[question.id];
        const points = question.mocaPoints || 1;
        domainTotal += points;
        totalMocaPoints += points;

        if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()) {
          domainEarned += points;
          earnedMocaPoints += points;
        }
      });

      domainScores[test.id] = {
        earned: domainEarned,
        total: domainTotal,
        percentage: domainTotal > 0 ? Math.round((domainEarned / domainTotal) * 100) : 0,
      };
    });

    // Apply MoCA adjustments
    let adjustedScore = earnedMocaPoints;
    let adjustments = [];

    // Education adjustment (MoCA adds 1 point for ≤12 years education)
    if (education === 'elementary' || education === 'high-school') {
      adjustedScore += 1;
      adjustments.push('+1 for education level (≤12 years)');
    }

    // Normalize to 30-point MoCA scale
    const mocaEquivalent = Math.round((earnedMocaPoints / totalMocaPoints) * 30);
    const adjustedMocaEquivalent = Math.min(30, Math.round((adjustedScore / totalMocaPoints) * 30));

    // Interpretation based on MoCA cutoffs
    let interpretation;
    if (adjustedMocaEquivalent >= 26) {
      interpretation = 'Normal cognitive function';
    } else if (adjustedMocaEquivalent >= 18) {
      interpretation = 'Mild cognitive impairment (MCI) range - recommend follow-up assessment';
    } else if (adjustedMocaEquivalent >= 10) {
      interpretation = 'Moderate cognitive impairment - recommend comprehensive evaluation';
    } else {
      interpretation = 'Severe cognitive impairment - recommend urgent clinical evaluation';
    }

    return res.status(200).json({
      success: true,
      scores: {
        raw: {
          earned: earnedMocaPoints,
          total: totalMocaPoints,
          percentage: Math.round((earnedMocaPoints / totalMocaPoints) * 100),
        },
        mocaEquivalent: {
          raw: mocaEquivalent,
          adjusted: adjustedMocaEquivalent,
          adjustments,
          maxScore: 30,
        },
        byDomain: domainScores,
      },
      interpretation: {
        level: interpretation,
        ageBracket,
        educationLevel: education,
        note: 'This is a screening tool, not a diagnostic assessment. Please consult a healthcare professional for clinical interpretation.',
      },
    });
  } catch (error) {
    console.error('Calculate MoCA score error:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate score.' });
  }
};
