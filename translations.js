// Translations and Multilingual Support for Leonard Lee Resume
// Currently supports English with framework for additional languages

const translations = {
  en: {
    // Navigation and UI
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    
    // Agent Lee responses
    'agent.welcome': "What's good. I'm Agent Lee, your resume guide. I'll keep the tour smooth, sharp, and professional.",
    'agent.help': "I can walk you through Leonard's background, explain the resume structure, and answer questions about his projects or proof-of-work.",
    'agent.navigation': "Use the buttons above to start the tour, explain the current section, or ask me questions.",
    
    // Section titles
    'section.profile': 'Professional Profile',
    'section.experience': 'Professional Experience',
    'section.skills': 'Core Competencies',
    'section.projects': 'Featured Projects',
    'section.education': 'Education & Certifications',
    'section.agentlee': 'Agent Lee: AI Assistant',
    'section.rapidweb': 'RapidWebDevelop LLC',
    'section.leeway': 'LEEWAY™ Standards Framework',
    'section.philosophy': "Leonard's Philosophy",
    
    // Common phrases
    'common.readMore': 'Read More',
    'common.showLess': 'Show Less',
    'common.download': 'Download',
    'common.print': 'Print',
    'common.share': 'Share',
    'common.contact': 'Contact',
    
    // FAQ answers
    'faq.whatIsAgentLee': "Agent Lee is Leonard Lee's AI guide for this resume and the broader LeeWay ecosystem.",
    'faq.whatDoesAgentLeeDo': "Agent Lee provides voice navigation, interactive FAQ responses, resume narration, and a polished assistant experience built around Leonard's work.",
    'faq.whatIsRapidWebDevelop': "RapidWebDevelop LLC is a company founded by Leonard Lee that empowers artists with true digital ownership through single-file websites with no recurring fees.",
    'faq.whatIsLeeway': "LEEWAY stands for Logically Enhanced Web Engineering Architecture Yield - Leonard's governance framework for AI systems and web engineering.",
    'faq.howCanAgentLeeHelp': "Agent Lee can guide you through this resume, narrate content, answer questions about Leonard's experience, and explain his ecosystem in plain language.",
    'faq.aboutLeonardLee': "Leonard Lee is the founder of Leeway Innovations, creator of Agent Lee, and an AI systems architect with 15+ years of leadership and operations experience."
  }
};

// Current language setting
let currentLanguage = 'en';

// Translation utility functions
function translate(key, lang = currentLanguage) {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return value;
}

function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    updatePageText();
  }
}

function updatePageText() {
  // Update elements with data-translate attributes
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    element.textContent = translate(key);
  });
}

// Voice synthesis settings for different languages
const voiceSettings = {
  en: {
    rate: 0.92,
    pitch: 1.02,
    volume: 0.92,
    voiceName: 'Google US English' // Preferred voice if available
  }
};

function getVoiceSettings(lang = currentLanguage) {
  return voiceSettings[lang] || voiceSettings['en'];
}

// Enhanced Agent Lee responses with context
const contextualResponses = {
  profile: {
    intro: "This is Leonard Lee's professional profile. He's an experienced developer, entrepreneur, and operations leader who blends AI systems work with real-world execution.",
    skills: "Leonard's technical skills include HTML5, CSS3, JavaScript, React, Node.js, WebRTC, and voice-driven AI systems. He's also experienced in leadership, planning, and business operations."
  },
  
  agentlee: {
    intro: "Agent Lee is Leonard's AI assistant creation, designed to help users navigate digital platforms and provide a polished resume guide.",
    features: "Agent Lee offers voice navigation, resume narration, digital education, and a professional assistant experience with a smooth, modern tone."
  },
  
  rapidweb: {
    intro: "RapidWebDevelop LLC is Leonard's company focused on empowering independent artists with true digital ownership.",
    mission: "The company provides single-file websites with no recurring fees, ensuring artists keep 100% of their revenue."
  },
  
  leeway: {
    intro: "LEEWAY stands for Logically Enhanced Web Engineering Architecture Yield - Leonard's proprietary development framework.",
    pillars: "The framework includes Leadership Excellence, Engineering Precision, Ethical AI Development, Workflow Optimization, Adaptive Learning, and Yield Maximization."
  },
  
  experience: {
    intro: "Leonard has extensive experience from 2008 to present, including roles in operations, leadership, business ownership, and AI systems development.",
    highlights: "Key achievements include creating Agent Lee AI, developing the LEEWAY Standard, and turning operational discipline into usable technology."
  },
  
  projects: {
    intro: "Leonard's featured projects include Agent Lee, the LEEWAY Framework, Beast AI, DirectHealthCare2U, and a broad repository ecosystem.",
    technologies: "Projects utilize React, Node.js, WebRTC, IndexedDB, AI integration, voice systems, and governance-first architecture."
  }
};

function getContextualResponse(sectionId) {
  return contextualResponses[sectionId] || { intro: "This section contains important information about Leonard Lee's professional background." };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translations,
    translate,
    setLanguage,
    getVoiceSettings,
    getContextualResponse
  };
}
