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
    'agent.welcome': "Hello! I'm Agent Lee, your AI assistant for this resume.",
    'agent.help': "I can help you navigate through Leonard's professional background, explain his projects, or answer questions about his experience.",
    'agent.navigation': "Use the buttons above to start narration, read current section, or ask me questions.",
    
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
    'faq.whatIsAgentLee': "Agent Lee is an AI assistant created by Leonard Lee to help users navigate digital platforms, provide guidance, and represent businesses with the LEEWAY standards framework.",
    'faq.whatDoesAgentLeeDo': "Agent Lee provides voice navigation, interactive FAQ responses, digital education, and helps over 20 companies establish their digital presence.",
    'faq.whatIsRapidWebDevelop': "RapidWebDevelop LLC is a company founded by Leonard Lee that empowers artists with true digital ownership through single-file websites with no recurring fees.",
    'faq.whatIsLeeway': "LEEWAY stands for Logically Enhanced Web Engineering Architecture Yield - a proprietary framework for professional AI development and deployment.",
    'faq.howCanAgentLeeHelp': "Agent Lee can guide you through this resume, narrate content, answer questions about Leonard's experience, and provide information about his services.",
    'faq.aboutLeonardLee': "Leonard Lee is the founder of RapidWebDevelop LLC, creator of Agent Lee AI Assistant, and expert in the LEEWAY Standards Framework with 15+ years of experience in logistics and tech leadership."
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
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voiceName: 'Google US English' // Preferred voice if available
  }
};

function getVoiceSettings(lang = currentLanguage) {
  return voiceSettings[lang] || voiceSettings['en'];
}

// Enhanced Agent Lee responses with context
const contextualResponses = {
  profile: {
    intro: "This is Leonard Lee's professional profile. He's an experienced developer and entrepreneur with over 15 years in logistics, leadership, and community service.",
    skills: "Leonard's technical skills include HTML5, CSS3, JavaScript, React, Python, and Docker. He's also experienced in leadership, community outreach, and conflict resolution."
  },
  
  agentlee: {
    intro: "Agent Lee is Leonard's AI assistant creation, designed to help users navigate digital platforms and provide business representation.",
    features: "Agent Lee offers voice navigation, digital education, creative companionship, and business partnership services."
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
    intro: "Leonard has extensive experience from 2008 to present, including roles as Senior Developer, Owner/Manager, and Night Shift Driver Supervisor.",
    highlights: "Key achievements include creating Agent Lee AI, developing the LEEWAY Standard, and mentoring employees facing employment barriers."
  },
  
  projects: {
    intro: "Leonard's featured projects include AgentX23, DirectHealthCare2U, and various GitHub repositories.",
    technologies: "Projects utilize React, Python, FastAPI, Docker, AI integration, and healthcare technologies."
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
